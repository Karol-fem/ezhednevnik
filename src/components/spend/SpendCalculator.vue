<script setup>
import { ref } from 'vue'
import SpendForm from './SpendForm.vue'
import SpendResult from './SpendResult.vue'

// Результат расчёта: null, пока форма не отправлена
const result = ref(null)

function handleCalculate(data) {
  result.value = data
}

function handleReset() {
  result.value = null
}
</script>

<template>
  <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
    <!-- Форма ввода: слева на десктопе, сверху на телефоне -->
    <SpendForm @calculate="handleCalculate" />

    <!-- Результат расчёта: справа на десктопе, снизу на телефоне -->
    <div v-if="result" class="space-y-4">
      <SpendResult :result="result" />
      <button
        type="button"
        class="w-full rounded-button bg-accent/10 text-accent py-2 text-sm font-medium
               hover:bg-accent/20 transition"
        @click="handleReset"
      >
        Попробовать другую привычку
      </button>
    </div>

    <!-- Заглушка, пока расчёт ещё не сделан -->
    <div
      v-else
      class="flex items-center justify-center text-center text-sm text-text-light/50 dark:text-text-dark/50
             bg-card-light dark:bg-card-dark rounded-card p-8 h-full"
    >
      Заполните форму и нажмите «Посчитать», чтобы увидеть результат
    </div>
  </div>
</template>