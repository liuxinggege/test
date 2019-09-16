import { Commit } from 'vuex';
import { getVipPrivilegeList } from '../../../api/admin/gameSetting/gameSetting';
export interface State {
    pageData: any[],
    code: number,
    totalCount: number,
    totalReceiveCount: number,
    err: string
}
// initial state
const state: State = {
    pageData: [],
    code: 0,
    totalCount: 0,
    totalReceiveCount: 0,
    err: "",
}

const mutations = {
    SET_STATEPRIVILEGE: (state: State, data: any) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.pageData = data.msg.pageData
    },
    SET_ERROR: (state: State, data: any) => {
        state.code = data.code
        state.err = data.err
    },
}
// actions
const actions = {
    GetVipPrivilegeList(context: { commit: Commit, state: State }, queryItem) { //获取
        return new Promise(async (resolve, reject) => {
            getVipPrivilegeList(queryItem).then((response: { data }) => {
                context.commit('SET_STATEPRIVILEGE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    }
}
export default {
    state,
    actions,
    mutations
}
