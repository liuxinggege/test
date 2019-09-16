import { getJinhuaMatchRules,getGameUserWinAndLose, updateJinhuaMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    chkIp: boolean;
    startTime: number;
    activeRobot: boolean;
    kickTime: number;
    taxRate: number;
    minUserCnt: number;
    maxUserCnt: number;
    userLoseProb:string;
    userWinProb:string;
    code: number;
}

type GetJinhuaMatchRulesResp = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
    chkIp: false,
    activeRobot: false,
    kickTime: 0,
    startTime: 0,
    taxRate: 0,
    minUserCnt: 0,
    maxUserCnt: 0,
    userLoseProb:"0",
    userWinProb:"0",
    code: 0
}

const mutations = {
    SET_JINHUAMATCHRULES: (state: State, data: GetJinhuaMatchRulesResp) => {
        state.chkIp = data.chkIp
        state.activeRobot = data.activeRobot
        state.kickTime = data.kickTime
        state.startTime = data.startTime
        state.taxRate = data.taxRate
        state.minUserCnt = data.minUserCnt
        state.maxUserCnt = data.maxUserCnt
        state.userLoseProb = data.userLoseProb
        state.userWinProb = data.userWinProb
    },
    UPDATE_JINHUAMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetJinhuaMatchRules(context: { commit: Commit, state: State }) { //获取JinhuaMatchRules
        return new Promise(async (resolve, reject) => {
            getJinhuaMatchRules().then((response: { data }) => {
                context.commit('SET_JINHUAMATCHRULES', <GetJinhuaMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateJinhuaMatchRules(context: { commit: Commit, state: State }, updateData) { //获取JinhuaMatchRules
        return new Promise(async (resolve, reject) => {
            updateJinhuaMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_JINHUAMATCHRULES', response.data.code)
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
