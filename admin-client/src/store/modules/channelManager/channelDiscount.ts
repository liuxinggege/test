import {
  getChannelDiscount,
  addChannelDiscount,
  deleteChannelDiscount,
  editChannelDiscount
} from '../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
export interface State {
  channelAccountInfoData: channelAccountInfoType[]
  totalCount: number

  code: number
  err: string
}

export interface channelAccountInfoType {
  //登陆参数

  active: boolean
  channel: string
  discountDate: Date
  agentChargeAmt: { startRate: string; endRatr: string; rate: string }
  agentChargeUserCount: { startRate: string; endRatr: string; rate: string }
  bindUserCount: { startRate: string; endRatr: string; rate: string }
  brniuniuTax: { startRate: string; endRatr: string; rate: string }
  doudizhuTax: { startRate: string; endRatr: string; rate: string }
  dezhoupukeTax: { startRate: string; endRatr: string; rate: string }
  qianghongbaoTax: { startRate: string; endRatr: string; rate: string }
  erbagangTax: { startRate: string; endRatr: string; rate: string }
  duofuduocaiTax: { startRate: string; endRatr: string; rate: string }
  hongheiTax: { startRate: string; endRatr: string; rate: string }
  ermjTax: { startRate: string; endRatr: string; rate: string }
  longhuTax: { startRate: string; endRatr: string; rate: string }
  jinhuaTax: { startRate: string; endRatr: string; rate: string }
  buyuTax: { startRate: string; endRatr: string; rate: string }
  jdniuniuTax: { startRate: string; endRatr: string; rate: string }
  paodekuaiTax: { startRate: string; endRatr: string; rate: string }
  newUserChargeAmt: { startRate: string; endRatr: string; rate: string }
  newUserCount: { startRate: string; endRatr: string; rate: string }
  niuniuTax: { startRate: string; endRatr: string; rate: string }
  onlineChargeAmt: { startRate: string; endRatr: string; rate: string }
  onlineChargeUserCount: { startRate: string; endRatr: string; rate: string }
  suohaTax: { startRate: string; endRatr: string; rate: string }
  xuezhanTax: { startRate: string; endRatr: string; rate: string }
  _id: string
  newUserCountCurRate: string
  bindUserCountCurRate: string
  jinhuaTaxCurRate: string
  suohaTaxCurRate: string
  niuniuTaxCurRate: string
  brniuniuTaxCurRate: string
  xuezhanTaxCurRate: string
  doudizhuTaxCurRate: string
  dezhoupukeTaxCurRate: string
  qianghongbaoTaxCurRate: string
  erbagangTaxCurRate: string
  duofuduocaiTaxCurRate: string
  hongheiTaxCurRate: string
  longhuTaxCurRate: string
  paodekuaiTaxCurRate: string
  jdniuniuTaxCurRate: string
  buyuTaxCurRate: string
  ermjTaxCurRate: string
  onlineChargeAmtCurRate: string
  agentChargeAmtCurRate: string
  onlineChargeUserCountCurRate: string
  agentChargeUserCountCurRate: string
  newUserChargeAmtCurRate: string
}

// initial state
const state: State = {
  channelAccountInfoData: [],
  totalCount: 0,

  code: 0,
  err: ''
}

const mutations = {
  CLEAR_CODE: (state: State) => {
    state.code = 0
  },

  SET_GETCHANNELDISCOUNT: (state: State, result: any) => {
    state.channelAccountInfoData = result.msg.data
    state.totalCount = result.msg.totalCount
    state.code = result.code
  },

  SET_ADDCHANNELDISCOUNT: (state: State, result: any) => {
    state.code = result.code
  },

  SET_EDITCHANNELDISCOUNT: (state: State, result: any) => {
    state.code = result.code
  },
  SET_DELETCHANNELDISCOUNT: (state: State, result: any) => {
    state.code = result.code
  },
  SET_ERROR: (state: State, result: any) => {
    state.code = result.code
    state.err = result.err
  }
}
// actions
const actions = {
  GetChannelDiscount(context: { commit: Commit; state: State }, data) {
    context.commit('CLEAR_CODE')
    return new Promise(async (resolve, reject) => {
      getChannelDiscount(data)
        .then(response => {
          context.commit('SET_GETCHANNELDISCOUNT', response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  AddChannelDiscount(context: { commit: Commit; state: State }, data) {
    context.commit('CLEAR_CODE')
    return new Promise(async (resolve, reject) => {
      addChannelDiscount(data)
        .then(response => {
          context.commit('SET_ADDCHANNELDISCOUNT', response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          context.commit('SET_ERROR', error)
          resolve()
        })
    })
  },

  EditChannelDiscount(context: { commit: Commit; state: State }, data) {
    context.commit('CLEAR_CODE')
    return new Promise(async (resolve, reject) => {
      editChannelDiscount(data)
        .then(response => {
          context.commit('SET_EDITCHANNELDISCOUNT', response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          context.commit('SET_ERROR', error)
          resolve()
        })
    })
  },

  DeleteChannelDiscount(context: { commit: Commit; state: State }, data) {
    context.commit('CLEAR_CODE')
    return new Promise(async (resolve, reject) => {
      deleteChannelDiscount(data)
        .then(response => {
          context.commit('SET_DELETCHANNELDISCOUNT', response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          context.commit('SET_ERROR', error)
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
