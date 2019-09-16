import { getChannelInfo, getChannelInfoExcel } from '../../../api/admin/dataStatic/channelInfo'
import { Commit } from 'vuex'
import { formUtil } from "../../../utils/formatUtils";
export interface State {
	channelInfoData: channelInfoType[]
	totalCount: number
	code: number
	channels: string[]
	channelCode: number
	error: string,
}

export interface channelInfoType {
	arppu: string
	avgChargeAmt: string
	avgProfit: string
	bindAndChargeRate: number
	bindRate: number
	channel: string
	gameTax: string
	localeSumDate: Date
	logDate: Date
	newUserAvgChargeAmt: string
	newUserChargeAmt: string
	newUserChargeCount: number
	newUserPayRate: number
	oldUserAvgChargeAmt: string
	oldUserChargeAmt: string
	oldUserChargeCount: number
	oldUserCount: number
	payRate: number
	platform: string
	profitRate: number
	regAndBindRate: number
	regAndChargeRate: number
	sumDate: Date
	totalChargeAmt: string
	totalChargeCount: number
	totalProfit: string
	totalTax: string
	userLeftMoney: string
	retentionDay2: number
	retentionDay3: number
	retentionDay7: number
	retentionDay15: number
	retentionDay30: number
}

// initial state
const state: State = {
	channelInfoData: [],
	totalCount: 0,
	code: 0,
	channels: [],
	channelCode: 0,
	error: "",
}

const mutations = {
	CLEAR_CODE: (state: State) => {
		state.code = 0;
	},

	SET_ALLCHANNELS: (state: State, result: any) => {
		state.channelInfoData = result.msg.pageData.map(e => {
			e.totalChargeAmt = formUtil.moneyFormat(e.totalChargeAmt);
			e.totalWithdrawAmt = formUtil.moneyFormat(e.totalWithdrawAmt);
			e.totalProfit = formUtil.moneyFormat(e.totalProfit);
			e.gameTax = formUtil.moneyFormat(e.gameTax);
			e.newUserChargeAmt = formUtil.moneyFormat(e.newUserChargeAmt);
			e.androidNewUserChargeAmt = formUtil.moneyFormat(e.androidNewUserChargeAmt);
			e.iosNewUserChargeAmt = formUtil.moneyFormat(e.iosNewUserChargeAmt);
			e.onlineChargeAmt = formUtil.moneyFormat(e.onlineChargeAmt);
			e.agentChargeRmbAmt = formUtil.moneyFormat(e.agentChargeRmbAmt);
			e.totalTax = formUtil.moneyFormat(e.totalTax);
			return e;
		});
		state.code = result.code;
		state.totalCount = result.msg.totalCount;
	},
	SET_ERROR: (state: State, result: any) => {
		state.code = result.code;
		state.error = result.err;
	},

}
// actions
const actions = {
	GetAllChannelsInfo(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getChannelInfo(data).then(response => {
				context.commit('SET_ALLCHANNELS', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	GetAllChannelsExcel(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getChannelInfoExcel(data).then(response => {
				console.log(response)
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
	// getters,
	actions,
	mutations
}
