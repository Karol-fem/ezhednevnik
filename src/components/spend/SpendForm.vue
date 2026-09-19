<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['calculate'])

// Готовые варианты привычек
const habitOptions = [
  { value: 'coffee', label: 'Кофе' },
  { value: 'taxi', label: 'Такси' },
  { value: 'delivery', label: 'Доставка еды' },
  { value: 'other', label: 'Другое' }
]

// Варианты частоты трат
const frequencyOptions = [
  { value: 'daily', label: 'Каждый день', timesPerWeek: 7 },
  { value: '3_week', label: '3 раза в неделю', timesPerWeek: 3 },
  { value: '1_week', label: 'Раз в неделю', timesPerWeek: 1 },
  { value: 'custom', label: 'Своё' }
]

const habitType = ref('coffee')
const customHabitName = ref('')
const amount = ref(null)
const frequency = ref('daily')
const customTimesPerWeek = ref(7)

// Итоговое название привычки для отображения в результате
const habitLabel = computed(() => {
  if (habitType.value === 'other') {
    return customHabitName.value.trim() || 'Привычка'
  }
  return habitOptions.find((h) => h.value === habitType.value)?.label || 'Привычка'
})

// Итоговая частота трат в разах за неделю
const timesPerWeek = computed(() => {
  if (frequency.value === 'custom') {
    return Number(customTimesPerWeek.value) || 0
  }
  return frequencyOptions.find((f) => f.value === frequency.value)?.timesPerWeek || 0
})

function handleSubmit() {
  if (!amount.value || amount.value <= 0 || timesPerWeek.value <= 0) {
    return
  }

  emit('calculate', {
    habit: habitLabel.value,
    amount: Number(amount.value),
    timesPerWeek: timesPerWeek.value
  })
}
</script>

<template>
  <form
    class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-4"
    @submit.prevent="handleSubmit"
  >
    <!-- Выбор привычки -->
    <div>
      <label class="block text-sm font-medium mb-1" for="habit-type">Привычка</label>
      <select
        id="habit-type"
        v-model="habitType"
        class="w-full rounded-button border border-gray-300 dark:border-gray-600
               bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm"
      >
        <option v-for="option in habitOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <input
        v-if="habitType === 'other'"
        v-model="customHabitName"
        type="text"
        placeholder="Введите название привычки"
        class="mt-2 w-full rounded-button border border-gray-300 dark:border-gray-600
               bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-accent"
      >
    </div>

    <!-- Сумма за раз -->
    <div>
      <label class="block text-sm font-medium mb-1" for="amount">Сумма за раз (₽)</label>
      <input
        id="amount"
        v-model="amount"
        type="number"
        min="0"
        step="1"
        required
        placeholder="Например, 250"
        class="w-full rounded-button border border-gray-300 dark:border-gray-600
               bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-accent"
      >
    </div>

    <!-- Частота -->
    <div>
      <label class="block text-sm font-medium mb-1" for="frequency">Частота</label>
      <select
        id="frequency"
        v-model="frequency"
        class="w-full rounded-button border border-gray-300 dark:border-gray-600
               bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm"
      >
        <option v-for="option in frequencyOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div v-if="frequency === 'custom'" class="mt-2 flex items-center gap-2">
        <input
          v-model="customTimesPerWeek"
          type="number"
          min="1"
          max="21"
          class="w-24 rounded-button border border-gray-300 dark:border-gray-600
                 bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-accent"
        >
        <span class="text-sm text-text-light/60 dark:text-text-dark/60">раз(а) в неделю</span>
      </div>
    </div>

    <!-- Кнопка расчёта -->
    <button
      type="submit"
      class="w-full rounded-button bg-accent text-white py-2 text-sm font-medium hover:opacity-90 transition"
    >
      Посчитать
    </button>
  </form>
</template>