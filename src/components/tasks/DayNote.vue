<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const props = defineProps({
  // Дата дня в формате YYYY-MM-DD — ключ для хранения заметки
  date: {
    type: String,
    required: true
  }
})

// Заметки по дням хранятся одним объектом: { 'YYYY-MM-DD': 'текст' }
const dayNotes = useLocalStorage('dayNotes', {})

const isOpen = ref(false)

// Текст заметки текущего дня с автосохранением при изменении
const noteText = computed({
  get() {
    return dayNotes.value[props.date] || ''
  },
  set(value) {
    dayNotes.value = { ...dayNotes.value, [props.date]: value }
  }
})

// Иконка подсвечивается, если заметка не пустая
const hasNote = computed(() => noteText.value.trim().length > 0)

function toggleOpen() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <!-- Иконка заметки рядом с названием дня -->
    <button
      type="button"
      class="w-6 h-6 flex items-center justify-center rounded-button text-sm transition"
      :class="hasNote ? 'text-accent' : 'text-text-light/30 dark:text-text-dark/30 hover:text-accent'"
      :aria-label="hasNote ? 'Заметка ко дню (есть запись)' : 'Добавить заметку ко дню'"
      @click="toggleOpen"
    >
      <span aria-hidden="true">📝</span>
    </button>

    <!-- Мини-поле заметки, разворачивается прямо в карточке дня -->
    <textarea
      v-if="isOpen"
      v-model="noteText"
      rows="2"
      placeholder="Заметка на день..."
      class="mt-2 w-full text-xs rounded-button border border-gray-300 dark:border-gray-600
             bg-bg-light dark:bg-bg-dark px-2 py-1.5 resize-none
             focus:outline-none focus:ring-2 focus:ring-accent"
    ></textarea>
  </div>
</template>
