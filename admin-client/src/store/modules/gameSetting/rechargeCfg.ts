import {
    getRechargeCfg,
    updateRechargeCfg,
    addAliFixed,
    getRechargeLimitCfg,
    postRechargeLimitCfg,
    addRechargeLimitCfg,
    getAllRechargeChannel
} from '../../../api/admin/gameSetting/gameSetting'
import { Commit } from 'vuex'

export interface State {
    agentMinMoney: number
    ali: string
    aliPer: any
    card: string
    yun: string
    createThridPayInterval: number
    jd: string
    limitOtherChannelMaxMoney: boolean
    otherChannelMaxMoney: string
    payEnforce: boolean
    perACIncRate: string
    qq: string
    saConNoBillTimes: number
    saDecRate: string
    saOnlyShowAgentRate: string
    srConNoBillTimes: number
    srDecRate: string
    srOnlyShowAgentRate: string
    srTimesLLmit: number
    srTotalLLimit: string
    union: string
    wx: string
    aliFix: string
    newAgentSwitch: boolean
    fixedAli: any[]
    code: number,
    err: string,
    rechargeLimitCfg: any,
    rechargeChannels: any
}

type GetRechargeCfgResp = State;//获取结果RechargeCfg

// initial state
const state: State = {
    agentMinMoney: 0,
    ali: "0",
    aliPer: "0",
    card: "0",
    yun: "0",
    createThridPayInterval: 0,
    jd: "0",
    limitOtherChannelMaxMoney: false,
    otherChannelMaxMoney: "0",
    payEnforce: false,
    perACIncRate: "0",
    qq: "0",
    saConNoBillTimes: 0,
    saDecRate: "0",
    saOnlyShowAgentRate: "0",
    srConNoBillTimes: 0,
    srDecRate: "0",
    srOnlyShowAgentRate: "0",
    srTimesLLmit: 0,
    srTotalLLimit: "0",
    union: "0",
    wx: "0",
    aliFix: "",
    fixedAli: [],
    newAgentSwitch: false,
    code: 0,
    err: "",
    rechargeLimitCfg: [],
    rechargeChannels: ""
}

const mutations = {
    SET_RECHARGECFG: (state: State, data: GetRechargeCfgResp) => {
        state.agentMinMoney = data.agentMinMoney
        state.ali = data.ali
        state.aliPer = data.aliPer
        state.card = data.card
        state.yun = data.yun
        state.createThridPayInterval = data.createThridPayInterval
        state.jd = data.jd
        state.limitOtherChannelMaxMoney = data.limitOtherChannelMaxMoney
        state.otherChannelMaxMoney = data.otherChannelMaxMoney
        state.payEnforce = data.payEnforce
        state.perACIncRate = data.perACIncRate
        state.qq = data.qq
        state.saConNoBillTimes = data.saConNoBillTimes
        state.saDecRate = data.saDecRate
        state.saOnlyShowAgentRate = data.saOnlyShowAgentRate
        state.srConNoBillTimes = data.srConNoBillTimes
        state.srDecRate = data.srDecRate
        state.srOnlyShowAgentRate = data.srOnlyShowAgentRate
        state.srTimesLLmit = data.srTimesLLmit
        state.srTotalLLimit = data.srTotalLLimit
        state.union = data.union
        state.wx = data.wx
        state.aliFix = data.aliFix
        state.fixedAli = data.fixedAli
        state.newAgentSwitch = data.newAgentSwitch
    },
    UPDATE_RECHARGECFG: (state: State, code) => {
        state.code = code
    },
    RESET_RECHARGECFG_CODE: (state: State) => {
        console.log("重置RESET_RECHARGECFG_CODE")
        state.code = 0
    },
    SET_ERR: (state: State, data) => {
        state.code = data.code,
            state.err = data.err
    },
    SET_RECHARGELIMITCFG: (state: State, data: any) => {
        state.rechargeLimitCfg = data;
        state.code = data.code;
        state.err = data.err
    }
}
// actions
const actions = {
    GetRechargeCfg(context: { commit: Commit, state: State }) { //获取RechargeCfg
        return new Promise(async (resolve, reject) => {
            getRechargeCfg().then((response: { data }) => {
                context.commit('SET_RECHARGECFG', <GetRechargeCfgResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateRechargeCfg(context: { commit: Commit, state: State }, updateData) { //更新RechargeCfg
        context.commit('RESET_RECHARGECFG_CODE')
        return new Promise(async (resolve, reject) => {
            updateRechargeCfg(updateData).then((response: { data }) => {
                context.commit('UPDATE_RECHARGECFG', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddAliFixed(context: { commit: Commit, state: State }, updateData) { //更新RechargeCfg
        context.commit('RESET_RECHARGECFG_CODE')
        return new Promise(async (resolve, reject) => {
            addAliFixed(updateData).then((response: { data }) => {
                context.commit('UPDATE_RECHARGECFG', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('SET_ERR', error)
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetRechargeLimitCfg(context: { commit: Commit, state: State }, queryItem) {
        context.commit('RESET_RECHARGECFG_CODE')
        return new Promise(async (resolve, reject) => {
            getRechargeLimitCfg(queryItem).then((response: { data }) => {
                if (response.data.msg) {
                    resolve(response.data.msg)
                }
                else {
                    resolve(response.data)
                }

            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    PostRechargeLimitCfg(context: { commit: Commit, state: State }, queryItem) {
        return new Promise((resolve, reject) => {
            postRechargeLimitCfg(queryItem).then((response: { data }) => {
                //context.commit('SET_RECHARGELIMITCFG', response.data)
                resolve(response.data);
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    AddRechargeLimitCfg(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            addRechargeLimitCfg(queryItem).then((response: { data }) => {
                //context.commit('SET_RECHARGELIMITCFG', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERR', error)
                resolve(error)
            })
        });
    },
    GetRechargeChannels(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            getAllRechargeChannel(data).then((response: { data }) => {
                resolve(response.data.msg.channels)
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
