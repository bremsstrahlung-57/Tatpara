function updateTasksContainer() {
  const tasksContainer = document.getElementById("tasks-container");
  if (!tasksContainer) return;

  const userData = JSON.parse(localStorage.getItem("userData")) || {
    activeTasks: [],
    completedTasks: [],
  };

  tasksContainer.innerHTML = "";

  const activeTasks = document.createElement("div");
  activeTasks.className = "mb-6";

  const activeTasksTitle = document.createElement("h3");
  activeTasksTitle.className = "rpg-heading text-xl mb-4";
  activeTasksTitle.textContent = "Active Tasks";
  activeTasks.appendChild(activeTasksTitle);

  if (userData.activeTasks && userData.activeTasks.length > 0) {
    userData.activeTasks.forEach((task) => {
      const taskCard = createTaskCard(task, true);
      activeTasks.appendChild(taskCard);
    });
  } else {
    const noTasks = document.createElement("p");
    noTasks.className = "text-center p-4";
    noTasks.textContent =
      "No active tasks. New tasks are unlocked as you progress in the story!";
    activeTasks.appendChild(noTasks);
  }

  tasksContainer.appendChild(activeTasks);

  const completedTasks = document.createElement("div");
  completedTasks.className = "mt-4";

  const completedTasksTitle = document.createElement("h3");
  completedTasksTitle.className = "rpg-heading text-xl mb-4";
  completedTasksTitle.textContent = "Completed Tasks";
  completedTasks.appendChild(completedTasksTitle);

  if (userData.completedTasks && userData.completedTasks.length > 0) {
    userData.completedTasks.slice(0, 10).forEach((task) => {
      const taskCard = createTaskCard(task, false);
      completedTasks.appendChild(taskCard);
    });

    if (userData.completedTasks.length > 10) {
      const moreCompletedText = document.createElement("p");
      moreCompletedText.className = "text-center mt-4 text-rpg-gold";
      moreCompletedText.textContent = `+ ${
        userData.completedTasks.length - 10
      } more completed tasks`;
      completedTasks.appendChild(moreCompletedText);
    }
  } else {
    const noCompletedTasks = document.createElement("p");
    noCompletedTasks.className = "text-center p-4";
    noCompletedTasks.textContent =
      "No completed tasks yet. Start completing tasks to earn XP!";
    completedTasks.appendChild(noCompletedTasks);
  }

  tasksContainer.appendChild(completedTasks);
}

function createTaskCard(task, isActive) {
  const taskCard = document.createElement("div");
  taskCard.className = `rpg-border p-3 mb-3 ${isActive ? "" : "completed"}`;

  const taskHeader = document.createElement("div");
  taskHeader.className = "flex justify-between items-center mb-2";

  const taskTitle = document.createElement("h4");
  taskTitle.className = "rpg-heading";
  taskTitle.textContent = task.title;

  const taskXp = document.createElement("div");
  taskXp.className = "task-xp";
  taskXp.textContent = `${task.xp} XP`;

  taskHeader.appendChild(taskTitle);
  taskHeader.appendChild(taskXp);

  const taskDescription = document.createElement("p");
  taskDescription.className = "text-white mb-3";
  taskDescription.textContent = task.description;

  taskCard.appendChild(taskHeader);
  taskCard.appendChild(taskDescription);

  if (isActive) {
    const completeBtn = document.createElement("button");
    completeBtn.className =
      "focus-btn bg-rpg-brown hover:bg-rpg-dark-brown text-sm px-3 py-1";
    completeBtn.textContent = "Mark as Completed";
    completeBtn.addEventListener("click", () => {
      completeTaskFromContainer(task.id);
    });
    taskCard.appendChild(completeBtn);
  } else {
    const completedStatus = document.createElement("div");
    completedStatus.className = "text-rpg-green text-right text-sm";

    if (task.completedAt) {
      completedStatus.textContent = `Completed on ${new Date(
        task.completedAt
      ).toLocaleDateString()}`;
    } else {
      completedStatus.textContent = "Completed";
    }

    taskCard.appendChild(completedStatus);
  }

  return taskCard;
}

function completeTaskFromContainer(taskId) {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    activeTasks: [],
    completedTasks: [],
  };

  const taskIndex = userData.activeTasks.findIndex(
    (task) => task.id === taskId
  );

  if (taskIndex !== -1) {
    const task = userData.activeTasks[taskIndex];

    const markCompletedEvent = new CustomEvent("markTaskCompleted", {
      detail: { taskId },
    });
    document.dispatchEvent(markCompletedEvent);

    setTimeout(() => {
      updateTasksContainer();
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tasksTabButton = document.getElementById("tasks-tab-button");

  if (tasksTabButton) {
    tasksTabButton.addEventListener("click", updateTasksContainer);
  }

  document.addEventListener("taskCompleted", () => {
    updateTasksContainer();
  });
});

export { updateTasksContainer };
