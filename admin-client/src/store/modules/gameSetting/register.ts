import { getRegister, updateRegister } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    active: boolean
    registerCD: number
    registerTimes: number
    code: number
}

type GetRegisterResp = State;//获取结果Register

// initial state
const state: State = {
    active: false,
    registerCD: 0,
    registerTimes: 0,
    code: 0,
}

const mutations = {
    SET_REGISTER: (state: State, data: GetRegisterResp) => {
        state.active = data.active
        state.registerCD = data.registerCD
        state.registerTimes = data.registerTimes
    },
    UPDATE_REGISTER: (state: State, code) => {
        state.code = code
    },
    RESET_REGISTER_CODE: (state: State) => {
        console.log("重置RESET_REGISTER_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetRegister(context: { commit: Commit, state: State }) { //获取Register
        return new Promise(async (resolve, reject) => {
            getRegister().then((response: { data }) => {
                context.commit('SET_REGISTER', <GetRegisterResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateRegister(context: { commit: Commit, state: State }, updateData) { //更新Register
        context.commit("RESET_REGISTER_CODE")
        return new Promise(async (resolve, reject) => {
            updateRegister(updateData).then((response: { data }) => {
                context.commit('UPDATE_REGISTER', response.data.code)
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
