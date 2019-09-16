import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    qznnGameLogData: QznnGameLogData[],
    code: number
    totalCount: number
    gameId: string
    QznnStageLog: object,
    next: boolean
}
export interface QznnGameLogData {
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
    data: QznnGameLogData[]
    totalCount: number,
    next: boolean
}
type GetQznnGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    qznnGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    QznnStageLog: [],
    next: false
}

const mutations = {
    SET_QZNNGAMELOG: (state: State, data: GetQznnGameLog) => {
        state.code = data.code,
            state.next = data.msg.next
        state.qznnGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBQZNNUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.QznnStageLog = data.data;
    },
}
// actions
const actions = {
    GetQznnGameLog(context: { commit: Commit, state: State }, queryItem) { //获取QznnGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_QZNNGAMELOG', <GetQznnGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetQznnGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
