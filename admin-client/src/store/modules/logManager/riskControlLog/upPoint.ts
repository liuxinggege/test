import { getupPointLog, getupPointLogExcel } from '../../../../api/admin/logManage/log'
import { CodeMsg } from '../../../index'
import { Commit } from 'vuex'
import store from '../../../../store'

export interface State {
    uppointData: UppointData[],
    code: number
    totalCount: number
}
export interface UppointData {
    logDate: string
    money: string
    optDiscription: string
    optUser: string
    rmb: string
    type: number
    uid: number
    _id: string
}
type Msg = {
    data: UppointData[]
    totalCount: number
}
type GetUppointLogResp = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    uppointData: [],
    code: 0,
    totalCount: 0
}

const mutations = {
    SET_UPPOINTLOG: (state: State, data: GetUppointLogResp) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.uppointData = data.msg.data
    },
}
// actions
const actions = {
    GetUppointLog(context: { commit: Commit, state: State }, queryItem) { //获取Uppoint
        return new Promise(async (resolve, reject) => {
            getupPointLog(queryItem).then((response: { data }) => {
                context.commit('SET_UPPOINTLOG', <GetUppointLogResp>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetUppointLogExcel(context: { commit: Commit, state: State }, queryItem) { //获取Uppoint
        return new Promise(async (resolve, reject) => {
            getupPointLogExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
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
