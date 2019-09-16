import { resolve } from "dns";

export interface State {
    socketState?: number,
    orderSocketState?: number,
    socketShow?: boolean,
    socketSend: number,
    unread: any
}

const state = {
    socketState: 3,
    orderSocketState: 100,
    socketShow: false,
    socketSend: 0,
    unread: {}
}
const mutations = {
    SET_SOCKET: (state: State, data) => {
        state.socketState = data;
    },
    SET_ORDER: (state: State, data) => {
        state.orderSocketState = data;
    },
    SET_SHOWTALK: (state: State, data) => {
        state.socketShow = data;
    },
    SET_SOKETSEND: (state: State, data) => {
        state.socketSend = data;
    },
    SET_UNREAD: (state: State, data) => {
        state.unread[data.id] = data.count
    },
    REMOVE_UNREAD: (state: State, id) => {
        state.unread[id] = 0
        let temp = { ...state.unread }
        state.unread = temp;
    }
}
const actions = {
    updateSocket(context: { commit, state: State }, data) {
        context.commit('SET_SOCKET', data)
    },
    updateSocketOrder(context: { commit, state: State }, data) {
        context.commit('SET_ORDER', data)
    },
    updateSocketShow(context: { commit, state: State }, data) {
        context.commit('SET_SHOWTALK', data)
    },
    updateSocketSend(context: { commit, state: State }, data) {
        context.commit('SET_SOKETSEND', data)
    },
    updateUnread(context: { commit, state: State }, data) {
        context.commit('SET_UNREAD', data)
    },
    removeUnread(context: { commit, state: State }, id) {
        context.commit('REMOVE_UNREAD', id)
    },
}
export default {
    state,
    mutations,
    actions
}