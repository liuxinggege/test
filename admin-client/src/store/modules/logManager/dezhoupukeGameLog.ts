import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { Commit } from 'vuex'

export interface State {
    dezhoupukeGameLogData: DezhoupukeGameLogData[],
    code: number
    totalCount: number
    gameId: string
    DezhoupukeStageLog: object,
    commandCards: any
    next: boolean
}
export interface DezhoupukeGameLogData {
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
    data: DezhoupukeGameLogData[]
    totalCount: number
    next: boolean
}
type GetDezhoupukeGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    dezhoupukeGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    DezhoupukeStageLog: [],
    commandCards: [],
    next: false
}

const mutations = {
    SET_DEZHOUPUKEGAMELOG: (state: State, data: GetDezhoupukeGameLog) => {
        state.code = data.code
        state.next = data.msg.next
        state.dezhoupukeGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBDEZHOUPUKEUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.commandCards = data.commandCards
        state.DezhoupukeStageLog = data.data;
    },
}
// actions
const actions = {
    GetDezhoupukeGameLog(context: { commit: Commit, state: State }, queryItem) { //获取DezhoupukeGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_DEZHOUPUKEGAMELOG', <GetDezhoupukeGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetDezhoupukeGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
