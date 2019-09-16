import { loginByUsername, loginOut, getCode } from '../../api/agent/login'
import { CodeMsg } from '../index'
import { Commit } from 'vuex'
import store from '../../store'
import { Message } from 'element-ui';
import { sessionStorageSetItem } from '../../utils/index'

export interface State {
  loginResult: {
    code: number
    message: string
  }
}
export interface loginInfoType {//登陆参数
  name: string,
  pwd: string,
  code: string,
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
  SET_STORAGE: (state: State, data: any) => {
    sessionStorage.setItem("act", data.act);
    sessionStorage.setItem("rate", data.rate);
    sessionStorage.setItem("avatar", data.avatar);
    sessionStorage.setItem("createDate", data.createDate);
    sessionStorage.setItem("money", data.money);
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("uid", data.uid);
    sessionStorage.setItem("qq", data.qq);
    sessionStorage.setItem("wx", data.wx);
    sessionStorage.setItem("loginAct", data.loginAct);
  }
}
// actions
const actions = {
  Login(context: { commit: Commit, state: State }, userInfo: loginInfoType) { // 用户登录
    const username = userInfo.name.trim()
    return new Promise(async (resolve, reject) => {
      loginByUsername(username, userInfo.pwd, userInfo.code).then(response => {
        // const data: CodeMsg<LoginResp> = loginResp.data;        

        context.commit('SET_CODE', response.data)
        let userInfo: any = response.data.msg
        context.commit('SET_STORAGE', userInfo.info);
        sessionStorageSetItem("userInfo", userInfo.info);//将用户数据存放入sessionStorage
        sessionStorageSetItem("tokenGetTime", new Date().getTime());
        sessionStorageSetItem("x-token", userInfo.token);//将用户数据存放入sessionStorage  

        resolve()
      }).catch(error => {
        console.error("catch", error)
        context.commit('SET_CODE', error)
        context.commit('SET_RESULT', error)
        resolve()
      })
    });
  },
  GetCode(context: { commit: Commit, state: State }, name: String) { // 获取登录验证码
    return new Promise(async (resolve, reject) => {
      getCode(name.trim()).then(response => {
        // const data: CodeMsg<LoginResp> = loginResp.data;        
        context.commit('SET_CODE', response.data)
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
      // logout(state.token).then(() => {
      loginOut().then(response => {
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
