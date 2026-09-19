<script setup>
const props = defineProps({
  // Текущее выбранное время в минутах (для подсветки активной кнопки)
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

// Доступные варианты длительности отдыха (в минутах)
const durations = [1, 5, 10]

function choose(minutes) {
  emit('update:modelValue', minutes)
  emit('select', minutes)
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <button
      v-for="minutes in durations"
      :key="minutes"
      type="button"
      class="flex flex-col items-center gap-1 py-6 rounded-card text-sm font-medium transition"
      :class="modelValue === minutes
        ? 'bg-accent text-white shadow-sm'
        : 'bg-card-light dark:bg-card-dark hover:opacity-80'"
      @click="choose(minutes)"
    >
      <span class="text-2xl font-semibold">{{ minutes }}</span>
      <span>мин</span>
    </button>
  </div>
</template>