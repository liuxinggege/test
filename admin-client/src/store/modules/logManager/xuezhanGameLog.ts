import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    xuezhanGameLogData: XuezhanGameLogData[],
    code: number
    totalCount: number
    gameId: string
    XuezhanStageLog: object,
     next: boolean
}
export interface XuezhanGameLogData {
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
    data: XuezhanGameLogData[]
    totalCount: number,
    next: boolean
}
type GetXuezhanGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    xuezhanGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    XuezhanStageLog: [],
    next: false
}

const mutations = {
    SET_XUEZHANGAMELOG: (state: State, data: GetXuezhanGameLog) => {
        state.code = data.code,
        state.next = data.msg.next
        state.xuezhanGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBXUEZHANUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.XuezhanStageLog = data.data;
    },
}
// actions
const actions = {
    GetXuezhanGameLog(context: { commit: Commit, state: State }, queryItem) { //获取XuezhanGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_XUEZHANGAMELOG', <GetXuezhanGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetXuezhanGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
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
