import { getJDNiuniuMatchRules, updateJDNiuniuMatchRules } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    bankerTime: number
    betTime: number
    chkIp: boolean
    maxUserCnt: number
    minUserCnt: number
    activeRobot: boolean
    rubTime: number
    setBankerTime: number
    startTime: number
    taxRate: string
    kickTime: number
    waitTime: number
    dealCardTime: number
    _id: string
    userLoseProb:string
    userWinProb:string
    code: number;
}

type GetJDNiuniuMatchRulesResp = State;//获取结果JDNiuniuMatchRules

// initial state
const state: State = {
    bankerTime: 0,
    betTime: 0,
    chkIp: false,
    maxUserCnt: 0,
    minUserCnt: 0,
    activeRobot: false,
    rubTime: 0,
    setBankerTime: 0,
    startTime: 0,
    taxRate: "",
    kickTime: 0,
    waitTime: 0,
    dealCardTime:0,
    _id: "",
    userLoseProb:"0",
    userWinProb:"0",
    code: 0
}

const mutations = {
    SET_JDNIUNIUMATCHRULES: (state: State, data: GetJDNiuniuMatchRulesResp) => {
        state.bankerTime =  data.bankerTime
        state.betTime =  data.betTime
        state.chkIp =  data.chkIp
        state.maxUserCnt =  data.maxUserCnt
        state.minUserCnt =  data.minUserCnt
        state.activeRobot =  data.activeRobot
        state.rubTime =  data.rubTime
        state.setBankerTime =  data.setBankerTime
        state.startTime =  data.startTime
        state.taxRate =  data.taxRate
        state.kickTime =  data.kickTime
        state.waitTime =  data.waitTime
        state.dealCardTime = data.dealCardTime
        state._id =  data._id
        state.userLoseProb = data.userLoseProb
        state.userWinProb = data.userWinProb
    },
    UPDATE_JDNIUNIUMATCHRULES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetJDNiuniuMatchRules(context: { commit: Commit, state: State }) { //获取JDNiuniuMatchRules
        return new Promise(async (resolve, reject) => {
            getJDNiuniuMatchRules().then((response: { data }) => {
                context.commit('SET_JDNIUNIUMATCHRULES', <GetJDNiuniuMatchRulesResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateJDNiuniuMatchRules(context: { commit: Commit, state: State }, updateData) { //更新JDNiuniuMatchRules
        return new Promise(async (resolve, reject) => {
            updateJDNiuniuMatchRules(updateData).then((response: { data }) => {
                context.commit('UPDATE_JDNIUNIUMATCHRULES', response.data.code)
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
