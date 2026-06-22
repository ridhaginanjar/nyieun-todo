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
    console.log(taskList)

    const data = JSON.parse(localStorage.getItem("task")) || [];
    data.push(taskList)

    localStorage.setItem("task", JSON.stringify(data))

    readTask()
})

function readTask() {
    const taskList = document.querySelector(".todo-ul")
    taskList.innerHTML = ""

    const taskStorage = JSON.parse(localStorage.getItem("task")) || [];

    const colorLowPriority = "#d6453d"
    const colorMedPriority = "#F59E0B"
    const colorHighPriority = "#27A663"

    taskStorage.forEach(e => {
        const title = e.title
        const priority = e.priority
        const deadline = e.deadline
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

        const taskHTML = `
                                <li class="todo-list">
                                <article class="todo-item">
                                    <label class="todo-checkbox">
                                        <input type="checkbox" name="task-completed">
                                        <span class="checkbox-ui"></span>
                                    </label>
                                    <div class="task-info">
                                        <h3>${title}</h3>
                                    </div>
                                    ${deadlineHTML}
                                    <div class="task-prior">
                                        <span class="label-span">Priority</span>
                                        <div class="info-priority">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                <path fill="${currentColorPriority}" d="M12 7.5A4.5 4.5 0 0 1 7.5 12A4.5 4.5 0 0 1 3 7.5A4.5 4.5 0 0 1 7.5 3A4.5 4.5 0 0 1 12 7.5"/>
                                            </svg>
                                            <h4>${priority}</h4>
                                        </div>
                                    </div>
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

// function to show data, this one is temporary
readTask()