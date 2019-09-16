import { getLoginLog } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    loginLogData: LoginLogData[],
    code: number
    totalCount: number
}
export interface LoginLogData {
    date: string
    ip: string
    lat: number
    lng: number
    location: string
    platform: string
    uid: number
    uuid: string
    version: string
    _id: string
}
type Msg = {
    data: LoginLogData[]
    totalCount: number
}
type GetLoginLogResp = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    loginLogData: [],
    code: 0,
    totalCount: 0
}

const mutations = {
    SET_LOGINLOG: (state: State, data: GetLoginLogResp) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.loginLogData = data.msg.data
    },
}
// actions
const actions = {
    GetLoginLog(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getLoginLog(queryItem).then((response: { data }) => {
                context.commit('SET_LOGINLOG', <GetLoginLogResp>response.data)
                resolve()
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
