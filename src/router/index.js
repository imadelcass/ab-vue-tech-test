import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import EmailVerificate from '../views/EmailVerificate.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/email-verificate',
      name: 'email-verificate',
      component: EmailVerificate
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  await authStore.init()

  if (to.name == 'home' && !authStore.user?.emailVerified) {
    next({ name: 'login' })
  } else if (to.name != 'home' && authStore.user?.emailVerified) {
    next({ name: 'home' })
  } else if (to.name == 'email-verificate' && authStore.user?.emailVerified) {
    next({ name: 'home' })
  } else if (to.name == 'email-verificate' && !authStore.user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
