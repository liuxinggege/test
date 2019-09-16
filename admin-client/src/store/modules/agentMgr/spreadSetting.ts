import { getSpreadSetting, addSpreadSetting, deleteSpreadSetting, updateSpreadSetting } from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
	spreadSettingDatas: Agent[],
	agentList: Agent[],
	code?: number,
	msg?: any,
	totalCount?: number
}

export interface Agent {
	act:string
	agencyId:number
	allowSetAgency:boolean
	ancestors:number[]
	balance:string
	channel:string
	createDate:Date
	downloadUrl:string
	gameTax:string
	gameUid:number
	level:number
	name:string
	parentId:number
	phone:string
	pwd:string
	qq:string
	remarks:string
	settlePwd:string
	status:string
	subPromotionProfit:string
	taxRate:string
	totalIncome:string
	totalSettleMoney:string
	type:string
	wx:string
	_id:string
	image?:any
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
	spreadSettingDatas:[],
	agentList: [],
	totalCount: 0,
}

const mutations = {

	SET_GETSPREADSETTING: (state: State, result: State) => {
		state.code = result.code;
		state.spreadSettingDatas = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
	},

	SET_ADDSPREADSETTING: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
	SET_DELETESPREADSETTING: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
	SET_UPDATESPREADSETTING: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
}
// actions
const actions = {

	GetSpreadSetting(context: { commit: Commit, state: State }, agent: Agent) {
		return new Promise(async (resolve, reject) => {
			getSpreadSetting(agent).then(response => {
				context.commit('SET_GETSPREADSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	AddSpreadSetting(context: { commit: Commit, state: State }, agent: Agent) {
		return new Promise(async (resolve, reject) => {
			addSpreadSetting(agent).then(response => {
				context.commit('SET_ADDSPREADSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	DeleteSpreadSetting(context: { commit: Commit, state: State }, agent: Agent) {
		return new Promise(async (resolve, reject) => {
			deleteSpreadSetting(agent).then(response => {
				context.commit('SET_DELETESPREADSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	UpdateSpreadSetting(context: { commit: Commit, state: State }, agent: Agent) {
		return new Promise(async (resolve, reject) => {
			updateSpreadSetting(agent).then(response => {
				context.commit('SET_UPDATESPREADSETTING', response.data)
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
