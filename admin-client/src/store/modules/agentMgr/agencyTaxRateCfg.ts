import {
	getAgencyDiscountRateCfg,
	delAgencyDiscountRateCfg,
	updateAgencyDiscountRateCfg,
	addAgencyDiscountRateCfg,
	getDefaultRateCfg,
} from "../../../api/admin/agentMgr/agentMgr"
import { Commit } from 'vuex'

export interface AgencyTaxRateCfg {
	startGameTax: string;
	endGameTax: string;
	changeRate: string;
}
export interface AgencyTaxRateDefaultCfg {
	pid: string;
	rateTax: string[];
	GeneralAgencyTaxRateMax: string;
	isDiscount: boolean;
}
export interface State {
	taxRateCfgData: AgencyTaxRateCfg[];
	taxRateDefaultCfg: AgencyTaxRateDefaultCfg[];
	code: number;
	msg: string;
	err: string;
}

// initial state
const state: State = {
	taxRateCfgData: [{
		startGameTax: "0",
		endGameTax: "0",
		changeRate: "0",
	}],
	taxRateDefaultCfg: [{
		pid:"",
		rateTax:[],
		GeneralAgencyTaxRateMax:"",
		isDiscount:false,
	}],
	code: 0,
	msg: "",
	err: "",
}

const mutations = {

	CLEAR_AGENCYDISCOUNTRATECODE: (state: State) => {
		state.code = 0
	},
	SET_GETAGENTTAXDISCOUNTSETTING: (state: State, result) => {
		state.code = result.code;
		state.taxRateCfgData = result.msg
	},
	SET_TAXRATEDEFAULTCFG: (state: State, result) => {
		state.code = result.code;
		state.taxRateDefaultCfg = result.msg
	},
	SET_UPDATEAGENTDISCOUNTTAXSETTING: (state: State, result) => {
		state.code = result.code;
	},

	SET_ERROR: (state: State, result) => {
		state.code = result.code;
		state.err = result.err;
	}
}
// actions
const actions = {
	GetDefaultRateCfg(context: { commit: Commit, state: State },data) {
		return new Promise(async (resolve, reject) => {
			getDefaultRateCfg(data).then(response => {
				context.commit('SET_TAXRATEDEFAULTCFG', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetAgencyDiscountRateCfg(context: { commit: Commit, state: State },data) {
		return new Promise(async (resolve, reject) => {
			getAgencyDiscountRateCfg(data).then(response => {
				context.commit('SET_GETAGENTTAXDISCOUNTSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	DelAgencyDiscountRateCfg(context: { commit: Commit, state: State }, id) {
		context.commit('CLEAR_AGENCYDISCOUNTRATECODE');
		return new Promise(async (resolve, reject) => {
			delAgencyDiscountRateCfg(id).then(response => {
				context.commit('SET_UPDATEAGENTDISCOUNTTAXSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	UpdateAgencyDiscountRateCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_AGENCYDISCOUNTRATECODE');
		return new Promise(async (resolve, reject) => {
			updateAgencyDiscountRateCfg(data).then(response => {
				context.commit('SET_UPDATEAGENTDISCOUNTTAXSETTING', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	AddAgencyDiscountRateCfg(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_AGENCYDISCOUNTRATECODE');
		return new Promise(async (resolve, reject) => {
			addAgencyDiscountRateCfg(data).then(response => {
				context.commit('SET_UPDATEAGENTDISCOUNTTAXSETTING', response.data)
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
