import {
    getGeneralUser,
    downloadGeneralUserExcel,
    getMasterApprentice,
    updateUserInfo,
    transfer,
    recoverySection,
    recharge,
    withdraw,
    getBillRecords,
    loginForbidden,
    userWithdrawForbidden,
    userChargeForbidden,
    forceKickUser,
    delUser,
    getMoneyChange,
    getMoneyChangeExcel,
    changeChannel,
    toBank,
    toPeople,
    userVipRechargeForbidden,
    updateUserPersonWaterLine,
    getGeneralUserByCreateIP,
    downloadGeneralUserExcelByIP,
    waterLineUserData
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
    generalUserData: any,
    masterInfo: MasterInfo[],
    transferInfo: TransferInfo[]
    updateUserInfoCode: number,
    transferCode: number,
    loginForbiddenCode: number,
    billRecord: BillRecord[],
    gameInfo: GameInfo[]
    moneyChange: {
        data: MoneyChange[]
        totalCount: number
    }
    downloadExcelCode: number
    msg: string
    changeChannelCode: number
    addUserCode: number
}

// initial state
const state: State = {
    generalUserData: {
        data: [],
        totalCount: 0
    },
    masterInfo: [{
        apprentice: 0,
        bindTime: "",
        tusunCount: 0,
        winMoney: "",
    }],
    transferInfo: [],
    updateUserInfoCode: 0,
    transferCode: 0,
    loginForbiddenCode: 0,
    billRecord: [],
    gameInfo: [],
    moneyChange: {
        data: [],
        totalCount: 0
    },
    downloadExcelCode: 0,
    msg: "",
    changeChannelCode: 0,
    addUserCode: 0
}

const mutations = {
    CLEAR_CODE_GENERALUSER: (state: State) => {
        state.updateUserInfoCode = 0;
        state.transferCode = 0;
        state.loginForbiddenCode = 0;
        state.downloadExcelCode = 0
        state.changeChannelCode = 0
    },
    SET_DOWNLOADEXCEL: (state: State, data: CodeMsg<any>) => {
        // state.generalUserData = data.msg
        state.downloadExcelCode = data.code
        state.msg = data.msg || data.err
    },
    SET_GENERALUSER: (state: State, data: CodeMsg<any>) => {
        state.generalUserData = data.msg
        state.generalUserData.data = state.generalUserData.data.map(v => {
            let loginFlag = "允许登录";
            let withdrawFlag = "允许兑换";
            let rechargeFlag = "允许在线充值";
            let vipRechargeFlag = "允许vip充值";
            if (ban.check(v.status, ban.STATUS_BAN_LOGIN)) {
                loginFlag = "禁止登录";
            }
            if (ban.check(v.status, ban.STATUS_BAN_WITHDRAW)) {
                withdrawFlag = "禁止兑换";
            }
            if (ban.check(v.status, ban.STATUS_BAN_RECHARGE)) {
                rechargeFlag = "禁止在线充值";
            }
            if (ban.check(v.status, ban.BAN_VIP_RECHARGE)) {
                vipRechargeFlag = "屏蔽vip充值";
            }
            return {
                ...v,
                loginFlag: loginFlag,
                withdrawFlag: withdrawFlag,
                rechargeFlag: rechargeFlag,
                vipRechargeFlag: vipRechargeFlag
            };
        });
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
    SET_LOGINFORBIDDEN: (state: State, code: number) => {
        state.loginForbiddenCode = code
    },
    UPDATE_USERINFO: (state: State, code: number) => {
        state.updateUserInfoCode = code
    },
    UPDATE_TRANSFER: (state: State, code: number) => {
        state.transferCode = code
    },
    UPDATE_RECOVERYSECTION: (state: State, data: any) => {
        state.transferCode = data.code
        state.msg = data.msg || data.err
    },
    SET_CHANGECHANNELCODE: (state: State, data: any) => {
        state.changeChannelCode = data.code
        state.msg = data.msg || data.err
    },
    SET_ERROR: (state: State, data: any) => {
        state.updateUserInfoCode = data.code
        state.msg = data.err
    },
}
// actions
const actions = {
    GetGeneralUser(context: { commit: Commit, state: State }, queryItem) { //获取普通用户信息
        return new Promise(async (resolve, reject) => {
            getGeneralUser(queryItem).then((response: { data }) => {
                context.commit('SET_GENERALUSER', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    WaterLineUserData(context: { commit: Commit, state: State }, queryItem) { //获取普通用户信息
        return new Promise(async (resolve, reject) => {
            waterLineUserData(queryItem).then((response: { data }) => {
                context.commit('SET_GENERALUSER', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetGeneralUserByCreateIP(context: { commit: Commit, state: State }, queryItem) { //获取普通用户信息
        return new Promise(async (resolve, reject) => {
            getGeneralUserByCreateIP(queryItem).then((response: { data }) => {
                context.commit('SET_GENERALUSER', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    ChangeChannel(context: { commit: Commit, state: State }, queryItem) { //修改渠道
        return new Promise(async (resolve, reject) => {
            changeChannel(queryItem).then((response: { data }) => {
                context.commit('SET_CHANGECHANNELCODE', response.data);
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_CHANGECHANNELCODE', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    DownloadGeneralUserExcel(context: { commit: Commit, state: State }, queryItem) { //获取普通用户Excel
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            downloadGeneralUserExcel(queryItem).then((response: { data }) => {
                context.commit('SET_DOWNLOADEXCEL', response.data);
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_DOWNLOADEXCEL', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    DownloadGeneralUserExcelByIP(context: { commit: Commit, state: State }, queryItem) { //获取普通用户Excel
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            downloadGeneralUserExcelByIP(queryItem).then((response: { data }) => {
                context.commit('SET_DOWNLOADEXCEL', response.data);
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_DOWNLOADEXCEL', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetMasterApprentice(context: { commit: Commit, state: State }, queryItem) { //获取普通用户师徒信息
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
    UpdateUserInfo(context: { commit: Commit, state: State }, updateData) { //修改信息
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            updateUserInfo(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateUserPersonWaterLine(context: { commit: Commit, state: State }, updateData) { //修改信息
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            updateUserPersonWaterLine(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    ToBank(context: { commit: Commit, state: State }, updateData) { //将金币转到银行
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            toBank(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    ToPeople(context: { commit: Commit, state: State }, updateData) { //将银行金币转到身上
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            toPeople(updateData).then((response: { data }) => {
                context.commit('UPDATE_USERINFO', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    //转账
    Transfer(context: { commit: Commit, state: State }, updateData) {
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            transfer(updateData).then((response: { data }) => {
                context.commit('UPDATE_TRANSFER', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_TRANSFER', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    //追分
    RecoverySection(context: { commit: Commit, state: State }, updateData) {
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            recoverySection(updateData).then((response: { data }) => {
                context.commit('UPDATE_RECOVERYSECTION', response.data)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_RECOVERYSECTION', error)
                console.error("catch", error)
                resolve()
            })
        });
    },
    //上分
    Recharge(context: { commit: Commit, state: State }, updateData) {
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            recharge(updateData).then((response: { data }) => {
                context.commit('UPDATE_TRANSFER', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_TRANSFER', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    //下分
    Withdraw(context: { commit: Commit, state: State }, updateData) {
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            withdraw(updateData).then((response: { data }) => {
                context.commit('UPDATE_TRANSFER', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                context.commit('UPDATE_TRANSFER', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },


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
    LoginForbidden(context: { commit: Commit, state: State }, updateData) { //禁止登陆
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            loginForbidden(updateData).then((response: { data }) => {
                context.commit('SET_LOGINFORBIDDEN', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UserWithdrawForbidden(context: { commit: Commit, state: State }, updateData) { //禁止兑换
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            userWithdrawForbidden(updateData).then((response: { data }) => {
                context.commit('SET_LOGINFORBIDDEN', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UserChargeForbidden(context: { commit: Commit, state: State }, updateData) { //禁止充值
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            userChargeForbidden(updateData).then((response: { data }) => {
                context.commit('SET_LOGINFORBIDDEN', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UserVipRechargeForbidden(context: { commit: Commit, state: State }, updateData) { //屏蔽vip充值
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            userVipRechargeForbidden(updateData).then((response: { data }) => {
                context.commit('SET_LOGINFORBIDDEN', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    ForceKickUser(context: { commit: Commit, state: State }, uid) { //踢玩家
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            forceKickUser(uid).then((response: { data }) => {
                context.commit('SET_LOGINFORBIDDEN', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    DelUser(context: { commit: Commit, state: State }, uid) { //删除玩家
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            delUser(uid).then((response: { data }) => {
                context.commit('SET_LOGINFORBIDDEN', response.data.code)
                resolve(response.data.code)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_LOGINFORBIDDEN', error.code)
                resolve()
            })
        });
    },
    GetGameLog(context: { commit: Commit, state: State }, queryItem) { //游戏日志
        context.commit('CLEAR_CODE_GENERALUSER');
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
    GetMoneyChange(context: { commit: Commit, state: State }, queryItem) { //pageData用
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            getMoneyChange(queryItem).then((response: { data }) => {
                context.commit('SET_MONEYCHANGE', response.data);
                resolve(response.data);
            }).catch(error => {
                console.error("catch", error);
                resolve()
            })
        });
    },
    GetMoneyChangeExcel(context: { commit: Commit, state: State }, queryItem) { //Excel用
        context.commit('CLEAR_CODE_GENERALUSER');
        return new Promise(async (resolve, reject) => {
            getMoneyChangeExcel(queryItem).then((response: { data }) => {
                resolve(response.data);
            }).catch(error => {
                console.error("catch", error);
                resolve();
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
