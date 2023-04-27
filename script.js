const form = document.querySelector(".form");
const list = document.querySelector(".todosList");
const clear = document.querySelector(".clear");
const inputAdd = document.querySelector(".input");
const filterTodos = document.querySelector(".filterTodos");


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
    const startId = start.querySelector(".todo_input").id;
    const endId = end.querySelector(".todo_input").id;
    if (startId != endId) {        
        console.log(startId, "\n", endId);
        let startObject;
        let startObjIndex;
        let endObject;
        for (let index = 0; index < todos.length; index++) {
            console.log("loop 1");
            if (todos[index].id == startId) {
                startObject = {...todos[index]};
                startObjIndex = index;
                todos.splice(index, 1);
                break;
            }
        }
        for (let index = 0; index < todos.length; index++) {
            console.log("loop 2");
            if (todos[index].id == endId) {
                endObject = {...todos[index]};
                todos.splice(index, 0, startObject);
                index += 1;
                break;
            }
        }
        // if (startObjIndex < todos.length) {
        //     todos.splice(startObjIndex, 0, endObject);
        // } else if (startObjIndex == todos.length) {
        //     todos.push(endObject);
        // }
    }
    
    render();
}

const dragAndDrop = () => {
    const tasks = document.querySelectorAll(".todo");
    
    const dragStart = function () {
        this.classList.add("dragStarted");
    }
    const dragEnd = function () {
        this.classList.remove("dragHovered");
    }
    const dragOver = function (event) {
        event.preventDefault();
    }
    const dragEnter = function (event) {
        event.preventDefault();
        this.classList.add("dragHovered");
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
    console.log("render");
    localStorage.setItem('todos', JSON.stringify(todos));
    list.innerHTML = "";
    filterByStatus(todos, selectedFilter).forEach(element => {
        list.innerHTML += `
        <li draggable="true" class="todo ${element.isDone ? "completedTask" : ""}">
            <input type="checkbox" ${element.isDone ? "checked" : ""} onclick="markAsDone('${element.id}')" />
            <input id="${element.id}" value="${element.value}" class="todo_input ${selectedTask != element.id ? 'notEditable' : ''} ${element.isDone ? 'completedTask' : ''}" type="text" />
            <div class="save ${selectedTask != element.id ? 'none' : ''}">
                <i onclick="saveEdit()" class='bx bx-sm bxs-save'></i>
            </div>
            <div class="cansel ${selectedTask != element.id ? 'none' : ''} ">
                <i onclick="cancelEdit()" class='bx bx-sm bx-x'></i>
            </div>
            <div class="edit ${selectedTask == element.id ? 'none' : ''}">
                <i onclick="enableEdit('${element.id}')" class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete ${selectedTask == element.id ? 'none' : ''}">
                <i onclick="deleteTodo('${element.id}')" class="bx bx-sm bx-trash"></i>
            </div>
        </li>
        `
    });
    dragAndDrop();
}
render();

const deleteTodo = (id) => {
    todos = todos.filter((item) => item.id !== id);
    selectedTask = "";
    render();
}

const clearTodos = () => {
    todos = [];
    selectedTask = "";
    render();
}

const enableEdit = (id) => {
    selectedTask = id;
    render();
    const elem = document.querySelector(`${"#"+id}`);
    elem.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            saveEdit();
        }
    });
    elem.setSelectionRange(elem.value.length, elem.value.length);
    elem.focus();
}

const cancelEdit = () => {
    selectedTask = "";
    render();
}

const saveEdit = () => {
    const editedValue = document.getElementById(`${selectedTask}`);
    if (editedValue.value == "") {
        alert("It shouldn't be empty");
    } else {
        todos = todos.map((item) => {
            if (item.id == selectedTask) {
                item.value = editedValue.value;
            }
            return item;
        })
    }
    selectedTask = "";
    render();
}

const markAsDone = (id) => {
    todos = todos.map((item) => (item.id == id ? {...item, isDone: !item.isDone} : item));
    render();
}

const inputHasNull = () => {
    alert("Input field should not be empty!")
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.target["todo"].value == "") {
        inputHasNull();
    } else {
        const inputValue = event.target["todo"].value;
        const newTodo = { value: inputValue, id: "a" + Date.now(), isDone: false, edit: false };
        todos.unshift(newTodo);
        inputAdd.value = "";
        render();
    }
});

clear.addEventListener("click", () => {
    clearTodos();
})


filterTodos.addEventListener("change", (event) => {
    selectedFilter = event.target.value;
    render();
})
