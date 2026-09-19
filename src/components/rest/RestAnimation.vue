<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useTimer } from '@/composables/useTimer'

const props = defineProps({
  // Тип усталости: eyes / back / head
  type: {
    type: String,
    required: true
  },
  // Длительность отдыха в минутах: 1 / 5 / 10
  duration: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['done'])

// Тексты и описания упражнений для каждой комбинации тип + длительность
const exercises = {
  eyes: {
    1: { title: 'Правило 20-20-20', text: 'Посмотрите на предмет на расстоянии 20 футов (около 6 метров) в течение 20 секунд.', icon: '👁️' },
    5: { title: 'Пальминг и движение зрачками', text: 'Закройте глаза ладонями на 30 секунд, затем медленно двигайте взглядом по кругу, вверх-вниз и по диагонали.', icon: '👁️' },
    10: { title: 'Полная гимнастика для глаз', text: 'Выполните полный комплекс упражнений для глаз, а затем отдохните с закрытыми глазами в тишине.', icon: '👁️' }
  },
  back: {
    1: { title: 'Потянуться вверх', text: 'Встаньте, потянитесь руками вверх, затем сведите лопатки вместе и задержитесь на несколько секунд.', icon: '🧍' },
    5: { title: 'Наклоны и повороты', text: 'Сделайте плавные наклоны в стороны, повороты корпуса и разминку плеч по кругу.', icon: '🧍' },
    10: { title: 'Комплекс упражнений', text: 'Выполните комплекс из 5-6 упражнений: наклоны, повороты, растяжку шеи и плеч, вращения руками.', icon: '🧍' }
  },
  head: {
    1: { title: 'Глубокое дыхание', text: 'Сделайте 3 медленных глубоких вдоха и выдоха, концентрируясь на ощущениях в теле.', icon: '🧠' },
    5: { title: 'Дыхание 4-7-8', text: 'Вдох на 4 счёта, задержка на 7 счётов, выдох на 8 счётов. Повторите несколько раз, затем растяните шею.', icon: '🧠' },
    10: { title: 'Дыхание и релаксация', text: 'Подышите по схеме 4-7-8, затем выполните прогрессивную релаксацию мышц и не забудьте выпить воды.', icon: '🧠' }
  }
}

const currentExercise = computed(() => {
  const byType = exercises[props.type] || exercises.eyes
  return byType[props.duration] || byType[1]
})

// Таймер запускается автоматически при открытии экрана
const timer = useTimer(props.duration * 60)

onMounted(() => {
  timer.start()
})

onUnmounted(() => {
  timer.pause()
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timer.timeLeft.value / 60)
  const seconds = timer.timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

function handleDone() {
  emit('done')
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 text-center py-6">
    <!-- Анимированный элемент упражнения -->
    <div class="rest-animation">
      <span class="text-5xl" aria-hidden="true">{{ currentExercise.icon }}</span>
    </div>

    <div class="space-y-2 max-w-sm">
      <h3 class="text-lg font-semibold">{{ currentExercise.title }}</h3>
      <p class="text-sm text-text-light/70 dark:text-text-dark/70">{{ currentExercise.text }}</p>
    </div>

    <!-- Оставшееся время -->
    <p class="text-3xl font-semibold tabular-nums text-accent">{{ formattedTime }}</p>

    <!-- Кнопка завершения упражнения -->
    <button
      type="button"
      class="px-6 py-2 rounded-button bg-accent text-white text-sm font-medium hover:opacity-90 transition"
      @click="handleDone"
    >
      Готово
    </button>
  </div>
</template>

<style scoped>
/* Плавная "дышащая" анимация — круг мягко увеличивается и уменьшается */
.rest-animation {
  width: 140px;
  height: 140px;
  border-radius: 9999px;
  background-color: rgba(99, 102, 241, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>