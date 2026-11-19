// База упражнений для вкладки «Отдых» (Lottie-анимации).
// Файлы анимаций лежат в src/assets/animations/*.json и подхватываются автоматически.
// Если файла для упражнения ещё нет — animation будет null, и компонент покажет заглушку.

// Автоматический импорт всех JSON-анимаций из папки
const animationModules = import.meta.glob('@/assets/animations/*.json', { eager: true })

// Ищем анимацию по имени файла (например, 'eye-circle' → eye-circle.json)
function getAnimation(name) {
  const key = Object.keys(animationModules).find((k) => k.includes(`${name}.json`))
  return key ? animationModules[key].default : null
}

// Поля упражнения:
export const exercises = [
  // Глаза 
  { id: 1, title: 'Круговые движения', type: 'eyes', duration: 60, animation: getAnimation('eye-circle') },
  { id: 2, title: 'Восьмёрка', type: 'eyes', duration: 60, animation: getAnimation('eye-figure8') },
  { id: 3, title: 'Зигзаг', type: 'eyes', duration: 60, animation: getAnimation('eye-zigzag') },
  { id: 4, title: 'Спираль', type: 'eyes', duration: 60, animation: getAnimation('eye-spiral') },
  { id: 5, title: 'Моргание', type: 'eyes', duration: 60, animation: getAnimation('eye-blink') },

  // Спина
  { id: 6, title: 'Потягивание вверх', type: 'spine', duration: 60, animation: getAnimation('spine-stretch') },
  { id: 7, title: 'Наклон в сторону', type: 'spine', duration: 60, animation: getAnimation('spine-side') },
  { id: 203, title: 'Поза кобры', type: 'spine', duration: 60, animation: getAnimation('spine-cobra') },
  { id: 9, title: 'Наклон вперёд', type: 'spine', duration: 60, animation: getAnimation('spine-forward') },
  { id: 10, title: 'Мостик', type: 'spine', duration: 60, animation: getAnimation('spine-bridge') },

  // Голова
  { id: 11, title: 'Кивки', type: 'head', duration: 60, animation: getAnimation('head-nod') },
  { id: 12, title: 'Повороты', type: 'head', duration: 60, animation: getAnimation('head-turn') },
  { id: 13, title: 'Круговые вращения', type: 'head', duration: 60, animation: getAnimation('head-roll') },
  { id: 14, title: 'Наклон к плечу', type: 'head', duration: 60, animation: getAnimation('head-tilt') },
  { id: 15, title: 'Растяжка шеи', type: 'head', duration: 60, animation: getAnimation('head-stretch') }
]

// Возвращает все упражнения выбранного типа
export function getExercisesByType(type) {
  return exercises.filter((ex) => ex.type === type)
}