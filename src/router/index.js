import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    // По умолчанию перенаправляем на вкладку "Задачи"
    path: '/',
    redirect: '/tasks'
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('@/views/TasksView.vue')
  },
  {
    path: '/focus',
    name: 'focus',
    component: () => import('@/views/FocusView.vue')
  },
  {
    path: '/rest',
    name: 'rest',
    component: () => import('@/views/RestView.vue')
  },
  {
    path: '/spend',
    name: 'spend',
    component: () => import('@/views/SpendView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router