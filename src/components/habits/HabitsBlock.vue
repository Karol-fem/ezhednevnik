<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useHabitsLogs } from '@/composables/useHabitsLogs'

const props = defineProps({
  // Дата дня в формате YYYY-MM-DD, для которой показывается блок
  date: {
    type: String,
    required: true
  }
})

// Привычки и настройка видимости — общие с HabitsSettings.vue
const habitsEnabled = useLocalStorage('habitsEnabled', false)
const habits = useLocalStorage('habits', [])

// Отметки выполнения: { [habitId]: { 'YYYY-MM-DD': true } }
const habitLogs = useHabitsLogs()

function isDone(habitId, date) {
  return Boolean(habitLogs.value[habitId] && habitLogs.value[habitId][date])
}

function toggleDone(habitId) {
  if (!habitLogs.value[habitId]) {
    habitLogs.value[habitId] = {}
  }
  if (habitLogs.value[habitId][props.date]) {
    delete habitLogs.value[habitId][props.date]
  } else {
    habitLogs.value[habitId][props.date] = true
  }
  habitLogs.value = { ...habitLogs.value }
}

function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Количество дней подряд выполнения привычки, считая назад от текущей даты карточки
function streakFor(habitId) {
  let streak = 0
  const cursor = new Date(props.date)

  while (true) {
    const key = toIsoDate(cursor)
    if (habitLogs.value[habitId] && habitLogs.value[habitId][key]) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
</script>

<template>
  <div v-if="habitsEnabled && habits.length > 0" class="space-y-1.5 pt-1 border-t border-gray-200 dark:border-gray-700">
    <p class="text-[11px] font-medium text-text-light/50 dark:text-text-dark/50">Привычки</p>

    <label
      v-for="habit in habits"
      :key="habit.id"
      class="flex items-center gap-2 text-xs cursor-pointer"
    >
      <input
        type="checkbox"
        class="w-4 h-4 accent-accent shrink-0"
        :checked="isDone(habit.id, date)"
        @change="toggleDone(habit.id)"
      >
      <span class="flex-1 truncate" :class="isDone(habit.id, date) ? 'text-text-light/50 dark:text-text-dark/50' : ''">
        {{ habit.name }}
      </span>
      <span v-if="streakFor(habit.id) > 0" class="text-[11px] text-accent shrink-0">
        🔥 {{ streakFor(habit.id) }} дн
      </span>
    </label>
  </div>
</template>
