import { constantRouterMap, RouterCfg, asyncGridMap } from "../../router/router";

function hasPermission(route) {
	let pages = JSON.parse(window.sessionStorage.getItem('pageRoute'));

	if (pages && route.path && route.path.length > 0) {
		let path = route.path;
		if (path[0] === '/') {
			path = path.slice(1);
		}
		// return !!(pages.indexOf(path) >= 0);
		return !!pages[path]
	}
	return false;
	// return true
}


function filterAsyncRouter(asyncRouterMap: RouterCfg[]): RouterCfg[] {
	const accessedRouters = asyncRouterMap.filter(route => {
		return true
	})

	return accessedRouters;
}

const permission = {
	state: {
		// routers: constantRouterMap,
		generateRoutesFlag: false,
		// addRouters: []
		routers: [],
		addRouters: [],
		gridRouters: [],
	},
	mutations: {
		SET_ROUTERS: (state, routers) => {
			console.log('路由', state.routers);
			state.routers = [];
			state.addRouters = routers;
			state.routers = state.routers.concat(routers);
			state.generateRoutesFlag = true;
			//console.log(state.routers);
		},
		SET_GRID_ROUTERD: (state) => {
			let ret: RouterCfg[][] = [];
			let len = Math.ceil(state.addRouters.length / 4);
			console.log(state.addRouters);
			// for (let i = 0; i < len; i++) {
			// 	ret.push(state.addRouters.slice(i * 4, (i + 1) * 4));
			// }
			ret.push(...state.addRouters);
			state.gridRouters = ret;
			console.log("xxgridRouters.len", state.gridRouters.length, state.addRouters.length);
		}

	},
	actions: {
		GenerateRoutes({ commit }, data) {
			return new Promise(resolve => {
				// const { roles } = data
				// let accessedRouters = asyncRouterMap
				// commit('SET_ROUTERS', accessedRouters)
				// resolve()
				let gridRoute = filterAsyncRouter(asyncGridMap);
				commit('SET_ROUTERS', gridRoute); //设置当前的路由
				commit('SET_GRID_ROUTERD'); //设置当前的路由
				resolve();
			})
		}
	}
}

export default permission
