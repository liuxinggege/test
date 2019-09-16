import { upPointLog } from '../../../api/agent/upPointLog'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {

}
export interface businessInfo {

}

// initial state
const state = {
    hasMore: false,
    tmp_up: []
}


const mutations = {
    SET_UPLOG: (state, data) => {
        state.tmp_up = data.logs;
    }
}
// actions
const actions = {
    UpPointLog(context: { commit: Commit, state: State },payload) {
        return new Promise(async (resolve, reject) => {
            upPointLog(payload).then(res => {
                if (res.data.code == 200) {
                    context.commit('SET_UPLOG', res.data.msg)
                    resolve(res.data);
                    return;
                } else {
                    resolve(res.data);
                    return;
                }
            }).catch(error => {
                resolve(error)
            })
        });
    },
}
export default {
    state,
    actions,
    mutations
}
