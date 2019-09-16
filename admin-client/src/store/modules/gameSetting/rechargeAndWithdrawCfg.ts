import { getRechargeAndWithdrawItem, getAllRechargeChannel } from '../../../api/admin/gameSetting/gameSetting'
import { Commit } from 'vuex'

export interface State {
    recharge_aliFixs: { value: string, label: string }[],
    recharge_alis: { value: string, label: string }[],
    recharge_oneAlis: { value: string, label: string }[],
    recharge_wxs: { value: string, label: string }[],
    recharge_qqs: { value: string, label: string }[],
    recharge_jds: { value: string, label: string }[],
    recharge_unions: { value: string, label: string }[],
    recharge_cards: { value: string, label: string }[],
    recharge_yuns: { value: string, label: string }[],
    withdraw_ali: { value: string, label: string }[],
    withdraw_bank: { value: string, label: string }[],
    rechargeChannels: { value: string, label: string }[],
    code: number,
    err: string
}


// initial state
const state: State = {
    recharge_aliFixs: [{ value: "", label: "关闭" }],
    recharge_alis: [{ value: "", label: "关闭" }],
    recharge_oneAlis: [{ value: "", label: "关闭" }],
    recharge_wxs: [{ value: "", label: "关闭" }],
    recharge_qqs: [{ value: "", label: "关闭" }],
    recharge_jds: [{ value: "", label: "关闭" }],
    recharge_unions: [{ value: "", label: "关闭" }],
    recharge_cards: [{ value: "", label: "关闭" }],
    recharge_yuns: [{ value: "", label: "关闭" }],
    withdraw_ali: [{ value: "", label: "关闭" }],
    withdraw_bank: [{ value: "", label: "关闭" }],
    rechargeChannels: [{ value: "", label: "全部" }],
    code: 0,
    err: "",
}

const mutations = {
    SET_RECHARGECFGANDWITHDRAW: (state: State, data: { code: number, msg: { type: string, name: string, dept: number, channel: { value: string, label: string }[] }[] }) => {
        state.recharge_aliFixs = [{ value: "", label: "关闭" }];
        state.recharge_alis = [{ value: "", label: "关闭" }];
        state.recharge_oneAlis = [{ value: "", label: "关闭" }];
        state.recharge_wxs = [{ value: "", label: "关闭" }];
        state.recharge_qqs = [{ value: "", label: "关闭" }];
        state.recharge_jds = [{ value: "", label: "关闭" }];
        state.recharge_unions = [{ value: "", label: "关闭" }];
        state.recharge_cards = [{ value: "", label: "关闭" }];
        state.recharge_yuns = [{ value: "", label: "关闭" }];
        state.withdraw_ali = [{ value: "", label: "关闭" }];
        state.withdraw_bank = [{ value: "", label: "关闭" }];
        data.msg.forEach(element => {
            if (element.name === "aliFixs") {
                state.recharge_aliFixs = state.recharge_aliFixs.concat(element.channel);
            }
            if (element.name === "alis") {
                state.recharge_alis = state.recharge_alis.concat(element.channel);
            }
            if (element.name === "oneAlis") {
                state.recharge_oneAlis = state.recharge_oneAlis.concat(element.channel);
            }
            if (element.name === "wxs") {
                state.recharge_wxs = state.recharge_wxs.concat(element.channel);
            }
            if (element.name === "qqs") {
                state.recharge_qqs = state.recharge_qqs.concat(element.channel);
            }
            if (element.name === "jds") {
                state.recharge_jds = state.recharge_jds.concat(element.channel);
            }
            if (element.name === "unions") {
                state.recharge_unions = state.recharge_unions.concat(element.channel);
            }
            if (element.name === "cards") {
                state.recharge_cards = state.recharge_cards.concat(element.channel);
            }
            if (element.name === "yuns") {
                state.recharge_yuns = state.recharge_yuns.concat(element.channel);
            }
            if (element.name === "ali") {
                state.withdraw_ali = state.withdraw_ali.concat(element.channel);
            }
            if (element.name === "bank") {
                state.withdraw_bank = state.withdraw_bank.concat(element.channel);
            }
        });
        state.code = data.code;
    },
    SET_ALLRECHARGECHANNEL: (state: State, data) => {
        state.rechargeChannels = [{ value: "", label: "关闭" }];
        state.rechargeChannels = state.rechargeChannels.concat(data.msg ? data.msg.channels : []);
        state.code = data.code;
    },
    SET_ERR: (state: State, data) => {
        state.code = data.code;
        state.err = data.err
    },
}
// actions
const actions = {
    GetRechargeAndWithdrawItem(context: { commit: Commit, state: State }, data) { //获取RechargeCfg
        return new Promise(async (resolve, reject) => {
            getRechargeAndWithdrawItem(data).then((response: { data }) => {
                context.commit('SET_RECHARGECFGANDWITHDRAW', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERR', error)
                resolve()
            })
        });
    },
    GetAllRechargeChannel(context: { commit: Commit, state: State }, data) { //获取RechargeCfg
        return new Promise(async (resolve, reject) => {
            getAllRechargeChannel(data).then((response: { data }) => {
                context.commit('SET_ALLRECHARGECHANNEL', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERR', error)
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
