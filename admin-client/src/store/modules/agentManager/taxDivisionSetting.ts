import { getTaxDivisionSettingList, addTaxDivisionSetting, updateTaxDivisionSetting, deleteTaxDivisionSetting } from '../../../api/admin/agent/manager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
  taxDivisionSetting: TaxDivisionSetting,
  taxDivisionSettings: TaxDivisionSetting[],
  code: number
  msg: any
}
export interface TaxDivisionSetting {
  taxMinVal: any,
  taxMaxVal: any,
  proportion: any,
  id: any
}

// initial state
const state: State = {
  taxDivisionSetting: {
    taxMinVal: null,
    taxMaxVal: null,
    proportion: null,
    id: 0
  },
  taxDivisionSettings: [],
  code: 0,
  msg: ""
}

const mutations = {
  SET_QUERYLIST: (state: State, data: GetTaxDivisionSetting) => {
    state.code = data.code;
    state.taxDivisionSettings = data.msg;
  },
  SET_ADD: (state: State, data: GetTaxDivisionSetting) => {
    state.code = data.code;
    state.msg = data.msg;
  }
}

type GetTaxDivisionSetting = State;//获取结果BrnnMatchRules

const actions = {
  getTaxDivisionSettingList(context: { commit: Commit, state: State }) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getTaxDivisionSettingList().then((response: { data }) => {
        context.commit('SET_QUERYLIST', <GetTaxDivisionSetting>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  addTaxDivisionSetting(context: { commit: Commit, state: State }, data: TaxDivisionSetting) {
    return new Promise(async (resolve, reject) => {
      addTaxDivisionSetting(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  updateTaxDivisionSetting(context: { commit: Commit, state: State }, data: TaxDivisionSetting) {
    return new Promise(async (resolve, reject) => {
      updateTaxDivisionSetting(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  deleteTaxDivisionSetting(context: { commit: Commit, state: State }, id: number) {
    return new Promise(async (resolve, reject) => {
      deleteTaxDivisionSetting(id).then(response => {
        context.commit('SET_ADD', response.data)
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
  actions,
  mutations
}
