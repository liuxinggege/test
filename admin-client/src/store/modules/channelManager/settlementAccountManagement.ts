import {
  getChannelUser,
  updateChannelAlipayAccount,
  updateChannelAlipayName,
  updateChannelPayPwd,
  updateChannelSharingRatio,
  updateChannelTotalMoney,
  getSetHistory,
  updateChannelStatus,
} from '../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
import store from '../../../store'
import { Message } from 'element-ui';

export interface SetAccount {
  act: string,
  pwd: string,
  authority: number,
  ip: string,
  loginDate: string,//Date
  alipayAccount: string,
  index: true,
  alipayName: string
  payPwd: string
  totalSetMoney: string,
  totalMoney: string,
  sharingRatio: string
  purview?: any,
  channelMoneyHistory: any,
  billingType: string
  setTime: number,
}

export interface SetHistory {
  act: string,
  orderID?: string,
  alipayAccount: string,
  alipayName: string
  payPwd: string
  logDate: any,
  operator?: string,
  recordType: string,
  arrived: boolean,
  changeMoney: string,
  beforeSet: string,
  afterSet: string,
  remarks: string,
}
// export interface purview {
//   page?: {
//     financeManage?: boolean
//     settlementAccount?: boolean
//     settlementRecords?: boolean
//     submitSettlement?: boolean
//   }
// }
// initial state
export interface State {
  setAccount: SetAccount[]
  setHistory: SetHistory[]
  setAccountTotalCount: number
  setHistoryTotalCount: number

  getCode: number
  addCode: number
  eidtCode: number
  deleteCode: number
}
const state: State = {
  setAccount: [{
    act: "",
    pwd: "",
    authority: 0,
    ip: "",
    loginDate: "",
    alipayAccount: "",
    index: true,
    alipayName: "",
    payPwd: "",
    purview: "",
    totalSetMoney: "",
    totalMoney: "",
    sharingRatio: "",
    channelMoneyHistory: "",
    billingType: "",
    setTime: 0,
  }],
  setHistory: [{
    act: "",
    orderID: "",
    alipayAccount: "",
    alipayName: "",
    payPwd: "",
    logDate: "",
    operator: "",
    recordType: "",
    arrived: false,
    changeMoney: "",
    beforeSet: "",
    afterSet: "",
    remarks: "",
  }],
  setAccountTotalCount: 0,
  setHistoryTotalCount: 0,

  getCode: 0,
  addCode: 0,
  deleteCode: 0,
  eidtCode: 0,
}

const mutations = {
  CLEAR_CODE: (state: State) => {
    state.getCode = 0;
    state.addCode = 0;
    state.eidtCode = 0;
    state.deleteCode = 0;
  },

  SET_GETCHANNELDISCOUNT: (state: State, result: any) => {
    state.setAccount = result.msg.data;
    state.setAccountTotalCount = result.msg.totalCount;
    state.getCode = result.code

  },

  SET_EIDTCALLBACK: (state: State, result: any) => {
    state.eidtCode = result.code
  },

  SET_DELETCHANNELDISCOUNT: (state: State, result: any) => {
    state.deleteCode = result.code
  },

  SET_GETHOSTORY: (state: State, result: any) => {
    state.setHistory = result.msg.data;
    state.getCode = result.code
    state.setHistoryTotalCount = result.msg.totalCount;
  }

}
// actions
const actions = {

  GetChannelUser(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      getChannelUser(data).then(response => {
        context.commit('SET_GETCHANNELDISCOUNT', response.data)
        resolve(response.data)
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelAlipayAccount(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      updateChannelAlipayAccount(data).then(response => {
        context.commit('SET_EIDTCALLBACK', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelAlipayName(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      updateChannelAlipayName(data).then(response => {
        context.commit('SET_EIDTCALLBACK', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelPayPwd(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      updateChannelPayPwd(data).then(response => {
        context.commit('SET_EIDTCALLBACK', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelSharingRatio(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      updateChannelSharingRatio(data).then(response => {
        context.commit('SET_EIDTCALLBACK', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelTotalMoney(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      updateChannelTotalMoney(data).then(response => {
        context.commit('SET_EIDTCALLBACK', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  GetSetHistory(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      getSetHistory(data).then(response => {
        context.commit('SET_GETHOSTORY', response.data)
        resolve(response.data)
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelStatus(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE');
    return new Promise(async (resolve, reject) => {
      updateChannelStatus(data).then(response => {
        context.commit('SET_EIDTCALLBACK', response.data)
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
  // getters,
  actions,
  mutations
}
