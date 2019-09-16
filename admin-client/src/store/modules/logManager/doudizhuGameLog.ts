import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    doudizhuGameLogData: DoudizhuGameLogData[],
    code: number
    totalCount: number
    gameId: string
    DoudizhuStageLog: object
     next: boolean
}
export interface DoudizhuGameLogData {
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
    data: DoudizhuGameLogData[]
    totalCount: number
    next: boolean
}
type GetDoudizhuGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    doudizhuGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    DoudizhuStageLog: [],
    next: false
}

const mutations = {
    SET_DOUDIZHUGAMELOG: (state: State, data: GetDoudizhuGameLog) => {
        state.code = data.code
        state.next = data.msg.next
        state.doudizhuGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBDOUDIZHUUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.DoudizhuStageLog = data.data;
    },
}
// actions
const actions = {
    GetDoudizhuGameLog(context: { commit: Commit, state: State }, queryItem) { //获取DoudizhuGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_DOUDIZHUGAMELOG', <GetDoudizhuGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetDoudizhuGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
