#!/usr/bin/env python3
"""Local API proxy for CodeMentor AI Tutor."""

from __future__ import annotations

import json
import os
import sys
import traceback
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

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
MAX_BODY_BYTES = 64 * 1024


def get_api_key() -> str:
    api_key = os.getenv("AUTODL_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing AUTODL_API_KEY. Set it before starting the backend.")
    return api_key


def get_client() -> OpenAI:
    return OpenAI(base_url=BASE_URL, api_key=get_api_key())


def json_bytes(payload: dict[str, Any]) -> bytes:
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


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


class TutorHandler(BaseHTTPRequestHandler):
    server_version = "CodeMentorLocalBackend/0.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
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

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path != "/health":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return

        self.send_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "model": MODEL,
                "base_url": BASE_URL,
                "has_api_key": bool(os.getenv("AUTODL_API_KEY") or os.getenv("OPENAI_API_KEY")),
            },
        )

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/tutor":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY_BYTES:
                raise ValueError("Request body is empty or too large.")

            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            messages = clean_messages(payload)
            content = stream_chat_text(messages)
            self.send_json(HTTPStatus.OK, {"message": content, "model": MODEL})
        except ValueError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
        except Exception as error:
            traceback.print_exc()
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": str(error)})


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), TutorHandler)
    print(f"CodeMentor local backend running at http://{HOST}:{PORT}")
    print(f"Model: {MODEL}")
    server.serve_forever()


if __name__ == "__main__":
    main()
