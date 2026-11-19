<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import NotesList from '@/components/notes/NotesList.vue'
import NoteEditor from '@/components/notes/NoteEditor.vue'

// Все заметки хранятся одним массивом: { id, title, content, updatedAt }
const notes = useLocalStorage('notes', [])

const selectedId = ref(notes.value.length ? notes.value[0].id : null)

const selectedNote = computed(() => notes.value.find((n) => n.id === selectedId.value) || null)

function createNote() {
  const newNote = {
    id: Date.now(),
    title: '',
    content: '',
    updatedAt: Date.now()
  }
  notes.value = [newNote, ...notes.value]
  selectedId.value = newNote.id
}

function selectNote(id) {
  selectedId.value = id
}

function updateNote(updated) {
  notes.value = notes.value.map((n) => (n.id === updated.id ? updated : n))
}

function deleteNote(id) {
  notes.value = notes.value.filter((n) => n.id !== id)
  if (selectedId.value === id) {
    selectedId.value = notes.value.length ? notes.value[0].id : null
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Заметки</h1>

    <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
      <!-- Список заметок с поиском и кнопкой создания -->
      <NotesList
        :notes="notes"
        :selected-id="selectedId"
        @select="selectNote"
        @create="createNote"
        @delete="deleteNote"
      />

      <!-- Редактор выбранной заметки -->
      <NoteEditor :note="selectedNote" @update="updateNote" />
    </div>
  </div>
</template>
