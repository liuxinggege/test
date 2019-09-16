import {
	getLeaders,
	getMembers,
	createUser,
	updateUser,
	getUserByAct,
	addMembers,
	deleteMembers,
	updateMembers,
	deleteRelation,
	createRelation,
	updateChannel
} from '../../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
import store from '../../../../store'
import { Message } from 'element-ui';
export interface State {
	leaderData: cpsUser[]
	memberData: cpsUser[]
	userData: userType
	totalCount: number
	memberTotalCount: number
	getCode: number
	addCode: number
	eidtCode: number
	deleteCode: number
}

export interface cpsUser {
	name: string,
	leader: string,
	channels: string[]
}

export interface userType {
	act?: string,
	pwd?: string,
	authority?: number,
	ip?: string,
	loginDate?: Date,
	alipayAccount?: string,
	index?: true,
	alipayName?: string
	payPwd?: string
	totalSetMoney?: string,
	totalMoney?: string,
	sharingRatio?: string
	purview?: any,
	channelMoneyHistory?: any,
	billingType?: string
	setTime?: number,
}

// initial state
const state: State = {
	leaderData: [],// leader渠道账号
	memberData: [],// member渠道账号
	userData: {},
	totalCount: 0,
	memberTotalCount: 0,
	getCode: 0,
	addCode: 0,
	deleteCode: 0,
	eidtCode: 0,
}

const mutations = {
	CLEAR_CODE: (state: State) => {
		state.getCode = 0;
		state.addCode = 0;
		state.eidtCode = 0;
		state.deleteCode = 0;
	},

	SET_LEADER: (state: State, result: any) => {
		state.leaderData = result.msg.data;
		state.totalCount = result.msg.totalCount;
		state.getCode = result.code
	},
	SET_MEMBER: (state: State, result: any) => {
		state.memberData = result.msg.data;
		state.memberTotalCount = result.msg.totalCount;
		state.getCode = result.code
	},

	SET_GETUSER: (state: State, result: any) => {
		state.userData = result.msg;
		state.getCode = result.code
	},

	SET_ADDCHANNELACCOUNT: (state: State, result: any) => {
		state.addCode = result.code
	},

	SET_EDITCHANNELACCOUNT: (state: State, result: any) => {
		state.eidtCode = result.code
	},
	SET_DELETCHANNELACCOUNT: (state: State, result: any) => {
		state.deleteCode = result.code
	},

}

// actions
const actions = {
	GetLeader(context: { commit: Commit, state: State }, data) {//获取主账号
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getLeaders(data).then(response => {
				context.commit('SET_LEADER', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	Getmember(context: { commit: Commit, state: State }, data) {//获取子账号
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getMembers(data).then(response => {
				context.commit('SET_MEMBER', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	CreateUser(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			createUser(data).then(response => {
				context.commit('SET_ADDCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ADDCHANNELACCOUNT', error)
				resolve()
			})
		});
	},
	UpdateUser(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			updateUser(data).then(response => {
				context.commit('SET_EDITCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELACCOUNT', error)
				resolve()
			})
		});
	},
	GetUserByAct(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getUserByAct(data).then(response => {
				context.commit('SET_GETUSER', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	AddMembers(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			addMembers(data).then(response => {
				context.commit('SET_ADDCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ADDCHANNELACCOUNT', error)
				resolve()
			})
		});
	},
	DeleteMembers(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			deleteMembers(data).then(response => {
				context.commit('SET_DELETCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	UpdateMembers(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			updateMembers(data).then(response => {
				context.commit('SET_EDITCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELACCOUNT', error)
				resolve()
			})
		});
	},
	DeleteRelation(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			deleteRelation(data).then(response => {
				context.commit('SET_DELETCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	CreateRelation(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			createRelation(data).then(response => {
				context.commit('SET_ADDCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ADDCHANNELACCOUNT', error)
				resolve()
			})
		});
	},

	UpdateChannel(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			updateChannel(data).then(response => {
				context.commit('SET_EDITCHANNELACCOUNT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELACCOUNT', error)
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
