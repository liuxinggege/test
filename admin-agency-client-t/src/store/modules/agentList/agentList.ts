import { addAgentNew, getAgetListNew, getAgentTaxSetting, updateAgentNew, updateAgentStatus, parentTaxRate } from '../../../api/agent/agentList/agentList'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
	agentList: AgentListDataType[]
	parentTaxRate: string
	code: number
	totalCount: number
	taxRateData: any
	msg?: string
}

export interface AgentListDataType {
	act: string
	pwd: string
	type: string
	level: number
	ancestors: string[]
	parentAct: string
	agencyId: number
	gameUid: number
	channel: string
	name: string
	qq: string
	wx: string
	phone: string
	taxRate: string
	remarks: string
	ip: string
	ipAddress: string,
	createDate: Date
	loginDate: Date
	updateDate: Date
	alipayAct: string
	alipayName: string
	bankCardNo: string
	bankCardName: string
	bankName: string
	settlePwd: string
	settleTimes: number
	balance: string
	totalIncome: string
	totalSettleMoney: string
	status: boolean
	allowSetAgency: boolean
	_id: string
}
// initial state
const state: State = {
	agentList: [],
	code: 0,
	parentTaxRate: "",
	totalCount: 0,
	taxRateData: 0
}

const mutations = {
	CLEAR_CODEAGENTMGR: (state: State) => {
		state.code = 0;
	},

	SET_ADDAGENTRESULTNEW: (state: State, result: any) => {
		state.code = result.code;
		if(result.code===10000){
			state.msg="系统繁忙";
		}else{
			state.msg = JSON.stringify(result.err)
		}
	},
	SET_ADDAGENTLISTRESULTNEW: (state: State, result: any) => {
		state.code = result.code;
		state.agentList = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
	},

	SET_UPDATEAGENTSTATUS: (state: State, result: any) => {
		state.code = result.code;
	},

	SET_GETTAXRATEINFO: (state: State, result: any) => {
		state.code = result.code;
		state.parentTaxRate = result.msg.parentTaxRate
	},

	SET_GETAGENTTAXSETTING: (state: State, result: any) => {
		state.code = result.code;
		state.taxRateData = result.msg
	},

}
// actions
const actions = {

	GetAgentTaxSetting(context: { commit: Commit, state: State }) {
		return new Promise(async (resolve, reject) => {
			getAgentTaxSetting().then(response => {
				context.commit('SET_GETAGENTTAXSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	UpdateAgentStatus(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			updateAgentStatus(agent).then(response => {
				context.commit('SET_UPDATEAGENTSTATUS', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	ParentTaxRate(context: { commit: Commit, state: State }) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			parentTaxRate().then(response => {
				context.commit('SET_GETTAXRATEINFO', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	AddAgentNew(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			addAgentNew(agent).then(response => {
				context.commit('SET_ADDAGENTRESULTNEW', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ADDAGENTRESULTNEW', error)
				resolve()
			})
		});
	},

	UpdateAgentNew(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			updateAgentNew(agent).then(response => {
				context.commit('SET_ADDAGENTRESULTNEW', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetAgentListNew(context: { commit: Commit, state: State }, agentQueryModel: any) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			getAgetListNew(agentQueryModel).then(response => {
				context.commit('SET_ADDAGENTLISTRESULTNEW', response.data)
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
