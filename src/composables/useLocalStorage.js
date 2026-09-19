import { ref, watch } from 'vue'

/**
 * Composable для хранения реактивного значения в localStorage.
 * Автоматически читает начальное значение из localStorage (если оно есть)
 * и сохраняет туда каждое изменение.
 *
 * @param {string} key - ключ в localStorage
 * @param {*} defaultValue - значение по умолчанию, если в localStorage ничего нет
 * @returns {import('vue').Ref} реактивная ссылка, синхронизированная с localStorage
 */
export function useLocalStorage(key, defaultValue) {
  // Пытаемся прочитать сохранённое значение
  const storedValue = localStorage.getItem(key)

  let initialValue = defaultValue
  if (storedValue !== null) {
    try {
      initialValue = JSON.parse(storedValue)
    } catch (error) {
      // Если данные повреждены — используем значение по умолчанию
      console.warn(`Не удалось разобрать значение localStorage для ключа "${key}"`, error)
      initialValue = defaultValue
    }
  }

  const data = ref(initialValue)

  // При любом изменении данных — сохраняем их в localStorage
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.warn(`Не удалось сохранить значение localStorage для ключа "${key}"`, error)
      }
    },
    { deep: true }
  )

  return data
}