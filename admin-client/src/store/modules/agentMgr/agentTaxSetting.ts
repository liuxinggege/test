import {
	getAgentTaxSetting,
	getAgentTaxCfg,
	delAgentTaxCfg,
	updateAgentTaxCfg,
	addAgentTaxCfg,
	transferFromAgencyIdsToZongDai
} from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface AgencyTaxRateCfg {
	gameTax: string;
	changeRate: string;
}
export interface State {
	taxRateData: {
		businessTaxRate: string
		leaderTaxRate: string
		generalTaxRate: string
	},
	taxRateCfgData: AgencyTaxRateCfg[];
	code: number;
	msg: string;
	err: string;
}

// initial state
const state: State = {
	taxRateData: {
		businessTaxRate: "0",
		leaderTaxRate: "0",
		generalTaxRate: "0",
	},
	taxRateCfgData: [{
		gameTax: "0",
		changeRate: "0",
	}],
	code: 0,
	msg: "",
	err: "",
}

const mutations = {

	CLEAR_AGENCYRATECODE: (state: State) => {
		state.code = 0
	},
	SET_GETAGENTTAXSETTING: (state: State, result) => {
		state.code = result.code;
		state.taxRateData = result.msg
	},
	SET_GETAGENTTAXCFG: (state: State, result) => {
		state.code = result.code;
		state.taxRateCfgData = result.msg
	},

	SET_UPDATEAGENTTAXSETTING: (state: State, result) => {
		state.code = result.code;
	},

	SET_TRANSFERRET: (state: State, result) => {
		state.code = result.code;
		state.msg = result.msg || result.err;
	},
	SET_ERROR: (state: State, result) => {
		state.code = result.code;
		state.err = result.err;
	}
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
	GetAgentTaxCfg(context: { commit: Commit, state: State }, data) {
		return new Promise(async (resolve, reject) => {
			getAgentTaxCfg(data).then(response => {
				context.commit('SET_GETAGENTTAXCFG', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	DelAgentTaxCfg(context: { commit: Commit, state: State }, id) {
		context.commit('CLEAR_AGENCYRATECODE');
		return new Promise(async (resolve, reject) => {
			delAgentTaxCfg(id).then(response => {
				context.commit('SET_UPDATEAGENTTAXSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	UpdateAgentTaxCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_AGENCYRATECODE');
		return new Promise(async (resolve, reject) => {
			updateAgentTaxCfg(data).then(response => {
				context.commit('SET_UPDATEAGENTTAXSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	AddAgentTaxCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_AGENCYRATECODE');
		return new Promise(async (resolve, reject) => {
			addAgentTaxCfg(data).then(response => {
				context.commit('SET_UPDATEAGENTTAXSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	TransferFromAgencyIdsToZongDai(context: { commit: Commit, state: State }, cond) {
		context.commit('CLEAR_AGENCYRATECODE');
		return new Promise(async (resolve, reject) => {
			transferFromAgencyIdsToZongDai(cond).then(response => {
				context.commit('SET_TRANSFERRET', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_TRANSFERRET', error)
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
