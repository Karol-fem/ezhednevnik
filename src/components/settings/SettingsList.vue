<script setup>
import { ref } from 'vue'
import { useNavTabs } from '@/composables/useNavTabs'

// Разделы, которые ведут на отдельные страницы
const linkedSections = [
  { key: 'tasks', label: 'Задачи', icon: '📅', path: '/tasks' },
  { key: 'focus', label: 'Фокус', icon: '🎯', path: '/focus' },
  { key: 'rest', label: 'Отдых', icon: '🌿', path: '/rest' },
  { key: 'spend', label: 'Траты', icon: '💰', path: '/spend' },
  { key: 'notes', label: 'Заметки', icon: '📝', path: '/notes' },
  { key: 'habits', label: 'Привычки', icon: '🔁', path: '/habits' }
]

// Все вкладки, которые можно разместить в главном меню
const allTabs = [
  { key: 'tasks', label: 'Задачи', icon: '📝' },
  { key: 'focus', label: 'Фокус', icon: '🎯' },
  { key: 'rest', label: 'Отдых', icon: '🌿' },
  { key: 'spend', label: 'Траты', icon: '💰' },
  { key: 'notes', label: 'Заметки', icon: '📝' },
  { key: 'habits', label: 'Привычки', icon: '🔁' }
]

// «Настройки» всегда занимают последнюю иконку меню, поэтому выбрать
// можно не больше 3 других вкладок (итого максимум 4 иконки в меню)
const MAX_VISIBLE = 3
const visibleTabs = useNavTabs()

const showIconsPanel = ref(false)

function toggleIconsPanel() {
  showIconsPanel.value = !showIconsPanel.value
}

function isSelected(key) {
  return visibleTabs.value.includes(key)
}

function toggleTab(key) {
  if (isSelected(key)) {
    visibleTabs.value = visibleTabs.value.filter((item) => item !== key)
    return
  }
  if (visibleTabs.value.length >= MAX_VISIBLE) {
    return
  }
  visibleTabs.value = [...visibleTabs.value, key]
}
</script>

<template>
  <div class="space-y-3 max-w-xl mx-auto">
    <!-- Раздел «Иконки в меню» — первый в списке, разворачивается прямо здесь -->
    <div class="bg-card-light dark:bg-card-dark rounded-card shadow-sm overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
        @click="toggleIconsPanel"
      >
        <span class="flex items-center gap-3">
          <span class="text-xl" aria-hidden="true">📱</span>
          Иконки в меню
        </span>
        <span class="text-text-light/40 dark:text-text-dark/40" aria-hidden="true">
          {{ showIconsPanel ? '︿' : '›' }}
        </span>
      </button>

      <div v-if="showIconsPanel" class="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <p class="text-xs text-text-light/60 dark:text-text-dark/60">
          Выбрано {{ visibleTabs.length }} из {{ MAX_VISIBLE }}. Настройки всегда остаются в меню.
        </p>

        <button
          v-for="tab in allTabs"
          :key="tab.key"
          type="button"
          class="w-full flex items-center justify-between px-3 py-2 rounded-button text-sm transition"
          :class="isSelected(tab.key)
            ? 'bg-accent/10 text-accent'
            : 'bg-bg-light dark:bg-bg-dark hover:opacity-80'"
          :disabled="!isSelected(tab.key) && visibleTabs.length >= MAX_VISIBLE"
          @click="toggleTab(tab.key)"
        >
          <span class="flex items-center gap-2">
            <span aria-hidden="true">{{ tab.icon }}</span>
            {{ tab.label }}
          </span>
          <span aria-hidden="true">{{ isSelected(tab.key) ? '✓' : '' }}</span>
        </button>
      </div>
    </div>

    <!-- Разделы со ссылками на отдельные страницы -->
    <router-link
      v-for="section in linkedSections"
      :key="section.key"
      :to="section.path"
      class="flex items-center justify-between bg-card-light dark:bg-card-dark rounded-card
             px-4 py-3 shadow-sm hover:opacity-80 transition"
    >
      <span class="flex items-center gap-3 text-sm font-medium">
        <span class="text-xl" aria-hidden="true">{{ section.icon }}</span>
        {{ section.label }}
      </span>
      <span class="text-text-light/40 dark:text-text-dark/40" aria-hidden="true">›</span>
    </router-link>
  </div>
</template>