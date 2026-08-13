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
- `account_metadata.json`: private experiment metadata for each account, including Tutor style, hidden scaffold style, six-cell condition key, and binding timestamps. Existing entries are not reassigned.
- `sessions.json`: active login sessions.
- `histories/*.jsonl`: per-account Tutor conversation history.
- `activities/*.jsonl`: per-account Run, Submit, Tutor chat, code snapshot, and testcase result records.
- `account_summary.csv`: private account overview with username, Tutor style, hidden scaffold style, condition key, password hash, login/activity timestamps, event counts, best score, and latest problem.

Passwords are stored as PBKDF2-SHA256 hashes, not plaintext.
The CSV intentionally records the password hash only; it should remain in the private data directory and must not be committed.

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

Record a structured Run or Submit event:

```bash
curl -X POST http://127.0.0.1:8787/api/activity \
  -H "Content-Type: application/json" \
  -H "Origin: https://wdqqdw.github.io" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"event_type":"run","problem":{"englishName":"Boggle Solver"},"code":{"language":"python","source":"pass"},"testState":{"scope":"all","passed":0,"total":50}}'
```

Read structured activity records:

```bash
curl http://127.0.0.1:8787/api/my-activity \
  -H "Origin: https://wdqqdw.github.io" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

Tutor calls automatically create `chat` activity records. The main frontend creates `run` and `submit` records after code execution.

`/api/my-activity` also merges older per-account Tutor chat history into the activity feed, so conversations created before structured logging was added still appear on the dashboard.
Learner-facing `/api/my-history` and `/api/my-activity` return sanitized copies. Hidden scaffold fields, raw prompts, model message arrays, and server learner-state summaries stay in private files or admin/debug-only views.

## Tutor Prompt Files

The tutor prompt is intentionally editable without touching the server code:

- `backend/prompts/tutor_system.md`: system-level tutor behavior and safety rules.
- `backend/prompts/tutor_user_template.md`: the context template sent with each learner message.
- `backend/prompts/variants/encouraging_tutor_v10.md`: encouraging tone rules.
- `backend/prompts/variants/neutral_tutor_v10.md`: neutral tone rules.
- `backend/prompts/scaffolds/*.md`: hidden scaffold-condition modules for fixed low, fixed high, and adaptive support.

The backend reads these files when it builds each Tutor request, so edits apply on the next request.
The server also applies deterministic scaffold guardrails when a model reply is too long, includes disallowed code detail, or violates the fixed-low question-only format.
The latest scaffold usability notes are in `backend/prompts/evaluations/scaffold_prompt_v10_2026-08-13.md`.
