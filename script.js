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

const sampleTests = [
  { nums: [2, 7, 11, 15], target: 9 },
  { nums: [3, 2, 4], target: 6 },
];

const submitTests = [
  ...sampleTests,
  { nums: [3, 3], target: 6 },
  { nums: [0, 4, 3, 0], target: 0 },
  { nums: [-1, -2, -3, -4, -5], target: -8 },
];

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

const syncLineNumbers = () => {
  const count = Math.max(8, codeEditor.value.split("\n").length);
  lineGutter.textContent = Array.from({ length: count }, (_, index) => index + 1).join("\n");
};

const getSolution = () => {
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

const runTests = (tests) => {
  const solution = getSolution();

  return tests.map((test, index) => {
    const nums = [...test.nums];
    const result = solution(nums, test.target);
    const passed = isValidTwoSum(result, test.nums, test.target);

    return {
      index: index + 1,
      passed,
      result,
      nums: test.nums,
      target: test.target,
    };
  });
};

const formatResults = (results) =>
  results
    .map((item) => {
      const icon = item.passed ? "PASS" : "FAIL";
      const actual = Array.isArray(item.result) ? `[${item.result.join(", ")}]` : String(item.result);
      return `${icon} Test ${item.index}: nums=[${item.nums.join(", ")}], target=${item.target}, output=${actual}`;
    })
    .join("\n");

const execute = (tests, label) => {
  try {
    const results = runTests(tests);
    const passedCount = results.filter((item) => item.passed).length;
    const allPassed = passedCount === results.length;

    setOutput(formatResults(results), allPassed ? "pass" : "fail");
    setStatus(allPassed ? `${label} passed` : `${passedCount}/${results.length} tests passed`, allPassed ? "pass" : "fail");
  } catch (error) {
    setOutput(error.message, "fail");
    setStatus("Code error", "fail");
  }
};

runButton.addEventListener("click", () => {
  execute(sampleTests, "Sample tests");
});

submitButton.addEventListener("click", () => {
  execute(submitTests, "All testcases");
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
  });
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
  chatThread.scrollTop = chatThread.scrollHeight;

  window.setTimeout(() => {
    chatThread.appendChild(createMessage("OK", "tutor"));
    chatThread.scrollTop = chatThread.scrollHeight;
  }, 250);
});

codeEditor.addEventListener("input", syncLineNumbers);
codeEditor.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = codeEditor.selectionStart;
    const end = codeEditor.selectionEnd;
    codeEditor.value = `${codeEditor.value.slice(0, start)}  ${codeEditor.value.slice(end)}`;
    codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
    syncLineNumbers();
  }
});

syncLineNumbers();
