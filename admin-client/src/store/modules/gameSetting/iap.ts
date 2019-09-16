import { getIap, insertIap, fixIap, deletIap } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    goodsInfo: FLState[]
    totalCount: number
    code: number
    insertCode: number
    fixCode: number
    deletCode: number

}

export interface GoodsInfo {
    goodsName: string
    money: number
    price: number
}

export interface FLState {
    boundId: string
    goodsInfo: GoodsInfo[]
    name: string
    _id: string
}

type GetIapResp = State;//获取结果Iap

// initial state
const state: State = {
    goodsInfo: [],
    totalCount: 0,
    code: 0,
    insertCode: 0,
    fixCode: 0,
    deletCode: 0,
}

const mutations = {
    GET_IAP: (state: State, data) => {
        state.goodsInfo = data.pageData
        state.totalCount = data.totalCount
    },

    INSERT_IAP: (state: State, code) => {
        state.insertCode = code
    },
    FIX_IAP: (state: State, code) => {
        state.fixCode = code
    },
    DELET_IAP: (state: State, code) => {
        state.deletCode = code
    },
    RESET_IAP_CODE: (state: State) => {
        console.log("重置RESET_IAP_CODE")
        state.insertCode = 0
        state.fixCode = 0
        state.deletCode = 0
    },
}
// actions
const actions = {
    GetIap(context: { commit: Commit, state: State }, updateData) { //获取Iap
        return new Promise(async (resolve, reject) => {
            getIap(updateData).then((response: { data }) => {
                context.commit('GET_IAP', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    InsertIap(context: { commit: Commit, state: State }, updateData) { //更新Iap
        context.commit("RESET_IAP_CODE")
        return new Promise(async (resolve, reject) => {
            insertIap(updateData).then((response: { data }) => {
                context.commit('INSERT_IAP', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    FixIap(context: { commit: Commit, state: State }, updateData) { //更新Iap
        return new Promise(async (resolve, reject) => {
            fixIap(updateData).then((response: { data }) => {
                context.commit('FIX_IAP', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    DeletIap(context: { commit: Commit, state: State }, updateData) { //更新Iap
        return new Promise(async (resolve, reject) => {
            deletIap(updateData).then((response: { data }) => {
                context.commit('DELET_IAP', response.data.code)
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
