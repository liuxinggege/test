import { getSuohaMatchRules, updateSuohaMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    chkIp: boolean;
    matchRange: number;
    maxUserCount: number;
    minUserCount: number;
    noBillMatchRobot: boolean;
    activeRobot: boolean;
    selectFaceUpTime: number;
    startTime: number;
    taxRate: string;
    turnTime: number;
    kickTime: number;
    waitTime: number;
    userLoseRate:string;
    userWinRate:string;
    code: number;
}

type GetSuohaMatchRulesResp = State;//获取结果SuohaMatchRules

// initial state
const state: State = {
    chkIp: false,
    matchRange: 0,
    maxUserCount: 0,
    minUserCount: 0,
    noBillMatchRobot: false,
    activeRobot: false,
    selectFaceUpTime: 0,
    startTime: 0,
    taxRate: "0",
    turnTime: 0,
    kickTime: 0,
    waitTime: 0,
    userLoseRate:"0",
    userWinRate:"0",
    code: 0,
}

const mutations = {
    SET_SUOHAMATCHRULES: (state: State, data: GetSuohaMatchRulesResp) => {
        state.chkIp = data.chkIp
        state.matchRange = data.matchRange
        state.maxUserCount = data.maxUserCount
        state.minUserCount = data.minUserCount
        state.noBillMatchRobot = data.noBillMatchRobot
        state.activeRobot = data.activeRobot
        state.selectFaceUpTime = data.selectFaceUpTime
        state.startTime = data.startTime
        state.taxRate = data.taxRate
        state.turnTime = data.turnTime
        state.kickTime = data.kickTime
        state.waitTime = data.waitTime
        state.userLoseRate = data.userLoseRate
        state.userWinRate = data.userWinRate
    },
    UPDATE_SUOHAMATCHRULES: (state: State, code) => {
        state.code = code

    },
}
// actions
const actions = {
    GetSuohaMatchRules(context: { commit: Commit, state: State }) { //获取SuohaMatchRules
        return new Promise(async (resolve, reject) => {
            getSuohaMatchRules().then((response: { data }) => {
                context.commit('SET_SUOHAMATCHRULES', <GetSuohaMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSuohaMatchRules(context: { commit: Commit, state: State }, updateData) { //获取SuohaMatchRules
        return new Promise(async (resolve, reject) => {
            updateSuohaMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_SUOHAMATCHRULES', response.data.code)
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
