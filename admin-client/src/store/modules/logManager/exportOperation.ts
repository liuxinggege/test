import { exportTotalTaxAndIncome, exportTotalExchange,exportUserBaseInfo,exportUserChargedInfo } from '../../../api/admin/logManage/log'
import { Commit } from 'vuex'
export interface State {
    code: number,
    err: string
}

// initial state
const state: State = {
    code: 0,
    err: "",
}

const mutations = {
    SET_ERROR: (state: State, data: any) => {
        state.code = data.code
        state.err = data.err
    }
}
// actions
const actions = {
    ExportTotalTaxAndIncome(context: { commit: Commit}, params) { //统计代理的税收和利润的总和
        return new Promise(async (resolve, reject) => {
            exportTotalTaxAndIncome(params).then((res) => {
                resolve(res.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
      ExportTotalExchange(context: { commit: Commit}, params) { //统计代理下级的兑换数据的总和
        return new Promise(async (resolve, reject) => {
            exportTotalExchange(params).then((res) => {
                resolve(res.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
      ExportUserBaseInfo(context: { commit: Commit}, params) { //统计用户信息
        return new Promise(async (resolve, reject) => {
            exportUserBaseInfo(params).then((res) => {
                resolve(res.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
      ExportUserChargedInfo(context: { commit: Commit}, params) { //统计充值用户信息
        return new Promise(async (resolve, reject) => {
            exportUserChargedInfo(params).then((res) => {
                resolve(res.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
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
