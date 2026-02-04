// elements
const form = document.querySelector("#todoForm");
const unorderedList = document.querySelector(".task-container");
const buttons = document.querySelectorAll(".categories-container button");
const allBtn = document.querySelector("#allBtn");
let currentCategory = "all";

// load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// event listeners and actions
// form submit event
form.addEventListener("submit", handleFormSubmission);
// setting all category button as default active
allBtn.classList.add("active");
// category buttons click event
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    if (btn.id == "allBtn") {
      currentCategory = "all";
      renderTasks(tasks);
    } else if (btn.id == "activeBtn") {
      currentCategory = "active";
      renderTasks(getActive());
    } else {
      currentCategory = "completed";
      renderTasks(getCompleted());
    }
  });
});

// render on page load
renderCurrentCategory();

// functions
// handle form submission
function handleFormSubmission(e) {
  e.preventDefault();

  const data = form.taskInput.value;

  if (!data.trim()) return;

  addTask(data);
  form.reset();
}

// adding new task to array
function addTask(text) {
  const task = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.unshift(task); // latest on top
  saveTasks();
  renderTasks();
}

// save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// render all tasks

function renderTasks(taskList = tasks) {
  unorderedList.innerHTML = "";
  unorderedList.classList.remove("empty");

  if (taskList.length === 0) {
    unorderedList.innerHTML = `
  <p>Small steps start here.</p>
  <p>Add your first task and stay on track.</p>
  <p>No pressure. Just progress.</p>
`;
    unorderedList.classList.add("empty");
    return;
  }

  taskList.forEach((task) => {
    createTaskElement(task);
  });
}

function renderCurrentCategory() {
  if (currentCategory === "active") {
    renderTasks(getActive());
  } else if (currentCategory === "completed") {
    renderTasks(getCompleted());
  } else {
    renderTasks(tasks);
  }
}

// create a task
function createTaskElement(task) {
  // container
  const listContainer = document.createElement("div");
  listContainer.className = "list-container";
  listContainer.style.opacity = task.completed ? "0.5" : "1";

  // checkbox
  const checkbox = document.createElement("div");
  checkbox.className = "check-box";

  const tickImage = document.createElement("img");
  tickImage.className = "tick-image";
  tickImage.src = "https://cdn-icons-png.flaticon.com/512/716/716225.png";
  tickImage.style.display = task.completed ? "block" : "none";

  checkbox.appendChild(tickImage);

  checkbox.addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderCurrentCategory();
  });

  // task text
  const li = document.createElement("li");
  li.className = "list";
  li.textContent = task.text;
  li.addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderCurrentCategory();
  });

  if (task.completed) {
    li.classList.add("completed");
    li.style.textDecoration = "line-through";
  }

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";

  const deleteImg = document.createElement("img");
  deleteImg.src =
    "https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/delete-cross-round-white-icon.png";
  deleteImg.className = "delete-img";

  deleteBtn.appendChild(deleteImg);

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderCurrentCategory();
  });

  listContainer.appendChild(checkbox);
  listContainer.appendChild(li);
  listContainer.appendChild(deleteBtn);

  unorderedList.appendChild(listContainer);
}

// function to get completed tasks from the tasks array
function getCompleted() {
  return tasks.filter((task) => task.completed);
}

// function to get non completed tasks from the tasks array
function getActive() {
  return tasks.filter((task) => !task.completed);
}
