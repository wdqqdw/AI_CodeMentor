const backendUrl = "http://127.0.0.1:8787";
const statusNode = document.querySelector("#backend-status");
const threadNode = document.querySelector("#debug-thread");
const formNode = document.querySelector("#debug-form");
const inputNode = document.querySelector("#debug-input");

const nowLabel = () =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const setStatus = (text, state = "") => {
  statusNode.textContent = text;
  statusNode.className = state;
};

const clearEmptyState = () => {
  const emptyState = threadNode.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
};

const appendEntry = ({ prompt, output, error }) => {
  clearEmptyState();

  const entry = document.createElement("article");
  entry.className = "debug-entry";
  entry.innerHTML = `
    <span class="entry-time">${nowLabel()}</span>
    <section class="debug-card">
      <h2>Raw Prompt</h2>
      <pre>${escapeHtml(prompt || "No prompt returned.")}</pre>
    </section>
    <section class="debug-card ${error ? "error" : "output"}">
      <h2>${error ? "Error" : "Model Output"}</h2>
      <pre>${escapeHtml(output || "")}</pre>
    </section>
  `;

  threadNode.appendChild(entry);
  threadNode.scrollTop = threadNode.scrollHeight;
};

const buildDebugPayload = (message) => ({
  message,
  problem: {
    englishName: "Backend Debug Session",
    chineseName: "后端调试会话",
    category: "Debug",
    difficulty: "Easy",
    englishDescription: "A standalone page for testing the local AI Tutor backend and viewing raw prompts.",
    examples: [
      {
        input: "message = \"请只回复 OK\"",
        output: "OK",
      },
    ],
  },
  code: {
    language: "python",
    source: "class Solution:\\n    pass",
    status: "Debug page",
    output: "empty",
  },
  testState: {
    scope: "none",
    passed: 0,
    total: 0,
    visible: [],
    hidden: {
      total: 0,
      passed: 0,
      failed: 0,
    },
  },
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
  setStatus("Sending request...", "");

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
    appendEntry({
      prompt: data.raw_prompt || JSON.stringify(data.messages, null, 2),
      output: data.message,
    });
    setStatus(`Local backend ready: ${data.model}`, "ok");
  } catch (error) {
    appendEntry({
      prompt: JSON.stringify(buildDebugPayload(text), null, 2),
      output: `${error.message}\n\nMake sure the local backend is running at ${backendUrl}.`,
      error: true,
    });
    setStatus("Local backend unavailable", "fail");
  } finally {
    button.disabled = false;
    inputNode.disabled = false;
    inputNode.focus();
  }
});

checkHealth();
