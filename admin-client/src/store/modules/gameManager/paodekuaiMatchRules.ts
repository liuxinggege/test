import { getPaodekuaiMatchRules, updatePaodekuaiMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    minUserCnt: number,
    maxUserCnt: number,
    startTime: number,
    kickTime: number,
    chkIp: boolean,
    activeRobot: boolean,
    taxRate: string,
    userLoseProb:string,
    userWinProb:string,
    code:number
}

type GetPaodekuaiMatchRulesResp = State;//获取结果BuyuMatchRules

// initial state
const state: State = {
    minUserCnt: 0,
    maxUserCnt: 0,
    startTime: 0,
    kickTime: 0,
    chkIp: false,
    activeRobot: false,
    taxRate: "",
    userLoseProb:"0",
    userWinProb:"0",
    code:0
}

const mutations = {
    SET_PAODEKUAIMATCHRULES: (state: State, data: GetPaodekuaiMatchRulesResp) => {
        state.minUserCnt = data.minUserCnt,
        state.maxUserCnt = data.maxUserCnt,
        state.startTime = data.startTime,
        state.kickTime = data.kickTime,
        state.chkIp = data.chkIp,
        state.activeRobot = data.activeRobot,
        state.taxRate = data.taxRate
        state.userLoseProb = data.userLoseProb;
        state.userWinProb = data.userWinProb;
        state.code = data.code
    },
    UPDATE_PAODEKUAIMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetPaodekuaiMatchRules(context: { commit: Commit, state: State }) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            getPaodekuaiMatchRules().then((response: { data }) => {
                context.commit('SET_PAODEKUAIMATCHRULES', <GetPaodekuaiMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                resolve()
            })
        });
    },
    UpdatePaodekuaiMatchRules(context: { commit: Commit, state: State }, updateData) { //获取BuyuMatchRules
        return new Promise(async (resolve, reject) => {
            updatePaodekuaiMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_PAODEKUAIMATCHRULES', response.data.code)
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
