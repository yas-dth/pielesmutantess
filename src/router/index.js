import { createRouter, createWebHistory } from 'vue-router'
import Pasarela from '../pages/Pasarela.vue'
import Estudio from '../pages/Estudio.vue'
import Backstage from '../pages/Backstage.vue'
import About from '../pages/About.vue'

const routes = [
  { path: '/', component: Pasarela },
  { path: '/estudio', component: Estudio },
  { path: '/backstage', component: Backstage },
  { path: '/about', component: About }

]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
export default router
