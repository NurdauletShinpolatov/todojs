const list = document.querySelector(".tasks_list");
const inputAdd = document.querySelector(".new_task");
const filterTasks = document.querySelector(".filter_tasks_by_completion");
const block = document.querySelector(".block");
let toggleDateCheckbox = document.querySelector(".toggleDate");

let now = new Date();
now =
  now.getMonth() +
  "/" +
  now.getDay() +
  "/" +
  now.getFullYear() +
  " " +
  now.getHours() +
  ":" +
  now.getMinutes();

// states
// JSON.parse(localStorage.getItem("tasks"))
let tasks = false || [
  {
    value: "Malumotlar LOCAL STORAGE da saqlanadi",
    id: "a1",
    isDone: false,
    date: now,
  },
  {
    value: "DRAG qilib vaziyfalarning tartiblang",
    id: "a2",
    isDone: false,
    date: now,
  },
  {
    value: "Ozgartirib bolgach ENTER bosing",
    id: "a3",
    isDone: false,
    date: now,
  },
  { value: "CRUD", id: "a4", isDone: false, date: now },
  {
    value: "BAJARILGAN vaziyfani belgilasa boladi",
    id: "a5",
    isDone: false,
    date: now,
  },
  {
    value: "barajilgan/bajarilmaganlarni FILTRLANG",
    id: "a6",
    isDone: false,
    date: now,
  },
];
let selectedFilter = "all";
let selectedTask = "";
let showDate = false;

const filterByStatus = (tasks, selectedFilter) => {
  switch (selectedFilter) {
    case "completed":
      return tasks.filter((item) => item.isDone);
    case "inProgress":
      return tasks.filter((item) => !item.isDone);
    default:
      return tasks;
  }
};

const dragReplaceTodo = () => {
  const start = document.querySelector(".dragStarted");
  const end = document.querySelector(".dragDropped");
  const startId = start.id;
  const endId = end.id;
  if (startId != endId) {
    let startObject;
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].id == startId) {
        startObject = { ...tasks[index] };
        tasks.splice(index, 1);
        break;
      }
    }
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].id == endId) {
        endObject = { ...tasks[index] };
        tasks.splice(index, 0, startObject);
        index += 1;
        break;
      }
    }
  }

  render(123);
};

const dragAndDrop = () => {
  const tasks = document.querySelectorAll(".task");

  const dragStart = function () {
    this.classList.add("dragStarted");
  };
  const dragEnd = function () {
    this.classList.remove("dragHovered");
    this.classList.remove("dragStarted");
  };
  const dragOver = function (event) {
    this.classList.add("dragHovered");
    event.preventDefault();
  };
  const dragEnter = function (event) {
    event.preventDefault();
  };
  const dragLeave = function () {
    this.classList.remove("dragHovered");
  };
  const dragDrop = function () {
    this.classList.add("dragDropped");
    this.classList.remove("dragHovered");
    dragReplaceTodo();
  };

  tasks.forEach((elem) => {
    elem.addEventListener("dragstart", dragStart);
    elem.addEventListener("dragend", dragEnd);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", dragDrop);
  });
};

const render = () => {
  // localStorage.setItem('tasks', JSON.stringify(tasks));
  list.innerHTML = "";
  // console.log("render");
  filterByStatus(tasks, selectedFilter).forEach((task) => {
    list.innerHTML += `
        <li draggable="true" id="${task.id}" class="task ${
      task.isDone ? "completedTask" : ""
    }">
            <input type="checkbox" ${
              task.isDone ? "checked" : ""
            } class="toggleCheck" />
            <div class="task_value">
                <input value="${task.value}" class="task_input ${
      selectedTask != task.id ? "notEditable" : ""
    } ${task.isDone ? "completedTask" : ""}" type="text" />
                <p class="task_date ${showDate == true ? "" : "none"}">${
      task.date
    }</p>
            </div>
            <div class="save ${selectedTask != task.id ? "none" : ""}">
                <i class='bx bx-sm bxs-save'></i>
            </div>
            <div class="cancel ${selectedTask != task.id ? "none" : ""} ">
                <i class='bx bx-sm bx-x'></i>
            </div>
            <div class="edit ${selectedTask == task.id ? "none" : ""}">
                <i class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete ${selectedTask == task.id ? "none" : ""}">
                <i class="bx bx-sm bx-trash"></i>
            </div>
        </li>
        `;
  });
  dragAndDrop();
};
render();

const toggleCheck = (id) => {
  tasks = tasks.map((item) =>
    item.id == id ? { ...item, isDone: !item.isDone } : item
  );
  render();
};

const addNewTask = () => {
  if (inputAdd.value == "") {
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Task should not be empty",
      showConfirmButton: false,
      timer: 1000,
    });
  } else {
    let now = new Date();
    now =
      now.getMonth() +
      "/" +
      now.getDay() +
      "/" +
      now.getFullYear() +
      " " +
      now.getHours() +
      ":" +
      now.getMinutes();
    const newTodo = {
      value: inputAdd.value,
      id: "a" + Date.now(),
      date: now,
      isDone: false,
    };
    tasks.unshift(newTodo);
    inputAdd.value = "";
    render();
  }
};

const clearAllTasks = () => {
  tasks = [];
  selectedTask = "";
  render();
};

const deleteTask = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Task has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      console.log(id);
      tasks = tasks.filter((item) => item.id !== id);
      selectedTask = "";
      render();
    }
  });
};

const enableEditTask = (id) => {
  selectedTask = id;
  render();
  const todoInput = document.querySelector(`#${selectedTask} .task_input`);
  todoInput.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      saveEditedTask();
    }
  });
  todoInput.setSelectionRange(todoInput.value.length, todoInput.value.length);
  todoInput.focus();
};

const cancelEdit = () => {
  selectedTask = "";
  render();
};

const saveEditedTask = () => {
  const editedTask = document.querySelector(`#${selectedTask} .task_input`);
  if (editedTask.value == "") {
    alert("It shouldn't be empty");
  } else {
    tasks = tasks.map((item) =>
      item.id == selectedTask ? { ...item, value: editedTask.value } : item
    );
  }
  selectedTask = "";
  render();
};

const changeFilter = (e) => {
  selectedFilter = e.target.value;
  render();
};

const toggleDate = () => {
  if (showDate == true) {
    showDate = false;
    toggleDateCheckbox.outerHTML = `<input class="toggleDate" name="toggleDate" type="checkbox">`;
  } else {
    showDate = true;
    toggleDateCheckbox.outerHTML = `<input class="toggleDate" checked name="toggleDate" type="checkbox">`;
  }
  render();
  toggleDateCheckbox = document.querySelector(".toggleDate");
};

const handleClick = (e) => {
  e.preventDefault();
  const btn = e.target;
  const id = btn.closest(".task")?.id;
  if (btn.closest(".add_new_task")) addNewTask();
  else if (btn.closest(".clear")) clearAllTasks();
  else if (btn.closest(".cancel")) cancelEdit();
  else if (btn.closest(".save")) saveEditedTask();
  else if (btn.closest(".delete")) deleteTask(id);
  else if (btn.closest(".edit")) enableEditTask(id);
  else if (btn.closest(".toggleCheck")) toggleCheck(id);
  else if (btn.closest(".toggleDate")) toggleDate();
};

filterTasks.addEventListener("change", changeFilter);
block.addEventListener("click", handleClick);
