import {
    getBillboard,
    updateBillboard,
    delBillboard,
    addBillboard,
} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    billboardArr: BillboardArr[]
    code: number
    msg: string
}
export interface BillboardArr {
    active: boolean
    content: string
    idx: number
    sequence: number
    subTitle: string
    title: string
    pid: string
}



// initial state
const state: State = {
    billboardArr: [],
    code: 0,
    msg: ""
}

const mutations = {
    SET_BILLBOARD: (state: State, data: CodeMsg<BillboardArr[]>) => {
        state.billboardArr = data.msg
    },
    UPDATE_BILLBOARD: (state: State, code: number) => {
        state.code = code
    },
    RESET_BILLBOARD_CODE: (state: State) => {
        console.log("重置RESET_BILLBOARD_CODE")
        state.code = 0
    },
    SET_BILLBOARD_ERR: (state: State, data: CodeMsg<any>) => {
        state.msg = data.msg || data.err
    },
}
// actions
const actions = {
    GetBillboard(context: { commit: Commit, state: State }, pid) { //获取
        return new Promise(async (resolve, reject) => {
            getBillboard(pid).then((response: { data }) => {
                context.commit('SET_BILLBOARD', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateBillboard(context: { commit: Commit, state: State }, updateData) {
        context.commit("RESET_BILLBOARD_CODE")
        return new Promise(async (resolve, reject) => {
            updateBillboard(updateData).then((response: { data }) => {
                context.commit('UPDATE_BILLBOARD', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('SET_BILLBOARD_ERR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },
    DelBillboard(context: { commit: Commit, state: State }, id) {
        context.commit("RESET_BILLBOARD_CODE")
        return new Promise(async (resolve, reject) => {
            delBillboard(id).then((response: { data }) => {
                context.commit('UPDATE_BILLBOARD', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('SET_BILLBOARD_ERR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddBillboard(context: { commit: Commit, state: State }, data) {
        context.commit("RESET_BILLBOARD_CODE")
        return new Promise(async (resolve, reject) => {
            addBillboard(data).then((response: { data }) => {
                context.commit('UPDATE_BILLBOARD', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('SET_BILLBOARD_ERR', error)
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
