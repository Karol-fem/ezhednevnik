import { ref, watch } from 'vue'

// Глобальные refs — создаются один раз при первом импорте
const storedLogs = localStorage.getItem('habitLogs')
const habitLogs = ref(storedLogs ? JSON.parse(storedLogs) : {})

// Синхронизация с localStorage при любом изменении
watch(
  habitLogs,
  (newValue) => {
    localStorage.setItem('habitLogs', JSON.stringify(newValue))
  },
  { deep: true }
)

export function useHabitsLogs() {
  return habitLogs
}