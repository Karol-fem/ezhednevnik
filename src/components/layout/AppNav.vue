<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Список вкладок навигации
const navItems = [
  { path: '/tasks', label: 'Задачи', icon: '📝' },
  { path: '/focus', label: 'Фокус', icon: '🎯' },
  { path: '/rest', label: 'Отдых', icon: '🌿' },
  { path: '/spend', label: 'Траты', icon: '💰' }
]

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <!--
    На телефоне: фиксированная панель внизу экрана.
    На десктопе: обычная панель сверху (под шапкой), не зафиксированная.
  -->
  <nav
    class="fixed bottom-0 left-0 right-0 z-20
           md:static md:bottom-auto md:left-auto md:right-auto
           bg-card-light dark:bg-card-dark
           border-t border-gray-200 dark:border-gray-700
           md:border-t-0 md:border-b
           transition-colors"
  >
    <div
      class="max-w-6xl mx-auto px-2 md:px-4
             flex justify-around md:justify-start md:gap-2
             h-16 md:h-12 items-center"
    >
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex md:inline-flex flex-col md:flex-row items-center md:gap-2
               justify-center px-3 py-1 md:py-2 rounded-button
               text-xs md:text-sm font-medium transition-colors"
        :class="isActive(item.path)
          ? 'text-accent'
          : 'text-text-light/60 dark:text-text-dark/60 hover:text-accent'"
      >
        <span class="text-xl md:text-base" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>