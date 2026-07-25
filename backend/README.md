# CodeMentor AI Backend

This backend keeps the real model API key, account files, password hashes, sessions, and Tutor chat logs away from the public browser code.

## Run Locally

```bash
cd /Users/wdq/Documents/Codex/2026-07-17/x/work/AI_CodeMentor_live
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env.local
python backend/server.py
```

The service starts at:

```text
http://127.0.0.1:8787
```

## Account Data

By default, private account data is stored under:

```text
backend/private_data/
```

This directory is ignored by git. It stores:

- `users.json`: usernames and password hashes.
- `sessions.json`: active login sessions.
- `histories/*.jsonl`: per-account Tutor conversation history.

Passwords are stored as PBKDF2-SHA256 hashes, not plaintext.

## Test

Register first:

```bash
curl -X POST http://127.0.0.1:8787/api/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://wdqqdw.github.io" \
  -d '{"username":"demo_user","password":"demo_password"}'
```

Use the returned token:

```bash
curl -X POST http://127.0.0.1:8787/api/tutor \
  -H "Content-Type: application/json" \
  -H "Origin: https://wdqqdw.github.io" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"message":"请只回复 OK"}'
```

Read the current account history:

```bash
curl http://127.0.0.1:8787/api/my-history \
  -H "Origin: https://wdqqdw.github.io" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Tutor Prompt Files

The tutor prompt is intentionally editable without touching the server code:

- `backend/prompts/tutor_system.md`: system-level tutor behavior and safety rules.
- `backend/prompts/tutor_user_template.md`: the context template sent with each learner message.

The backend reads these files when it builds each Tutor request, so edits apply on the next request.
