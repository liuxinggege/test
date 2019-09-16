import { getBackstageLoginlog, getBackstageLoginlogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    backstageLoginlogData: backstageLoginlogData[],
    code: number
    totalCount: number
}
export interface backstageLoginlogData {
    createDate: Date
    ip: string
    ipLocation: string
    serverType: string
    act: string
}


// initial state
const state: State = {
    backstageLoginlogData: [],
    code: 0,
    totalCount: 0
}

const mutations = {
    SET_LOGINLOG: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.backstageLoginlogData = data.msg.pageData
    },
}
// actions
const actions = {
    GetbackstageLoginlog(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getBackstageLoginlog(queryItem).then((response: { data }) => {
                context.commit('SET_LOGINLOG', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetbackstageLoginlogExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getBackstageLoginlogExcel(queryItem).then((response: { data }) => {
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
