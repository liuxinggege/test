/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-04 10:03:27
 * @LastEditTime: 2019-06-04 10:03:27
 * @LastEditors: your name
 */
declare var require: any
import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '../views/layout/Layout.vue';

let _import = (file: string) => {
  let a = require('@/views/' + file + '.vue')
  return a.default
}
Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'hello',
    hidden: true,
    children: [
      {
        path: 'hello',
        name: 'hello',
        component: _import('hello'),
        meta: { title: '欢迎', icon: 'hello', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: 'selfInfo',
    hidden: true,
    children: [
      {
        path: 'selfInfo',
        component: _import('selfInfo'),
        name: 'selfInfo',
        meta: { title: '个人信息', icon: 'selfInfo', noCache: true }
      }
    ]
  },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/500', component: _import('errorPage/401'), hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: (to, from, savedPosition) => {
    return { x: 0, y: 0 }
  },
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // { path: '*', redirect: '/404', hidden: true },

]
