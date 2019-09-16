import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    jinhuaGameLogData: JinhuaGameLogData[],
    code: number
    totalCount: number
    gameId: string
    JinhuaStageLog: object,
    next: boolean
}
export interface JinhuaGameLogData {
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
    data: JinhuaGameLogData[]
    totalCount: number,
    next: boolean
}
type GetJinhuaGameLogResp = {
    code: number
    msg: Msg
}//获取结果jinhuaGameLog

// initial state
const state: State = {
    jinhuaGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    JinhuaStageLog: [],
    next: false
}

const mutations = {
    SET_JINHUAGAMELOG: (state: State, data: GetJinhuaGameLogResp) => {
        state.code = data.code,
            state.next = data.msg.next
        state.jinhuaGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBJINHUAUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.JinhuaStageLog = data.data;
    },
}
// actions
const actions = {
    GetJinhuaGameLog(context: { commit: Commit, state: State }, queryItem) { //获取JinhuaGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_JINHUAGAMELOG', <GetJinhuaGameLogResp>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetJinhuaGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
