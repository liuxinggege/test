import { getSubmitBalanceData, comfirmSubmitBalance, moneyHistoryExport } from '../../../api/agent/submitBalance/submitBalance'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    submitBalanceData: any
    balanceInfo: BalanceInfoType[]
    msg: string
    code: number
    totalCount: number
    totalIncome: string
    totalSetMoney: string
}

export interface BalanceInfoType {
    logDate: Date
    recordType: string
    beforeSet: string
    afterSet: string
    changeMoney: string
}
// initial state
const state: State = {
    submitBalanceData: [],
    balanceInfo: [],
    code: 0,
    msg: "",
    totalCount: 0,
    totalIncome: "0",
    totalSetMoney: "0"
}

const mutations = {

    CLEAR_CODE1: (state: State, data: any) => {
        state.code = 0
        state.msg = "";
    },

    SET_GETBALANCEMONEY: (state: State, data: any) => {
        state.code = data.code
    },

    SET_GETSUBMITBALANCEDATA: (state: State, data: any) => {
        state.submitBalanceData = data.msg.pageData
        state.totalCount = data.msg.totalCount
        state.totalIncome = data.msg.totalIncome
        state.totalSetMoney = data.msg.totalSetMoney
        state.code = data.code
    },

    SET_COMFIRMSUBMITBALANCE: (state: State, data: any) => {
        state.code = data.code
        state.msg = JSON.stringify(data.err)
    },
}
// actions
const actions = {

    GetSubmitBalanceData(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            context.commit('CLEAR_CODE1')
            getSubmitBalanceData(queryItem).then((response: { data }) => {
                context.commit('SET_GETSUBMITBALANCEDATA', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    MoneyHistoryExport(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            context.commit('CLEAR_CODE1')
            moneyHistoryExport(queryItem).then((response: { data }) => {
                resolve(response.data);
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    ComfirmSubmitBalance(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            context.commit('CLEAR_CODE1')
            comfirmSubmitBalance(queryItem).then((response: { data }) => {
                context.commit('SET_COMFIRMSUBMITBALANCE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_COMFIRMSUBMITBALANCE', error)
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
