<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const props = defineProps({
  // Управляется родителем (FocusTimer): играть звук сейчас или нет
  playing: {
    type: Boolean,
    default: false
  }
})

// Список доступных звуков. Файлы должны лежать в public/sounds/
// (rain.mp3, cafe.mp3, forest.mp3). «Тишина» — без источника.
const sounds = [
  { value: 'rain', label: 'Дождь', icon: '🌧️', src: '/sounds/rain.mp3' },
  { value: 'cafe', label: 'Кафе', icon: '☕', src: '/sounds/cafe.mp3' },
  { value: 'forest', label: 'Лес', icon: '🌲', src: '/sounds/forest.mp3' },
  { value: 'silence', label: 'Тишина', icon: '🔇', src: null }
]

// Выбранный звук и громкость сохраняются в localStorage
const selectedSound = useLocalStorage('focusSound', 'silence')
const volume = useLocalStorage('focusVolume', 50)

const audioRef = ref(null)

function findSound(value) {
  return sounds.find((s) => s.value === value) || sounds[sounds.length - 1]
}

function stopCurrent() {
  if (audioRef.value) {
    audioRef.value.pause()
  }
}

function playCurrent() {
  const sound = findSound(selectedSound.value)

  // Для «Тишины» источника нет — просто ничего не воспроизводим
  if (!sound.src || !audioRef.value) {
    stopCurrent()
    return
  }

  if (!audioRef.value.src.endsWith(sound.src)) {
    audioRef.value.src = sound.src
  }

  audioRef.value.loop = true
  audioRef.value.volume = volume.value / 100
  audioRef.value.play().catch(() => {
    // Автовоспроизведение может быть заблокировано браузером до взаимодействия пользователя
  })
}

function selectSound(value) {
  selectedSound.value = value
}

// При смене звука — перезапускаем воспроизведение, если оно активно
watch(selectedSound, () => {
  if (props.playing) {
    playCurrent()
  } else {
    stopCurrent()
  }
})

// При смене статуса "играть/не играть" от родителя
watch(
  () => props.playing,
  (isPlaying) => {
    if (isPlaying) {
      playCurrent()
    } else {
      stopCurrent()
    }
  }
)

// Изменение громкости применяется сразу
watch(volume, (value) => {
  if (audioRef.value) {
    audioRef.value.volume = value / 100
  }
})

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
  if (props.playing) {
    playCurrent()
  }
})

// Останавливаем звук при уничтожении компонента
onUnmounted(() => {
  stopCurrent()
})
</script>

<template>
  <div class="bg-card-light dark:bg-card-dark rounded-card p-4 shadow-sm space-y-3">
    <h4 class="text-sm font-medium">Белый шум</h4>

    <!-- Кнопки выбора звука -->
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="sound in sounds"
        :key="sound.value"
        type="button"
        class="flex flex-col items-center gap-1 py-2 rounded-button text-xs transition"
        :class="selectedSound === sound.value
          ? 'bg-accent text-white'
          : 'bg-bg-light dark:bg-bg-dark hover:opacity-80'"
        @click="selectSound(sound.value)"
      >
        <span class="text-lg" aria-hidden="true">{{ sound.icon }}</span>
        <span>{{ sound.label }}</span>
      </button>
    </div>

    <!-- Регулятор громкости -->
    <div class="flex items-center gap-2">
      <span class="text-xs" aria-hidden="true">🔈</span>
      <input
        v-model.number="volume"
        type="range"
        min="0"
        max="100"
        class="flex-1 accent-accent"
        aria-label="Громкость звука"
      >
      <span class="text-xs w-8 text-right">{{ volume }}%</span>
    </div>

    <!-- Скрытый аудио-элемент для проигрывания выбранного звука -->
    <audio ref="audioRef"></audio>
  </div>
</template>