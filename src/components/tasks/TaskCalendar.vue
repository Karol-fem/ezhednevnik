<script setup>
import { ref, computed, onMounted, watch, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import { useLocalStorage } from '@/composables/useLocalStorage'
import TaskCard from './TaskCard.vue'
import TaskForm from './TaskForm.vue'
import DayNote from './DayNote.vue'
import HabitsBlock from '@/components/habits/HabitsBlock.vue'

const route = useRoute()

// Все задачи хранятся одним массивом в localStorage
const tasks = useLocalStorage('tasks', [])

// Подписи дней недели (Пн–Вс)
const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Названия месяцев в родительном падеже — для диапазона дат («12–18 мая»)
const monthNamesGenitive = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]

// Находим понедельник недели, содержащей переданную дату
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

// Понедельник отображаемой сейчас недели (по умолчанию — текущая неделя)
const currentWeekStart = ref(getMonday(new Date()))

// Строим список из 7 дней отображаемой недели с их датами
const weekDays = computed(() => {
  return dayLabels.map((label, index) => {
    const date = new Date(currentWeekStart.value)
    date.setDate(currentWeekStart.value.getDate() + index)
    return {
      label,
      date: toIsoDate(date),
      shortDate: `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`
    }
  })
})

// Переключение недель
function prevWeek() {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() - 7)
  currentWeekStart.value = date
}

function nextWeek() {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() + 7)
  currentWeekStart.value = date
}

function goToToday() {
  currentWeekStart.value = getMonday(new Date())
}

// Является ли отображаемая неделя текущей (для отключения кнопки «Сегодня»)
const isCurrentWeek = computed(() => {
  return toIsoDate(currentWeekStart.value) === toIsoDate(getMonday(new Date()))
})


// Является ли день сегодняшним (сравниваем ISO-даты)
function isToday(date) {
  return date === toIsoDate(new Date())
}

// Дата, выбранная в мини-календаре (приходит в адресе как ?date=YYYY-MM-DD)
const selectedDate = computed(() => {
  const value = route.query.date
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null
})

// Классы подсветки карточки: сегодня — индиго, выбранная дата — голубая обводка
function dayCardClass(date) {
  if (isToday(date)) {
    return 'ring-2 ring-accent'
  }
  if (date === selectedDate.value) {
    return 'ring-2 ring-sky-400 dark:ring-sky-500'
  }
  return ''
}

// На телефоне прокручиваем к выбранной дате, а если её нет — к сегодняшнему дню
// (только когда сегодняшний день на открытой неделе)
async function scrollToTarget() {
  if (window.innerWidth >= 768) {
    return
  }
  // Ждём, пока Vue перерисует карточки новой недели
  await nextTick()

  let target = null
  if (selectedDate.value) {
    target = document.querySelector(`[data-date="${selectedDate.value}"]`)
  }
  if (!target && isCurrentWeek.value) {
    target = document.querySelector(`[data-date="${toIsoDate(new Date())}"]`)
  }
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Прокрутка срабатывает при каждой смене недели (в том числе при выборе даты в мини-календаре)
watch(currentWeekStart, scrollToTarget)
onMounted(scrollToTarget)


// Подпись диапазона дат недели, например «12–18 мая 2026»
const weekRangeLabel = computed(() => {
  const start = currentWeekStart.value
  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  const year = end.getFullYear()

  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${monthNamesGenitive[end.getMonth()]} ${year}`
  }

  return `${start.getDate()} ${monthNamesGenitive[start.getMonth()]} – ${end.getDate()} ${monthNamesGenitive[end.getMonth()]} ${year}`
})


// сразу показываем неделю, содержащую эту дату

watch(
  () => route.query.date,
  (newDate) => {
    if (newDate) {
      const parsed = new Date(newDate)
      if (!Number.isNaN(parsed.getTime())) {
        currentWeekStart.value = getMonday(parsed)
      }
    }
  },
  { immediate: true }
)

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
    <!-- Навигация по неделям -->
    <div class="flex items-center justify-center gap-4 mb-4">
      <button
        type="button"
        class="w-9 h-9 flex items-center justify-center rounded-button hover:bg-card-light dark:hover:bg-card-dark transition"
        aria-label="Предыдущая неделя"
        @click="prevWeek"
      >
        ←
      </button>

      <span class="text-sm md:text-base font-medium min-w-[14ch] text-center">
        {{ weekRangeLabel }}
      </span>

      <button
        type="button"
        class="w-9 h-9 flex items-center justify-center rounded-button hover:bg-card-light dark:hover:bg-card-dark transition"
        aria-label="Следующая неделя"
        @click="nextWeek"
      >
        →
      </button>

      <button
        v-if="!isCurrentWeek"
        type="button"
        class="ml-2 text-sm text-accent font-medium px-3 py-1.5 rounded-button border border-accent/40 hover:bg-accent/10 transition"
        @click="goToToday"
      >
        Сегодня
      </button>
    </div>

    <!-- Сетка недели: 1 колонка на телефоне, 4 на планшете, 7 на десктопе -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="day in weekDays"
        :key="day.date"
        :data-date="day.date"
        class="bg-card-light dark:bg-card-dark rounded-card p-3 shadow-sm flex flex-col gap-3"
        :class="dayCardClass(day.date)"
      >
        <!-- Заголовок дня -->
        <div class="flex items-baseline justify-between">
          <span class="flex items-center gap-1">
            <h3 class="font-semibold text-sm">{{ day.label }}</h3>
            <DayNote :date="day.date" />
          </span>
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

        <!-- Блок привычек (виден только если включены в настройках) -->
        <HabitsBlock :date="day.date" />

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
