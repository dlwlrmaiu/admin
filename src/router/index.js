import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index'
import Home from '@/views/home/index'
import Users from '@/views/users/index'

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
    redirect: '/users',
    component: Home,
    children: [
      {
        name: 'users',
        path: 'users',
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  routes,
})

export default router
