import {
    getRepeat,
    updateRepeat,
    getRepeatByExcel,
} from '../../../api/admin/transactionManager/transaction'
import { Commit } from 'vuex'

export interface State {
    rechargeCallbackData: RechargeCallbackData[],
    code: number,
    totalCount: number,
    err: string,
}
export interface RechargeCallbackData {
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
    rechargeCallbackData: [],
    totalCount: 0,
    code: 0,
    err: "",
}

const mutations = {

    SET_REPEAT: (state: State, a: any) => {
        state.code = a.code;
        state.rechargeCallbackData = a.msg.pageData;
        state.totalCount = a.msg.totalCount;
    },
    SET_CODE: (state: State, err: any) => {
        state.code = err.code
        state.err = err.err
    },
    SET_ERROR: (state: State, err: any) => {
        state.code = err.code
        state.err = err.err
    },
    CLEAR_CODE: (state: State, ) => {
        state.code = 0
    },
}
// actions
const actions = {
    GetRepeat(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getRepeat(queryItem).then((response: { data }) => {
                context.commit('SET_REPEAT', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error);
                resolve()
            })
        });
    },
    GetRepeatByExcel(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getRepeatByExcel(queryItem).then((response: { data }) => {
                resolve( response.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error);
                resolve()
            })
        });
    },
    UpdateRepeat(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            updateRepeat(queryItem).then((response: { data }) => {
                context.commit('SET_CODE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error);
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
