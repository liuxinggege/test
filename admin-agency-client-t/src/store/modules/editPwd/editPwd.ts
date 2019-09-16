import { updatePwd } from '../../../api/agent/eidtPwd/eidtPwd'
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

    CLEARD_PWDCODE: (state: State) => {
        state.code = 0;
    },

    SET_UPDATEPWD: (state: State, data: any) => {
        state.code = data.code
        state.msg = data.msg || data.err
    },
}
// actions
const actions = {
    updatePwd(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEARD_PWDCODE');
        return new Promise(async (resolve, reject) => {
            updatePwd(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEPWD', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEPWD', error)
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
