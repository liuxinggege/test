import { confirmAli, confirmBankCard, masterIncomeSettle, getUserInfo } from '../../../api/agent/balanceAct/balanceAct'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    userInfo: userInfoType
    code: number,
    msg: string
}

export interface userInfoType {
    act: string
    agencyId: number
    alipayAct: string
    alipayName: string
    balance: string
    bankCardName: string
    bankCardNo: string
    bankName: string
    channel: string
    createDate: string
    ip: string
    level: string
    loginDate: string
    name: string
    parentAct: string
    phone: string
    pwd: string
    qq: string
    remarks: string
    settlePwd: string
    status: string
    taxRate: string
    totalIncome: string
    type: string
    uid: number
    wx: string,
    masterGameUid: number
}
// initial state
const state: State = {
    userInfo: {
        act: "",
        agencyId: 0,
        alipayAct: "",
        alipayName: "",
        balance: "",
        bankCardName: "",
        bankCardNo: "",
        bankName: "",
        channel: "",
        createDate: "",
        ip: "",
        level: "",
        loginDate: "",
        name: "",
        parentAct: "",
        phone: "",
        pwd: "",
        qq: "",
        remarks: "",
        settlePwd: "",
        status: "",
        taxRate: "",
        totalIncome: "",
        type: "",
        uid: 0,
        wx: "",
        masterGameUid: 0
    },
    code: 0,
    msg: ""
}

const mutations = {

    CLEAR_CODEACT: (state: State) => {
        state.code = 0;
    },

    SET_MASTERINCOMESETTLE: (state: State, data: CodeMsg<any>) => {
        state.code = data.code;
        state.msg = data.msg || data.err;

    },
    SET_CONFIRMALI: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.msg = data.msg || data.err;
    },

    SET_CONFIRMBANKCARD: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.msg = data.msg || data.err;
    },

    SET_GETUSERINFO: (state: State, data: CodeMsg<any>) => {
        state.code = data.code;
        state.userInfo = data.msg;
    },
}
// actions
const actions = {
    ConfirmAli(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODEACT');
        return new Promise(async (resolve, reject) => {
            confirmAli(queryItem).then((response: { data }) => {
                context.commit('SET_CONFIRMALI', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_CONFIRMALI', error);
                console.error("catch", error)
                resolve()
            })
        });
    },

    ConfirmBankCard(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_CODEACT');
        return new Promise(async (resolve, reject) => {
            confirmBankCard(queryItem).then((response: { data }) => {
                context.commit('SET_CONFIRMBANKCARD', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_CONFIRMBANKCARD', error);
                console.error("catch", error)
                resolve()
            })
        });
    },

    GetUserInfo(context: { commit: Commit, state: State }) {
        context.commit('CLEAR_CODEACT');
        return new Promise(async (resolve, reject) => {
            getUserInfo().then((response: { data }) => {
                context.commit('SET_GETUSERINFO', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    MasterIncomeSettle(context: { commit: Commit, state: State }) {
        context.commit('CLEAR_CODEACT');
        return new Promise(async (resolve, reject) => {
            masterIncomeSettle().then((response: { data }) => {
                context.commit('SET_MASTERINCOMESETTLE', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_MASTERINCOMESETTLE', error)
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
