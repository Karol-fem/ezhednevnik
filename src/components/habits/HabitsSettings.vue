<script setup>
import { ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useHabitsLogs } from '@/composables/useHabitsLogs'

// Включены ли привычки в принципе — если выключено, блок в календаре не показывается
const habitsEnabled = useLocalStorage('habitsEnabled', true)

// Список привычек: { id, name }
const habits = useLocalStorage('habits', [])

const newHabitName = ref('')
const editingId = ref(null)
const editingName = ref('')

function toggleHabitsEnabled() {
  habitsEnabled.value = !habitsEnabled.value
}

function addHabit() {
  const name = newHabitName.value.trim()
  if (!name) {
    return
  }
  habits.value = [...habits.value, { id: Date.now(), name }]
  newHabitName.value = ''
}

function startEdit(habit) {
  editingId.value = habit.id
  editingName.value = habit.name
}

function saveEdit() {
  const name = editingName.value.trim()
  if (!name) {
    cancelEdit()
    return
  }
  habits.value = habits.value.map((h) =>
    h.id === editingId.value ? { ...h, name } : h
  )
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}

function deleteHabit(id) {
  habits.value = habits.value.filter((h) => h.id !== id)
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4">
    <!-- Переключатель отображения привычек -->
    <div class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm flex items-center justify-between">
      <span class="text-sm font-medium">Показывать привычки в календаре</span>
      <button
        type="button"
        class="w-12 h-7 rounded-full relative transition-colors"
        :class="habitsEnabled ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'"
        role="switch"
        :aria-checked="habitsEnabled"
        @click="toggleHabitsEnabled"
      >
        <span
          class="absolute top-1 w-5 h-5 rounded-full bg-white transition-all"
          :class="habitsEnabled ? 'left-6' : 'left-1'"
        ></span>
      </button>
    </div>

    <!-- Подсказка -->
    <p class="text-xs text-text-light/60 dark:text-text-dark/60 bg-accent/10 text-accent rounded-button px-3 py-2">
      💡 Лучше внедрять 1–3 привычки одновременно
    </p>

    <!-- Добавление новой привычки -->
    <form class="flex gap-2" @submit.prevent="addHabit">
      <input
        v-model="newHabitName"
        type="text"
        placeholder="Например, пить воду"
        class="flex-1 rounded-button border border-gray-300 dark:border-gray-600
               bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-accent"
      >
      <button
        type="submit"
        class="px-4 rounded-button bg-accent text-white text-sm font-medium hover:opacity-90 transition"
      >
        Добавить
      </button>
    </form>

    <!-- Список привычек -->
    <div class="space-y-2">
      <div
        v-for="habit in habits"
        :key="habit.id"
        class="bg-card-light dark:bg-card-dark rounded-card px-3 py-2 shadow-sm flex items-center gap-2"
      >
        <template v-if="editingId === habit.id">
          <input
            v-model="editingName"
            type="text"
            class="flex-1 rounded-button border border-gray-300 dark:border-gray-600
                   bg-bg-light dark:bg-bg-dark px-2 py-1 text-sm
                   focus:outline-none focus:ring-2 focus:ring-accent"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
          >
          <button type="button" class="text-accent text-sm font-medium" @click="saveEdit">
            Сохранить
          </button>
          <button type="button" class="text-text-light/50 dark:text-text-dark/50 text-sm" @click="cancelEdit">
            Отмена
          </button>
        </template>
        <template v-else>
          <span class="flex-1 text-sm">{{ habit.name }}</span>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-button hover:bg-bg-light dark:hover:bg-bg-dark transition"
            aria-label="Редактировать привычку"
            @click="startEdit(habit)"
          >
            ✏️
          </button>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-button hover:bg-bg-light dark:hover:bg-bg-dark transition"
            aria-label="Удалить привычку"
            @click="deleteHabit(habit.id)"
          >
            🗑️
          </button>
        </template>
      </div>

      <p
        v-if="habits.length === 0"
        class="text-xs text-text-light/40 dark:text-text-dark/40 text-center py-4"
      >
        Привычек пока нет — добавьте первую выше
      </p>
    </div>
  </div>
</template>
