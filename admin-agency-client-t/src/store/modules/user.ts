import { loginByUsername, logout, getUserInfo } from '../../api/agent/login'
import { CodeMsg } from '../index'
import { Commit } from 'vuex'
import store from '../../store'
import { xutil } from '../../utils/xutil';

export interface State {
  loginResult: {
    code: number
    message: string
  }
}
export interface loginInfoType {//登陆参数
  username: string,
  password: string,
}

// initial state
const state: State = {
  loginResult: {
    code: 200,
    message: ""
  }
}

const mutations = {
  SET_CODE: (state: State, result: any) => {
    state.loginResult.code = result.code
  },
  SET_RESULT: (state: State, result: any) => {
    state.loginResult.message = result.err
  },
}
// actions
const actions = {
  Login(context: { commit: Commit, state: State }, userInfo: loginInfoType) { // 用户登录
    const username = userInfo.username.trim()
    return new Promise(async (resolve, reject) => {
      loginByUsername(username, userInfo.password).then(response => {
        context.commit('SET_CODE', response.data)
        let userInfo: any = response.data.msg

        xutil.sessionStorageSetItem("userInfo", userInfo.info);//将用户数据存放入sessionStorage
        xutil.sessionStorageSetItem("name", userInfo.info.act);//存渠道act
        if (userInfo.info.purview) {
          xutil.sessionStorageSetItem("pageRoute", userInfo.info.purview.page);//页面权限
          xutil.sessionStorageSetItem("domRoute", userInfo.info.purview.dom);//节点权限
        }
        xutil.sessionStorageSetItem("x-token", userInfo.token);//x-token
        xutil.sessionStorageSetItem("tokenGetTime", new Date().getTime());
        xutil.sessionStorageSetItem("allowSetAgency", userInfo.allowSetAgency);
        xutil.sessionStorageSetItem("parentIdInfo", userInfo.parentIdInfo);
        //console.log("userInfo",userInfo);
        resolve()
      }).catch(error => {
        console.error("catch", error)
        context.commit('SET_CODE', error)
        context.commit('SET_RESULT', error)
        resolve()
      })
    });
  },

  LogOut(context: { commit: Commit, state: State }) { // 登出
    return new Promise((resolve, reject) => {
      // sessionStorage.clear()
      logout().then(response => {
        context.commit('SET_CODE', response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        context.commit('SET_CODE', error)
        context.commit('SET_RESULT', error)
        resolve()
      })
    })
  },

  FedLogOut(context: { commit: Commit, state: State }) { // 前端 登出
    return new Promise(resolve => {
      context.commit('SET_TOKEN', '')
      resolve()
    })
  },
}
export default {
  state,
  // getters,
  actions,
  mutations
}
