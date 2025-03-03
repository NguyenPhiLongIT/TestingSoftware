import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/Auth/Login.vue')
  },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Auth/Login.vue')
  },
  {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/Auth/Register.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../views/Upload.vue'),
  },
  ],
})

export default router
