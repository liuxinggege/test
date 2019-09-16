import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    longhuGameLogData: LonghuGameLogData[],
    code: number
    totalCount: number
    gameId: string
    LonghuStageLog: object,
     next: boolean
}
export interface LonghuGameLogData {
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
    data: LonghuGameLogData[]
    totalCount: number,
    next: boolean
}
type GetLonghuGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    longhuGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    LonghuStageLog: [],
    next: false
}

const mutations = {
    SET_LONGHUGAMELOG: (state: State, data: GetLonghuGameLog) => {
        state.code = data.code,
        state.next = data.msg.next
        state.longhuGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBLONGHUUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.LonghuStageLog = data.data;
    },
}
// actions
const actions = {
    GetLonghuGameLog(context: { commit: Commit, state: State }, queryItem) { //获取LonghuGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_LONGHUGAMELOG', <GetLonghuGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetLonghuGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
