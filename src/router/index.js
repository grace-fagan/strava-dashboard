import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StravaRedirect from "../views/StravaRedirect.vue"
import YourActivities from "../views/YourActivities.vue"

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
