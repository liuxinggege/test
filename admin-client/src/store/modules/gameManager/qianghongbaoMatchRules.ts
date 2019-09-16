import { getQianghongbaoMatchRules, updateQianghongbaoMatchRules } from '../../../api/admin/gameManager/gameManager'
import { Commit } from 'vuex'

export interface State {
    minUserCnt: Number,                                                 // 最小人数
    maxUserCnt: Number,                                                 // 最大人数
    startTime: Number,                                                  // 开始时间
    kickTime: Number,                                       // 用户无操作踢出时间
    chkIp: Boolean,                                                   // 匹配iP
    taxRate: String,                                                    // 税率
    userWinProb: String,                                                // 个人水位赢几率
    userLoseProb: String,                                               // 个人水位输几率
    activeRobot: Boolean,
    code: number;
}

type GetQianghongbaoMatchRulesResp = State;//获取结果BuyuMatchRules

// initial state
const state: State = {
    minUserCnt: 0,
    maxUserCnt: 0,
    startTime: 0,
    kickTime: 0,
    chkIp: false,
    taxRate: "0",
    activeRobot: true,
    userWinProb: "0",
    userLoseProb: "0",
    code: 0,
}

const mutations = {
    SET_QIANGHONGBAOMATCHRULES: (state: State, data: GetQianghongbaoMatchRulesResp) => {
        state.minUserCnt = data.minUserCnt
        state.maxUserCnt = data.maxUserCnt
        state.startTime = data.startTime
        state.kickTime = data.kickTime
        state.chkIp = data.chkIp
        state.taxRate = data.taxRate
        state.activeRobot = data.activeRobot
        state.userWinProb = data.userWinProb
        state.userLoseProb = data.userLoseProb
    },
    UPDATE_QIANGHONGBAOMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetQianghongbaoMatchRules(context: { commit: Commit, state: State }) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            getQianghongbaoMatchRules().then((response: { data }) => {
                context.commit('SET_QIANGHONGBAOMATCHRULES', <GetQianghongbaoMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                resolve()
            })
        });
    },
    UpdateQianghongbaoMatchRules(context: { commit: Commit, state: State }, updateData) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            updateQianghongbaoMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_QIANGHONGBAOMATCHRULES', response.data.code)
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
