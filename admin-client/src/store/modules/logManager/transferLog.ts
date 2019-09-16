import { getTransferLog, getTransferLogExcel } from '../../../api/admin/logManage/log'
import { Commit } from 'vuex'

export interface State {
    transferLogData: TransferLogData[],
    code: number
    totalCount: number
}
export interface TransferLogData {
    account: string;
    amount: {};
    from: number;
    fromBankGoldAfter: string;
    fromBankGoldBefore: string;
    fromGoldAfter: string;
    fromGoldBefore: string;
    fromType: number;
    logDate: Date;
    to: number;
    toBankGoldAfter: string;
    toBankGoldBefore: string;
    toGoldAfter: string;
    toGoldBefore: string;
    transferMoney: string;
    transferTime: string;
    _id: string;
}
type Msg = {
    data: TransferLogData[]
    totalCount: number
}
type GetTransferLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    transferLogData: [],
    code: 0,
    totalCount: 0
}

const mutations = {
    SET_TRANSFERLOG: (state: State, data: GetTransferLog) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferLogData = data.msg.data

    },
}
// actions
const actions = {
    GetTransferLog(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getTransferLog(queryItem).then((response: { data }) => {
                context.commit('SET_TRANSFERLOG', <GetTransferLog>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetTransferLogExcel(context: { commit: Commit, state: State }, queryItem) { //倒出
        return new Promise(async (resolve, reject) => {
            getTransferLogExcel(queryItem).then((response: { data }) => {
                context.commit('SET_TRANSFERLOG', <GetTransferLog>response.data)
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
