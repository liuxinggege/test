import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
let documentTitle = "管理后台"

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${documentTitle}-${pageName}`
  }
  return `${documentTitle}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  //  确定用户是否已登录
  if (UserModule.token) {
    if (to.path === '/login') {
      //  如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      //  检查用户是否已获得其权限角色
      if (UserModule.roles.length === 0) {
        try {
          //  注意：角色必须是对象数组！例如：['admin']或['developer'，'editor']
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          // Generate accessible routes map based on role 根据角色生成可访问的路线图
          PermissionModule.GenerateRoutes(roles)
          // Dynamically add accessible routes  动态添加可访问的路由
          router.addRoutes(PermissionModule.dynamicRoutes)
          // Hack: ensure addRoutes is complete 确保addRoutes完整
          // Set the replace: true, so the navigation will not leave a history record  设置替换：true，因此导航不会保留历史记录
          next({ ...to, replace: true })
        } catch (err) {
          // Remove token and redirect to login page  删除令牌并重定向到登录页面
          UserModule.ResetToken()
          Message.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    //  没有登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.  其他无权访问的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
