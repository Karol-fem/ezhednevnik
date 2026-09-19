import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
 
// Конфигурация Vite для проекта «Ежедневник»
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Алиас @ указывает на папку src для удобных импортов
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})