<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['select'])

// Названия месяцев и дней недели на русском
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]
const weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Месяц, который сейчас отображается в календаре (по умолчанию — текущий)
const viewedMonth = ref(startOfMonth(new Date()))

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayIso = toIsoDate(new Date())

// Подпись заголовка: «Май 2026»
const monthLabel = computed(() => {
  return `${monthNames[viewedMonth.value.getMonth()]} ${viewedMonth.value.getFullYear()}`
})

// Строим сетку дней месяца, дополняя неделю днями соседних месяцев
const calendarDays = computed(() => {
  const firstDay = startOfMonth(viewedMonth.value)
  const lastDay = new Date(viewedMonth.value.getFullYear(), viewedMonth.value.getMonth() + 1, 0)

  // Понедельник = 0 ... воскресенье = 6, для выравнивания сетки
  const firstWeekday = (firstDay.getDay() + 6) % 7
  const lastWeekday = (lastDay.getDay() + 6) % 7

  const days = []

  // Дни предыдущего месяца для заполнения первой недели
  for (let i = firstWeekday; i > 0; i -= 1) {
    const date = new Date(firstDay)
    date.setDate(date.getDate() - i)
    days.push({ date, iso: toIsoDate(date), inCurrentMonth: false })
  }

  // Дни текущего месяца
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(viewedMonth.value.getFullYear(), viewedMonth.value.getMonth(), day)
    days.push({ date, iso: toIsoDate(date), inCurrentMonth: true })
  }

  // Дни следующего месяца для заполнения последней недели
  for (let i = 1; i <= 6 - lastWeekday; i += 1) {
    const date = new Date(lastDay)
    date.setDate(date.getDate() + i)
    days.push({ date, iso: toIsoDate(date), inCurrentMonth: false })
  }

  return days
})

function prevMonth() {
  const date = new Date(viewedMonth.value)
  date.setMonth(date.getMonth() - 1)
  viewedMonth.value = startOfMonth(date)
}

function nextMonth() {
  const date = new Date(viewedMonth.value)
  date.setMonth(date.getMonth() + 1)
  viewedMonth.value = startOfMonth(date)
}

function selectDay(day) {
  emit('select', day.iso)
}
</script>

<template>
  <div
    class="w-full md:w-80 bg-card-light dark:bg-card-dark rounded-card shadow-lg p-4 space-y-3"
  >
    <!-- Заголовок с переключением месяцев -->
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-button hover:bg-bg-light dark:hover:bg-bg-dark transition"
        aria-label="Предыдущий месяц"
        @click="prevMonth"
      >
        ←
      </button>
      <span class="text-sm font-medium">{{ monthLabel }}</span>
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-button hover:bg-bg-light dark:hover:bg-bg-dark transition"
        aria-label="Следующий месяц"
        @click="nextMonth"
      >
        →
      </button>
    </div>

    <!-- Подписи дней недели -->
    <div class="grid grid-cols-7 text-center text-xs text-text-light/50 dark:text-text-dark/50">
      <span v-for="label in weekDayLabels" :key="label">{{ label }}</span>
    </div>

    <!-- Сетка дней месяца -->
    <div class="grid grid-cols-7 gap-y-1 text-center text-sm">
      <button
        v-for="day in calendarDays"
        :key="day.iso"
        type="button"
        class="w-9 h-9 mx-auto flex items-center justify-center rounded-full transition"
        :class="[
          day.inCurrentMonth ? '' : 'text-text-light/30 dark:text-text-dark/30',
          day.iso === todayIso
            ? 'bg-accent text-white font-semibold'
            : 'hover:bg-bg-light dark:hover:bg-bg-dark'
        ]"
        @click="selectDay(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
  </div>
</template>
