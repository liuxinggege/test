import { getLonghuMatchRules, updateLonghuMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    userWinProb: string,
    chkIp: boolean;
    userLoseProb: string,
    maxUserCnt: number;
    minUserCnt: number;
    activeRobot: boolean;
    startTime: number;
    taxRate: string;
    kickTime: number;
    code: number;
}

type GetLonghuMatchRulesResp = State;//获取结果BuyuMatchRules

// initial state
const state: State = {
    userWinProb: "0",
    chkIp: false,
    userLoseProb: "0",
    maxUserCnt: 0,
    minUserCnt: 0,
    activeRobot: false,
    startTime: 0,
    taxRate: "0",
    kickTime: 0,
    code: 0,
}

const mutations = {
    SET_LONGHUMATCHRULES: (state: State, data: GetLonghuMatchRulesResp) => {
        state.userWinProb = data.userWinProb
        state.chkIp = data.chkIp
        state.userLoseProb = data.userLoseProb
        state.maxUserCnt = data.maxUserCnt
        state.minUserCnt = data.minUserCnt
        state.activeRobot = data.activeRobot
        state.startTime = data.startTime
        state.taxRate = data.taxRate
        state.kickTime = data.kickTime
    },
    UPDATE_LONGHUMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetLonghuMatchRules(context: { commit: Commit, state: State }) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            getLonghuMatchRules().then((response: { data }) => {
                context.commit('SET_LONGHUMATCHRULES', <GetLonghuMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateLonghuMatchRules(context: { commit: Commit, state: State }, updateData) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            updateLonghuMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_LONGHUMATCHRULES', response.data.code)
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
