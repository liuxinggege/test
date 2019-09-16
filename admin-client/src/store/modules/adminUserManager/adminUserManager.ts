import { getAdminUserManager, addAdminUserManager, updateAdminUserManager,googleAuth, deleteAdminUserManager, updateAdminUserRole, getRoleEdit,getAdminUseUrl } from '../../../api/admin/adminUserManager/adminUserManager'
import { Commit } from 'vuex'

export interface State {
  roleAdminData: RoleEdit[],
  userData: AdminUserManager[],
  code: number
  msg: any
  addCode: number
  totalCount: number
  eidtRoleCode: number
  eidtPwdCode: number
  deletCode: number
  err:string
}
export interface AdminUserManager {
  name: string,
  pwd: string,
  role: string,
  id: string
}

// initial state
const state: State = {
  roleAdminData: [],
  userData: [],
  code: 0,
  msg: "",
  addCode: 0,
  totalCount: 0,
  eidtPwdCode: 0,
  eidtRoleCode: 0,
  deletCode: 0,
  err:""
}

export interface RoleEdit {
  createDate: any,
  name: any,
  pages: power[],
  nodes: power[],
  type: string,
  updateDate: any,
  _id: string,
  isJs:boolean,
  isAgency:boolean,
}

export interface power {
  name: string,
  alias: string,
}

export interface GetRoleEdit {
  code: 0,
  msg: any,
}

const mutations = {
  CLEAR_CODE_ADUSER:(state :State) => {
    state.addCode=0;
    state.eidtPwdCode = 0;
 
    state.eidtPwdCode = 0;
    state.eidtRoleCode = 0;
    state.deletCode = 0;
  },

  SET_QUERYLIST: (state: State, data: GetAdminUserManager) => {
    state.code = data.code;
    state.userData = data.msg.data;
    state.totalCount = data.msg.totalCount;
  },
  SET_ADD: (state: State, data: GetAdminUserManager) => {
    state.addCode = data.code;
    state.msg = data.msg;
  },

  SET_ADMINDATA: (state: State, data: GetRoleEdit) => {
    state.code = data.code;
    state.roleAdminData = data.msg.data;
  },

  SET_EDITPW: (state: State, data: any) => {
    state.eidtPwdCode = data.code;
  },

  SET_ROLE: (state: State, data: any) => {
    state.eidtRoleCode = data.code;
  },

  SET_DELET: (state: State, data: any) => {
    state.deletCode = data.code;
  },
  SET_CODE: (state: State, data: any) => {
    state.code = data.code;
  },
  SET_ERROR: (state: State, data: any) => {
    state.code = data.code;
    state.err = data.err;
  },
}

type GetAdminUserManager = State;//获取结果BrnnMatchRules

const actions = {

  GetAdminRole(context: { commit: Commit, state: State }, updateData) { //
    context.commit('CLEAR_CODE_ADUSER');
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

  GetAdminUserManager(context: { commit: Commit, state: State }, updateData) { //
    context.commit('CLEAR_CODE_ADUSER');
    return new Promise(async (resolve, reject) => {
      getAdminUserManager(updateData).then((response: { data }) => {
        context.commit('SET_QUERYLIST', <GetAdminUserManager>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  GetAdminUserUrl(context: { commit: Commit, state: State }, updateData) { //
    context.commit('CLEAR_CODE_ADUSER');
    return new Promise(async (resolve, reject) => {
      getAdminUseUrl(updateData).then((response: { data }) => {
        context.commit('SET_QUERYLIST', <GetAdminUserManager>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  AddAdminUserManager(context: { commit: Commit, state: State }, data: AdminUserManager) {
    context.commit('CLEAR_CODE_ADUSER');
    return new Promise(async (resolve, reject) => {
      addAdminUserManager(data).then(response => {
        context.commit('SET_ADD', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  UpdateAdminUserManager(context: { commit: Commit, state: State }, data: AdminUserManager) {
    context.commit('CLEAR_CODE_ADUSER');
    return new Promise(async (resolve, reject) => {
      updateAdminUserManager(data).then(response => {
        context.commit('SET_EDITPW', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateAdminUserRole(context: { commit: Commit, state: State }, data: AdminUserManager) {
    context.commit('CLEAR_CODE_ADUSER');
    return new Promise(async (resolve, reject) => {
      updateAdminUserRole(data).then(response => {
        context.commit('SET_ROLE', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  DeleteAdminUserManager(context: { commit: Commit, state: State }, data) {
    context.commit('CLEAR_CODE_ADUSER');
    return new Promise(async (resolve, reject) => {
      deleteAdminUserManager(data).then(response => {
        context.commit('SET_DELET', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  GoogleAuth(context: { commit: Commit, state: State },data) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      googleAuth(data).then((response: { data }) => {
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
