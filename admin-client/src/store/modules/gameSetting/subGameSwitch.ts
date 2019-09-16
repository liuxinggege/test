import { CodeMsg } from './../../index';
import { getSubGameSwitch, updateSubGameSwitch } from '../../../api/admin/gameSetting/gameSetting'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'

export interface State {
    subGames: subGame[]
    err: string
    code: number
}

export interface subGame {
    active: boolean
    id: string
    idx: number
}
type GetSubGameSwitchResp = State;//获取结果SubGameSwitch

// initial state
const state: State = {
    subGames: [],
    err: '',
    code: 0,
}

const mutations = {
    SET_SUBGAMESWITCH: (state: State, data: subGame[]) => {
        state.subGames = data
    },
    UPDATE_SUBGAMESWITCH: (state: State, data) => {
        state.code = data.code
        state.err = data.err
    },
    RESET_SUBGAMESWITCH_CODE: (state: State) => {
        console.log("重置RESET_SUBGAMESWITCH_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetSubGameSwitch(context: { commit: Commit, state: State }, data) { //获取SubGameSwitch
        return new Promise(async (resolve, reject) => {
            getSubGameSwitch(data).then((response: { data }) => {
                context.commit('SET_SUBGAMESWITCH', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSubGameSwitch(context: { commit: Commit, state: State }, updateData) { //更新SubGameSwitch
        context.commit("RESET_SUBGAMESWITCH_CODE")
        return new Promise(async (resolve, reject) => {
            updateSubGameSwitch(updateData).then((response: { data }) => {
                context.commit('UPDATE_SUBGAMESWITCH', response.data);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_SUBGAMESWITCH', error);
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
