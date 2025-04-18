import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const avatarImg = document.querySelector(".avatar img");
const timerDisplay = document.getElementById("timer-display");
const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const fullscreenToggleBtn = document.getElementById("fullscreen-toggle");
const increaseTimeBtn = document.getElementById("increase-time");
const decreaseTimeBtn = document.getElementById("decrease-time");
const levelDisplay = document.getElementById("level-display");
const currentXpDisplay = document.getElementById("current-xp");
const xpToLevelDisplay = document.getElementById("xp-to-level");
const xpProgress = document.getElementById("xp-progress");
const sessionsCount = document.getElementById("sessions-count");
const totalFocusTime = document.getElementById("total-focus-time");

const characterImages = [
  "monk.png",
  "wizard.png",
  "barbarian.png",
  "knight.png",
  "alchemy.png",
  "adventurer.png",
];

const MIN_FOCUS_MINUTES = 30;
const TIME_INCREMENT = 5;
const XP_PER_SESSION = 10;
let focusMinutes = MIN_FOCUS_MINUTES;
let timerInterval = null;
let secondsRemaining = focusMinutes * 60;
let isRunning = false;
let isFullscreen = false;
let fullscreenFocusElement = null;

const BASE_XP_PER_LEVEL = 100;

const defaultUserData = {
  level: 1,
  currentXp: 0,
  totalXp: 0,
  sessionsCompleted: 0,
  totalFocusMinutes: 0,
  currentCharacterIndex: 0,
  focusMinutes: MIN_FOCUS_MINUTES,
};

let userData = JSON.parse(localStorage.getItem("userData")) || defaultUserData;

if (userData.focusMinutes) {
  focusMinutes = Math.max(userData.focusMinutes, MIN_FOCUS_MINUTES);
} else {
  userData.focusMinutes = MIN_FOCUS_MINUTES;
}

function initializeApp() {
  secondsRemaining = focusMinutes * 60;
  updateTimerDisplay();

  updateXpDisplay();

  sessionsCount.textContent = userData.sessionsCompleted;
  totalFocusTime.textContent = userData.totalFocusMinutes;

  if (avatarImg) {
    avatarImg.src = `/images/${
      characterImages[userData.currentCharacterIndex]
    }`;

    avatarImg.addEventListener("click", (e) => {
      e.preventDefault();
      changeCharacter();
    });
  }

  startTimerBtn.addEventListener("click", startTimer);
  pauseTimerBtn.addEventListener("click", pauseTimer);
  resetTimerBtn.addEventListener("click", resetTimer);
  fullscreenToggleBtn.addEventListener("click", toggleFullscreen);

  increaseTimeBtn.addEventListener("click", increaseTime);
  decreaseTimeBtn.addEventListener("click", decreaseTime);

  document.addEventListener("keydown", handleKeyboardShortcuts);

  document.addEventListener("fullscreenchange", handleFullscreenChange);
}

function updateTimerDisplay() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function increaseTime() {
  if (isRunning) return;

  focusMinutes += TIME_INCREMENT;
  secondsRemaining = focusMinutes * 60;

  userData.focusMinutes = focusMinutes;
  saveUserData();

  updateTimerDisplay();
  showToast(`Focus time set to ${focusMinutes} minutes`, "info");
}

function decreaseTime() {
  if (isRunning) return;

  if (focusMinutes <= MIN_FOCUS_MINUTES) {
    showToast(`Minimum focus time is ${MIN_FOCUS_MINUTES} minutes`, "warning");
    return;
  }

  focusMinutes -= TIME_INCREMENT;
  secondsRemaining = focusMinutes * 60;

  userData.focusMinutes = focusMinutes;
  saveUserData();

  updateTimerDisplay();
  showToast(`Focus time set to ${focusMinutes} minutes`, "info");
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  updateButtonStates();

  timerInterval = setInterval(() => {
    secondsRemaining--;
    updateTimerDisplay();

    if (secondsRemaining <= 0) {
      completeSession();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  isRunning = false;
  clearInterval(timerInterval);
  updateButtonStates();

  showToast("Focus session paused", "warning");
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  secondsRemaining = focusMinutes * 60;
  updateTimerDisplay();
  updateButtonStates();
}

function completeSession() {
  isRunning = false;
  clearInterval(timerInterval);

  const xpEarned = Math.round(
    XP_PER_SESSION * (focusMinutes / MIN_FOCUS_MINUTES)
  );
  awardXp(xpEarned);

  userData.sessionsCompleted++;
  userData.totalFocusMinutes += focusMinutes;
  saveUserData();

  sessionsCount.textContent = userData.sessionsCompleted;
  totalFocusTime.textContent = userData.totalFocusMinutes;

  secondsRemaining = focusMinutes * 60;
  updateTimerDisplay();
  updateButtonStates();

  showToast(`Focus session completed! +${xpEarned} XP`, "success");
}

function updateButtonStates() {
  startTimerBtn.disabled = isRunning;
  pauseTimerBtn.disabled = !isRunning;
  resetTimerBtn.disabled = !isRunning && secondsRemaining === focusMinutes * 60;

  increaseTimeBtn.disabled = isRunning;
  decreaseTimeBtn.disabled = isRunning;

  if (isRunning) {
    increaseTimeBtn.style.opacity = "0.5";
    decreaseTimeBtn.style.opacity = "0.5";
  } else {
    increaseTimeBtn.style.opacity = "1";
    decreaseTimeBtn.style.opacity = "1";
  }
}

function toggleFullscreen() {
  if (isFullscreen) {
    exitFullscreenFocus();
  } else {
    enterFullscreenFocus();
  }
}

function enterFullscreenFocus() {
  if (isFullscreen) return;

  if (!fullscreenFocusElement) {
    fullscreenFocusElement = document.createElement("div");
    fullscreenFocusElement.className = "fullscreen-focus";
    fullscreenFocusElement.innerHTML = `
      <div class="focus-timer-container">
        <div id="fullscreen-timer" class="text-5xl mb-6">${timerDisplay.textContent}</div>
        <div class="focus-message">Stay focused! You're building a better you.</div>
        <div class="mt-4 text-center">
          <button id="fullscreen-exit" class="focus-btn bg-red-600 hover:bg-red-700">Exit Focus Mode</button>
        </div>
      </div>
    `;

    document.body.appendChild(fullscreenFocusElement);

    document
      .getElementById("fullscreen-exit")
      .addEventListener("click", exitFullscreenFocus);
  }

  const fullscreenTimer = document.getElementById("fullscreen-timer");
  if (fullscreenTimer) {
    fullscreenTimer.textContent = timerDisplay.textContent;
  }

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable fullscreen mode: ${err.message}`
      );
    });
  }

  fullscreenFocusElement.style.display = "flex";
  isFullscreen = true;

  if (isRunning) {
    startFullscreenTimerUpdates();
  }
}

function exitFullscreenFocus() {
  if (!isFullscreen) return;

  if (document.exitFullscreen && document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.error(`Error attempting to exit fullscreen mode: ${err.message}`);
    });
  }

  if (fullscreenFocusElement) {
    fullscreenFocusElement.style.display = "none";
  }

  isFullscreen = false;
}

function handleFullscreenChange() {
  isFullscreen = !!document.fullscreenElement;

  fullscreenToggleBtn.textContent = isFullscreen
    ? "Exit Fullscreen"
    : "Fullscreen";
}

function startFullscreenTimerUpdates() {
  const fullscreenTimerInterval = setInterval(() => {
    const fullscreenTimer = document.getElementById("fullscreen-timer");
    if (isFullscreen && fullscreenTimer) {
      fullscreenTimer.textContent = timerDisplay.textContent;
    } else {
      clearInterval(fullscreenTimerInterval);
    }
  }, 1000);
}

function getXpForNextLevel(level) {
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(level, 1.5));
}

function updateXpDisplay() {
  const nextLevelXp = getXpForNextLevel(userData.level);

  levelDisplay.textContent = userData.level;
  currentXpDisplay.textContent = userData.currentXp;
  xpToLevelDisplay.textContent = nextLevelXp;

  const progressPercentage = (userData.currentXp / nextLevelXp) * 100;
  xpProgress.style.width = `${progressPercentage}%`;
}

function awardXp(xpAmount) {
  userData.currentXp += xpAmount;
  userData.totalXp += xpAmount;

  checkForLevelUp();

  saveUserData();

  xpProgress.classList.add("xp-gain");
  setTimeout(() => {
    xpProgress.classList.remove("xp-gain");
  }, 1000);

  updateXpDisplay();
}

function checkForLevelUp() {
  const nextLevelXp = getXpForNextLevel(userData.level);

  while (userData.currentXp >= nextLevelXp) {
    userData.level++;
    userData.currentXp -= nextLevelXp;

    levelDisplay.classList.add("level-up");
    setTimeout(() => {
      levelDisplay.classList.remove("level-up");
    }, 1500);

    showToast(`Level Up! You are now level ${userData.level}`, "success");
  }
}

function changeCharacter() {
  userData.currentCharacterIndex =
    (userData.currentCharacterIndex + 1) % characterImages.length;
  saveUserData();

  avatarImg.src = `/images/${characterImages[userData.currentCharacterIndex]}`;

  const characterName = characterImages[userData.currentCharacterIndex].replace(
    ".png",
    ""
  );
  showToast(`Character changed to ${characterName}!`, "info");
}

function handleKeyboardShortcuts(e) {
  if (e.altKey && e.key.toLowerCase() === "s" && !startTimerBtn.disabled) {
    e.preventDefault();
    startTimer();
  }

  if (e.altKey && e.key.toLowerCase() === "p" && !pauseTimerBtn.disabled) {
    e.preventDefault();
    pauseTimer();
  }

  if (e.altKey && e.key.toLowerCase() === "r" && !resetTimerBtn.disabled) {
    e.preventDefault();
    resetTimer();
  }

  if (e.altKey && e.key.toLowerCase() === "f") {
    e.preventDefault();
    toggleFullscreen();
  }

  if (e.altKey && e.key === "ArrowUp" && !isRunning) {
    e.preventDefault();
    increaseTime();
  }

  if (e.altKey && e.key === "ArrowDown" && !isRunning) {
    e.preventDefault();
    decreaseTime();
  }

  if (e.key === "Escape" && isFullscreen) {
    exitFullscreenFocus();
  }
}

function saveUserData() {
  localStorage.setItem("userData", JSON.stringify(userData));
}

function showToast(message, type) {
  const bgColors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    info: "linear-gradient(to right, #2193b0, #6dd5ed)",
    warning: "linear-gradient(to right, #f6d365, #fda085)",
  };

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: bgColors[type] || bgColors.info,
    },
    stopOnFocus: true,
  }).showToast();
}

document.addEventListener("DOMContentLoaded", initializeApp);
