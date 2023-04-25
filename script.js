const form = document.querySelector(".form");
const list = document.querySelector(".todosList");
const clear = document.querySelector(".clear");
const inputAdd = document.querySelector(".input");
const filterTodos = document.querySelector(".filterTodos");



let todos = JSON.parse(localStorage.getItem("todos")) || [
    { value: "Welcome to Taks management app", id: "a213423334", isDone: false },
    { value: "Your data is stored on local storage", id: "a234234", isDone: false },
    { value: "You can add tasks", id: "a2342d34", isDone: false },
    { value: "You can delete them", id: "a2342234", isDone: false },
    { value: "You can edit any of them", id: "a2g34234", isDone: false },
    { value: "You can mark task as done", id: "a23h4234", isDone: false },
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

const render = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    list.innerHTML = "";
    filterByStatus(todos, selectedFilter).forEach(element => {
        list.innerHTML += `
        <li class="todo ${element.isDone ? "completedTask" : ""}">
            <input type="checkbox" ${element.isDone ? "checked" : ""} onclick="markAsDone('${element.id}')" />
            <input id="${element.id}" value="${element.value}" class="todo_input ${selectedTask != element.id ? "notEditable" : ""} ${element.isDone ? "completedTask" : ""}" type="text" />
            <div class="save ${selectedTask != element.id ? 'none' : ''}">
                <i onclick="saveEdit()" class='bx bx-sm bxs-save'></i>
            </div>
            <div class="cansel ${selectedTask != element.id ? 'none' : ''} ">
                <i onclick="cancelEdit()" class='bx bx-sm bx-x'></i>
            </div>
            <div class="edit ${selectedTask == element.id ? 'none' : ''}">
                <i onclick="enableEdit('${element.id}')" class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete">
                <i onclick="deleteTodo('${element.id}')" class="bx bx-sm bx-trash"></i>
            </div>
        </li>
        `
    });
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
    todos = todos.map((item) => {
        if (item.id == selectedTask) {
            const editedValue = document.getElementById(`${selectedTask}`);
            item.value = editedValue.value;
        }
        return item;
    })
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
    render()
})

