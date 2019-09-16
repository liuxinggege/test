import { getSettlementCycleList, addSettlementCycle, updateSettlementCycle, deleteSettlementCycle } from '../../../api/admin/agent/manager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
  settlementCycle: SettlementCycle,
  settlementCycles: SettlementCycle[],
  code: number
  msg: any
}
export interface SettlementCycle {
  name: String,
  val: any,
  orderNum: any,
  id: any
}

// initial state
const state: State = {
  settlementCycle: {
    name: "",
    val: null,
    orderNum: null,
    id: 0
  },
  settlementCycles: [],
  code: 0,
  msg: ""
}

const mutations = {
  SET_QUERYLIST: (state: State, data: GetSettlementCycle) => {
    state.code = data.code;
    state.settlementCycles = data.msg;
  },
  SET_ADD: (state: State, data: GetSettlementCycle) => {
    state.code = data.code;
    state.msg = data.msg;
  }
}

type GetSettlementCycle = State;//获取结果BrnnMatchRules

const actions = {
  getSettlementCycleList(context: { commit: Commit, state: State }) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getSettlementCycleList().then((response: { data }) => {
        context.commit('SET_QUERYLIST', <GetSettlementCycle>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  addSettlementCycle(context: { commit: Commit, state: State }, data: SettlementCycle) {
    return new Promise(async (resolve, reject) => {
      addSettlementCycle(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  updateSettlementCycle(context: { commit: Commit, state: State }, data: GetSettlementCycle) {
    return new Promise(async (resolve, reject) => {
      updateSettlementCycle(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  deleteSettlementCycle(context: { commit: Commit, state: State }, id: number) {
    return new Promise(async (resolve, reject) => {
      deleteSettlementCycle(id).then(response => {
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
