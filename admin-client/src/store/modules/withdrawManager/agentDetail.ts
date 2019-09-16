import { getAgentDetail } from '../../../api/admin/withdrawManager/withdraw'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    transferData: AgentDetailData[],
    code: number
    totalCount: number
    heh:number
}
export interface AgentDetailData {
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
    data: AgentDetailData[]
    totalCount: number
}
type GetAgentDetail = {
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
    SET_AGENTDETAIL: (state: State, data: GetAgentDetail) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.data
       
    },
}
// actions
const actions = {
    GetAgentDetail(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getAgentDetail(queryItem).then((response: { data }) => {
                context.commit('SET_AGENTDETAIL', <GetAgentDetail>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetAgentDetailExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            // getAgentDetailExcel(queryItem).then((response: { data }) => {
            //     context.commit('SET_AGENTDETAIL', <GetAgentDetail>response.data)
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
