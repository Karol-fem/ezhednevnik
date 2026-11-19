<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // Выбранная заметка: { id, title, content, updatedAt } или null, если ничего не выбрано
  note: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const title = ref('')
const content = ref('')

// При смене выбранной заметки — подставляем её данные в поля редактора
watch(
  () => props.note,
  (newNote) => {
    title.value = newNote ? newNote.title : ''
    content.value = newNote ? newNote.content : ''
  },
  { immediate: true }
)

// Автосохранение: любое изменение заголовка или текста сразу отправляется родителю
function saveChanges() {
  if (!props.note) {
    return
  }
  emit('update', {
    id: props.note.id,
    title: title.value,
    content: content.value,
    updatedAt: Date.now()
  })
}
</script>

<template>
  <div class="bg-card-light dark:bg-card-dark rounded-card shadow-sm p-4 min-h-[60vh] flex flex-col">
    <template v-if="note">
      <!-- Заголовок заметки -->
      <input
        v-model="title"
        type="text"
        placeholder="Без названия"
        class="w-full text-lg font-semibold bg-transparent border-none outline-none mb-3
               placeholder:text-text-light/40 dark:placeholder:text-text-dark/40"
        @input="saveChanges"
      >

      <!-- Текст заметки -->
      <textarea
        v-model="content"
        placeholder="Начните печатать..."
        class="flex-1 w-full bg-transparent border-none outline-none resize-none text-sm
               placeholder:text-text-light/40 dark:placeholder:text-text-dark/40"
        @input="saveChanges"
      ></textarea>
    </template>

    <!-- Пустое состояние, если заметка не выбрана -->
    <div
      v-else
      class="flex-1 flex items-center justify-center text-sm text-text-light/40 dark:text-text-dark/40 text-center"
    >
      Выберите заметку или создайте новую
    </div>
  </div>
</template>
