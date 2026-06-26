export function readTask() {
    return JSON.parse(localStorage.getItem("task")) || [];
}

export function saveTask(tasks) {
    return localStorage.setItem("task", JSON.stringify(tasks))
}