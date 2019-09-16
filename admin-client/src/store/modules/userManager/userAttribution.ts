import {
  getGeneralUser,
  getAttribution
} from '../../../api/admin/userManager/userManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface UserAttribution {
  brniuniuRound: number
  brniuniuWinLose: number
  buyuRound: number
  buyuWinLose: number
  dayWinAndLose: string
  doudizhuGameTime: number
  doudizhuRound: number
  doudizhuWinLose: number
  dezhoupukeGameTime: number
  dezhoupukeRound: number
  dezhoupukeWinLose: number
  qianghongbaoGameTime: number
  qianghongbaoRound: number
  qianghongbaoWinLose: number
  erbagangGameTime: number
  erbagangRound: number
  erbagangWinLose: number
  duofuduocaiGameTime: number
  duofuduocaiRound: number
  duofuduocaiWinLose: number
  money: string
  hongheiRound: number
  hongheiWinLose: number
  ermjRound: number
  ermjWinLose: number
  longhuRound: number
  longhuWinLose: number

  jdniuniuRound: number
  jdniuniuWinLose: number
  paodekuaiRound: number
  paodekuaiWinLose: number

  ip: string
  jinhuaGameTime: number
  jinhuaRound: number
  jinhuaWinLose: number
  location: string
  masterGet: number
  name: string
  niuniuRound: number
  niuniuWinLose: number
  suohaRound: number
  suohaWinLose: number
  todayCharge: string
  todayGameTime: string
  todayTax: number
  todayWinAndLose: string
  todayWithdraw: number
  totalCharge: number
  totalTax: number
  totalWithdrawMoney: number
  uid: number
  xuezhanRound: number
  xuezhanWinLose: number
  todayVipWithdraw: number
  vipWithdrawMoney: number

  totalWithdrawAmount: string
  rechargeTotalRmb: string
  createDateCycle: string
}
export interface State {
  userAttribution: UserAttribution
}

// initial state
const state: State = {
  userAttribution: {
    brniuniuRound: 0,
    brniuniuWinLose: 0,
    buyuRound: 0,
    buyuWinLose: 0,
    dayWinAndLose: '',
    doudizhuGameTime: 0,
    doudizhuRound: 0,
    doudizhuWinLose: 0,
    dezhoupukeGameTime: 0,
    dezhoupukeRound: 0,
    dezhoupukeWinLose: 0,
    qianghongbaoGameTime: 0,
    qianghongbaoRound: 0,
    qianghongbaoWinLose: 0,
    erbagangGameTime: 0,
    erbagangRound: 0,
    erbagangWinLose: 0,
    duofuduocaiGameTime: 0,
    duofuduocaiRound: 0,
    duofuduocaiWinLose: 0,
    money: '',
    hongheiRound: 0,
    hongheiWinLose: 0,
    ermjRound: 0,
    ermjWinLose: 0,
    longhuRound: 0,
    longhuWinLose: 0,

    jdniuniuRound: 0,
    jdniuniuWinLose: 0,
    paodekuaiRound: 0,
    paodekuaiWinLose: 0,

    ip: '',
    jinhuaGameTime: 0,
    jinhuaRound: 0,
    jinhuaWinLose: 0,
    location: '',
    masterGet: 0,
    name: '',
    niuniuRound: 0,
    niuniuWinLose: 0,
    suohaRound: 0,
    suohaWinLose: 0,
    todayCharge: '',
    todayGameTime: '',
    todayTax: 0,
    todayWinAndLose: '',
    todayWithdraw: 0,
    todayVipWithdraw: 0,
    totalCharge: 0,
    totalTax: 0,
    totalWithdrawMoney: 0,
    vipWithdrawMoney: 0,
    uid: 0,
    xuezhanRound: 0,
    xuezhanWinLose: 0,
    totalWithdrawAmount: '',
    rechargeTotalRmb: '',
    createDateCycle: ''
  }
}

const mutations = {
  SET_ATTRIBUTION: (state: State, data: CodeMsg<UserAttribution>) => {
    state.userAttribution = data.msg
  }
}
// actions
const actions = {
  GetAttribution(context: { commit: Commit; state: State }, uid) {
    //获取普通用户信息
    return new Promise(async (resolve, reject) => {
      getAttribution(uid)
        .then((response: { data }) => {
          context.commit('SET_ATTRIBUTION', response.data)
          resolve(response.data.code)
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
