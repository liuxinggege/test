import { getAllowLoginIP, updateAllowLoginIP } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    allowLoginIPArr: string
    code: number
    switch: boolean
}
type Msg = {
    ip: string[]
}
type GetAllowLoginIPResp = {
    code: number
    msg: Msg
}//获取结果AllowLoginIP

// initial state
const state: State = {
    allowLoginIPArr: "",
    code: 0,
    switch: false
}

const mutations = {
    SET_ALLOWLOGINIP: (state: State, data: GetAllowLoginIPResp) => {
        state.allowLoginIPArr = data.msg[0].ip.join("\n")
        state.switch = data.msg[0].switch
    },
    UPDATE_ALLOWLOGINIP: (state: State, code: number) => {
        state.code = code
    },
    RESET_ALLOWLOGINIP_CODE: (state: State) => {
        console.log("重置RESET_ALLOWLOGINIP_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetAllowLoginIP(context: { commit: Commit, state: State }) { //获取AllowLoginIP
        return new Promise(async (resolve, reject) => {
            getAllowLoginIP().then((response: { data }) => {
                context.commit('SET_ALLOWLOGINIP', <GetAllowLoginIPResp>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateAllowLoginIP(context: { commit: Commit, state: State }, updateData) { //更新AllowLoginIP
        context.commit("RESET_ALLOWLOGINIP_CODE")
        return new Promise(async (resolve, reject) => {
            updateAllowLoginIP(updateData).then((response: { data }) => {
                context.commit('UPDATE_ALLOWLOGINIP', response.data.code)
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
