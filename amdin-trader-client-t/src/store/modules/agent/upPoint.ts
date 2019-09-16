import { userInfo,upPoint,getRegistrantInfo } from '../../../api/agent/upPoint'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {
    act: string,
    uid: number,
    name: string,
    money: string,
    bankMoney: string
}
export interface businessInfo {
    act: string,
    uid: number,
    name: string,
    money: string,
    bankMoney: string
}

// initial state
const state = {
    act: "",
    uid: 0,
    name: "",
    money: "",
    bankMoney: ""
}


const mutations = {
    SET_REGISTINFO: (state, data) => {
        sessionStorage.setItem("act", data.act);
        sessionStorage.setItem("avatar", data.avatar);
        sessionStorage.setItem("createDate", data.createDate);
        sessionStorage.setItem("money", data.money);
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("uid", data.uid);
        sessionStorage.setItem("qq", data.qq);
        sessionStorage.setItem("wx", data.wx);
        sessionStorage.setItem("wx", data.wx);
    },
    SET_USERINFO: (state, data) => {
        state.act = data.act;
        state.uid = data.uid;
        state.name = data.name;
        state.money = data.money;
        state.bankMoney = data.bankMoney
    },
    SET_CLEARUSERINFO: (state) => {
        state.act = "";
        state.uid = 0;
        state.name = "";
        state.money = "";
        state.bankMoney = ""
    }
}
// actions
const actions = {
    UserInfo(context: { commit: Commit, state: State },payload) {
        context.commit('SET_CLEARUSERINFO');
        return new Promise(async (resolve, reject) => {
            userInfo(payload).then(res => {
                if (res.data.code == 200) {
                    context.commit('SET_USERINFO', res.data.msg)
                } else {
                    context.commit('SET_CLEARUSERINFO')
                }
                resolve(res.data)
            }).catch(error => {
                context.commit('SET_CLEARUSERINFO');
                console.error("catch", error)
                resolve(error);
            })
        });
    },

    UpPoint(context: { commit: Commit, state: State }, payload) {
        return new Promise(async (resolve, reject) => {
            upPoint(payload).then(response => {
                context.commit('SET_CLEARUSERINFO');
                resolve(response.data);
            }).catch(error => {
                context.commit('SET_CLEARUSERINFO');
                console.error("catch", error)
                resolve(error);
                return;
            })
        });
    },

    GetRegistrantInfo(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getRegistrantInfo().then(res => {
                let userInfo = res.data.msg
                context.commit('SET_REGISTINFO', userInfo)
                resolve(res.data);
            }).catch(error => {
                resolve(error);
            })
        });
    },

}
export default {
    state,
    actions,
    mutations
}
