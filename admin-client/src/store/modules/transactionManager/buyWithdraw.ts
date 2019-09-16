import {
    getBuyOrder,
    createBuyOrder,
    deleteBuyOrder,
    buyWithdraw,
    getBuyWithdrawResult
} from '../../../api/admin/transactionManager/transaction'
import { Commit } from 'vuex'

//定义接口
export interface State {
    buyWithdrawData: buyWithdrawData[],//数据
    code: number,//状态码
    totalCount:number,//总数
    err:string,//错误信息
    message_code: string,
    message:string,//提示信息
}
export interface buyWithdrawData {//提交状态数据类型定义
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

//初始状态
const state: State = {
    buyWithdrawData: [],
    totalCount:0,
    code: 0,
    message_code:"",
    message:"",
    err:"",
}

//mutation 状态提交集合
const mutations = {
    SET_BUYWITHDRAW: (state: State, a: any) => {
        state.code = a.code
        state.buyWithdrawData = a.msg.pageData
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

//actions 函数集合
const actions = {
    GetBuyOrder(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getBuyOrder(queryItem).then((response: { data }) => {
                context.commit('SET_BUYWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    CreateBuyOrder(context: { commit: Commit, state: State }, queryItem) { 
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            createBuyOrder(queryItem).then((response: { data }) => {
                context.commit('SET_BUYWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    DeleteBuyOrder(context: { commit: Commit, state: State }, queryItem) { //
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            deleteBuyOrder(queryItem).then((response: { data }) => {
                context.commit('SET_BUYWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    },
    BuyWithdraw(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            buyWithdraw(queryItem).then((response: { data }) => {
                context.commit('SET_WITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR',error);
                resolve()
            })
        });
    },
    GetBuyWithdrawResult(context: { commit: Commit, state: State }, queryItem) { //获取在线充值数据
        context.commit('CLEAR_CODE')
        return new Promise(async (resolve, reject) => {
            getBuyWithdrawResult(queryItem).then((response: { data }) => {
                context.commit('SET_WITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error);
                context.commit('SET_ERROR',error);
                context.commit('CLEAR_CODE',error);
                resolve()
            })
        });
    }
}

//暴露出去
export default {
    state,
    // getters,
    actions,
    mutations
}