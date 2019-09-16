import {
  getErbagangMatchRules,
  updateErbagangMatchRules
} from '../../../api/admin/gameManager/gameManager'
import { Commit } from 'vuex'

export interface State {
  minUserCnt: Number // 最小人数
  maxUserCnt: Number // 最大人数
  startTime: Number // 开始时间
  kickTime: Number // 用户无操作踢出时间
  chkIp: Boolean // 匹配iP
  taxRate: String // 税率
  userWinProb: String // 个人水位赢几率
  userLoseProb: String // 个人水位输几率
  gameAllKillProb: Number
  gameAllLoseProb: Number
  code: number
}

type GetErbagangMatchRulesResp = State //获取结果BuyuMatchRules

// initial state
const state: State = {
  minUserCnt: 0,
  maxUserCnt: 0,
  startTime: 0,
  kickTime: 0,
  chkIp: false,
  taxRate: '0',
  userWinProb: '0',
  userLoseProb: '0',
  gameAllKillProb: 0,
  gameAllLoseProb: 0,
  code: 0
}

const mutations = {
  SET_ERBAGANGMATCHRULES: (state: State, data: GetErbagangMatchRulesResp) => {
    state.minUserCnt = data.minUserCnt
    state.maxUserCnt = data.maxUserCnt
    state.startTime = data.startTime
    state.kickTime = data.kickTime
    state.chkIp = data.chkIp
    state.taxRate = data.taxRate
    state.userWinProb = data.userWinProb
    state.userLoseProb = data.userLoseProb
    state.gameAllKillProb = data.gameAllKillProb
    state.gameAllLoseProb = data.gameAllLoseProb
  },
  UPDATE_ERBAGANGMATCHRULES: (state: State, code) => {
    state.code = code
  }
}
// actions
const actions = {
  GetErbagangMatchRules(context: { commit: Commit; state: State }) {
    //获取BuyuMatchRules
    return new Promise(async (resolve, reject) => {
      getErbagangMatchRules()
        .then((response: { data }) => {
          context.commit('SET_ERBAGANGMATCHRULES', <GetErbagangMatchRulesResp>(
            response.data.msg[0]
          ))
          resolve()
        })
        .catch(error => {
          resolve()
        })
    })
  },
  UpdateErbagangMatchRules(
    context: { commit: Commit; state: State },
    updateData
  ) {
    //获取BuyuMatchRules
    return new Promise(async (resolve, reject) => {
      updateErbagangMatchRules(updateData)
        .then((response: { data }) => {
          context.commit('UPDATE_ERBAGANGMATCHRULES', response.data.code)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  }
}
export default {
  state,
  // getters,
  actions,
  mutations
}
