import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    qianghongbaoGameLogData: QianghongbaoGameLogData[],
    code: number
    totalCount: number
    gameId: string
    QianghongbaoStageLog: object,
    next: boolean
}
export interface QianghongbaoGameLogData {
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
    data: QianghongbaoGameLogData[]
    totalCount: number,
    next: boolean
}
type GetQianghongbaoGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    qianghongbaoGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    QianghongbaoStageLog: [],
    next: false
}

const mutations = {
    SET_QIANGHONGBAOGAMELOG: (state: State, data: GetQianghongbaoGameLog) => {
        state.code = data.code,
            state.next = data.msg.next
        state.totalCount = data.msg.totalCount
        state.qianghongbaoGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBQIANGHONGBAOUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.QianghongbaoStageLog = data.data;
    },
}
// actions
const actions = {
    GetQianghongbaoGameLog(context: { commit: Commit, state: State }, queryItem) { //获取QianghongbaoGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_QIANGHONGBAOGAMELOG', <GetQianghongbaoGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetQianghongbaoGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
