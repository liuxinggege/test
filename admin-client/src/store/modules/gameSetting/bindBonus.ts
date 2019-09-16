import { getBindBonus, updateBindBonus } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'

export interface State {
    active: boolean
    money: string
    lowMoney:string
    code: number
}

type GetBindBonusResp = State;//获取结果BindBonus

// initial state
const state: State = {
    active: false,
    money: "0",
    lowMoney:"0",
    code: 0,
}

const mutations = {
    SET_BINDBONUS: (state: State, data: GetBindBonusResp) => {
        state.active = data.active
        state.money = data.money
        state.lowMoney = data.lowMoney
    },
    UPDATE_BINDBONUS: (state: State, code) => {
        state.code = code
    },
    RESET_BINDBONUS_CODE: (state: State) => {
        console.log("重置RESET_BINDBONUS_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetBindBonus(context: { commit: Commit, state: State }) { //获取BindBonus
        return new Promise(async (resolve, reject) => {
            getBindBonus().then((response: { data }) => {
                context.commit('SET_BINDBONUS', <GetBindBonusResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateBindBonus(context: { commit: Commit, state: State }, updateData) { //更新BindBonus
        context.commit("RESET_BINDBONUS_CODE")
        return new Promise(async (resolve, reject) => {
            updateBindBonus(updateData).then((response: { data }) => {
                context.commit('UPDATE_BINDBONUS', response.data.code)
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
