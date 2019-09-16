import { Commit } from 'vuex';
import { getVipPrivilegeListCount } from '../../../api/admin/VIPManager/VIPManager';
export interface State {
    pageData: any[],
    code: number,
    // totalCount: number,
    totalReceiveCount: number,
    err: string
}
// initial state
const state: State = {
    pageData: [],
    code: 0,
    // totalCount: 0,
    totalReceiveCount: 0,
    err: "",
}

const mutations = {
    SET_STATE: (state: State, data: any) => {
        state.code = data.code
        // state.totalCount = data.msg.totalCount
        state.pageData = data.msg.data
        state.totalReceiveCount = data.msg.totalReceiveCount
    },
    SET_ERROR: (state: State, data: any) => {
        state.code = data.code
        state.err = data.err
    },
}
// actions
const actions = {
    GetVipPrivilegeListCount(context: { commit: Commit, state: State }, queryItem) { //获取
        return new Promise(async (resolve, reject) => {
            getVipPrivilegeListCount(queryItem).then((response: { data }) => {
                context.commit('SET_STATE', response.data)
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
