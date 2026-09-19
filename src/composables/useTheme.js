import { watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'

/**
 * Composable для управления темой оформления (светлая/тёмная).
 * Хранит выбор в localStorage и переключает класс "dark" на <html>.
 *
 * @returns {{ theme: import('vue').Ref<string>, toggleTheme: Function, setTheme: Function }}
 */
export function useTheme() {
  // Значение темы хранится в localStorage под ключом "theme"
  const theme = useLocalStorage('theme', getPreferredTheme())

  // Применяем класс к <html> при изменении темы
  watch(
    theme,
    (newTheme) => {
      applyThemeClass(newTheme)
    },
    { immediate: true }
  )

  function applyThemeClass(value) {
    const root = document.documentElement
    if (value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function getPreferredTheme() {
    // Если пользователь ещё не выбирал тему — ориентируемся на системную настройку
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(value) {
    theme.value = value === 'dark' ? 'dark' : 'light'
  }

  return {
    theme,
    toggleTheme,
    setTheme
  }
}