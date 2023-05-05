
/* 
    What should we do:
    1. Sweet alert
    2. 
*/


const list = document.querySelector(".todosList");
const inputAdd = document.querySelector(".input");
const filterTodos = document.querySelector(".filterTodos");
const block = document.querySelector(".block");

// states
let todos = JSON.parse(localStorage.getItem("todos")) || [
    { value: "Malumotlar LOCAL STORAGE da saqlanadi", id: "a1", isDone: false },
    { value: "DRAG qilib vaziyfalarning tartiblang", id: "a2", isDone: false },
    { value: "Ozgartirib bolgach ENTER bosing", id: "a3", isDone: false },
    { value: "CRUD", id: "a4", isDone: false },
    { value: "BAJARILGAN vaziyfani belgilasa boladi", id: "a5", isDone: false },
    { value: "barajilgan/bajarilmaganlarni FILTRLANG", id: "a6", isDone: false },
];
let selectedFilter = "all";
let selectedTask = "";



const filterByStatus = (todos, selectedFilter) => {
    switch (selectedFilter) {
        case "completed":
            return todos.filter((item) => item.isDone);
        case "inProgress":
            return todos.filter((item) => !item.isDone);
        default:
            return todos;
    }
}

const dragReplaceTodo = () => {
    const start = document.querySelector(".dragStarted");
    const end = document.querySelector(".dragDropped");
    const startId = start.id;
    const endId = end.id;
    if (startId != endId) {
        let startObject;
        for (let index = 0; index < todos.length; index++) {
            if (todos[index].id == startId) {
                startObject = {...todos[index]};
                todos.splice(index, 1);
                break;
            }
        }
        for (let index = 0; index < todos.length; index++) {
            if (todos[index].id == endId) {
                endObject = {...todos[index]};
                todos.splice(index, 0, startObject);
                index += 1;
                break;
            }
        }
    }
    
    render(123);
}

const dragAndDrop = () => {
    const tasks = document.querySelectorAll(".todo");
    
    const dragStart = function () {
        this.classList.add("dragStarted");
    }
    const dragEnd = function () {
        this.classList.remove("dragHovered");
        this.classList.remove("dragStarted");
    }
    const dragOver = function (event) {
        this.classList.add("dragHovered");
        event.preventDefault();
    }
    const dragEnter = function (event) {
        event.preventDefault();
    }
    const dragLeave = function () {
        this.classList.remove("dragHovered");
    }
    const dragDrop = function () {
        this.classList.add("dragDropped");
        this.classList.remove("dragHovered");
        dragReplaceTodo();
    }

    tasks.forEach((elem) => {
        elem.addEventListener("dragstart", dragStart);
        elem.addEventListener("dragend", dragEnd);
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("dragenter", dragEnter);
        elem.addEventListener("dragleave", dragLeave);
        elem.addEventListener("drop", dragDrop);
    });
}

const render = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    list.innerHTML = "";
    filterByStatus(todos, selectedFilter).forEach(element => {
        list.innerHTML += `
        <li draggable="true" id="${element.id}" class="todo ${element.isDone ? "completedTask" : ""}">
            <input type="checkbox" ${element.isDone ? "checked" : ""} />
            <input value="${element.value}" class="todo_input ${selectedTask != element.id ? 'notEditable' : ''} ${element.isDone ? 'completedTask' : ''}" type="text" />
            <div class="save ${selectedTask != element.id ? 'none' : ''}">
                <i class='bx bx-sm bxs-save'></i>
            </div>
            <div class="cancel ${selectedTask != element.id ? 'none' : ''} ">
                <i class='bx bx-sm bx-x'></i>
            </div>
            <div class="edit ${selectedTask == element.id ? 'none' : ''}">
                <i class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete ${selectedTask == element.id ? 'none' : ''}">
                <i class="bx bx-sm bx-trash"></i>
            </div>
        </li>
        `
    });
    dragAndDrop();
}
render();

const markAsDone = (id) => {
    todos = todos.map((item) => (item.id == id ? {...item, isDone: !item.isDone} : item));
    render();
}

const addNewTask = () => {
    if (inputAdd.value == "") {
        alert("Input field should not be empty!");
    } else {
        const newTodo = { value: inputAdd.value, id: "a" + Date.now(), isDone: false, edit: false };
        todos.unshift(newTodo);
        inputAdd.value = "";
        render();
    }
}

const clearAllTasks = () => {
    todos = [];
    selectedTask = "";
    render();
}

const deleteTask = (id) => {
    todos = todos.filter((item) => item.id !== id);
    selectedTask = "";
    render();
}

const enableEditTask = (id) => {
    selectedTask = id;
    render();
    const todoInput = document.querySelector(`#${selectedTask} .todo_input`);
    todoInput.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            saveEditedTask();
        }
    });
    todoInput.setSelectionRange(todoInput.value.length, todoInput.value.length);
    todoInput.focus();
}

const cancelEdit = () => {
    selectedTask = "";
    render();
}

const saveEditedTask = () => {
    const editedTask = document.querySelector(`#${selectedTask} .todo_input`);
    if (editedTask.value == "") {
        alert("It shouldn't be empty");
    } else {
        todos = todos.map((item) => (item.id == selectedTask ? {...item, value: editedTask.value} : item))
    }
    selectedTask = "";
    render();
}

const changeFilter = (e) => {
    selectedFilter = e.target.value;
    render();
}

const handleClick = (e) => {
    e.preventDefault();
    const btn = e.target;
    const id = btn.closest(".todo")?.id;
    if (btn.closest(".add")) { addNewTask(); }
    else if (btn.closest(".clear")) { clearAllTasks(); }
    else if (btn.closest(".delete")) { deleteTask(id); }
    else if (btn.closest(".edit")) { enableEditTask(id); }
    else if (btn.closest(".cancel")) { cancelEdit(); }
    else if (btn.closest(".save")) { saveEditedTask(); }
    else if (btn.closest(".delete")) { deleteTask(); }
}

filterTodos.addEventListener("change", changeFilter)
block.addEventListener("click", handleClick)
