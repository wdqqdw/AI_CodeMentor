const statusMessage = document.querySelector(".status-message");
const runButton = document.querySelector("[data-action='run']");
const submitButton = document.querySelector("[data-action='submit']");
const bookmarkButton = document.querySelector(".bookmark");
const chatForm = document.querySelector(".chat-composer");
const chatInput = document.querySelector("#mentor-input");
const chatThread = document.querySelector(".chat-thread");

const nowLabel = () =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const setStatus = (text) => {
  statusMessage.lastChild.textContent = ` ${text}`;
};

runButton.addEventListener("click", () => {
  setStatus("Running sample tests...");
  runButton.setAttribute("aria-busy", "true");

  window.setTimeout(() => {
    runButton.removeAttribute("aria-busy");
    setStatus("All testcases passed");
  }, 650);
});

submitButton.addEventListener("click", () => {
  setStatus("Accepted. Runtime beats 92%.");
});

bookmarkButton.addEventListener("click", () => {
  const isActive = bookmarkButton.classList.toggle("active");
  bookmarkButton.setAttribute("aria-pressed", String(isActive));
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
    chatThread.appendChild(
      createMessage("Nice instinct. Track each value you have seen, then compare the current number with its complement.", "tutor"),
    );
    chatThread.scrollTop = chatThread.scrollHeight;
  }, 450);
});
