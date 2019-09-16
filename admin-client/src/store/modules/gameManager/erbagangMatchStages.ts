import {
  getErbagangMatchStages,
  updateErbagangMatchStages
} from '../../../api/admin/gameManager/gameManager'
import { Commit, Dispatch } from 'vuex'
export interface State {
  matchStagesData: matchStagesData[]
  code: number
  minRobotRoomCountEditFlag: boolean[]
  minRoomCountEditFlag: boolean[]
}
export interface robotWinRateType {
  value: string
  rate: string
}
export interface matchStagesData {
  active: boolean
  bets: string
  color: number
  id: string
  idx: number
  maxMoney: String
  minMoney: String
  name: string
  robotMaxMoney: string
  robotMinMoney: string
  bankerMinMoney: string
  bankerMaxCnt: number
  maxAllBetPoint: string
  readyBankerMaxLen: number
  robotMaxBetRealBanker: string
  yardType: number
  fanMaxBoost: number
  robotActive: boolean
  poolLine: string
  poolValue: string
  robotWinRate: robotWinRateType[]
  maxRobotCount: number
  minRobotRoomCount: number
  minRoomCount: number
}

// initial state
const state: State = {
  matchStagesData: [
    {
      active: false,
      bets: '0',
      color: 0,
      id: '0',
      idx: 0,
      maxMoney: '0',
      minMoney: '0',
      name: '',
      robotMaxMoney: '0',
      robotMinMoney: '0',
      bankerMinMoney: '0',
      bankerMaxCnt: 0,
      maxAllBetPoint: '0',
      readyBankerMaxLen: 0,
      robotMaxBetRealBanker: '0',
      yardType: 0,
      fanMaxBoost: 0,
      robotActive: false,
      poolLine: '0',
      poolValue: '0',
      robotWinRate: [],
      maxRobotCount: 0,
      minRobotRoomCount: 0,
      minRoomCount: 0
    }
  ],
  minRobotRoomCountEditFlag: [],
  minRoomCountEditFlag: [],
  code: 0
}

const mutations = {
  SET_ERBAGANGMATCHSTAGES: (state: State, data: matchStagesData[]) => {
    state.matchStagesData = data
    state.minRobotRoomCountEditFlag = []
    state.minRoomCountEditFlag = []
    data.forEach(() => {
      state.minRobotRoomCountEditFlag.push(false)
      state.minRoomCountEditFlag.push(false)
    })
  },
  UPDATE_ERBAGANGMATCHSTAGES: (state: State, code) => {
    state.code = code
  }
}
// actions
const actions = {
  GetErbagangMatchStages(context: { commit: Commit; state: State }) {
    return new Promise(async (resolve, reject) => {
      getErbagangMatchStages()
        .then(response => {
          context.commit('SET_ERBAGANGMATCHSTAGES', response.data.msg)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },

  UpdateErbagangMatchStages(
    context: { commit: Commit; dispatch: Dispatch; state: State },
    updateData
  ) {
    return new Promise(async (resolve, reject) => {
      updateErbagangMatchStages(updateData)
        .then(response => {
          context.commit('UPDATE_ERBAGANGMATCHSTAGES', response.data.code)
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
  actions,
  mutations
}
