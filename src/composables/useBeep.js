// Общий звуковой сигнал для таймеров (Фокус и Отдых).
// Сигнал проигрывается из файла public/sounds/beep.wav через обычный Audio
// (так же, как белый шум), без Web Audio API.

// Аудио создаётся один раз в коде и не вставляется в DOM,
// поэтому <KeepAlive> и смена вкладок его не останавливают
const beepAudio = new Audio(`${import.meta.env.BASE_URL}/sounds/beep.wav`)
beepAudio.preload = 'auto'

/**
 * Разблокирует звук. Вызывать из обработчика клика (например, при старте упражнений):
 * некоторые браузеры разрешают воспроизведение только после действия пользователя.
 * Тихо запускает и сразу останавливает сигнал.
 */
export function unlockAudio() {
  try {
    beepAudio.muted = true
    const restore = () => {
      beepAudio.pause()
      beepAudio.currentTime = 0
      beepAudio.muted = false
    }
    const result = beepAudio.play()
    if (result && typeof result.then === 'function') {
      result.then(restore).catch(restore)
    } else {
      restore()
    }
  } catch (error) {
    beepAudio.muted = false
    console.warn('Не удалось разблокировать звук:', error)
  }
}

/**
 * Проигрывает короткий сигнал.
 * Параметры оставлены для совместимости со старыми вызовами, на звук не влияют.
 */
export function playBeep() {
  try {
    beepAudio.muted = false
    beepAudio.currentTime = 0
    const result = beepAudio.play()
    if (result && typeof result.catch === 'function') {
      result.catch((error) => {
        console.warn('Не удалось проиграть сигнал:', error)
      })
    }
  } catch (error) {
    console.warn('Не удалось проиграть сигнал:', error)
  }
}

// Удобная обёртка для использования в компонентах: const { playBeep } = useBeep()
export function useBeep() {
  return { playBeep }
}
