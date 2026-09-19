import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Конфигурация Vite для проекта «Ежедневник»
export default defineConfig({
  plugins: [vue()],
  base: '/ezhednevnik/', // ← имя репозитория на GitHub
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})