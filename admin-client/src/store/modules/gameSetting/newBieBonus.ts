import { getNewBieBonus, updateNewBieBonus } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    active: boolean
    money: string
    lowMoney:string
    code: number
}

type GetNewBieBonusResp = State;//获取结果NewBieBonus

// initial state
const state: State = {
    active: false,
    money: "0",
    lowMoney:"0",
    code: 0,
}

const mutations = {
    SET_NEWBIEBONUS: (state: State, data: GetNewBieBonusResp) => {
        state.active = data.active
        state.money = data.money
        state.lowMoney = data.lowMoney
    },
    UPDATE_NEWBIEBONUS: (state: State, code) => {
        state.code = code
    },
    RESET_NEWBIEBONUS_CODE: (state: State) => {
        console.log("重置RESET_NEWBIEBONUS_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetNewBieBonus(context: { commit: Commit, state: State }) { //获取NewBieBonus
        return new Promise(async (resolve, reject) => {
            getNewBieBonus().then((response: { data }) => {
                context.commit('SET_NEWBIEBONUS', <GetNewBieBonusResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateNewBieBonus(context: { commit: Commit, state: State }, updateData) { //更新NewBieBonus
        context.commit("RESET_NEWBIEBONUS_CODE")
        return new Promise(async (resolve, reject) => {
            updateNewBieBonus(updateData).then((response: { data }) => {
                context.commit('UPDATE_NEWBIEBONUS', response.data.code)
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
