allData = readTask();
renderTask(allData)

const form = document.querySelector(".task-form")
const taskName = document.querySelector("#task-name")
const deadline = document.querySelector("#form-deadline")

function createTask(title, priority, deadline) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const taskList = {
        "id": id,
        "title": title,
        "deadline": deadline,
        "priority": priority,
        "completed": false,
        "createdAt": now,
        "updatedAt": now,
    }

    return taskList
}

function readTask() {
    return JSON.parse(localStorage.getItem("task")) || [];
}

function saveTask(tasks) {
    return localStorage.setItem("task", JSON.stringify(tasks))
}

function renderTask(taskData) {
    const taskList = document.querySelector(".todo-ul")
    taskList.innerHTML = ""

    const colorHighPriority = "#d6453d"
    const colorMedPriority = "#F59E0B"
    const colorLowPriority = "#27A663"

    let noTaskHTML = ""

    if (taskData.length === 0) {
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
                        <h2>Your todo list is empty</h2>
                        <p>Let's get started! Add your first task and stay on track.</p>
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
            console.log(checked)

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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="#6B6B6B" d="M9 11H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14z"/>
                                                </svg>
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
                                        </div>
                                        ${deadlineHTML}
                                        ${priorityHTML}
                                        <div class="task-action">
                                            <button type="button" class="btn-submit" aria-label="Edit Task">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                    <path fill="none" stroke="#111111" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 6l2.293-2.293a1 1 0 0 1 1.414 0l2.586 2.586a1 1 0 0 1 0 1.414L18 10m-4-4l-9.707 9.707a1 1 0 0 0-.293.707V19a1 1 0 0 0 1 1h2.586a1 1 0 0 0 .707-.293L18 10m-4-4l4 4" />
                                                </svg>
                                            </button>
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
    const taskList = createTask(currentTaskName, TaskPriority, currentTaskDeadline)

    const taskData = readTask();
    taskData.push(taskList)

    saveTask(taskData)
    renderTask(taskData)
    form.reset()
})

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

const todoUL = document.querySelector(".todo-ul")

todoUL.addEventListener("change", (event) => {
    if (!event.target.matches(".todo-checkbox input[type='checkbox']")) {
        return
    }

    let inputTask = event.target;
    let todoItem = inputTask.closest(".todo-item");
    let isChecked = event.target.checked

    todoItem.classList.toggle("is-completed", isChecked);

    // Update Data
    const currentTaskID = todoItem.closest(".todo-list").dataset.id;
    const updatedAt = new Date().toISOString();

    let newTaskData = updateTask(currentTaskID, updatedAt, isChecked);
    saveTask(newTaskData)
})

todoUL.addEventListener("click", (event) => {
    const buttonDelete = event.target.closest(".task-action button[aria-label='Delete Task']")

    if (!buttonDelete) {
        return
    }

    const isDelete = buttonDelete.matches(".task-action button[aria-label='Delete Task']")

    const currentTaskId = event.target.closest(".todo-list").dataset.id

    let data = readTask();

    if (isDelete) {
        const newData = data.filter(x => x.id != currentTaskId)
        saveTask(newData)
        renderTask(newDataData)
    }
})

// Ganti aria-selected darit true false (sebaliknya)
function changeSelectedTab(currentTab, newTab) {
    return
}
// show kalau all semuanya, pending cuman completed false, completed yang true.

const tabBar = document.querySelector(".tab-bar");

tabBar.addEventListener("click", (e) => {
    if (!e.target.matches("span")) {
        return
    }
    // Set all aria-selected = false
    let allButton = tabBar.querySelectorAll(".tab-bar button[type='button']")
    
    allButton.forEach((val,idx) => {
        val.setAttribute("aria-selected", false)
    })

    // Update aria-selected = true 
    // CTA show relevance todo
    let tabButton = e.target.closest(".tab-bar button[type='button']")
    let selectedButton = tabButton.getAttribute("aria-selected")
    let buttonValue = tabButton.value

    let taskData = readTask();
    
    if (buttonValue == 'pending') {
        tabButton.setAttribute("aria-selected", "true")
        pendingData = taskData.filter(x => x.completed == false)
        renderTask(pendingData)
    }

    if (buttonValue == 'completed') {
        tabButton.setAttribute("aria-selected", "true")
        //renderCompleted
        completedData = taskData.filter(x => x.completed == true)
        renderTask(completedData)
    }

    if (buttonValue == 'all') {
        tabButton.setAttribute("aria-selected", "true")
        
        allData = readTask();
        renderTask(allData)
    }
})