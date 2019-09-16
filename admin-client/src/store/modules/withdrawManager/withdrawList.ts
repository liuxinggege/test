import { getWithdrawList } from '../../../api/admin/withdrawManager/withdraw'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    withdrawList: WithdrawList[],
    code: number
    totalCount: number
    heh: number
}
export interface WithdrawList {
    alipayAccount: string
    alipayRealName: string
    bankCardNumber: string
    bankCardRealName: string
    bankOfCreditCard: string
    channel: string
    checkDesc: string
    createTime: string
    finishTime: string
    finishedWithdrawAmount: string
    id: string
    ip: string
    money: string
    orderId: string
    state: number
    stateName: string
    status: number
    tax: string
    totalAgentRecharge: string
    totalRecharge: string
    type: number
    typeName: string
    uid: number
    unfinishedWithdrawAmount: string
    userMoneyAfter: string
    userMoneyPre: string
}
type Msg = {
    pageData: WithdrawList[]
    totalCount: number
}
type GetWithdrawList = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    withdrawList: [],
    code: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_WITHDRAWLIST: (state: State, data: GetWithdrawList) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.withdrawList = data.msg.pageData
    },
}
// actions
const actions = {
    GetWithdrawList(context: { commit: Commit, state: State }, queryItem) { //获取兑换列表
        return new Promise(async (resolve, reject) => {
            getWithdrawList(queryItem).then((response: { data }) => {
                context.commit('SET_WITHDRAWLIST', <GetWithdrawList>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    // GetBankCardExceptionExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
    //     return new Promise(async (resolve, reject) => {
    //          getBankCardExceptionExcel(queryItem).then((response: { data }) => {
    //              context.commit('SET_BANKCARDEXCEPTION', <GetWithdrawList>response.data)
    //              resolve()
    //          }).catch(error => {
    //              console.error("catch", error)
    //              
    //          })
    //     });
    // },

}
export default {
    state,
    // getters,
    actions,
    mutations
}
