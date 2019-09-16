import {downloadUserCreateExcel, addGeneralUser,getUserCreateRecord} from '../../../api/admin/userManager/userManager'
import { Commit } from 'vuex'
export interface State {
    userCreateRecordData:any
    msg: string
    code: number
}
export interface userCreateRecordAttribution {
    count:number,
    userCreateRecord:{ 
        pid: string,
        time: Date,
        uid: number,
        pwd: string,
        act: string,
        channel: string,
        opt: string,}[]
}
// initial state
const state: State = {
    userCreateRecordData:{
        count:0,
        data:[],
    } ,
    msg: "",
    code: 0
}

const mutations = {
    SET_USERCREATERECORD: (state: State, data: any) => {
        state.code = data.code;
        state.userCreateRecordData.count = data.msg.totalCount;
        state.userCreateRecordData.data = data.msg.pageData;
    },
    SET_ADDUSER: (state: State, data: any) => {
        state.code = data.code;
        state.msg = data.msg;
    },
    SET_ERROR: (state: State,data) => {
        state.msg= data.err;
        state.code=data.code;
    },
}
// actions
const actions = {
    AddGeneralUser(context: { commit: Commit, state: State }, queryItem) { //添加用户
        return new Promise(async (resolve, reject) => {
            addGeneralUser(queryItem).then((response: { data }) => {
                context.commit('SET_ADDUSER', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    GetUserCreateRecord(context: { commit: Commit, state: State }, queryItem) { //添加用户
        return new Promise(async (resolve, reject) => {
            getUserCreateRecord(queryItem).then((response: { data }) => {
                context.commit('SET_USERCREATERECORD', response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    DownloadUserCreateExcel(context: { commit: Commit, state: State }, queryItem) { //批量封号
        return new Promise(async (resolve) => {
            downloadUserCreateExcel(queryItem).then((response) => {
                context.commit('SET_ADDUSER', response.data)
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
