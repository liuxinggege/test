import { getDictionary, updateDictionary } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    content: string
    code: number
}

type GetDictionaryResp = State;//获取结果Dictionary

// initial state
const state: State = {
    content: "",
    code: 0,
}

const mutations = {
    SET_DICTIONARY: (state: State, data: GetDictionaryResp) => {
        state.content = data.content
    },
    UPDATE_DICTIONARY: (state: State, code) => {
        state.code = code
    },
    RESET_DICTIONARY_CODE: (state: State) => {
        console.log("重置RESET_DICTIONARY_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetDictionary(context: { commit: Commit, state: State }) { //获取Dictionary
        return new Promise(async (resolve, reject) => {
            getDictionary().then((response: { data }) => {
                context.commit('SET_DICTIONARY', <GetDictionaryResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateDictionary(context: { commit: Commit, state: State }, updateData) { //更新Dictionary
        context.commit("RESET_DICTIONARY_CODE")
        return new Promise(async (resolve, reject) => {
            updateDictionary(updateData).then((response: { data }) => {
                context.commit('UPDATE_DICTIONARY', response.data.code)
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
