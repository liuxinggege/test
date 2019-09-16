import { getBuyuMatchRules, updateBuyuMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

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

type GetBuyuMatchRulesResp = State;//获取结果BuyuMatchRules

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
    activeRobot: false, 
    code: 0,
}

const mutations = {
    SET_BUYUMATCHRULES: (state: State, data: GetBuyuMatchRulesResp) => {
        state.chkIp = data.chkIp;
        state.minUserCnt = data.minUserCnt;
        state.maxUserCnt = data.maxUserCnt;
        state.activeRobot = data.activeRobot;
        state.startTime = data.startTime;
        state.taxRate = data.taxRate;
        state.kickTime = data.kickTime;
        state.userWinProb = data.userWinProb;
        state.userLoseProb = data.userLoseProb;
    },
    UPDATE_BUYUMATCHRULES: (state: State, code) => {
        state.code = code

    },
}
// actions
const actions = {
    GetBuyuMatchRules(context: { commit: Commit, state: State }) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            getBuyuMatchRules().then((response: { data }) => {
                context.commit('SET_BUYUMATCHRULES', <GetBuyuMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateBuyuMatchRules(context: { commit: Commit, state: State }, updateData) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            updateBuyuMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_BUYUMATCHRULES', response.data.code)
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
