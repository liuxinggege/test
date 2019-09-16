import { addAllowLoginIp, getAllowLoginIp, deleteAllowIp } from '../../../api/admin/adminUserManager/adminUserManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
  adminIps: AllowLoginDoc[],
  message:string,
  code: number
}
export interface AllowLoginDoc {
    createTime: Date,
    adminIp: string,
    operator: string,
    description: string,
}
// initial state
const state: State = {
  adminIps: [{
    createTime: new Date(),
    adminIp: "",
    operator: "",
    description: "",
  }],
  message:"",
  code: 0,
}

const mutations = {
  SET_GETALLOWLOGINIP: (state: State, data: any) => {
    state.code = data.code;
    state.adminIps = data.msg;
  },
  SET_ERROR: (state: State, data: any) => {
    state.code = data.code;
    state.message = data.err;
  },
  SET_CODE: (state: State, data: any) => {
    state.code = data.code;
    state.message = data.msg;
  },

}

type GetAllowLoginIp = State;//获取结果BrnnMatchRules

const actions = {
  GetAllowLoginIp(context: { commit: Commit, state: State }) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getAllowLoginIp().then((response: { data }) => {
        context.commit('SET_GETALLOWLOGINIP', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        context.commit('SET_ERROR',error)
        resolve()
      })
    });
  },
  AddAllowLoginIp(context: { commit: Commit, state: State }, data: string[]) {
    return new Promise(async (resolve, reject) => {
      addAllowLoginIp(data).then(response => {
        context.commit('SET_GETALLOWLOGINIP', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        context.commit('SET_ERROR',error)
        resolve()
      })
    });
  },
  DeleteAllowLoginIp(context: { commit: Commit, state: State }, data: string[]) {
    return new Promise(async (resolve, reject) => {
      deleteAllowIp(data).then(response => {
        context.commit('SET_CODE', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        context.commit('SET_ERROR',error)
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
