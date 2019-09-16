import { getNiuniuMatchRules, updateNiuniuMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    minUserCnt: number
    maxUserCnt: number
    startTime: number
    chkIp: boolean;
    activeRobot: boolean;
    kickTime: number;
    taxRate: number;
    userLoseProb:string;
    userWinProb:string;
    code: number;
}

type GetNiuniuMatchRulesResp = State;//获取结果NiuniuMatchRules

// initial state
const state: State = {
    minUserCnt: 0,
    maxUserCnt: 0,
    startTime: 0,
    chkIp: false,
    activeRobot: false,
    kickTime: 0,
    taxRate: 0,
    userLoseProb:"0",
    userWinProb:"0",
    code: 0
}

const mutations = {
    SET_NIUNIUMATCHRULES: (state: State, data: GetNiuniuMatchRulesResp) => {
        state.chkIp = data.chkIp
        state.minUserCnt = data.minUserCnt
        state.maxUserCnt = data.maxUserCnt
        state.startTime = data.startTime
        state.activeRobot = data.activeRobot
        state.kickTime = data.kickTime
        state.taxRate = data.taxRate
        state.userLoseProb = data.userLoseProb
        state.userWinProb = data.userWinProb
    },
    UPDATE_NIUNIUMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetNiuniuMatchRules(context: { commit: Commit, state: State }) { //获取NiuniuMatchRules
        return new Promise(async (resolve, reject) => {
            getNiuniuMatchRules().then((response: { data }) => {
                context.commit('SET_NIUNIUMATCHRULES', <GetNiuniuMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateNiuniuMatchRules(context: { commit: Commit, state: State }, updateData) { //更新NiuniuMatchRules
        return new Promise(async (resolve, reject) => {
            updateNiuniuMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_NIUNIUMATCHRULES', response.data.code)
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
