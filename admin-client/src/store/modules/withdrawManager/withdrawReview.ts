import { getWithdrawReviewList, upadteOrders, exportWithdrawOrders, reFundOrder, closeOrder, exportBillOrderList } from '../../../api/admin/withdrawManager/withdraw'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    withdrawReviewData: withdrawReviewData[],
    code: number
    totalCount: number
    message: string
}
export interface withdrawReviewData {
    alipayAccount: string
    alipayRealName: string
    bankCardNumber: string
    bankCardRealName: string
    checkDesc: string
    createTime: string
    descripition: string
    finishTime: string
    finishedWithdrawAmount: string
    id: string
    ip: string
    ipLocation: string
    money: string
    orderId: string
    state: number
    stateName: string
    statusDesc: string
    tax: string
    totalAgentRecharge: string
    totalRecharge: string
    type: string
    typeName: string
    uid: number
    unfinishedWithdrawAmount: string
    user: number
    userMoneyAfter: string
    userMoneyPre: string
    refGoldTime: Date
}
type Msg = {
    pageData: withdrawReviewData[]
    totalCount: number
}
type GetWithdrawReviewList = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    withdrawReviewData: [],
    code: 0,
    totalCount: 0,
    message: "",
}

const mutations = {
    SET_ORDERS: (state: State, data: GetWithdrawReviewList) => {
        state.totalCount = data.msg.totalCount
        state.withdrawReviewData = data.msg.pageData
    },
    SET_UPDATEORDER: (state: State, code: number) => {
        state.code = code
    },
    SET_ERROR: (state: State, error: any) => {
        if (error.code && error.code === 507) {
            state.message = "银行卡兑换每日限制为一次"
        } else {
            state.message = error.err ? error.err : "";
        }
    },
    SET_CLOSEERROR: (state: State, error: any) => {
        state.code = error.code
        state.message = error.err
    },
    SET_CLEAR: (state: State) => {
        state.withdrawReviewData = [];
        state.code = 0;
        // state.totalCount = 0;
        state.message = "";
    }
}
// actions
const actions = {
    GetWithdrawReviewList(context: { commit: Commit, state: State }, queryItem) { //获取兑换列表
        return new Promise((resolve, reject) => {
            context.commit('SET_CLEAR');
            getWithdrawReviewList(queryItem).then((response: { data }) => {
                context.commit('SET_ORDERS', <GetWithdrawReviewList>response.data);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetWithdrawReviewListExcel(context: { commit: Commit, state: State }, queryItem) { //导出Excel
        return new Promise((resolve, reject) => {
            let start = new Date();
            console.log("GetWithdrawReviewListExcel start:", start);
            exportWithdrawOrders(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    GetBillOrderListExcel(context: { commit: Commit, state: State }, queryItem) { //导出billOrderExcel
        return new Promise((resolve, reject) => {
            let start = new Date();
            exportBillOrderList(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },

    UpadteOrders(context: { commit: Commit, state: State }, queryItem) { //通过或者拒绝兑换
        return new Promise((resolve, reject) => {
            upadteOrders(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEORDER', response.data.code);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    ReFundOrder(context: { commit: Commit, state: State }, queryItem) { //退款
        return new Promise((resolve, reject) => {
            reFundOrder(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEORDER', response.data.code);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    CloseOrder(context: { commit: Commit, state: State }, queryItem) { //通过或者拒绝兑换
        return new Promise((resolve, reject) => {
            closeOrder(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEORDER', response.data.code);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_CLOSEERROR', error)
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
