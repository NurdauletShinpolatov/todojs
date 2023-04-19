const form = document.querySelector(".form");
const list = document.querySelector(".todosList");
const clear = document.querySelector(".clear");
const input = document.querySelector(".input");

const todos = [{ value: "Reading a book" }, { value: "Playing football" }];

const render = () => {
    list.innerHTML = "";
    for (const element of todos) {
        list.innerHTML += `
        <li class="todo">
            <input value="${element.value}" class="todo_input" type="text" />
            <div class="edit">
                <i class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete">
                <i class="bx bx-sm bx-trash"></i>
            </div>
        </li>
        `
    }
}
render();

const clearTodos = () => {
    while (todos.length != 0) {
        todos.pop();
    }
    list.innerHTML = "";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(event);
    let inputValue = event.target["todo"].value;
    const newTodo = { value: inputValue, id: Date.now() + "#" };
    todos.unshift(newTodo);
    render();
    input.value = "";
});

clear.addEventListener("click", (event) => {
    clearTodos();
})