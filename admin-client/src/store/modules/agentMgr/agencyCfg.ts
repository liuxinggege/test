import {
    getAgencyCfg,
    updateAgencyCfg,

} from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface AgencyTaxRateCfg {
    gameTax: string;
    changeRate: string;
}
export interface State {
    data: {
        businessTaxRate: string
        generalTaxRate: string
        leaderTaxRate: string
        agencyBankSettleSwitch: boolean
        bankCardMinMoney: string
        bankCardMaxMoney: string
        agencyAliSettleSwitch: boolean
        aliMinMoney: string
        aliMaxMoney: string
        agencyTaxRateTime: string
    }
    code: number;
    msg: string;
}

// initial state
const state: State = {
    data: {
        businessTaxRate: "0",
        generalTaxRate: "0",
        leaderTaxRate: "0",
        agencyBankSettleSwitch: false,
        bankCardMinMoney: "0",
        bankCardMaxMoney: "0",
        agencyAliSettleSwitch: false,
        aliMinMoney: "0",
        aliMaxMoney: "0",
        agencyTaxRateTime: "1",
    },
    code: 0,
    msg: ""
}

const mutations = {

    CLEAR_AGENCYCFGCODE: (state: State) => {
        state.code = 0
    },
    SET_CODE: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.msg = data.msg || data.err
    },
    SET_AGENCYCFG: (state: State, result) => {
        state.code = result.code;
        if (result.msg) {
            state.data = result.msg
        }
    },

}
// actions
const actions = {
    GetAgencyCfg(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getAgencyCfg().then(response => {
                context.commit('SET_AGENCYCFG', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateAgencyCfg(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            updateAgencyCfg(data).then(response => {
                context.commit('SET_CODE', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_CODE', error)
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
