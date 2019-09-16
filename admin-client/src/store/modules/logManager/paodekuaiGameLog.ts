import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    paodekuaiGameLogData: PaodekuaiGameLogData[],
    code: number
    totalCount: number
    gameId: string
    PaodekuaiStageLog: object,
     next: boolean
}
export interface PaodekuaiGameLogData {
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
    data: PaodekuaiGameLogData[]
    totalCount: number,
    next: boolean
}
type GetPaodekuaiGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    paodekuaiGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    PaodekuaiStageLog: [],
    next: false
}

const mutations = {
    SET_PAODEKUAIGAMELOG: (state: State, data: GetPaodekuaiGameLog) => {
        state.code = data.code,
        state.next = data.msg.next
        state.paodekuaiGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBPAODEKUAIUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.PaodekuaiStageLog = data.data;
    },
}
// actions
const actions = {
    GetPaodekuaiGameLog(context: { commit: Commit, state: State }, queryItem) { //获取PaodekuaiGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_PAODEKUAIGAMELOG', <GetPaodekuaiGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetPaodekuaiGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
        return new Promise(async (resolve, reject) => {
            gameOneLogExcel(queryItem).then((response: { data }) => {
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
