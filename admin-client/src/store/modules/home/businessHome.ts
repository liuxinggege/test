import {
    getJuBusinessInfo
} from '../../../api/admin/home/businessHome'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { BigNumber } from 'bignumber.js'

export interface State {
    cUid: string
    cAct: string
    cName: string
    cGold: string
}

// initial state
const state: State = {
    cUid: "",
    cAct: "",
    cName: "",
    cGold: "",
}

const mutations = {

    SET_JUBUSINESSINFO: (state: State, msg: any) => {
        state.cUid = msg.uid
        state.cAct = msg.act
        state.cName = msg.name
        state.cGold = new BigNumber(msg.money ? msg.money : 0)
            .plus(new BigNumber(msg.bankMoney ? msg.bankMoney : 0))
            .toString();
    },

}
// actions
const actions = {
    GetJuBusinessInfo(context: { commit: Commit, state: State }, ) { //获取聚商基本信息
        return new Promise(async (resolve, reject) => {
            getJuBusinessInfo().then((response: { data }) => {
                context.commit('SET_JUBUSINESSINFO', response.data.msg)
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
