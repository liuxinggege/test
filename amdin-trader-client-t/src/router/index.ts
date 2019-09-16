declare var require: any
import Vue from 'vue'
import Router from 'vue-router'
let _import = (file: string) => {
	let a = require('@/views/' + file + '.vue')
	return a.default;
}
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout.vue'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
	{
		path: '/login',
		component: _import('login/index'),
		hidden: false
	},

	{
		path: '/',
		component: Layout,
		redirect: 'hello',
		hidden: true,
		children: [{
			path: 'hello',
			component: _import('hello'),
			name: 'hello',
			meta: { title: '欢迎', icon: 'hello', noCache: true }
		}]
	},
	// {
	//   path: '/',
	//   component: Layout,
	//   redirect: 'selfInfo',
	//   hidden: true,
	//   children: [{
	//     path: 'selfInfo',
	//     component: _import('selfInfo'),
	//     name: 'selfInfo',
	//     meta: { title: '个人信息', icon: 'selfInfo', noCache: true }
	//   }]
	// },
	// { path: '/404', component: _import('errorPage/404'), hidden: true },
	// { path: '/500', component: _import('errorPage/401'), hidden: true }
]

export default new Router({
	// mode: 'history', // require service support
	scrollBehavior: (to, from, savedPosition) => {
		return { x: 0, y: 0 };
	},
	routes: constantRouterMap
})

export const asyncRouterMap = [
	{
		path: '/upPoint',
		component: Layout,
		redirect: 'noredirect',
		meta: {
			title: '上分',
			icon: 'peoples'
		},
		children: [
			{ path: 'upPoint', component: _import('pages/UpPoint'), name: 'upPoint', meta: { title: '上分', icon: 'chart', noCache: true } },
		]
	},
	{
		path: '/AccountManagement',
		component: Layout,
		redirect: 'AccountManagement/index',
		meta: {
			title: '收款账户管理',
			icon: 'peoples'
		},
		children: [
			{ path: 'index', component: _import('agent/AccountManagement'), name: 'AccountManagement', meta: { title: '收款账户管理', icon: 'chart', noCache: true } },
		]
	},
	{
		path: '/contactAway',
		component: Layout,
		redirect: 'noredirect',
		meta: {
			title: '联系方式管理',
			icon: 'peoples'
		},
		children: [
			{ path: 'contactAway', component: _import('pages/contactAway'), name: 'contactAway', meta: { title: '联系方式管理', icon: 'chart', noCache: true } },
		]
	},
	{
		path: '/agentRecharge',
		component: Layout,
		redirect: 'agentRecharge/index',
		meta: {
			title: '代理充值',
			icon: 'peoples'
		},
		children: [
			{ path: 'index', component: _import('agent/agentRecharge'), name: 'agentRecharge', meta: { title: '代理充值', icon: 'chart', noCache: true } },
		]
	},
	{
		path: '/blacklist',
		component: Layout,
		redirect: 'blacklist/index',
		meta: {
			title: '黑名单设置',
			icon: 'peoples'
		},
		children: [
			{ path: 'index', component: _import('agent/blacklist'), name: 'blacklist', meta: { title: '黑名单设置', icon: 'chart', noCache: true } },
		]
	},
	{
		path: '/businessInfo',
		component: Layout,
		redirect: 'noredirect',
		meta: {
			title: '商人信息',
			icon: 'peoples'
		},
		children: [
			{ path: 'businessInfo', component: _import('pages/BusinessInfo'), name: 'businessInfo', meta: { title: '商人信息', icon: 'chart', noCache: true } },
		]
	},
	{
		path: '/upRecord',
		component: Layout,
		redirect: 'noredirect',
		meta: {
			title: '上分记录',
			icon: 'peoples'
		},
		children: [
			{ path: 'upRecord', component: _import('pages/UpRecord'), name: 'upRecord', meta: { title: '上分记录', icon: 'chart', noCache: true } },
		]
	},
	// {
	// 	path: '/transferRecord',
	// 	component: Layout,
	// 	redirect: 'noredirect',
	// 	meta: {
	// 		title: '转入记录',
	// 		icon: 'peoples'
	// 	},
	// 	children: [
	// 		{ path: 'transferRecord', component: _import('pages/TransferRecord'), name: 'transferRecord', meta: { title: '转入记录', icon: 'chart', noCache: true } },
	// 	]
	// },
	{
		path: '/transferLog',
		component: Layout,
		redirect: 'noredirect',
		meta: {
			title: '转账记录',
			icon: 'peoples'
		},
		children: [
			{ path: 'transferLog', component: _import('pages/TransferRecord'), name: 'transferLog', meta: { title: '转账记录', icon: 'chart', noCache: true } },
		]
	},
	// {
	// 	path: '/withdrawLog',
	// 	component: Layout,
	// 	redirect: 'noredirect',
	// 	meta: {
	// 		title: '兑换记录',
	// 		icon: 'peoples'
	// 	},
	// 	children: [
	// 		{ path: 'withdrawLog', component: _import('pages/TransferLog'), name: 'withdrawLog', meta: { title: '兑换记录', icon: 'chart', noCache: true } },
	// 	]
	// },
]
