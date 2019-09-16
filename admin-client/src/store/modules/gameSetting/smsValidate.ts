import { getSmsValidate, updateSmsValidate } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    active: boolean
    codeLength: number
    dayLimitTime: number
    dayLimitTimes: number
    minuteLimitTime: number
    useVerify: boolean
    validateTime: number
    code: number
}

type GetSmsValidateResp = State;//获取结果SmsValidate

// initial state
const state: State = {
    active: false,
    codeLength: 0,
    dayLimitTime: 0,
    dayLimitTimes: 0,
    minuteLimitTime: 0,
    useVerify: false,
    validateTime: 0,
    code: 0,
}

const mutations = {
    SET_SMSVALIDATE: (state: State, data: GetSmsValidateResp) => {
        state.active = data.active
        state.codeLength = data.codeLength
        state.dayLimitTime = data.dayLimitTime
        state.dayLimitTimes = data.dayLimitTimes
        state.minuteLimitTime = data.minuteLimitTime
        state.useVerify = data.useVerify
        state.validateTime = data.validateTime
    },
    UPDATE_SMSVALIDATE: (state: State, code) => {
        state.code = code
    },
    RESET_SMSVALIDATE_CODE: (state: State) => {
        console.log("重置RESET_SMSVALIDATE_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetSmsValidate(context: { commit: Commit, state: State }) { //获取SmsValidate
        return new Promise(async (resolve, reject) => {
            getSmsValidate().then((response: { data }) => {
                context.commit('SET_SMSVALIDATE', <GetSmsValidateResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSmsValidate(context: { commit: Commit, state: State }, updateData) { //更新SmsValidate
        context.commit("RESET_SMSVALIDATE_CODE")
        return new Promise(async (resolve, reject) => {
            updateSmsValidate(updateData).then((response: { data }) => {
                context.commit('UPDATE_SMSVALIDATE', response.data.code)
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
