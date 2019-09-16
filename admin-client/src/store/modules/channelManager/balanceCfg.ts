import {
	getChannelList,
	getBalanceCfg,
	addBalanceCfg,
	deleteBalanceCfg,
	editBalanceCfg,
} from '../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
import store from '../..'
import { Message } from 'element-ui';
export interface State {
	balanceCfgData: balanceCfgData[]
	code:number, 
	err:string,
}

export interface balanceCfgData {//
	pid: string,
    channel: string , 
    channels: string[],
    rate: number ,
    time: Date,
}

// initial state
const state: State = {
	balanceCfgData: [],
	code: 0,
	err: "",
}

const mutations = {
	SET_BALANCECFG: (state: State, result: any) => {
		state.code = result.code;
		state.balanceCfgData = result.msg;
	},
	SET_ERROR: (state: State, result: any) => {
		state.code = result.code;
		state.err = result.err;
	},
}
// actions
const actions = {
	GetBalanceCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getBalanceCfg(data).then(response => {
				context.commit('SET_BALANCECFG', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_ERROR', error)
				console.error("catch", error)
				resolve()
			})
		});
	},
	AddBalanceCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			addBalanceCfg(data).then(response => {
				context.commit('SET_BALANCECFG', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_ERROR', error)
				console.error("catch", error)
				resolve()
			})
		});
	},
	EditBalanceCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			editBalanceCfg(data).then(response => {
				context.commit('SET_BALANCECFG', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_ERROR', error)
				console.error("catch", error)
				resolve()
			})
		});
	},
	DeleteBalanceCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			deleteBalanceCfg(data).then(response => {
				context.commit('SET_BALANCECFG', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_ERROR', error)
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
