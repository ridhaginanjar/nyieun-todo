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
const allTodoCheckbox = document.querySelectorAll(
  ".todo-checkbox input[type='checkbox']"
);
```

Jika setelah itu `renderTask()` membuat todo baru, checkbox baru tersebut belum punya event listener.

Di project ini, `renderTask()` juga menghapus dan membuat ulang isi list:

```js
taskList.innerHTML = '';
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
  const allTodoCheckbox = document.querySelectorAll(
    ".todo-checkbox input[type='checkbox']"
  );

  allTodoCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const taskItem = checkbox.closest('.todo-item');
      const todoList = checkbox.closest('.todo-list');

      taskItem.classList.toggle('is-completed', checkbox.checked);

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
const taskList = document.querySelector('.todo-ul');

taskList.addEventListener('change', function (event) {
  if (!event.target.matches(".todo-checkbox input[type='checkbox']")) {
    return;
  }

  const checkbox = event.target;
  const taskItem = checkbox.closest('.todo-item');
  const todoList = checkbox.closest('.todo-list');

  taskItem.classList.toggle('is-completed', checkbox.checked);

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
        updatedAt: updatedAt,
      };
    }

    return task;
  });
}
```

Jangan mengganti `taskData` menjadi satu object saja, karena `renderTask()` membutuhkan array agar bisa memakai `forEach()`.

# Learning Notes: Rapihin main.js

### Cara berpikir

Kode di js/main.js:1 sebenarnya sudah punya fondasi yang bagus untuk proyek todo sederhana: ada fungsi createTask, readTask, saveTask, updateTask, dan event delegation di .todo-ul. Itu
tanda Anda sudah mulai memisahkan “data task” dari “interaksi DOM”.

Masalah utamanya bukan karena kodenya “jelek”, tapi karena beberapa tanggung jawab masih bercampur:

- fungsi render juga menentukan HTML, warna priority, empty state, checkbox state, dan class completed
- event handler tab langsung membaca data, filter data, update aria, dan render
- event submit/delete/update belum punya satu pintu render yang konsisten
- nama fungsi belum konsisten antara renderAllTask() dan renderTask()

### Kelebihan kode saat ini

1. Data model cukup jelas
   Di createTask(), task punya id, title, deadline, priority, completed, createdAt, dan updatedAt. Ini sudah bagus untuk fitur lanjutan.

2. Pakai crypto.randomUUID()
   Ini lebih aman daripada id manual berbasis angka sederhana.

3. Sudah ada fungsi storage
   readTask() dan saveTask() membuat akses localStorage tidak tersebar terlalu jauh.

4. Event delegation sudah benar arahnya
   Handler checkbox dan delete dipasang ke .todo-ul, bukan ke setiap item. Ini cocok karena item dirender ulang secara dinamis.

5. Rencana tab sudah mengarah ke konsep filter
   all, pending, dan completed secara mental memang sebaiknya dianggap sebagai “filter view”, bukan sebagai tiga data berbeda.

### Kekurangan utama

1. Ada bug nama fungsi render
   Di beberapa tempat Anda memanggil renderTask(...), misalnya js/main.js:185, js/main.js:250, js/main.js:284. Tapi fungsi yang ada adalah renderAllTask(...) di js/main.js:33.

   Ini membuat alur render tidak konsisten. Kalau kode masih “works”, kemungkinan ada kondisi tertentu yang belum kena, atau browser sudah berhenti di error saat action tertentu.

2. Variabel global tidak sengaja
   allData = readTask() di js/main.js:1, juga pendingData, completedData, dan allData di bagian tab tidak pakai const/let.

   Ini membuat variabel jadi global implisit. Untuk belajar JavaScript, ini penting dibiasakan: selalu pakai const atau let.

3. Render belum mencerminkan completed state dengan rapi
   Di js/main.js:133, class menjadi ${isCompleted}, hasilnya bisa true atau false, bukan class yang bermakna.

   Lebih baik nanti:

   const completedClass = task.completed ? "is-completed" : "";

   Checkbox juga belum diberi atribut checked saat task sudah completed.

4. Delete task salah konsep
   Fungsi deleteTask(id) di js/main.js:230 melakukan localStorage.removeItem(id), padahal semua task disimpan dalam satu key: "task".

   Yang benar secara konsep: baca array task, filter id yang ingin dihapus, simpan ulang array.

5. Ada typo fatal
   Di js/main.js:250:

   renderTask(newDataData)

   newDataData tidak ada. Harusnya newData.

6. Logic tab terlalu banyak di event handler
   Bagian js/main.js:262 melakukan banyak hal sekaligus:
   - validasi target click
   - reset semua tab
   - set tab aktif
   - baca localStorage
   - filter data
   - render data

   Ini yang membuat terasa spageti. Bukan karena panjangnya saja, tapi karena satu handler punya terlalu banyak alasan untuk berubah.

7. Render HTML rentan XSS
   Karena title, deadline, dan priority langsung dimasukkan ke template string dengan innerHTML / insertAdjacentHTML, input user seperti <img onerror=alert(1)> bisa ikut menjadi HTML.

   Untuk learning project, ini belum harus langsung dibuat sempurna, tapi penting Anda tahu: kalau memakai HTML string dari input user, perlu escaping atau pakai textContent.

### Fokus kecil sekarang

Saran saya jangan langsung bikin tiga fungsi besar renderAll, renderPending, renderCompleted.

Lebih bersih kalau Anda punya satu fungsi render, lalu data yang masuk sudah difilter:

function getFilteredTasks(tasks, filter) {
if (filter === "pending") {
return tasks.filter(task => !task.completed)
}

      if (filter === "completed") {
          return tasks.filter(task => task.completed)
      }

      return tasks

}

Dengan mental model ini:

- readTask() mengambil semua data
- getFilteredTasks() memilih data yang mau ditampilkan
- renderTask() hanya menggambar data yang diberikan
- tab hanya mengubah currentFilter

Jadi nanti flow-nya kira-kira:

let currentFilter = "all"

function renderCurrentView() {
const tasks = readTask()
const filteredTasks = getFilteredTasks(tasks, currentFilter)

      renderTask(filteredTasks)

}

Ini kecil, tapi dampaknya besar karena form submit, delete, checkbox, dan tab semua bisa panggil fungsi yang sama: renderCurrentView().

### Contoh kecil

Langkah refactor pertama yang paling aman:

1. Rename renderAllTask menjadi renderTask.
2. Ganti semua pemanggilan renderTask(...) supaya benar-benar mengarah ke fungsi itu.
3. Tambahkan let currentFilter = "all".
4. Buat fungsi kecil getFilteredTasks(tasks, filter).

Jangan dulu pecah semua HTML menjadi banyak fungsi. Itu bisa tahap berikutnya.

### Tantangan Anda

Coba lakukan refactor kecil ini sendiri:

- ubah renderAllTask menjadi renderTask
- buat getFilteredTasks(tasks, filter)
- buat renderCurrentView()
- di submit, delete, checkbox, dan tab, panggil renderCurrentView() daripada render manual satu-satu

### Checkpoint review

Setelah itu, kirim ulang isi main.js atau bagian fungsi tab + render. Saya bisa bantu review apakah pemisahan tanggung jawabnya sudah lebih rapi sebelum Anda lanjut bikin logic khusus
untuk all, pending, dan completed.

# Learning Notes: State, Filter, Render, dan Animasi Completed Task

## Momen Belajar

Saat task dicentang sebagai completed, ekspektasinya bukan hanya data berubah, tapi UI juga langsung terasa berubah:

- checkbox aktif,
- teks task berubah abu-abu,
- garis coret berjalan,
- setelah delay singkat task hilang dari tab pending,
- task muncul di tab completed.

Masalah ini mengajarkan bahwa di frontend ada beberapa lapisan yang perlu dipisahkan:

1. Data state task.
2. Filter tab yang sedang aktif.
3. Render ulang UI.
4. Animasi visual sementara.

## Mental Model

Jangan berpikir bahwa task harus "dipindahkan" secara manual dari satu tab ke tab lain.

Lebih tepat berpikir seperti ini:

```txt
user centang checkbox
-> update data task.completed
-> simpan data terbaru
-> beri class visual untuk animasi
-> tunggu sebentar
-> baca ulang data terbaru
-> filter berdasarkan tab aktif
-> render ulang
```

Tab `pending` dan `completed` sebaiknya dianggap sebagai view hasil filter, bukan tempat penyimpanan data yang berbeda.

Contoh:

```js
const pendingTasks = tasks.filter((task) => !task.completed);
const completedTasks = tasks.filter((task) => task.completed);
```

Sumber kebenaran tetap satu: semua task di storage.

## Hal Penting: Snapshot Data Bisa Basi

Variabel seperti ini hanya membaca data sekali saat halaman pertama dibuka:

```js
let taskData = readTask();
let unCompletedData = getUncompletedData(taskData);
```

Setelah checkbox mengubah data dan `saveTask()` dipanggil, variabel lama belum tentu ikut berubah.

Karena itu, setelah perubahan penting, lebih aman membaca ulang data terbaru:

```js
const latestTaskData = readTask();
```

Lalu filter dari data terbaru tersebut.

## Async/Await untuk Delay Animasi

`await` tidak bisa langsung menunggu `setTimeout`, karena `setTimeout` bukan Promise.

Pola delay yang benar:

```js
const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
```

Lalu di event handler:

```js
todoItem.classList.toggle('is-completed', isChecked);

saveTask(newTaskData);

await delay(500);

renderCurrentView();
```

Urutannya penting:

1. Update tampilan kecil dulu dengan class `is-completed`.
2. Simpan data agar state benar.
3. Tunggu animasi.
4. Render ulang view aktif.

Kalau `renderCurrentView()` dipanggil terlalu cepat, elemen bisa hilang sebelum animasi coret terlihat.

## Pseudo-element untuk Line-through Custom

`::after` bukan teks asli. Ia adalah elemen visual tambahan yang dibuat CSS.

Contoh:

```css
.todo-item .task-info h3::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background-color: var(--color-text-muted);
  transition: width 0.3s ease;
}

.todo-item.is-completed .task-info h3::after {
  width: 100%;
}
```

Rule pertama membuat garis visual dengan lebar awal `0`.

Rule kedua membuat garis menjadi `100%` saat `.todo-item` punya class `.is-completed`.

Untuk mengubah warna teks asli, target-nya bukan `::after`, tapi `h3` langsung:

```css
.todo-item.is-completed .task-info h3 {
  color: var(--color-text-muted);
}
```

Mental model:

```txt
h3        -> teks asli
h3::after -> elemen visual tambahan untuk garis coret
```

## Pseudo-element vs Pseudo-class

Pseudo-element dan pseudo-class sama-sama ditulis di selector CSS, tapi fungsinya berbeda.

### Pseudo-element

Pseudo-element dipakai untuk memilih atau membuat bagian visual tertentu dari sebuah elemen.

Contoh:

```css
h3::after {
  content: '';
}
```

Artinya:

> Buat elemen visual tambahan setelah isi `h3`.

Secara mental, browser seperti membuat:

```html
<h3>
  Belajar JavaScript
  <span class="after"></span>
</h3>
```

Tapi `<span>` itu tidak benar-benar ada di HTML. Ia hanya dibuat secara visual oleh CSS.

Contoh pseudo-element:

```css
::before
::after
::first-letter
::first-line
::selection
```

Pseudo-element biasanya memakai dua titik dua:

```css
::after;
```

Dua titik dua dipakai untuk membedakan pseudo-element dari pseudo-class.

### Pseudo-class

Pseudo-class dipakai untuk memilih elemen berdasarkan state, kondisi, atau posisi tertentu.

Contoh:

```css
button:hover {
  background-color: red;
}
```

Artinya:

> Pilih `button` saat sedang di-hover.

Tidak ada elemen baru yang dibuat. CSS hanya menerapkan style ketika kondisi `hover` terjadi.

Contoh pseudo-class:

```css
:hover
:focus
:active
:checked
:first-child
:last-child
:nth-child()
:not()
```

Pseudo-class memakai satu titik dua:

```css
:hover;
```

### Perbedaan Utama

```txt
Pseudo-element:
membuat atau memilih bagian visual dari elemen.
Contoh: ::before, ::after.

Pseudo-class:
memilih elemen berdasarkan kondisi/state.
Contoh: :hover, :checked, :focus.
```

Contoh dalam todo app:

```css
.todo-checkbox input:checked ~ .checkbox-ui {
  background-color: var(--priority-high);
}
```

`input:checked` adalah pseudo-class, karena memilih input saat kondisinya sedang checked.

Sedangkan:

```css
.todo-item .task-info h3::after {
  content: '';
}
```

`h3::after` adalah pseudo-element, karena membuat elemen visual tambahan setelah isi `h3`.

## Selector Penting

Selector ini:

```css
.todo-item.is-completed
```

artinya satu elemen punya dua class sekaligus:

```html
<article class="todo-item is-completed"></article>
```

Sedangkan ini:

```css
.todo-item .is-completed
```

artinya cari elemen `.is-completed` di dalam `.todo-item`.

Untuk kasus completed task, yang dibutuhkan adalah:

```css
.todo-item.is-completed .task-info h3
```

Karena class `is-completed` dipasang pada elemen yang sama dengan `todo-item`.

## Arah Refactor Berikutnya

Saat ini logic untuk membaca tab aktif, filter data, dan render mulai muncul di beberapa tempat.

Agar lebih rapi, buat satu pintu render:

```js
function getActiveTab() {
  const activeButton = tabBar.querySelector(
    ".tab-bar button[aria-selected='true']"
  );
  return activeButton.value;
}

function getFilteredTasks(tasks, activeTab) {
  if (activeTab === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks.filter((task) => !task.completed);
}

function renderCurrentView() {
  const latestTaskData = readTask();
  const activeTab = getActiveTab();
  const visibleTasks = getFilteredTasks(latestTaskData, activeTab);

  renderTask(visibleTasks, activeTab);
}
```

Dengan begitu, submit, checkbox, delete, dan tab click cukup memanggil:

```js
renderCurrentView();
```

Ini membuat flow lebih mudah dipahami:

```txt
ubah data -> saveTask() -> renderCurrentView()
```

## Pelajaran Utama

Frontend interaktif tidak cukup hanya "mengubah data" atau hanya "mengubah DOM".

Yang perlu dijaga adalah alur:

```txt
state benar
-> visual feedback terlihat
-> render ulang dari state terbaru
```

Kalau alur ini konsisten, fitur seperti tab pending/completed, checkbox, delete, dan animasi akan lebih mudah dikembangkan tanpa saling merusak.
