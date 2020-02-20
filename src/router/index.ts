import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
Vue.use(VueRouter)

import {appConstants} from '../AppConstants'
const routes = [
  {
    path: '/',
    name: appConstants.APP_NAME,
    component: Home
  },
  {
    path: '/about',
    name: '关于',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue'),
  }
]

const router = new VueRouter({
  routes
})

export default router
