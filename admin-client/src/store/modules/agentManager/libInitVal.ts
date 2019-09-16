import { getSettlementCycleList, addSettlementCycle, updateSettlementCycle, deleteSettlementCycle } from '../../../api/admin/agent/manager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'


export interface Select {
    val: any,
    name: string
}

export interface State {
    settlementCycleItems: Select[],//结算周期下拉框
    code: number
    msg: any
}

type GetLibInitValModel = State;

const state: State = {
    settlementCycleItems: [],
    code: 0,
    msg: null
}

const mutations = {
    SET_QUERYLIST: (state: State, data: any) => {
        state.code = data.code;
        state.settlementCycleItems = data.msg;
    },
}
// actions
const actions = {
    getSettlementCycleListBySelect(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getSettlementCycleList().then((response: { data }) => {
                context.commit('SET_QUERYLIST', response.data)
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
    actions,
    mutations
}
