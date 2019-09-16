import {getUserForbiddenLog,forbiddenUser,forbiddenUsers, downloadUserForbiddenExcel,getSystemUserForbiddenLog,downloadSystemUserForbiddenExcel} from '../../../api/admin/userManager/userManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'


export interface TransferInfo { }
export interface BillRecord { }
export interface GameInfo { }
export interface MoneyChange { }

export interface State {
    userForbiddenLogDatas:any
    systemUserForbiddenLogDatas:any
    count:number
    msg: string
    code: number
}
export interface userForbiddenLogAttribution {
    count:number,
    userForbiddenLog:{ pid: string,
        uid: number,
        time: Date,
        type: number,
        reason: string,
        opt: string,}[]
}
// initial state
const state: State = {
    userForbiddenLogDatas:{
        count:0,
        data:[],
    } ,
    systemUserForbiddenLogDatas:{
        count:0,
        data:[],
    } ,
    count:0,
    msg: "",
    code: 0
}

const mutations = {
    SET_USERFORBIDDENLOG: (state: State, data: CodeMsg<any>) => {
        state.code = data.code,
        state.userForbiddenLogDatas.count = data.msg.count,
        state.userForbiddenLogDatas.data = data.msg.userForbiddenLog
    },
    SET_USERFORBIDDEN: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
    },
    SET_SYSTEMUSERFORBIDDENLOG: (state: State, data: CodeMsg<any>) => {
        state.code = data.code,
        state.systemUserForbiddenLogDatas.count = data.msg.totalCount,
        state.systemUserForbiddenLogDatas.data = data.msg.data
    },
    SET_CLEAN: (state: State,) => {
        state.userForbiddenLogDatas={},
        state.count=0,
        state.msg= "",
        state.code=0
    },
    SET_ERROR: (state: State,data) => {
        state.msg= data.err,
        state.code=data.code
    },
}
// actions
const actions = {
    GetUserForbiddenLog(context: { commit: Commit, state: State }, queryItem) { //获取封号log信息
        return new Promise(async (resolve) => {
            getUserForbiddenLog(queryItem).then((response) => {
                context.commit('SET_USERFORBIDDENLOG', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetSystemUserForbiddenLog(context: { commit: Commit, state: State }, queryItem) { //获取封号log信息
        return new Promise(async (resolve) => {
            getSystemUserForbiddenLog(queryItem).then((response) => {
                context.commit('SET_SYSTEMUSERFORBIDDENLOG', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    ForbiddenUser(context: { commit: Commit, state: State }, queryItem) { //单个封号解封
        return new Promise(async (resolve) => {
            forbiddenUser(queryItem).then((response) => {
                context.commit('SET_USERFORBIDDEN', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    ForbiddenUsers(context: { commit: Commit, state: State }, queryItem) { //批量封号
        return new Promise(async (resolve) => {
            forbiddenUsers(queryItem).then((response) => {
                context.commit('SET_USERFORBIDDENLOG', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    DownloadUserForbiddenExcel(context: { commit: Commit, state: State }, queryItem) { //批量封号
        return new Promise(async (resolve) => {
            downloadUserForbiddenExcel(queryItem).then((response) => {
                context.commit('SET_USERFORBIDDENLOG', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    DownloadSystemUserForbiddenExcel(context: { commit: Commit, state: State }, queryItem) { //批量封号
        return new Promise(async (resolve) => {
            downloadSystemUserForbiddenExcel(queryItem).then((response) => {
                context.commit('SET_SYSTEMUSERFORBIDDENLOG', response.data)
                resolve(response.data)
            }).catch(error => {
                context.commit('SET_ERROR', error);
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
