import { updateTransferMoneyLog, getTransferMoneyLog } from '../../../api/agent/transferLog'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {
    code?: number,
    msg?: any,
}

// initial state
const state = {
    pageData: [],
    totalCount: 0,
    total: "0", code: 0, msg: ""
}


const mutations = {
    CLEAR_CODE: (state: State) => {
        state.code = 0;
    },
    SET_LOGS: (state, data) => {
        state.pageData = data.pageData;
        state.totalCount = data.totalCount;
        state.total = data.total;
    },

    SET_CODE: (state, data) => {
        state.code = data.code;
    },
    SET_ERRORCODE: (state, data) => {
        state.code = data.code;
        state.msg = data.err;
    }
}
// actions
const actions = {
    UpdateTransferMoneyLog(context: { commit: Commit, state: State }, payload) {
        return new Promise(async (resolve, reject) => {
            updateTransferMoneyLog(payload).then(response => {
                console.log(response.data)
                context.commit('SET_CODE', response.data);
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERRORCODE', error);
                resolve(error);
            })
        });
    },
    GetTransferMoneyLog(context: { commit: Commit, state: State }, payload) {
        return new Promise(async (resolve, reject) => {
            getTransferMoneyLog(payload).then(response => {
                if (response.data.code == 200) {
                    context.commit('SET_LOGS', response.data.msg);
                }
                resolve(response.data);
            }).catch(error => {
                resolve(error);
                return;
            })
        });
    },
}
export default {
    state,
    actions,
    mutations
}
