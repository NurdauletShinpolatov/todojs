const form = document.querySelector(".form");
const list = document.querySelector(".todosList");
const clear = document.querySelector(".clear");
const inputAdd = document.querySelector(".input");
const filterTodos = document.querySelector(".filterTodos");


let todos = [
    { value: "Reading a book", id: "a213423334", isDone: false },
    { value: "Playing football", id: "a234234", isDone: false }
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
    list.innerHTML = "";
    filterByStatus(todos, selectedFilter).forEach(element => {
        list.innerHTML += `
        <li class="todo">
            <input type="checkbox" ${element.isDone ? "checked" : ""} onclick="markAsDone('${element.id}')" />
            <input id="${element.id}" value="${element.value}" class="todo_input ${selectedTask != element.id ? "notEditable" : ""}" type="text" />
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
    render();
}

const clearTodos = () => {
    todos = [];
    render();
}

const enableEdit = (id) => {
    selectedTask = id;
    render();
    const elem = document.querySelector(`${"#"+id}`);
    // elem.setSelectionRange(elem.value.length, elem.value.length);
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

clear.addEventListener("click", (event) => {
    clearTodos();
})


filterTodos.addEventListener("change", (event) => {
    selectedFilter = event.target.value;
    render()
})

