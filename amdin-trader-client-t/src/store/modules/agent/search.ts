import { moneyTotal } from '../../../api/agent/search'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {

}

// initial state
const state = {
    searchCond: {},
    curPage: 0,
    total: 0
}


const mutations = {
    SET_SEARCHCOND: (state, data) => {
        state.searchCond = data;
    },
    SET_CURPAGE: (state, data) => {
        state.curPage = data;
    },
    SET_TOTAL: (state, data) => {
        state.total = data;
    }
}
// actions
const actions = {
    MoneyTotal(context: { commit: Commit, state: State },payload) {
        return new Promise(async (resolve, reject) => {
            moneyTotal(payload).then(res => {
                if (res.data.code == 200) {
                    if(res.data.msg){
                        context.commit('SET_TOTAL', res.data.msg.sum);
                    }
                    resolve(res.data);
                    return;
                } else {
                    resolve(res.data);
                    return;
                }
            }).catch(error => {
                resolve(error);
            })
        });
    },
}
export default {
    state,
    actions,
    mutations
}
