import { getWelfareRecord, exportWelfareRecord } from "../../../api/admin/agentMgr/agentMgr"
import { Commit } from 'vuex'

export interface State {
	agencyWelfareRecord: AgencyWelfareRecord[],
	code?: number,
	msg?: any,
	err?: any,
	totalCount?: number
}

export interface AgencyWelfareRecord {
	pid: string,
	agencyId: number,
	activityId: number,
	state: boolean,
	receive: boolean,
	receiveTime: Date,
	description: string,
	money: string,
}
const state: State = {
	agencyWelfareRecord: [],
	totalCount: 0,
	code: 0,
	msg: "",
	err: "",
}

const mutations = {

	CLEAR_CODE_SPREADATTABLE: (state: State) => {
		state.code = 0;
	},

	SET_GETAGENCYWELFARERECORD: (state: State, result: any) => {
		state.code = result.code;
		state.agencyWelfareRecord = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
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
	GetWelfareRecord(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			getWelfareRecord(agent).then(response => {
				context.commit('SET_GETAGENCYWELFARERECORD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	ExportWelfareRecord(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			exportWelfareRecord(agent).then(response => {
				context.commit('SET_GETAGENCYWELFARERECORD', response.data)
				resolve(response.data)
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
