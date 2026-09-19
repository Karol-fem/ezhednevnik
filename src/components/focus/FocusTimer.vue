<script setup>
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useTimer } from '@/composables/useTimer'
import TimerCircle from './TimerCircle.vue'
import SoundPicker from './SoundPicker.vue'

// Список задач берём из localStorage (заполняется на вкладке «Задачи»)
const tasks = useLocalStorage('tasks', [])

// Доступные варианты длительности рабочей фазы (минуты)
const durationOptions = [15, 25, 45]

// Соответствующая длительность отдыха для каждой рабочей длительности
const breakByWork = { 15: 3, 25: 5, 45: 10 }

// Выбранная задача и длительность сохраняются в localStorage
const workMinutes = useLocalStorage('focusWorkMinutes', 25)
const selectedTaskId = useLocalStorage('focusTaskId', '')
const customTaskName = useLocalStorage('focusCustomTask', '')

// Журнал завершённых помодоро по дате: { 'YYYY-MM-DD': количество }
const pomodoroLog = useLocalStorage('pomodoroLog', {})

// Текущий режим: работа или отдых
const mode = ref('work')

function secondsFor(currentMode, minutes) {
  if (currentMode === 'work') {
    return minutes * 60
  }
  return (breakByWork[minutes] || 5) * 60
}

// Таймер инициализируется с текущей рабочей длительностью
const timer = useTimer(secondsFor('work', workMinutes.value))

// Общая длительность текущей фазы (для кольца прогресса)
const totalSeconds = computed(() => secondsFor(mode.value, workMinutes.value))

// Название активной задачи: выбранная из списка или введённая вручную
const activeTaskLabel = computed(() => {
  if (customTaskName.value.trim()) {
    return customTaskName.value.trim()
  }
  const task = tasks.value.find((t) => String(t.id) === String(selectedTaskId.value))
  return task ? task.title : 'Без названия'
})

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

const todaysCount = computed(() => pomodoroLog.value[todayKey()] || 0)

// Смена длительности работы — обновляем таймер, только если он не запущен
function selectDuration(minutes) {
  workMinutes.value = minutes
  if (!timer.isRunning.value) {
    mode.value = 'work'
    timer.reset(secondsFor('work', minutes))
  }
}

function selectTask(id) {
  selectedTaskId.value = id
  customTaskName.value = ''
}

// Короткий звуковой сигнал через Web Audio API (без внешних файлов)
function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 880
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.4)
    oscillator.onended = () => ctx.close()
  } catch (error) {
    // Web Audio может быть недоступен — тихо игнорируем
  }
}

// При завершении рабочей фазы — звук и увеличение счётчика помодоро
watch(
  () => timer.isFinished.value,
  (finished) => {
    if (!finished) {
      return
    }
    playBeep()
    if (mode.value === 'work') {
      pomodoroLog.value = {
        ...pomodoroLog.value,
        [todayKey()]: todaysCount.value + 1
      }
    }
  }
)

function switchToBreak() {
  mode.value = 'break'
  timer.reset(secondsFor('break', workMinutes.value))
}

function switchToWork() {
  mode.value = 'work'
  timer.reset(secondsFor('work', workMinutes.value))
}

function handleReset() {
  timer.reset(secondsFor(mode.value, workMinutes.value))
}

// Показывать баннер-предложение, когда фаза завершена и таймер остановлен
const showSuggestion = computed(() => timer.isFinished.value && !timer.isRunning.value)
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start justify-center">
    <!-- Левая часть: круг с таймером -->
    <div class="flex flex-col items-center gap-4">
      <p class="text-sm font-medium text-text-light/70 dark:text-text-dark/70">
        {{ mode === 'work' ? '🎯 Фокус' : '☕ Отдых' }} · {{ activeTaskLabel }}
      </p>

      <TimerCircle :time-left="timer.timeLeft.value" :total-time="totalSeconds" />

      <!-- Баннер-предложение после завершения фазы -->
      <div
        v-if="showSuggestion"
        class="bg-accent/10 text-accent text-sm rounded-button px-4 py-2 flex items-center gap-3"
      >
        <span v-if="mode === 'work'">Время вышло! Перейти к отдыху?</span>
        <span v-else>Отдых окончен! Вернуться к работе?</span>
        <button
          type="button"
          class="font-semibold underline"
          @click="mode === 'work' ? switchToBreak() : switchToWork()"
        >
          {{ mode === 'work' ? 'К отдыху' : 'К работе' }}
        </button>
      </div>

      <!-- Управление таймером -->
      <div class="flex gap-3">
        <button
          type="button"
          class="px-5 py-2 rounded-button bg-accent text-white text-sm font-medium hover:opacity-90 transition"
          :disabled="timer.isRunning.value"
          @click="timer.start()"
        >
          Старт
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-button border border-gray-300 dark:border-gray-600 text-sm font-medium
                 hover:bg-bg-light dark:hover:bg-bg-dark transition"
          :disabled="!timer.isRunning.value"
          @click="timer.pause()"
        >
          Пауза
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-button border border-gray-300 dark:border-gray-600 text-sm font-medium
                 hover:bg-bg-light dark:hover:bg-bg-dark transition"
          @click="handleReset"
        >
          Сброс
        </button>
      </div>

      <!-- Счётчик завершённых помодоро -->
      <p class="text-xs text-text-light/60 dark:text-text-dark/60">
        Помодоро сегодня: <span class="font-semibold text-accent">{{ todaysCount }}</span>
      </p>
    </div>

    <!-- Правая часть: настройки -->
    <div class="w-full md:w-80 flex flex-col gap-4">
      <!-- Выбор задачи -->
      <div class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-2">
        <h4 class="text-sm font-medium">Задача</h4>
        <select
          class="w-full rounded-button border border-gray-300 dark:border-gray-600
                 bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm"
          :value="selectedTaskId"
          @change="selectTask($event.target.value)"
        >
          <option value="">— выбрать из списка —</option>
          <option v-for="task in tasks" :key="task.id" :value="task.id">
            {{ task.title }}
          </option>
        </select>
        <input
          v-model="customTaskName"
          type="text"
          placeholder="Или введите своё название"
          class="w-full rounded-button border border-gray-300 dark:border-gray-600
                 bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-accent"
        >
      </div>

      <!-- Выбор длительности -->
      <div class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-2">
        <h4 class="text-sm font-medium">Длительность работы</h4>
        <div class="flex gap-2">
          <button
            v-for="minutes in durationOptions"
            :key="minutes"
            type="button"
            class="flex-1 py-2 rounded-button text-sm font-medium transition"
            :class="workMinutes === minutes
              ? 'bg-accent text-white'
              : 'bg-bg-light dark:bg-bg-dark hover:opacity-80'"
            @click="selectDuration(minutes)"
          >
            {{ minutes }} мин
          </button>
        </div>
      </div>

      <!-- Белый шум -->
      <SoundPicker :playing="timer.isRunning.value" />
    </div>
  </div>
</template>