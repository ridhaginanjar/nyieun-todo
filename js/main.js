const form = document.querySelector(".task-form")
const taskName = document.querySelector("#task-name")
const deadline = document.querySelector("#form-deadline")

form.addEventListener("submit", function(event) {
    event.preventDefault()
    
    const selectedPriority = document.querySelector('input[name="task-priority"]:checked')
    const TaskPriority = selectedPriority ? selectedPriority.value : "sd    ";

    const currentTaskName = taskName.value.trim()
    const currentTaskDeadline = deadline.value
    if (currentTaskName === "") {
        console.log("Tidak ada task yang dikirim");
        return
    }

    console.log("Task baru berhasil dibuat!")
    console.log(currentTaskName)
    console.log(currentTaskDeadline)
    console.log(TaskPriority)
})