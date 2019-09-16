import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import router from './router';
import store from './store';
const userInfo = sessionStorage.getItem("userInfo");
NProgress.configure({ showSpinner: false })// NProgress Configuration
// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {


function getAsyncRouterMapPath(asyncRouterMap){
   let newList = [];
    asyncRouterMap.forEach(item => {
        newList.push(item.path);
        if(item.children && item.children.length){
          newList.push(...getAsyncRouterMapPath(item.children))
        }
    })
    return newList;
}
// console.log(getAsyncRouterMapPath(asyncRouterMap))

  let userInfo = sessionStorage.getItem("userInfo")
  NProgress.start() // start progress bar
  if (userInfo) {
    userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    if (to.path === '/login') {
      sessionStorage.clear();
      next({ path: '/' });
    } else {
      if (!store.getters.generateRoutesFlag) {
        let roles = userInfo.pages;
        store.dispatch('GenerateRoutes', { roles }).then(() => {
          router.addRoutes(store.getters.addRouters);
          next({ ...to });
        })
      } else {
        next();
      }
      // next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login');
      NProgress.done();
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
