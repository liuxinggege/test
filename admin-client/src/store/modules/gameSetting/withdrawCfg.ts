import { getWithdrawCfg, updateWithdrawCfg } from '../../../api/admin/gameSetting/gameSetting'
import { Commit } from 'vuex'

export interface State {
    agent: boolean
    aliChannel: string
    alipay: boolean
    autoDrawback: boolean
    bankCard: boolean
    bankCardChannel: string
    happyNewsContent: string
    dangerousPerDayWithDraw: number
    inputMulti: number
    manualRate: number
    perDayWithdrawLimit: number
    perDayWithdrawTimes: number[]
    relationWithdrawAndTaxRate: number
    switch: boolean
    sysRate: number
    totalGameTimeLimit: number
    totalRechargeLLimit: number
    totalRechargeRLimit: number
    // vip: boolean
    buyuCountLimit: number
    rechargeSection: any
    code: number

    vipMinMoney: string
    vipMaxMoney: string
    userShowVipMinMoney: string
    yqWithdrawVIP: number[]
    kxWithdrawVIP: number[]
    // bankWithdrawCDSwitch: boolean
    //  {
    //     active: boolean,
    //     minMoney: string,
    //     maxMoney: string,
    //     pid: string,
    //     agent: [number],
    //     userShowVipMinMoney: string,
    // }
    vip: any[]

    msg: string
}

type GetWithdrawCfgResp = State;//获取结果WithdrawCfg

// initial state
const state: State = {
    agent: false,
    aliChannel: "0",
    happyNewsContent:"",
    alipay: false,
    autoDrawback: false,
    bankCard: false,
    bankCardChannel: "0",
    dangerousPerDayWithDraw: 0,
    inputMulti: 0,
    manualRate: 0,
    perDayWithdrawLimit: 0,
    perDayWithdrawTimes: [],
    relationWithdrawAndTaxRate: 0,
    switch: false,
    sysRate: 0,
    totalGameTimeLimit: 0,
    totalRechargeLLimit: 0,
    totalRechargeRLimit: 0,
    // vip: false,
    buyuCountLimit: 0,
    rechargeSection: [],
    code: 0,

    vipMinMoney: "",
    vipMaxMoney: "",
    userShowVipMinMoney: "",
    yqWithdrawVIP: [],
    kxWithdrawVIP: [],
    // bankWithdrawCDSwitch: false,


    vip: [],
    msg: "",
}

const mutations = {
    SET_WITHDRAWCFG: (state: State, data: GetWithdrawCfgResp) => {
        state.agent = data.agent
        state.happyNewsContent = data.happyNewsContent
        state.aliChannel = data.aliChannel
        state.alipay = data.alipay
        state.autoDrawback = data.autoDrawback
        state.bankCard = data.bankCard
        state.bankCardChannel = data.bankCardChannel
        state.dangerousPerDayWithDraw = data.dangerousPerDayWithDraw
        state.inputMulti = data.inputMulti
        state.manualRate = data.manualRate
        state.perDayWithdrawLimit = data.perDayWithdrawLimit
        state.perDayWithdrawTimes = data.perDayWithdrawTimes
        state.relationWithdrawAndTaxRate = data.relationWithdrawAndTaxRate
        state.switch = data.switch
        state.sysRate = data.sysRate
        state.totalGameTimeLimit = data.totalGameTimeLimit
        state.totalRechargeLLimit = data.totalRechargeLLimit
        state.totalRechargeRLimit = data.totalRechargeRLimit
        state.vip = data.vip
        state.buyuCountLimit = data.buyuCountLimit
        state.rechargeSection = data.rechargeSection
        state.vipMinMoney = data.vipMinMoney
        state.vipMaxMoney = data.vipMaxMoney
        state.userShowVipMinMoney = data.userShowVipMinMoney
        // state.yqWithdrawVIP = data.yqWithdrawVIP
        // state.kxWithdrawVIP = data.kxWithdrawVIP
        // state.bankWithdrawCDSwitch = data.bankWithdrawCDSwitch
    },
    UPDATE_WITHDRAWCFG: (state: State, code) => {
        state.code = code
    },
    RESET_WITHDRAWCFG_CODE: (state: State) => {
        console.log("重置RESET_WITHDRAWCFG_CODE")
        state.code = 0
    },
    SET_ERR: (state: State, err: any) => {
        state.msg = err.err
    },

}
// actions
const actions = {
    GetWithdrawCfg(context: { commit: Commit, state: State }) { //获取WithdrawCfg
        return new Promise(async (resolve, reject) => {
            getWithdrawCfg().then((response: { data }) => {
                context.commit('SET_WITHDRAWCFG', <GetWithdrawCfgResp>response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateWithdrawCfg(context: { commit: Commit, state: State }, updateData) { //更新WithdrawCfg
        context.commit("RESET_WITHDRAWCFG_CODE")
        return new Promise(async (resolve, reject) => {
            updateWithdrawCfg(updateData).then((response: { data }) => {
                context.commit('UPDATE_WITHDRAWCFG', response.data.code);
                resolve()
            }).catch(error => {
                context.commit('SET_ERR', error);
                console.error("catch", error);
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
