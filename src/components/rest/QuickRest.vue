<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RestTypePicker from './RestTypePicker.vue'
import RestTimePicker from './RestTimePicker.vue'
import RestAnimation from './RestAnimation.vue'

const router = useRouter()

// Текущий шаг: 1 — выбор типа, 2 — выбор длительности, 3 — анимация упражнения
const step = ref(1)

const selectedType = ref('')
const selectedDuration = ref(0)

function handleTypeSelect(type) {
  selectedType.value = type
  step.value = 2
}

function handleDurationSelect(minutes) {
  selectedDuration.value = minutes
  step.value = 3
}

// Возврат к выбору типа/длительности (например, чтобы попробовать другое упражнение)
function handleAnimationDone() {
  step.value = 1
  selectedType.value = ''
  selectedDuration.value = 0
}

function goToTasks() {
  router.push('/tasks')
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-6">
    <!-- Шаг 1: выбор типа усталости -->
    <div v-if="step === 1" class="space-y-4">
      <h2 class="text-lg font-semibold text-center">Что устало?</h2>
      <RestTypePicker :model-value="selectedType" @select="handleTypeSelect" />
    </div>

    <!-- Шаг 2: выбор длительности -->
    <div v-else-if="step === 2" class="space-y-4">
      <h2 class="text-lg font-semibold text-center">Сколько времени есть?</h2>
      <RestTimePicker :model-value="selectedDuration" @select="handleDurationSelect" />
      <button
        type="button"
        class="w-full text-sm text-text-light/60 dark:text-text-dark/60 hover:text-accent transition"
        @click="step = 1"
      >
        ← Назад к выбору типа
      </button>
    </div>

    <!-- Шаг 3: анимация упражнения с таймером -->
    <RestAnimation
      v-else-if="step === 3"
      :type="selectedType"
      :duration="selectedDuration"
      @done="handleAnimationDone"
    />

    <!-- Кнопка возврата к задачам — доступна на любом шаге -->
    <button
      type="button"
      class="w-full py-2 rounded-button border border-gray-300 dark:border-gray-600
             text-sm font-medium hover:bg-bg-light dark:hover:bg-bg-dark transition"
      @click="goToTasks"
    >
      Вернуться к задачам
    </button>
  </div>
</template>