const backendBaseUrl = window.CODEMENTOR_CONFIG?.backendBaseUrl || "http://127.0.0.1:8787";
const adminStorageKey = "codementor.admin.v1";

const statusNode = document.querySelector("#admin-status");
const loginPanel = document.querySelector("#login-panel");
const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#admin-username");
const passwordInput = document.querySelector("#admin-password");
const loginMessage = document.querySelector("#login-message");
const consolePanel = document.querySelector("#admin-console");
const metricGrid = document.querySelector("#metric-grid");
const accountList = document.querySelector("#account-list");
const generatedAt = document.querySelector("#generated-at");
const refreshButton = document.querySelector("#refresh-button");
const logoutButton = document.querySelector("#logout-button");

let adminSession = null;

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

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

const loadStoredAdminSession = () => {
  try {
    const saved = window.localStorage.getItem(adminStorageKey);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
};

const saveAdminSession = (session) => {
  adminSession = session;
  window.localStorage.setItem(adminStorageKey, JSON.stringify(session));
};

const clearAdminSession = () => {
  adminSession = null;
  window.localStorage.removeItem(adminStorageKey);
};

const adminHeaders = () =>
  adminSession?.token
    ? {
        Authorization: `Bearer ${adminSession.token}`,
      }
    : {};

const setStatus = (text) => {
  statusNode.textContent = text;
};

const showLogin = (message = "") => {
  loginPanel.hidden = false;
  consolePanel.hidden = true;
  refreshButton.hidden = true;
  logoutButton.hidden = true;
  loginMessage.textContent = message;
  setStatus("Root login required");
  window.setTimeout(() => usernameInput.focus(), 0);
};

const showConsole = () => {
  loginPanel.hidden = true;
  consolePanel.hidden = false;
  refreshButton.hidden = false;
  logoutButton.hidden = false;
  loginMessage.textContent = "";
};

const renderMetrics = (accounts) => {
  const totals = accounts.reduce(
    (acc, account) => {
      acc.accounts += 1;
      acc.events += Number(account.total_events || 0);
      acc.chats += Number(account.chat_count || 0) + Number(account.chat_error_count || 0);
      acc.code += Number(account.run_count || 0) + Number(account.submit_count || 0);
      if (account.tutor_mode === "encouraging") {
        acc.encouraging += 1;
      }
      if (account.tutor_mode === "neutral") {
        acc.neutral += 1;
      }
      if (account.scaffold_mode === "fixed_low") {
        acc.fixedLow += 1;
      }
      if (account.scaffold_mode === "fixed_high") {
        acc.fixedHigh += 1;
      }
      if (account.scaffold_mode === "adaptive") {
        acc.adaptive += 1;
      }
      return acc;
    },
    { accounts: 0, events: 0, chats: 0, code: 0, encouraging: 0, neutral: 0, fixedLow: 0, fixedHigh: 0, adaptive: 0 },
  );

  metricGrid.innerHTML = [
    ["Accounts", totals.accounts],
    ["Total events", totals.events],
    ["Tutor chats", totals.chats],
    ["Run / Submit", totals.code],
    ["Low scaffold", totals.fixedLow],
    ["High scaffold", totals.fixedHigh],
    ["Adaptive", totals.adaptive],
  ]
    .map(
      ([label, value]) => `
        <article class="metric-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </article>
      `,
    )
    .join("");
};

const scoreLabel = (account) => {
  if (!account.best_total) {
    return "-";
  }
  return `${account.best_passed}/${account.best_total} (${account.best_percent}%)`;
};

const renderAccounts = (accounts) => {
  if (!accounts.length) {
    accountList.innerHTML = `
      <div class="empty-state">
        <strong>No accounts yet.</strong>
        <span>Registered learners will appear here.</span>
      </div>
    `;
    return;
  }

  accountList.innerHTML = accounts
    .map(
      (account) => `
        <article class="account-row">
          <div class="account-main">
            <strong>${escapeHtml(account.username || "-")}</strong>
            <span>${escapeHtml(account.user_id || "-")}</span>
            <span class="mode-pill">${escapeHtml(account.tutor_mode_label || account.tutor_mode || "-")}</span>
            <span class="mode-pill">${escapeHtml(account.scaffold_mode_label || account.scaffold_mode || "-")}</span>
            <span>${escapeHtml(account.condition_key || "-")}</span>
          </div>
          <div class="account-field">
            <strong>Password</strong>
            <span>${escapeHtml(account.password_note || "Hash only; plaintext unavailable.")}</span>
            <code>${escapeHtml(account.password_hash_preview || "-")}</code>
          </div>
          <div class="account-field">
            <strong>Activity</strong>
            <span>${escapeHtml(account.total_events || 0)} events</span>
            <span>${escapeHtml(account.chat_count || 0)} chats · ${escapeHtml(account.run_count || 0)} runs · ${escapeHtml(account.submit_count || 0)} submits</span>
          </div>
          <div class="account-field">
            <strong>${escapeHtml(account.latest_problem || "No problem activity")}</strong>
            <span>Last activity: ${escapeHtml(formatTime(account.last_activity_at))}</span>
            <span>Last login: ${escapeHtml(formatTime(account.last_login_at))}</span>
            <span class="score-pill ${account.best_total ? "" : "empty"}">Best score ${escapeHtml(scoreLabel(account))}</span>
          </div>
          <button class="account-action" type="button" data-user-id="${escapeHtml(account.user_id)}">Open dashboard</button>
        </article>
      `,
    )
    .join("");
};

const loadAccounts = async () => {
  setStatus("Loading accounts...");
  const response = await fetch(backendUrl("/api/admin/accounts"), {
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not load accounts.");
  }

  const accounts = data.accounts || [];
  showConsole();
  renderMetrics(accounts);
  renderAccounts(accounts);
  generatedAt.textContent = `Updated ${formatTime(data.generated_at)}`;
  setStatus(`${data.count || 0} accounts`);
};

const openDashboardForUser = async (button) => {
  const userId = button.dataset.userId;
  if (!userId) {
    return;
  }

  const popup = window.open("about:blank", "_blank");
  if (popup) {
    popup.opener = null;
    popup.document.write("<p>Opening dashboard...</p>");
  }

  button.disabled = true;
  button.textContent = "Opening...";
  try {
    const response = await fetch(backendUrl("/api/admin/impersonate"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...adminHeaders(),
      },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Could not open dashboard.");
    }

    const url = new URL("./activity.html", window.location.href);
    url.hash = `session=${encodeURIComponent(data.token)}`;
    if (popup) {
      popup.location.href = url.toString();
    } else {
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    }
  } catch (error) {
    if (popup) {
      popup.close();
    }
    setStatus(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Open dashboard";
  }
};

const verifyStoredAdminSession = async () => {
  adminSession = loadStoredAdminSession();
  if (!adminSession?.token) {
    showLogin();
    return;
  }

  try {
    await loadAccounts();
  } catch (error) {
    clearAdminSession();
    showLogin("Admin session expired. Please log in again.");
  }
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    loginMessage.textContent = "Please enter root username and password.";
    return;
  }

  const submitButton = loginForm.querySelector("button");
  submitButton.disabled = true;
  loginMessage.textContent = "Logging in...";

  try {
    const response = await fetch(backendUrl("/api/admin/login"), {
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
    saveAdminSession(data);
    await loadAccounts();
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

accountList.addEventListener("click", (event) => {
  const button = event.target.closest(".account-action");
  if (!button) {
    return;
  }
  openDashboardForUser(button);
});

refreshButton.addEventListener("click", () => {
  loadAccounts().catch((error) => {
    setStatus(error.message);
  });
});

logoutButton.addEventListener("click", async () => {
  try {
    await fetch(backendUrl("/api/admin/logout"), {
      method: "POST",
      headers: adminHeaders(),
    });
  } catch (error) {
    console.warn(error);
  }

  clearAdminSession();
  showLogin("Logged out.");
});

verifyStoredAdminSession();
