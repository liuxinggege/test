import { getOfficialWithdraw } from '../../../api/admin/transactionManager/transaction'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    transferData: OfficialWithdrawData[],
    code: number
    totalCount: number
    heh: number
}
export interface OfficialWithdrawData {
    account: string
    channel: string
    createTime: string
    finishTime: string
    id: string
    ip: string
    money: string
    name: string
    state: number
    stateName: string
    tax: string
    totalRecharge: string
    uid: number
    unfinishedWithdrawAmount: string
    userMoneyAfter: string
    userMoneyPre: string
}
type Msg = {
    pageData: OfficialWithdrawData[]
    totalCount: number
}
type GetOfficialWithdraw = {
    code: number
    msg: Msg
}

// initial state
const state: State = {
    transferData: [],
    code: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_OFFICIALWITHDRAW: (state: State, data: GetOfficialWithdraw) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.pageData
    }
}
// actions
const actions = {
    GetOfficialWithdraw(context: { commit: Commit, state: State }, queryItem) { //获取官方兑换
        return new Promise(async (resolve, reject) => {
            getOfficialWithdraw(queryItem).then((response: { data }) => {
                context.commit('SET_OFFICIALWITHDRAW', <GetOfficialWithdraw>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetOfficialWithdrawExcel(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            // getOfficialWithdrawExcel(queryItem).then((response: { data }) => {
            //     context.commit('SET_OFFICIALWITHDRAW', <GetOfficialWithdraw>response.data)
            //     resolve()
            // }).catch(error => {
            //     console.error("catch", error)
            //     
            // })
        });
    },

}
export default {
    state,
    // getters,
    actions,
    mutations
}
