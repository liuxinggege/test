import { getErmjMatchRules, updateErmjMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    minUserCnt: number;
    maxUserCnt: number;
    startTime: number;
    kickTime: number;
    chkIp: boolean;
    taxRate: string;
    activeRobot: boolean;
    userLoseProb:string;
    userWinProb:string;
    code: number;

}

type GetErmjMatchRulesResp = State;//获取结果BuyuMatchRules

// initial state
const state: State = {
    chkIp: false,
    maxUserCnt: 0,
    minUserCnt: 0,
    activeRobot: false,
    startTime: 0,
    taxRate: "0",
    kickTime: 0,
    userLoseProb:"0",
    userWinProb:"0",
    code: 0,
}

const mutations = {
    SET_ERMJMATCHRULES: (state: State, data: GetErmjMatchRulesResp) => {
        state.chkIp = data.chkIp
        state.maxUserCnt = data.maxUserCnt
        state.minUserCnt = data.minUserCnt
        state.activeRobot = data.activeRobot
        state.startTime = data.startTime
        state.taxRate = data.taxRate
        state.kickTime = data.kickTime
        state.userLoseProb = data.userLoseProb
        state.userWinProb = data.userWinProb
    },
    UPDATE_ERMJMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetErmjMatchRules(context: { commit: Commit, state: State }) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            getErmjMatchRules().then((response: { data }) => {
                context.commit('SET_ERMJMATCHRULES', <GetErmjMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateErmjMatchRules(context: { commit: Commit, state: State }, updateData) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            updateErmjMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_ERMJMATCHRULES', response.data.code)
                resolve()
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
