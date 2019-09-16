import { getHomeData, getAnnouncementNotRead, setChangeChannelFlagFlase } from '../../../api/agent/home/home'
import { Commit } from 'vuex'
import { xutil } from '../../../utils/xutil';

export interface State {
    totalGameTax: string
    totalGameTaxIncome: string
    totalNewUserCount: number
    todayGameTax: string
    todayNewUserCount: number
    one: any
    two: any
    redDot: boolean
    gonggaoNotRead: number
    gonglueNotRead: number
    code: number,
    mail: number,
    aliveCustom: string,
    fundReserve: boolean,
    fundFlag: boolean
}

export interface HomeDataType {

}
// initial state
const state: State = {
    totalGameTax: "0",
    totalGameTaxIncome: "0",
    totalNewUserCount: 0,
    todayGameTax: "0",
    one: {},
    two: {},
    todayNewUserCount: 0,
    gonggaoNotRead: 0,
    gonglueNotRead: 0,
    redDot: false,
    code: 0,
    mail: null,
    aliveCustom: '',
    fundReserve: false,
    fundFlag: false
}

const mutations = {

    SET_GETHOMEDATA: (state: State, data: any) => {
        state.totalGameTax = data.msg.totalGameTax
        state.totalGameTaxIncome = data.msg.totalGameTaxIncome
        state.totalNewUserCount = data.msg.totalNewUserCount
        state.todayGameTax = data.msg.todayGameTax
        state.todayNewUserCount = data.msg.todayNewUserCount
        if (data.msg.one) {
            let date = new Date(data.msg.one.createTime)
            data.msg.one.createTime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
        }
        if (data.msg.two) {
            let date = new Date(data.msg.two.createTime)
            data.msg.two.createTime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
        }
        state.one = data.msg.one
        state.two = data.msg.two
        state.redDot = data.msg.redDot
        state.gonggaoNotRead = data.msg.gonggaoNotRead
        state.gonglueNotRead = data.msg.gonglueNotRead
        state.code = data.code
        state.mail = data.msg.mail
        state.aliveCustom = data.msg.aliveCustom
        state.fundReserve = data.msg.fundReserve
        state.fundFlag = data.msg.fundFlag
    },
    SET_ANNOUNCEMENTCOUNT: (state: State, data: any) => {
        state.redDot = data.msg.redDot
        state.gonggaoNotRead = data.msg.gonggaoNotRead
        state.gonglueNotRead = data.msg.gonglueNotRead
        state.code = data.code
    },
}
// actions
const actions = {
    GetHomeData(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getHomeData().then((response: { data }) => {
                context.commit('SET_GETHOMEDATA', response.data)
                xutil.sessionStorageSetItem("billboardRecord", response.data.msg.billboardRecord);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    SetChangeChannelFlagFlase(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            setChangeChannelFlagFlase().then((response: { data }) => {
                let userInfo = JSON.parse(<any>sessionStorage.getItem("userInfo"))
                userInfo.urlChangeFlag = false;
                xutil.sessionStorageSetItem("userInfo", userInfo);//将用户数据存放入sessionStorage
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetAnnouncementNotRead(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getAnnouncementNotRead().then((response: { data }) => {
                context.commit('SET_GETHOMEDATA', response.data)
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
