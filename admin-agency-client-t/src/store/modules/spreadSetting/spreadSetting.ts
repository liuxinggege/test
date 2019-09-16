import { getSpreadSettingData } from '../../../api/agent/spreadSetting/spreadSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    templetData: any[]
    downloadUrl: string
    code: number
    totalCount: number
    msg: string
}

// initial state
const state: State = {
    templetData: [],
    totalCount: 0,
    code: 0,
    downloadUrl: "",
    msg: ""
}

const mutations = {

    SET_GETSPREADSETTINGDATA: (state: State, data: any) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.downloadUrl = data.msg.url
        state.templetData = data.msg.downloadUrl
    },
    SET_GETSPREADSETTINGDATAERR: (state: State, data: any) => {
        state.code = data.code
        state.msg = data.err

    },
}
// actions
const actions = {
    GetSpreadSettingData(context: { commit: Commit, state: State }, queryItem) {
        console.log(queryItem);
        return new Promise(async (resolve, reject) => {
            getSpreadSettingData(queryItem).then((response: { data }) => {
                context.commit('SET_GETSPREADSETTINGDATA', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_GETSPREADSETTINGDATAERR', error)
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
