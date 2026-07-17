# CodeMentor AI Local Backend

This backend runs on your own computer and keeps the real API key away from the browser.

## Run locally

```bash
cd /Users/wdq/Documents/Codex/2026-07-17/x/work/AI_CodeMentor_live
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
export AUTODL_API_KEY="your_api_key"
python backend/server.py
```

The local service starts at:

```text
http://127.0.0.1:8787
```

## Test

```bash
curl http://127.0.0.1:8787/health
curl -X POST http://127.0.0.1:8787/api/tutor \
  -H "Content-Type: application/json" \
  -d '{"message":"请只回复 OK"}'
```

## Tutor prompt files

The tutor prompt is intentionally editable without touching the server code:

- `backend/prompts/tutor_system.md`: system-level tutor behavior and safety rules
- `backend/prompts/tutor_user_template.md`: the context template sent with each learner message

The backend reads these files when it builds each request, so your edits apply on the next tutor request.

## Tutor payload shape

The frontend sends the current learning state to `/api/tutor`:

- `message`: the learner's latest request
- `problem`: problem name, Chinese name, category, difficulty, description, and public examples
- `code`: current language, editor source, status label, and output panel text
- `testState`: visible testcase details plus hidden testcase pass/fail summary only

The backend wraps that payload with a system prompt that asks the model to act as a concise programming tutor, use the learner's current code and test state, and avoid revealing hidden testcase details.
