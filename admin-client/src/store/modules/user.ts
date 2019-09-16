import { loginByUsername, logout, getUserInfo } from '../../api/admin/login'
import { CodeMsg } from '../index'
import { Commit } from 'vuex'
import store from '../../store'
import { Message } from 'element-ui'
import { sessionStorageSetItem } from '../../utils/index'

export interface State {
  loginResult: {
    code: number
    message: string
  }
}
export interface loginInfoType {
  //登陆参数
  username: string
  password: string
  code: string
}

// initial state
const state: State = {
  loginResult: {
    code: 200,
    message: ''
  }
}

const mutations = {
  SET_CODE: (state: State, result: any) => {
    state.loginResult.code = result.code
  },
  SET_RESULT: (state: State, result: any) => {
    state.loginResult.message = result.err
  }
}
// actions
const actions = {
  Login(context: { commit: Commit; state: State }, userInfo: loginInfoType) {
    // 用户登录
    const username = userInfo.username.trim()
    return new Promise(async (resolve, reject) => {
      loginByUsername(username, userInfo.password, userInfo.code)
        .then(response => {
          // const data: CodeMsg<LoginResp> = loginResp.data;

          context.commit('SET_CODE', response.data)
          let userInfo: any = response.data.msg
          let role = { ...userInfo.role }
          sessionStorageSetItem('userInfo', role) //将用户数据存放入sessionStorage
          sessionStorageSetItem('x-token', userInfo.token) //将用户数据存放入sessionStorage
          sessionStorageSetItem('tokenGetTime', new Date().getTime())
          sessionStorageSetItem('jushangInfo', userInfo.jsCfg) //将用户数据存放入sessionStorage
          sessionStorageSetItem('user', userInfo.user) //将用户数据存放入sessionStorage
          sessionStorageSetItem('pid', userInfo.pid) //将用户数据存放入sessionStorage
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          context.commit('SET_CODE', error)
          context.commit('SET_RESULT', error)
          resolve()
        })
    })
  },

  LogOut(context: { commit: Commit; state: State }) {
    // 登出
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      logout()
        .then(response => {
          context.commit('SET_CODE', response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
          context.commit('SET_CODE', error)
          context.commit('SET_RESULT', error)
          resolve()
        })
    })
  },

  FedLogOut(context: { commit: Commit; state: State }) {
    // 前端 登出
    return new Promise(resolve => {
      context.commit('SET_TOKEN', '')
      resolve()
    })
  }
}
export default {
  state,
  // getters,
  actions,
  mutations
}
