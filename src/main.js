import { supabase } from "./supabase";
import Toastify from "toastify-js";

function taskAddedAlert() {
  Toastify({
    text: "TASK ADDED",
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: {
      background: "#4CAF50",
      color: "#fff",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.2)",
      padding: "12px 24px",
      minWidth: "200px",
    },
  }).showToast();
}

const fetchAndDisplayTasks = async () => {
  try {
    const { data, error } = await supabase.from("tatpara_user_task").select(`
            id,
            task_done(id,task),
            to_do(id,task_todo)`);

    if (error) {
      console.error(error);
      return;
    }

    const todoListContainer = document.querySelector(".todo-list");
    todoListContainer.innerHTML = "";

    const doneListContainer = document.querySelector(".done-list");
    doneListContainer.innerHTML = "";

    data.forEach((task) => {
      if (task.to_do && task.to_do.id) {
        const taskDiv = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `task-todo-${task.id}`;

        checkbox.addEventListener("change", async () => {
          // Add logic to mark task as done when checkbox is clicked
          // This would involve updating the appropriate tables in Supabase
        });

        const label = document.createElement("label");
        label.htmlFor = `task-todo-${task.id}`;
        label.textContent = task.to_do.task_todo;
        label.className = "pl-4";

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        todoListContainer.appendChild(taskDiv);
      }
    });

    // Display done tasks
    data.forEach((task) => {
      if (task.task_done && task.task_done.id) {
        const taskDiv = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `task-done-${task.id}`;
        checkbox.checked = true;

        checkbox.addEventListener("change", async () => {
          // Add logic to mark task as undone when checkbox is unchecked
          // This would involve updating the appropriate tables in Supabase
        });

        const label = document.createElement("label");
        label.htmlFor = `task-done-${task.id}`;
        label.textContent = task.task_done.task;
        label.className = "pl-4 line-through";

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        doneListContainer.appendChild(taskDiv);
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const taskInput = document.getElementById("task-input-field");

const addButton = document.getElementById("task-input");
// addButton.addEventListener("click", addNewTask);


fetchAndDisplayTasks();
