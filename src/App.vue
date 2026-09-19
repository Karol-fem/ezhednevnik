<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors">
    <!-- Шапка приложения с логотипом и переключателем темы -->
    <AppHeader />

    <!-- Основной контент текущей вкладки -->
    <main class="max-w-6xl mx-auto px-4 pb-24 md:pb-8 pt-4">
      <router-view />
    </main>

    <!-- Навигация: снизу на телефоне, сверху на десктопе (см. AppNav.vue) -->
    <AppNav />
  </div>
</template>