import { getRecoverSectionLog, getRecoverSectionLogExcel } from '../../../../api/admin/logManage/log'
import { CodeMsg } from '../../../index'
import { Commit } from 'vuex'
import store from '../../../../store'

export interface State {
    recoverSectionData: RecoverSectionData[],
    code: number
    totalCount: number
}
export interface RecoverSectionData {
    from: number
    logDate: string
    money: string
    optDiscription: string
    optUser: string
    to: number
    _id: string
}
type Msg = {
    data: RecoverSectionData[]
    totalCount: number
}
type GetRecoverSectionLogResp = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    recoverSectionData: [],
    code: 0,
    totalCount: 0
}

const mutations = {
    SET_RECOVERSECTIONLOG: (state: State, data: GetRecoverSectionLogResp) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.recoverSectionData = data.msg.data
    },
}
// actions
const actions = {
    GetRecoverSectionLog(context: { commit: Commit, state: State }, queryItem) { //获取RecoverSection
        return new Promise(async (resolve, reject) => {
            getRecoverSectionLog(queryItem).then((response: { data }) => {
                context.commit('SET_RECOVERSECTIONLOG', <GetRecoverSectionLogResp>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetRecoverSectionLogExcel(context: { commit: Commit, state: State }, queryItem) { //获取RecoverSection
        return new Promise(async (resolve, reject) => {
            getRecoverSectionLogExcel(queryItem).then((response: { data }) => {
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
