import { getUpdateCode,updateAct } from '../../../api/agent/businessInfo'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {
    code?: number,
    msg?: any,
}
export interface businessInfo {
}

// initial state
const state = {
}


const mutations = {
    CLEAR_CODEAGENTMGR:(state: State) => {
		state.code = 0;
	},
    SET_LOGINACT: (state, data) => {
        sessionStorage.setItem("loginAct",data);
    },
    SET_ERRORCODE:(state, data)=>{
        state.code = data.code;
        state.msg = data.err;
    }
}
// actions
const actions = {
    UpdateAct(context: { commit: Commit, state: State },payload) {
        return new Promise(async (resolve, reject) => {
            updateAct(payload).then(response => {
                if (response.data.code == 200) {
                    context.commit('SET_LOGINACT', response.data.msg)
                }
                resolve(response.data)
            }).catch(error => {
                resolve(error);
            })
        });
    },
    GetUpdateCode(context: { commit: Commit, state: State }, payload) {
        return new Promise(async (resolve, reject) => {
            getUpdateCode(payload).then(response => {
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
