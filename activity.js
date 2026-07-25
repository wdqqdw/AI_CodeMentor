const backendBaseUrl = window.CODEMENTOR_CONFIG?.backendBaseUrl || "http://127.0.0.1:8787";
const authStorageKey = "codementor.auth.v1";
const activityLimit = 100000;

const statusNode = document.querySelector("#activity-status");
const loginPanel = document.querySelector("#login-panel");
const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#activity-username");
const passwordInput = document.querySelector("#activity-password");
const loginMessage = document.querySelector("#login-message");
const dashboard = document.querySelector("#activity-dashboard");
const summaryGrid = document.querySelector("#summary-grid");
const accuracyChart = document.querySelector("#accuracy-chart");
const timeline = document.querySelector("#activity-timeline");
const refreshButton = document.querySelector("#refresh-button");
const logoutButton = document.querySelector("#logout-button");

let authSession = null;

const backendUrl = (path) => `${backendBaseUrl}${path}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
};

const loadStoredAuthSession = () => {
  try {
    const saved = window.localStorage.getItem(authStorageKey);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
};

const saveAuthSession = (session) => {
  authSession = session;
  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
};

const clearAuthSession = () => {
  authSession = null;
  window.localStorage.removeItem(authStorageKey);
};

const authHeaders = () =>
  authSession?.token
    ? {
        Authorization: `Bearer ${authSession.token}`,
      }
    : {};

const setStatus = (text) => {
  statusNode.textContent = text;
};

const showLogin = (message = "") => {
  loginPanel.hidden = false;
  dashboard.hidden = true;
  refreshButton.hidden = true;
  logoutButton.hidden = true;
  loginMessage.textContent = message;
  setStatus("Sign in to view activity");
  window.setTimeout(() => usernameInput.focus(), 0);
};

const showDashboard = () => {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  refreshButton.hidden = false;
  logoutButton.hidden = false;
  loginMessage.textContent = "";
};

const coerceNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const scoreParts = (entry) => {
  const state = entry.test_state || {};
  const result = entry.result || {};
  const total = coerceNumber(result.total) || coerceNumber(state.total);
  const passed = total ? Math.min(total, coerceNumber(result.passed) || coerceNumber(state.passed)) : 0;
  const percent = total ? Math.round((passed / total) * 100) : null;
  return { passed, total, percent };
};

const scoreText = (entry) => {
  const score = scoreParts(entry);
  return score.total ? `${score.passed}/${score.total}` : "-";
};

const scorePercentText = (entry) => {
  const score = scoreParts(entry);
  return score.total ? `${score.percent}%` : "-";
};

const isChatEvent = (entry) => ["chat", "chat_error"].includes(entry.event_type);

const isCodeEvent = (entry) => ["run", "submit", "activity"].includes(entry.event_type);

const truncateText = (value, limit = 520) => {
  const text = String(value ?? "").trim();
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit).trim()}...`;
};

const eventLabel = (type) => {
  const labels = {
    run: "Run",
    submit: "Submit",
    chat: "AI Tutor",
    chat_error: "Tutor Error",
  };
  return labels[type] || "Activity";
};

const problemLabel = (entry) => {
  const problem = entry.problem || {};
  const english = problem.englishName || problem.id || "Unknown problem";
  const chinese = problem.chineseName ? ` ${problem.chineseName}` : "";
  return `${english}${chinese}`;
};

const renderSummary = (entries) => {
  const counts = entries.reduce(
    (acc, entry) => {
      acc.total += 1;
      acc[entry.event_type] = (acc[entry.event_type] || 0) + 1;
      const score = scoreParts(entry);
      if (score.total) {
        const ratio = score.passed / score.total;
        if (ratio > acc.bestRatio) {
          acc.bestRatio = ratio;
          acc.bestScore = `${score.passed}/${score.total}`;
        }
      }
      return acc;
    },
    { total: 0, run: 0, submit: 0, chat: 0, chat_error: 0, bestRatio: -1, bestScore: "-" },
  );

  summaryGrid.innerHTML = [
    ["Total Events", counts.total],
    ["Run / Submit", `${counts.run || 0} / ${counts.submit || 0}`],
    ["Tutor Chats", (counts.chat || 0) + (counts.chat_error || 0)],
    ["Best Score", counts.bestScore],
  ]
    .map(
      ([label, value]) => `
        <article class="summary-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </article>
      `,
    )
    .join("");
};

const renderCases = (entry) => {
  const visible = entry.test_state?.visible || [];
  if (!visible.length) {
    return "";
  }

  return `
    <div class="case-grid">
      ${visible
        .map(
          (item) => `
            <article class="case-item ${item.passed ? "pass" : "fail"}">
              <strong>Case ${escapeHtml(item.index)} · ${item.passed ? "PASS" : "FAIL"}</strong>
              <code>input: ${escapeHtml(item.input || "-")}</code>
              <code>expected: ${escapeHtml(item.expected || "-")}</code>
              <code>actual: ${escapeHtml(item.actual || "-")}</code>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
};

const renderChatBody = (entry) => {
  const chat = entry.chat || {};
  if (!chat.learner_message && !chat.tutor_reply && !chat.error) {
    return "";
  }

  return `
    <section class="timeline-chat">
      ${chat.learner_message ? `
        <div class="snapshot-row user">
          <span>User</span>
          <p>${escapeHtml(truncateText(chat.learner_message, 600))}</p>
        </div>
      ` : ""}
      ${chat.tutor_reply ? `
        <div class="snapshot-row tutor">
          <span>Tutor</span>
          <p>${escapeHtml(truncateText(chat.tutor_reply, 900))}</p>
        </div>
      ` : ""}
      ${chat.error ? `
        <div class="snapshot-row error">
          <span>Error</span>
          <p>${escapeHtml(truncateText(chat.error, 420))}</p>
        </div>
      ` : ""}
    </section>
  `;
};

const renderCode = (entry) => {
  const code = entry.code || {};
  if (!code.source) {
    return "";
  }

  return `
    <section class="code-block">
      <details>
        <summary>Code Snapshot · ${escapeHtml(code.language || "unknown")}</summary>
        <pre>${escapeHtml(code.source)}</pre>
      </details>
    </section>
  `;
};

const renderCodeBody = (entry) => {
  const state = entry.test_state || {};
  const hidden = state.hidden || {};
  const result = entry.result || {};
  const output = result.error || entry.code?.output || entry.code?.status || "";

  return `
    <section class="timeline-code">
      <div class="score-strip">
        <strong>${escapeHtml(scoreText(entry))}</strong>
        <span>${escapeHtml(scorePercentText(entry))} accuracy</span>
      </div>
      <div class="score-line">
        <span>Scope: ${escapeHtml(state.scope || entry.result?.scope || "-")}</span>
        <span>Visible cases: ${(state.visible || []).length}</span>
        <span>Hidden: ${escapeHtml(hidden.passed ?? 0)}/${escapeHtml(hidden.total ?? 0)} passed</span>
      </div>
      ${output ? `<p class="code-output">${escapeHtml(truncateText(output, 420))}</p>` : ""}
      ${renderCases(entry)}
      ${renderCode(entry)}
    </section>
  `;
};

const renderAccuracyChart = (entries) => {
  const chartEntries = entries
    .map((entry, index) => ({ entry, index, score: scoreParts(entry) }))
    .filter((item) => isCodeEvent(item.entry) && item.score.total);

  if (!chartEntries.length) {
    accuracyChart.innerHTML = `
      <div class="chart-empty">
        <strong>No scored code events yet.</strong>
        <span>Run or submit code to start drawing the accuracy curve.</span>
      </div>
    `;
    return;
  }

  const width = 860;
  const height = 260;
  const left = 50;
  const right = 24;
  const top = 24;
  const bottom = 44;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxIndex = Math.max(entries.length - 1, 1);
  const xFor = (index) => left + (index / maxIndex) * plotWidth;
  const yFor = (percent) => top + (1 - percent / 100) * plotHeight;
  const pathPoints = chartEntries.map((item) => `${xFor(item.index).toFixed(1)},${yFor(item.score.percent).toFixed(1)}`).join(" ");
  const yTicks = [0, 25, 50, 75, 100];
  const latest = chartEntries[chartEntries.length - 1];

  accuracyChart.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Accuracy trend chart">
      ${yTicks
        .map((tick) => {
          const y = yFor(tick).toFixed(1);
          return `
            <line class="chart-grid" x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"></line>
            <text class="chart-y-label" x="${left - 12}" y="${Number(y) + 4}" text-anchor="end">${tick}%</text>
          `;
        })
        .join("")}
      <line class="chart-axis" x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}"></line>
      <line class="chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}"></line>
      <polyline class="chart-line" points="${pathPoints}"></polyline>
      ${chartEntries
        .map((item) => {
          const x = xFor(item.index).toFixed(1);
          const y = yFor(item.score.percent).toFixed(1);
          const label = `${eventLabel(item.entry.event_type)} #${item.index + 1}: ${item.score.passed}/${item.score.total}`;
          return `
            <g>
              <circle class="chart-point ${escapeHtml(item.entry.event_type || "activity")}" cx="${x}" cy="${y}" r="6"></circle>
              <title>${escapeHtml(label)}</title>
            </g>
          `;
        })
        .join("")}
      <text class="chart-x-label" x="${width / 2}" y="${height - 10}" text-anchor="middle">Interaction order</text>
      <text class="chart-latest" x="${width - right}" y="${top + 8}" text-anchor="end">Latest ${latest.score.percent}%</text>
    </svg>
  `;
};

const renderTimelineEntry = (entry, index) => {
  const type = entry.event_type || "activity";
  const side = isChatEvent(entry) ? "left" : "right";

  return `
    <article class="timeline-item ${side} ${escapeHtml(type)}">
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-card">
        <div class="entry-top">
          <div class="entry-title">
            <span class="timeline-kicker">#${index + 1} · ${escapeHtml(eventLabel(type))}</span>
            <strong>${escapeHtml(problemLabel(entry))}</strong>
            <time>${escapeHtml(formatTime(entry.client_created_at || entry.created_at))}</time>
          </div>
          <div class="entry-badges">
            <span class="badge ${escapeHtml(type)}">${escapeHtml(eventLabel(type))}</span>
            ${isCodeEvent(entry) ? `<span class="badge">${escapeHtml(entry.code?.language || "unknown")}</span>` : ""}
            ${isCodeEvent(entry) ? `<span class="badge">${escapeHtml(scoreText(entry))}</span>` : ""}
          </div>
        </div>
        ${isChatEvent(entry) ? renderChatBody(entry) : renderCodeBody(entry)}
      </div>
    </article>
  `;
};

const renderEntries = (entries) => {
  const orderedEntries = [...entries].sort((a, b) => {
    const left = Date.parse(a.client_created_at || a.created_at || 0);
    const right = Date.parse(b.client_created_at || b.created_at || 0);
    return left - right;
  });

  renderSummary(orderedEntries);
  renderAccuracyChart(orderedEntries);

  if (!orderedEntries.length) {
    timeline.innerHTML = `
      <div class="empty-state">
        <strong>No structured records yet.</strong>
        <span>Run code, submit, or chat with AI Tutor from the main page.</span>
      </div>
    `;
    return;
  }

  timeline.innerHTML = orderedEntries.map(renderTimelineEntry).join("");
  timeline.scrollTop = timeline.scrollHeight;
};

const loadActivity = async () => {
  setStatus("Loading activity...");
  const response = await fetch(backendUrl(`/api/my-activity?limit=${activityLimit}`), {
    headers: authHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not load activity.");
  }

  showDashboard();
  renderEntries(data.entries || []);
  setStatus(`${data.user?.username || "Account"} · ${data.count || 0} records`);
};

const verifyStoredSession = async () => {
  authSession = loadStoredAuthSession();
  if (!authSession?.token) {
    showLogin();
    return;
  }

  try {
    const response = await fetch(backendUrl("/api/me"), {
      headers: authHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Session expired.");
    }

    authSession.user = data.user;
    saveAuthSession(authSession);
    await loadActivity();
  } catch (error) {
    clearAuthSession();
    showLogin("Session expired. Please log in again.");
  }
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    loginMessage.textContent = "Please enter both username and password.";
    return;
  }

  const submitButton = loginForm.querySelector("button");
  submitButton.disabled = true;
  loginMessage.textContent = "Logging in...";

  try {
    const response = await fetch(backendUrl("/api/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Login failed.");
    }

    passwordInput.value = "";
    saveAuthSession(data);
    await loadActivity();
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

refreshButton.addEventListener("click", () => {
  loadActivity().catch((error) => {
    setStatus(error.message);
  });
});

logoutButton.addEventListener("click", async () => {
  try {
    await fetch(backendUrl("/api/logout"), {
      method: "POST",
      headers: authHeaders(),
    });
  } catch (error) {
    console.warn(error);
  }

  clearAuthSession();
  showLogin("Logged out.");
});

verifyStoredSession();
