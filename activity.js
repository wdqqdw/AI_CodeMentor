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
const timeline = document.querySelector("#activity-timeline");
const refreshButton = document.querySelector("#refresh-button");
const logoutButton = document.querySelector("#logout-button");

let authSession = null;

const backendUrl = (path) => `${backendBaseUrl}${path}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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
};

const scoreText = (entry) => {
  const state = entry.test_state || {};
  const result = entry.result || {};
  const passed = Number(result.passed || state.passed || 0);
  const total = Number(result.total || state.total || 0);
  return total ? `${passed}/${total}` : "-";
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
      const state = entry.test_state || {};
      const total = Number(state.total || 0);
      if (total) {
        const passed = Number(state.passed || 0);
        const ratio = passed / total;
        if (ratio > acc.bestRatio) {
          acc.bestRatio = ratio;
          acc.bestScore = `${passed}/${total}`;
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

const renderChat = (entry) => {
  const chat = entry.chat || {};
  if (!chat.learner_message && !chat.tutor_reply && !chat.error) {
    return "";
  }

  return `
    <section class="chat-block">
      <h3>Conversation Snapshot</h3>
      ${chat.learner_message ? `<p><strong>User:</strong> ${escapeHtml(chat.learner_message)}</p>` : ""}
      ${chat.tutor_reply ? `<p><strong>Tutor:</strong> ${escapeHtml(chat.tutor_reply)}</p>` : ""}
      ${chat.error ? `<p><strong>Error:</strong> ${escapeHtml(chat.error)}</p>` : ""}
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

const renderEntry = (entry) => {
  const state = entry.test_state || {};
  const hidden = state.hidden || {};
  const type = entry.event_type || "activity";

  return `
    <article class="activity-entry">
      <div class="entry-top">
        <div class="entry-title">
          <strong>${escapeHtml(problemLabel(entry))}</strong>
          <span>${escapeHtml(formatTime(entry.created_at))}</span>
        </div>
        <div class="entry-badges">
          <span class="badge ${escapeHtml(type)}">${escapeHtml(eventLabel(type))}</span>
          <span class="badge">${escapeHtml(entry.code?.language || "unknown")}</span>
          <span class="badge">${escapeHtml(scoreText(entry))}</span>
        </div>
      </div>
      <div class="score-line">
        <span>Scope: ${escapeHtml(state.scope || entry.result?.scope || "-")}</span>
        <span>Visible cases: ${(state.visible || []).length}</span>
        <span>Hidden: ${escapeHtml(hidden.passed ?? 0)}/${escapeHtml(hidden.total ?? 0)} passed</span>
      </div>
      ${renderCases(entry)}
      ${renderChat(entry)}
      ${renderCode(entry)}
    </article>
  `;
};

const renderEntries = (entries) => {
  renderSummary(entries);

  if (!entries.length) {
    timeline.innerHTML = `
      <div class="empty-state">
        <strong>No structured records yet.</strong>
        <span>Run code, submit, or chat with AI Tutor from the main page.</span>
      </div>
    `;
    return;
  }

  timeline.innerHTML = entries.map(renderEntry).join("");
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
