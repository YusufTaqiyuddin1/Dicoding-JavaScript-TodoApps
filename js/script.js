const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

document.addEventListener(RENDER_EVENT, listTodo);
document.addEventListener("DOMContentLoaded", kirim);
document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function listTodo(){
    const uncompletedTodoList = document.getElementById("todos");
    uncompletedTodoList.innerHTML = "";

    const completedTodoList = document.getElementById("completed-todos");
    completedTodoList.innerHTML = "";

    for(const todoItem of todos){
        const todoElement = makeTodo(todoItem);
        if(!todoItem.isCompleted) uncompletedTodoList.append(todoElement);
        else completedTodoList.append(todoElement);
    }
}

function makeTodo(todoObject){
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    if (todoObject.isCompleted){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function(){
            undoTaskFromComplete(todoObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function(){
            removeTaskFromComplate(todoObject.id);
        });

        container.append(undoButton, trashButton);

    } else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function(){
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }
    return container;
}

function undoTaskFromComplete(todoId){
    const todoTarget = findTodo(todoId);
    if(todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromComplate(todoId){
    const todoTarget = findTodoIndex(todoId);
    if(todoTarget == -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(todoId){
    const todoTarget = findTodo(todoId);
    if(todoTarget == null) return;
    
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodo(todoId){
    for(const todoItem of todos){
        if(todoItem.id === todoId){
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId){
    for(const index in todos){
        if(todos[index].id === todoId){
            return index;
        }
    }
    return -1;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist(){
    if(typeof Storage === undefined){
        alert("Browser Kamu tidak support local storage");
        return false;
    }
    return true;
}

function kirim(){
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addTodo();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
}

function addTodo(){
    const textTodo = document.getElementById("title").value;
    const timestamp = document.getElementById("date").value;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
    
    todos.push(todoObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for(const todo of data){
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId(){
    return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted){
    return {id, task, timestamp, isCompleted};
}