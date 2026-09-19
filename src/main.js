import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Подключение стилей Tailwind CSS
import './assets/main.css'

// Создание и настройка приложения
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')