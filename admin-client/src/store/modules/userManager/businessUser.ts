import {
    getBusinessInfo,
    getMasterApprentice,
    updateUserInfo,
    transfer,
    getBillRecords,
    getMoneyChange,
    updateBusinessInfo,
    addBusinessInfo,
    getJsBusinessInfo,
    updateBusinessIps,
    fixBusinessPhone,
    setWeightByUid,
    getWeightByUid
} from '../../../api/admin/userManager/userManager'

import { getGameLog, getGameLogExcel } from '../../../api/admin/logManage/log'


import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

import { ban } from '../../../const/status'

export interface MasterInfo {
    apprentice: number
    bindTime: string
    tusunCount: number
    winMoney: string
}
export interface TransferInfo { }
export interface BillRecord { }
export interface GameInfo { }
export interface MoneyChange { }

export interface State {
    businessUserData: any,
    jsBusinessUserData: any,
    masterInfo: MasterInfo[],
    transferInfo: TransferInfo[]
    updateUserInfoCode: number,
    transferCode: number,
    billRecord: BillRecord[],
    gameInfo: GameInfo[]
    moneyChange: {
        data: MoneyChange[]
        totalCount: number
    }
    msg: string
}

// initial state
const state: State = {
    businessUserData: {},
    jsBusinessUserData: {},
    masterInfo: [{
        apprentice: 0,
        bindTime: "",
        tusunCount: 0,
        winMoney: "",
    }],
    transferInfo: [],
    updateUserInfoCode: 0,
    transferCode: 0,
    billRecord: [],
    gameInfo: [],
    moneyChange: {
        data: [],
        totalCount: 0
    },
    msg: ""
}

const mutations = {
    SET_BUSINESS: (state: State, data: CodeMsg<any>) => {
        state.businessUserData = data.msg
    },
    SET_JSBUSINESS: (state: State, data: CodeMsg<any>) => {
        state.jsBusinessUserData = data.msg
    },
    SET_MASTERINFO: (state: State, data: CodeMsg<any>) => {
        state.masterInfo = data.msg
    },
    SET_BILLRECORD: (state: State, data: CodeMsg<any>) => {
        // state.masterInfo = data.msg
    },
    SET_GAMEINFO: (state: State, data: CodeMsg<any>) => {
        state.gameInfo = data.msg.logs
    },
    SET_MONEYCHANGE: (state: State, data: CodeMsg<any>) => {
        state.moneyChange.data = data.msg.data
        state.moneyChange.totalCount = data.msg.totalCount
    },
    UPDATE_USERINFO: (state: State, code: number) => {
        state.updateUserInfoCode = code
    },
    UPDATE_TRANSFER: (state: State, code: number) => {
        state.transferCode = code
    },
    UPDATE_FIXPHONE: (state: State, data: CodeMsg<any>) => {
        state.updateUserInfoCode = data.code
        state.msg = data.msg || data.err
    },
}
// actions
const actions = {
    GetBusinessInfo(context: { commit: Commit, state: State }, queryItem) { //获取商人信息
        return new Promise(async (resolve, reject) => {
            getBusinessInfo(queryItem).then((response: { data }) => {
                context.commit('SET_BUSINESS', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetJsBusinessInfo(context: { commit: Commit, state: State }, queryItem) { //获取聚商下商人信息
        console.log("聚商-商人信息")
        return new Promise(async (resolve, reject) => {
            getJsBusinessInfo(queryItem).then((response: { data }) => {
                context.commit('SET_JSBUSINESS', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateBusinessInfo(context: { commit: Commit, state: State }, updateData) { //修改商人信息
        return new Promise(async (resolve, reject) => {
            updateBusinessInfo(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_USERINFO', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddBusinessInfo(context: { commit: Commit, state: State }, updateData) { //添加商人
        return new Promise(async (resolve, reject) => {
            addBusinessInfo(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_USERINFO', error.code)
                resolve()
            })
        });
    },
    GetMasterApprentice(context: { commit: Commit, state: State }, queryItem) { //获取用户师徒信息
        return new Promise(async (resolve, reject) => {
            getMasterApprentice(queryItem).then((response: { data }) => {
                context.commit('SET_MASTERINFO', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    SetWeightByUid(context: { commit: Commit, state: State }, updateData) { //添加商人
        return new Promise(async (resolve, reject) => {
            setWeightByUid(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                context.commit('UPDATE_USERINFO', error.code)
                reject(error);
            })
        });
    },
    GetWeightByUid(context: { commit: Commit, state: State }, data) { //添加商人
        return new Promise(async (resolve, reject) => {
            getWeightByUid(data).then((response: { data }) => {
                if (response.data.code == 200) {
                    resolve(response.data.msg)
                }
                else {
                    reject(response.data.err)
                }
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    // UpdateUserInfo(context: { commit: Commit, state: State }, updateData) { //修改信息
    //     return new Promise(async (resolve, reject) => {
    //         updateUserInfo(updateData).then((response: { data }) => {
    //             context.commit('UPDATE_USERINFO', response.data.code)
    //             resolve(response.data.code)
    //         }).catch(error => {
    //             console.error("catch", error)
    //             resolve()
    //         })
    //     });
    // },
    // Transfer(context: { commit: Commit, state: State }, updateData) { //转账
    //     return new Promise(async (resolve, reject) => {
    //         transfer(updateData).then((response: { data }) => {
    //             context.commit('UPDATE_TRANSFER', response.data.code)
    //             resolve(response.data.code)
    //         }).catch(error => {
    //             console.error("catch", error)
    //             context.commit('UPDATE_TRANSFER', error.code)
    //             resolve()
    //         })
    //     });
    // },
    GetBillRecords(context: { commit: Commit, state: State }, queryItem) { //账单
        return new Promise(async (resolve, reject) => {
            getBillRecords(queryItem).then((response: { data }) => {
                context.commit('SET_BILLRECORD', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetGameLog(context: { commit: Commit, state: State }, queryItem) { //游戏日志
        return new Promise(async (resolve, reject) => {
            getGameLog(queryItem).then((response: { data }) => {
                context.commit('SET_GAMEINFO', response.data)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateBusinessIps(context: { commit: Commit, state: State }, updateData) { //商人ip限制
        return new Promise(async (resolve, reject) => {
            updateBusinessIps(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_USERINFO', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    FixBusinessPhone(context: { commit: Commit, state: State }, updateData) { //修改商人手机号码
        return new Promise(async (resolve, reject) => {
            fixBusinessPhone(updateData).then((response: { data }) => {
                context.commit('UPDATE_FIXPHONE', response.data)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_FIXPHONE', error.code)
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
