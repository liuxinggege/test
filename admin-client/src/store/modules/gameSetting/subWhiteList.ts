import { getSubWhiteList, updateSubWhiteList } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'

export interface State {
    matchIP: string[]
    code: number
}

type GetSubWhiteListResp = State;//获取结果SubWhiteList

// initial state
const state: State = {
    matchIP: [],
    code: 0,
}

const mutations = {
    SET_SUBWHITELIST: (state: State, data: GetSubWhiteListResp) => {
        state.matchIP = data.matchIP
    },
    UPDATE_SUBWHITELIST: (state: State, code) => {
        state.code = code
    },
    RESET_SUBWHITELIST_CODE: (state: State) => {
        console.log("重置RESET_SUBWHITELIST_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetSubWhiteList(context: { commit: Commit, state: State }) { //获取SubWhiteList
        return new Promise(async (resolve, reject) => {
            getSubWhiteList().then((response: { data }) => {
                context.commit('SET_SUBWHITELIST', <GetSubWhiteListResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSubWhiteList(context: { commit: Commit, state: State }, updateData) { //更新SubWhiteList
        context.commit("RESET_SUBWHITELIST_CODE")
        return new Promise(async (resolve, reject) => {
            updateSubWhiteList(updateData).then((response: { data }) => {
                context.commit('UPDATE_SUBWHITELIST', response.data.code)
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
