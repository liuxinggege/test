import {
    updatePoolLineByGid,
    getPoolLineAndConfigByGid,
    updateWaterConfigByGid,
} from '../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../store'

export interface State {
    code: number,
    robotWinRate: any[],
    poolLine: string
}
// initial state
const state: State = {
    code: 0,
    robotWinRate: [],
    poolLine: "0"
}

const mutations = {
    SET_POOLLINEANDCONFIG: (state: State, data: any) => {
        state.robotWinRate = data.waterConfig.robotWinRate
        state.poolLine = data.waterPool.poolLine
    },
    SET_CODE: (state: State, code: number) => {
        state.code = code
    },

}
// actions
const actions = {
    GetPoolLineAndConfigByGid(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            getPoolLineAndConfigByGid(updateData).then(response => {
                context.commit("SET_POOLLINEANDCONFIG", response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdatePoolLineByGid(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updatePoolLineByGid(updateData).then(response => {
                context.commit("SET_CODE", response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateWaterConfigByGid(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateWaterConfigByGid(updateData).then(response => {
                context.commit("SET_CODE", response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
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
