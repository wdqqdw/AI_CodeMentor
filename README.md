# AI_CodeMentor

AI_CodeMentor is an AI-assisted coding practice prototype. The current public page focuses on a single deeper exercise, **Boggle Solver / 棋盘单词搜索**, with a Python coding panel, test feedback, and an AI Tutor chat panel.

Last updated: 2026-07-25

## Quick Links

- Live app: https://wdqqdw.github.io/AI_CodeMentor/
- Backend debug page: https://wdqqdw.github.io/AI_CodeMentor/backend-chat.html
- GitHub repository: https://github.com/wdqqdw/AI_CodeMentor
- Current public backend health check: https://frequent-reflection-combinations-raises.trycloudflare.com/health
- Current public tutor API endpoint: https://frequent-reflection-combinations-raises.trycloudflare.com/api/tutor

## Current Deployment

- Frontend hosting: GitHub Pages.
- Main exercise: Boggle Solver.
- AI backend: AutoDL server running a local Python service on port `8787`.
- Public backend access: Cloudflare Tunnel.
- Model configured by the backend: `DeepSeek-V4-Pro`.
- Backend conversation history window: latest `100000` characters.

## Important Notes

- The current Cloudflare Tunnel URL is a temporary `trycloudflare.com` URL. If the tunnel restarts and the URL changes, update both `index.html` and this README.
- API keys, admin tokens, `.env.local`, backend logs, and private chat history must stay outside this public repository.
- The backend debug page is for testing and inspection. Protected backend endpoints may require private credentials that should not be committed here.
- If the AutoDL instance is stopped, restarted, out of balance, or reclaimed by the platform, the AI Tutor backend will be unavailable until the backend service and tunnel are launched again.

## Project Structure

- `index.html`: main GitHub Pages entry.
- `styles.css`: main application layout and visual design.
- `script.js`: coding panel, test runner, AI Tutor chat, and UI interactions.
- `problems.js`: generated/static problem catalog used by the page.
- `problems/*.md`: editable problem definitions.
- `backend/`: backend reference code and prompt templates that are safe to keep in the public repo.
- `backend-chat.html`, `backend-chat.css`, `backend-chat.js`: backend debug page.

## Maintenance Checklist

When making future changes, update this README in the same GitHub sync if any of these change:

- Live page URL.
- Current backend tunnel URL.
- Current focused exercise.
- Backend model, port, or deployment location.
- Debug/testing page path.
- Any user-facing operational instruction.
