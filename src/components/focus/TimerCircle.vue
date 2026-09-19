<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Оставшееся время в секундах
  timeLeft: {
    type: Number,
    required: true
  },
  // Общая длительность таймера в секундах (для расчёта прогресса кольца)
  totalTime: {
    type: Number,
    required: true
  }
})

// Радиус и длина окружности SVG-кольца
const radius = 90
const circumference = 2 * Math.PI * radius

// Доля оставшегося времени (от 0 до 1)
const progress = computed(() => {
  if (props.totalTime <= 0) {
    return 0
  }
  return Math.max(0, Math.min(1, props.timeLeft / props.totalTime))
})

// Смещение обводки кольца — чем меньше времени осталось, тем короче видимая дуга
const dashOffset = computed(() => circumference * (1 - progress.value))

// Форматирование времени как "минуты:секунды"
const formattedTime = computed(() => {
  const minutes = Math.floor(props.timeLeft / 60)
  const seconds = props.timeLeft % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
</script>

<template>
  <div class="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
    <svg viewBox="0 0 200 200" class="w-full h-full -rotate-90">
      <!-- Фоновое кольцо -->
      <circle
        cx="100"
        cy="100"
        :r="radius"
        fill="none"
        stroke-width="12"
        class="stroke-bg-light dark:stroke-bg-dark"
      />
      <!-- Кольцо прогресса -->
      <circle
        cx="100"
        cy="100"
        :r="radius"
        fill="none"
        stroke-width="12"
        stroke-linecap="round"
        class="stroke-accent transition-all duration-300"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <!-- Текст с оставшимся временем поверх круга -->
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-4xl md:text-5xl font-semibold tabular-nums">
        {{ formattedTime }}
      </span>
    </div>
  </div>
</template>