import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import StravaRedirect from "../pages/StravaRedirect.vue"
import YourActivities from "../pages/YourActivities.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/redirect/:info',
    name: 'redirect',
    component: StravaRedirect
  },
  {
    path: '/youractivities',
    name: 'activities',
    component: YourActivities
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
