import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import StoryManager from "./storymanager.js";
import { updateTasksContainer } from "./tasks-container.js";

const storyTabButton = document.getElementById("story-tab-button");
const storyContainer = document.getElementById("story-container");
const storyContent = document.getElementById("story-content");
const nextStoryInfo = document.getElementById("next-story-info");

const storyScrollContent = document.getElementById("story-scroll-content");
const tasksScrollContent = document.getElementById("tasks-scroll-content");
const taskList = document.getElementById("task-list");
const addTaskBtn = document.getElementById("add-task-btn");

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
  completedTasks: [],
  activeTasks: [],
};

let userData = JSON.parse(localStorage.getItem("userData")) || defaultUserData;

if (userData.focusMinutes) {
  focusMinutes = Math.max(userData.focusMinutes, MIN_FOCUS_MINUTES);
} else {
  userData.focusMinutes = MIN_FOCUS_MINUTES;
}

if (!userData.completedTasks) {
  userData.completedTasks = [];
}

if (!userData.activeTasks) {
  userData.activeTasks = [];
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

  const storyManager = initializeStorySystem();

  initializeTaskSystem(storyManager);
}

function initializeStorySystem() {
  const storyManager = new StoryManager(userData.level);
  updateStoryUI(storyManager);
  updateStoryScrollUI(storyManager);

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
  storyContent.innerHTML = "";

  if (latestContent) {
    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "rpg-heading text-xl mb-4";
    sectionTitle.textContent = formatSectionTitle(latestContent.sectionKey);
    storyContent.appendChild(sectionTitle);

    latestContent.content.forEach((line) => {
      const paragraph = document.createElement("p");
      paragraph.className = "mb-2 text-white";
      paragraph.textContent = line;
      storyContent.appendChild(paragraph);
    });

    const availableSections = storyManager.getAvailableSections();

    if (availableSections.length > 1) {
      const unlockedSections = document.createElement("div");
      unlockedSections.className = "mt-6 p-2 rpg-border";

      const unlockedTitle = document.createElement("h4");
      unlockedTitle.className = "rpg-heading mb-2";
      unlockedTitle.textContent = "Unlocked Chapters";
      unlockedSections.appendChild(unlockedTitle);

      const chapterList = document.createElement("div");
      chapterList.className = "flex flex-wrap gap-2";

      availableSections.forEach((sectionIndex) => {
        const chapterBtn = document.createElement("button");
        chapterBtn.className =
          "focus-btn bg-rpg-brown hover:bg-rpg-dark-brown px-3 py-1";
        chapterBtn.textContent = formatSectionTitle(
          storyManager.getSectionName(sectionIndex)
        );

        chapterBtn.addEventListener("click", () => {
          displayStorySection(storyManager, sectionIndex);
        });

        chapterList.appendChild(chapterBtn);
      });

      unlockedSections.appendChild(chapterList);
      storyContent.appendChild(unlockedSections);
    }
  } else {
    const noContent = document.createElement("p");
    noContent.className = "text-center text-white";
    noContent.textContent = "Complete focus sessions to unlock story content!";
    storyContent.appendChild(noContent);
  }

  const nextSectionInfo = storyManager.isNextSectionUnlocked();
  nextStoryInfo.innerHTML = "";

  const nextInfoText = document.createElement("p");
  nextInfoText.className = "text-center";

  if (nextSectionInfo.levelDifference <= 0) {
    nextInfoText.textContent = "You have unlocked all available story content!";
  } else {
    nextInfoText.innerHTML = `Next story unlocks in <span class="text-rpg-gold font-bold">${
      nextSectionInfo.levelDifference
    }</span> more level${nextSectionInfo.levelDifference > 1 ? "s" : ""}!`;
  }

  nextStoryInfo.appendChild(nextInfoText);
}

function updateStoryScrollUI(storyManager) {
  if (!storyScrollContent) return;

  storyScrollContent.innerHTML = "";

  const availableSections = storyManager.getAvailableSections();

  if (availableSections.length > 0) {
    const storyTitle = document.createElement("h3");
    storyTitle.className = "rpg-heading text-xl mb-4";
    storyTitle.textContent = "Your Story";
    storyScrollContent.appendChild(storyTitle);

    availableSections.forEach((sectionIndex) => {
      const storySection = document.createElement("div");
      storySection.className = "rpg-border p-3 mb-4";

      const sectionTitle = document.createElement("h4");
      sectionTitle.className = "rpg-heading mb-2";
      sectionTitle.textContent = formatSectionTitle(
        storyManager.getSectionName(sectionIndex)
      );
      storySection.appendChild(sectionTitle);

      const sectionContent = storyManager.getSectionContent(sectionIndex);

      if (sectionContent && sectionContent.length > 0) {
        const contentPreview = document.createElement("p");
        contentPreview.className = "text-white mb-2";
        contentPreview.textContent =
          sectionContent[0].substring(0, 100) + "...";
        storySection.appendChild(contentPreview);

        const readMoreBtn = document.createElement("button");
        readMoreBtn.className =
          "focus-btn bg-rpg-brown hover:bg-rpg-dark-brown text-sm px-3 py-1";
        readMoreBtn.textContent = "Read Full Chapter";
        readMoreBtn.addEventListener("click", () => {
          displayStoryScrollSection(storyManager, sectionIndex);
        });
        storySection.appendChild(readMoreBtn);
      }

      storyScrollContent.appendChild(storySection);
    });

    const nextSectionInfo = storyManager.isNextSectionUnlocked();
    const nextInfoDiv = document.createElement("div");
    nextInfoDiv.className = "mt-4 text-center";

    if (nextSectionInfo.levelDifference <= 0) {
      nextInfoDiv.textContent =
        "You have unlocked all available story content!";
    } else {
      nextInfoDiv.innerHTML = `Next chapter unlocks at <span class="text-rpg-gold font-bold">level ${nextSectionInfo.nextSectionLevel}</span>!`;
    }

    storyScrollContent.appendChild(nextInfoDiv);
  } else {
    const noContent = document.createElement("p");
    noContent.className = "text-center text-white";
    noContent.textContent = "Complete focus sessions to unlock story content!";
    storyScrollContent.appendChild(noContent);
  }
}

function displayStoryScrollSection(storyManager, sectionIndex) {
  if (!storyScrollContent) return;

  const sectionContent = storyManager.getSectionContent(sectionIndex);
  if (!sectionContent) return;

  storyScrollContent.innerHTML = "";

  const backButton = document.createElement("button");
  backButton.className = "focus-btn bg-rpg-brown hover:bg-rpg-dark-brown mb-4";
  backButton.textContent = "← Back to Chapters";
  backButton.addEventListener("click", () => {
    updateStoryScrollUI(storyManager);
  });
  storyScrollContent.appendChild(backButton);

  const sectionTitle = document.createElement("h3");
  sectionTitle.className = "rpg-heading text-xl mb-4";
  sectionTitle.textContent = formatSectionTitle(
    storyManager.getSectionName(sectionIndex)
  );
  storyScrollContent.appendChild(sectionTitle);

  sectionContent.forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.className = "mb-2 text-white";
    paragraph.textContent = line;
    storyScrollContent.appendChild(paragraph);
  });
}

function formatSectionTitle(sectionKey) {
  if (sectionKey === "prologue") return "Prologue";
  if (sectionKey === "epilogue") return "Epilogue";

  const match = sectionKey.match(/section(\d+)/);
  if (match && match[1]) {
    return `Chapter ${match[1]}`;
  }

  const segMatch = sectionKey.match(/seg(\d+)/);
  if (segMatch && segMatch[1]) {
    return `Chapter ${segMatch[1]}`;
  }

  return sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
}

function displayStorySection(storyManager, sectionIndex) {
  if (!storyContent) return;

  const sectionContent = storyManager.getSectionContent(sectionIndex);
  if (!sectionContent) return;

  storyContent.innerHTML = "";

  const sectionTitle = document.createElement("h3");
  sectionTitle.className = "rpg-heading text-xl mb-4";
  sectionTitle.textContent = formatSectionTitle(
    storyManager.getSectionName(sectionIndex)
  );
  storyContent.appendChild(sectionTitle);

  sectionContent.forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.className = "mb-2 text-white";
    paragraph.textContent = line;
    storyContent.appendChild(paragraph);
  });

  const backButton = document.createElement("button");
  backButton.className = "focus-btn bg-rpg-brown hover:bg-rpg-dark-brown mt-4";
  backButton.textContent = "Back to Latest Chapter";
  backButton.addEventListener("click", () => {
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

      generateTasksForNewStory(
        window.storyManager,
        levelUpResult.unlockedSection
      );
    }

    if (
      storyContainer &&
      window.getComputedStyle(storyContainer).display !== "none"
    ) {
      updateStoryUI(window.storyManager);
    }

    updateStoryScrollUI(window.storyManager);
    updateTasksScrollUI();
  }
}

function initializeTaskSystem(storyManager) {
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      addCustomTask();
    });
  }

  generateInitialTasks(storyManager);

  updateTasksScrollUI();
}

function generateInitialTasks(storyManager) {
  const availableSections = storyManager.getAvailableSections();

  availableSections.forEach((sectionIndex) => {
    const sectionKey = storyManager.getSectionName(sectionIndex);
    generateTasksForStorySection(storyManager, sectionKey);
  });
}

function generateTasksForNewStory(storyManager, sectionKey) {
  if (generateTasksForStorySection(storyManager, sectionKey)) {
    showToast("New tasks available!", "info");
    updateTasksScrollUI();
  }
}

function generateTasksForStorySection(storyManager, sectionKey) {
  if (!sectionKey) return false;

  let newTasksGenerated = false;
  const sectionTasks = getTasksForStorySection(sectionKey);

  if (sectionTasks && sectionTasks.length > 0) {
    sectionTasks.forEach((task) => {
      const taskExists =
        userData.activeTasks.some((t) => t.id === task.id) ||
        userData.completedTasks.some((t) => t.id === task.id);

      if (!taskExists) {
        userData.activeTasks.push(task);
        newTasksGenerated = true;
      }
    });

    if (newTasksGenerated) {
      saveUserData();
    }
  }

  return newTasksGenerated;
}

function getTasksForStorySection(sectionKey) {
  const tasksBySection = {
    prologue: [
      {
        id: "prologue-1",
        title: "Begin Your Journey",
        description:
          "Complete your first focus session to set out on your adventure.",
        xp: 20,
        section: "prologue",
      },
      {
        id: "prologue-2",
        title: "Establish a Routine",
        description: "Complete 3 focus sessions in one day.",
        xp: 30,
        section: "prologue",
      },
    ],
    seg1: [
      {
        id: "seg1-1",
        title: "Training the Fledgling Warrior",
        description:
          "Complete 5 focus sessions in total to begin your training.",
        xp: 40,
        section: "seg1",
      },
      {
        id: "seg1-2",
        title: "Understand Your Enemy",
        description:
          "Set a goal for yourself in writing and complete a focus session.",
        xp: 35,
        section: "seg1",
      },
    ],
    seg2: [
      {
        id: "seg2-1",
        title: "Amateur Dream Weaver",
        description: "Complete a focus session of at least 45 minutes.",
        xp: 45,
        section: "seg2",
      },
      {
        id: "seg2-2",
        title: "Strengthen Your Resolve",
        description: "Complete 3 focus sessions on consecutive days.",
        xp: 50,
        section: "seg2",
      },
    ],
    seg3: [
      {
        id: "seg3-1",
        title: "Full-Fledged Warrior",
        description:
          "Complete a total of 15 focus sessions to prove your worth.",
        xp: 60,
        section: "seg3",
      },
      {
        id: "seg3-2",
        title: "Evade Procrastination",
        description: "Complete a focus session first thing in the morning.",
        xp: 55,
        section: "seg3",
      },
    ],
    seg4: [
      {
        id: "seg4-1",
        title: "The Mighty Dreamer's Balance",
        description:
          "Take a day off after completing 5 consecutive days of focus.",
        xp: 70,
        section: "seg4",
      },
      {
        id: "seg4-2",
        title: "Sharpen Your Focus",
        description: "Complete a focus session of at least 60 minutes.",
        xp: 65,
        section: "seg4",
      },
    ],
    seg5: [
      {
        id: "seg5-1",
        title: "Master Dream Weaver",
        description: "Complete a total of 30 focus sessions.",
        xp: 80,
        section: "seg5",
      },
      {
        id: "seg5-2",
        title: "Shape Reality",
        description: "Write down three achievements from your focus sessions.",
        xp: 75,
        section: "seg5",
      },
    ],
    seg6: [
      {
        id: "seg6-1",
        title: "Seasoned Dreamer",
        description: "Complete 5 focus sessions in a single day.",
        xp: 90,
        section: "seg6",
      },
      {
        id: "seg6-2",
        title: "Weakening Procrastination",
        description:
          "Complete a focus session immediately when you feel the urge to procrastinate.",
        xp: 85,
        section: "seg6",
      },
    ],
    seg7: [
      {
        id: "seg7-1",
        title: "Train a Party",
        description:
          "Introduce a friend to focus techniques and complete a session together.",
        xp: 100,
        section: "seg7",
      },
      {
        id: "seg7-2",
        title: "Dream Weaver Skills",
        description:
          "Try a new productivity technique during your focus session.",
        xp: 95,
        section: "seg7",
      },
    ],
    seg8: [
      {
        id: "seg8-1",
        title: "Legendary Dream Weaver",
        description: "Complete a total of 50 focus sessions.",
        xp: 120,
        section: "seg8",
      },
      {
        id: "seg8-2",
        title: "Twist Reality",
        description:
          "Write down how your productivity has improved since starting your journey.",
        xp: 110,
        section: "seg8",
      },
    ],
    seg9: [
      {
        id: "seg9-1",
        title: "Hailed as a Hero",
        description:
          "Complete 60 total focus sessions to prepare for the final battle.",
        xp: 150,
        section: "seg9",
      },
      {
        id: "seg9-2",
        title: "See Through Illusions",
        description:
          "Identify and eliminate three major distractions from your focus sessions.",
        xp: 130,
        section: "seg9",
      },
    ],
    seg10: [
      {
        id: "seg10-1",
        title: "The Final Battle",
        description:
          "Complete a 90-minute focus session to battle Procrastination.",
        xp: 200,
        section: "seg10",
      },
      {
        id: "seg10-2",
        title: "Battle of Wills",
        description: "Complete 7 consecutive days of focus sessions.",
        xp: 180,
        section: "seg10",
      },
    ],
    epilogue: [
      {
        id: "epilogue-1",
        title: "Legend of the Dream World",
        description: "Write a reflection on your entire productivity journey.",
        xp: 250,
        section: "epilogue",
      },
      {
        id: "epilogue-2",
        title: "New Beginnings",
        description:
          "Set three new productivity goals for your continued journey.",
        xp: 200,
        section: "epilogue",
      },
    ],
  };

  return tasksBySection[sectionKey] || [];
}

function addCustomTask() {
  const taskTitle = prompt("Enter task title:");
  if (!taskTitle) return;

  const taskDescription = prompt("Enter task description:");
  if (!taskDescription) return;

  const taskXp = parseInt(prompt("Enter XP reward (10-100):", "25")) || 25;

  const newTask = {
    id: "custom-" + Date.now(),
    title: taskTitle,
    description: taskDescription,
    xp: Math.max(10, Math.min(100, taskXp)),
    section: "custom",
  };

  userData.activeTasks.push(newTask);
  saveUserData();
  updateTasksScrollUI();

  showToast("Custom task added!", "success");
}

function updateTasksScrollUI() {
  if (!taskList) return;

  taskList.innerHTML = "";

  if (userData.activeTasks.length === 0) {
    const noTasks = document.createElement("div");
    noTasks.className = "text-center p-4";
    noTasks.textContent =
      "No active tasks. Complete focus sessions to unlock story and tasks!";
    taskList.appendChild(noTasks);
    return;
  }

  userData.activeTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.id = `task-${task.id}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        completeTask(task.id);
      }
    });

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const titleRow = document.createElement("div");
    titleRow.className = "flex items-center";

    const taskTitle = document.createElement("div");
    taskTitle.className = "task-title";
    taskTitle.textContent = task.title;

    const taskXp = document.createElement("div");
    taskXp.className = "task-xp";
    taskXp.textContent = `${task.xp} XP`;

    titleRow.appendChild(taskTitle);
    titleRow.appendChild(taskXp);

    const taskDesc = document.createElement("div");
    taskDesc.className = "task-description";
    taskDesc.textContent = task.description;

    taskContent.appendChild(titleRow);
    taskContent.appendChild(taskDesc);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);

    taskList.appendChild(taskItem);
  });

  if (userData.completedTasks.length > 0) {
    const completedTitle = document.createElement("h4");
    completedTitle.className = "rpg-heading mt-6 mb-2";
    completedTitle.textContent = "Completed Tasks";
    taskList.appendChild(completedTitle);

    userData.completedTasks.slice(0, 5).forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item completed";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = true;
      checkbox.disabled = true;

      const taskContent = document.createElement("div");
      taskContent.className = "task-content";

      const titleRow = document.createElement("div");
      titleRow.className = "flex items-center";

      const taskTitle = document.createElement("div");
      taskTitle.className = "task-title";
      taskTitle.textContent = task.title;

      const taskXp = document.createElement("div");
      taskXp.className = "task-xp";
      taskXp.textContent = `${task.xp} XP`;

      titleRow.appendChild(taskTitle);
      titleRow.appendChild(taskXp);

      const taskDesc = document.createElement("div");
      taskDesc.className = "task-description";
      taskDesc.textContent = task.description;

      taskContent.appendChild(titleRow);
      taskContent.appendChild(taskDesc);

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskContent);

      taskList.appendChild(taskItem);
    });
  }
}

function completeTask(taskId) {
  const taskIndex = userData.activeTasks.findIndex(
    (task) => task.id === taskId
  );

  if (taskIndex !== -1) {
    const task = userData.activeTasks[taskIndex];

    awardXP(task.xp);

    userData.activeTasks.splice(taskIndex, 1);
    userData.completedTasks.push({ ...task, completedAt: Date.now() });

    saveUserData();
    updateTasksScrollUI();

    showToast(`Task completed! +${task.xp} XP`, "success");

    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.classList.add("completed");
    }

    document.dispatchEvent(new Event("taskCompleted"));
  }
}

document.addEventListener("markTaskCompleted", (event) => {
  if (event.detail && event.detail.taskId) {
    completeTask(event.detail.taskId);
  }
});

function awardXP(amount) {
  userData.currentXp += amount;
  userData.totalXp += amount;

  const xpToNextLevel = BASE_XP_PER_LEVEL * userData.level;

  if (userData.currentXp >= xpToNextLevel) {
    userData.currentXp -= xpToNextLevel;
    userData.level++;

    levelDisplay.textContent = userData.level;

    updateXpDisplay();
    saveUserData();

    showToast(`Level Up! You are now level ${userData.level}`, "success");
    levelDisplay.classList.add("level-up");
    setTimeout(() => {
      levelDisplay.classList.remove("level-up");
    }, 2000);

    updateStoryAfterLevelUp();
  } else {
    updateXpDisplay();
    saveUserData();
  }
}

function updateXpDisplay() {
  const xpToNextLevel = BASE_XP_PER_LEVEL * userData.level;

  levelDisplay.textContent = userData.level;
  currentXpDisplay.textContent = userData.currentXp;
  xpToLevelDisplay.textContent = xpToNextLevel;

  const percentage = (userData.currentXp / xpToNextLevel) * 100;
  xpProgress.style.width = `${percentage}%`;
  xpProgress.style.backgroundColor = `var(--rpg-xp-color)`;
}

function saveUserData() {
  localStorage.setItem("userData", JSON.stringify(userData));
}

document.addEventListener("DOMContentLoaded", () => {
  const tasksTabButton = document.getElementById("tasks-tab-button");
  if (tasksTabButton) {
    tasksTabButton.addEventListener("click", () => {
      updateTasksContainer();
    });
  }

  initializeApp();
});

function updateTimerDisplay() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startTimerBtn.disabled = true;
  pauseTimerBtn.disabled = false;
  resetTimerBtn.disabled = false;

  timerInterval = setInterval(() => {
    secondsRemaining--;

    if (secondsRemaining <= 0) {
      completeSession();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  isRunning = false;
  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;

  clearInterval(timerInterval);
}

function resetTimer() {
  isRunning = false;
  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;
  resetTimerBtn.disabled = true;

  clearInterval(timerInterval);
  secondsRemaining = focusMinutes * 60;
  updateTimerDisplay();
}

function completeSession() {
  clearInterval(timerInterval);
  isRunning = false;

  userData.sessionsCompleted++;
  userData.totalFocusMinutes += focusMinutes;

  awardXP(XP_PER_SESSION);

  sessionsCount.textContent = userData.sessionsCompleted;
  totalFocusTime.textContent = userData.totalFocusMinutes;

  secondsRemaining = focusMinutes * 60;
  updateTimerDisplay();

  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;
  resetTimerBtn.disabled = true;

  showToast("Focus session completed! 🎉", "success");
}

function increaseTime() {
  if (isRunning) return;

  focusMinutes += TIME_INCREMENT;
  secondsRemaining = focusMinutes * 60;

  userData.focusMinutes = focusMinutes;
  saveUserData();

  updateTimerDisplay();
}

function decreaseTime() {
  if (isRunning) return;

  focusMinutes = Math.max(MIN_FOCUS_MINUTES, focusMinutes - TIME_INCREMENT);
  secondsRemaining = focusMinutes * 60;

  userData.focusMinutes = focusMinutes;
  saveUserData();

  updateTimerDisplay();
}

function changeCharacter() {
  userData.currentCharacterIndex =
    (userData.currentCharacterIndex + 1) % characterImages.length;

  avatarImg.src = `/images/${characterImages[userData.currentCharacterIndex]}`;

  saveUserData();
  showToast("Character changed!", "info");
}

function handleKeyboardShortcuts(e) {
  if (e.altKey && e.code === "Space") {
    e.preventDefault();
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }
}

function toggleFullscreen() {
  if (!isFullscreen) {
    enterFullscreenMode();
  } else {
    exitFullscreenMode();
  }
}

function enterFullscreenMode() {
  if (fullscreenFocusElement) return;

  fullscreenFocusElement = document.createElement("div");
  fullscreenFocusElement.className = "fullscreen-focus";

  const container = document.createElement("div");
  container.className = "focus-timer-container";

  const timerElement = document.createElement("div");
  timerElement.id = "fullscreen-timer";
  timerElement.textContent = timerDisplay.textContent;
  timerElement.style.fontSize = "6rem";
  timerElement.style.fontWeight = "bold";
  timerElement.style.textAlign = "center";
  timerElement.style.color = "var(--rpg-gold)";
  timerElement.style.textShadow = "0 0 10px rgba(236, 190, 111, 0.5)";

  const messageElement = document.createElement("div");
  messageElement.className = "focus-message";
  messageElement.textContent = "Stay focused on your task...";

  const exitButton = document.createElement("button");
  exitButton.className = "focus-btn";
  exitButton.textContent = "Exit Fullscreen";
  exitButton.style.marginTop = "2rem";
  exitButton.addEventListener("click", exitFullscreenMode);

  container.appendChild(timerElement);
  container.appendChild(messageElement);
  container.appendChild(exitButton);

  fullscreenFocusElement.appendChild(container);
  document.body.appendChild(fullscreenFocusElement);

  const originalUpdateTimerDisplay = updateTimerDisplay;
  updateTimerDisplay = function () {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const timeText = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    timerDisplay.textContent = timeText;
    if (timerElement) {
      timerElement.textContent = timeText;
    }
  };

  isFullscreen = true;

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}

function exitFullscreenMode() {
  if (!fullscreenFocusElement) return;

  document.body.removeChild(fullscreenFocusElement);
  fullscreenFocusElement = null;

  updateTimerDisplay = function () {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  isFullscreen = false;

  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  if (!document.fullscreenElement && isFullscreen) {
    exitFullscreenMode();
  }
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
