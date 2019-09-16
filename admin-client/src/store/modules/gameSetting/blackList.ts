import {
    getBlackList,
    addBlackList,
    delBlackList,
} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface WithDraw {
    type: string
    info: string
    operator: string
    createDate: string
}
export interface State {
    withdraw: WithDraw[]
    code: number
    totalCount: number
    msg: string
}

type GetBlackListResp = State;//获取结果BlackList

// initial state
const state: State = {
    withdraw: [{
        type: "",
        info: "",
        operator: "",
        createDate: "",
    }],
    code: 0,
    totalCount: 0,
    msg: ""
}

const mutations = {
    SET_BLACKLIST: (state: State, data: CodeMsg<any>) => {
        state.withdraw = data.msg.pageData
        state.totalCount = data.msg.totalCount
    },
    UPDATE_BLACKLIST: (state: State, code) => {
        state.code = code
    },
    SET_BLACKLISTERR: (state: State, data: CodeMsg<any>) => {
        state.msg = data.msg || data.err
    },
    RESET_BLACKLIST_CODE: (state: State) => {
        console.log("重置RESET_BLACKLIST_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetBlackList(context: { commit: Commit, state: State }, data) { //获取BlackList
        return new Promise(async (resolve, reject) => {
            getBlackList(data).then((response: { data }) => {
                context.commit('SET_BLACKLIST', <GetBlackListResp>response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_BLACKLISTERR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddBlackList(context: { commit: Commit, state: State }, updateData) { //更新BlackList
        context.commit("RESET_BLACKLIST_CODE")
        return new Promise(async (resolve, reject) => {
            addBlackList(updateData).then((response: { data }) => {
                context.commit('UPDATE_BLACKLIST', response.data.code);
                resolve()
            }).catch(error => {
                context.commit('SET_BLACKLISTERR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    DelBlackList(context: { commit: Commit, state: State }, id) { //更新BlackList
        context.commit("RESET_BLACKLIST_CODE")
        return new Promise(async (resolve, reject) => {
            delBlackList(id).then((response: { data }) => {
                context.commit('UPDATE_BLACKLIST', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('SET_BLACKLISTERR', error);
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
