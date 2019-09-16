import { getFakeLocation, insertFakeLocation, fixFakeLocation, deletFakeLocation } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    subFaLocation: FLState[]
    totalCount: number
    code: number
    insertCode: number
    fixCode: number
    deletCode: number
}

export interface FLState {
    active: boolean
    location: string
    uid: number
    _id: string
}

type GetFakeLocationResp = State;//获取结果FakeLocation

// initial state
const state: State = {
    subFaLocation: [],
    totalCount: 0,
    code: 0,
    insertCode: 0,
    fixCode: 0,
    deletCode: 0,
}

const mutations = {
    SET_FAKELOCATION: (state: State, data: FLState[]) => {
        state.subFaLocation = data
        state.totalCount = data.length
    },

    INSERT_FAKELOCATION: (state: State, code) => {
        state.insertCode = code
    },
    FIX_FAKELOCATION: (state: State, code) => {
        state.fixCode = code
    },
    DELET_FAKELOCATION: (state: State, code) => {
        state.deletCode = code
    },
    RESET_ALL_CODE: (state: State) => {
        console.log("重置RESET_ALL_CODE")
        state.insertCode = 0
        state.fixCode = 0
        state.deletCode = 0
    },
}
// actions
const actions = {
    GetFakeLocation(context: { commit: Commit, state: State }, updateData) { //获取FakeLocation
        return new Promise(async (resolve, reject) => {
            getFakeLocation(updateData).then((response: { data }) => {
                context.commit('SET_FAKELOCATION', <GetFakeLocationResp>response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    InsertFakeLocation(context: { commit: Commit, state: State }, updateData) { //更新FakeLocation
        context.commit("RESET_ALL_CODE")
        return new Promise(async (resolve, reject) => {
            insertFakeLocation(updateData).then((response: { data }) => {
                context.commit('INSERT_FAKELOCATION', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    FixFakeLocation(context: { commit: Commit, state: State }, updateData) { //更新FakeLocation
        context.commit("RESET_ALL_CODE")
        return new Promise(async (resolve, reject) => {
            fixFakeLocation(updateData).then((response: { data }) => {
                context.commit('FIX_FAKELOCATION', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    DeletFakeLocation(context: { commit: Commit, state: State }, updateData) { //DELFakeLocation
        context.commit("RESET_ALL_CODE")
        return new Promise(async (resolve, reject) => {
            deletFakeLocation(updateData).then((response: { data }) => {
                context.commit('DELET_FAKELOCATION', response.data.code)
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
