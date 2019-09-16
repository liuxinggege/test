import { getLocationRWRule, updateLocationRWRule,addLocationRWRule ,deleteLocationRWRule} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    locationRWRuleDates:LocationRWRuleData[],
    err:string,
    code: number
}

type GetLocationRWRuleResp = State;//获取结果LocationRWRule
export interface LocationRWRuleData {
    location: string,
    rechargeOnline: boolean,
    rechargePerson: boolean,
    rechargeAgent: boolean,
    withdrawB: boolean,
    withdrawA: boolean
}
// initial state
const state: State = {
    locationRWRuleDates:[],
    err:"",
    code: 0,
}

const mutations = {
    SET_LOCATIONRWRULE: (state: State, data: any) => {
        state.code = data.code;
        if(data.code!==200){
            state.err = data.err;
        }else{
            state.locationRWRuleDates = data.msg;
        }
    },
    UPDATE_LOCATIONRWRULE: (state: State, data) => {
        if(data.code!==200){
            state.err = data.err;
        }
        state.code = data.code
    },
    RESET_LOCATIONRWRULE_CODE: (state: State) => {
        console.log("重置RESET_LOCATIONRWRULE_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetLocationRWRule(context: { commit: Commit, state: State }) { //获取LocationRWRule
        return new Promise(async (resolve, reject) => {
            getLocationRWRule().then((response: { data }) => {
                context.commit('SET_LOCATIONRWRULE', <GetLocationRWRuleResp[]>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_LOCATIONRWRULE', error);
                resolve()
            })
        });
    },
    UpdateLocationRWRule(context: { commit: Commit, state: State }, updateData) { //更新LocationRWRule
        context.commit('RESET_LOCATIONRWRULE_CODE')
        return new Promise(async (resolve, reject) => {
            updateLocationRWRule(updateData).then((response: { data }) => {
                context.commit('UPDATE_LOCATIONRWRULE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_LOCATIONRWRULE', error);
                resolve()
            })
        });
    },
    AddLocationRWRule(context: { commit: Commit, state: State }, updateData) { //更新LocationRWRule
        context.commit('RESET_LOCATIONRWRULE_CODE')
        return new Promise(async (resolve, reject) => {
            addLocationRWRule(updateData).then((response: { data }) => {
                context.commit('UPDATE_LOCATIONRWRULE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_LOCATIONRWRULE', error);
                resolve()
            })
        });
    },
    DeleteLocationRWRule(context: { commit: Commit, state: State }, updateData) { //更新LocationRWRule
        context.commit('RESET_LOCATIONRWRULE_CODE')
        return new Promise(async (resolve, reject) => {
            deleteLocationRWRule(updateData).then((response: { data }) => {
                context.commit('UPDATE_LOCATIONRWRULE', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_LOCATIONRWRULE', error);
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
