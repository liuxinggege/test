import { Commit } from 'vuex'
import { getWelfare, receiveWelfare } from '../../../api/agent/activity/activity';

export interface State {
	activityList: ActivityDoc[]
	code: number
	msg?: string
	err?: string
}

export interface ActivityDoc {
	description: string,
	number: number,
	finNumber: number,
	reward: string,
	finish: boolean,
	receiver: boolean
}
// initial state
const state: State = {
	activityList: [],
	code: 0,
	msg: "",
	err: ""
}

const mutations = {

	SET_AGENCYACTIVITY: (state: State, result: any) => {
		state.code = result.code;
		state.activityList = result.msg;
	},
	SET_ERROR: (state: State, result: any) => {
		state.code = result.code;
		state.err = result.err;
	},
	SET_CODE: (state: State, result: any) => {
		state.code = result.code;
	},
}
// actions
const actions = {

	GetWelfare(context: { commit: Commit, state: State }, data: any) {
		return new Promise(async (resolve, reject) => {
			getWelfare(data).then(response => {
				context.commit('SET_AGENCYACTIVITY', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	ReceiveWelfare(context: { commit: Commit, state: State }, data: any) {
		return new Promise(async (resolve, reject) => {
			receiveWelfare(data).then(response => {
				context.commit('SET_CODE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
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
