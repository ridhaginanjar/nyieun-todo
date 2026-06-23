# Learning Notes: Event Listener pada Todo Dinamis

## Challenge

Saat todo baru dibuat lalu langsung dicentang, todo tersebut tidak langsung berubah menjadi completed:

- teks tidak tercoret,
- class `is-completed` tidak terpasang,
- data `completed` di `localStorage` tidak ikut berubah.

Padahal todo yang sudah ada saat halaman pertama kali dibuka bisa bekerja.

## Penyebab

Masalah utamanya ada pada timing pemasangan event listener.

Kode seperti ini hanya mencari checkbox yang sudah ada saat kode dijalankan:

```js
const allTodoCheckbox = document.querySelectorAll(".todo-checkbox input[type='checkbox']");
```

Jika setelah itu `renderTask()` membuat todo baru, checkbox baru tersebut belum punya event listener.

Di project ini, `renderTask()` juga menghapus dan membuat ulang isi list:

```js
taskList.innerHTML = "";
```

Artinya elemen `<li>`, `<article>`, dan `<input>` lama bisa hilang dan diganti elemen baru. Jika listener dipasang langsung ke checkbox lama, listener tersebut ikut hilang bersama elemennya.

## Mental Model

Bedakan dua jenis elemen:

- Elemen stabil: sudah ada sejak awal di HTML dan tidak dibuat ulang, misalnya `.todo-ul`.
- Elemen dinamis: dibuat oleh JavaScript dan bisa berubah setiap `renderTask()`, misalnya `.todo-list`, `.todo-item`, dan checkbox task.

Untuk elemen dinamis, event listener langsung sering bermasalah jika tidak dipasang ulang setelah render.

## Solusi 1: Pasang Ulang Listener Setelah Render

Pendekatan ini memasang event listener langsung ke setiap checkbox setelah todo dirender.

```js
function attachCheckboxListeners() {
    const allTodoCheckbox = document.querySelectorAll(".todo-checkbox input[type='checkbox']");

    allTodoCheckbox.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const taskItem = checkbox.closest(".todo-item");
            const todoList = checkbox.closest(".todo-list");

            taskItem.classList.toggle("is-completed", checkbox.checked);

            const newTaskData = updateTask(
                todoList.dataset.id,
                new Date().toISOString(),
                checkbox.checked
            );

            saveTask(newTaskData);
        });
    });
}
```

Setelah memanggil `renderTask()`, panggil juga:

```js
attachCheckboxListeners();
```

Trade-off:

- Lebih mudah dipahami untuk latihan DOM dasar.
- Harus disiplin memanggil ulang setelah render.
- Bisa berisiko listener dobel jika dipasang ke elemen yang sama tanpa kontrol.

## Solusi 2: Event Delegation

Pendekatan ini memasang satu event listener ke parent yang stabil, yaitu `.todo-ul`.

```js
const taskList = document.querySelector(".todo-ul");

taskList.addEventListener("change", function (event) {
    if (!event.target.matches(".todo-checkbox input[type='checkbox']")) {
        return;
    }

    const checkbox = event.target;
    const taskItem = checkbox.closest(".todo-item");
    const todoList = checkbox.closest(".todo-list");

    taskItem.classList.toggle("is-completed", checkbox.checked);

    const newTaskData = updateTask(
        todoList.dataset.id,
        new Date().toISOString(),
        checkbox.checked
    );

    saveTask(newTaskData);
});
```

Kenapa bisa bekerja?

Saat checkbox berubah, browser membuat event `change`. Event itu berasal dari checkbox, lalu naik ke parent-parentnya sampai ke `.todo-ul`. Proses ini disebut event bubbling.

Di dalam listener `.todo-ul`:

- `event.target` adalah elemen asli yang memicu event, yaitu checkbox.
- `event.currentTarget` adalah elemen tempat listener dipasang, yaitu `.todo-ul`.

Karena `.todo-ul` tidak ikut dibuat ulang oleh `renderTask()`, listener tetap aktif walaupun isi todo berubah.

Trade-off:

- Lebih cocok untuk list yang item-nya dinamis.
- Listener cukup dipasang sekali.
- Perlu memahami `event.target`, event bubbling, dan filter dengan `matches()`.

## Catatan Bug Terkait `taskData`

Saat update satu task, `taskData` harus tetap berbentuk array.

Pola yang aman:

```js
function updateTask(id, updatedAt, isChecked) {
    const taskData = readTask();

    return taskData.map((task) => {
        if (id === task.id) {
            return {
                ...task,
                completed: isChecked,
                updatedAt: updatedAt
            };
        }

        return task;
    });
}
```

Jangan mengganti `taskData` menjadi satu object saja, karena `renderTask()` membutuhkan array agar bisa memakai `forEach()`.