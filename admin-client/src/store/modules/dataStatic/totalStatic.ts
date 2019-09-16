import {
  getTotalStatic,
  getExportTotalStatic
} from '../../../api/admin/dataStatic/dataStatic'
import { formUtil } from '../../../utils/formatUtils'
import { Commit } from 'vuex'

export interface State {
  transferData: TotalStaticData[]
  code: number
  totalCount: number
  heh: number
}
export interface TotalStaticData {
  sumDate: string
  logDate: string
  totalProfit: string
  totalChargeAmt: string
  totalWithdrawAmt: string
  totalTax: string
  onlineChargeAmt: string
  agentChargeAmt: string
  gameTax: string
  totalWithdrawTax: string
  totalWithdrawUserCount: string
  loginUserCount: string
  newUserCount: string
  oldUserCount: string
  bindUserCount: string
  bindRate: string
  totalChargeUserCount: string
  payRate: string
  newUserPayRate: string
  newUserChargeAmt: string
  oldUserChargeAmt: string
  touristPresent: string
  userLeftMoney: string
  avgProfit: string
  avgChargeAmt: string
  newUserAvgChargeAmt: string
  systemEachDayWinAndLose: string
  oldUserAvgChargeAmt: string

  jinhuaEachDayWinAndLose: string
  jinhuaTax: string

  suohaEachDayWinAndLose: string
  niuniuEachDayWinAndLose: string
  brniuniuEachDayWinAndLose: string
  xuezhanEachDayWinAndLose: string
  doudizhuEachDayWinAndLose: string
  dezhoupukeEachDayWinAndLose: string
  qianghongbaoEachDayWinAndLose: string
  erbagangEachDayWinAndLose: string
  duofuduocaiEachDayWinAndLose: string
  hongheiEachDayWinAndLose: string
  ermjEachDayWinAndLose: string
  longhuEachDayWinAndLose: string

  paodekuaiEachDayWinAndLose: string
  jdniuniuEachDayWinAndLose: string

  buyuEachDayWinAndLose: string

  suohaTax: string
  niuniuTax: string
  brniuniuTax: string
  xuezhanTax: string
  doudizhuTax: string
  dezhoupukeTax: string
  qianghongbaoTax: string
  erbagangTax: string
  duofuduocaiTax: string
  hongheiTax: string
  ermjTax: string
  longhuTax: string
  paodekuaiTax: string
  jdniuniuTax: string
  buyuTax: string

  retentionDay2: string
  retentionDay3: string
  retentionDay7: string
  newUserChargeUserCount: number
  agencySettleAmt: string
  ltv7: string
  ltv14: string
  ltv30: string
  ltv60: string
  agencyTotalCharge: string
}
type Msg = {
  data: TotalStaticData[]
  totalCount: number
}
type GetTotalStatic = {
  code: number
  msg: Msg
} //获取结果LoginLog

type GetExportTotalStatic = {
  code: number
  msg: TotalStaticData[]
}
// initial state
const state: State = {
  transferData: [],
  code: 0,
  totalCount: 0,
  heh: 0
}

const mutations = {
  SET_TOTALSTATIC: (state: State, data: GetTotalStatic) => {
    state.code = data.code
    state.totalCount = data.msg.totalCount
    state.transferData = data.msg.data.map(e => {
      e.totalProfit = formUtil.moneyFormat(e.totalProfit)
      e.totalChargeAmt = formUtil.moneyFormat(e.totalChargeAmt)
      e.totalWithdrawAmt = formUtil.moneyFormat(e.totalWithdrawAmt)
      e.totalTax = formUtil.moneyFormat(e.totalTax)
      e.totalWithdrawTax = formUtil.moneyFormat(e.totalWithdrawTax)
      e.agencySettleAmt = formUtil.moneyFormat(e.agencySettleAmt)
      e.onlineChargeAmt = formUtil.moneyFormat(e.onlineChargeAmt)
      e.agentChargeAmt = formUtil.moneyFormat(e.agentChargeAmt)
      e.gameTax = formUtil.moneyFormat(e.gameTax)
      e.newUserChargeAmt = formUtil.moneyFormat(e.newUserChargeAmt)
      e.oldUserChargeAmt = formUtil.moneyFormat(e.oldUserChargeAmt)
      e.oldUserAvgChargeAmt = formUtil.moneyFormat(e.oldUserAvgChargeAmt)
      e.touristPresent = formUtil.moneyFormat(e.touristPresent)
      e.avgProfit = formUtil.moneyFormat(e.avgProfit)
      e.avgChargeAmt = formUtil.moneyFormat(e.avgChargeAmt)
      e.newUserAvgChargeAmt = formUtil.moneyFormat(e.newUserAvgChargeAmt)
      e.systemEachDayWinAndLose = formUtil.moneyFormat(
        e.systemEachDayWinAndLose
      )
      e.suohaEachDayWinAndLose = formUtil.moneyFormat(e.suohaEachDayWinAndLose)
      e.suohaTax = formUtil.moneyFormat(e.suohaTax)
      e.jinhuaEachDayWinAndLose = formUtil.moneyFormat(
        e.jinhuaEachDayWinAndLose
      )
      e.jinhuaTax = formUtil.moneyFormat(e.jinhuaTax)
      e.niuniuEachDayWinAndLose = formUtil.moneyFormat(
        e.niuniuEachDayWinAndLose
      )
      e.niuniuTax = formUtil.moneyFormat(e.niuniuTax)
      e.brniuniuEachDayWinAndLose = formUtil.moneyFormat(
        e.brniuniuEachDayWinAndLose
      )
      e.brniuniuTax = formUtil.moneyFormat(e.brniuniuTax)
      e.xuezhanEachDayWinAndLose = formUtil.moneyFormat(
        e.xuezhanEachDayWinAndLose
      )
      e.xuezhanTax = formUtil.moneyFormat(e.xuezhanTax)
      e.doudizhuEachDayWinAndLose = formUtil.moneyFormat(
        e.doudizhuEachDayWinAndLose
      )
      e.doudizhuTax = formUtil.moneyFormat(e.doudizhuTax)
      e.dezhoupukeEachDayWinAndLose = formUtil.moneyFormat(
        e.dezhoupukeEachDayWinAndLose
      )
      e.dezhoupukeTax = formUtil.moneyFormat(e.dezhoupukeTax)
      e.qianghongbaoEachDayWinAndLose = formUtil.moneyFormat(
        e.qianghongbaoEachDayWinAndLose
      )
      e.qianghongbaoTax = formUtil.moneyFormat(e.qianghongbaoTax)
      e.erbagangEachDayWinAndLose = formUtil.moneyFormat(
        e.erbagangEachDayWinAndLose
      )
      e.erbagangTax = formUtil.moneyFormat(e.erbagangTax)
      e.duofuduocaiEachDayWinAndLose = formUtil.moneyFormat(
        e.duofuduocaiEachDayWinAndLose
      )
      e.duofuduocaiTax = formUtil.moneyFormat(e.duofuduocaiTax)
      e.hongheiEachDayWinAndLose = formUtil.moneyFormat(
        e.hongheiEachDayWinAndLose
      )
      e.hongheiTax = formUtil.moneyFormat(e.hongheiTax)
      e.ermjEachDayWinAndLose = formUtil.moneyFormat(e.ermjEachDayWinAndLose)
      e.ermjTax = formUtil.moneyFormat(e.ermjTax)
      e.longhuEachDayWinAndLose = formUtil.moneyFormat(
        e.longhuEachDayWinAndLose
      )
      e.longhuTax = formUtil.moneyFormat(e.longhuTax)
      e.buyuEachDayWinAndLose = formUtil.moneyFormat(e.buyuEachDayWinAndLose)
      e.buyuTax = formUtil.moneyFormat(e.buyuTax)
      e.jdniuniuEachDayWinAndLose = formUtil.moneyFormat(
        e.jdniuniuEachDayWinAndLose
      )
      e.jdniuniuTax = formUtil.moneyFormat(e.jdniuniuTax)
      e.paodekuaiEachDayWinAndLose = formUtil.moneyFormat(
        e.paodekuaiEachDayWinAndLose
      )
      e.paodekuaiTax = formUtil.moneyFormat(e.paodekuaiTax)
      e.ltv7 = formUtil.moneyFormat(e.ltv7)
      e.ltv14 = formUtil.moneyFormat(e.ltv14)
      e.ltv30 = formUtil.moneyFormat(e.ltv30)
      e.ltv60 = formUtil.moneyFormat(e.ltv60)
      e.agencyTotalCharge = formUtil.moneyFormat(e.agencyTotalCharge)
      return e
    })
  },

  SET_EXCEL: (state: State, data: GetExportTotalStatic) => {
    state.code = data.code
    state.transferData = data.msg
  }
}
// actions
const actions = {
  GetTotalStatic(context: { commit: Commit; state: State }, queryItem) {
    //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getTotalStatic(queryItem)
        .then((response: { data }) => {
          context.commit('SET_TOTALSTATIC', <GetTotalStatic>response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  GetTotalStaticExcel(context: { commit: Commit; state: State }, queryItem) {
    //导出Excel
    return new Promise(async (resolve, reject) => {
      getExportTotalStatic(queryItem)
        .then((response: { data }) => {
          // context.commit('SET_EXCEL', <GetExportTotalStatic>response.data)
          resolve(response.data)
        })
        .catch(error => {
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
