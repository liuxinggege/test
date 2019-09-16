import { getRoleEdit, addRoleEdit, updateRoleEdit, deleteRoleEdit, getPower, getRoleEditByParentName } from '../../../api/admin/adminUserManager/adminUserManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
  roleAdminData: RoleEdit[],
  roleChannleData: RoleEdit[],
  sonData: RoleEdit[],
  code: number
  addCode: number
  msg: any
  pages: power[]
  nodes: power[]
  adminTotalCount,
  channleTotalCount,
  sonTotalCount
}
export interface RoleEdit {
  createDate: any,
  name: any,
  pages: power[],
  nodes: power[],
  type: string,
  updateDate: any,
  _id: string
}

export interface power {
  name: string,
  alias: string,
}

// initial state
const state: State = {
  roleChannleData: [],
  roleAdminData: [],
  sonData: [],
  code: 0,
  msg: "",
  pages: [],
  nodes: [],
  addCode: 0,
  adminTotalCount: 0,
  channleTotalCount: 0,
  sonTotalCount: 0,
}

const mutations = {
  SET_QUERYLIST: (state: State, data: GetRoleEdit) => {

  },

  SET_ADMINDATA: (state: State, data: GetRoleEdit) => {
    state.code = data.code;
    state.roleAdminData = data.msg.data;
    state.adminTotalCount = data.msg.totalCount;
  },
  SET_CHANNELDATA: (state: State, data: GetRoleEdit) => {
    state.code = data.code;
    state.roleChannleData = data.msg.data;
    state.channleTotalCount = data.msg.totalCount;
  },
  SET_SONDATA: (state: State, data: GetRoleEdit) => {
    state.code = data.code;
    state.sonData = data.msg.data;
    state.sonTotalCount = data.msg.totalCount;
  },

  SET_ADD: (state: State, data: GetRoleEdit) => {
    state.addCode = data.code;
    state.msg = data.msg;
  },
  SET_POWER: (state: State, data: GetRoleEdit) => {
    state.code = data.code;
    state.pages = data.msg.pages;
    state.nodes = data.msg.nodes
  },
}

type GetRoleEdit = State;//获取结果BrnnMatchRules

const actions = {
  GetPower(context: { commit: Commit, state: State }) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getPower().then((response: { data }) => {
        context.commit('SET_POWER', <GetRoleEdit>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  GetSonRoleEdit(context: { commit: Commit, state: State }, updateData) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getRoleEditByParentName(updateData).then((response: { data }) => {
        context.commit('SET_SONDATA', <GetRoleEdit>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  GetAdminRoleEdit(context: { commit: Commit, state: State }, updateData) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getRoleEdit(updateData).then((response: { data }) => {
        context.commit('SET_ADMINDATA', <GetRoleEdit>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  GetChannelRoleEdit(context: { commit: Commit, state: State }, updateData) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getRoleEdit(updateData).then((response: { data }) => {
        context.commit('SET_CHANNELDATA', <GetRoleEdit>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  AddRoleEdit(context: { commit: Commit, state: State }, data: RoleEdit) {

    return new Promise(async (resolve, reject) => {
      addRoleEdit(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  UpdateRoleEdit(context: { commit: Commit, state: State }, data: RoleEdit) {
    return new Promise(async (resolve, reject) => {
      updateRoleEdit(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  DeleteRoleEdit(context: { commit: Commit, state: State }, id: number) {
    return new Promise(async (resolve, reject) => {
      deleteRoleEdit(id).then(response => {
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
