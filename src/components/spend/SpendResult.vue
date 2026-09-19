<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  // Данные расчёта, переданные из SpendForm: { habit, amount, timesPerWeek }
  result: {
    type: Object,
    required: true
  }
})

const WEEKS_PER_MONTH = 4.345
const WEEKS_PER_YEAR = 52

// Реальные суммы расчёта
const monthlyTotal = computed(() => props.result.amount * props.result.timesPerWeek * WEEKS_PER_MONTH)
const yearlyTotal = computed(() => props.result.amount * props.result.timesPerWeek * WEEKS_PER_YEAR)
const fiveYearsTotal = computed(() => yearlyTotal.value * 5)

// Анимированные (накручивающиеся) значения, которые показываются в шаблоне
const animatedMonthly = ref(0)
const animatedYearly = ref(0)
const animatedFiveYears = ref(0)

// Плавная анимация числа от 0 до target за заданное время
function animateValue(targetRef, targetValue, durationMs = 1200) {
  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / durationMs)
    // Плавное замедление к концу анимации
    const eased = 1 - Math.pow(1 - progress, 3)
    targetRef.value = Math.round(targetValue * eased)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

function runAnimations() {
  animateValue(animatedMonthly, monthlyTotal.value)
  animateValue(animatedYearly, yearlyTotal.value)
  animateValue(animatedFiveYears, fiveYearsTotal.value)
}

onMounted(runAnimations)
watch(() => props.result, runAnimations)

// Форматирование числа с разделителями разрядов
function formatRub(value) {
  return Math.round(value).toLocaleString('ru-RU') + ' ₽'
}

// Ориентировочные цены для блока "Что можно купить вместо этого"
const comparisonItems = computed(() => {
  const yearly = yearlyTotal.value
  return [
    { icon: '🎧', label: 'Наушники', price: 15000, count: Math.floor(yearly / 15000) },
    { icon: '📱', label: 'iPhone', price: 80000, count: Math.floor(yearly / 80000) },
    { icon: '🏖️', label: 'Путёвка на море', price: 50000, count: Math.floor(yearly / 50000) }
  ]
})

// Первый взнос на машину (условно 300 000 ₽) — считаем, за сколько лет накопится
const carDownPayment = 300000
const carYears = computed(() => {
  if (yearlyTotal.value <= 0) {
    return 0
  }
  return (carDownPayment / yearlyTotal.value).toFixed(1)
})

const copied = ref(false)

async function handleCopy() {
  const text =
    `Привычка: ${props.result.habit}\n` +
    `В месяц: ${formatRub(monthlyTotal.value)}\n` +
    `В год: ${formatRub(yearlyTotal.value)}\n` +
    `За 5 лет: ${formatRub(fiveYearsTotal.value)}`

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    // Если буфер обмена недоступен — тихо игнорируем
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Основные суммы -->
    <div class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-3">
      <p class="text-sm text-text-light/60 dark:text-text-dark/60">
        Привычка: <span class="font-medium">{{ result.habit }}</span>
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div>
          <p class="text-xs text-text-light/60 dark:text-text-dark/60">За месяц</p>
          <p class="text-2xl font-semibold tabular-nums">{{ formatRub(animatedMonthly) }}</p>
        </div>
        <div>
          <p class="text-xs text-text-light/60 dark:text-text-dark/60">За год</p>
          <p class="text-2xl font-semibold tabular-nums text-accent">{{ formatRub(animatedYearly) }}</p>
        </div>
        <div>
          <p class="text-xs text-text-light/60 dark:text-text-dark/60">За 5 лет</p>
          <p class="text-2xl font-semibold tabular-nums">{{ formatRub(animatedFiveYears) }}</p>
        </div>
      </div>
    </div>

    <!-- Что можно купить вместо этого -->
    <div class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-3">
      <h4 class="text-sm font-medium">Что можно купить вместо этого (за год)</h4>
      <ul class="space-y-2">
        <li
          v-for="item in comparisonItems"
          :key="item.label"
          class="flex items-center justify-between text-sm"
        >
          <span class="flex items-center gap-2">
            <span aria-hidden="true">{{ item.icon }}</span> {{ item.label }}
          </span>
          <span class="font-medium">{{ item.count }} раз(а)</span>
        </li>
        <li class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2">
            <span aria-hidden="true">🚗</span> Первый взнос на машину (300 000 ₽)
          </span>
          <span class="font-medium">за {{ carYears }} лет</span>
        </li>
      </ul>
    </div>

    <!-- Кнопка сохранения в заметки -->
    <button
      type="button"
      class="w-full rounded-button border border-gray-300 dark:border-gray-600
             py-2 text-sm font-medium hover:bg-bg-light dark:hover:bg-bg-dark transition"
      @click="handleCopy"
    >
      {{ copied ? 'Скопировано ✓' : 'Сохранить в заметки' }}
    </button>
  </div>
</template>