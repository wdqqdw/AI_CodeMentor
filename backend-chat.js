const backendUrl = "http://127.0.0.1:8787";
const historyCharLimit = 100000;
const statusNode = document.querySelector("#backend-status");
const threadNode = document.querySelector("#debug-thread");
const formNode = document.querySelector("#debug-form");
const inputNode = document.querySelector("#debug-input");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const setStatus = (text, state = "") => {
  statusNode.textContent = text;
  statusNode.className = state;
};

const clearThread = () => {
  threadNode.innerHTML = "";
};

const formatEntryTime = (value) => {
  if (!value) {
    return "";
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

const renderEmptyState = () => {
  threadNode.innerHTML = `
    <div class="empty-state">
      <strong>No backend history yet.</strong>
      <span>Send a message from the main AI Tutor or this debug page.</span>
    </div>
  `;
};

const renderEntry = (entry) => {
  const article = document.createElement("article");
  article.className = "debug-entry";
  article.dataset.entryId = entry.id || "";

  const source = entry.endpoint === "/api/debug-chat" ? "Backend Chat" : "Main Tutor";
  const template = entry.template_used ? "template on" : "raw message";
  const outputTitle = entry.error ? "Error" : "Model Output";
  const outputClass = entry.error ? "error" : "output";

  article.innerHTML = `
    <span class="entry-time">${escapeHtml(formatEntryTime(entry.created_at))}</span>
    <div class="entry-meta">
      <span>${escapeHtml(source)}</span>
      <span>${escapeHtml(template)}</span>
      <span>${escapeHtml(entry.model || "")}</span>
    </div>
    <section class="debug-card">
      <h2>Raw Prompt</h2>
      <pre>${escapeHtml(entry.raw_prompt || "No prompt returned.")}</pre>
    </section>
    <section class="debug-card ${outputClass}">
      <h2>${outputTitle}</h2>
      <pre>${escapeHtml(entry.error || entry.message || "")}</pre>
    </section>
  `;

  threadNode.appendChild(article);
};

const renderHistory = (entries) => {
  clearThread();
  if (!entries.length) {
    renderEmptyState();
    return;
  }

  entries.forEach(renderEntry);
  threadNode.scrollTop = threadNode.scrollHeight;
};

const loadHistory = async ({ quiet = false } = {}) => {
  try {
    const response = await fetch(`${backendUrl}/api/history?limit=${historyCharLimit}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not load history.");
    }

    renderHistory(data.entries || []);
    setStatus(`History loaded: ${data.count || 0} entries / ${historyCharLimit} chars`, "ok");
  } catch (error) {
    if (!quiet) {
      setStatus("Local backend unavailable", "fail");
      renderEmptyState();
    }
  }
};

const buildDebugPayload = (message) => ({
  messages: [
    {
      role: "user",
      content: message,
    },
  ],
});

const checkHealth = async () => {
  try {
    const response = await fetch(`${backendUrl}/health`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Health check failed.");
    }
    setStatus(`Local backend ready: ${data.model}`, "ok");
  } catch (error) {
    setStatus("Local backend unavailable", "fail");
  }
};

formNode.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = inputNode.value.trim();
  if (!text) {
    return;
  }

  const button = formNode.querySelector("button");
  button.disabled = true;
  inputNode.disabled = true;
  setStatus("Sending raw message...", "");

  try {
    const response = await fetch(`${backendUrl}/api/debug-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildDebugPayload(text)),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Debug request failed.");
    }
    inputNode.value = "";
    await loadHistory();
    setStatus(`Raw message sent: ${data.model}`, "ok");
  } catch (error) {
    const failedEntry = {
      id: `local-error-${Date.now()}`,
      created_at: new Date().toISOString(),
      endpoint: "/api/debug-chat",
      template_used: false,
      raw_prompt: `[user]\n${text}`,
      error: `${error.message}\n\nMake sure the local backend is running at ${backendUrl}.`,
    };
    renderHistory([failedEntry]);
    setStatus("Local backend unavailable", "fail");
  } finally {
    button.disabled = false;
    inputNode.disabled = false;
    inputNode.focus();
  }
});

checkHealth();
loadHistory();
window.setInterval(() => loadHistory({ quiet: true }), 5000);
