import {
    addgetAdvertisement,
    delgetAdvertisement,
    updategetAdvertisement,
    getgetAdvertisement,
    getPid
} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    lobbyMarquee: LobbyMarquee[],
    code: number,
    msg: string,
    pid: string,
}
export interface LobbyMarquee {
    content: string,
    active: boolean,
    pid: string,
}

// initial state
const state: State = {
    lobbyMarquee: [],
    pid: "",
    msg: "",
    code: 0,
}

const mutations = {
    SET_ADVERTISEMENT: (state: State, data: CodeMsg<LobbyMarquee[]>) => {
        state.lobbyMarquee = data.msg;

    },

    UPDATE_ADVERTISEMENTCODE: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
    },

    SET_ADVERTISEMENTERR: (state: State, data: CodeMsg<any>) => {
        state.msg = data.msg || data.err
    },
    RESET_ADVERTISEMENT_CODE: (state: State) => {
        console.log("重置RESET_ADVERTISEMENT_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetPid(context: { commit: Commit, state: State }) { //获取pid
        return new Promise(async (resolve, reject) => {
            getPid().then((response: { data }) => {
                resolve(response.data.msg)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddgetAdvertisement(context: { commit: Commit, state: State }, data) { //添加Advertisement  游戏大厅公告
        context.commit('RESET_ADVERTISEMENT_CODE')
        return new Promise(async (resolve, reject) => {
            addgetAdvertisement(data).then((response: { data }) => {
                context.commit('UPDATE_ADVERTISEMENTCODE', response.data)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_ADVERTISEMENTERR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },

    DelgetAdvertisement(context: { commit: Commit, state: State }, data) { //删除Advertisement  游戏大厅公告
        context.commit('RESET_ADVERTISEMENT_CODE')
        return new Promise(async (resolve, reject) => {
            delgetAdvertisement(data).then((response: { data }) => {
                context.commit('UPDATE_ADVERTISEMENTCODE', response.data)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_ADVERTISEMENTERR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdategetAdvertisement(context: { commit: Commit, state: State }, data) { //更新Advertisement  游戏大厅公告
        context.commit('RESET_ADVERTISEMENT_CODE')
        return new Promise(async (resolve, reject) => {
            updategetAdvertisement(data).then((response: { data }) => {
                context.commit('UPDATE_ADVERTISEMENTCODE', response.data)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_ADVERTISEMENTERR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },

    GetgetAdvertisement(context: { commit: Commit, state: State }, pid) { //获取Advertisement  游戏大厅公告
        context.commit('RESET_ADVERTISEMENT_CODE')
        return new Promise(async (resolve, reject) => {
            getgetAdvertisement(pid).then((response: { data }) => {
                context.commit('SET_ADVERTISEMENT', response.data)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_ADVERTISEMENTERR', error)
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
