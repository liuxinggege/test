import { getGameLog, getGameLogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    gameLogData: GameLogData[],
    code: number
    totalCount: number,
    next: boolean
}
export interface GameLogData {
    endDate: string
    gid: string
    yid: string
    startDate: string
    _id: string

    chgMoney: string
    money: string
    totalOrgGold: string
    uid: number
}
type Msg = {
    logs: GameLogData[]
    totalCount: number,
    next: boolean
}
type GetGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    gameLogData: [],
    code: 0,
    totalCount: 0,
    next: false
}

const mutations = {
    SET_GAMELOG2: (state: State, data: GetGameLog) => {
        state.code = data.code,
        state.next = data.msg.next
        state.gameLogData = data.msg.logs
    },

    SET_GAMELOG1: (state: State, data: any) => {
        state.code = data.code,
        state.next = data.msg.next
        state.gameLogData = data.msg
    }
}
// actions
const actions = {
    GetGameLog2(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getGameLog(queryItem).then((response: { data }) => {

                context.commit('SET_GAMELOG2', <GetGameLog>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)

            })
        });
    },
    GetGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getGameLogExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
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
