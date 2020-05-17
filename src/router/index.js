import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index'
import Home from '@/views/home/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes,
})

export default router
