import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    hongheiGameLogData: HongheiGameLogData[],
    code: number
    totalCount: number
    gameId: string
    HongheiStageLog: object,
     next: boolean
}
export interface HongheiGameLogData {
    bets: string
    endDate: string
    gameData: object
    gameId: number
    gid: string
    logDate: string
    rType: number
    rid: number
    yid: string
    startDate: string
    users: any[]
    _id: string
}
type Msg = {
    data: HongheiGameLogData[]
    totalCount: number,
    next: boolean
}
type GetHongheiGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    hongheiGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    HongheiStageLog: [],
    next: false
}

const mutations = {
    SET_HONGHEIGAMELOG: (state: State, data: GetHongheiGameLog) => {
        state.code = data.code,
        state.next = data.msg.next
        state.hongheiGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBHONGHEIUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.HongheiStageLog = data.data;
    },
}
// actions
const actions = {
    GetHongheiGameLog(context: { commit: Commit, state: State }, queryItem) { //获取HongheiGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_HONGHEIGAMELOG', <GetHongheiGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetHongheiGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
        return new Promise(async (resolve, reject) => {
            gameOneLogExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    }
}
export default {
    state,
    // getters,
    actions,
    mutations
}
