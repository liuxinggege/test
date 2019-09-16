import { getJushangConfig, insertJushangConfig, fixJushangConfig, deletJushangConfig } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    subFaLocation: FLState[]
    code: number
    insertCode: number
    fixCode: number
    deletCode: number
}

export interface FLState {
    adminUsers: string[]
    rateToJS: string
    rateToMer: string
    rate: string
    users: number[]
    uid: number
    _id: string
}

type GetJushangConfigResp = State;//获取结果JushangConfig

// initial state
const state: State = {
    subFaLocation: [],
    code: 0,
    insertCode: 0,
    fixCode: 0,
    deletCode: 0,
}

const mutations = {

    GET_JUSHANGCONFIG: (state: State, data: FLState[]) => {
        state.subFaLocation = data
    },

    INSERT_JUSHANGCONFIG: (state: State, code) => {
        state.insertCode = code
    },
    FIX_JUSHANGCONFIG: (state: State, code) => {
        state.fixCode = code
    },
    DELET_JUSHANGCONFIG: (state: State, code) => {
        state.deletCode = code
    },
    RESET_JUSHANG_CODE: (state: State) => {
        console.log("重置RESET_JUSHANG_CODE")
        state.insertCode = 0
        state.fixCode = 0
        state.deletCode = 0
        state.code = 0
    },
}
// actions
const actions = {
    GetJushangConfig(context: { commit: Commit, state: State }) { //获取JushangConfig
        return new Promise(async (resolve, reject) => {
            getJushangConfig().then((response: { data }) => {
                context.commit('GET_JUSHANGCONFIG', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    InsertJushangConfig(context: { commit: Commit, state: State }, updateData) { //添加JushangConfig
        context.commit("RESET_JUSHANG_CODE")
        return new Promise(async (resolve, reject) => {
            insertJushangConfig(updateData).then((response: { data }) => {
                context.commit('INSERT_JUSHANGCONFIG', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    FixJushangConfig(context: { commit: Commit, state: State }, updateData) { //更新JushangConfig
        context.commit("RESET_JUSHANG_CODE")
        return new Promise(async (resolve, reject) => {
            fixJushangConfig(updateData).then((response: { data }) => {
                context.commit('FIX_JUSHANGCONFIG', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    DeletJushangConfig(context: { commit: Commit, state: State }, updateData) { //删除ushangConfig
        context.commit("RESET_JUSHANG_CODE")
        return new Promise(async (resolve, reject) => {
            deletJushangConfig(updateData).then((response: { data }) => {
                context.commit('DELET_JUSHANGCONFIG', response.data.code)
                resolve()
            }).catch(error => {
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
