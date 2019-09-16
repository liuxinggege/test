import {
    getReport,
    updateReport,
} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface ListDoc {
    switch: boolean,
    bonus: string,
    wx: string,
    pid: string
}
export interface State {
    list: ListDoc[]
    code: number
    msg: string
}

type GetReportResp = State;//获取结果Report

// initial state
const state: State = {
    list: [{
        switch: false,
        bonus: "",
        wx: "",
        pid: ""
    }],
    code: 0,
    msg: ""
}

const mutations = {
    SET_REPORT: (state: State, data: CodeMsg<any>) => {
        state.list = data.msg
    },
    UPDATE_REPORT: (state: State, code) => {
        state.code = code
    },
    SET_REPORTERR: (state: State, data: CodeMsg<any>) => {
        state.msg = data.msg || data.err
    },
    RESET_REPORT_CODE: (state: State) => {
        console.log("重置RESET_REPORT_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetReport(context: { commit: Commit, state: State }) { //获取
        return new Promise(async (resolve, reject) => {
            getReport().then((response: { data }) => {
                context.commit('SET_REPORT', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_REPORTERR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateReport(context: { commit: Commit, state: State }, updateData) { //更新
        context.commit("RESET_REPORT_CODE")
        return new Promise(async (resolve, reject) => {
            updateReport(updateData).then((response: { data }) => {
                context.commit('UPDATE_REPORT', response.data.code);
                resolve()
            }).catch(error => {
                context.commit('SET_REPORTERR', error);
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
