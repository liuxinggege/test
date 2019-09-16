import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(route) {
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    const pages = userInfo.pages
    if (pages && route.path && route.path.length > 0) {
        let path = route.path;
        if (path[0] === '/') {
            path = path.slice(1);
        }
        return !!pages.find(e => e === path);
    }
    return false;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children)
            }
            return true
        }
        return false
        // return true
    })
    return accessedRouters
}

const permission = {
    state: {
        // routers: constantRouterMap,
        generateRoutesFlag: false,
        // addRouters: []
        routers: [],
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            // console.log('路由', state.routers);
            state.routers = [];
            state.addRouters = [];
            state.addRouters = routers;
            state.routers = state.routers.concat(routers);
            state.generateRoutesFlag = true;
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                // const { roles } = data
                // let accessedRouters = asyncRouterMap
                // commit('SET_ROUTERS', accessedRouters)
                // resolve()
                commit('SET_ROUTERS', filterAsyncRouter(asyncRouterMap)); //设置当前的路由

                resolve();
            })
        }
    }
}

export default permission
