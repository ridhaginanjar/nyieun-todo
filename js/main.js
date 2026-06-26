import { readTask, saveTask } from "./utils.js";

const form = document.querySelector(".task-form")
const taskName = document.querySelector("#task-name")
const deadline = document.querySelector("#form-deadline")
const todoUL = document.querySelector(".todo-ul")
const tabBar = document.querySelector(".tab-bar");

let taskData = readTask()
let unCompletedData = getUncompletedData(taskData)

function getUncompletedData(taskData) {
    let filteredData = taskData.filter(task => task.completed != true)

    return filteredData
}

function getCompletedData(taskData) {
    let filteredData = taskData.filter(task => task.completed == true)

    return filteredData
}

renderTask(unCompletedData)

const delay = (ms) => new Promise((resolver, reject) => {
    console.log("Delay berhasil dijalankan")
    setTimeout(() => {
        resolver("DONE BOSKUU~");
    }, ms)
}) 

function createTask(title, priority, deadline) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const newTaskData = {
        "id": id,
        "title": title,
        "deadline": deadline,
        "priority": priority,
        "completed": false,
        "createdAt": now,
        "updatedAt": now,
    }

    return newTaskData
}


function updateTask(id, updatedAt, isChecked) {
    let taskData = readTask();

    const newTaskData= taskData.map((val, idx) => {
        if (id == val.id) {
            taskData = {
                ...val,
                completed: isChecked,
                updatedAt: updatedAt
            }

            return taskData
        }

        return val
    })

    return newTaskData
}

function renderTask(taskData, activeTab) {
    const taskList = document.querySelector(".todo-ul")
    taskList.innerHTML = ""

    const colorHighPriority = "#d6453d"
    const colorMedPriority = "#F59E0B"
    const colorLowPriority = "#27A663"

    let noTaskHTML = ""

    if (taskData.length === 0) {
        let teksNothingTodoHTML = ""

        if (activeTab === 'completed') {
            teksNothingTodoHTML = `
                <h2>No Completed Tasks</h2>
                <p>Keep your hard work~</p>
            `
        } else {
            teksNothingTodoHTML = `
                <h2>Your todo list is empty</h2>
                <p>Let's get started! Add your first task and stay on track.</p>
            `
        }
        noTaskHTML = 
            `
                <div class="emptyTask">
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
                    <title id="title">Todo checklist empty state icon</title>
                    <desc id="desc">A coral checklist clipboard icon with a checkmark inside a soft pink circular background.</desc>

                    <circle cx="48" cy="48" r="42" fill="#FDECEA"/>

                    <rect x="31" y="26" width="28" height="42" rx="3.5" stroke="#EF4B36" stroke-width="2.4"/>

                    <path d="M39 28V23.8C39 22.8 39.8 22 40.8 22H49.2C50.2 22 51 22.8 51 23.8V28" stroke="#EF4B36" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M36 28H54" stroke="#EF4B36" stroke-width="2.4" stroke-linecap="round"/>

                    <path d="M38 39H51" stroke="#EF4B36" stroke-width="2.1" stroke-linecap="round"/>
                    <path d="M38 47H51" stroke="#EF4B36" stroke-width="2.1" stroke-linecap="round"/>
                    <path d="M38 55H48" stroke="#EF4B36" stroke-width="2.1" stroke-linecap="round"/>

                    <circle cx="35" cy="39" r="1.2" fill="#EF4B36"/>
                    <circle cx="35" cy="47" r="1.2" fill="#EF4B36"/>
                    <circle cx="35" cy="55" r="1.2" fill="#EF4B36"/>

                    <circle cx="62" cy="62" r="10" fill="#FDECEA" stroke="#EF4B36" stroke-width="2.4"/>
                    <path d="M57.8 62.2L61 65.4L67 58.8" stroke="#EF4B36" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="emptyTaskText">
                        ${teksNothingTodoHTML}
                    </div>
                </div>
            `
        taskList.insertAdjacentHTML('beforeend', noTaskHTML)
    } else  {    
        taskList.innerHTML = "";
        taskData.forEach(e => {
            const taskId = e.id
            const title = e.title
            const priority = e.priority
            const deadline = e.deadline
            const isCompleted = e.completed ? "is-completed" : [];
            const checked = e.completed ? "checked" : [];

            let currentColorPriority = ""

            if (priority === "High") {
                currentColorPriority = colorHighPriority;
            } else if (priority === "Medium") {
                currentColorPriority = colorMedPriority;
            } else {
                currentColorPriority = colorLowPriority;
            }

            let deadlineHTML = "";

            if (deadline) {
                deadlineHTML = 
                `

                                        <div class="task-deadline">
                                            <span class="label-span">Deadline todo</span>
                                            <div class="info-deadline">
                                                <h4>${deadline}</h4>
                                            </div>
                                        </div>
                `
            }

            let priorityHTML = '';

            if (priority) {
                priorityHTML = 
                `
                                        <div class="task-prior">
                                            <span class="label-span">Priority</span>
                                            <div class="info-priority">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                    <path fill="${currentColorPriority}" d="M12 7.5A4.5 4.5 0 0 1 7.5 12A4.5 4.5 0 0 1 3 7.5A4.5 4.5 0 0 1 7.5 3A4.5 4.5 0 0 1 12 7.5"/>
                                                </svg>
                                                <h4>${priority}</h4>
                                            </div>
                                        </div>
                `
            }

            const taskHTML = `
                    <li class="todo-list" data-id="${taskId}">
                        <article class="todo-item ${isCompleted}">
                            <label class="todo-checkbox">
                                <input type="checkbox" name="task-completed" ${checked}>
                                <span class="checkbox-ui"></span>
                            </label>
                            <div class="task-info">
                                <h3>${title}</h3>
                                <div class="task-meta">
                                    ${deadlineHTML}
                                    ${priorityHTML}
                                </div>
                            </div>
                            <div class="task-action">
                                <button type="button" class="btn-submit" aria-label="Delete Task">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="none" stroke="#111111" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v0M9 7h6M9 7H6m9 0h3m2 0h-2M4 7h2m0 0v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
                                    </svg>
                                </button>
                            </div>
                        </article>
                    </li>
                `

            taskList.insertAdjacentHTML('beforeend', taskHTML)
        })
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault()
    
    const selectedPriority = document.querySelector('input[name="task-priority"]:checked')
    const TaskPriority = selectedPriority ? selectedPriority.value : "";

    const currentTaskName = taskName.value.trim()
    const currentTaskDeadline = deadline.value

    if (currentTaskName === "") {
        console.log("Tidak ada task yang dikirim");
        return
    }

    console.log("Task baru berhasil dibuat!")
    const newTaskData = createTask(currentTaskName, TaskPriority, currentTaskDeadline)

    let taskList = readTask()

    taskList.push(newTaskData)
    saveTask(taskList)

    // Show Data berdasarkan Tab Active
    let activeTabs = tabBar.querySelectorAll(".tab-bar button[type='button']")
    
    let activeTab = ""

    activeTabs.forEach((val, idx) => {
        if (val.getAttribute("aria-selected") == "true") {
            activeTab = val.value
        }
    })

    if (activeTab === 'completed') {
        // Get completedData
        taskData = readTask();
        
        taskData = readTask();
        let completedData = taskData.filter(x => x.completed == true)
        renderTask(completedData, activeTab)
    }

    if (activeTab === 'pending') {
        //Get uncompletedData
        taskData = readTask();
        let unCompletedData = taskData.filter(x => x.completed != true)
        renderTask(unCompletedData, activeTab)
    }
    form.reset()
})

todoUL.addEventListener("change", async (event) => {
    if (!event.target.matches(".todo-checkbox input[type='checkbox']")) {
        return
    }

    let inputTask = event.target;
    let todoItem = inputTask.closest(".todo-item");
    let isChecked = event.target.checked

    // Tahap 1: Menambahkan is-completed agar animasi dicoret.
    todoItem.classList.toggle("is-completed", isChecked);

    const currentTaskID = todoItem.closest(".todo-list").dataset.id;
    const updatedAt = new Date().toISOString();

    // Tahap 2: Update Task Data
    let newTaskData = updateTask(currentTaskID, updatedAt, isChecked);
    saveTask(newTaskData)

    // Tahap 2.5: Delay
    await delay(500);

    // Tahap 3: Update Render Data based on situation
    let activeTabs = tabBar.querySelectorAll(".tab-bar button[type='button']")
    
    let activeTab = ""

    activeTabs.forEach((val, idx) => {
        if (val.getAttribute("aria-selected") == "true") {
            activeTab = val.value
        }
    })

    if (activeTab === 'completed') {
        // Get completedData
        taskData = readTask();
        
        taskData = readTask();
        let completedData = taskData.filter(x => x.completed == true)
        renderTask(completedData, activeTab)
    }

    if (activeTab === 'pending') {
        //Get uncompletedData
        taskData = readTask();
        let unCompletedData = taskData.filter(x => x.completed != true)
        renderTask(unCompletedData, activeTab)
    }
})

todoUL.addEventListener("click", (event) => {
    const buttonDelete = event.target.closest(".task-action button[aria-label='Delete Task']")

    if (!buttonDelete) {
        return
    }

    const isDelete = buttonDelete.matches(".task-action button[aria-label='Delete Task']")

    const currentTaskId = event.target.closest(".todo-list").dataset.id;

    if (isDelete) {
        let data = readTask();

        let taskData = data.filter(x => x.id != currentTaskId)
        saveTask(taskData)

        // Tahap 3: Update Render Data based on situation
        let activeTabs = tabBar.querySelectorAll(".tab-bar button[type='button']")
        
        let activeTab = ""

        activeTabs.forEach((val, idx) => {
            if (val.getAttribute("aria-selected") == "true") {
                activeTab = val.value
            }
        })

        if (activeTab === 'completed') {
            // Get completedData
            let completedData = taskData.filter(x => x.completed == true)
            renderTask(completedData, activeTab)
        }

        if (activeTab === 'pending') {
            //Get uncompletedData
            taskData = readTask();
            let unCompletedData = taskData.filter(x => x.completed != true)
            renderTask(unCompletedData, activeTab)
        }
    }
})

tabBar.addEventListener("click", (e) => {
    if (!e.target.matches("span")) {
        return
    }

    let allButton = tabBar.querySelectorAll(".tab-bar button[type='button']")
    
    allButton.forEach((val,idx) => {
        val.setAttribute("aria-selected", false)
    })

    let tabButton = e.target.closest(".tab-bar button[type='button']")
    let selectedButton = tabButton.getAttribute("aria-selected")
    let buttonValue = tabButton.value
    
    if (buttonValue == 'completed') {
        tabButton.setAttribute("aria-selected", "true")

        taskData = readTask();
        let completedData = taskData.filter(x => x.completed == true)

        let activeTab = buttonValue
        renderTask(completedData, activeTab)
    }

    if (buttonValue == 'pending') {
        tabButton.setAttribute("aria-selected", "true")
        
        let activeTab = buttonValue

        taskData = readTask();
        let unCompletedData = taskData.filter(x => x.completed != true)
        renderTask(unCompletedData, activeTab)
    }
})