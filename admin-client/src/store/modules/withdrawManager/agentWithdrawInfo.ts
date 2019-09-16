import { getAgentWithdrawInfo } from '../../../api/admin/withdrawManager/withdraw'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    transferData: AgentWithdrawInfoData[],
    code: number
    totalCount: number
    heh:number
}
export interface AgentWithdrawInfoData {
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
    data: AgentWithdrawInfoData[]
    totalCount: number
}
type GetAgentWithdrawInfo = {
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
    SET_OFFICIALWITHDRAW: (state: State, data: GetAgentWithdrawInfo) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.data
       
    },
}
// actions
const actions = {
    GetAgentWithdrawInfo(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getAgentWithdrawInfo(queryItem).then((response: { data }) => {
                context.commit('SET_OFFICIALWITHDRAW', <GetAgentWithdrawInfo>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetAgentWithdrawInfoExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            // getAgentWithdrawInfoExcel(queryItem).then((response: { data }) => {
            //     context.commit('SET_OFFICIALWITHDRAW', <GetAgentWithdrawInfo>response.data)
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
