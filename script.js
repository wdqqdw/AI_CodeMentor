const statusMessage = document.querySelector(".status-message");
const runButton = document.querySelector("[data-action='run']");
const submitButton = document.querySelector("[data-action='submit']");
const runButtonLabel = runButton?.querySelector("span");
const submitButtonLabel = submitButton?.querySelector("span");
const bookmarkButton = document.querySelector(".bookmark");
const chatForm = document.querySelector(".chat-composer");
const chatInput = document.querySelector("#mentor-input");
const chatThread = document.querySelector(".chat-thread");
const sendButton = document.querySelector(".send-button");
const codeEditor = document.querySelector("#code-editor");
const lineGutter = document.querySelector("#line-gutter");
const testOutput = document.querySelector("#test-output");
const tabButtons = document.querySelectorAll(".tab");
const languageSelect = document.querySelector("#language-select");
const syntaxHighlight = document.querySelector("#syntax-highlight");
const problemPanel = document.querySelector(".problem-panel");
const expandReadingButton = document.querySelector(".reading-expand-button");
const expandEditorButton = document.querySelector(".editor-expand-button");
const editorPanel = document.querySelector(".editor-panel");
const testcasesPanel = document.querySelector("#testcases-panel");
const tracebackPanel = document.querySelector("#traceback-panel");
const tracebackSummary = document.querySelector("#traceback-summary");
const tracebackContent = document.querySelector("#traceback-content");
const publicTestcases = document.querySelector("#public-testcases");
const hiddenTestcaseGrid = document.querySelector("#hidden-testcase-grid");
const hiddenTestcasesSection = document.querySelector(".hidden-testcases");
const testcaseSummary = document.querySelector("#testcase-summary");
const problemNameEn = document.querySelector("#problem-name-en");
const problemNameZh = document.querySelector("#problem-name-zh");
const problemDescription = document.querySelector("#problem-description");
const examplesContainer = document.querySelector(".examples");
const topicName = document.querySelector(".topic-link span");
const difficultyLabel = document.querySelector(".difficulty");
const catalogView = document.querySelector("#catalog-view");
const catalogList = document.querySelector("#catalog-list");
const openCatalogButton = document.querySelector("[data-action='open-catalog']");
const closeCatalogButton = document.querySelector("[data-action='close-catalog']");
const authGate = document.querySelector("#auth-gate");
const authForm = document.querySelector("#auth-form");
const authTitle = document.querySelector("#auth-title");
const authUsername = document.querySelector("#auth-username");
const authPassword = document.querySelector("#auth-password");
const authSubmit = document.querySelector("#auth-submit");
const authMessage = document.querySelector("#auth-message");
const authModeButtons = document.querySelectorAll("[data-auth-mode]");
const authTutorModeInputs = document.querySelectorAll("input[name='tutorMode']");
const tutorStyleNote = document.querySelector("#tutor-style-note");
const accountStatus = document.querySelector("#account-status");
const accountName = document.querySelector("#account-name");
const accountTutorMode = document.querySelector("#account-tutor-mode");
const logoutButton = document.querySelector("#logout-button");
const modeSwitchButtons = document.querySelectorAll("[data-left-view]");

const tutorApiUrl = window.CODEMENTOR_CONFIG?.tutorApiUrl || "http://127.0.0.1:8787/api/tutor";
const backendBaseUrl =
  window.CODEMENTOR_CONFIG?.backendBaseUrl || tutorApiUrl.replace(/\/api\/tutor\/?$/, "");
const activityApiUrl = window.CODEMENTOR_CONFIG?.activityApiUrl || `${backendBaseUrl}/api/activity`;
const authStorageKey = "codementor.auth.v1";
const problemStore = window.CODEMENTOR_PROBLEMS || {};
const problemCatalog = problemStore.problemCatalog || [];
const fallbackProblem =
  problemStore.items?.[problemStore.currentProblemId] || Object.values(problemStore.items || {})[0];
let currentProblem = fallbackProblem;
let visibleTestCount = currentProblem?.visibleTestCount || 3;
let allTests = currentProblem?.tests || [];
let visibleTests = allTests.slice(0, visibleTestCount);
let hiddenTests = allTests.slice(visibleTestCount);
let visibleTestIds = new Set(visibleTests.map((test) => test.id));
let codeTemplates = currentProblem?.initialCode || {};

const codeCache = {
  python: codeTemplates.python || codeEditor.value,
  javascript: codeTemplates.javascript || "",
};

let currentLanguage = languageSelect.value;
const pythonWorkerUrl = "./pyodide-worker.js?v=pyodide-0-28-2-worker-1";
const pythonWorkerInitTimeoutMs = 60000;
const pythonCaseTimeoutMs = 2400;
let pythonWorker = null;
let pythonWorkerReadyPromise = null;
let pythonWorkerRequestId = 0;
const pythonWorkerPending = new Map();
let latestResults = new Map();
let latestScope = "none";
let latestTraceback = "";
let latestTracebackCases = [];
let chatBusy = false;
let executionBusy = false;
let authMode = "register";
let authSession = null;
let activeProblemPath = problemStore.markdownProblemPath || "";
let expandedCatalogCategory = "";
let leftView = "lesson";
const difficultyRank = { easy: 0, medium: 1, hard: 2 };

const nowLabel = () =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const getLastMessageTimestamp = () => {
  const groups = chatThread.querySelectorAll(".message-group[data-timestamp]");
  const lastGroup = groups[groups.length - 1];
  return lastGroup ? Number(lastGroup.dataset.timestamp) : 0;
};

const shouldDisplayMessageTime = (timestamp) => {
  const previousTimestamp = getLastMessageTimestamp();
  if (!previousTimestamp) {
    return true;
  }

  return timestamp - previousTimestamp >= 3 * 60 * 1000;
};

const setStatus = (text, state = "pass") => {
  statusMessage.classList.toggle("fail", state === "fail");
  statusMessage.classList.toggle("pass", state !== "fail");
  statusMessage.lastChild.textContent = ` ${text}`;
};

const setOutput = (text, state = "") => {
  testOutput.className = `test-output ${state}`.trim();
  testOutput.textContent = text;
};

const setActiveEditorTab = (view) => {
  const nextView = view === "testcases" || view === "traceback" ? view : "code";
  tabButtons.forEach((tab) => {
    const isActive = tab.dataset.viewTab === nextView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  editorPanel.classList.toggle("show-testcases", nextView === "testcases");
  editorPanel.classList.toggle("show-traceback", nextView === "traceback");
  testcasesPanel.hidden = nextView !== "testcases";
  tracebackPanel.hidden = nextView !== "traceback";
  window.requestAnimationFrame(syncEditor);
};

const setReadingExpanded = (isExpanded) => {
  problemPanel.classList.toggle("reading-expanded", isExpanded);
  if (expandReadingButton) {
    expandReadingButton.setAttribute("aria-pressed", String(isExpanded));
    expandReadingButton.setAttribute("aria-label", isExpanded ? "Collapse problem statement" : "Expand problem statement");
    expandReadingButton.setAttribute("title", isExpanded ? "Collapse statement" : "Expand problem statement");
  }
};

const setCodeExpanded = (isExpanded) => {
  problemPanel.classList.toggle("code-expanded", isExpanded);
  expandEditorButton.setAttribute("aria-pressed", String(isExpanded));
  expandEditorButton.setAttribute("aria-label", isExpanded ? "Collapse code editor" : "Expand code editor");
  expandEditorButton.setAttribute("title", isExpanded ? "Collapse editor" : "Expand editor");
  window.requestAnimationFrame(syncEditor);
};

const setLeftView = (view) => {
  const nextView = view === "practice" ? "practice" : "lesson";
  leftView = nextView;

  if (nextView === "lesson") {
    setCodeExpanded(false);
    setReadingExpanded(false);
  }

  problemPanel.classList.toggle("lesson-mode", nextView === "lesson");
  problemPanel.classList.toggle("practice-mode", nextView === "practice");
  modeSwitchButtons.forEach((button) => {
    const isActive = button.dataset.leftView === nextView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  if (nextView === "practice") {
    window.requestAnimationFrame(syncEditor);
  }
};

const setTraceback = (text = "", summary = "No traceback", state = "") => {
  latestTraceback = String(text || "").trim();
  if (!latestTraceback) {
    latestTracebackCases = [];
  }
  editorPanel.classList.toggle("has-traceback", Boolean(latestTraceback));
  tracebackSummary.className = `traceback-summary ${state}`.trim();
  tracebackSummary.innerHTML = latestTraceback
    ? `<strong>${escapeHtml(summary)}</strong><span>Full runtime error from the latest failed run.</span>`
    : `<strong>No traceback</strong><span>Runtime errors will appear here with the full stack trace.</span>`;
  tracebackContent.textContent = latestTraceback || "Run the code to capture a traceback.";
};

const setCaseTracebacks = (cases = []) => {
  latestTracebackCases = cases;
  if (!cases.length) {
    setTraceback();
    return;
  }

  const text = cases
    .map((item) => {
      const title = `Case ${item.index}${item.id ? ` (${item.id})` : ""}: ${item.summary}`;
      return `${title}\n${"=".repeat(title.length)}\n${item.traceback}`;
    })
    .join("\n\n");

  setTraceback(text, `${cases.length} case${cases.length > 1 ? "s" : ""} with traceback`, "fail");
};

const setBusy = (isBusy, action = "") => {
  executionBusy = isBusy;
  runButton.disabled = isBusy;
  submitButton.disabled = isBusy;
  languageSelect.disabled = isBusy;
  runButton.setAttribute("aria-busy", String(isBusy && action === "run"));
  submitButton.setAttribute("aria-busy", String(isBusy && action === "submit"));
  if (runButtonLabel) {
    runButtonLabel.textContent = isBusy && action === "run" ? "Running..." : "Run";
  }
  if (submitButtonLabel) {
    submitButtonLabel.textContent = isBusy && action === "submit" ? "Submitting..." : "Submit";
  }
};

const backendUrl = (path) => `${backendBaseUrl}${path}`;

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

const setChatEnabled = (isEnabled) => {
  chatInput.disabled = !isEnabled || chatBusy;
  sendButton.disabled = !isEnabled || chatBusy;
  chatInput.placeholder = isEnabled ? "Ask me anything about this problem..." : "Create an account to use AI Tutor...";
};

const setAuthMessage = (text, state = "") => {
  authMessage.textContent = text;
  authMessage.className = `auth-message ${state}`.trim();
};

const setAuthMode = (mode) => {
  authMode = mode === "login" ? "login" : "register";
  authTitle.textContent = authMode === "register" ? "Create your account" : "Log in to continue";
  authSubmit.textContent = authMode === "register" ? "Create account" : "Log in";
  authPassword.autocomplete = authMode === "register" ? "new-password" : "current-password";
  tutorStyleNote.textContent =
    authMode === "register"
      ? "This choice is permanently bound to the account."
      : "Existing accounts keep their original tutor style. This binds only unbound legacy accounts.";
  authModeButtons.forEach((button) => {
    const isActive = button.dataset.authMode === authMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  setAuthMessage("");
};

const showAuthGate = (mode = "register", message = "") => {
  setAuthMode(mode);
  setAuthMessage(message, message ? "fail" : "");
  authGate.hidden = false;
  setChatEnabled(false);
  window.setTimeout(() => authUsername.focus(), 0);
};

const hideAuthGate = () => {
  authGate.hidden = true;
  setChatEnabled(true);
};

const updateAccountStatus = () => {
  if (!authSession?.user) {
    accountStatus.hidden = true;
    accountName.textContent = "Not signed in";
    accountTutorMode.textContent = "Tutor";
    return;
  }

  accountStatus.hidden = false;
  accountName.textContent = authSession.user.username;
  accountTutorMode.textContent = authSession.user.tutor_mode_label || "Tutor";
};

const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cloneValue = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

const formatArray = (value) => (Array.isArray(value) ? `[${value.map((item) => formatValue(item)).join(", ")}]` : formatValue(value));

const deepEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const safeIdentifier = (value, fallback) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value || "") ? value : fallback);

const setCurrentProblem = (problem) => {
  currentProblem = problem || fallbackProblem;
  visibleTestCount = currentProblem?.visibleTestCount || 3;
  allTests = currentProblem?.tests || [];
  visibleTests = allTests.slice(0, visibleTestCount);
  hiddenTests = allTests.slice(visibleTestCount);
  visibleTestIds = new Set(visibleTests.map((test) => test.id));
  codeTemplates = currentProblem?.initialCode || {};
  codeCache.python = codeTemplates.python || "";
  codeCache.javascript = codeTemplates.javascript || "";
  latestResults = new Map();
  latestScope = "none";
  setTraceback();
};

const parseFrontmatter = (markdown) => {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return [{}, markdown];
  }

  const metadata = {};
  match[1].split("\n").forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    if (key) {
      metadata[key] = rawValue;
    }
  });

  return [metadata, markdown.slice(match[0].length)];
};

const extractSection = (markdown, title) => {
  const lines = markdown.split("\n");
  const startIndex = lines.findIndex((line) => line.trim().toLowerCase() === `## ${title}`.toLowerCase());
  if (startIndex === -1) {
    return "";
  }

  const body = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith("## ")) {
      break;
    }
    body.push(lines[index]);
  }

  return body.join("\n").trim();
};

const extractFencedBlock = (section, language = "") => {
  const languagePattern = language ? language : "[A-Za-z0-9_-]*";
  const match = section.match(new RegExp("```" + languagePattern + "\\s*\\n([\\s\\S]*?)\\n```", "i"));
  return match ? match[1] : "";
};

const parseExamples = (section) => {
  const blocks = section.split(/^###\s+Example\s+\d+\s*$/gim).map((block) => block.trim()).filter(Boolean);
  return blocks.map((block) => {
    const input = block.match(/^Input:\s*(.+)$/im)?.[1]?.trim() || "";
    const output = block.match(/^Output:\s*(.+)$/im)?.[1]?.trim() || "";
    return { input, output };
  });
};

const parseListValue = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

const parseMarkdownProblem = (markdown) => {
  const [metadata, body] = parseFrontmatter(markdown);
  const testsJson = extractFencedBlock(extractSection(body, "Tests"), "json");
  const visualExamplesJson = extractFencedBlock(extractSection(body, "Visual Examples"), "json");
  const tests = testsJson ? JSON.parse(testsJson) : [];
  const visualExamples = visualExamplesJson ? JSON.parse(visualExamplesJson) : [];
  const examples = parseExamples(extractSection(body, "Examples"));
  const inputParams = parseListValue(metadata.inputParams || "");

  return {
    id: metadata.id,
    category: metadata.category,
    difficulty: metadata.difficulty,
    englishName: metadata.englishName,
    chineseName: metadata.chineseName,
    methodName: metadata.methodName,
    javascriptFunctionName: metadata.javascriptFunctionName || metadata.methodName,
    validation: metadata.validation || "array_exact",
    disclosureStyle: metadata.disclosureStyle || "default",
    inputParams,
    visibleTestCount: Number(metadata.visibleTestCount || 3),
    englishDescription: extractSection(body, "Description").trim(),
    examples,
    visualExamples,
    initialCode: {
      python: extractFencedBlock(extractSection(body, "Starter Code - Python"), "python"),
      javascript: extractFencedBlock(extractSection(body, "Starter Code - JavaScript"), "javascript"),
    },
    tests,
  };
};

const loadConfiguredProblem = async () => {
  if (!problemStore.markdownProblemPath) {
    return fallbackProblem;
  }

  const response = await fetch(problemStore.markdownProblemPath);
  if (!response.ok) {
    throw new Error(`Could not load ${problemStore.markdownProblemPath}`);
  }

  return parseMarkdownProblem(await response.text());
};

const loadProblemFromPath = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  activeProblemPath = path;
  return parseMarkdownProblem(await response.text());
};

const getCatalogProblemPath = (item) => item.path || `./problems/${item.id}.md`;

const findCategoryIdForProblemPath = (path) => {
  for (const category of problemCatalog) {
    const match = (category.items || []).some((item) => getCatalogProblemPath(item) === path);
    if (match) {
      return category.id;
    }
  }

  return "";
};

const problemSlugFromPath = (path) =>
  String(path || "")
    .replace(/^\.\/problems\//, "")
    .replace(/\.md$/, "");

const setBrowserState = (state, mode = "push") => {
  if (!window.history?.pushState || !window.history?.replaceState) {
    return;
  }

  const url =
    state.view === "problem" && state.path
      ? `#problem=${encodeURIComponent(problemSlugFromPath(state.path))}`
      : "#catalog";
  const method = mode === "replace" ? "replaceState" : "pushState";
  window.history[method](state, "", url);
};

const showCatalog = ({ reset = false, historyMode = "none" } = {}) => {
  if (!catalogView || !openCatalogButton) {
    return;
  }

  problemPanel.classList.remove("code-expanded");
  setCodeExpanded(false);
  setReadingExpanded(false);
  if (reset) {
    expandedCatalogCategory = "";
  } else if (!expandedCatalogCategory && activeProblemPath) {
    expandedCatalogCategory = findCategoryIdForProblemPath(activeProblemPath);
  }
  problemPanel.classList.add("catalog-mode");
  catalogView.hidden = false;
  openCatalogButton.setAttribute("aria-expanded", "true");
  renderCatalog();

  if (historyMode !== "none") {
    setBrowserState({ view: "catalog", expandedCatalogCategory }, historyMode);
  }
};

const hideCatalog = () => {
  if (!catalogView || !openCatalogButton) {
    return;
  }

  problemPanel.classList.remove("catalog-mode");
  catalogView.hidden = true;
  openCatalogButton.setAttribute("aria-expanded", "false");
};

const difficultyClass = (difficulty) => String(difficulty || "").toLowerCase().replace(/\s+/g, "-");

const sortCatalogItems = (items) =>
  [...items].sort((left, right) => {
    const leftRank = difficultyRank[String(left.difficulty || "").toLowerCase()] ?? 99;
    const rightRank = difficultyRank[String(right.difficulty || "").toLowerCase()] ?? 99;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return String(left.englishName || "").localeCompare(String(right.englishName || ""));
  });

const renderCatalog = () => {
  if (!catalogList) {
    return;
  }

  catalogList.innerHTML = problemCatalog
    .map((category) => {
      const isExpanded = category.id === expandedCatalogCategory;
      const items = sortCatalogItems(category.items || []);
      const countLabel = `${items.length} ${items.length === 1 ? "problem" : "problems"}`;

      return `
        <section class="catalog-category ${isExpanded ? "expanded" : ""}">
          <button class="catalog-category-button" type="button" data-category-id="${escapeHtml(category.id)}" aria-expanded="${isExpanded}">
            <span class="category-copy">
              <strong>${escapeHtml(category.name)}</strong>
              <span>${escapeHtml(category.chineseName || "")}</span>
            </span>
            <span class="category-meta">
              <span>${countLabel}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <div class="catalog-tasks" ${isExpanded ? "" : "hidden"}>
            ${items
              .map((item) => {
                const problemPath = getCatalogProblemPath(item);
                return `
                  <button class="catalog-task" type="button" data-problem-path="${escapeHtml(problemPath)}" data-parent-category-id="${escapeHtml(category.id)}">
                    <span>
                      <strong>${escapeHtml(item.englishName)}</strong>
                      <small>${escapeHtml([item.chineseName, item.tag].filter(Boolean).join(" · "))}</small>
                    </span>
                    <span class="task-difficulty ${difficultyClass(item.difficulty)}">${escapeHtml(item.difficulty || "")}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
};

const loadProblemIntoWorkspace = async (path, { historyMode = "push", parentCategoryId = "" } = {}) => {
  setBusy(true);
  setOutput("Loading problem...", "");

  try {
    if (parentCategoryId) {
      expandedCatalogCategory = parentCategoryId;
    }
    setCurrentProblem(await loadProblemFromPath(path));
    hideCatalog();
    renderProblem();
    renderTestcases();
    setOutput("Ready", "");
    setStatus("Ready");
    setTraceback();
    setActiveEditorTab("code");

    if (historyMode !== "none") {
      setBrowserState({ view: "problem", path, expandedCatalogCategory }, historyMode);
    }
  } catch (error) {
    setOutput(error.message, "fail");
    setStatus("Problem load failed", "fail");
  } finally {
    setBusy(false);
  }
};

const renderProblem = () => {
  if (!currentProblem) {
    return;
  }

  document.title = `${currentProblem.englishName} | CodeMentor AI`;
  problemNameEn.textContent = currentProblem.englishName;
  problemNameZh.textContent = currentProblem.chineseName;
  problemDescription.innerHTML = renderMarkdown(currentProblem.englishDescription);
  topicName.textContent = currentProblem.category;
  difficultyLabel.lastChild.textContent = currentProblem.difficulty;
  difficultyLabel.className = `difficulty ${difficultyClass(currentProblem.difficulty)}`;

  if (currentProblem.visualExamples?.length && examplesContainer) {
    examplesContainer.classList.add("visual-examples");
    examplesContainer.innerHTML = currentProblem.visualExamples
      .map(
        (example) => `
          <article class="visual-example-card">
            <figure>
              <img src="${escapeHtml(example.image || "")}" alt="${escapeHtml(example.alt || "")}" loading="lazy" />
            </figure>
            <div class="visual-example-copy">
              <h2>${escapeHtml(example.title || "Example")}</h2>
              <p>${renderInlineMarkdown(example.caption || "")}</p>
              <dl>
                <div>
                  <dt>Input</dt>
                  <dd>${escapeHtml(example.input || "")}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>${escapeHtml(example.output || "")}</dd>
                </div>
              </dl>
            </div>
          </article>
        `,
      )
      .join("");
  } else {
    examplesContainer?.classList.remove("visual-examples");
    document.querySelectorAll("[data-example]").forEach((exampleNode) => {
    const example = currentProblem.examples[Number(exampleNode.dataset.example)];
    if (!example) {
      exampleNode.closest(".example-block").hidden = true;
      return;
    }

    exampleNode.closest(".example-block").hidden = false;
    exampleNode.innerHTML = `<strong>Input:</strong> ${escapeHtml(example.input)}\n<strong>Output:</strong> ${escapeHtml(example.output)}`;
    });
  }

  codeEditor.value = codeTemplates[currentLanguage] || codeEditor.value;
};

const getCaseResult = (test) => latestResults.get(test.id);

const getResultState = (result) => {
  if (!result) {
    return "pending";
  }

  if (result.error) {
    return "error";
  }

  return result.passed ? "pass" : "fail";
};

const getResultStatus = (result) => {
  if (!result) {
    return "READY";
  }

  if (result.error) {
    return "ERROR";
  }

  return result.passed ? "PASS" : "FAIL";
};

const getTestInput = (test) => {
  if (test.input && typeof test.input === "object") {
    return test.input;
  }

  const input = {};
  if ("nums" in test) {
    input.nums = test.nums;
  }
  if ("target" in test) {
    input.target = test.target;
  }
  if ("s" in test) {
    input.s = test.s;
  }
  if ("t" in test) {
    input.t = test.t;
  }
  if ("n" in test) {
    input.n = test.n;
  }
  return input;
};

const getInputParams = () => {
  if (currentProblem?.inputParams?.length) {
    return currentProblem.inputParams;
  }

  if (currentProblem?.validation === "two_sum_indices" || currentProblem?.methodName === "twoSum") {
    return ["nums", "target"];
  }

  return ["nums"];
};

const getTestArgs = (test) => {
  const input = getTestInput(test);
  return getInputParams().map((name) => cloneValue(input[name]));
};

const getExpected = (test) => test.expected;

const canRevealCaseInput = (test) => currentProblem?.disclosureStyle !== "grouped_hints" && visibleTestIds.has(test.id);

const formatCaseInput = (test) => {
  if (test.displayInput) {
    return test.displayInput;
  }

  const input = getTestInput(test);
  return getInputParams()
    .filter((name) => input[name] !== undefined)
    .map((name) => `${name} = ${formatValue(input[name])}`)
    .join(", ");
};

const renderTestcases = () => {
  if (currentProblem?.disclosureStyle === "grouped_hints") {
    renderGroupedHintTestcases();
    return;
  }

  publicTestcases.classList.remove("grouped-testcases");
  if (hiddenTestcasesSection) {
    hiddenTestcasesSection.hidden = false;
  }

  publicTestcases.innerHTML = visibleTests
    .map((test, index) => {
      const result = getCaseResult(test);
      const state = getResultState(result);
      const actual = result ? (result.error ? result.error : formatValue(result.result)) : "-";
      const status = getResultStatus(result);

      return `
        <article class="testcase-card ${state}">
          <h3><span>Case ${index + 1}</span><span class="case-status">${status}</span></h3>
          <pre class="case-detail">${escapeHtml(formatCaseInput(test))}
expected = ${escapeHtml(formatValue(getExpected(test)))}
actual = ${escapeHtml(actual)}</pre>
        </article>
      `;
    })
    .join("");

  hiddenTestcaseGrid.innerHTML = hiddenTests
    .map((test, index) => {
      const result = getCaseResult(test);
      const state = getResultState(result);
      return `<div class="hidden-case ${state}" title="Hidden case ${visibleTestCount + index + 1}">${visibleTestCount + index + 1}</div>`;
    })
    .join("");

  const results = Array.from(latestResults.values());
  const passed = results.filter((item) => item.passed).length;
  const total = latestScope === "all" ? allTests.length : visibleTests.length;
  const label = latestScope === "all" ? "All testcases" : latestScope === "visible" ? "Visible testcases" : "Score";
  const detail =
    latestScope === "none"
      ? "Run the code to see testcase results."
      : `${passed}/${total} passed${latestScope === "visible" ? ". Hidden cases remain locked until Submit." : "."}`;

  testcaseSummary.innerHTML = `<strong>${label}</strong><span>${detail}</span>`;
};

const groupTests = (tests) => {
  const groups = [];
  const groupMap = new Map();

  tests.forEach((test, index) => {
    const name = test.group || "General";
    if (!groupMap.has(name)) {
      const group = { name, tests: [] };
      groups.push(group);
      groupMap.set(name, group);
    }

    groupMap.get(name).tests.push({ test, index });
  });

  return groups;
};

const testcaseGroupDescriptions = {
  "Tier 1 · Easy · Core Rules": "Warm up with board shape, adjacency, duplicate output, and no-reuse basics.",
  "Tier 2 · Easy+ · Backtracking Paths": "Practice path state: 8 directions, bends, starts, and restoring visited cells.",
  "Tier 3 · Medium · Prefix Pruning": "Focus on Trie/prefix pruning and shared dictionary stems.",
  "Tier 4 · Medium+ · Edge Cases": "Check empty inputs, rectangular boards, repeated letters, and uncommon shapes.",
  "Tier 5 · Hard · Mixed Rule Stacks": "Several correctness rules interact in one board; debug one rule at a time.",
  "Tier 6 · Hard · Corner Cases": "Focus on unusual inputs, duplicates, one-dimensional boards, and literal q/u cells.",
  "Tier 7 · Very Hard · Performance & Pruning": "These cases reward Trie pruning and punish repeated full-board searches.",
  "Tier 8 · Hard · Integration Challenge": "These combine earlier rules on denser boards with several tempting near matches.",
  "Tier 9 · Very Hard · Scale and Shape": "Larger or less regular boards test shape handling, boundaries, and path discipline.",
  "Tier 10 · Performance · Prefix Pruning": "These cases are measured to separate repeated word-by-word DFS from shared-prefix pruning.",
  "Tier 11 · Final · No Hints": "No hints here. These combine correctness and performance pressure.",
};

const renderGroupedHintTestcases = () => {
  publicTestcases.classList.add("grouped-testcases");
  if (hiddenTestcasesSection) {
    hiddenTestcasesSection.hidden = true;
  }

  publicTestcases.innerHTML = groupTests(allTests)
    .map((group) => {
      const groupDescription = testcaseGroupDescriptions[group.name] || "Use this group to narrow the kind of mistake to inspect.";
      const casesHtml = group.tests
        .map(({ test, index }) => {
          const result = getCaseResult(test);
          const state = getResultState(result);
          const status = getResultStatus(result);
          const hint = test.locked ? "" : test.hint || "";
          const hintHtml = hint ? `<span class="case-hint">${escapeHtml(hint)}</span>` : "";

          return `
            <article class="hint-case ${state} ${hint ? "" : "no-hint"}">
              <div>
                <strong>Case ${index + 1}</strong>
                ${hintHtml}
              </div>
              <span class="case-status">${status}</span>
            </article>
          `;
        })
        .join("");

      return `
        <section class="testcase-group">
          <header>
            <div>
              <strong>${escapeHtml(group.name)}</strong>
              <p>${escapeHtml(groupDescription)}</p>
            </div>
            <span>${group.tests.length} cases</span>
          </header>
          <div class="hint-case-list">${casesHtml}</div>
        </section>
      `;
    })
    .join("");

  const results = Array.from(latestResults.values());
  const passed = results.filter((item) => item.passed).length;
  const detail =
    latestScope === "none"
      ? "Run the code to see grouped testcase results."
      : `${passed}/${allTests.length} passed. Inputs and expected answers stay hidden.`;

  testcaseSummary.innerHTML = `<strong>Grouped testcases</strong><span>${detail}</span>`;
};

const pythonKeywords =
  "False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield";
const pythonBuiltins = "enumerate|len|range|dict|list|set|sum|min|max|print|zip|map|int|str|float|bool";
const pythonTypes = "List|Dict|Set|Tuple|Optional";
const jsKeywords =
  "break|case|catch|class|const|continue|default|else|export|extends|finally|for|function|if|import|let|new|return|switch|throw|try|var|while|yield";
const jsBuiltins = "Array|Map|Set|Number|String|Boolean|Object|Math";

const tokenSets = {
  python: {
    keywords: new Set(pythonKeywords.split("|")),
    builtins: new Set(pythonBuiltins.split("|")),
    types: new Set(pythonTypes.split("|")),
  },
  javascript: {
    keywords: new Set(jsKeywords.split("|")),
    builtins: new Set(jsBuiltins.split("|")),
    types: new Set(),
  },
};

const wrapToken = (className, value) => `<span class="${className}">${escapeHtml(value)}</span>`;

const readStringToken = (line, start) => {
  const quote = line[start];
  const triple = line.startsWith(quote.repeat(3), start);
  const opener = triple ? quote.repeat(3) : quote;
  let index = start + opener.length;

  while (index < line.length) {
    if (triple && line.startsWith(opener, index)) {
      return line.slice(start, index + opener.length);
    }

    if (!triple && line[index] === quote) {
      return line.slice(start, index + 1);
    }

    if (!triple && line[index] === "\\") {
      index += 2;
    } else {
      index += 1;
    }
  }

  return line.slice(start);
};

const highlightLine = (line, language) => {
  const sets = tokenSets[language];
  const commentMarker = language === "python" ? "#" : "//";
  let html = "";
  let index = 0;
  let previousWord = "";

  while (index < line.length) {
    if (line.startsWith(commentMarker, index)) {
      html += wrapToken("tok-comment", line.slice(index));
      break;
    }

    const char = line[index];

    if (char === "\"" || char === "'") {
      const token = readStringToken(line, index);
      html += wrapToken("tok-string", token);
      index += token.length;
      previousWord = "";
      continue;
    }

    const numberMatch = line.slice(index).match(/^\d+(?:\.\d+)?/);
    if (numberMatch) {
      html += wrapToken("tok-number", numberMatch[0]);
      index += numberMatch[0].length;
      previousWord = "";
      continue;
    }

    const wordMatch = line.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      let className = "";

      if ((language === "python" && previousWord === "def") || (language === "javascript" && previousWord === "function")) {
        className = "tok-function";
      } else if (language === "python" && previousWord === "class") {
        className = "tok-class";
      } else if (sets.keywords.has(word)) {
        className = "tok-keyword";
      } else if (sets.types.has(word)) {
        className = "tok-type";
      } else if (sets.builtins.has(word)) {
        className = "tok-builtin";
      }

      html += className ? wrapToken(className, word) : escapeHtml(word);
      previousWord = word;
      index += word.length;
      continue;
    }

    if (/^[+\-*/%=<>!&|:[\]{}().,]+$/.test(char)) {
      html += wrapToken("tok-operator", char);
      index += 1;
      continue;
    }

    html += escapeHtml(char);
    if (!/\s/.test(char)) {
      previousWord = "";
    }
    index += 1;
  }

  return html || " ";
};

const renderHighlight = () => {
  const language = languageSelect.value;
  syntaxHighlight.innerHTML = codeEditor.value
    .split("\n")
    .map((line) => highlightLine(line || " ", language))
    .join("\n");
};

const syncLineNumbers = () => {
  const count = Math.max(8, codeEditor.value.split("\n").length);
  lineGutter.textContent = Array.from({ length: count }, (_, index) => index + 1).join("\n");
};

const syncScroll = () => {
  syntaxHighlight.scrollTop = codeEditor.scrollTop;
  syntaxHighlight.scrollLeft = codeEditor.scrollLeft;
  lineGutter.scrollTop = codeEditor.scrollTop;
};

const syncEditor = () => {
  syncLineNumbers();
  renderHighlight();
  syncScroll();
};

const getJavaScriptSolution = () => {
  const source = codeEditor.value;
  const functionName = safeIdentifier(currentProblem?.javascriptFunctionName || currentProblem?.methodName || "twoSum", "twoSum");
  const factory = new Function(
    `"use strict";\n${source}\nreturn typeof ${functionName} === "function" ? ${functionName} : null;`,
  );
  const solution = factory();

  if (typeof solution !== "function") {
    throw new Error(`Define a function named ${functionName}.`);
  }

  return solution;
};

const waitForPaint = () =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => window.setTimeout(resolve, 0));
  });

const makeRuntimeError = (errorLike) => {
  if (errorLike instanceof Error) {
    return errorLike;
  }

  const runtimeError = new Error(errorLike?.message || String(errorLike || "Unknown runtime error"));
  runtimeError.name = errorLike?.name || "RuntimeError";
  if (errorLike?.stack) {
    runtimeError.stack = errorLike.stack;
    runtimeError.pythonTraceback = errorLike.stack;
  }
  return runtimeError;
};

const rejectPendingPythonRequests = (error) => {
  pythonWorkerPending.forEach((pending) => {
    window.clearTimeout(pending.timeoutId);
    pending.reject(error);
  });
  pythonWorkerPending.clear();
};

const resetPythonWorker = (reason = null) => {
  if (pythonWorker) {
    pythonWorker.terminate();
    pythonWorker = null;
  }
  pythonWorkerReadyPromise = null;

  if (reason) {
    rejectPendingPythonRequests(reason);
  }
};

const handlePythonWorkerMessage = (event) => {
  const { id, ok, result, error } = event.data || {};
  const pending = pythonWorkerPending.get(id);
  if (!pending) {
    return;
  }

  window.clearTimeout(pending.timeoutId);
  pythonWorkerPending.delete(id);

  if (ok) {
    pending.resolve(result);
  } else {
    pending.reject(makeRuntimeError(error));
  }
};

const handlePythonWorkerFailure = (event) => {
  const error = makeRuntimeError(event?.message ? { name: "WorkerError", message: event.message } : event?.error || event);
  resetPythonWorker(error);
};

const createPythonWorker = () => {
  if (pythonWorker) {
    return pythonWorker;
  }

  pythonWorker = new Worker(pythonWorkerUrl);
  pythonWorker.addEventListener("message", handlePythonWorkerMessage);
  pythonWorker.addEventListener("error", handlePythonWorkerFailure);
  pythonWorker.addEventListener("messageerror", handlePythonWorkerFailure);
  return pythonWorker;
};

const sendPythonWorkerRequest = (payload, timeoutMs) => {
  const worker = createPythonWorker();
  const id = pythonWorkerRequestId + 1;
  pythonWorkerRequestId = id;

  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      pythonWorkerPending.delete(id);
      const timeoutError = new Error(
        `Python execution timed out after ${Math.round(timeoutMs)}ms. Try shared-prefix pruning or a Trie to avoid exhaustive search.`,
      );
      timeoutError.name = "TimeoutError";
      reject(timeoutError);
      resetPythonWorker(timeoutError);
    }, timeoutMs);

    pythonWorkerPending.set(id, { resolve, reject, timeoutId });
    worker.postMessage({ ...payload, id });
  });
};

const ensurePythonRuntime = async () => {
  if (!pythonWorkerReadyPromise) {
    setOutput("Loading Python runtime...", "");
    pythonWorkerReadyPromise = sendPythonWorkerRequest({ type: "init" }, pythonWorkerInitTimeoutMs).catch((error) => {
      resetPythonWorker();
      throw error;
    });
  }

  return pythonWorkerReadyPromise;
};

const runPythonCase = async (test) => {
  await ensurePythonRuntime();
  const methodName = safeIdentifier(currentProblem?.methodName || "twoSum", "twoSum");
  const timeLimitMs = Number(test.timeLimitMs || 0);
  const timeoutMs = Math.max(pythonCaseTimeoutMs, timeLimitMs + 600);
  return sendPythonWorkerRequest(
    {
      type: "run",
      code: codeEditor.value,
      args: getTestArgs(test),
      methodName,
    },
    timeoutMs,
  );
};

const isValidTwoSum = (result, test) => {
  const input = getTestInput(test);
  const nums = input.nums;
  const target = input.target;
  if (!Array.isArray(result) || result.length !== 2) {
    return false;
  }

  const [first, second] = result;
  return (
    Number.isInteger(first) &&
    Number.isInteger(second) &&
    first !== second &&
    first >= 0 &&
    second >= 0 &&
    first < nums.length &&
    second < nums.length &&
    nums[first] + nums[second] === target
  );
};

const normalizeStringSet = (value) => {
  if (!Array.isArray(value)) {
    return null;
  }

  return [...new Set(value.map((item) => String(item)))].sort();
};

const isValidStringSet = (result, test) => {
  const normalizedResult = normalizeStringSet(result);
  const normalizedExpected = normalizeStringSet(getExpected(test));
  return normalizedResult !== null && normalizedExpected !== null && deepEqual(normalizedResult, normalizedExpected);
};

const isValidResult = (result, test) => {
  if (currentProblem?.validation === "two_sum_indices") {
    return isValidTwoSum(result, test);
  }

  if (currentProblem?.validation === "string_set") {
    return isValidStringSet(result, test);
  }

  return deepEqual(result, getExpected(test));
};

const normalizeCaseError = (error, index, test) => {
  const runtimeError = error instanceof Error ? error : new Error(String(error));
  runtimeError.caseIndex = index + 1;
  runtimeError.caseId = test.id;
  if (canRevealCaseInput(test)) {
    runtimeError.caseInput = formatCaseInput(test);
  } else {
    runtimeError.caseInputHidden = true;
  }
  return runtimeError;
};

const runTests = async (tests) => {
  const language = languageSelect.value;
  const jsSolution = language === "javascript" ? getJavaScriptSolution() : null;
  const results = [];
  let consecutiveTimeouts = 0;

  if (language === "python") {
    await ensurePythonRuntime();
  }

  for (const [index, test] of tests.entries()) {
    setOutput(`Running case ${index + 1}/${tests.length}...`, "");
    await waitForPaint();

    const caseStart = window.performance?.now ? window.performance.now() : Date.now();
    try {
      const args = getTestArgs(test);
      let result;
      result = language === "python" ? await runPythonCase(test) : jsSolution(...args);
      if (result === undefined && args.length && Array.isArray(args[0])) {
        result = args[0];
      }
      const elapsedMs = (window.performance?.now ? window.performance.now() : Date.now()) - caseStart;
      const timeLimitMs = Number(test.timeLimitMs || 0);
      if (timeLimitMs > 0 && elapsedMs > timeLimitMs) {
        const timeoutError = new Error(
          `Time limit exceeded on case ${index + 1}: ${Math.round(elapsedMs)}ms > ${timeLimitMs}ms. Try using shared-prefix pruning instead of searching every word independently.`,
        );
        timeoutError.name = "TimeLimitError";
        throw timeoutError;
      }
      const passed = isValidResult(result, test);

      results.push({
        id: test.id,
        index: index + 1,
        passed,
        result,
        elapsedMs: Math.round(elapsedMs),
        input: getTestInput(test),
        expected: getExpected(test),
      });
      consecutiveTimeouts = 0;
    } catch (error) {
      const elapsedMs = (window.performance?.now ? window.performance.now() : Date.now()) - caseStart;
      const runtimeError = normalizeCaseError(error, index, test);
      const summary = errorSummary(runtimeError);
      results.push({
        id: test.id,
        index: index + 1,
        passed: false,
        result: "Error",
        error: summary,
        traceback: formatTraceback(runtimeError),
        elapsedMs: Math.round(elapsedMs),
        input: getTestInput(test),
        expected: getExpected(test),
      });

      consecutiveTimeouts = runtimeError.name === "TimeoutError" ? consecutiveTimeouts + 1 : 0;
      if (language === "python" && consecutiveTimeouts >= 2 && index < tests.length - 1) {
        const guardMessage =
          "Stopped after repeated Python timeouts to keep the page responsive. Try shared-prefix pruning before submitting again.";
        tests.slice(index + 1).forEach((skippedTest, skippedOffset) => {
          const isFirstSkipped = skippedOffset === 0;
          const guardError = isFirstSkipped
            ? normalizeCaseError(new Error(guardMessage), index + 1 + skippedOffset, skippedTest)
            : null;
          if (guardError) {
            guardError.name = "TimeoutGuardError";
          }
          results.push({
            id: skippedTest.id,
            index: index + skippedOffset + 2,
            passed: false,
            result: "Skipped",
            error: guardError ? errorSummary(guardError) : "",
            traceback: guardError ? formatTraceback(guardError) : "",
            elapsedMs: 0,
            input: getTestInput(skippedTest),
            expected: getExpected(skippedTest),
          });
        });
        break;
      }
    }
  }

  return results;
};

const formatResults = (results) => {
  const failed = results.filter((item) => !item.passed);
  const errors = failed.filter((item) => item.error);

  if (!failed.length) {
    return `PASS ${results.length}/${results.length} testcases passed`;
  }

  if (currentProblem?.disclosureStyle === "grouped_hints") {
    const errorText = errors.length ? ` ${errors.length} case${errors.length > 1 ? "s" : ""} raised runtime errors; open Traceback.` : "";
    return `FAIL ${failed.length} testcase${failed.length > 1 ? "s" : ""} failed.${errorText} Open Testcases to see category hints; inputs and expected answers are hidden.`;
  }

  const visibleFailures = failed.filter((item) => visibleTestIds.has(item.id));
  const hiddenFailureCount = failed.length - visibleFailures.length;
  const lines = visibleFailures.map((item) => {
      const icon = item.error ? "ERROR" : "FAIL";
      const test = visibleTests.find((candidate) => candidate.id === item.id);
      const output = item.error ? item.error : formatValue(item.result);
      return `${icon} Test ${item.index}: input=${test ? formatCaseInput(test) : "-"}, output=${output}`;
  });

  if (hiddenFailureCount) {
    lines.push(`FAIL ${hiddenFailureCount} hidden testcase${hiddenFailureCount > 1 ? "s" : ""} failed. Details are hidden.`);
  }

  return lines.join("\n");
};

const errorSummary = (error) => {
  const message = String(error?.message || error || "Unknown runtime error").trim();
  const lines = message.split("\n").map((line) => line.trim()).filter(Boolean);
  const lastLine = [...lines].reverse().find((line) => !line.startsWith("Traceback")) || lines[0];
  return lastLine || "Runtime error";
};

const formatTraceback = (error) => {
  const title = `${error?.name || "Error"}: ${errorSummary(error)}`;
  const context = [
    `Problem: ${currentProblem?.englishName || "Unknown problem"}${currentProblem?.chineseName ? ` / ${currentProblem.chineseName}` : ""}`,
    `Language: ${languageSelect.value}`,
    error?.caseIndex ? `Failed case: ${error.caseIndex}${error.caseId ? ` (${error.caseId})` : ""}` : "",
    error?.caseInput ? `Case input: ${error.caseInput}` : "",
    error?.caseInputHidden ? "Case input: hidden by testcase disclosure rules" : "",
    `Captured at: ${new Date().toLocaleString()}`,
  ].filter(Boolean);

  const candidates = [
    error?.pythonTraceback,
    error?.traceback,
    error?.stack,
    error?.message,
    String(error || ""),
  ]
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter(Boolean);

  const seen = new Set();
  const sections = [];
  candidates.forEach((item) => {
    if (!seen.has(item)) {
      seen.add(item);
      sections.push(item);
    }
  });

  return [`${title}\n${context.join("\n")}`, ...sections].join("\n\n").trim();
};

const formatResultValue = (value) => {
  if (Array.isArray(value)) {
    return formatArray(value);
  }

  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return String(value);
};

const buildProblemContext = () => ({
  id: currentProblem?.id,
  category: currentProblem?.category,
  difficulty: currentProblem?.difficulty,
  englishName: currentProblem?.englishName,
  chineseName: currentProblem?.chineseName,
  englishDescription: currentProblem?.englishDescription,
  examples: currentProblem?.examples || [],
});

const buildTestStateContext = () => {
  if (latestScope === "none" || !latestResults.size) {
    return {
      scope: "none",
      passed: 0,
      total: 0,
      visible: [],
      hidden: {
        total: hiddenTests.length,
        passed: 0,
        failed: 0,
      },
    };
  }

  const results = Array.from(latestResults.values());
  const passed = results.filter((item) => item.passed).length;
  const hiddenResults = hiddenTests.map((test) => getCaseResult(test)).filter(Boolean);
  const hiddenPassed = hiddenResults.filter((item) => item.passed).length;
  const hiddenErrors = hiddenResults.filter((item) => item.error).length;

  return {
    scope: latestScope,
    passed,
    total: results.length,
    visible: visibleTests
      .map((test, index) => {
        const result = getCaseResult(test);
        if (!result) {
          return null;
        }

        return {
          index: index + 1,
          passed: result.passed,
          input: formatCaseInput(test),
          expected: formatValue(getExpected(test)),
          actual: formatResultValue(result.result),
          error: result.error || "",
        };
      })
      .filter(Boolean),
    hidden: {
      total: hiddenTests.length,
      passed: hiddenPassed,
      failed: Math.max(0, hiddenResults.length - hiddenPassed),
      errors: hiddenErrors,
    },
  };
};

const buildTutorPayload = (message) => ({
  message,
  learning: {
    view: leftView,
    title: leftView === "lesson" ? "Boggle Solver prerequisite lesson" : "Boggle Solver coding practice",
    topics:
      leftView === "lesson"
        ? ["2D grid coordinates", "8-direction movement", "DFS", "backtracking", "prefix pruning"]
        : ["implementation", "test feedback", "traceback debugging"],
  },
  problem: buildProblemContext(),
  code: {
    language: languageSelect.value,
    source: codeEditor.value,
    status: statusMessage.textContent.trim(),
    output: testOutput.textContent.trim(),
    traceback: latestTraceback,
    tracebacks: latestTracebackCases.map((item) => ({
      index: item.index,
      id: item.id,
      summary: item.summary,
      traceback: item.traceback,
    })),
  },
  testState: buildTestStateContext(),
});

const buildActivityPayload = (eventType, result = {}) => ({
  event_type: eventType,
  client_created_at: new Date().toISOString(),
  problem: buildProblemContext(),
  code: {
    language: languageSelect.value,
    source: codeEditor.value,
    status: statusMessage.textContent.trim(),
    output: testOutput.textContent.trim(),
    traceback: latestTraceback,
    tracebacks: latestTracebackCases.map((item) => ({
      index: item.index,
      id: item.id,
      summary: item.summary,
      traceback: item.traceback,
    })),
  },
  testState: buildTestStateContext(),
  result,
});

const recordActivity = async (eventType, result = {}) => {
  if (!authSession?.token) {
    return;
  }

  try {
    await fetch(activityApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(buildActivityPayload(eventType, result)),
    });
  } catch (error) {
    console.warn("Could not record learning activity", error);
  }
};

const execute = async (tests, label, scope, eventType) => {
  if (executionBusy) {
    return;
  }

  setBusy(true, eventType);
  const busyLabel = eventType === "submit" ? "Submitting" : "Running";
  setStatus(`${busyLabel} ${tests.length} tests...`, "pass");
  setOutput(`${busyLabel} ${label.toLowerCase()}...`, "");
  await waitForPaint();
  let activityResult = {
    label,
    scope,
    passed: 0,
    total: tests.length,
    all_passed: false,
  };

  try {
    const results = await runTests(tests);
    const passedCount = results.filter((item) => item.passed).length;
    const errorCases = results.filter((item) => item.error);
    const allPassed = passedCount === results.length;
    activityResult = {
      label,
      scope,
      passed: passedCount,
      total: results.length,
      all_passed: allPassed,
      errors: errorCases.map((item) => ({
        index: item.index,
        id: item.id,
        summary: item.error,
        traceback: item.traceback,
      })),
    };

    latestScope = scope;
    latestResults = new Map(results.map((item) => [item.id, item]));
    setCaseTracebacks(
      errorCases.map((item) => ({
        index: item.index,
        id: item.id,
        summary: item.error,
        traceback: item.traceback,
      })),
    );
    renderTestcases();
    setOutput(formatResults(results), allPassed ? "pass" : "fail");
    if (errorCases.length) {
      setActiveEditorTab("traceback");
    }
    const statusText = allPassed
      ? `${label} passed`
      : errorCases.length
        ? `${passedCount}/${results.length} tests passed, ${errorCases.length} errors`
        : `${passedCount}/${results.length} tests passed`;
    setStatus(statusText, allPassed ? "pass" : "fail");
  } catch (error) {
    const traceback = formatTraceback(error);
    latestScope = scope;
    latestResults = new Map(
      tests.map((test, index) => [
        test.id,
        {
          id: test.id,
          index: index + 1,
          passed: false,
          result: "Error",
          error: errorSummary(error),
          traceback,
          input: getTestInput(test),
          expected: getExpected(test),
        },
      ]),
    );
    renderTestcases();
    setCaseTracebacks([{ index: "setup", id: "setup", summary: errorSummary(error), traceback }]);
    setActiveEditorTab("traceback");
    setOutput(`Code error. Open Traceback for full details: ${errorSummary(error)}`, "fail");
    setStatus("Code error", "fail");
    activityResult = {
      ...activityResult,
      error: traceback,
    };
  } finally {
    setBusy(false);
    recordActivity(eventType, activityResult);
  }
};

runButton.addEventListener("click", () => {
  execute(allTests, "All testcases", "all", "run");
});

submitButton.addEventListener("click", () => {
  execute(allTests, "All testcases", "all", "submit");
});

if (openCatalogButton) {
  openCatalogButton.addEventListener("click", (event) => {
    event.preventDefault();
    showCatalog({ historyMode: "push" });
  });
}

if (closeCatalogButton) {
  closeCatalogButton.addEventListener("click", () => {
    hideCatalog();
  });
}

if (catalogList) {
  catalogList.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category-id]");
    if (categoryButton) {
      expandedCatalogCategory =
        expandedCatalogCategory === categoryButton.dataset.categoryId ? "" : categoryButton.dataset.categoryId;
      renderCatalog();
      return;
    }

    const problemButton = event.target.closest("[data-problem-path]");
    if (problemButton) {
      const problemPath = problemButton.dataset.problemPath;
      if (problemPath) {
        expandedCatalogCategory = problemButton.dataset.parentCategoryId || findCategoryIdForProblemPath(problemPath);
        loadProblemIntoWorkspace(problemPath, { historyMode: "push", parentCategoryId: expandedCatalogCategory });
      }
    }
  });
}

bookmarkButton.addEventListener("click", () => {
  const isActive = bookmarkButton.classList.toggle("active");
  bookmarkButton.setAttribute("aria-pressed", String(isActive));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveEditorTab(button.dataset.viewTab);
  });
});

modeSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLeftView(button.dataset.leftView);
  });
});

expandEditorButton.addEventListener("click", () => {
  const nextExpanded = !problemPanel.classList.contains("code-expanded");
  setReadingExpanded(false);
  setCodeExpanded(nextExpanded);
});

if (expandReadingButton) {
  expandReadingButton.addEventListener("click", () => {
    const nextExpanded = !problemPanel.classList.contains("reading-expanded");
    setCodeExpanded(false);
    setReadingExpanded(nextExpanded);
  });
}

languageSelect.addEventListener("change", () => {
  codeCache[currentLanguage] = codeEditor.value;
  currentLanguage = languageSelect.value;
  codeEditor.value = codeCache[currentLanguage] || codeTemplates[currentLanguage] || "";
  setOutput(`${languageSelect.options[languageSelect.selectedIndex].text} mode ready`, "");
  setTraceback();
  setActiveEditorTab("code");
  setStatus("Ready");
  syncEditor();
});

const renderInlineMarkdown = (text) => {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
};

const renderMarkdown = (text) => {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim();
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(`<pre class="md-code"><code data-language="${escapeHtml(language)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const unorderedItems = [];
    while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
      unorderedItems.push(lines[index].replace(/^\s*[-*]\s+/, ""));
      index += 1;
    }
    if (unorderedItems.length) {
      html.push(`<ul>${unorderedItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
      continue;
    }

    const orderedItems = [];
    while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
      orderedItems.push(lines[index].replace(/^\s*\d+[.)]\s+/, ""));
      index += 1;
    }
    if (orderedItems.length) {
      html.push(`<ol>${orderedItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("```") &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+[.)]\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${paragraph.map(renderInlineMarkdown).join("<br>")}</p>`);
  }

  return html.join("") || "<p></p>";
};

const renderBubbleContent = (bubble, text) => {
  let content = bubble.querySelector(".bubble-content");
  if (!content) {
    content = document.createElement("div");
    content.className = "bubble-content";
    bubble.prepend(content);
  }
  content.innerHTML = renderMarkdown(text);
};

const createMessage = (text, owner, timestampValue = Date.now()) => {
  const parsedTimestamp =
    typeof timestampValue === "number" ? timestampValue : new Date(timestampValue).getTime();
  const timestamp = Number.isFinite(parsedTimestamp) ? parsedTimestamp : Date.now();
  const group = document.createElement("div");
  group.className = `message-group ${owner}`;
  group.dataset.timestamp = String(timestamp);

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
  if (!shouldDisplayMessageTime(timestamp)) {
    time.classList.add("hidden");
  }
  group.appendChild(time);

  const message = document.createElement("div");
  message.className = `message ${owner}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  renderBubbleContent(bubble, text);

  message.appendChild(bubble);
  group.appendChild(message);
  return group;
};

const initialTutorMessage = "你好！我是你的 AI Tutor，可以帮你梳理思路、检查代码，或者解释测试结果。";

const resetChatThread = (entries = []) => {
  chatThread.innerHTML = "";
  chatThread.appendChild(createMessage(initialTutorMessage, "tutor"));

  entries.forEach((entry) => {
    if (entry.learner_request) {
      chatThread.appendChild(createMessage(entry.learner_request, "user", entry.created_at));
    }
    if (entry.message || entry.error) {
      chatThread.appendChild(createMessage(entry.error || entry.message, "tutor", entry.created_at));
    }
  });

  scrollChatToBottom();
};

const loadAccountHistory = async () => {
  if (!authSession?.token) {
    resetChatThread();
    return;
  }

  const response = await fetch(backendUrl("/api/my-history?limit=100000"), {
    headers: authHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not load account history.");
  }

  resetChatThread(data.entries || []);
};

const completeAuth = async (session) => {
  saveAuthSession(session);
  updateAccountStatus();
  hideAuthGate();
  try {
    await loadAccountHistory();
  } catch (error) {
    console.warn(error);
    resetChatThread();
  }
};

const verifyStoredSession = async () => {
  authSession = loadStoredAuthSession();
  if (!authSession?.token) {
    updateAccountStatus();
    resetChatThread();
    showAuthGate("register");
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
    updateAccountStatus();
    hideAuthGate();
    await loadAccountHistory();
  } catch (error) {
    clearAuthSession();
    updateAccountStatus();
    resetChatThread();
    showAuthGate("login", "Session expired. Please log in again.");
  }
};

const setMessageText = (message, text) => {
  const bubble = message.querySelector(".bubble");
  const time = bubble?.querySelector(".message-time");
  if (!bubble) {
    return;
  }

  renderBubbleContent(bubble, text);
  if (time) {
    bubble.appendChild(time);
  }
};

const scrollChatToBottom = () => {
  chatThread.scrollTop = chatThread.scrollHeight;
};

const askTutor = async (message) => {
  if (!authSession?.token) {
    throw new Error("Please create an account or log in first.");
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(tutorApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(buildTutorPayload(message)),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "AI Tutor service returned an error.");
    }

    return data.message || "I did not receive a response.";
  } finally {
    window.clearTimeout(timeoutId);
  }
};

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (chatBusy) {
    return;
  }

  if (!authSession?.token) {
    showAuthGate("register", "Create an account to save your tutor conversations.");
    return;
  }

  const text = chatInput.value.trim();

  if (!text) {
    return;
  }

  chatThread.appendChild(createMessage(text, "user"));
  chatInput.value = "";
  chatBusy = true;
  setChatEnabled(false);

  const pendingMessage = createMessage("正在思考...", "tutor");
  chatThread.appendChild(pendingMessage);
  scrollChatToBottom();

  try {
    const reply = await askTutor(text);
    setMessageText(pendingMessage, reply);
  } catch (error) {
    setMessageText(
      pendingMessage,
      `AI Tutor 服务暂时不可用：${error.message}。请确认账号已登录，并且后端服务正在运行。`,
    );
  } finally {
    chatBusy = false;
    setChatEnabled(Boolean(authSession?.token));
    chatInput.focus();
    scrollChatToBottom();
  }
});

authModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
  });
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value;
  const tutorMode = authForm.elements.tutorMode?.value || "encouraging";
  if (!username || !password) {
    setAuthMessage("Please enter both username and password.", "fail");
    return;
  }

  authSubmit.disabled = true;
  authUsername.disabled = true;
  authPassword.disabled = true;
  authTutorModeInputs.forEach((input) => {
    input.disabled = true;
  });
  setAuthMessage(authMode === "register" ? "Creating account..." : "Logging in...");

  try {
    const endpoint = authMode === "register" ? "/api/register" : "/api/login";
    const response = await fetch(backendUrl(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, tutorMode }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Account request failed.");
    }

    authPassword.value = "";
    setAuthMessage("Signed in.", "ok");
    await completeAuth(data);
  } catch (error) {
    setAuthMessage(error.message, "fail");
  } finally {
    authSubmit.disabled = false;
    authUsername.disabled = false;
    authPassword.disabled = false;
    authTutorModeInputs.forEach((input) => {
      input.disabled = false;
    });
  }
});

logoutButton.addEventListener("click", async () => {
  const token = authSession?.token;
  if (token) {
    try {
      await fetch(backendUrl("/api/logout"), {
        method: "POST",
        headers: authHeaders(),
      });
    } catch (error) {
      console.warn(error);
    }
  }

  clearAuthSession();
  updateAccountStatus();
  resetChatThread();
  showAuthGate("login");
  setAuthMessage("Logged out.", "ok");
});

codeEditor.addEventListener("input", syncEditor);
codeEditor.addEventListener("scroll", syncScroll);
codeEditor.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = codeEditor.selectionStart;
    const end = codeEditor.selectionEnd;
    const tabText = languageSelect.value === "python" ? "    " : "  ";
    codeEditor.value = `${codeEditor.value.slice(0, start)}${tabText}${codeEditor.value.slice(end)}`;
    codeEditor.selectionStart = codeEditor.selectionEnd = start + tabText.length;
    syncEditor();
  }
});

const hydrateInitialTutorMessage = () => {
  const legacyAvatar = chatThread.querySelector(".message.tutor .avatar");
  if (legacyAvatar) {
    legacyAvatar.remove();
  }

  const initialBubble = chatThread.querySelector(".message-group.tutor .bubble, .message.tutor .bubble");
  const initialContent = initialBubble?.querySelector(".bubble-content");
  if (!initialBubble || initialContent) {
    return;
  }

  const time = initialBubble.closest(".message-group")?.querySelector(".message-time") || initialBubble.querySelector(".message-time") || initialBubble.querySelector("span");
  const text = Array.from(initialBubble.childNodes)
    .filter((node) => node !== time)
    .map((node) => node.textContent)
    .join("")
    .trim();
  initialBubble.textContent = "";
  renderBubbleContent(initialBubble, text);
};

const initializeApp = async () => {
  try {
    setCurrentProblem(await loadConfiguredProblem());
  } catch (error) {
    console.warn(error);
    setCurrentProblem(fallbackProblem);
  }

  testcasesPanel.hidden = false;
  hydrateInitialTutorMessage();
  renderProblem();
  renderTestcases();
  setLeftView("lesson");
  setStatus("Ready");
  syncEditor();
  await verifyStoredSession();
};

initializeApp();
