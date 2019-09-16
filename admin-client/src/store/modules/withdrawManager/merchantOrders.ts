import { getMerchantOrders } from '../../../api/admin/withdrawManager/withdraw'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    merWithdrawData: MerWithdrawData[],
    code: number
    totalCount: number
    heh: number
}
export interface MerWithdrawData {
    channel: string
    closeTime: string
    closed: boolean
    createTime: string
    deviceId: string
    deviceIp: string
    deviceType: string
    name: string
    orderAmount: string
    payeeAccount: string
    payeeName: string
    payerAccount: string
    price: string
    serviceCharge: string
    state: string
    tradeNo: string
    uid: number
    userChannel: string
    withdrawType: string
    _id: string
}
type Msg = {
    data: MerWithdrawData[]
    totalCount: number
}
type GetMerWithdraw = {
    code: number
    msg: Msg
}

// initial state
const state: State = {
    merWithdrawData: [],
    code: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_MERWITHDRAW: (state: State, data: GetMerWithdraw) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.merWithdrawData = data.msg.data
    },
}
// actions
const actions = {
    GetMerWithdraw(context: { commit: Commit, state: State }, queryItem) { //获取商户订单
        return new Promise(async (resolve, reject) => {
            getMerchantOrders(queryItem).then((response: { data }) => {
                context.commit('SET_MERWITHDRAW', <GetMerWithdraw>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    // GetMerWithdrawExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
    //     return new Promise(async (resolve, reject) => {
    //         getMerWithdrawExcel(queryItem).then((response: { data }) => {
    //             context.commit('SET_MERWITHDRAW', <GetMerWithdraw>response.data)
    //             resolve()
    //         }).catch(error => {
    //             console.error("catch", error)
    //         })
    //     });
    // },

}
export default {
    state,
    // getters,
    actions,
    mutations
}
