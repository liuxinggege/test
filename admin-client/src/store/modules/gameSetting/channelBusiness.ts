import { getChannelBusiness, insertChannelBusiness, fixChannelBusiness, deletChannelBusiness } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    channelBusinessData: channelBusinessDataType[]
    code: number
    insertCode: number
    fixCode: number
    deletCode: number
    totalCount:number
}

export interface channelBusinessDataType {

    father: string
    business: number[]

}

type GetChannelBusinessResp = State;//获取结果ChannelBusiness

// initial state
const state: State = {
    channelBusinessData: [],
    code: 0,
    insertCode: 0,
    fixCode: 0,
    deletCode: 0,
    totalCount:0
}

const mutations = {

    GET_CHANNELBUSINESSCONFIG: (state: State, data: any) => {
        state.channelBusinessData = data.msg.pageData
        state.totalCount = data.msg.totalCount
        state.code = data.code
    },

    INSERT_CHANNELBUSINESSCONFIG: (state: State, code) => {
        state.insertCode = code
    },
    FIX_CHANNELBUSINESSCONFIG: (state: State, code) => {
        state.fixCode = code
    },
    DELET_CHANNELBUSINESSCONFIG: (state: State, code) => {
        state.deletCode = code
    },
    RESET_CHANNELBUSINESS_CODE: (state: State) => {
        state.insertCode = 0
        state.fixCode = 0
        state.deletCode = 0
        state.code = 0
    },
}
// actions
const actions = {
    GetChannelBusiness(context: { commit: Commit, state: State }, updateData) { //获取ChannelBusiness
        return new Promise(async (resolve, reject) => {
            getChannelBusiness(updateData).then((response: { data }) => {
                context.commit('GET_CHANNELBUSINESSCONFIG', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    InsertChannelBusiness(context: { commit: Commit, state: State }, updateData) { //添加ChannelBusiness
        context.commit("RESET_CHANNELBUSINESS_CODE")
        return new Promise(async (resolve, reject) => {
            insertChannelBusiness(updateData).then((response: { data }) => {
                context.commit('INSERT_CHANNELBUSINESSCONFIG', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    FixChannelBusiness(context: { commit: Commit, state: State }, updateData) { //更新ChannelBusiness
        context.commit("RESET_CHANNELBUSINESS_CODE")
        return new Promise(async (resolve, reject) => {
            fixChannelBusiness(updateData).then((response: { data }) => {
                context.commit('FIX_CHANNELBUSINESSCONFIG', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    DeletChannelBusiness(context: { commit: Commit, state: State }, updateData) { //删除ushangConfig
        context.commit("RESET_CHANNELBUSINESS_CODE")
        return new Promise(async (resolve, reject) => {
            deletChannelBusiness(updateData).then((response: { data }) => {
                context.commit('DELET_CHANNELBUSINESSCONFIG', response.data.code)
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
