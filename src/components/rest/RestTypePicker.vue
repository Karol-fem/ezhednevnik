<script setup>
const props = defineProps({
  // Текущий выбранный тип (для подсветки активной кнопки)
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

// Доступные типы усталости
const types = [
  { value: 'eyes', label: 'Глаза', icon: '👁️' },
  { value: 'back', label: 'Спина', icon: '🧍' },
  { value: 'head', label: 'Голова', icon: '🧠' }
]

function choose(value) {
  emit('update:modelValue', value)
  emit('select', value)
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <button
      v-for="type in types"
      :key="type.value"
      type="button"
      class="flex flex-col items-center gap-2 py-6 rounded-card text-sm font-medium transition"
      :class="modelValue === type.value
        ? 'bg-accent text-white shadow-sm'
        : 'bg-card-light dark:bg-card-dark hover:opacity-80'"
      @click="choose(type.value)"
    >
      <span class="text-3xl" aria-hidden="true">{{ type.icon }}</span>
      <span>{{ type.label }}</span>
    </button>
  </div>
</template>