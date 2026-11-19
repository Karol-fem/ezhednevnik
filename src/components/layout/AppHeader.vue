<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import MonthMiniCalendar from '@/components/calendar/MonthMiniCalendar.vue'

const { theme, toggleTheme } = useTheme()
const router = useRouter()
const showCalendar = ref(false)

function toggleCalendar() {
  showCalendar.value = !showCalendar.value
}

function goToDate(iso) {
  router.push({ path: '/tasks', query: { date: iso } })
  showCalendar.value = false
}

</script>

<template>
  <header
    class="sticky top-0 z-20 bg-card-light dark:bg-card-dark shadow-sm transition-colors"
  >
    <div class="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            <!-- Логотип — кликабельный, открывает мини-календарь -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-2 hover:opacity-80 transition"
          aria-label="Открыть календарь"
          @click="toggleCalendar"
        >
          <span class="text-xl md:text-2xl" aria-hidden="true">📅</span>
          <span class="font-semibold text-base md:text-lg tracking-tight">
            Ежедневник
          </span>
        </button>

        <!-- Выпадающий мини-календарь -->
        <div
          v-if="showCalendar"
          class="absolute top-full left-0 mt-2 z-30 w-screen max-w-xs md:w-auto md:max-w-none px-2 md:px-0"
        >
          <MonthMiniCalendar @select="goToDate" />
        </div>
      </div>

      <!-- Переключатель темы -->
      <button
        type="button"
        class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-button
               bg-bg-light dark:bg-bg-dark hover:opacity-80 transition-colors"
        :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
        @click="toggleTheme"
      >
        <span class="text-lg md:text-xl" aria-hidden="true">
          {{ theme === 'dark' ? '🌙' : '☀️' }}
        </span>
      </button>
    </div>
  </header>
</template>