import { getTempletData } from '../../../api/agent/templet/templet'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    templetData:any[]
    code:number
    totalCount:number
}

export interface TempletDataType {
    templetId:string
}
// initial state
const state: State = {  
    templetData:[],
    totalCount:0,
    code:0
}

const mutations = {

    SET_GETTEMPLETDATA: (state: State, data:any) => {
        state.code = data.code
        state.totalCount = data.totalCount
    },
}
// actions
const actions = {
    GetTempletData(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getTempletData(queryItem).then((response: { data }) => {
                context.commit('SET_GETTEMPLETDATA', response.data)
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
