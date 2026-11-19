<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { getExercisesByType } from '@/data/exercises'
import { useTimer } from '@/composables/useTimer'
import { useBeep, unlockAudio  } from '@/composables/useBeep'

const props = defineProps({
  // Тип усталости: 'eyes' / 'spine' / 'head'
  type: {
    type: String,
    required: true
  },
  // Длительность отдыха в минутах (1, 3 или 5): одно упражнение = одна минута
  duration: {
    type: Number,
    required: true
  }
})

// Таймер текущего упражнения (значение сбрасывается из данных упражнения)
const timer = useTimer(60)

// Очередь упражнений, текущая позиция и признак завершения
const program = ref([])
const currentIndex = ref(0)
const isAllDone = ref(false)

// Перемешивание массива по алгоритму Фишера-Йетса
function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

// Формируем очередь: все упражнения типа, перемешанные, первые N (N = минуты).
// Если упражнений меньше — берём сколько есть
function buildProgram() {
  return shuffle(getExercisesByType(props.type)).slice(0, props.duration)
}

// Звуковой сигнал берём из общего composable
const { playBeep } = useBeep()

// Запуск (или перезапуск) программы с первого упражнения
function startProgram() {
  unlockAudio()
  program.value = buildProgram()
  currentIndex.value = 0
  isAllDone.value = false

  if (program.value.length === 0) {
    return
  }

  timer.reset(program.value[0].duration)
  timer.start()
}

onMounted(startProgram)


// Переход к упражнению по индексу: сбрасываем таймер на его длительность и запускаем
function goToExercise(index) {
  unlockAudio()
  currentIndex.value = index
  timer.reset(program.value[index].duration)
  timer.start()
}

function prevExercise() {
  if (currentIndex.value > 0) {
    goToExercise(currentIndex.value - 1)
  }
}

function nextExercise() {
  if (currentIndex.value < program.value.length - 1) {
    goToExercise(currentIndex.value + 1)
  }
}


// Время упражнения вышло — сигнал и переход к следующему (или финиш)
watch(
  () => timer.isFinished.value,
  (finished) => {
    if (!finished) {
      return
    }

    playBeep()

    if (currentIndex.value < program.value.length - 1) {
      currentIndex.value += 1
      timer.reset(program.value[currentIndex.value].duration)
      timer.start()
    } else {
      isAllDone.value = true
    }
  }
)

const currentExercise = computed(() => program.value[currentIndex.value] || null)

// DotLottieVue принимает JSON-строку, а в данных лежит объект — превращаем в строку.
// Если файла анимации нет (null) — показываем заглушку
const animationData = computed(() => {
  const animation = currentExercise.value ? currentExercise.value.animation : null
  return animation ? JSON.stringify(animation) : null
})

// Общая длительность программы и уже пройденная часть (в секундах)
const totalSeconds = computed(() =>
  program.value.reduce((sum, item) => sum + item.duration, 0)
)

const completedSeconds = computed(() =>
  program.value.slice(0, currentIndex.value).reduce((sum, item) => sum + item.duration, 0)
)

// Общий прогресс в процентах: плавно растёт по мере прохождения упражнений
const progressPercent = computed(() => {
  if (isAllDone.value) {
    return 100
  }
  if (!currentExercise.value || totalSeconds.value === 0) {
    return 0
  }
  const elapsed = currentExercise.value.duration - timer.timeLeft.value
  const percent = ((completedSeconds.value + elapsed) / totalSeconds.value) * 100
  return Math.min(100, Math.round(percent))
})

// Время упражнения в формате ММ:СС
const formattedTime = computed(() => {
  const minutes = Math.floor(timer.timeLeft.value / 60)
  const seconds = timer.timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})


</script>

<template>
  <div class="flex flex-col items-center gap-5 text-center py-6">
    <!-- Нет упражнений для выбранного типа -->
    <template v-if="program.length === 0">
      <p class="text-sm text-text-light/70 dark:text-text-dark/70">
        Для выбранного типа пока нет упражнений.
      </p>
      <router-link
        to="/tasks"
        class="px-6 py-2 rounded-button bg-accent text-white text-sm font-medium hover:opacity-90 transition"
      >
        Вернуться к задачам
      </router-link>
    </template>

    <!-- Все упражнения выполнены -->
    <template v-else-if="isAllDone">
      <div class="text-5xl" aria-hidden="true">🎉</div>
      <h3 class="text-xl font-semibold">Готово! Ты отдохнул</h3>

      <div class="w-full max-w-xs h-3 rounded-full bg-card-light dark:bg-card-dark overflow-hidden">
        <div class="h-full w-full bg-accent"></div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <router-link
          to="/tasks"
          class="flex-1 px-6 py-2 rounded-button bg-accent text-white text-sm font-medium
                 hover:opacity-90 transition"
        >
          Вернуться к задачам
        </router-link>
        <button
          type="button"
          class="flex-1 px-6 py-2 rounded-button border border-gray-300 dark:border-gray-600
                 text-sm font-medium hover:bg-bg-light dark:hover:bg-bg-dark transition"
          @click="startProgram"
        >
          Начать заново
        </button>
      </div>
    </template>

    <!-- Идёт упражнение -->
    <template v-else>
      <!-- Lottie-анимация упражнения или заглушка, если файла нет -->
      <DotLottieVue
        v-if="animationData"
        :key="currentExercise.id"  
        :data="animationData"
        autoplay
        loop
        style="width: 250px; height: 250px; margin: 0 auto;"
      />
      <div
        v-else
        class="w-[250px] h-[250px] mx-auto flex items-center justify-center rounded-card
               bg-card-light dark:bg-card-dark text-sm text-text-light/50 dark:text-text-dark/50"
      >
        Анимация не найдена
      </div>

      <div class="space-y-1">
        <p class="text-xs text-text-light/50 dark:text-text-dark/50">
          Упражнение {{ currentIndex + 1 }} из {{ program.length }}
        </p>
        <h3 class="text-lg font-semibold">{{ currentExercise.title }}</h3>
      </div>

      <!-- Таймер текущего упражнения -->
      <p class="text-5xl font-semibold tabular-nums text-accent">{{ formattedTime }}</p>

      
      <!-- Общий прогресс-бар с кнопками «предыдущее / следующее упражнение» -->
      <div class="w-full max-w-xs space-y-1">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-button
                   bg-card-light dark:bg-card-dark text-sm md:text-base hover:text-accent transition
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-inherit"
            aria-label="Предыдущее упражнение"
            :disabled="currentIndex === 0"
            @click="prevExercise"
          >
            ←
          </button>

          <div class="flex-1 h-3 rounded-full bg-card-light dark:bg-card-dark overflow-hidden">
            <div
              class="h-full bg-accent transition-all duration-500"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>

          <button
            type="button"
            class="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-button
                   bg-card-light dark:bg-card-dark text-sm md:text-base hover:text-accent transition
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-inherit"
            aria-label="Следующее упражнение"
            :disabled="currentIndex === program.length - 1"
            @click="nextExercise"
          >
            →
          </button>
        </div>
        <p class="text-xs text-text-light/50 dark:text-text-dark/50">{{ progressPercent }}%</p>
      </div>

    </template>
  </div>
</template>
