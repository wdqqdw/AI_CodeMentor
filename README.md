# AI_CodeMentor

AI_CodeMentor is an AI-assisted coding practice prototype. The current public page focuses on a single deeper exercise, **Boggle Solver / 棋盘单词搜索**, with a knowledge-first lesson view, a Python coding panel, testcase feedback, a full Traceback panel for runtime errors, and an AI Tutor chat panel.

Last updated: 2026-07-26

## Quick Links

- <a href="https://wdqqdw.github.io/AI_CodeMentor/" target="_blank" rel="noopener noreferrer">Live app</a>
- <a href="https://wdqqdw.github.io/AI_CodeMentor/activity.html" target="_blank" rel="noopener noreferrer">Structured activity dashboard</a>
- <a href="https://wdqqdw.github.io/AI_CodeMentor/admin.html" target="_blank" rel="noopener noreferrer">Admin account console</a>
- <a href="https://wdqqdw.github.io/AI_CodeMentor/backend-chat.html" target="_blank" rel="noopener noreferrer">Backend debug page</a>
- <a href="https://github.com/wdqqdw/AI_CodeMentor" target="_blank" rel="noopener noreferrer">GitHub repository</a>
- <a href="https://frequent-reflection-combinations-raises.trycloudflare.com/health" target="_blank" rel="noopener noreferrer">Current public backend health check</a>
- <a href="https://frequent-reflection-combinations-raises.trycloudflare.com/api/tutor" target="_blank" rel="noopener noreferrer">Current public tutor API endpoint</a>

## Current Deployment

- Frontend hosting: GitHub Pages.
- Main exercise: Boggle Solver.
- Default entry view: Knowledge. Learners first see a roughly 10-minute prerequisite lesson on 2D grids, DFS, backtracking, and prefix pruning, then switch to Practice from the top-left segmented control.
- AI backend: AutoDL server running a local Python service on port `8787`.
- Public backend access: Cloudflare Tunnel.
- Model configured by the backend: `DeepSeek-V4-Pro`.
- Backend conversation history window: latest `100000` characters.
- Account system: enabled. The app opens with registration/login before AI Tutor can be used.
- Tutor style binding: enabled. Each account is permanently bound to one Tutor style at registration, or at the next login for older unbound accounts.
- Runtime error display: enabled. The editor has a dedicated `Traceback` tab that shows full per-case runtime errors instead of truncating them in the bottom status strip. A single case error does not stop the remaining cases from running.
- Structured activity logging: enabled for Run, Submit, and AI Tutor chat events.
- Activity dashboard: account-scoped login page with summary cards, a shared scroll area containing the accuracy-over-interactions line chart and an auto-expanding staggered vertical timeline.
- Activity dashboard compatibility: legacy Tutor chat history is merged into the structured activity feed.
- Admin account console: root-authenticated page for viewing all accounts, password storage status, account summaries, and short-lived dashboard links for each user.
- Tutor prompts: Encouraging Tutor v8 and Neutral Tutor v8. Both are length-balanced for the experiment, refuse code/final-answer requests, and avoid exact testcase/code leakage. High-risk requests for complete code, final answers, or complete implementation steps use a deterministic backend guardrail reply so the model cannot expand into solution details. Encouraging Tutor uses limited supportive wording; Neutral Tutor uses plain, non-motivational wording. Tutor requests include whether the learner is viewing the Knowledge lesson or the Practice coding panel.
- Boggle Solver testcases: 140 cases grouped into 11 learning tiers, with non-spoiling hints for the first 130 cases and fully hidden challenge cases for the final 10.
- Boggle Solver performance tests: enabled. Several later cases include measured `timeLimitMs` thresholds; a plain word-by-word DFS can produce answers but is expected to exceed these limits, while shared-prefix pruning with a Trie should stay comfortably below them.
- Private account summary CSV: enabled on the backend. The server maintains `account_summary.csv` inside the private backend data directory with usernames, bound Tutor style, password hashes, activity counts, best score, latest problem, and timestamps.

## Important Notes

- The current Cloudflare Tunnel URL is a temporary `trycloudflare.com` URL. If the tunnel restarts and the URL changes, update both `index.html` and this README.
- API keys, admin tokens, `.env.local`, backend logs, private account files, password hashes, sessions, and private chat history must stay outside this public repository.
- Usernames, password hashes, login sessions, and per-account Tutor history are stored on the AutoDL server under the private backend data directory.
- Per-account structured records are also stored privately, including code snapshots, runtime tracebacks, problem metadata, test pass rates, visible testcase results, hidden testcase summaries, and Tutor message/reply snapshots.
- The account summary CSV and admin console store/show password hash status only, not plaintext passwords. Existing user passwords are irreversible hashes; keep the entire private data directory off GitHub.
- Root admin credentials are configured only in private AutoDL environment files through `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`.
- The backend debug page is for testing and inspection. Protected backend endpoints may require private credentials that should not be committed here.
- If the AutoDL instance is stopped, restarted, out of balance, or reclaimed by the platform, the AI Tutor backend will be unavailable until the backend service and tunnel are launched again.

## Project Structure

- `index.html`: main GitHub Pages entry.
- `styles.css`: main application layout and visual design.
- `script.js`: coding panel, test runner, Traceback tab, AI Tutor chat, and UI interactions.
- `index.html` knowledge view: embedded Boggle Solver prerequisite lesson used before learners enter the coding panel.
- `problems.js`: generated/static problem catalog used by the page.
- `problems/*.md`: editable problem definitions.
- `backend/`: backend reference code and prompt templates that are safe to keep in the public repo.
- `backend/prompts/baselines`, `backend/prompts/variants`, `backend/prompts/evaluations`: prompt versioning, baseline backups, and synthetic evaluation notes.
- `backend-chat.html`, `backend-chat.css`, `backend-chat.js`: backend debug page.
- `activity.html`, `activity.css`, `activity.js`: account-scoped structured activity dashboard.
- `admin.html`, `admin.css`, `admin.js`: root-authenticated account overview and dashboard jump page.

## Backend Account API

- `POST /api/register`: create an account and return a session token. Accepts `tutorMode` as `encouraging` or `neutral`; the choice is permanently bound to the account.
- `POST /api/login`: log in with username and password. For older unbound accounts, `tutorMode` binds once on login; already-bound accounts keep their original Tutor style.
- `GET /api/me`: validate the current session.
- `POST /api/logout`: invalidate the current session.
- `GET /api/my-history`: read the current account's Tutor conversation history.
- `POST /api/activity`: record a structured Run/Submit learning event.
- `GET /api/my-activity`: read the current account's structured activity records.
- `POST /api/tutor`: call the AI Tutor. This endpoint requires `Authorization: Bearer <session-token>`.
- `POST /api/admin/login`: create a root admin session. Uses the private `ADMIN_PASSWORD_HASH`, not a public plaintext password.
- `GET /api/admin/accounts`: list all account summaries for the admin console.
- `POST /api/admin/impersonate`: create a short-lived account dashboard session for a selected user.
- `POST /api/admin/logout`: invalidate the current admin session.

## Maintenance Checklist

When making future changes, update this README in the same GitHub sync if any of these change:

- Live page URL.
- Current backend tunnel URL.
- Current focused exercise.
- Testcase count, disclosure tiers, or performance timing thresholds.
- Backend model, port, or deployment location.
- Debug/testing page path.
- Account/authentication behavior.
- Structured activity logging fields or dashboard path.
- Admin console path, root auth behavior, or dashboard impersonation behavior.
- Private account summary CSV fields or storage location.
- Tutor prompt variant, prompt guardrail behavior, or prompt evaluation results.
- Any user-facing operational instruction.
