import {
  getUserWinLose,
  getUserWinLoseExcel
} from '../../../api/admin/dataStatic/dataStatic'
import { Commit } from 'vuex'
import { formUtil } from '../../../utils/formatUtils'

export interface State {
  transferData: UserWinLoseData[]
  code: number
  totalCount: number
  msg: string
}
export interface UserWinLoseData {
  uid: number
  jinhuaTotalBets: string
  jinhuaWinLose: string
  niuniuTotalBets: string
  niuniuWinLose: string
  brniuniuTotalBets: string
  brniuniuWinLose: string
  buyuTotalBets: string
  buyuWinLose: string

  jdniuniuTotalBets: string
  jdniuniuWinLose: string
  paodekuaiTotalBets: string
  paodekuaiWinLose: string

  hongheiTotalBets: string
  hongheiWinLose: string
  ermjTotalBets: string
  ermjWinLose: string
  longhuTotalBets: string
  longhuWinLose: string
  xuezhanTotalBets: string
  xuezhanWinLose: string
  doudizhuTotalBets: string
  doudizhuWinLose: string
  dezhoupukeTotalBets: string
  dezhoupukeWinLose: string
  qianghongbaoTotalBets: string
  qianghongbaoWinLose: string
  erbagangTotalBets: string
  erbagangWinLose: string
  duofuduocaiTotalBets: string
  duofuduocaiWinLose: string
  suohaTotalBets: string
  suohaWinLose: string
  totalChargeMoney: string
  totalWithdrawMoney: string
  channel: string
  totalBets: string
  totalWinAndLose: string
  sumDate: Date
  ip: string
  ipLocation: string
  totalWinLose: string
}
type Msg = {
  data: UserWinLoseData[]
  totalCount: number
}
type GetUserWinLose = {
  code: number
  msg: Msg
} //获取结果LoginLog

// initial state
const state: State = {
  transferData: [],
  code: 0,
  totalCount: 0,
  msg: ''
}

const mutations = {
  SET_USERWINLOSE: (state: State, data: GetUserWinLose) => {
    state.code = data.code
    state.totalCount = data.msg.totalCount
    state.transferData = data.msg.data.map(e => {
      e.totalChargeMoney = formUtil.moneyFormat(e.totalChargeMoney)
      e.totalWithdrawMoney = formUtil.moneyFormat(e.totalWithdrawMoney)
      e.totalBets = formUtil.moneyFormat(e.totalBets)
      e.totalWinLose = formUtil.moneyFormat(e.totalWinLose)
      e.jinhuaTotalBets = formUtil.moneyFormat(e.jinhuaTotalBets)
      e.jinhuaWinLose = formUtil.moneyFormat(e.jinhuaWinLose)
      e.niuniuTotalBets = formUtil.moneyFormat(e.niuniuTotalBets)
      e.niuniuWinLose = formUtil.moneyFormat(e.niuniuWinLose)
      e.brniuniuTotalBets = formUtil.moneyFormat(e.brniuniuTotalBets)
      e.brniuniuWinLose = formUtil.moneyFormat(e.brniuniuWinLose)
      e.buyuTotalBets = formUtil.moneyFormat(e.buyuTotalBets)
      e.buyuWinLose = formUtil.moneyFormat(e.buyuWinLose)
      e.hongheiTotalBets = formUtil.moneyFormat(e.hongheiTotalBets)
      e.hongheiWinLose = formUtil.moneyFormat(e.hongheiWinLose)
      e.ermjTotalBets = formUtil.moneyFormat(e.ermjTotalBets)
      e.ermjWinLose = formUtil.moneyFormat(e.ermjWinLose)
      e.longhuTotalBets = formUtil.moneyFormat(e.longhuTotalBets)
      e.longhuWinLose = formUtil.moneyFormat(e.longhuWinLose)
      e.jdniuniuTotalBets = formUtil.moneyFormat(e.jdniuniuTotalBets)
      e.jdniuniuWinLose = formUtil.moneyFormat(e.jdniuniuWinLose)
      e.paodekuaiTotalBets = formUtil.moneyFormat(e.paodekuaiTotalBets)
      e.paodekuaiWinLose = formUtil.moneyFormat(e.paodekuaiWinLose)
      e.xuezhanTotalBets = formUtil.moneyFormat(e.xuezhanTotalBets)
      e.xuezhanWinLose = formUtil.moneyFormat(e.xuezhanWinLose)
      e.doudizhuTotalBets = formUtil.moneyFormat(e.doudizhuTotalBets)
      e.doudizhuWinLose = formUtil.moneyFormat(e.doudizhuWinLose)
      e.dezhoupukeTotalBets = formUtil.moneyFormat(e.dezhoupukeTotalBets)
      e.dezhoupukeWinLose = formUtil.moneyFormat(e.dezhoupukeWinLose)
      e.qianghongbaoTotalBets = formUtil.moneyFormat(e.qianghongbaoTotalBets)
      e.qianghongbaoWinLose = formUtil.moneyFormat(e.qianghongbaoWinLose)
      e.erbagangTotalBets = formUtil.moneyFormat(e.erbagangTotalBets)
      e.erbagangWinLose = formUtil.moneyFormat(e.erbagangWinLose)
      e.duofuduocaiTotalBets = formUtil.moneyFormat(e.duofuduocaiTotalBets)
      e.duofuduocaiWinLose = formUtil.moneyFormat(e.duofuduocaiWinLose)
      e.suohaTotalBets = formUtil.moneyFormat(e.suohaTotalBets)
      e.suohaWinLose = formUtil.moneyFormat(e.suohaWinLose)
      return e
    })
  },
  SET_CODE: (state: State, data: any) => {
    ;(state.code = data.code), (state.msg = data.msg)
  },
  SET_ERROR: (state: State, data: any) => {
    ;(state.code = data.code), (state.msg = data.msg || data.err)
  }
}
// actions
const actions = {
  GetUserWinLose(context: { commit: Commit; state: State }, queryItem) {
    //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getUserWinLose(queryItem)
        .then((response: { data }) => {
          context.commit('SET_USERWINLOSE', <GetUserWinLose>response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
        })
    })
  },
  DownloadUserWinLoseExcel(
    context: { commit: Commit; state: State },
    queryItem
  ) {
    //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getUserWinLoseExcel(queryItem)
        .then((response: { data }) => {
          context.commit('SET_ERROR', response.data)
          resolve(response.data)
        })
        .catch(error => {
          context.commit('SET_ERROR', error)
          console.error('catch', error)
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
