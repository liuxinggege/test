import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { Commit } from 'vuex'

export interface State {
  erbagangGameLogData: ErbagangGameLogData[]
  code: number
  totalCount: number
  gameId: string
  ErbagangStageLog: object
  next: boolean
}
export interface ErbagangGameLogData {
  bets: string
  endDate: string
  gameData: object
  gameId: number
  gid: string
  logDate: string
  rType: number
  rid: number
  yid: string
  startDate: string
  users: any[]
  _id: string
}
type Msg = {
  data: ErbagangGameLogData[]
  totalCount: number
  next: boolean
}
type GetErbagangGameLog = {
  code: number
  msg: Msg
} //获取结果LoginLog

// initial state
const state: State = {
  erbagangGameLogData: [],
  code: 0,
  totalCount: 0,
  gameId: '',
  ErbagangStageLog: [],
  next: false
}

const mutations = {
  SET_ERBAGANGGAMELOG: (state: State, data: GetErbagangGameLog) => {
    state.code = data.code
    state.next = data.msg.next
    state.erbagangGameLogData = data.msg.data
  },
  //将当前的user字段的数据，保存到全局的store中
  SET_CUBERBAGANGUSERDETAIL: (state: State, data: any) => {
    state.gameId = data.gameId
    state.ErbagangStageLog = data.data
  }
}
// actions
const actions = {
  GetErbagangGameLog(context: { commit: Commit; state: State }, queryItem) {
    //获取ErbagangGameLog
    return new Promise(async (resolve, reject) => {
      gameOneLog(queryItem)
        .then((response: { data }) => {
          context.commit('SET_ERBAGANGGAMELOG', <GetErbagangGameLog>(
            response.data
          ))
          resolve(response.data)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  GetErbagangGameLogExcel(
    context: { commit: Commit; state: State },
    queryItem
  ) {
    //Excel
    return new Promise(async (resolve, reject) => {
      gameOneLogExcel(queryItem)
        .then((response: { data }) => {
          resolve(response.data)
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
