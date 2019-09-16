import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    suohaGameLogData: SuohaGameLogData[],
    code: number
    totalCount: number
    gameId: string
    SuohaStageLog: object,
    next: boolean
}
export interface SuohaGameLogData {
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
    data: SuohaGameLogData[]
    totalCount: number,
    next: boolean
}
type GetSuohaGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    suohaGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    SuohaStageLog: [],
    next: false
}

const mutations = {
    SET_SUOHAGAMELOG: (state: State, data: GetSuohaGameLog) => {
        state.code = data.code,
            state.next = data.msg.next
        state.suohaGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBSUOHAUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.SuohaStageLog = data.data;
    },
}
// actions
const actions = {
    GetSuohaGameLog(context: { commit: Commit, state: State }, queryItem) { //获取SuohaGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_SUOHAGAMELOG', <GetSuohaGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetSuohaGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
