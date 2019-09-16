import { getaAencyMoneyChange,exportAgencyMoneyChange } from "../../../api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'

export interface State {
    agencyMoneyChangeData: any[]
    totalCount: number
    code: number
    msg: string
}

// initial state
const state: State = {
    agencyMoneyChangeData: [],
    totalCount: 0,
    code: 0,
    msg: "",
}

const mutations = {
    SET_MONEYCHANGE: (state: State, result: CodeMsg<any>) => {
        state.code = result.code;
        state.agencyMoneyChangeData = result.msg.pageData
        state.totalCount = result.msg.totalCount

    },
    SET_MONEYCHANGEERROR: (state: State, result: CodeMsg<any>) => {
        state.msg = result.err;
        state.code = result.code;
    },

}
// actions
const actions = {
    GetAgencyMoneyChange(context: { commit: Commit, state: State }, data) {//pageData用
        return new Promise(async (resolve, reject) => {
            getaAencyMoneyChange(data).then(response => {
                context.commit('SET_MONEYCHANGE', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_MONEYCHANGEERROR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },
    ExportAgencyMoneyChange(context: { commit: Commit, state: State }, agent: any) {
		return new Promise(async (resolve, reject) => {
			exportAgencyMoneyChange(agent).then(response => {
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
    actions,
    mutations
}
