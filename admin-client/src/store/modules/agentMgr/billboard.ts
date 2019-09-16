import { insertBillboards,getAgencyBillboardList,activeAgencyBillboard,  deleteAgencyBillboard,editAgencyBillboard} from "../../../api/admin/agentMgr/agentMgr"
import { Commit } from 'vuex'

export interface State {
	billboards: Billboard[],
	code?: number,
	msg?: any,
	err?: any,
	totalCount?: number
}

export interface Billboard {
	pid: string,
    active: boolean,
    idx: number,
    type: string,
    title: string,
    home: Boolean,
    url: string,
    content: string,
    createTime: Date,
	opt: String,
	num:number,
}
const state: State = {
	billboards: [],
	totalCount: 0,
	code: 0,
	msg: "",
	err: "",
}

const mutations = {

	CLEAR_CODE_SPREADATTABLE: (state: State) => {
		state.code = 0;
	},

	SET_GETBILLBOARDLIST: (state: State, result: any) => {
		state.code = result.code;
		state.billboards = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
	},
	SET_ERROR: (state: State,result: any) => {
		state.code = result.code;
		state.err = result.err;
	},
	SET_CODE: (state: State,result: any) => {
		state.code = result.code;
	},

}
// actions
const actions = {
	GetAgencyBillboardList(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			getAgencyBillboardList(agent).then(response => {
				context.commit('SET_GETBILLBOARDLIST', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	ActiveAgencyBillboard(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			activeAgencyBillboard(agent).then(response => {
				context.commit('SET_CODE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	EditAgencyBillboard(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			editAgencyBillboard(agent).then(response => {
				context.commit('SET_CODE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	DeleteAgencyBillboard(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			deleteAgencyBillboard(agent).then(response => {
				context.commit('SET_CODE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	InsertBillboards(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			insertBillboards(agent).then(response => {
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
	actions,
	mutations
}
