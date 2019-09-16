import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    buyuGameLogData: BuyuGameLogData[],
    code: number
    totalCount: number
    gameId: string
    BuyuStageLog: object
    next: boolean
}
export interface BuyuGameLogData {
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
    data: BuyuGameLogData[]
    totalCount: number
    next: boolean
}
type GetBuyuGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    buyuGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    BuyuStageLog: [],
    next: false,
}

const mutations = {
    SET_BUYUGAMELOG: (state: State, data: GetBuyuGameLog) => {
        state.code = data.code
        state.next = data.msg.next
        state.buyuGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBBUYUUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.BuyuStageLog = data.data;
    },
}
// actions
const actions = {
    GetBuyuGameLog(context: { commit: Commit, state: State }, queryItem) { //获取BuyuGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_BUYUGAMELOG', <GetBuyuGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetBuyuGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Eccel
        return new Promise(async (resolve, reject) => {
            gameOneLogExcel(queryItem).then((response: { data }) => {
                resolve(response.data);
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
