import { Commit } from 'vuex';
import { gameOneLog } from '../../../api/admin/logManage/log';

export interface State {
    ermjGameLogData: ErmjGameLogData[],
    code: number
    totalCount: number
    gameId: string
    ErmjStageLog: object,
    next: boolean
}
export interface ErmjGameLogData {
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
    data: ErmjGameLogData[]
    totalCount: number,
    next: boolean
}
type GetErmjGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    ermjGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    ErmjStageLog: [],
    next: false
}

const mutations = {
    SET_ERMJGAMELOG: (state: State, data: GetErmjGameLog) => {
        state.code = data.code,
            state.next = data.msg.next
        state.ermjGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBERMJUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.ErmjStageLog = data.data;
    },
}
// actions
const actions = {
    GetErmjGameLog(context: { commit: Commit, state: State }, queryItem) { //获取ErmjGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_ERMJGAMELOG', <GetErmjGameLog>response.data)
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
