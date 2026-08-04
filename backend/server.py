#!/usr/bin/env python3
"""Local API proxy for CodeMentor AI Tutor."""

from __future__ import annotations

import hashlib
import csv
import json
import os
import re
import sys
import threading
import time
import traceback
from collections import defaultdict, deque
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from secrets import compare_digest, token_urlsafe
from typing import Any
from urllib.parse import parse_qs, urlparse

from openai import OpenAI

from prompt import build_tutor_messages, is_solution_request


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = Path(__file__).resolve().parent


def load_env_file() -> None:
    private_root = ROOT_DIR.parent / f"{ROOT_DIR.name}_Private"
    for env_path in (
        private_root / ".env.local",
        private_root / "backend" / ".env.local",
        ROOT_DIR / ".env.local",
        BACKEND_DIR / ".env.local",
    ):
        if not env_path.exists():
            continue

        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


load_env_file()


def default_private_data_dir() -> Path:
    private_backend_dir = ROOT_DIR.parent / f"{ROOT_DIR.name}_Private" / "backend"
    if private_backend_dir.exists():
        return private_backend_dir / "private_data"
    return BACKEND_DIR / "private_data"

BASE_URL = os.getenv("AUTODL_BASE_URL", "https://www.autodl.art/api/v1")
MODEL = os.getenv("AI_MENTOR_MODEL", "DeepSeek-V4-Pro")
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8787"))
MAX_BODY_BYTES = int(os.getenv("MAX_BODY_BYTES", str(512 * 1024)))
HISTORY_CHAR_LIMIT = int(os.getenv("HISTORY_CHAR_LIMIT", "100000"))
ALLOWED_ORIGINS = {
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "https://wdqqdw.github.io").split(",")
    if origin.strip()
}
REQUIRE_BROWSER_ORIGIN = os.getenv("REQUIRE_BROWSER_ORIGIN", "true").lower() not in {"0", "false", "no"}
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "root")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
ADMIN_SESSION_TTL_SECONDS = int(os.getenv("ADMIN_SESSION_TTL_SECONDS", str(60 * 60 * 12)))
IMPERSONATION_SESSION_TTL_SECONDS = int(os.getenv("IMPERSONATION_SESSION_TTL_SECONDS", str(60 * 30)))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "20"))
SESSION_TTL_SECONDS = int(os.getenv("SESSION_TTL_SECONDS", str(60 * 60 * 24 * 30)))
MIN_PASSWORD_LENGTH = int(os.getenv("MIN_PASSWORD_LENGTH", "6"))
PASSWORD_HASH_ITERATIONS = int(os.getenv("PASSWORD_HASH_ITERATIONS", "260000"))
DEFAULT_TUTOR_MODE = "encouraging"
TUTOR_MODES = {
    "encouraging": "Encouraging Tutor",
    "neutral": "Neutral Tutor",
}
TUTOR_MODE_ALIASES = {
    "encouraging": "encouraging",
    "encourage": "encouraging",
    "positive": "encouraging",
    "neutral": "neutral",
    "plain": "neutral",
    "non_encouraging": "neutral",
    "not_encouraging": "neutral",
    "unencouraging": "neutral",
}
DEFAULT_SCAFFOLD_MODE = "fixed_low"
SCAFFOLD_MODES = {
    "fixed_low": "Fixed Low Scaffold",
    "fixed_high": "Fixed High Scaffold",
    "adaptive": "Adaptive Scaffold",
}
SCAFFOLD_MODE_ALIASES = {
    "fixed_low": "fixed_low",
    "low": "fixed_low",
    "question_only": "fixed_low",
    "fixed_high": "fixed_high",
    "high": "fixed_high",
    "code_repair": "fixed_high",
    "adaptive": "adaptive",
    "self_adaptive": "adaptive",
    "failure_adaptive": "adaptive",
}

HISTORY_DIR = BACKEND_DIR / "logs"
HISTORY_PATH = HISTORY_DIR / "tutor_history.jsonl"
PRIVATE_DATA_DIR = Path(os.getenv("CODEMENTOR_DATA_DIR", str(default_private_data_dir())))
USERS_PATH = PRIVATE_DATA_DIR / "users.json"
SESSIONS_PATH = PRIVATE_DATA_DIR / "sessions.json"
ADMIN_SESSIONS_PATH = PRIVATE_DATA_DIR / "admin_sessions.json"
USER_HISTORY_DIR = PRIVATE_DATA_DIR / "histories"
USER_ACTIVITY_DIR = PRIVATE_DATA_DIR / "activities"
ACCOUNT_SUMMARY_CSV_PATH = PRIVATE_DATA_DIR / "account_summary.csv"
ACCOUNT_METADATA_PATH = PRIVATE_DATA_DIR / "account_metadata.json"

USERNAME_RE = re.compile(r"^[A-Za-z0-9_.-]{3,32}$")
HISTORY_LOCK = threading.Lock()
DATA_LOCK = threading.RLock()
RATE_LIMIT_LOCK = threading.Lock()
RATE_LIMIT_BUCKETS: defaultdict[str, deque[float]] = defaultdict(deque)


def get_api_key() -> str:
    api_key = os.getenv("AUTODL_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing AUTODL_API_KEY. Set it before starting the backend.")
    return api_key


def get_client() -> OpenAI:
    return OpenAI(base_url=BASE_URL, api_key=get_api_key())


def json_bytes(payload: dict[str, Any]) -> bytes:
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_private_dirs() -> None:
    for path in (PRIVATE_DATA_DIR, USER_HISTORY_DIR, USER_ACTIVITY_DIR):
        path.mkdir(parents=True, exist_ok=True)
        try:
            os.chmod(path, 0o700)
        except OSError:
            pass


def read_json_file(path: Path, fallback: dict[str, Any]) -> dict[str, Any]:
    if not path.exists():
        return fallback

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return fallback


def write_json_file(path: Path, payload: dict[str, Any]) -> None:
    ensure_private_dirs()
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    temporary_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        os.chmod(temporary_path, 0o600)
    except OSError:
        pass
    temporary_path.replace(path)


def activity_score(entry: dict[str, Any]) -> tuple[int, int]:
    result = entry.get("result") if isinstance(entry.get("result"), dict) else {}
    test_state = entry.get("test_state") if isinstance(entry.get("test_state"), dict) else {}
    passed = safe_int(result.get("passed"), safe_int(test_state.get("passed")))
    total = safe_int(result.get("total"), safe_int(test_state.get("total")))
    return passed, total


def refresh_account_summary_csv() -> None:
    ensure_private_dirs()
    with DATA_LOCK:
        users = read_json_file(USERS_PATH, {"users": {}}).get("users", {})
        ensure_all_account_metadata(users)
        rows = []

        for user in sorted(users.values(), key=lambda item: str(item.get("username", "")).lower()):
            user_id = str(user.get("id", ""))
            entries = read_user_activity(user_id, limit=500000) if user_id else []
            event_counts: defaultdict[str, int] = defaultdict(int)
            best_passed = 0
            best_total = 0
            latest_problem = ""
            last_activity_at = ""

            for entry in entries:
                event_type = str(entry.get("event_type", "activity") or "activity")
                event_counts[event_type] += 1
                created_at = str(entry.get("created_at", ""))
                if created_at >= last_activity_at:
                    last_activity_at = created_at
                    problem = entry.get("problem") if isinstance(entry.get("problem"), dict) else {}
                    latest_problem = str(problem.get("englishName") or problem.get("id") or "")

                passed, total = activity_score(entry)
                if total and (best_total == 0 or passed / total > best_passed / best_total):
                    best_passed = passed
                    best_total = total

            best_percent = f"{(best_passed / best_total * 100):.1f}" if best_total else ""
            rows.append(
                {
                    "user_id": user_id,
                    "username": user.get("username", ""),
                    "tutor_mode": tutor_mode_for_user(user),
                    "tutor_mode_label": tutor_mode_label(tutor_mode_for_user(user)),
                    "scaffold_mode": scaffold_mode_for_user(user),
                    "scaffold_mode_label": scaffold_mode_label(scaffold_mode_for_user(user)),
                    "condition_key": user.get("condition_key", f"{tutor_mode_for_user(user)}:{scaffold_mode_for_user(user)}"),
                    "condition_label": user.get("condition_label", condition_label_for_user(user)),
                    "password_storage": "pbkdf2_sha256_hash_only",
                    "password_hash": user.get("password_hash", ""),
                    "created_at": user.get("created_at", ""),
                    "last_login_at": user.get("last_login_at", ""),
                    "last_activity_at": last_activity_at,
                    "total_events": len(entries),
                    "run_count": event_counts.get("run", 0),
                    "submit_count": event_counts.get("submit", 0),
                    "chat_count": event_counts.get("chat", 0),
                    "chat_error_count": event_counts.get("chat_error", 0),
                    "best_passed": best_passed or "",
                    "best_total": best_total or "",
                    "best_percent": best_percent,
                    "latest_problem": latest_problem,
                    "summary_updated_at": now_iso(),
                }
            )

        fieldnames = [
            "user_id",
            "username",
            "tutor_mode",
            "tutor_mode_label",
            "scaffold_mode",
            "scaffold_mode_label",
            "condition_key",
            "condition_label",
            "password_storage",
            "password_hash",
            "created_at",
            "last_login_at",
            "last_activity_at",
            "total_events",
            "run_count",
            "submit_count",
            "chat_count",
            "chat_error_count",
            "best_passed",
            "best_total",
            "best_percent",
            "latest_problem",
            "summary_updated_at",
        ]
        temporary_path = ACCOUNT_SUMMARY_CSV_PATH.with_suffix(".csv.tmp")
        with temporary_path.open("w", encoding="utf-8", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        try:
            os.chmod(temporary_path, 0o600)
        except OSError:
            pass
        temporary_path.replace(ACCOUNT_SUMMARY_CSV_PATH)


def normalize_username(username: str) -> str:
    return username.strip().lower()


def normalize_tutor_mode(value: Any) -> str:
    key = str(value or DEFAULT_TUTOR_MODE).strip().lower().replace("-", "_")
    if key not in TUTOR_MODE_ALIASES:
        raise ValueError("Tutor style must be encouraging or neutral.")
    return TUTOR_MODE_ALIASES[key]


def normalize_scaffold_mode(value: Any) -> str:
    key = str(value or DEFAULT_SCAFFOLD_MODE).strip().lower().replace("-", "_")
    if key not in SCAFFOLD_MODE_ALIASES:
        raise ValueError("Scaffold mode must be fixed_low, fixed_high, or adaptive.")
    return SCAFFOLD_MODE_ALIASES[key]


def tutor_mode_label(mode: Any) -> str:
    try:
        return TUTOR_MODES[normalize_tutor_mode(mode)]
    except ValueError:
        return TUTOR_MODES[DEFAULT_TUTOR_MODE]


def scaffold_mode_label(mode: Any) -> str:
    try:
        return SCAFFOLD_MODES[normalize_scaffold_mode(mode)]
    except ValueError:
        return SCAFFOLD_MODES[DEFAULT_SCAFFOLD_MODE]


def tutor_mode_for_user(user: dict[str, Any]) -> str:
    try:
        return normalize_tutor_mode(user.get("tutor_mode"))
    except ValueError:
        return DEFAULT_TUTOR_MODE


def scaffold_mode_for_user(user: dict[str, Any]) -> str:
    try:
        return normalize_scaffold_mode(user.get("scaffold_mode"))
    except ValueError:
        return DEFAULT_SCAFFOLD_MODE


def condition_label_for_user(user: dict[str, Any]) -> str:
    return f"{tutor_mode_label(tutor_mode_for_user(user))} / {scaffold_mode_label(scaffold_mode_for_user(user))}"


def choose_scaffold_mode_for_tutor(tutor_mode: Any, metadata: dict[str, Any] | None = None) -> str:
    clean_tutor_mode = tutor_mode_for_user({"tutor_mode": tutor_mode})
    metadata_store = metadata or read_json_file(ACCOUNT_METADATA_PATH, {"accounts": {}})
    accounts = metadata_store.get("accounts", {}) if isinstance(metadata_store, dict) else {}
    counts = {mode: 0 for mode in SCAFFOLD_MODES}

    for account in accounts.values() if isinstance(accounts, dict) else []:
        if not isinstance(account, dict):
            continue
        try:
            account_tutor_mode = normalize_tutor_mode(account.get("tutor_mode"))
            account_scaffold_mode = normalize_scaffold_mode(account.get("scaffold_mode"))
        except ValueError:
            continue
        if account_tutor_mode == clean_tutor_mode:
            counts[account_scaffold_mode] += 1

    return min(SCAFFOLD_MODES.keys(), key=lambda mode: (counts[mode], list(SCAFFOLD_MODES.keys()).index(mode)))


def ensure_account_metadata(user: dict[str, Any]) -> dict[str, Any]:
    user_id = str(user.get("id", "")).strip()
    username_key = str(user.get("username_key") or normalize_username(str(user.get("username", ""))))
    metadata_key = user_id or username_key
    if not metadata_key:
        return {}

    metadata_store = read_json_file(ACCOUNT_METADATA_PATH, {"version": 1, "accounts": {}})
    accounts = metadata_store.setdefault("accounts", {})
    existing = accounts.get(metadata_key)
    if isinstance(existing, dict) and existing.get("scaffold_mode"):
        for field in ("scaffold_mode", "scaffold_mode_label", "condition_key", "condition_label", "metadata_bound_at"):
            if existing.get(field):
                user[field] = existing[field]
        return existing

    tutor_mode = tutor_mode_for_user(user)
    scaffold_mode = scaffold_mode_for_user(user) if user.get("scaffold_mode") else choose_scaffold_mode_for_tutor(tutor_mode, metadata_store)
    condition_key = f"{tutor_mode}:{scaffold_mode}"
    bound_at = now_iso()
    entry = {
        "user_id": user_id,
        "username": user.get("username", ""),
        "username_key": username_key,
        "tutor_mode": tutor_mode,
        "tutor_mode_label": tutor_mode_label(tutor_mode),
        "scaffold_mode": scaffold_mode,
        "scaffold_mode_label": scaffold_mode_label(scaffold_mode),
        "condition_key": condition_key,
        "condition_label": f"{tutor_mode_label(tutor_mode)} / {scaffold_mode_label(scaffold_mode)}",
        "metadata_bound_at": bound_at,
        "created_at": user.get("created_at", bound_at),
        "last_login_at": user.get("last_login_at", ""),
        "updated_at": bound_at,
    }
    accounts[metadata_key] = entry
    metadata_store["updated_at"] = bound_at
    write_json_file(ACCOUNT_METADATA_PATH, metadata_store)

    user["scaffold_mode"] = scaffold_mode
    user["scaffold_mode_bound_at"] = bound_at
    user["scaffold_mode_label"] = entry["scaffold_mode_label"]
    user["condition_key"] = condition_key
    user["condition_label"] = entry["condition_label"]
    user["metadata_bound_at"] = bound_at
    return entry


def ensure_all_account_metadata(users: dict[str, Any]) -> None:
    changed = False
    for user in users.values():
        if not isinstance(user, dict):
            continue
        before = json.dumps(
            {
                "scaffold_mode": user.get("scaffold_mode"),
                "condition_key": user.get("condition_key"),
                "metadata_bound_at": user.get("metadata_bound_at"),
            },
            sort_keys=True,
        )
        ensure_account_metadata(user)
        after = json.dumps(
            {
                "scaffold_mode": user.get("scaffold_mode"),
                "condition_key": user.get("condition_key"),
                "metadata_bound_at": user.get("metadata_bound_at"),
            },
            sort_keys=True,
        )
        changed = changed or before != after

    if changed:
        write_json_file(USERS_PATH, {"users": users})


def update_account_metadata_login(user: dict[str, Any]) -> None:
    metadata_key = str(user.get("id") or user.get("username_key") or normalize_username(str(user.get("username", ""))))
    if not metadata_key:
        return

    metadata_store = read_json_file(ACCOUNT_METADATA_PATH, {"version": 1, "accounts": {}})
    accounts = metadata_store.setdefault("accounts", {})
    entry = accounts.get(metadata_key)
    if not isinstance(entry, dict):
        ensure_account_metadata(user)
        return

    entry["username"] = user.get("username", entry.get("username", ""))
    entry["username_key"] = user.get("username_key", entry.get("username_key", ""))
    entry["tutor_mode"] = tutor_mode_for_user(user)
    entry["tutor_mode_label"] = tutor_mode_label(tutor_mode_for_user(user))
    entry["last_login_at"] = user.get("last_login_at", "")
    entry["updated_at"] = now_iso()
    metadata_store["updated_at"] = entry["updated_at"]
    write_json_file(ACCOUNT_METADATA_PATH, metadata_store)


def solution_request_guardrail_reply(tutor_mode: Any, scaffold_mode: Any = DEFAULT_SCAFFOLD_MODE) -> str:
    mode = normalize_tutor_mode(tutor_mode)
    scaffold = normalize_scaffold_mode(scaffold_mode)
    if scaffold == "fixed_low":
        if mode == "neutral":
            return "不能提供完整代码、最终答案或可复制实现。当前只需要确认一个问题：搜索一条路径时，哪些状态表示这个格子已经被当前路径使用？"
        return "我不能提供完整代码、最终答案或可复制实现。先只看一个小问题：在搜索一条路径时，你觉得哪些状态能表示这个格子已经被当前路径使用？"

    if mode == "neutral":
        return (
            "代码、最终答案和详细实现结构不能提供。"
            "可以只做一个局部修复判断：路径推进前先确认目标位置合法、字符匹配且没有被本路径使用。"
            "路径推进和回退时，哪个状态最容易忘记恢复？"
        )

    return (
        "我理解你想直接看到答案，但我不能提供代码、最终答案或详细实现结构。"
        "可以先做一个很小的局部修复：每走一步前检查位置合法、字符匹配且没有在当前路径中用过。"
        "你已经接近核心了，回退时哪个状态最需要恢复？"
    )


def public_user(user: dict[str, Any]) -> dict[str, Any]:
    mode = tutor_mode_for_user(user)
    return {
        "id": user.get("id", ""),
        "username": user.get("username", ""),
        "created_at": user.get("created_at", ""),
        "tutor_mode": mode,
        "tutor_mode_label": tutor_mode_label(mode),
        "tutor_mode_locked": bool(user.get("tutor_mode")),
    }


def public_history_entry(entry: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": entry.get("id", ""),
        "created_at": entry.get("created_at", ""),
        "endpoint": entry.get("endpoint", ""),
        "model": entry.get("model", ""),
        "template_used": bool(entry.get("template_used")),
        "guardrail_used": bool(entry.get("guardrail_used")),
        "learner_request": trim_text(entry.get("learner_request"), 6000),
        "message": trim_text(entry.get("message"), 12000),
        "error": trim_text(entry.get("error"), 2000),
        "user_id": entry.get("user_id"),
        "username": entry.get("username"),
    }


def public_activity_entry(entry: dict[str, Any]) -> dict[str, Any]:
    clean_entry = dict(entry)
    for hidden_key in (
        "scaffold_mode",
        "scaffold_mode_label",
        "condition_key",
        "condition_label",
        "learner_state",
        "raw_prompt",
        "messages",
    ):
        clean_entry.pop(hidden_key, None)
    return clean_entry


def validate_credentials(username: str, password: str) -> tuple[str, str]:
    clean_username = username.strip()
    if not USERNAME_RE.match(clean_username):
        raise ValueError("Username must be 3-32 characters and use letters, numbers, dots, underscores, or hyphens.")

    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValueError(f"Password must be at least {MIN_PASSWORD_LENGTH} characters.")

    return clean_username, password


def hash_password(password: str) -> str:
    salt = token_urlsafe(18)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PASSWORD_HASH_ITERATIONS,
    ).hex()
    return f"pbkdf2_sha256${PASSWORD_HASH_ITERATIONS}${salt}${digest}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, iterations_raw, salt, expected_digest = password_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations_raw),
        ).hex()
        return compare_digest(digest, expected_digest)
    except (ValueError, TypeError):
        return False


def password_hash_preview(password_hash: Any) -> str:
    text = str(password_hash or "")
    if not text:
        return "missing"

    parts = text.split("$")
    if len(parts) == 4:
        return f"{parts[0]}${parts[1]}$...{parts[3][-10:]}"
    if len(text) <= 28:
        return text
    return f"{text[:18]}...{text[-8:]}"


def admin_password_is_configured() -> bool:
    return bool(ADMIN_PASSWORD_HASH.strip())


def create_admin_session() -> dict[str, Any]:
    token = token_urlsafe(36)
    session = {
        "token": token,
        "username": ADMIN_USERNAME,
        "created_at": now_iso(),
        "expires_at": time.time() + ADMIN_SESSION_TTL_SECONDS,
    }

    with DATA_LOCK:
        store = read_json_file(ADMIN_SESSIONS_PATH, {"sessions": {}})
        sessions = store.setdefault("sessions", {})
        sessions[token] = session
        write_json_file(ADMIN_SESSIONS_PATH, store)

    return session


def admin_session_for_token(token: str) -> dict[str, Any] | None:
    if not token:
        return None

    with DATA_LOCK:
        store = read_json_file(ADMIN_SESSIONS_PATH, {"sessions": {}})
        sessions = store.setdefault("sessions", {})
        session = sessions.get(token)
        if not session:
            return None

        if float(session.get("expires_at", 0)) < time.time():
            sessions.pop(token, None)
            write_json_file(ADMIN_SESSIONS_PATH, store)
            return None

        return {"token": token, "session": session}


def delete_admin_session(token: str) -> None:
    with DATA_LOCK:
        store = read_json_file(ADMIN_SESSIONS_PATH, {"sessions": {}})
        if token in store.get("sessions", {}):
            store["sessions"].pop(token, None)
            write_json_file(ADMIN_SESSIONS_PATH, store)


def create_user(username: str, password: str, tutor_mode: Any = DEFAULT_TUTOR_MODE) -> dict[str, Any]:
    clean_username, clean_password = validate_credentials(username, password)
    username_key = normalize_username(clean_username)
    clean_tutor_mode = normalize_tutor_mode(tutor_mode)

    with DATA_LOCK:
        store = read_json_file(USERS_PATH, {"users": {}})
        users = store.setdefault("users", {})
        if username_key in users:
            raise FileExistsError("Username already exists.")

        user = {
            "id": f"u_{token_urlsafe(16)}",
            "username": clean_username,
            "username_key": username_key,
            "password_hash": hash_password(clean_password),
            "tutor_mode": clean_tutor_mode,
            "tutor_mode_bound_at": now_iso(),
            "created_at": now_iso(),
            "last_login_at": now_iso(),
        }
        ensure_account_metadata(user)
        users[username_key] = user
        write_json_file(USERS_PATH, store)
        refresh_account_summary_csv()
        return user


def authenticate_user(username: str, password: str, tutor_mode: Any = None) -> dict[str, Any]:
    username_key = normalize_username(username)
    with DATA_LOCK:
        store = read_json_file(USERS_PATH, {"users": {}})
        user = store.get("users", {}).get(username_key)
        if not user or not verify_password(password, str(user.get("password_hash", ""))):
            raise PermissionError("Invalid username or password.")

        if not user.get("tutor_mode"):
            user["tutor_mode"] = normalize_tutor_mode(tutor_mode)
            user["tutor_mode_bound_at"] = now_iso()
        user["last_login_at"] = now_iso()
        ensure_account_metadata(user)
        update_account_metadata_login(user)
        write_json_file(USERS_PATH, store)
        refresh_account_summary_csv()
        return user


def ensure_user_tutor_mode(user: dict[str, Any], fallback: Any = DEFAULT_TUTOR_MODE) -> dict[str, Any]:
    if user.get("tutor_mode") and user.get("scaffold_mode"):
        return user

    user_id = str(user.get("id", ""))
    clean_tutor_mode = normalize_tutor_mode(fallback)
    with DATA_LOCK:
        store = read_json_file(USERS_PATH, {"users": {}})
        for stored_user in store.get("users", {}).values():
            if stored_user.get("id") == user_id:
                if not stored_user.get("tutor_mode"):
                    stored_user["tutor_mode"] = clean_tutor_mode
                    stored_user["tutor_mode_bound_at"] = now_iso()
                ensure_account_metadata(stored_user)
                write_json_file(USERS_PATH, store)
                refresh_account_summary_csv()
                user.update(stored_user)
                break
    return user


def create_session(
    user: dict[str, Any],
    ttl_seconds: int | None = None,
    session_type: str = "user",
) -> dict[str, Any]:
    token = token_urlsafe(32)
    ttl = SESSION_TTL_SECONDS if ttl_seconds is None else ttl_seconds
    session = {
        "token": token,
        "user_id": user["id"],
        "username": user["username"],
        "created_at": now_iso(),
        "expires_at": time.time() + ttl,
        "session_type": session_type,
    }

    with DATA_LOCK:
        store = read_json_file(SESSIONS_PATH, {"sessions": {}})
        sessions = store.setdefault("sessions", {})
        sessions[token] = session
        write_json_file(SESSIONS_PATH, store)

    return session


def delete_session(token: str) -> None:
    with DATA_LOCK:
        store = read_json_file(SESSIONS_PATH, {"sessions": {}})
        if token in store.get("sessions", {}):
            store["sessions"].pop(token, None)
            write_json_file(SESSIONS_PATH, store)


def find_user_by_id(user_id: str) -> dict[str, Any] | None:
    users = read_json_file(USERS_PATH, {"users": {}}).get("users", {})
    for user in users.values():
        if user.get("id") == user_id:
            return user
    return None


def find_user_by_username(username: str) -> dict[str, Any] | None:
    users = read_json_file(USERS_PATH, {"users": {}}).get("users", {})
    return users.get(normalize_username(username))


def session_for_token(token: str) -> dict[str, Any] | None:
    if not token:
        return None

    with DATA_LOCK:
        store = read_json_file(SESSIONS_PATH, {"sessions": {}})
        sessions = store.setdefault("sessions", {})
        session = sessions.get(token)
        if not session:
            return None

        if float(session.get("expires_at", 0)) < time.time():
            sessions.pop(token, None)
            write_json_file(SESSIONS_PATH, store)
            return None

        user = find_user_by_id(str(session.get("user_id", "")))
        if not user:
            sessions.pop(token, None)
            write_json_file(SESSIONS_PATH, store)
            return None

        return {"token": token, "user": user, "session": session}


def clean_messages(payload: dict[str, Any]) -> list[dict[str, str]]:
    raw_messages = payload.get("messages")
    if raw_messages is None:
        return build_tutor_messages(payload)

    if not isinstance(raw_messages, list) or not raw_messages:
        raise ValueError("'messages' must be a non-empty list.")

    allowed_roles = {"system", "user", "assistant"}
    messages: list[dict[str, str]] = []

    for item in raw_messages:
        if not isinstance(item, dict):
            raise ValueError("Each message must be an object.")

        role = str(item.get("role", "user")).strip()
        content = str(item.get("content", "")).strip()
        if role not in allowed_roles:
            raise ValueError(f"Unsupported role: {role}")
        if not content:
            raise ValueError("Message content cannot be empty.")

        messages.append({"role": role, "content": content})

    return messages


def stream_chat_text(messages: list[dict[str, str]]) -> str:
    client = get_client()
    chunks: list[str] = []
    stream = client.chat.completions.create(model=MODEL, messages=messages, stream=True)

    for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            chunks.append(chunk.choices[0].delta.content)

    return "".join(chunks)


def normalize_tutor_reply(content: str) -> str:
    text = str(content or "").strip()
    if "```" in text:
        return text
    lines = [line.strip().lstrip("-*0123456789.、 ") for line in text.splitlines() if line.strip()]
    return re.sub(r"[ \t]{2,}", " ", " ".join(lines)).strip()


def tutor_reply_fallback(tutor_mode: Any, scaffold_mode: Any, learner_state: dict[str, Any] | None = None) -> str:
    mode = normalize_tutor_mode(tutor_mode)
    scaffold = normalize_scaffold_mode(scaffold_mode)
    state = learner_state if isinstance(learner_state, dict) else {}
    consecutive_failures = safe_int(state.get("consecutive_failed_attempts"))

    if scaffold == "fixed_low" or (scaffold == "adaptive" and consecutive_failures < 3):
        if mode == "neutral":
            return "这题的核心是路径搜索中的状态一致性。当前路径前进和回退时，哪些信息必须同步变化，才能避免重复使用同一格？"
        return "先抓住一个核心：路径搜索时状态要前进和回退都一致。你能检查当前路径里哪些信息必须同步变化，才不会重复使用同一格吗？"

    if mode == "neutral":
        return "当前失败更像局部状态或边界处理问题。先把修复集中在一个点：读取邻居前确认行列仍在棋盘内，递归返回后立刻撤销本路径的访问标记。检查这两处是否成对出现。"
    return "你已经有可调试的方向了，当前失败更像局部状态或边界处理问题。先只修一个点：读取邻居前确认行列在棋盘内，递归返回后立刻撤销本路径的访问标记。你可以检查这两处是否成对出现。"


def tutor_reply_needs_fallback(content: str, scaffold_mode: Any, learner_state: dict[str, Any] | None = None) -> bool:
    text = str(content or "")
    scaffold = normalize_scaffold_mode(scaffold_mode)
    state = learner_state if isinstance(learner_state, dict) else {}
    consecutive_failures = safe_int(state.get("consecutive_failed_attempts"))
    low_support = scaffold == "fixed_low" or (scaffold == "adaptive" and consecutive_failures < 3)
    question_count = text.count("？") + text.count("?")
    code_markers = [
        "```",
        "`",
        ";",
        " for ",
        " while ",
        " in range",
        "def ",
        "class ",
        "import ",
        "return ",
        "continue",
        "break",
        "pass",
        ".add(",
        ".remove(",
        "board[",
        "visited[",
        "prefixes =",
        "print(",
        "例如",
        "打印",
        "写一行",
        "这一行",
        "那一行",
    ]

    if "\n" in text:
        return True
    if low_support:
        return question_count != 1 or any(marker in text for marker in code_markers) or len(text) > 115

    dangerous_code_detail = any(marker in text for marker in code_markers)
    return len(text) > 145 or dangerous_code_detail


def format_raw_prompt(messages: list[dict[str, str]]) -> str:
    return "\n\n".join(f"[{item['role']}]\n{item['content']}" for item in messages)


def history_entry_size(entry: dict[str, Any]) -> int:
    parts = [
        str(entry.get("raw_prompt", "")),
        str(entry.get("message", "")),
        str(entry.get("error", "")),
    ]
    return sum(len(part) for part in parts)


def activity_entry_size(entry: dict[str, Any]) -> int:
    return len(json.dumps(entry, ensure_ascii=False))


def append_jsonl(path: Path, entry: dict[str, Any], lock: threading.Lock | threading.RLock) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with lock:
        with path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(entry, ensure_ascii=False) + "\n")
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass


def append_history(entry: dict[str, Any]) -> None:
    append_jsonl(HISTORY_PATH, entry, HISTORY_LOCK)


def user_history_path(user_id: str) -> Path:
    safe_user_id = re.sub(r"[^A-Za-z0-9_.-]", "_", user_id)
    return USER_HISTORY_DIR / f"{safe_user_id}.jsonl"


def user_activity_path(user_id: str) -> Path:
    safe_user_id = re.sub(r"[^A-Za-z0-9_.-]", "_", user_id)
    return USER_ACTIVITY_DIR / f"{safe_user_id}.jsonl"


def append_user_history(user_id: str, entry: dict[str, Any]) -> None:
    ensure_private_dirs()
    append_jsonl(user_history_path(user_id), entry, DATA_LOCK)
    refresh_account_summary_csv()


def append_user_activity(user_id: str, entry: dict[str, Any]) -> None:
    ensure_private_dirs()
    append_jsonl(user_activity_path(user_id), entry, DATA_LOCK)
    refresh_account_summary_csv()


def read_jsonl_history(path: Path, limit: int = HISTORY_CHAR_LIMIT) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    lines = path.read_text(encoding="utf-8").splitlines()
    entries: list[dict[str, Any]] = []
    total = 0
    for line in reversed(lines):
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue

        size = history_entry_size(entry)
        if entries and total + size > limit:
            break
        entries.append(entry)
        total += size

    entries.reverse()
    return entries


def read_jsonl_entries(path: Path, limit: int = HISTORY_CHAR_LIMIT, size_fn=activity_entry_size) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    lines = path.read_text(encoding="utf-8").splitlines()
    entries: list[dict[str, Any]] = []
    total = 0
    for line in reversed(lines):
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue

        size = size_fn(entry)
        if entries and total + size > limit:
            break
        entries.append(entry)
        total += size

    entries.reverse()
    return entries


def read_history(limit: int = HISTORY_CHAR_LIMIT) -> list[dict[str, Any]]:
    with HISTORY_LOCK:
        return read_jsonl_history(HISTORY_PATH, limit)


def read_user_history(user_id: str, limit: int = HISTORY_CHAR_LIMIT) -> list[dict[str, Any]]:
    with DATA_LOCK:
        entries = read_jsonl_history(user_history_path(user_id), limit)

    public_entries = []
    for entry in entries:
        public_entries.append(
            {
                "id": entry.get("id", ""),
                "created_at": entry.get("created_at", ""),
                "model": entry.get("model", ""),
                "learner_request": entry.get("learner_request", ""),
                "message": entry.get("message", ""),
                "error": entry.get("error", ""),
            }
        )
    return public_entries


def read_user_activity(user_id: str, limit: int = HISTORY_CHAR_LIMIT) -> list[dict[str, Any]]:
    with DATA_LOCK:
        activity_entries = read_jsonl_entries(user_activity_path(user_id), limit)
        legacy_history_entries = read_jsonl_history(user_history_path(user_id), limit)

    existing_chat_keys = {
        chat_activity_key(entry)
        for entry in activity_entries
        if entry.get("event_type") in {"chat", "chat_error"} and chat_activity_key(entry)
    }
    merged_entries = list(activity_entries)

    for history_entry in legacy_history_entries:
        legacy_activity = legacy_history_entry_to_activity(history_entry)
        key = chat_activity_key(legacy_activity)
        if key and key in existing_chat_keys:
            continue
        merged_entries.append(legacy_activity)
        if key:
            existing_chat_keys.add(key)

    merged_entries.sort(key=lambda entry: str(entry.get("created_at", "")))
    total = 0
    limited: list[dict[str, Any]] = []
    for entry in reversed(merged_entries):
        size = activity_entry_size(entry)
        if limited and total + size > limit:
            break
        limited.append(entry)
        total += size

    limited.reverse()
    return limited


def learning_state_for_user(user: dict[str, Any]) -> dict[str, Any]:
    user_id = str(user.get("id", ""))
    if not user_id:
        return {
            "attempt_count": 0,
            "failed_attempt_count": 0,
            "consecutive_failed_attempts": 0,
            "latest_passed": 0,
            "latest_total": 0,
            "latest_percent": None,
            "latest_event_type": "",
        }

    entries = read_user_activity(user_id, limit=500000)
    assessment_entries = [
        entry
        for entry in entries
        if entry.get("event_type") in {"run", "submit"}
    ]
    failed_attempt_count = 0
    consecutive_failed_attempts = 0
    latest_passed = 0
    latest_total = 0
    latest_event_type = ""
    latest_percent: float | None = None

    for entry in assessment_entries:
        passed, total = activity_score(entry)
        if total and passed < total:
            failed_attempt_count += 1

    for entry in reversed(assessment_entries):
        passed, total = activity_score(entry)
        if not total:
            continue
        latest_passed = passed
        latest_total = total
        latest_event_type = str(entry.get("event_type", ""))
        latest_percent = round(passed / total * 100, 1) if total else None
        if passed >= total:
            break
        consecutive_failed_attempts += 1

    return {
        "attempt_count": len(assessment_entries),
        "failed_attempt_count": failed_attempt_count,
        "consecutive_failed_attempts": consecutive_failed_attempts,
        "latest_passed": latest_passed,
        "latest_total": latest_total,
        "latest_percent": latest_percent,
        "latest_event_type": latest_event_type,
    }


def summarize_user_account(user: dict[str, Any]) -> dict[str, Any]:
    user_id = str(user.get("id", ""))
    entries = read_user_activity(user_id, limit=500000) if user_id else []
    event_counts: defaultdict[str, int] = defaultdict(int)
    best_passed = 0
    best_total = 0
    latest_problem = ""
    first_activity_at = ""
    last_activity_at = ""

    for entry in entries:
        event_type = str(entry.get("event_type", "activity") or "activity")
        event_counts[event_type] += 1

        created_at = str(entry.get("created_at", ""))
        if created_at and (not first_activity_at or created_at < first_activity_at):
            first_activity_at = created_at
        if created_at and created_at >= last_activity_at:
            last_activity_at = created_at
            problem = entry.get("problem") if isinstance(entry.get("problem"), dict) else {}
            latest_problem = str(problem.get("englishName") or problem.get("id") or "")

        passed, total = activity_score(entry)
        if total and (best_total == 0 or passed / total > best_passed / best_total):
            best_passed = passed
            best_total = total

    best_percent = round(best_passed / best_total * 100, 1) if best_total else None
    mode = tutor_mode_for_user(user)
    scaffold = scaffold_mode_for_user(user)
    return {
        "user_id": user_id,
        "username": user.get("username", ""),
        "created_at": user.get("created_at", ""),
        "last_login_at": user.get("last_login_at", ""),
        "first_activity_at": first_activity_at,
        "last_activity_at": last_activity_at,
        "tutor_mode": mode,
        "tutor_mode_label": tutor_mode_label(mode),
        "scaffold_mode": scaffold,
        "scaffold_mode_label": scaffold_mode_label(scaffold),
        "condition_key": user.get("condition_key", f"{mode}:{scaffold}"),
        "condition_label": user.get("condition_label", condition_label_for_user(user)),
        "total_events": len(entries),
        "run_count": event_counts.get("run", 0),
        "submit_count": event_counts.get("submit", 0),
        "chat_count": event_counts.get("chat", 0),
        "chat_error_count": event_counts.get("chat_error", 0),
        "best_passed": best_passed if best_total else None,
        "best_total": best_total if best_total else None,
        "best_percent": best_percent,
        "latest_problem": latest_problem,
        "password_storage": "pbkdf2_sha256_hash_only",
        "password_hash_preview": password_hash_preview(user.get("password_hash")),
        "password_note": "Plaintext passwords are not stored. Existing passwords are irreversible hashes.",
    }


def trim_text(value: Any, limit: int = 20000) -> str:
    text = "" if value is None else str(value)
    if len(text) <= limit:
        return text
    return text[:limit] + "\n... [truncated]"


def safe_int(value: Any, fallback: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


def pick_dict(value: Any, allowed_keys: set[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        return {}
    return {key: value.get(key) for key in allowed_keys if key in value}


def sanitize_code_state(value: Any) -> dict[str, Any]:
    code = value if isinstance(value, dict) else {}
    return {
        "language": trim_text(code.get("language"), 40),
        "source": trim_text(code.get("source"), 30000),
        "status": trim_text(code.get("status"), 300),
        "output": trim_text(code.get("output"), 4000),
        "traceback": trim_text(code.get("traceback"), 12000),
    }


def sanitize_test_state(value: Any) -> dict[str, Any]:
    state = value if isinstance(value, dict) else {}
    visible = []
    for item in state.get("visible", []) if isinstance(state.get("visible"), list) else []:
        if not isinstance(item, dict):
            continue
        visible.append(
            {
                "index": item.get("index"),
                "passed": bool(item.get("passed")),
                "input": trim_text(item.get("input"), 2000),
                "expected": trim_text(item.get("expected"), 2000),
                "actual": trim_text(item.get("actual"), 2000),
            }
        )

    hidden = state.get("hidden") if isinstance(state.get("hidden"), dict) else {}
    return {
        "scope": trim_text(state.get("scope"), 40) or "none",
        "passed": safe_int(state.get("passed")),
        "total": safe_int(state.get("total")),
        "visible": visible[:10],
        "hidden": {
            "total": safe_int(hidden.get("total")),
            "passed": safe_int(hidden.get("passed")),
            "failed": safe_int(hidden.get("failed")),
        },
    }


def sanitize_problem(value: Any) -> dict[str, Any]:
    problem = pick_dict(
        value,
        {
            "id",
            "category",
            "difficulty",
            "englishName",
            "chineseName",
            "englishDescription",
        },
    )
    for key, item in list(problem.items()):
        problem[key] = trim_text(item, 1000)
    return problem


def build_activity_entry(user: dict[str, Any], payload: dict[str, Any], event_type: str | None = None) -> dict[str, Any]:
    clean_event_type = trim_text(event_type or payload.get("event_type") or payload.get("eventType"), 40) or "activity"
    if clean_event_type not in {"run", "submit", "chat", "chat_error", "activity"}:
        clean_event_type = "activity"

    chat = payload.get("chat") if isinstance(payload.get("chat"), dict) else {}
    result = payload.get("result") if isinstance(payload.get("result"), dict) else {}
    entry = {
        "id": f"{int(time.time() * 1000)}-{threading.get_ident()}",
        "created_at": now_iso(),
        "client_created_at": trim_text(payload.get("client_created_at") or payload.get("clientCreatedAt"), 80),
        "event_type": clean_event_type,
        "user_id": user.get("id"),
        "username": user.get("username"),
        "tutor_mode": tutor_mode_for_user(user),
        "problem": sanitize_problem(payload.get("problem")),
        "code": sanitize_code_state(payload.get("code")),
        "test_state": sanitize_test_state(payload.get("testState") or payload.get("test_state")),
        "result": {
            "passed": safe_int(result.get("passed")),
            "total": safe_int(result.get("total")),
            "all_passed": bool(result.get("all_passed") or result.get("allPassed")),
            "label": trim_text(result.get("label"), 120),
            "scope": trim_text(result.get("scope"), 40),
            "error": trim_text(result.get("error"), 12000),
        },
        "chat": {
            "learner_message": trim_text(chat.get("learner_message") or payload.get("message"), 6000),
            "tutor_reply": trim_text(chat.get("tutor_reply"), 12000),
            "error": trim_text(chat.get("error"), 2000),
        },
    }
    return entry


def legacy_history_entry_to_activity(entry: dict[str, Any]) -> dict[str, Any]:
    event_type = "chat_error" if entry.get("error") else "chat"
    return {
        "id": f"legacy-{entry.get('id', token_urlsafe(8))}",
        "created_at": entry.get("created_at", now_iso()),
        "client_created_at": "",
        "event_type": event_type,
        "legacy": True,
        "user_id": entry.get("user_id"),
        "username": entry.get("username"),
        "problem": {
            "id": "legacy-tutor-chat",
            "englishName": "Legacy Tutor Chat",
            "chineseName": "历史 AI Tutor 对话",
        },
        "code": {
            "language": "",
            "source": "",
            "status": "",
            "output": "",
            "traceback": "",
        },
        "test_state": {
            "scope": "legacy",
            "passed": 0,
            "total": 0,
            "visible": [],
            "hidden": {
                "total": 0,
                "passed": 0,
                "failed": 0,
            },
        },
        "result": {
            "passed": 0,
            "total": 0,
            "all_passed": False,
            "label": "Legacy chat",
            "scope": "legacy",
            "error": trim_text(entry.get("error"), 2000),
        },
        "chat": {
            "learner_message": trim_text(entry.get("learner_request"), 6000),
            "tutor_reply": trim_text(entry.get("message"), 12000),
            "error": trim_text(entry.get("error"), 2000),
        },
    }


def chat_activity_key(entry: dict[str, Any]) -> tuple[str, str, str] | None:
    chat = entry.get("chat") if isinstance(entry.get("chat"), dict) else {}
    learner = str(chat.get("learner_message", "")).strip()
    tutor = str(chat.get("tutor_reply", "")).strip()
    error = str(chat.get("error", "")).strip()
    if not learner and not tutor and not error:
        return None
    return (learner, tutor, error)


def learner_request_from_payload(payload: dict[str, Any], messages: list[dict[str, str]]) -> str:
    message = str(payload.get("message", "")).strip()
    if message:
        return message

    for item in reversed(messages):
        if item.get("role") == "user":
            return item.get("content", "")

    return ""


def request_origin_is_allowed(origin: str) -> bool:
    return origin.rstrip("/") in ALLOWED_ORIGINS


def client_identifier(handler: BaseHTTPRequestHandler) -> str:
    forwarded_for = handler.headers.get("CF-Connecting-IP") or handler.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    real_ip = handler.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()

    return handler.client_address[0] if handler.client_address else "unknown"


def rate_limit_check(key: str) -> tuple[bool, int]:
    now = time.time()
    with RATE_LIMIT_LOCK:
        bucket = RATE_LIMIT_BUCKETS[key]
        while bucket and now - bucket[0] > RATE_LIMIT_WINDOW_SECONDS:
            bucket.popleft()

        if len(bucket) >= RATE_LIMIT_REQUESTS:
            retry_after = max(1, int(RATE_LIMIT_WINDOW_SECONDS - (now - bucket[0])))
            return False, retry_after

        bucket.append(now)
        return True, 0


class TutorHandler(BaseHTTPRequestHandler):
    server_version = "CodeMentorLocalBackend/0.2"

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def end_headers(self) -> None:
        origin = self.headers.get("Origin", "").rstrip("/")
        if origin and request_origin_is_allowed(origin):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")

        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        super().end_headers()

    def send_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json_bytes(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > MAX_BODY_BYTES:
            raise ValueError("Request body is empty or too large.")

        payload = json.loads(self.rfile.read(length).decode("utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("Request body must be a JSON object.")
        return payload

    def do_OPTIONS(self) -> None:
        origin = self.headers.get("Origin", "").rstrip("/")
        if origin and not request_origin_is_allowed(origin):
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "Origin not allowed."})
            return

        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def request_has_allowed_origin(self) -> bool:
        origin = self.headers.get("Origin", "").rstrip("/")
        if not origin:
            if REQUIRE_BROWSER_ORIGIN:
                self.send_json(HTTPStatus.FORBIDDEN, {"error": "Browser Origin header is required."})
                return False
            return True

        if not request_origin_is_allowed(origin):
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "Origin not allowed."})
            return False

        return True

    def request_has_admin_token(self) -> bool:
        token = self.headers.get("X-Admin-Token", "")
        return bool(ADMIN_TOKEN) and compare_digest(token, ADMIN_TOKEN)

    def admin_context(self) -> dict[str, Any] | None:
        authorization = self.headers.get("Authorization", "")
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer" or not token:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Root login required."})
            return None

        context = admin_session_for_token(token.strip())
        if not context:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Admin session expired. Please log in again."})
            return None

        return context

    def auth_context(self) -> dict[str, Any] | None:
        authorization = self.headers.get("Authorization", "")
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer" or not token:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Login required."})
            return None

        context = session_for_token(token.strip())
        if not context:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Session expired. Please log in again."})
            return None

        return context

    def enforce_rate_limit(self, suffix: str = "") -> bool:
        key = client_identifier(self)
        if suffix:
            key = f"{key}:{suffix}"

        ok, retry_after = rate_limit_check(key)
        if ok:
            return True

        self.send_response(HTTPStatus.TOO_MANY_REQUESTS)
        self.send_header("Retry-After", str(retry_after))
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json_bytes({"error": "Too many requests. Please wait and try again."}))
        return False

    def handle_register(self) -> None:
        if not self.request_has_allowed_origin() or not self.enforce_rate_limit("auth"):
            return

        payload = self.read_json_body()
        try:
            user = create_user(
                str(payload.get("username", "")),
                str(payload.get("password", "")),
                payload.get("tutor_mode") or payload.get("tutorMode"),
            )
            session = create_session(user)
            self.send_json(HTTPStatus.CREATED, {"token": session["token"], "user": public_user(user)})
        except FileExistsError as error:
            self.send_json(HTTPStatus.CONFLICT, {"error": str(error)})
        except ValueError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})

    def handle_login(self) -> None:
        if not self.request_has_allowed_origin() or not self.enforce_rate_limit("auth"):
            return

        payload = self.read_json_body()
        try:
            user = authenticate_user(
                str(payload.get("username", "")),
                str(payload.get("password", "")),
                payload.get("tutor_mode") or payload.get("tutorMode"),
            )
            session = create_session(user)
            self.send_json(HTTPStatus.OK, {"token": session["token"], "user": public_user(user)})
        except PermissionError as error:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": str(error)})
        except ValueError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})

    def handle_admin_login(self) -> None:
        if not self.request_has_allowed_origin() or not self.enforce_rate_limit("admin-auth"):
            return

        if not admin_password_is_configured():
            self.send_json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "Admin password hash is not configured."})
            return

        payload = self.read_json_body()
        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        if not compare_digest(username, ADMIN_USERNAME) or not verify_password(password, ADMIN_PASSWORD_HASH):
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Invalid root username or password."})
            return

        session = create_admin_session()
        self.send_json(
            HTTPStatus.OK,
            {
                "token": session["token"],
                "admin": {"username": ADMIN_USERNAME},
                "expires_at": session["expires_at"],
            },
        )

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/health":
            self.send_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "model": MODEL,
                    "history_char_limit": HISTORY_CHAR_LIMIT,
                    "auth": True,
                    "activity": True,
                    "admin_auth": admin_password_is_configured(),
                    "scaffold_conditions": True,
                },
            )
            return

        if path == "/api/history":
            if not self.request_has_admin_token():
                self.send_json(HTTPStatus.FORBIDDEN, {"error": "Admin token required."})
                return

            query = parse_qs(urlparse(self.path).query)
            limit = int(query.get("limit", [str(HISTORY_CHAR_LIMIT)])[0])
            entries = read_history(max(1000, min(limit, 500000)))
            self.send_json(
                HTTPStatus.OK,
                {
                    "entries": entries,
                    "count": len(entries),
                    "char_limit": limit,
                    "stored_at": str(HISTORY_PATH),
                },
            )
            return

        if path == "/api/me":
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return
            self.send_json(HTTPStatus.OK, {"user": public_user(context["user"])})
            return

        if path == "/api/admin/accounts":
            if not self.request_has_allowed_origin():
                return
            if not self.admin_context():
                return

            refresh_account_summary_csv()
            users = read_json_file(USERS_PATH, {"users": {}}).get("users", {})
            accounts = [
                summarize_user_account(user)
                for user in sorted(users.values(), key=lambda item: str(item.get("username", "")).lower())
            ]
            self.send_json(
                HTTPStatus.OK,
                {
                    "accounts": accounts,
                    "count": len(accounts),
                    "generated_at": now_iso(),
                },
            )
            return

        if path == "/api/my-history":
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return

            query = parse_qs(urlparse(self.path).query)
            limit = int(query.get("limit", [str(HISTORY_CHAR_LIMIT)])[0])
            entries = read_user_history(context["user"]["id"], max(1000, min(limit, 500000)))
            self.send_json(
                HTTPStatus.OK,
                {
                    "entries": [public_history_entry(entry) for entry in entries],
                    "count": len(entries),
                    "char_limit": limit,
                    "user": public_user(context["user"]),
                },
            )
            return

        if path == "/api/my-activity":
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return

            query = parse_qs(urlparse(self.path).query)
            limit = int(query.get("limit", [str(HISTORY_CHAR_LIMIT)])[0])
            entries = read_user_activity(context["user"]["id"], max(1000, min(limit, 500000)))
            self.send_json(
                HTTPStatus.OK,
                {
                    "entries": [public_activity_entry(entry) for entry in entries],
                    "count": len(entries),
                    "char_limit": limit,
                    "user": public_user(context["user"]),
                },
            )
            return

        self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def do_POST(self) -> None:
        path = urlparse(self.path).path

        if path == "/api/register":
            try:
                self.handle_register()
            except ValueError as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return

        if path == "/api/login":
            try:
                self.handle_login()
            except ValueError as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return

        if path == "/api/admin/login":
            try:
                self.handle_admin_login()
            except ValueError as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return

        if path == "/api/logout":
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return
            delete_session(context["token"])
            self.send_json(HTTPStatus.OK, {"ok": True})
            return

        if path == "/api/admin/logout":
            if not self.request_has_allowed_origin():
                return
            context = self.admin_context()
            if not context:
                return
            delete_admin_session(context["token"])
            self.send_json(HTTPStatus.OK, {"ok": True})
            return

        if path == "/api/admin/impersonate":
            if not self.request_has_allowed_origin():
                return
            if not self.admin_context():
                return
            if not self.enforce_rate_limit("admin-impersonate"):
                return

            try:
                payload = self.read_json_body()
                user = None
                user_id = str(payload.get("user_id") or payload.get("userId") or "").strip()
                username = str(payload.get("username") or "").strip()
                if user_id:
                    user = find_user_by_id(user_id)
                elif username:
                    user = find_user_by_username(username)

                if not user:
                    self.send_json(HTTPStatus.NOT_FOUND, {"error": "User not found."})
                    return

                session = create_session(
                    user,
                    ttl_seconds=IMPERSONATION_SESSION_TTL_SECONDS,
                    session_type="admin_impersonation",
                )
                self.send_json(
                    HTTPStatus.OK,
                    {
                        "token": session["token"],
                        "user": public_user(user),
                        "expires_at": session["expires_at"],
                        "expires_in": IMPERSONATION_SESSION_TTL_SECONDS,
                    },
                )
            except ValueError as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return

        if path == "/api/activity":
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return
            if not self.enforce_rate_limit(f"activity:{context['user']['id']}"):
                return
            try:
                payload = self.read_json_body()
                entry = build_activity_entry(context["user"], payload)
                append_user_activity(context["user"]["id"], entry)
                self.send_json(HTTPStatus.CREATED, {"ok": True, "entry": public_activity_entry(entry)})
            except ValueError as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return

        if path not in {"/api/tutor", "/api/debug-chat"}:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return

        context = None
        if path == "/api/debug-chat":
            if not self.request_has_admin_token():
                self.send_json(HTTPStatus.FORBIDDEN, {"error": "Admin token required."})
                return
        else:
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return
            if not self.enforce_rate_limit(f"tutor:{context['user']['id']}"):
                return

        try:
            payload = self.read_json_body()
            user = ensure_user_tutor_mode(context["user"]) if context else None
            tutor_mode = tutor_mode_for_user(user) if user else DEFAULT_TUTOR_MODE
            scaffold_mode = scaffold_mode_for_user(user) if user else DEFAULT_SCAFFOLD_MODE
            if path == "/api/tutor" and user:
                payload["_serverLearnerState"] = learning_state_for_user(user)
            messages = (
                build_tutor_messages(payload, tutor_mode=tutor_mode, scaffold_mode=scaffold_mode)
                if path == "/api/tutor"
                else clean_messages(payload)
            )
            raw_prompt = format_raw_prompt(messages)
            learner_request = learner_request_from_payload(payload, messages)
            guardrail_used = path == "/api/tutor" and is_solution_request(learner_request)
            content = solution_request_guardrail_reply(tutor_mode, scaffold_mode) if guardrail_used else stream_chat_text(messages)
            scaffold_fallback_used = False
            if path == "/api/tutor":
                content = normalize_tutor_reply(content)
                if not guardrail_used and tutor_reply_needs_fallback(content, scaffold_mode, payload.get("_serverLearnerState")):
                    content = tutor_reply_fallback(tutor_mode, scaffold_mode, payload.get("_serverLearnerState"))
                    scaffold_fallback_used = True
            entry = {
                "id": f"{int(time.time() * 1000)}-{threading.get_ident()}",
                "created_at": now_iso(),
                "endpoint": path,
                "model": MODEL,
                "tutor_mode": tutor_mode if path == "/api/tutor" else "",
                "scaffold_mode": scaffold_mode if path == "/api/tutor" else "",
                "condition_key": user.get("condition_key", f"{tutor_mode}:{scaffold_mode}") if user else "",
                "condition_label": user.get("condition_label", condition_label_for_user(user)) if user else "",
                "learner_state": payload.get("_serverLearnerState") if path == "/api/tutor" else {},
                "template_used": payload.get("messages") is None,
                "guardrail_used": guardrail_used,
                "scaffold_fallback_used": scaffold_fallback_used,
                "learner_request": learner_request,
                "messages": messages,
                "raw_prompt": raw_prompt,
                "message": content,
                "user_id": user.get("id") if user else None,
                "username": user.get("username") if user else None,
            }
            append_history(entry)
            if user:
                append_user_history(user["id"], entry)
                chat_activity = build_activity_entry(
                    user,
                    {
                        **payload,
                        "event_type": "chat",
                        "chat": {
                            "learner_message": learner_request,
                            "tutor_reply": content,
                        },
                    },
                    "chat",
                )
                append_user_activity(user["id"], chat_activity)

            if path == "/api/debug-chat":
                self.send_json(
                    HTTPStatus.OK,
                    {
                        "message": content,
                        "model": MODEL,
                        "messages": messages,
                        "raw_prompt": raw_prompt,
                        "entry": entry,
                    },
                )
                return

            self.send_json(HTTPStatus.OK, {"message": content, "model": MODEL})
        except ValueError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
        except Exception as error:
            traceback.print_exc()
            error_entry = {
                "id": f"{int(time.time() * 1000)}-{threading.get_ident()}",
                "created_at": now_iso(),
                "endpoint": path,
                "model": MODEL,
                "error": str(error),
            }
            if context:
                error_entry["user_id"] = context["user"]["id"]
                error_entry["username"] = context["user"]["username"]
                append_user_history(context["user"]["id"], error_entry)
                error_activity = build_activity_entry(
                    context["user"],
                    {
                        "event_type": "chat_error",
                        "message": learner_request_from_payload(payload, messages) if "messages" in locals() else "",
                        "problem": payload.get("problem") if "payload" in locals() else {},
                        "code": payload.get("code") if "payload" in locals() else {},
                        "testState": payload.get("testState") if "payload" in locals() else {},
                        "chat": {
                            "learner_message": learner_request_from_payload(payload, messages) if "messages" in locals() else "",
                            "error": str(error),
                        },
                    },
                    "chat_error",
                )
                append_user_activity(context["user"]["id"], error_activity)
            append_history(error_entry)
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": str(error)})


def main() -> None:
    ensure_private_dirs()
    refresh_account_summary_csv()
    server = ThreadingHTTPServer((HOST, PORT), TutorHandler)
    print(f"CodeMentor local backend running at http://{HOST}:{PORT}")
    print(f"Model: {MODEL}")
    print(f"Private account data: {PRIVATE_DATA_DIR}")
    server.serve_forever()


if __name__ == "__main__":
    main()
