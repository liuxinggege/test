import { getAgentTotalData, addMoney, getAgentTotalDataExcel } from "../../../../src/api/admin/agentMgr/agentMgr"
import { Commit } from 'vuex'

export interface State {
	agentTotalDataDatas: Agent[],
	agentList: Agent[],
	code?: number,
	msg?: any,
	totalCount?: number
}

export interface Agent {
	act: string,
	pwd: string,
	type: string,
	level: number,
	ancestors: string[],
	parentAct: string,
	agencyId: number,
	gameUid: number,
	channel: string,
	name: string,
	qq: string,
	wx: string,
	phone: string,
	taxRate: string,
	remarks: string,
	ip: string,
	ipAddress: string,
	createDate: Date,
	loginDate: Date,
	updateDate: Date,
	alipayAct: string,
	alipayName: string,
	bankCardNo: string,
	bankCardName: string,
	bankName: string,
	settlePwd: string,
	settleTimes: number,
	balance: string,
	totalIncome: string,
	totalSettleMoney: string,
	gameTax: string,
	subPromotionProfit: string,
	sumDate: Date,
	status: boolean,
	allowSetAgency: boolean,
	subPromotionGameTax: string
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
	agentTotalDataDatas: [],
	agentList: [],
	totalCount: 0,
}

const mutations = {

	SET_GETAGENTTOTALDARA: (state: State, result: State) => {
		state.code = result.code;
		state.agentTotalDataDatas = result.msg.pageData;
		state.totalCount = result.msg.totalCount
	},

	SET_ERROR: (state: State, result) => {
		state.msg = result.err || result.msg;
		state.code = result.code;
	},
	SET_ADDMONEYRET: (state: State, result) => {
		state.code = result.code;
	},
	CLEARCODE: (state: State) => {
		state.code = 0;
	},
}
// actions
const actions = {

	AddAgencyBalance(context: { commit: Commit, state: State }, data) {
		context.commit('CLEARCODE');
		return new Promise(async (resolve, reject) => {
			addMoney(data).then(response => {
				context.commit('SET_ADDMONEYRET', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	GetAgentTotalData(context: { commit: Commit, state: State }, agent: Agent) {
		context.commit('CLEARCODE');
		return new Promise(async (resolve, reject) => {
			getAgentTotalData(agent).then(response => {
				context.commit('SET_GETAGENTTOTALDARA', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	GetAgentTotalDataExcel(context: { commit: Commit, state: State }, agent: Agent) {
		context.commit('CLEARCODE');
		return new Promise(async (resolve, reject) => {
			getAgentTotalDataExcel(agent).then(response => {
				context.commit('SET_GETAGENTTOTALDARA', response.data)
				resolve( response.data)
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
}
export default {
	state,
	actions,
	mutations
}
