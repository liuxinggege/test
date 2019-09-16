import { getAgentException } from '../../../api/admin/withdrawManager/withdraw'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    transferData: AgentExceptionData[],
    code: number
    totalCount: number
    heh:number
}
export interface AgentExceptionData {
    account:string
    channel:string
    createTime:string
    finishTime:string
    id:string
    ip:string
    money:string
    name:string
    state:number
    stateName:string
    tax:string
    totalRecharge:string
    uid:number
    unfinishedWithdrawAmount:string
    userMoneyAfter:string
    userMoneyPre:string
}
type Msg = {
    data: AgentExceptionData[]
    totalCount: number
}
type GetAgentException = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    transferData: [],
    code: 0,
    totalCount: 0,
    heh:0,
}

const mutations = {
    SET_OFFICIALWITHDRAW: (state: State, data: GetAgentException) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.data
       
    },
}
// actions
const actions = {
    GetAgentException(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getAgentException(queryItem).then((response: { data }) => {
                context.commit('SET_OFFICIALWITHDRAW', <GetAgentException>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetAgentExceptionExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            // getAgentExceptionExcel(queryItem).then((response: { data }) => {
            //     context.commit('SET_OFFICIALWITHDRAW', <GetAgentException>response.data)
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
