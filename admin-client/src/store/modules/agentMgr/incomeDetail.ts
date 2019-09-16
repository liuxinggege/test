import { getGrandsonDetail } from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
    agencyIncomeDetailData: any[]
    totalCount: number
    grandsonIncomeDetailData: any[]
    grandsonTotalCount: number
    totalIncome: number
    code: number
    msg: string
}


type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
    agencyIncomeDetailData: [],
    totalCount: 0,
    grandsonIncomeDetailData: [],
    grandsonTotalCount: 0,
    totalIncome: 0,
    code: 0,
    msg: "",
}

const mutations = {
    SET_INCOMEDETAIL: (state: State, result: CodeMsg<any>) => {
        state.code = result.code;
        state.agencyIncomeDetailData = result.msg.pageData
        state.totalCount = result.msg.totalCount
        state.totalIncome = result.msg.totalIncome || 0

    },
    SET_GRANDSONINCOMEDETAIL: (state: State, result: CodeMsg<any>) => {
        state.code = result.code;
        state.grandsonIncomeDetailData = result.msg.pageData
        state.grandsonTotalCount = result.msg.totalCount

    },
    SET_INCOMEDETAILERROR: (state: State, result: CodeMsg<any>) => {
        state.msg = result.err;
        state.code = result.code;
    },

}
// actions
const actions = {
    GetGrandsonDetail(context: { commit: Commit, state: State }, data) {//pageData用
        return new Promise(async (resolve, reject) => {
            getGrandsonDetail(data).then(response => {
                context.commit('SET_GRANDSONINCOMEDETAIL', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_INCOMEDETAILERROR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },

}
export default {
    state,
    actions,
    mutations
}
