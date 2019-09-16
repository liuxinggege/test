import { getBrnnMatchRules, updateBrnnMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    minUserCnt: Number,                                                 // 最小人数
    maxUserCnt: Number,                                                 // 最大人数
    startTime: Number,                                                  // 开始时间
    kickTime: Number,                                                   // 用户无操作踢出时间
    chkIp: Boolean,                                                   // 匹配iP
    taxRate: String,                                                    // 税率
    userWinProb: String,                                                // 个人水位赢几率
    userLoseProb: String,                                               // 个人水位输几率
    activeRobot: Boolean,                                              // 机器人开关
    gameAllKillProb: Number,                                            // 通杀几率
    gameAllLoseProb: Number,                                       // 通赔几率
    code: number;                                          
}

type GetBrnnMatchRulesResp = State;//获取结果BrnnMatchRules

// initial state
const state: State = {
    minUserCnt: 0,                                                 // 最小人数
    maxUserCnt: 0,                                                 // 最大人数
    startTime: 0,                                                  // 开始时间
    kickTime: 0,                                       // 用户无操作踢出时间
    chkIp: false,                                                   // 匹配iP
    taxRate: "0",                                                    // 税率
    userWinProb: "0",                                                // 个人水位赢几率
    userLoseProb: "0",                                               // 个人水位输几率
    activeRobot: false,                                              // 机器人开关
    gameAllKillProb: 0,                                            // 通杀几率
    gameAllLoseProb: 0,                                             // 通赔几率
    code: 0
}

const mutations = {
    SET_BRNNMATCHRULES: (state: State, data: GetBrnnMatchRulesResp) => {
        state.minUserCnt = data.minUserCnt
        state.maxUserCnt = data.maxUserCnt
        state.startTime = data.startTime
        state.kickTime = data.kickTime
        state.taxRate = data.taxRate
        state.chkIp = data.chkIp
        state.userWinProb = data.userWinProb
        state.userLoseProb = data.userLoseProb
        state.activeRobot = data.activeRobot
        state.gameAllKillProb = data.gameAllKillProb
        state.gameAllLoseProb = data.gameAllLoseProb
    },
    UPDATE_BRNNMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetBrnnMatchRules(context: { commit: Commit, state: State }) { //获取BrnnMatchRules
        return new Promise(async (resolve, reject) => {
            getBrnnMatchRules().then((response: { data }) => {
                context.commit('SET_BRNNMATCHRULES', <GetBrnnMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateBrnnMatchRules(context: { commit: Commit, state: State }, updateData) { //更新BrnnMatchRules
        return new Promise(async (resolve, reject) => {
            updateBrnnMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_BRNNMATCHRULES', response.data.code)
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
