# AI_CodeMentor

AI_CodeMentor is an AI-assisted coding practice prototype. The current public page starts with a short **Single Letter Finder / 单字母查找** quiz, then supports a prerequisite knowledge view and two deeper coding tasks: **Boggle Solver / 棋盘单词搜索** and **Word Ladder / 单词接龙**. Each task uses the Python coding panel, testcase feedback, a full Traceback panel for runtime errors, and the AI Tutor chat panel.

Last updated: 2026-08-11

## Quick Links

- <a href="https://wdqqdw.github.io/AI_CodeMentor/" target="_blank" rel="noopener noreferrer">Live app</a>
- <a href="https://wdqqdw.github.io/AI_CodeMentor/activity.html" target="_blank" rel="noopener noreferrer">Structured activity dashboard</a>
- <a href="https://wdqqdw.github.io/AI_CodeMentor/admin.html" target="_blank" rel="noopener noreferrer">Admin account console</a>
- <a href="https://wdqqdw.github.io/AI_CodeMentor/backend-chat.html" target="_blank" rel="noopener noreferrer">Backend debug page</a>
- <a href="https://github.com/wdqqdw/AI_CodeMentor" target="_blank" rel="noopener noreferrer">GitHub repository</a>
- <a href="https://normal-appreciation-question-space.trycloudflare.com/health" target="_blank" rel="noopener noreferrer">Current public backend health check</a>
- <a href="https://normal-appreciation-question-space.trycloudflare.com/api/tutor" target="_blank" rel="noopener noreferrer">Current public tutor API endpoint</a>

## Current Deployment

- Frontend hosting: GitHub Pages.
- Entry quiz: Single Letter Finder. Learners first complete a very small 2D-board task that only asks them to return length-1 words appearing on the board, checking basic traversal, membership, and duplicate handling.
- Main exercises: Boggle Solver and Word Ladder.
- Default entry view: Quiz. Learners can then switch to Knowledge for a roughly 10-minute prerequisite lesson on 2D grids, DFS, backtracking, prefix pruning, and how/when to use AI Tutor, or switch to Boggle / Word Ladder from the top-left segmented control.
- View timers: enabled. After login, the top bar shows the current left-pane view's accumulated time in seconds. Timing pauses when learners switch away from a view or the page is hidden, and resumes from persisted per-account totals on later logins.
- Knowledge AI Tutor guide: compact narrative text. It tells learners that current problem context, page type, code, language, pass rate, public hints, and latest traceback are visible to the Tutor automatically and do not need to be copied manually.
- Practice statement language: bilingual English/Chinese problem description for Boggle Solver.
- Statement expansion: enabled. The Practice problem statement/examples can expand within the left pane, separate from the code editor expansion.
- AI backend: AutoDL server running a local Python service on port `8787`.
- Public backend access: Cloudflare Tunnel.
- Model configured by the backend: `DeepSeek-V4-Pro`.
- Backend conversation history window: latest `100000` characters.
- Account system: enabled. The app opens with registration/login before AI Tutor can be used.
- Counterbalanced Tutor assignment: enabled. The backend privately assigns each account to Group A or Group B. Group A receives Boggle + Encouraging Tutor and Word Ladder + Neutral Tutor; Group B receives Boggle + Neutral Tutor and Word Ladder + Encouraging Tutor. Learners do not choose or see this assignment.
- Hidden scaffold binding: enabled. Each account is privately assigned once to `fixed_low`, `fixed_high`, or `adaptive`; learners do not see this condition. The scaffold condition crosses with the two-task counterbalanced Tutor assignment.
- Account metadata JSON: enabled. The backend maintains private `account_metadata.json` with username, study group, Boggle Tutor style, Word Ladder Tutor style, hidden scaffold style, condition key, and binding timestamps. Existing metadata is skipped rather than reassigned.
- Runtime error display: enabled. The editor has a dedicated `Traceback` tab that shows full per-case runtime errors instead of truncating them in the bottom status strip. A single case error does not stop the remaining cases from running.
- Editor draft persistence: enabled. The browser stores code drafts locally by account, problem, and language so refreshing the page does not erase a learner's current code.
- Editor recovery controls: enabled. The code toolbar includes Undo and Reset-to-starter buttons; Reset asks for confirmation and can be reversed with Undo.
- Run/Submit busy state: enabled. While tests are executing, both execution buttons are disabled, the active button shows `Running...` or `Submitting...`, and the status/output areas show progress text.
- Python execution isolation: enabled. Python submissions run inside `pyodide-worker.js` instead of the browser main thread, using Pyodide `v0.28.2`, with per-case hard timeouts, per-case time-limit checks, and a repeated-timeout guard so exponential DFS attempts cannot freeze the page.
- Structured activity logging: enabled for Run, Submit, and AI Tutor chat events.
- Learner-facing history/activity APIs: sanitized. Students can reload their own conversation and learning records, but hidden scaffold metadata, raw prompts, full message arrays, and server learner-state summaries are stripped before response.
- Activity dashboard: account-scoped login page with summary cards, a shared scroll area containing the accuracy-over-interactions line chart and an auto-expanding staggered vertical timeline.
- Activity dashboard compatibility: legacy Tutor chat history is merged into the structured activity feed.
- Admin account console: root-authenticated page for viewing all accounts, password storage status, account summaries, and short-lived dashboard links for each user.
- Tutor prompts: Encouraging Tutor v9 and Neutral Tutor v9, crossed with Fixed Low Scaffold, Fixed High Scaffold, and Adaptive Scaffold prompt modules. Prompt and deterministic fallback logic are task-aware: Boggle guidance uses grid-search language, while Word Ladder guidance uses implicit-graph and BFS language. Fixed Low only asks diagnostic questions; Fixed High gives one small local repair direction without a full solution; Adaptive uses learner state plus recent failure counts to choose support level. High-risk requests and scaffold violations use deterministic backend guardrails to keep length, code-detail, and refusal standards aligned.
- Tutor code context: enabled. The frontend sends line-numbered editor code to the backend; tutors may point to short line ranges. Complete solution requests still trigger deterministic refusal, while permitted high-support scaffold modes may provide one local repair fragment of two to three logical lines.
- Tutor conversation context: enabled. Each authenticated Tutor request includes a sanitized summary of the account's recent learner/Tutor turns for the current task, so follow-up questions retain local context without leaking context from the other task or exposing raw prompts / hidden scaffold metadata.
- Boggle Solver testcases: 140 cases grouped into 11 learning tiers, with non-spoiling hints for the first 130 cases and fully hidden challenge cases for the final 10.
- Boggle Solver performance tests: enabled. Several later cases include measured `timeLimitMs` thresholds; a plain word-by-word DFS can produce answers but is expected to exceed these limits, while shared-prefix pruning with a Trie should stay comfortably below them.
- Word Ladder visual examples: enabled. The task statement includes SVG diagrams for the shortest path length and the one-letter neighbor rule.
- Word Ladder testcases: 30 cases covering direct transformations, missing end words, multiple shortest paths, length filtering, repeated dictionary entries, and longer transformation chains.
- Private account summary CSV: enabled on the backend. The server maintains `account_summary.csv` inside the private backend data directory with usernames, study group, task-specific Tutor styles, scaffold assignment, password hashes, activity counts, best score, latest problem, and timestamps.
- Private account summary CSV timing fields: enabled. The CSV includes total seconds for Quiz, Knowledge, Boggle, and Word Ladder views.

## Important Notes

- The current Cloudflare Tunnel URL is a temporary `trycloudflare.com` URL. If the tunnel restarts and the URL changes, update `index.html`, `activity.html`, `admin.html`, and this README.
- API keys, admin tokens, `.env.local`, backend logs, private account files, password hashes, sessions, and private chat history must stay outside this public repository.
- Usernames, password hashes, login sessions, and per-account Tutor history are stored on the AutoDL server under the private backend data directory.
- Per-account structured records are also stored privately, including code snapshots, runtime tracebacks, problem metadata, test pass rates, visible testcase results, hidden testcase summaries, and Tutor message/reply snapshots.
- Hidden scaffold assignments are private experiment metadata and should not be shown in learner-facing pages or learner-facing APIs.
- Private backend files keep the full debugging record; learner-facing endpoints return sanitized copies only.
- The account summary CSV and admin console store/show password hash status only, not plaintext passwords. Existing user passwords are irreversible hashes; keep the entire private data directory off GitHub.
- Root admin credentials are configured only in private AutoDL environment files through `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`.
- The backend debug page is for testing and inspection. Protected backend endpoints may require private credentials that should not be committed here.
- If the AutoDL instance is stopped, restarted, out of balance, or reclaimed by the platform, the AI Tutor backend will be unavailable until the backend service and tunnel are launched again.

## Project Structure

- `index.html`: main GitHub Pages entry.
- `styles.css`: main application layout and visual design.
- `script.js`: coding panel, test runner, Traceback tab, AI Tutor chat, and UI interactions.
- `index.html` mode switch: Quiz, Knowledge, Boggle, and Word Ladder share the left pane while AI Tutor remains visible on the right.
- `index.html` knowledge view: embedded Boggle Solver prerequisite lesson used before learners enter the full coding panel.
- `problems.js`: generated/static problem catalog used by the page.
- `problems/*.md`: editable problem definitions.
- `backend/`: backend reference code and prompt templates that are safe to keep in the public repo.
- `backend/prompts/baselines`, `backend/prompts/variants`, `backend/prompts/evaluations`: prompt versioning, baseline backups, and synthetic evaluation notes.
- `backend/prompts/evaluations/tutor_stress_test_2026-08-04.md`: latest six-condition beginner stress test notes and prompt/guardrail fixes.
- `backend-chat.html`, `backend-chat.css`, `backend-chat.js`: backend debug page.
- `activity.html`, `activity.css`, `activity.js`: account-scoped structured activity dashboard.
- `admin.html`, `admin.css`, `admin.js`: root-authenticated account overview and dashboard jump page.

## Backend Account API

- `POST /api/register`: create an account and return a session token. The backend assigns the private study group and scaffold condition automatically.
- `POST /api/login`: log in with username and password. Existing accounts keep their original private study group and scaffold assignment.
- `GET /api/me`: validate the current session.
- `POST /api/logout`: invalidate the current session.
- `GET /api/my-history`: read the current account's Tutor conversation history.
- `POST /api/activity`: record a structured Run/Submit learning event or a lightweight `view_time` timing event.
- `GET /api/my-activity`: read the current account's structured activity records.
- `GET /api/view-times`: read the current account's persisted per-view accumulated seconds.
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
- Task/Tutor counterbalancing rules.
- Testcase count, disclosure tiers, or performance timing thresholds.
- Backend model, port, or deployment location.
- Debug/testing page path.
- Account/authentication behavior.
- Structured activity logging fields or dashboard path.
- Per-view timing behavior, timing fields, or timing API path.
- Admin console path, root auth behavior, or dashboard impersonation behavior.
- Private account metadata JSON, account summary CSV fields, or storage location.
- Tutor prompt variant, prompt guardrail behavior, or prompt evaluation results.
- Any user-facing operational instruction.
