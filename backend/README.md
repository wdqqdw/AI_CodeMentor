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
