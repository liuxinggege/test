import { addAgentNew, getAgetListNew, getAgetListNewExcel, updateAgentNew, updateAgentStatus, getAgentTree } from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
	agentList: Agent[],
	code?: number,
	msg?: any,
	totalCount?: number
	agencyTree: any
}

export interface Agent {
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

type GetQueryModel = State;

// initial state
const state: State = {
	agentList: [],
	agencyTree: {},
	totalCount: 0,
	code: 0
}

const mutations = {
	CLEAR_CODEAGENTMGR: (state: State) => {
		state.code = 0;
	},
	SET_ADDAGENTTREE: (state: State, tree: CodeMsg<any>) => {
		state.agencyTree = tree.msg;
		state.code = tree.code;
	},

	SET_ADDAGENTRESULTNEW: (state: State, result: any) => {
		state.msg = JSON.stringify(result.err || result.msg);
		state.code = result.code;
	},
	SET_ADDAGENTLISTRESULTNEW: (state: State, result: State) => {
		state.code = result.code;
		state.agentList = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
	},

	SET_UPDATEAGENTSTATUS: (state: State, result: any) => {
		state.msg = JSON.stringify(result.err);
		state.code = result.code;
	},
}
// actions
const actions = {

	UpdateAgentStatus(context: { commit: Commit, state: State }, agent: Agent) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			updateAgentStatus(agent).then(response => {
				context.commit('SET_UPDATEAGENTSTATUS', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_UPDATEAGENTSTATUS', error)
				resolve()
			})
		});
	},

	AddAgentNew(context: { commit: Commit, state: State }, agent: Agent) {
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

	UpdateAgentNew(context: { commit: Commit, state: State }, agent: Agent) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			updateAgentNew(agent).then(response => {
				context.commit('SET_ADDAGENTRESULTNEW', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ADDAGENTRESULTNEW', error)
				resolve()
			})
		});
	},
	GetAgentListNew(context: { commit: Commit, state: State }, agentQueryModel: AgentQueryModel) {//pageData用
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
	GetAgentListExcel(context: { commit: Commit, state: State }, agentQueryModel: AgentQueryModel) {//Excel用
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			getAgetListNewExcel(agentQueryModel).then(response => {
				resolve(response.data)
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetAgentTree(context: { commit: Commit, state: State }, cond) {
		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			getAgentTree(cond).then(response => {
				context.commit('SET_ADDAGENTTREE', response.data)
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
	actions,
	mutations
}
