import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    duofuduocaiGameLogData: DuofuduocaiGameLogData[],
    code: number
    totalCount: number
    gameId: string
    DuofuduocaiStageLog: object,
    commandCards: any
}
export interface DuofuduocaiGameLogData {
    bets: string
    endDate: string
    gameData: object
    gameId: number
    gid: string
    logDate: string
    rType: number
    rid: number
    stageId: string
    startDate: string
    users: any[]
    _id: string
}
type Msg = {
    data: DuofuduocaiGameLogData[]
    totalCount: number
}
type GetDuofuduocaiGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    duofuduocaiGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    DuofuduocaiStageLog: [],
    commandCards: []
}

const mutations = {
    SET_DUOFUDUOCAIGAMELOG: (state: State, data: GetDuofuduocaiGameLog) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.duofuduocaiGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBDUOFUDUOCAIUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.commandCards = data.commandCards
        state.DuofuduocaiStageLog = data.data;
    },
}
// actions
const actions = {
    GetDuofuduocaiGameLog(context: { commit: Commit, state: State }, queryItem) { //获取DuofuduocaiGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_DUOFUDUOCAIGAMELOG', <GetDuofuduocaiGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetDuofuduocaiGameLogExcel(
        context: { commit: Commit; state: State },
        queryItem
    ) {
        //Excel
        return new Promise(async (resolve, reject) => {
            gameOneLogExcel(queryItem)
                .then((response: { data }) => {
                    resolve(response.data)
                })
                .catch(error => {
                    console.error('catch', error)
                    resolve()
                })
        })
    }
}
export default {
    state,
    // getters,
    actions,
    mutations
}
