<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import TaskCard from './TaskCard.vue'
import TaskForm from './TaskForm.vue'

// Все задачи хранятся одним массивом в localStorage
const tasks = useLocalStorage('tasks', [])

// Подписи дней недели (Пн–Вс)
const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Находим понедельник текущей недели
function getMonday(date) {
  const result = new Date(date)
  const day = result.getDay() // 0 = воскресенье, 1 = понедельник, ...
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

// Форматируем дату в ISO-строку YYYY-MM-DD (без времени)
function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Строим список из 7 дней текущей недели с их датами
const weekDays = computed(() => {
  const monday = getMonday(new Date())
  return dayLabels.map((label, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      label,
      date: toIsoDate(date),
      shortDate: `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`
    }
  })
})

// Состояние модального окна формы
const showForm = ref(false)
const editingTask = ref(null)
const formDefaultDate = ref('')

function openAddForm(date) {
  editingTask.value = null
  formDefaultDate.value = date
  showForm.value = true
}

function openEditForm(task) {
  editingTask.value = task
  formDefaultDate.value = task.date
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingTask.value = null
}

function handleSave(taskData) {
  const index = tasks.value.findIndex((t) => t.id === taskData.id)
  if (index !== -1) {
    tasks.value[index] = taskData
  } else {
    tasks.value.push(taskData)
  }
  closeForm()
}

function handleToggle(id) {
  const task = tasks.value.find((t) => t.id === id)
  if (task) {
    task.done = !task.done
  }
}

function handleDelete(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

// Задачи конкретного дня, отсортированные по времени
function tasksForDay(date) {
  return tasks.value
    .filter((t) => t.date === date)
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
}

// Процент выполненных задач за день (для прогресс-бара)
function dayProgress(date) {
  const dayTasks = tasksForDay(date)
  if (dayTasks.length === 0) {
    return 0
  }
  const done = dayTasks.filter((t) => t.done).length
  return Math.round((done / dayTasks.length) * 100)
}

// Подсказка «Сделать перерыв» показывается для задач длиннее 45 минут
// (поле duration в минутах — необязательное, задаётся при создании задачи)
function needsBreak(task) {
  return typeof task.duration === 'number' && task.duration > 45
}

function dayHasLongTask(date) {
  return tasksForDay(date).some(needsBreak)
}
</script>

<template>
  <div>
    <!-- Сетка недели: 1 колонка на телефоне, 4 на планшете, 7 на десктопе -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="bg-card-light dark:bg-card-dark rounded-card p-3 shadow-sm flex flex-col gap-3"
      >
        <!-- Заголовок дня -->
        <div class="flex items-baseline justify-between">
          <h3 class="font-semibold text-sm">{{ day.label }}</h3>
          <span class="text-xs text-text-light/60 dark:text-text-dark/60">{{ day.shortDate }}</span>
        </div>

        <!-- Прогресс-бар выполненных задач -->
        <div class="w-full h-2 rounded-full bg-bg-light dark:bg-bg-dark overflow-hidden">
          <div
            class="h-full bg-accent transition-all duration-300"
            :style="{ width: dayProgress(day.date) + '%' }"
          ></div>
        </div>

        <!-- Подсказка про перерыв, если есть длинная задача -->
        <router-link
          v-if="dayHasLongTask(day.date)"
          to="/rest"
          class="text-xs bg-rest/20 text-yellow-700 dark:text-yellow-300 rounded-button px-2 py-1
                 flex items-center gap-1 hover:opacity-80 transition"
        >
          <span aria-hidden="true">⏸️</span> Сделать перерыв
        </router-link>

        <!-- Список задач дня -->
        <div class="flex flex-col gap-2">
          <TaskCard
            v-for="task in tasksForDay(day.date)"
            :key="task.id"
            :task="task"
            @toggle="handleToggle"
            @edit="openEditForm"
            @delete="handleDelete"
          />
          <p
            v-if="tasksForDay(day.date).length === 0"
            class="text-xs text-text-light/40 dark:text-text-dark/40 text-center py-2"
          >
            Задач нет
          </p>
        </div>

        <!-- Кнопка добавления задачи -->
        <button
          type="button"
          class="mt-auto text-sm text-accent font-medium py-2 rounded-button
                 border border-dashed border-accent/40 hover:bg-accent/10 transition"
          @click="openAddForm(day.date)"
        >
          + Добавить задачу
        </button>
      </div>
    </div>

    <!-- Модальное окно с формой добавления/редактирования -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
      @click.self="closeForm"
    >
      <div class="w-full max-w-md">
        <TaskForm
          :task="editingTask"
          :default-date="formDefaultDate"
          @save="handleSave"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>