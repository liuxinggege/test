import { Commit } from 'vuex';
import { reg } from "../../api/admin/user/index";
import { sessionStorageSetItem } from "../../utils";
export interface State {
  loginResult: {
    code: number
    message: string
    TGPURL: string
    isnew: boolean
  }
  regResult: {
    code: number
    message:string
  }
}
export interface loginInfoType { //登陆参数
    userid: string
    password: string
}
export interface regInfoType { //注册参数
    userid:string
    username:string
    password:string
}

const state: State = {
  loginResult: {
    code: 200,
    message: '',
    TGPURL: "",
    isnew: false
  },
  regResult:{
    code: 200,
    message: '',
  }
}
const mutations = {
  SET_CODE: (state: State, result: any) => {
    const { code, data } = result
    state.loginResult.code = code;
    state.loginResult.TGPURL = data.TGPURL;
    state.loginResult.isnew = data.isnew;
  },
  SET_RESULT: (state: State, result: any) => {
    state.loginResult.message = result.err
  },
  SET_REGSTATUS:(state:State,result: any) => {
    state.regResult.code = result.code;
    state.regResult.message = result.msg;
  }
}

const actions = {
  Reg(context: { commit: Commit; state: State },userInfo:regInfoType){
      return new Promise(async (resolve, reject) => {
        const {userid,username,password} = userInfo;
        reg(userid,username,password)
          .then(res => {
              console.log(res)
              context.commit("SET_REGSTATUS",res.data)
              resolve()
          })
          .catch(error => {
              console.log(error)
              context.commit("SET_REGSTATUS",error)
              resolve()
          })
      })
  },
  Login(context: { commit: Commit; state: State }, userInfo: loginInfoType) {
    return new Promise(async (resolve, reject) => {
      const {userid,password} = userInfo;
      var result = {
         code:200,
         data:{
           access_token:"test",
           username:"tanyong"
         }
       }
          context.commit('SET_CODE', result)
          sessionStorageSetItem("login-data",result);
          sessionStorageSetItem('user',{name:result.data.username});
          sessionStorageSetItem('tokenGetTime',Date.now());
          // sessionStorageSetItem('Authorization',result.data.Authorization);
          sessionStorageSetItem('x-token',{token:result.data.access_token,ttl:3600 * 60});
          sessionStorageSetItem('userInfo',{
              pages:[]
          });
          resolve();
      //  login(userid,password)
      //   .then(res => {
      //     const result = res.data;
      //     context.commit('SET_CODE', result)
      //     sessionStorageSetItem("login-data",result);
      //     sessionStorageSetItem('user',{name:result.data.username});
      //     sessionStorageSetItem('tokenGetTime',Date.now());
      //     sessionStorageSetItem('Authorization',result.data.Authorization);
      //     sessionStorageSetItem('x-token',{token:result.data.access_token,ttl:3600 * 60});
      //     sessionStorageSetItem('userInfo',{
      //         pages:[]
      //     });
      //     resolve();
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     // console.error('catch', error)
      //     // context.commit('SET_CODE', error)
      //     // context.commit('SET_RESULT', error)
      //     resolve()
      //   })
       
    });
  }
}
export default {
  state,
  // getters,
  actions,
  mutations
}
