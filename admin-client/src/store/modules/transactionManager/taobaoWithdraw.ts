import {
    createTaobaoOrder,
    taobaoWithdraw,
    postTaobaoWithdrawResult,
    getTaobaoOrder,
    deleteTaobaoOrder
} from '../../../api/admin/transactionManager/transaction'
import { Commit } from 'vuex'

export interface State {
    taobaoWithdrawData: taobaoWithdrawData[],
    code: number,
    totalCount:number,
    err:string,
    message_code: string,
    message:string,
}
export interface taobaoWithdrawData {
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
// initial state
const state: State = {
    taobaoWithdrawData: [],
    totalCount:0,
    code: 0,
    message_code:"",
    message:"",
    err:"",
}

const mutations = {
    SET_TAOBAOWITHDRAW: (state: State, a: any) => {
        state.code = a.code
        state.taobaoWithdrawData = a.msg.pageData
        state.totalCount = a.msg.totalCount
    },
    SET_WITHDRAW: (state: State, a: any) => {
        state.code = a.code;
    },
    SET_ERROR: (state: State,err: any) => {
        state.code = err.code
        state.err = err.err
    },
    CLEAR_CODE: (state: State,) => {
        state.code = 0
    },
}
// actions
const actions = {
    GetTaobaoOrder(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getTaobaoOrder(queryItem).then((response: { data }) => {
                context.commit('SET_TAOBAOWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    CreateTaobaoOrder(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            createTaobaoOrder(queryItem).then((response: { data }) => {
                context.commit('SET_TAOBAOWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    DeleteTaobaoOrder(context: { commit: Commit, state: State }, queryItem) { //
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            deleteTaobaoOrder(queryItem).then((response: { data }) => {
                context.commit('SET_TAOBAOWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    TaobaoWithdraw(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            taobaoWithdraw(queryItem).then((response: { data }) => {
                context.commit('SET_WITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR',error);
                resolve()
            })
        });
    },
    PostTaobaoWithdrawResult(context: { commit: Commit, state: State }, queryItem) { //获取在线充值数据
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            postTaobaoWithdrawResult(queryItem).then((response: { data }) => {
                context.commit('SET_WITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
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
