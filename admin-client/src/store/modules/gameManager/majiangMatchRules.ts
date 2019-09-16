import { getMajiangMatchRules, updateMajiangMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    changeThreeCardAnimalTime: number;
    changeThreeCardTime: number;
    dingQueTime: number;
    gameResultTime: number;
    chkIp: boolean;
    matchRange: number;
    noBillMatchRobot: boolean;
    activeRobot: boolean;
    sendCardTime: number;
    startTime: number;
    taxRate: string;
    kickTime: number;
    userOptTime: number;
    waitTime: number;
    userLoseRate:string;
    userWinRate:string;
    code: number;
}

type GetMajiangMatchRulesResp = State;//获取结果MajiangMatchRules

// initial state
const state: State = {
    changeThreeCardAnimalTime: 0,
    changeThreeCardTime: 0,
    dingQueTime: 0,
    gameResultTime: 0,
    chkIp: false,
    matchRange: 0,
    noBillMatchRobot: false,
    activeRobot: false,
    sendCardTime: 0,
    startTime: 0,
    taxRate: "",
    kickTime: 0,
    userOptTime: 0,
    waitTime: 0,
    userLoseRate:"0",
    userWinRate:"0",
    code: 0,
}

const mutations = {
    SET_MAJIANGMATCHRULES: (state: State, data: GetMajiangMatchRulesResp) => {
        state.changeThreeCardAnimalTime = data.changeThreeCardAnimalTime
        state.changeThreeCardTime = data.changeThreeCardTime
        state.dingQueTime = data.dingQueTime
        state.gameResultTime = data.gameResultTime
        state.chkIp = data.chkIp
        state.matchRange = data.matchRange
        state.noBillMatchRobot = data.noBillMatchRobot
        state.activeRobot = data.activeRobot
        state.sendCardTime = data.sendCardTime
        state.startTime = data.startTime
        state.taxRate = data.taxRate
        state.kickTime = data.kickTime
        state.userOptTime = data.userOptTime
        state.waitTime = data.waitTime
        state.userLoseRate = data.userLoseRate
        state.userWinRate = data.userWinRate
    },
    UPDATE_MAJIANGMATCHRULES: (state: State, code) => {
        state.code = code

    },
}
// actions
const actions = {
    GetMajiangMatchRules(context: { commit: Commit, state: State }) { //获取MajiangMatchRules
        return new Promise(async (resolve, reject) => {
            getMajiangMatchRules().then((response: { data }) => {
                context.commit('SET_MAJIANGMATCHRULES', <GetMajiangMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateMajiangMatchRules(context: { commit: Commit, state: State }, updateData) { //获取MajiangMatchRules
        return new Promise(async (resolve, reject) => {
            updateMajiangMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_MAJIANGMATCHRULES', response.data.code)
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
