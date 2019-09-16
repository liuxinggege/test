import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

import selfInfo from './modules/selfInfo/selfInfo'
import home from './modules/home/home'
import agentList from './modules/agentList/agentList'
import templet from './modules/templet/templet'
import spreadSetting from './modules/spreadSetting/spreadSetting'
import editPwd from './modules/editPwd/editPwd'
import balanceAct from './modules/balanceAct/balanceAct'
import editBalancePwd from './modules/editBalancePwd/editBalancePwd'
import balanceRecord from './modules/balanceRecord/balanceRecord'
import submitBalance from './modules/submitBalance/submitBalance'
import groupManage from './modules/groupManage/groupManage'
import dataReport from './modules/dataReport/dataReport'
import announcement from './modules/announcement/announcement'
import activity from './modules/activity/activity'

Vue.use(Vuex)
export default new Vuex.Store({
	modules: {
		app,
		errorLog,
		tagsView,

		permission,
		user,
		// 首页
		home,
		selfInfo,
		agentList,

		templet,
		spreadSetting,
		editPwd,
		balanceAct,
		editBalancePwd,
		balanceRecord,
		submitBalance,

		groupManage,
		dataReport,
		announcement,
		activity,
	},
	getters
})

/** 后台的返回数据interface*/
export interface CodeMsg<T> {
	code: number;
	msg: T;
	err?: any;
}

