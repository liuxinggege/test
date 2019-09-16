import {getRechargeQuestion, editOrderId,replyRechargeQuestion,getRechargeQuestionExcel} from '../../../api/admin/transactionManager/transaction'
import { Commit } from 'vuex'

export interface State {
    rechargeQuestionData: rechargeQuestionData[],
    code: number,
    totalCount:number,
    err:string,
    message:string,
}
export interface rechargeQuestionData {
    createTime: Date
    name: string
    uid: number
    pid: string
    rechargeTime: Date
    money: string
    type: string
    qq: string
    description: string
    state: string
    orderId: String
    operater: string
    image: string[]
    _id: string
}
// initial state
const state: State = {
    rechargeQuestionData: [],
    totalCount:0,
    code: 0,
    message:"",
    err:"",
}

const mutations = {
    SET_rechargeQuestion: (state: State, a: any) => {
        state.code = a.code
        state.rechargeQuestionData = a.msg.pageData
        state.totalCount = a.msg.totalCount
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
    GetRechargeQuestion(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getRechargeQuestion(queryItem).then((response: { data }) => {
                context.commit('SET_rechargeQuestion', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR',error);
                resolve()
            })
        });
    },
    EditOrderId(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            editOrderId(queryItem).then((response: { data }) => {
                context.commit('SET_rechargeQuestion', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR',error);
                resolve()
            })
        });
    },
    ReplyRechargeQuestion(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            replyRechargeQuestion(queryItem).then((response: { data }) => {
                context.commit('SET_rechargeQuestion', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR',error);
                resolve()
            })
        });
    },
    GetRechargeQuestionExcel(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getRechargeQuestionExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
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
