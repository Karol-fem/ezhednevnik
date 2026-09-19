<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header
    class="sticky top-0 z-20 bg-card-light dark:bg-card-dark shadow-sm transition-colors"
  >
    <div class="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
      <!-- Логотип -->
      <div class="flex items-center gap-2">
        <span class="text-xl md:text-2xl" aria-hidden="true">📅</span>
        <span class="font-semibold text-base md:text-lg tracking-tight">
          Ежедневник
        </span>
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