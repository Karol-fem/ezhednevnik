import { ref, watch } from 'vue'

const stored = localStorage.getItem('visibleNavTabs')
const visibleNavTabs = ref(
  stored ? JSON.parse(stored) : ['tasks', 'focus', 'rest']
)

watch(
  visibleNavTabs,
  (newValue) => {
    localStorage.setItem('visibleNavTabs', JSON.stringify(newValue))
  },
  { deep: true }
)

export function useNavTabs() {
  return visibleNavTabs
}