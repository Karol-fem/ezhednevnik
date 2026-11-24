<template>
  <!--
    Футер приложения.
    Снизу большой отступ на телефоне (pb-20), чтобы текст не прятался
    под фиксированной нижней панелью навигации.
  -->
  <footer class="mt-6 px-4 pb-20 md:pb-6">
    <div class="max-w-6xl mx-auto flex flex-col items-center gap-3">
      <!-- Тонкая разделительная линия с мягким градиентом -->
      <div
        class="h-px w-full max-w-md bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden="true"
      ></div>

      <p class="text-xs tracking-wide text-text-light/50 dark:text-text-dark/50">
        © Mzl, 2026
      </p>
    </div>
  </footer>
</template>
