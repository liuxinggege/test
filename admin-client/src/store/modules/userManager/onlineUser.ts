import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import { getOnlineUser, downloadOnlineUser, kickUser } from '../../../api/admin/userManager/userManager';


export interface OnlineTable {
    uid: number,
    channel: string,
    ip: string,
    location:string,
    gid: string
}
export interface State {
    onlineTable: OnlineTable[],
    totalCount:number,
    code:number,
    msg:string
}

const state: State = {
    onlineTable: [{
        uid: 0,
        channel: "",
        ip: "",
        location:"",
        gid: ""
    }],
    totalCount:0,
    code:0,
    msg:"",
}

const mutations = {
    SET_ONLINETABLE: (state: State, data: CodeMsg<any>) => {
        state.code = data.code;
        state.onlineTable = data.msg.data;
        state.totalCount = data.msg.totalCount
    },
    SET_EXPORTONLINETABLE: (state: State, data: CodeMsg<any>) => {
        state.code = data.code;
        state.onlineTable = data.msg||data.err;
    },
    SET_CODE: (state: State, data: CodeMsg<any>) => {
        state.code = data.code;
        state.msg = data.msg;
    },
    SET_ERROR: (state: State, data: CodeMsg<any>) => {
        state.code = data.code;
        state.msg = data.err
    },
}
// actions
const actions = {
    GetOnlineUser(context: { commit: Commit, state: State }, queryItem) { //获取普通用户信息
        return new Promise(async (resolve, reject) => {
            getOnlineUser(queryItem).then((response: { data }) => {
                context.commit('SET_ONLINETABLE', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },
    KickUser(context: { commit: Commit, state: State }, queryItem) { //踢玩家
        return new Promise(async (resolve, reject) => {
            kickUser(queryItem).then((response: { data }) => {
                context.commit('SET_CODE', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    DownloadOnlineUser(context: { commit: Commit, state: State }, queryItem) { //获取普通用户信息
        return new Promise(async (resolve, reject) => {
            downloadOnlineUser(queryItem).then((response: { data }) => {
                context.commit('SET_EXPORTONLINETABLE', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error)
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
