import {
    getPayOrder,
    createPayOrder,
    getPayConfig,
    closePayOrder
} from '../../../api/admin/transactionManager/transaction'
import { Commit } from 'vuex'

export interface State {
    payWithdrawData: payWithdrawData[],
    payConfigData:any,
    code: number,
    totalCount:number,
    err:string,
    message_code: string,
    message:string,
}
export interface payWithdrawData {
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
    payWithdrawData: [],
    payConfigData:[],
    totalCount:0,
    code: 0,
    message_code:"",
    message:"",
    err:"",
}

const mutations = {
    SET_PAYWITHDRAW: (state: State, a: any) => {
        state.code = a.code
        state.payWithdrawData = a.msg.pageData
        state.totalCount = a.msg.totalCount
    },
    SET_PAYCREATE: (state: State, a: any) => {
        state.code = a.code
    },
    SET_PAYCONFIG: (state: State, a: any) => {
        state.code = a.code
        state.payConfigData = a.msg
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
    GetPayOrder(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getPayOrder(queryItem).then((response: { data }) => {
                context.commit('SET_PAYWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    CreatePayOrder(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            createPayOrder(queryItem).then((response: { data }) => {
                context.commit('SET_PAYCREATE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    GetPayConfig(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getPayConfig(queryItem).then((response: { data }) => {
                context.commit('SET_PAYCONFIG', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    ClosePayOrder(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            closePayOrder(queryItem).then((response: { data }) => {
                console.log(response);
                //context.commit('SET_PAYCREATE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    }
}
export default {
    state,
    // getters,
    actions,
    mutations
}
