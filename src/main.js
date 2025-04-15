const todoList = document.querySelector(".todo-list");
const doneList = document.querySelector(".done-list");

function handleCheckboxChange(e) {
  const checkbox = e.target;
  const taskDiv = checkbox.parentElement;

  if (checkbox.checked) {
    doneList.appendChild(taskDiv);
  } else {
    todoList.appendChild(taskDiv);
  }
}

function setupCheckboxListeners() {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach((cb) => {
    cb.addEventListener("change", handleCheckboxChange);
  });
}

setupCheckboxListeners();