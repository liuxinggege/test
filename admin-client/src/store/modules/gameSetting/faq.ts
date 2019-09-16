import { getFaq, updateFaq } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    faqArr: FaqArr[]
    code: number
}
export interface FaqArr {
    answer: string
    question: string
}

// initial state
const state: State = {
    faqArr: [],
    code: 0,
}

const mutations = {
    SET_FAQ: (state: State, data: CodeMsg<FaqArr[]>) => {
        state.faqArr = data.msg
    },
    ADD_FAQ: (state: State, addData: FaqArr) => {
        state.faqArr.push(addData)
    },
    EDIT_FAQ: (state: State, data: any) => {
        state.faqArr.splice(data.index, 1, data.tmp)
    },
    DEL_FAQ: (state: State, index: number) => {
        state.faqArr.splice(index, 1)
    },
    UPDATE_FAQ: (state: State, code: number) => {
        state.code = code
    },
    RESET_FAQ_CODE: (state: State) => {
        console.log("重置RESET_FAQ_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetFaq(context: { commit: Commit, state: State }) { //获取fullServermarquee  全服公告
        return new Promise(async (resolve, reject) => {
            getFaq().then((response: { data }) => {
                context.commit('SET_FAQ', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateFaq(context: { commit: Commit, state: State }, updateData) { //获取fullServermarquee  全服公告
        context.commit("RESET_FAQ_CODE")
        return new Promise(async (resolve, reject) => {
            updateFaq(updateData).then((response: { data }) => {
                context.commit('UPDATE_FAQ', response.data.code)
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
