#!/usr/bin/env python3
"""Local API proxy for CodeMentor AI Tutor."""

from __future__ import annotations

import hashlib
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

from prompt import build_tutor_messages


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = Path(__file__).resolve().parent


def load_env_file() -> None:
    for env_path in (ROOT_DIR / ".env.local", BACKEND_DIR / ".env.local"):
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

BASE_URL = os.getenv("AUTODL_BASE_URL", "https://www.autodl.art/api/v1")
MODEL = os.getenv("AI_MENTOR_MODEL", "DeepSeek-V4-Pro")
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8787"))
MAX_BODY_BYTES = 256 * 1024
HISTORY_CHAR_LIMIT = int(os.getenv("HISTORY_CHAR_LIMIT", "100000"))
ALLOWED_ORIGINS = {
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "https://wdqqdw.github.io").split(",")
    if origin.strip()
}
REQUIRE_BROWSER_ORIGIN = os.getenv("REQUIRE_BROWSER_ORIGIN", "true").lower() not in {"0", "false", "no"}
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "20"))
SESSION_TTL_SECONDS = int(os.getenv("SESSION_TTL_SECONDS", str(60 * 60 * 24 * 30)))
MIN_PASSWORD_LENGTH = int(os.getenv("MIN_PASSWORD_LENGTH", "6"))
PASSWORD_HASH_ITERATIONS = int(os.getenv("PASSWORD_HASH_ITERATIONS", "260000"))

HISTORY_DIR = BACKEND_DIR / "logs"
HISTORY_PATH = HISTORY_DIR / "tutor_history.jsonl"
PRIVATE_DATA_DIR = Path(os.getenv("CODEMENTOR_DATA_DIR", str(BACKEND_DIR / "private_data")))
USERS_PATH = PRIVATE_DATA_DIR / "users.json"
SESSIONS_PATH = PRIVATE_DATA_DIR / "sessions.json"
USER_HISTORY_DIR = PRIVATE_DATA_DIR / "histories"

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
    for path in (PRIVATE_DATA_DIR, USER_HISTORY_DIR):
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


def normalize_username(username: str) -> str:
    return username.strip().lower()


def public_user(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user.get("id", ""),
        "username": user.get("username", ""),
        "created_at": user.get("created_at", ""),
    }


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


def create_user(username: str, password: str) -> dict[str, Any]:
    clean_username, clean_password = validate_credentials(username, password)
    username_key = normalize_username(clean_username)

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
            "created_at": now_iso(),
            "last_login_at": now_iso(),
        }
        users[username_key] = user
        write_json_file(USERS_PATH, store)
        return user


def authenticate_user(username: str, password: str) -> dict[str, Any]:
    username_key = normalize_username(username)
    with DATA_LOCK:
        store = read_json_file(USERS_PATH, {"users": {}})
        user = store.get("users", {}).get(username_key)
        if not user or not verify_password(password, str(user.get("password_hash", ""))):
            raise PermissionError("Invalid username or password.")

        user["last_login_at"] = now_iso()
        write_json_file(USERS_PATH, store)
        return user


def create_session(user: dict[str, Any]) -> dict[str, Any]:
    token = token_urlsafe(32)
    session = {
        "token": token,
        "user_id": user["id"],
        "username": user["username"],
        "created_at": now_iso(),
        "expires_at": time.time() + SESSION_TTL_SECONDS,
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


def format_raw_prompt(messages: list[dict[str, str]]) -> str:
    return "\n\n".join(f"[{item['role']}]\n{item['content']}" for item in messages)


def history_entry_size(entry: dict[str, Any]) -> int:
    parts = [
        str(entry.get("raw_prompt", "")),
        str(entry.get("message", "")),
        str(entry.get("error", "")),
    ]
    return sum(len(part) for part in parts)


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


def append_user_history(user_id: str, entry: dict[str, Any]) -> None:
    ensure_private_dirs()
    append_jsonl(user_history_path(user_id), entry, DATA_LOCK)


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
            user = create_user(str(payload.get("username", "")), str(payload.get("password", "")))
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
            user = authenticate_user(str(payload.get("username", "")), str(payload.get("password", "")))
            session = create_session(user)
            self.send_json(HTTPStatus.OK, {"token": session["token"], "user": public_user(user)})
        except PermissionError as error:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"error": str(error)})

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
                    "entries": entries,
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

        if path == "/api/logout":
            if not self.request_has_allowed_origin():
                return
            context = self.auth_context()
            if not context:
                return
            delete_session(context["token"])
            self.send_json(HTTPStatus.OK, {"ok": True})
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
            messages = build_tutor_messages(payload) if path == "/api/tutor" else clean_messages(payload)
            raw_prompt = format_raw_prompt(messages)
            content = stream_chat_text(messages)
            user = context["user"] if context else None
            entry = {
                "id": f"{int(time.time() * 1000)}-{threading.get_ident()}",
                "created_at": now_iso(),
                "endpoint": path,
                "model": MODEL,
                "template_used": payload.get("messages") is None,
                "learner_request": learner_request_from_payload(payload, messages),
                "messages": messages,
                "raw_prompt": raw_prompt,
                "message": content,
                "user_id": user.get("id") if user else None,
                "username": user.get("username") if user else None,
            }
            append_history(entry)
            if user:
                append_user_history(user["id"], entry)

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
            append_history(error_entry)
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": str(error)})


def main() -> None:
    ensure_private_dirs()
    server = ThreadingHTTPServer((HOST, PORT), TutorHandler)
    print(f"CodeMentor local backend running at http://{HOST}:{PORT}")
    print(f"Model: {MODEL}")
    print(f"Private account data: {PRIVATE_DATA_DIR}")
    server.serve_forever()


if __name__ == "__main__":
    main()
