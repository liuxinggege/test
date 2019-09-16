import { updateBalancePwd } from '../../../api/agent/eidtBalancePwd/eidtBalancePwd'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    msg: string
    code: number
}

export interface HomeDataType {

}
// initial state
const state: State = {
    msg: "",
    code: 0
}

const mutations = {
    CLEAR_BPWDCODE: (state: State) => {
        state.code = 0;
    },
    SET_UPDATABALANCEPWD: (state: State, data: any) => {
        state.code = data.code
        state.msg = data.msg || data.err
    },
}
// actions
const actions = {
    UpdateBalancePwd(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            updateBalancePwd(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATABALANCEPWD', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATABALANCEPWD', error)
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
