import { getTemplet ,updateTemplet, deleteTemplet } from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
	templetData: templetType[],
	code?: number,
	msg?: any,
	totalCount?: number
}

export interface templetType {
	createDate:Date
	imageUrl:string
	tmplId:number
	updateDate:Date
	_id:string
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {

	templetData: [],
	totalCount: 0,
}

const mutations = {
	CLEAR_CODEAGENTMGR:(state: State) => {

		state.code = 0;
	},

	SET_GETTEMPLET: (state: State, result: State) => {
		state.templetData =result.msg.data;
		state.totalCount = result.msg.totalCount;
		state.code = result.code;
	},

	SET_UPDATETEMPLET: (state: State, result: State) => {
		state.code = result.code;
	},

	SET_DELETETEMPLET: (state: State, result: State) => {
		state.code = result.code;
	},
}
// actions
const actions = {

	GetTemplet(context: { commit: Commit, state: State }, agent: any) {

		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			getTemplet(agent).then(response => {
				context.commit('SET_GETTEMPLET', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	UpdateTemplet(context: { commit: Commit, state: State }, agent: any) {

		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			updateTemplet(agent).then(response => {
				context.commit('SET_UPDATETEMPLET', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	DeleteTemplet(context: { commit: Commit, state: State }, agent: any) {

		context.commit('CLEAR_CODEAGENTMGR');
		return new Promise(async (resolve, reject) => {
			deleteTemplet(agent).then(response => {
				context.commit('SET_DELETETEMPLET', response.data)
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
