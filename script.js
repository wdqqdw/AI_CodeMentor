const statusMessage = document.querySelector(".status-message");
const runButton = document.querySelector("[data-action='run']");
const submitButton = document.querySelector("[data-action='submit']");
const bookmarkButton = document.querySelector(".bookmark");
const chatForm = document.querySelector(".chat-composer");
const chatInput = document.querySelector("#mentor-input");
const chatThread = document.querySelector(".chat-thread");
const codeEditor = document.querySelector("#code-editor");
const lineGutter = document.querySelector("#line-gutter");
const testOutput = document.querySelector("#test-output");
const tabButtons = document.querySelectorAll(".tab");
const languageSelect = document.querySelector("#language-select");
const syntaxHighlight = document.querySelector("#syntax-highlight");
const problemPanel = document.querySelector(".problem-panel");
const expandEditorButton = document.querySelector(".editor-expand-button");
const editorPanel = document.querySelector(".editor-panel");
const testcasesPanel = document.querySelector("#testcases-panel");
const publicTestcases = document.querySelector("#public-testcases");
const hiddenTestcaseGrid = document.querySelector("#hidden-testcase-grid");
const testcaseSummary = document.querySelector("#testcase-summary");
const problemNameEn = document.querySelector("#problem-name-en");
const problemNameZh = document.querySelector("#problem-name-zh");
const problemDescription = document.querySelector("#problem-description");
const topicName = document.querySelector(".topic-link span");
const difficultyLabel = document.querySelector(".difficulty");
const catalogView = document.querySelector("#catalog-view");
const catalogList = document.querySelector("#catalog-list");
const openCatalogButton = document.querySelector("[data-action='open-catalog']");
const closeCatalogButton = document.querySelector("[data-action='close-catalog']");

const tutorApiUrl = window.CODEMENTOR_CONFIG?.tutorApiUrl || "http://127.0.0.1:8787/api/tutor";
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
let pyodideReadyPromise = null;
let latestResults = new Map();
let latestScope = "none";
let chatBusy = false;
let activeProblemPath = problemStore.markdownProblemPath || "";
let expandedCatalogCategory = "";
const difficultyRank = { easy: 0, medium: 1, hard: 2 };

const nowLabel = () =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const setStatus = (text, state = "pass") => {
  statusMessage.classList.toggle("fail", state === "fail");
  statusMessage.classList.toggle("pass", state !== "fail");
  statusMessage.lastChild.textContent = ` ${text}`;
};

const setOutput = (text, state = "") => {
  testOutput.className = `test-output ${state}`.trim();
  testOutput.textContent = text;
};

const setBusy = (isBusy) => {
  runButton.disabled = isBusy;
  submitButton.disabled = isBusy;
  languageSelect.disabled = isBusy;
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
  const tests = testsJson ? JSON.parse(testsJson) : [];
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
    inputParams,
    visibleTestCount: Number(metadata.visibleTestCount || 3),
    englishDescription: extractSection(body, "Description").replace(/\s+/g, " ").trim(),
    examples,
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
  problemPanel.classList.remove("code-expanded");
  expandEditorButton.setAttribute("aria-pressed", "false");
  expandEditorButton.setAttribute("aria-label", "Expand code editor");
  expandEditorButton.setAttribute("title", "Expand editor");
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
    tabButtons.forEach((tab) => {
      const isCodeTab = tab.dataset.viewTab === "code";
      tab.classList.toggle("active", isCodeTab);
      tab.setAttribute("aria-selected", String(isCodeTab));
    });
    editorPanel.classList.remove("show-testcases");
    window.requestAnimationFrame(syncEditor);

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
  problemDescription.innerHTML = renderInlineMarkdown(currentProblem.englishDescription);
  topicName.textContent = currentProblem.category;
  difficultyLabel.lastChild.textContent = currentProblem.difficulty;
  difficultyLabel.className = `difficulty ${difficultyClass(currentProblem.difficulty)}`;

  document.querySelectorAll("[data-example]").forEach((exampleNode) => {
    const example = currentProblem.examples[Number(exampleNode.dataset.example)];
    if (!example) {
      exampleNode.closest(".example-block").hidden = true;
      return;
    }

    exampleNode.closest(".example-block").hidden = false;
    exampleNode.innerHTML = `<strong>Input:</strong> ${escapeHtml(example.input)}\n<strong>Output:</strong> ${escapeHtml(example.output)}`;
  });

  codeEditor.value = codeTemplates[currentLanguage] || codeEditor.value;
};

const getCaseResult = (test) => latestResults.get(test.id);

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
  publicTestcases.innerHTML = visibleTests
    .map((test, index) => {
      const result = getCaseResult(test);
      const state = result ? (result.passed ? "pass" : "fail") : "pending";
      const actual = result ? formatValue(result.result) : "-";
      const status = result ? (result.passed ? "PASS" : "FAIL") : "READY";

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
      const state = result ? (result.passed ? "pass" : "fail") : "pending";
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

const loadPythonRuntime = async () => {
  if (!window.loadPyodide) {
    throw new Error("Python runtime failed to load. Refresh the page and try again.");
  }

  if (!pyodideReadyPromise) {
    setOutput("Loading Python runtime...", "");
    pyodideReadyPromise = window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.2/full/",
    });
  }

  return pyodideReadyPromise;
};

const runPythonCase = async (test) => {
  const pyodide = await loadPythonRuntime();
  const methodName = safeIdentifier(currentProblem?.methodName || "twoSum", "twoSum");
  pyodide.globals.set("__case_json", JSON.stringify({ args: getTestArgs(test) }));

  const rawResult = pyodide.runPython(`
import json as __json

${codeEditor.value}

__case = __json.loads(__case_json)
__args = __case["args"]
__result = Solution().${methodName}(*__args)
if __result is None and __args:
    __result = __args[0]
__result
`);

  const result = rawResult && typeof rawResult.toJs === "function" ? rawResult.toJs() : rawResult;

  if (rawResult && typeof rawResult.destroy === "function") {
    rawResult.destroy();
  }

  return result;
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

const isValidResult = (result, test) => {
  if (currentProblem?.validation === "two_sum_indices") {
    return isValidTwoSum(result, test);
  }

  return deepEqual(result, getExpected(test));
};

const runTests = async (tests) => {
  const language = languageSelect.value;
  const jsSolution = language === "javascript" ? getJavaScriptSolution() : null;
  const results = [];

  for (const [index, test] of tests.entries()) {
    const args = getTestArgs(test);
    let result = language === "python" ? await runPythonCase(test) : jsSolution(...args);
    if (result === undefined && args.length && Array.isArray(args[0])) {
      result = args[0];
    }
    const passed = isValidResult(result, test);

    results.push({
      id: test.id,
      index: index + 1,
      passed,
      result,
      input: getTestInput(test),
      expected: getExpected(test),
    });
  }

  return results;
};

const formatResults = (results) => {
  const failed = results.filter((item) => !item.passed);

  if (!failed.length) {
    return `PASS ${results.length}/${results.length} testcases passed`;
  }

  const visibleFailures = failed.filter((item) => visibleTestIds.has(item.id));
  const hiddenFailureCount = failed.length - visibleFailures.length;
  const lines = visibleFailures.map((item) => {
      const icon = item.passed ? "PASS" : "FAIL";
      const test = visibleTests.find((candidate) => candidate.id === item.id);
      return `${icon} Test ${item.index}: input=${test ? formatCaseInput(test) : "-"}, output=${formatValue(item.result)}`;
  });

  if (hiddenFailureCount) {
    lines.push(`FAIL ${hiddenFailureCount} hidden testcase${hiddenFailureCount > 1 ? "s" : ""} failed. Details are hidden.`);
  }

  return lines.join("\n");
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
        };
      })
      .filter(Boolean),
    hidden: {
      total: hiddenTests.length,
      passed: hiddenPassed,
      failed: Math.max(0, hiddenResults.length - hiddenPassed),
    },
  };
};

const buildTutorPayload = (message) => ({
  message,
  problem: buildProblemContext(),
  code: {
    language: languageSelect.value,
    source: codeEditor.value,
    status: statusMessage.textContent.trim(),
    output: testOutput.textContent.trim(),
  },
  testState: buildTestStateContext(),
});

const execute = async (tests, label, scope) => {
  setBusy(true);

  try {
    const results = await runTests(tests);
    const passedCount = results.filter((item) => item.passed).length;
    const allPassed = passedCount === results.length;

    latestScope = scope;
    latestResults = new Map(results.map((item) => [item.id, item]));
    renderTestcases();
    setOutput(formatResults(results), allPassed ? "pass" : "fail");
    setStatus(allPassed ? `${label} passed` : `${passedCount}/${results.length} tests passed`, allPassed ? "pass" : "fail");
  } catch (error) {
    latestScope = scope;
    latestResults = new Map(
      tests.map((test, index) => [
        test.id,
        { id: test.id, index: index + 1, passed: false, result: "Error", input: getTestInput(test), expected: getExpected(test) },
      ]),
    );
    renderTestcases();
    setOutput(error.message, "fail");
    setStatus("Code error", "fail");
  } finally {
    setBusy(false);
  }
};

runButton.addEventListener("click", () => {
  execute(allTests, "All testcases", "all");
});

submitButton.addEventListener("click", () => {
  execute(allTests, "All testcases", "all");
});

openCatalogButton.addEventListener("click", (event) => {
  event.preventDefault();
  showCatalog({ historyMode: "push" });
});

closeCatalogButton.addEventListener("click", () => {
  hideCatalog();
});

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

window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (!state) {
    return;
  }

  if (state.view === "catalog") {
    expandedCatalogCategory = state.expandedCatalogCategory || "";
    showCatalog({ historyMode: "none" });
    return;
  }

  if (state.view === "problem" && state.path) {
    const parentCategoryId = state.expandedCatalogCategory || findCategoryIdForProblemPath(state.path);
    loadProblemIntoWorkspace(state.path, { historyMode: "none", parentCategoryId });
  }
});

bookmarkButton.addEventListener("click", () => {
  const isActive = bookmarkButton.classList.toggle("active");
  bookmarkButton.setAttribute("aria-pressed", String(isActive));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", String(tab === button));
    });
    editorPanel.classList.toggle("show-testcases", button.dataset.viewTab === "testcases");
    window.requestAnimationFrame(syncEditor);
  });
});

expandEditorButton.addEventListener("click", () => {
  const isExpanded = problemPanel.classList.toggle("code-expanded");
  expandEditorButton.setAttribute("aria-pressed", String(isExpanded));
  expandEditorButton.setAttribute("aria-label", isExpanded ? "Collapse code editor" : "Expand code editor");
  expandEditorButton.setAttribute("title", isExpanded ? "Collapse editor" : "Expand editor");
  window.requestAnimationFrame(syncEditor);
});

languageSelect.addEventListener("change", () => {
  codeCache[currentLanguage] = codeEditor.value;
  currentLanguage = languageSelect.value;
  codeEditor.value = codeCache[currentLanguage] || codeTemplates[currentLanguage] || "";
  setOutput(`${languageSelect.options[languageSelect.selectedIndex].text} mode ready`, "");
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

const createMessage = (text, owner) => {
  const group = document.createElement("div");
  group.className = `message-group ${owner}`;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = nowLabel();
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
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(tutorApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  const text = chatInput.value.trim();

  if (!text) {
    return;
  }

  chatThread.appendChild(createMessage(text, "user"));
  chatInput.value = "";
  chatBusy = true;
  chatInput.disabled = true;

  const pendingMessage = createMessage("正在思考...", "tutor");
  chatThread.appendChild(pendingMessage);
  scrollChatToBottom();

  try {
    const reply = await askTutor(text);
    setMessageText(pendingMessage, reply);
  } catch (error) {
    setMessageText(
      pendingMessage,
      `本地 AI Tutor 服务暂时不可用：${error.message}。请确认后端正在 http://127.0.0.1:8787 运行。`,
    );
  } finally {
    chatBusy = false;
    chatInput.disabled = false;
    chatInput.focus();
    scrollChatToBottom();
  }
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
  setStatus("Ready");
  syncEditor();
  showCatalog({ reset: true, historyMode: "replace" });
};

initializeApp();
