import {submitPwd } from '../../../api/admin/selfInfo/selfInfo'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'



export interface State {
    code:number
}


// initial state
const state: State = {
  
    code:0
}

const mutations = {

    SET_UPDATESELFINFO: (state: State, data:any) => {
        state.code = data.code
    },


}
// actions
const actions = {
    UpdateSelfInfo(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            submitPwd(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATESELFINFO', response.data)
                resolve()
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
