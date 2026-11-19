<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // Все заметки: { id, title, content, updatedAt }
  notes: {
    type: Array,
    required: true
  },
  // id текущей выбранной заметки
  selectedId: {
    type: [Number, String, null],
    default: null
  }
})

const emit = defineEmits(['select', 'create', 'delete'])

const searchQuery = ref('')

// Отфильтрованный список заметок по поисковому запросу (ищем в заголовке и тексте)
const filteredNotes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return props.notes
  }
  return props.notes.filter((note) => {
    const title = (note.title || '').toLowerCase()
    const content = (note.content || '').toLowerCase()
    return title.includes(query) || content.includes(query)
  })
})

function formatDate(timestamp) {
  if (!timestamp) {
    return ''
  }
  const date = new Date(timestamp)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

// Короткий превью текста заметки для списка
function previewText(content) {
  const text = (content || '').trim()
  return text.length > 40 ? text.slice(0, 40) + '…' : text
}

function handleSelect(id) {
  emit('select', id)
}

function handleCreate() {
  emit('create')
}

function handleDelete(event, id) {
  event.stopPropagation()
  emit('delete', id)
}
</script>

<template>
  <div class="bg-card-light dark:bg-card-dark rounded-card shadow-sm p-3 space-y-3 h-fit">
    <!-- Кнопка создания новой заметки -->
    <button
      type="button"
      class="w-full rounded-button bg-accent text-white py-2 text-sm font-medium hover:opacity-90 transition"
      @click="handleCreate"
    >
      + Новая заметка
    </button>

    <!-- Поиск по заметкам -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Поиск по заметкам..."
      class="w-full rounded-button border border-gray-300 dark:border-gray-600
             bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-accent"
    >

    <!-- Список заметок -->
    <div class="space-y-1 max-h-[60vh] overflow-y-auto">
      <button
        v-for="note in filteredNotes"
        :key="note.id"
        type="button"
        class="w-full flex items-start justify-between gap-2 text-left px-3 py-2 rounded-button text-sm transition"
        :class="selectedId === note.id
          ? 'bg-accent/10 text-accent'
          : 'hover:bg-bg-light dark:hover:bg-bg-dark'"
        @click="handleSelect(note.id)"
      >
        <span class="min-w-0">
          <span class="block font-medium truncate">{{ note.title || 'Без названия' }}</span>
          <span class="block text-xs text-text-light/50 dark:text-text-dark/50 truncate">
            {{ previewText(note.content) }}
          </span>
        </span>
        <span class="flex flex-col items-end gap-1 shrink-0">
          <span class="text-[10px] text-text-light/40 dark:text-text-dark/40">
            {{ formatDate(note.updatedAt) }}
          </span>
          <span
            class="text-xs text-text-light/30 dark:text-text-dark/30 hover:text-important"
            role="button"
            aria-label="Удалить заметку"
            @click="handleDelete($event, note.id)"
          >
            🗑️
          </span>
        </span>
      </button>

      <p
        v-if="filteredNotes.length === 0"
        class="text-xs text-text-light/40 dark:text-text-dark/40 text-center py-4"
      >
        {{ notes.length === 0 ? 'Заметок пока нет' : 'Ничего не найдено' }}
      </p>
    </div>
  </div>
</template>
