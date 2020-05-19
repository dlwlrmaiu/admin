import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index'
import Home from '@/views/home/index'
import Users from '@/views/users/index'
import { Message } from 'element-ui'

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
    component: Home,
    children: [
      {
        name: 'users',
        path: 'users',
        component: Users
      },
      {
        name: 'right',
        path: 'rights',
        component: () => import('@/views/rights/right/index')
      },
      {
        name: 'role',
        path: 'roles',
        component: () => import('@/views/rights/role/index')
      }
    ]
  }
]
const router = new VueRouter({
  routes,
})

// 在路由配置生效之前 统一判断token
router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    // 要去的是登录页,无需判断token
    next()
  } else {
    const token = localStorage.getItem('token')
    if(!token) {
      // token为空跳转到登录页
      Message.warning('登录超时,请重新登录')
      router.push('/login')
      return
    }
    next()
  }
})

export default router
