/** @type {import('tailwindcss').Config} */
export default {
  // Переключение темы через класс "dark" на <html>
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Светлая тема
        'bg-light': '#F9FAFB',
        'card-light': '#FFFFFF',
        'text-light': '#111827',
        // Тёмная тема
        'bg-dark': '#111827',
        'card-dark': '#1F2937',
        'text-dark': '#F9FAFB',
        // Акцентный цвет (индиго)
        accent: '#6366F1',
        // Цвета-метки задач
        study: '#3B82F6',
        home: '#22C55E',
        rest: '#EAB308',
        important: '#EF4444'
      },
      fontFamily: {
        // Основной шрифт приложения
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        // Скругления по дизайну проекта
        card: '16px',
        button: '12px'
      },
      transitionDuration: {
        // Плавные анимации 200-300мс
        DEFAULT: '250ms'
      }
    }
  },
  plugins: []
}