import { Commit } from 'vuex';
import { getExportLog } from '../../../api/admin/logManage/log';
export interface State {
    pageData: any[],
    code: number,
    totalCount: number,
    err: string
}
// initial state
const state: State = {
    pageData: [],
    code: 0,
    totalCount: 0,
    err: "",
}

const mutations = {
    SET_EXPORTLOG: (state: State, data: any) => {
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
    GetExportLog(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getExportLog(queryItem).then((response: { data }) => {
                console.log(response);
                context.commit('SET_EXPORTLOG', response.data)
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
    // getters,
    actions,
    mutations
}
