declare var require: any
import Vue from 'vue'
import Router from 'vue-router'
let _import = (file: string) => {
	let a = require('@/views/' + file + '.vue')
	return a.default;
}


Vue.use(Router)

export interface RouterCfg {
	path: string,
	component: any,
	name?: string,
	icon?: string,
}


export const constantRouterMap: RouterCfg[] = [
	{
		path: '/login',
		component: _import('login/index'),
	},
	//找回密码
	{
		path: '/findPassword',
		name: 'findPassword',
		component: _import('login/findPassword'),
	},
	{
		path: '/',
		component: _import('login/index'),
	},
	{
		path: '/home',
		name: '/home',
		component: _import('home/home'),
	},
	{
		path: '/selfInfo',
		name: '/selfInfo',
		component: _import('home/selfInfo'),
	},
	{//公告
		path: '/announcement',
		name: '/announcement',
		component: _import('announcement/announcement'),
	},
	{
		path: '/changeLoginPwd',
		name: 'changeLoginPwd',
		component: _import('home/changeLoginPwd'),
	},
	{
		path: '/changeAli',
		name: 'changeAli',
		component: _import('home/changeAli'),
	},
	{
		path: '/changeSettlePwd',
		name: 'changeSettlePwd',
		component: _import('home/changeSettlePwd'),
	},
	{
		path: '/changeUn',
		name: 'changeUn',
		component: _import('home/changeUn'),
	},
	{
		path: '/changePhone',
		name: 'changePhone',
		component: _import('home/changePhone'),
	},
	{
		path: '/bindPhone',
		name: 'bindPhone',
		component: _import('home/bindPhone'),
	},
	//推广赚钱
	{
		path: '/spreadSetting',
		component: _import('spreadSetting/spreadSetting'),
	},
	//查看下级数据
	{
		path: '/childData',
		component: _import('dataReport/childData'),
	},
	//收入明细
	{
		path: '/incomeDetail',
		component: _import('dataReport/incomeDetail'),
	},
	//添加新代理
	{
		path: '/addAgency',
		component: _import('groupManage/addAgency'),
	},
	{
		path: '/announcement-html',
		name: '/announcement-html',
		component: _import('announcement/announcement-html'),
	},
	{
		path: '/bonusPool',
		name: '/bonusPool',
		component: _import('activity/bonusPool'),
	},
	{
		path: '/fundRecord',
		name: '/fundRecord',
		component: _import('activity/fundRecord'),
	},
	{
		path: '/ranking',
		name: '/ranking',
		component: _import('activity/ranking'),
	},
	{
		path: '/novice',
		name: '/novice',
		component: _import('activity/activity'),
	}
]

export const asyncGridMap: RouterCfg[] = [
	{
		path: '/home',
		component: _import('home/home'),
		name: "首页",
		icon: "https://back-1255334780.cos.ap-guangzhou.myqcloud.com/agency/tmpl/FdWlphUCZAJC3UIP5Sw6sZeWyDjB91xg1ox4IS7xvTJ.png"
	},
	{
		path: '/dataReport',
		component: _import('dataReport/dataReport'),
		name: "数据报表",
		icon: "https://back-1255334780.cos.ap-guangzhou.myqcloud.com/agency/tmpl/SnytWyB9zUWl1LHTyty4KQV9Bg2Mgo5xI1WKSwcPXNI.png"

	},
	{
		path: '/groupManage',
		component: _import('groupManage/groupManage'),
		name: "团队管理",
		icon: "https://back-1255334780.cos.ap-guangzhou.myqcloud.com/agency/tmpl/XNvKEScdTtdERYvuik5ADhxeixGFQ6nBuLEDUdFPXKC.png"
	},
	{
		path: '/activity',
		component: _import('activity/home'),
		name: "/activity",
		icon: "https://back-1255334780.cos.ap-guangzhou.myqcloud.com/agency/tmpl/YMYYzY4VjSk2DRu2VdtoYi59tjLwj85xZKQX8wHEoU2.png"

	},
	{
		path: '/balanceSettle',
		component: _import('balanceSettle/balanceSettle'),
		name: "资金结算",
		icon: "https://back-1255334780.cos.ap-guangzhou.myqcloud.com/agency/tmpl/2BouxIy76vYZlZJW0ClDtMsNIfKCpSUNrsL0Lxkbr8W.png"
	},

];

export default new Router({
	// mode: 'history', // require service support
	scrollBehavior: (to, from, savedPosition) => {
		return { x: 0, y: 0 };
	},
	routes: constantRouterMap,
	//mode: 'history'
})
