import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      component: LoginView,
    },
  ],
})
const arrayUrl = ['/login']
router.beforeEach((to, from) => {
  const store = useUserStore()
  if (arrayUrl.includes(to.path)) {
    if (store.isLoggedIn()) {
      return '/' 
    }
    return true
  } else {
    if (store.isLoggedIn()) {
      return true 
    }
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
export default router
