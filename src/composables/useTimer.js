import { ref, onUnmounted } from 'vue'

/**
 * Composable для обратного отсчёта времени (используется в FocusTimer и QuickRest).
 *
 * @param {number} initialSeconds - начальное количество секунд для отсчёта
 * @returns {{
 *   timeLeft: import('vue').Ref<number>,
 *   isRunning: import('vue').Ref<boolean>,
 *   isFinished: import('vue').Ref<boolean>,
 *   start: Function,
 *   pause: Function,
 *   reset: Function
 * }}
 */
export function useTimer(initialSeconds) {
  const timeLeft = ref(initialSeconds)
  const isRunning = ref(false)
  const isFinished = ref(false)

  let intervalId = null

  function tick() {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    }

    if (timeLeft.value === 0) {
      stopInterval()
      isRunning.value = false
      isFinished.value = true
    }
  }

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function start() {
    // Если время уже закончилось — запуск не имеет смысла
    if (timeLeft.value <= 0 || isRunning.value) {
      return
    }

    isRunning.value = true
    isFinished.value = false
    intervalId = setInterval(tick, 1000)
  }

  function pause() {
    isRunning.value = false
    stopInterval()
  }

  function reset(newSeconds = initialSeconds) {
    pause()
    isFinished.value = false
    timeLeft.value = newSeconds
  }

  // Очищаем интервал при уничтожении компонента, чтобы не было утечек
  onUnmounted(() => {
    stopInterval()
  })

  return {
    timeLeft,
    isRunning,
    isFinished,
    start,
    pause,
    reset
  }
}