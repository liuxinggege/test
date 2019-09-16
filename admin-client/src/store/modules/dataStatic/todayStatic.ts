import { formUtil } from "../../../utils/formatUtils";
import { getTodayStatic, getExportCDaySum } from '../../../api/admin/dataStatic/dataStatic'
import { Commit } from 'vuex'

export interface State {
    transferData: TodayStaticData[],
    code: number
    totalCount: number
    heh: number
}
export interface TodayStaticData {
    sumDate: string
    localeSumDate: string
    channel: string
    totalProfit: string
    totalChargeAmt: string
    totalWithdrawAmt: string
    totalTax: string
    onlineChargeAmt: string
    agentChargeAmt: string
    gameTax: string
    totalWithdrawTax: string
    totalWithdrawUserCount: string
    loginUserCount: number
    newUserCount: number
    oldUserCount: number
    bindUserCount: number
    bindRate: number
    totalChargeUserCount: number
    newUserChargeUserCount: number
    payRate: number
    newUserPayRate: number
    newUserChargeAmt: string
    oldUserChargeAmt: string
    touristPresent: string
    userLeftMoney: string
    avgProfit: string
    avgChargeAmt: string
    newUserAvgChargeAmt: string
    oldUserAvgChargeAmt: string
    ltv7: string
    ltv14: string
    ltv30: string
    ltv60: string
}
type Msg = {
    data: TodayStaticData[]
    totalCount: number
}
type GetTodayStatic = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    transferData: [],
    code: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_TODAYSTATIC: (state: State, data: GetTodayStatic) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.data.map(e => {
            e.totalProfit = formUtil.moneyFormat(e.totalProfit);
            e.totalChargeAmt = formUtil.moneyFormat(e.totalChargeAmt);
            e.totalWithdrawAmt = formUtil.moneyFormat(e.totalWithdrawAmt);
            e.totalWithdrawTax = formUtil.moneyFormat(e.totalWithdrawTax);
            e.totalTax = formUtil.moneyFormat(e.totalTax);
            e.onlineChargeAmt = formUtil.moneyFormat(e.onlineChargeAmt);
            e.agentChargeAmt = formUtil.moneyFormat(e.agentChargeAmt);
            e.gameTax = formUtil.moneyFormat(e.gameTax);
            e.newUserChargeAmt = formUtil.moneyFormat(e.newUserChargeAmt);
            e.oldUserChargeAmt = formUtil.moneyFormat(e.oldUserChargeAmt);
            e.touristPresent = formUtil.moneyFormat(e.touristPresent);
            e.avgProfit = formUtil.moneyFormat(e.avgProfit);
            e.avgChargeAmt = formUtil.moneyFormat(e.avgChargeAmt);
            e.newUserAvgChargeAmt = formUtil.moneyFormat(e.newUserAvgChargeAmt);
            e.oldUserAvgChargeAmt = formUtil.moneyFormat(e.oldUserAvgChargeAmt);
            e.ltv7 = formUtil.moneyFormat(e.ltv7);
            e.ltv14 = formUtil.moneyFormat(e.ltv14);
            e.ltv30 = formUtil.moneyFormat(e.ltv30);
            e.ltv60 = formUtil.moneyFormat(e.ltv60);
            return e;
        })

    },
}
// actions
const actions = {
    GetTodayStatic(context: { commit: Commit, state: State }, queryItem) { //获取每日统计总会-历史
        return new Promise(async (resolve, reject) => {
            getTodayStatic(queryItem).then((response: { data }) => {
                context.commit('SET_TODAYSTATIC', <GetTodayStatic>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetExportCDaySum(context: { commit: Commit, state: State }, queryItem) { //导出Excel
        return new Promise(async (resolve, reject) => {
            getExportCDaySum(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)

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
