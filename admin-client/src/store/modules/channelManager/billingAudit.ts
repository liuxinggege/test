import {
	getBillingAudit,
	updateChannelAlipayAccount,
	updateChannelAlipayName,
	agreeBillingAudit,
	refuseBillingAudit
} from '../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
import store from '../../../store'
import { Message } from 'element-ui';
export interface State {
	channelAccountInfoData: channelAccountInfoType[]
	totalCount: number

	getCode: number
	addCode: number
	eidtCode: number
	agreeCode: number
}

export interface channelAccountInfoType {//登陆参数

	status: string,
	withdrawOrderID: string,
	act: string,
	alipayAccount: string,
	alipayName: string,
	payPwd: string
	applyMoney: string,
	applyDate: Date,
	dealWithDate: Date,
	arrivedDate: Date,
	operator: string,
	ip: string
	totalSetMoney: string,

}

// initial state
const state: State = {
	channelAccountInfoData: [],
	totalCount: 0,

	getCode: 0,
	addCode: 0,
	agreeCode: 0,
	eidtCode: 0,
}

const mutations = {
	CLEAR_CODE: (state: State) => {
		state.getCode = 0;
		state.addCode = 0;
		state.eidtCode = 0;
		state.agreeCode = 0;
	},

	SET_GETCHANNELDISCOUNT: (state: State, result: any) => {
		state.channelAccountInfoData = result.msg.data;
		state.totalCount = result.msg.totalCount;
		state.getCode = result.code
	},

	SET_ADDCHANNELDISCOUNT: (state: State, result: any) => {
		state.eidtCode = result.code
	},

	SET_EDITCHANNELDISCOUNT: (state: State, result: any) => {
		state.eidtCode = result.code
	},

	SET_DELETCHANNELDISCOUNT: (state: State, result: any) => {
		state.agreeCode = result.code
	},

}
// actions
const actions = {
	GetBillingAudit(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getBillingAudit(data).then(response => {
				context.commit('SET_GETCHANNELDISCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	//支付宝账号
	UpdateBillingAuditAlipayAccount(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			updateChannelAlipayAccount(data).then(response => {
				context.commit('SET_EDITCHANNELDISCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	//支付宝姓名
	UpdateBillingAuditAlipayName(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			updateChannelAlipayName(data).then(response => {
				context.commit('SET_EDITCHANNELDISCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	//同意
	AgreeBillingAudit(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			agreeBillingAudit(data).then(response => {
				context.commit('SET_DELETCHANNELDISCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	//拒绝
	RefuseBillingAudit(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			refuseBillingAudit(data).then(response => {
				context.commit('SET_DELETCHANNELDISCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
}
export default {
	state,
	// getters,
	actions,
	mutations
}
