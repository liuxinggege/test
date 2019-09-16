import {
  getChannelList,
  getBalanceDeatile
} from '../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
import { formUtil } from '../../../utils/formatUtils'
export interface State {
  balanceMgrData: balanceMgrDataType[]
  channelList: any

  getCode: number
}

export interface balanceMgrDataType {
  //登陆参数

  brniuniuTax: string
  discountGameTax: string
  doudizhuTax: string
  dezhoupukeTax: string
  qianghongbaoTax: string
  erbagangTax: string
  duofuduocaiTax: string
  gameTax: string
  hongheiTax: string
  ermjTax: string
  longhuTax: string
  jinhuaTax: string
  niuniuTax: string
  payableAmt: string
  rate: string
  suohaTax: string
  xuezhanTax: string
  localSumDate: string
  channel: string

  buyuTax: string
  jdniuniuTax: string
  paodekuaiTx: string
}

// initial state
const state: State = {
  balanceMgrData: [],
  channelList: {},
  getCode: 0
}

const mutations = {
  CLEAR_CODE: (state: State) => {
    state.getCode = 0
  },

  SET_GETCHANNELLIST: (state: State, result: any) => {
    state.channelList = result.msg
    state.getCode = result.code
  },

  SET_GETBALANCEDEATILE: (state: State, result: any) => {
    state.getCode = result.code
    state.balanceMgrData = result.msg.map(e => {
      e.gameTax = formUtil.moneyFormat(e.gameTax)
      e.discountGameTax = formUtil.moneyFormat(e.discountGameTax)
      e.payableAmt = formUtil.moneyFormat(e.payableAmt)
      e.jinhuaTax = formUtil.moneyFormat(e.jinhuaTax)
      e.wcgTax = formUtil.moneyFormat(e.wcgTax)
      e.niuniuTax = formUtil.moneyFormat(e.niuniuTax)
      e.suohaTax = formUtil.moneyFormat(e.suohaTax)
      e.brniuniuTax = formUtil.moneyFormat(e.brniuniuTax)
      e.xuezhanTax = formUtil.moneyFormat(e.xuezhanTax)
      e.hongheiTax = formUtil.moneyFormat(e.hongheiTax)
      e.longhuTax = formUtil.moneyFormat(e.longhuTax)
      e.doudizhuTax = formUtil.moneyFormat(e.doudizhuTax)
      e.dezhoupukeTax = formUtil.moneyFormat(e.dezhoupukeTax)
      e.qianghongbaoTax = formUtil.moneyFormat(e.qianghongbaoTax)
      e.erbagangTax = formUtil.moneyFormat(e.erbagangTax)
      e.duofuduocaiTax = formUtil.moneyFormat(e.duofuduocaiTax)
      e.buyuTax = formUtil.moneyFormat(e.buyuTax)
      e.jdniuniuTax = formUtil.moneyFormat(e.jdniuniuTax)
      e.paodekuaiTax = formUtil.moneyFormat(e.paodekuaiTax)
      e.ermjTax = formUtil.moneyFormat(e.ermjTax)
      e.newUserChargeAmt = formUtil.moneyFormat(e.newUserChargeAmt)
      e.totalProfit = formUtil.moneyFormat(e.totalProfit)
      e.totalWithdrawAmt = formUtil.moneyFormat(e.totalWithdrawAmt)
      e.totalChargeAmt = formUtil.moneyFormat(e.totalChargeAmt)
      return e
    })
  }
}
// actions
const actions = {
  GetChannelList(context: { commit: Commit; state: State }, data) {
    context.commit('CLEAR_CODE')
    return new Promise(async (resolve, reject) => {
      getChannelList(data)
        .then(response => {
          context.commit('SET_GETCHANNELLIST', response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  GetBalanceDeatile(context: { commit: Commit; state: State }, data) {
    context.commit('CLEAR_CODE')
    return new Promise(async (resolve, reject) => {
      getBalanceDeatile(data)
        .then(response => {
          context.commit('SET_GETBALANCEDEATILE', response.data)
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
