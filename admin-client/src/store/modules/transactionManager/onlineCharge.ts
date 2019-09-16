import {
    getOnlineCharge,
    getOnlineChargeExcel,
    onlineRechargeCb
} from '../../../api/admin/transactionManager/transaction'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    transferData: OnlineChargeData[],
    code: number
    onlineRechargeCode: number
    totalCount: number
    heh: number
}
export interface OnlineChargeData {
    act: string
    channel: string
    closed: boolean
    createTime: string
    deviceIp: string
    deviceType: string
    goodsPrice: string
    name: string
    orderedTime: string
    payType: string
    price: number
    state: string
    thirdOrderId: string
    time: string
    uid: number
    userChannel: string
    _id: string
}
type Msg = {
    message: OnlineChargeData[]
    totalCount: number
}
type GetOnlineCharge = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    transferData: [],
    code: 0,
    onlineRechargeCode: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_ONLINECHARGE: (state: State, a: any) => {
        state.code = a.code
        state.totalCount = a.msg.totalCount
        state.transferData = a.msg.message
    },
    SET_ONLINERECHARGECB: (state: State, a: any) => {
        state.code = a.code
    },
    CLEAR_CODE: (state: State) => {
        state.code = 0
        state.onlineRechargeCode = 0
    },
}
// actions
const actions = {
    GetOnlineCharge(context: { commit: Commit, state: State }, queryItem) { //获取在线充值数据
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getOnlineCharge(queryItem).then((response: { data }) => {
                context.commit('SET_ONLINECHARGE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetOnlineChargeExcel(context: { commit: Commit, state: State }, queryItem) { //导出在线充值
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getOnlineChargeExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    OnlineRechargeCb(context: { commit: Commit, state: State }, parameter) { //发送http请求解决未到账金币问题
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            onlineRechargeCb(parameter).then((response: { data }) => {
                context.commit('SET_ONLINERECHARGECB', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ONLINERECHARGECB', error)
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
