import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// --- Story System Start
import StoryManager from './storymanager.js';

const storyTabButton = document.getElementById("story-tab-button");
const storyContainer = document.getElementById("story-container");
const storyContent = document.getElementById("story-content");
const nextStoryInfo = document.getElementById("next-story-info");
// --- Story System End

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

  // --- Story System Start
  const storyManager = initializeStorySystem();
  // --- Story System End
}

// --- Story System Start
function initializeStorySystem() {
  const storyManager = new StoryManager(userData.level);
  updateStoryUI(storyManager);

  if (storyTabButton) {
    storyTabButton.addEventListener("click", () => {
      updateStoryUI(storyManager);
    });
  }

  window.storyManager = storyManager;
  return storyManager;
}

function updateStoryUI(storyManager) {
  if (!storyContainer || !storyContent || !nextStoryInfo) return;

  const latestContent = storyManager.getLatestUnlockedContent();
  storyContent.innerHTML = '';

  if (latestContent) {
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'rpg-heading text-xl mb-4';
    sectionTitle.textContent = formatSectionTitle(latestContent.sectionKey);
    storyContent.appendChild(sectionTitle);

    latestContent.content.forEach(line => {
      const paragraph = document.createElement('p');
      paragraph.className = 'mb-2 text-white';
      paragraph.textContent = line;
      storyContent.appendChild(paragraph);
    });

    const availableSections = storyManager.getAvailableSections();

    if (availableSections.length > 1) {
      const unlockedSections = document.createElement('div');
      unlockedSections.className = 'mt-6 p-2 rpg-border';

      const unlockedTitle = document.createElement('h4');
      unlockedTitle.className = 'rpg-heading mb-2';
      unlockedTitle.textContent = 'Unlocked Chapters';
      unlockedSections.appendChild(unlockedTitle);

      const chapterList = document.createElement('div');
      chapterList.className = 'flex flex-wrap gap-2';

      availableSections.forEach(sectionIndex => {
        const chapterBtn = document.createElement('button');
        chapterBtn.className = 'focus-btn bg-rpg-brown hover:bg-rpg-dark-brown px-3 py-1';
        chapterBtn.textContent = formatSectionTitle(storyManager.getSectionName(sectionIndex));

        chapterBtn.addEventListener('click', () => {
          displayStorySection(storyManager, sectionIndex);
        });

        chapterList.appendChild(chapterBtn);
      });

      unlockedSections.appendChild(chapterList);
      storyContent.appendChild(unlockedSections);
    }
  } else {
    const noContent = document.createElement('p');
    noContent.className = 'text-center text-white';
    noContent.textContent = 'Complete focus sessions to unlock story content!';
    storyContent.appendChild(noContent);
  }

  const nextSectionInfo = storyManager.isNextSectionUnlocked();
  nextStoryInfo.innerHTML = '';

  const nextInfoText = document.createElement('p');
  nextInfoText.className = 'text-center';

  if (nextSectionInfo.levelDifference <= 0) {
    nextInfoText.textContent = 'You have unlocked all available story content!';
  } else {
    nextInfoText.innerHTML = `Next story unlocks in <span class="text-rpg-gold font-bold">${nextSectionInfo.levelDifference}</span> more level${nextSectionInfo.levelDifference > 1 ? 's' : ''}!`;
  }

  nextStoryInfo.appendChild(nextInfoText);
}

function formatSectionTitle(sectionKey) {
  if (sectionKey === 'prologue') return 'Prologue';
  if (sectionKey === 'epilogue') return 'Epilogue';

  const match = sectionKey.match(/section(\d+)/);
  if (match && match[1]) {
    return `Chapter ${match[1]}`;
  }

  return sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
}

function displayStorySection(storyManager, sectionIndex) {
  if (!storyContent) return;

  const sectionContent = storyManager.getSectionContent(sectionIndex);
  if (!sectionContent) return;

  storyContent.innerHTML = '';

  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'rpg-heading text-xl mb-4';
  sectionTitle.textContent = formatSectionTitle(storyManager.getSectionName(sectionIndex));
  storyContent.appendChild(sectionTitle);

  sectionContent.forEach(line => {
    const paragraph = document.createElement('p');
    paragraph.className = 'mb-2 text-white';
    paragraph.textContent = line;
    storyContent.appendChild(paragraph);
  });

  const backButton = document.createElement('button');
  backButton.className = 'focus-btn bg-rpg-brown hover:bg-rpg-dark-brown mt-4';
  backButton.textContent = 'Back to Latest Chapter';
  backButton.addEventListener('click', () => {
    updateStoryUI(storyManager);
  });

  storyContent.appendChild(backButton);
}

function updateStoryAfterLevelUp() {
  if (window.storyManager) {
    const levelUpResult = window.storyManager.incrementUserLevel(0);
    if (levelUpResult.newSectionUnlocked) {
      showToast(`New story chapter unlocked!`, "success");

      const storyNotification = Toastify({
        text: "New story chapter available! Click to view.",
        duration: 5000,
        gravity: "bottom",
        position: "center",
        style: {
          background: "linear-gradient(to right, #8a5a2b, #583a1e)",
          border: "1px solid var(--rpg-gold)",
        },
        onClick: function () {
          if (storyTabButton) {
            storyTabButton.click();
          }
          updateStoryUI(window.storyManager);
        },
        stopOnFocus: true,
      }).showToast();
    }

    if (storyContainer && window.getComputedStyle(storyContainer).display !== 'none') {
      updateStoryUI(window.storyManager);
    }
  }
}

