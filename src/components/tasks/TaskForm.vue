<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // Если передана задача — форма работает в режиме редактирования
  task: {
    type: Object,
    default: null
  },
  // Дата по умолчанию для новой задачи (например, день недели из календаря)
  defaultDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save', 'cancel'])

// Доступные цвета-метки задачи
const colorOptions = [
  { value: 'study', label: 'Учёба', class: 'bg-study' },
  { value: 'home', label: 'Дом', class: 'bg-home' },
  { value: 'rest', label: 'Отдых', class: 'bg-rest' },
  { value: 'important', label: 'Важное', class: 'bg-important' }
]

const title = ref('')
const date = ref(props.defaultDate)
const time = ref('')
const color = ref('study')

// Если пришла задача для редактирования — заполняем поля её данными
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title
      date.value = newTask.date
      time.value = newTask.time || ''
      color.value = newTask.color
    } else {
      title.value = ''
      date.value = props.defaultDate
      time.value = ''
      color.value = 'study'
    }
  },
  { immediate: true }
)

function handleSave() {
  // Название задачи обязательно
  if (!title.value.trim()) {
    return
  }

  emit('save', {
    id: props.task ? props.task.id : Date.now(),
    title: title.value.trim(),
    date: date.value,
    time: time.value || null,
    color: color.value,
    done: props.task ? props.task.done : false
  })
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form
    class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-4"
    @submit.prevent="handleSave"
  >
    <!-- Название задачи -->
    <div>
      <label class="block text-sm font-medium mb-1" for="task-title">Название</label>
      <input
        id="task-title"
        v-model="title"
        type="text"
        required
        placeholder="Например, домашняя работа по математике"
        class="w-full rounded-button border border-gray-300 dark:border-gray-600
               bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-accent"
      >
    </div>

    <!-- Дата и время -->
    <div class="flex gap-3">
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1" for="task-date">Дата</label>
        <input
          id="task-date"
          v-model="date"
          type="date"
          required
          class="w-full rounded-button border border-gray-300 dark:border-gray-600
                 bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-accent"
        >
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1" for="task-time">Время (необязательно)</label>
        <input
          id="task-time"
          v-model="time"
          type="time"
          class="w-full rounded-button border border-gray-300 dark:border-gray-600
                 bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-accent"
        >
      </div>
    </div>

    <!-- Выбор цвета-метки -->
    <div>
      <span class="block text-sm font-medium mb-2">Метка</span>
      <div class="flex gap-3">
        <button
          v-for="option in colorOptions"
          :key="option.value"
          type="button"
          class="flex flex-col items-center gap-1 px-2 py-1 rounded-button transition"
          :class="color === option.value ? 'ring-2 ring-accent' : 'opacity-70 hover:opacity-100'"
          @click="color = option.value"
        >
          <span class="w-6 h-6 rounded-full" :class="option.class" aria-hidden="true"></span>
          <span class="text-xs">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        class="flex-1 rounded-button bg-accent text-white py-2 text-sm font-medium
               hover:opacity-90 transition"
      >
        Сохранить
      </button>
      <button
        type="button"
        class="flex-1 rounded-button border border-gray-300 dark:border-gray-600
               py-2 text-sm font-medium hover:bg-bg-light dark:hover:bg-bg-dark transition"
        @click="handleCancel"
      >
        Отмена
      </button>
    </div>
  </form>
</template>