import {  getAgenyDailyInfo, getAgenyDailyInfoExcel } from "../../../../src/api/admin/agentMgr/agentMgr"
import { Commit } from 'vuex'

export interface State {
	agentTaxInfoData: any[],
	agencyDaliyInfo: any[],
	code?: number,
	msg?: any,
	totalCount?: number
}

export interface AgentTaxInfoType {
	sumDate: Date
	agencyId: string
	name: string
	channel: string
	act: string
	gameUid: string
	gameTax: string
	alipayAccount: string
	totalIncome: string
	subPromotionProfit: string
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
	agentTaxInfoData: [],
	agencyDaliyInfo: [],
	totalCount: 0,
	code: 0,
}

const mutations = {

	CLEAR_CODE_TAXINFO: (state: State) => {
		state.code = 0;
	},

	SET_GETAGENTTAXINFO: (state: State, result: State) => {
		state.code = result.code;
		state.totalCount = result.msg.totalCount;
		state.agentTaxInfoData = result.msg.pageData;
	},
	SET_AGENCYDALIYINFO: (state: State, result: State) => {
		state.code = result.code;
		state.totalCount = result.msg.totalCount;
		state.agencyDaliyInfo = result.msg.pageData;
	},

}
// actions
const actions = {
	GetAgenyDailyInfo(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			getAgenyDailyInfo(agent).then(response => {
				context.commit('SET_AGENCYDALIYINFO', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetAgenyDailyInfoExcel(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			getAgenyDailyInfoExcel(agent).then(response => {
				resolve(response.data)
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
