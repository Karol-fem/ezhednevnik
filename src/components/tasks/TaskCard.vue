<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

// Соответствие значения цвета классу фоновой полосы
const colorClasses = {
  study: 'bg-study',
  home: 'bg-home',
  rest: 'bg-rest',
  important: 'bg-important'
}

function handleToggle() {
  emit('toggle', props.task.id)
}

function handleEdit() {
  emit('edit', props.task)
}

function handleDelete() {
  emit('delete', props.task.id)
}
</script>

<template>
  <div
    class="relative flex items-center gap-3 rounded-card bg-card-light dark:bg-card-dark
           shadow-sm overflow-hidden pl-3 pr-2 py-2 transition"
    :class="task.done ? 'opacity-50' : ''"
  >
    <!-- Цветная полоса-метка задачи -->
    <span
      class="absolute left-0 top-0 bottom-0 w-1.5"
      :class="colorClasses[task.color] || 'bg-accent'"
      aria-hidden="true"
    ></span>

    <!-- Чекбокс выполнения -->
    <input
      type="checkbox"
      class="w-5 h-5 accent-accent shrink-0 cursor-pointer"
      :checked="task.done"
      @change="handleToggle"
    >

    <!-- Название и время -->
    <div class="flex-1 min-w-0">
      <p
        class="text-sm font-medium truncate"
        :class="task.done ? 'line-through' : ''"
      >
        {{ task.title }}
      </p>
      <p v-if="task.time" class="text-xs text-text-light/60 dark:text-text-dark/60">
        {{ task.time }}
      </p>
    </div>

    <!-- Действия: редактировать / удалить -->
    <div class="flex items-center gap-1 shrink-0">
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-button hover:bg-bg-light dark:hover:bg-bg-dark transition"
        aria-label="Редактировать задачу"
        @click="handleEdit"
      >
        <span aria-hidden="true">✏️</span>
      </button>
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-button hover:bg-bg-light dark:hover:bg-bg-dark transition"
        aria-label="Удалить задачу"
        @click="handleDelete"
      >
        <span aria-hidden="true">🗑️</span>
      </button>
    </div>
  </div>
</template>