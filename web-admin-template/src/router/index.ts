import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/views/layout/index.vue'

Vue.use(Router)
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { hidden: true },
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/guide',
    component: Layout,
    // redirect: '/guide/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue'),
        name: 'Guide',
        meta: {
          title: 'guide',
          icon: 'guide',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    // redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/newCategory',
    component: Layout,
    // redirect: '/newCategory/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/newCategory/index.vue'),
        name: 'newCategory',
        meta: {
          title: 'newCategory',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/newCollect',
    component: Layout,
    // redirect: '/newCollect/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/newCollect/index.vue'),
        name: 'newCollect',
        meta: {
          title: 'newCollect',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/newMedia',
    component: Layout,
    // redirect: '/newMedia/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/newMedia/index.vue'),
        name: 'newMedia',
        meta: {
          title: 'newMedia',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/newView',
    component: Layout,
    // redirect: '/newView/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/newView/index.vue'),
        name: 'newView',
        meta: {
          title: 'newView',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/fsManage',
    component: Layout,
    name:"fsManage",
    redirect: '/fsManage/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/newView/index.vue'),
        name: 'newView',
        meta: {
          title: 'newView',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
