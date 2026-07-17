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

const problemStore = window.CODEMENTOR_PROBLEMS || {};
const currentProblem =
  problemStore.items?.[problemStore.currentProblemId] || Object.values(problemStore.items || {})[0];
const visibleTestCount = currentProblem?.visibleTestCount || 3;
const allTests = currentProblem?.tests || [];
const visibleTests = allTests.slice(0, visibleTestCount);
const hiddenTests = allTests.slice(visibleTestCount);
const visibleTestIds = new Set(visibleTests.map((test) => test.id));
const codeTemplates = currentProblem?.initialCode || {};

const codeCache = {
  python: codeTemplates.python || codeEditor.value,
  javascript: codeTemplates.javascript || "",
};

let currentLanguage = languageSelect.value;
let pyodideReadyPromise = null;
let latestResults = new Map();
let latestScope = "none";

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
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const formatArray = (value) => `[${value.join(", ")}]`;

const renderProblem = () => {
  if (!currentProblem) {
    return;
  }

  document.title = `${currentProblem.englishName} | CodeMentor AI`;
  problemNameEn.textContent = currentProblem.englishName;
  problemNameZh.textContent = currentProblem.chineseName;
  problemDescription.textContent = currentProblem.englishDescription;
  topicName.textContent = currentProblem.category;
  difficultyLabel.lastChild.textContent = currentProblem.difficulty;

  document.querySelectorAll("[data-example]").forEach((exampleNode) => {
    const example = currentProblem.examples[Number(exampleNode.dataset.example)];
    if (!example) {
      exampleNode.closest(".example-block").hidden = true;
      return;
    }

    exampleNode.innerHTML = `<strong>Input:</strong> ${escapeHtml(example.input)}\n<strong>Output:</strong> ${escapeHtml(example.output)}`;
  });

  codeEditor.value = codeTemplates[currentLanguage] || codeEditor.value;
};

const getCaseResult = (test) => latestResults.get(test.id);

const renderTestcases = () => {
  publicTestcases.innerHTML = visibleTests
    .map((test, index) => {
      const result = getCaseResult(test);
      const state = result ? (result.passed ? "pass" : "fail") : "pending";
      const actual = result ? formatArray(Array.isArray(result.result) ? result.result : []) : "-";
      const status = result ? (result.passed ? "PASS" : "FAIL") : "READY";

      return `
        <article class="testcase-card ${state}">
          <h3><span>Case ${index + 1}</span><span class="case-status">${status}</span></h3>
          <pre class="case-detail">nums = ${formatArray(test.nums)}
target = ${test.target}
expected = ${formatArray(test.expected)}
actual = ${actual}</pre>
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
  const factory = new Function(
    `"use strict";\n${source}\nreturn typeof twoSum === "function" ? twoSum : null;`,
  );
  const solution = factory();

  if (typeof solution !== "function") {
    throw new Error("Define a function named twoSum(nums, target).");
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
  pyodide.globals.set("__case_json", JSON.stringify({ nums: test.nums, target: test.target }));

  const rawResult = pyodide.runPython(`
import json as __json

${codeEditor.value}

__case = __json.loads(__case_json)
__result = Solution().twoSum(__case["nums"], __case["target"])
__result
`);

  const result = rawResult && typeof rawResult.toJs === "function" ? rawResult.toJs() : rawResult;

  if (rawResult && typeof rawResult.destroy === "function") {
    rawResult.destroy();
  }

  return Array.from(result || []);
};

const isValidTwoSum = (result, nums, target) => {
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

const runTests = async (tests) => {
  const language = languageSelect.value;
  const jsSolution = language === "javascript" ? getJavaScriptSolution() : null;
  const results = [];

  for (const [index, test] of tests.entries()) {
    const result = language === "python" ? await runPythonCase(test) : jsSolution([...test.nums], test.target);
    const passed = isValidTwoSum(result, test.nums, test.target);

    results.push({
      id: test.id,
      index: index + 1,
      passed,
      result,
      nums: test.nums,
      target: test.target,
      expected: test.expected,
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
      const actual = Array.isArray(item.result) ? `[${item.result.join(", ")}]` : String(item.result);
      return `${icon} Test ${item.index}: nums=[${item.nums.join(", ")}], target=${item.target}, output=${actual}`;
  });

  if (hiddenFailureCount) {
    lines.push(`FAIL ${hiddenFailureCount} hidden testcase${hiddenFailureCount > 1 ? "s" : ""} failed. Details are hidden.`);
  }

  return lines.join("\n");
};

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
        { index: index + 1, passed: false, result: "Error", nums: test.nums, target: test.target },
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
  codeEditor.value = codeCache[currentLanguage] || codeTemplates[currentLanguage];
  setOutput(`${languageSelect.options[languageSelect.selectedIndex].text} mode ready`, "");
  setStatus("Ready");
  syncEditor();
});

const createMessage = (text, owner) => {
  const message = document.createElement("div");
  message.className = `message ${owner}`;

  if (owner === "tutor") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M8 9V7a4 4 0 0 1 8 0v2M6.5 9h11A2.5 2.5 0 0 1 20 11.5v4A4.5 4.5 0 0 1 15.5 20h-7A4.5 4.5 0 0 1 4 15.5v-4A2.5 2.5 0 0 1 6.5 9Z" />
        <path d="M9 14h.01M15 14h.01M10 17h4" />
      </svg>
    `;
    message.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const time = document.createElement("span");
  time.textContent = nowLabel();
  bubble.appendChild(time);

  message.appendChild(bubble);
  return message;
};

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();

  if (!text) {
    return;
  }

  chatThread.appendChild(createMessage(text, "user"));
  chatInput.value = "";

  window.setTimeout(() => {
    chatThread.appendChild(createMessage("OK", "tutor"));
  }, 250);
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

testcasesPanel.hidden = false;
renderProblem();
renderTestcases();
setStatus("Ready");
syncEditor();
