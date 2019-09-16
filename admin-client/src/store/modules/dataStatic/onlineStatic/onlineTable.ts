import { getOnlineTable } from '../../../../api/admin/dataStatic/dataStatic'
import { CodeMsg } from '../../../index'
import { Commit } from 'vuex'
import store from '../../../../store'

export interface State {
    transferData: OnlineTableData[],
    code: number
    totalCount: number
    heh: number
}
export interface OnlineTableData {
    sumDate: string
    localeSumDate: string
    minOnline: number
    maxOnline: number
    avgOnline: number
}
type Msg = {
    data: OnlineTableData[]
    totalCount: number
}
type GetOnlineTable = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    transferData: [],
    code: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_ONLINESTATIC_ONLINETABLE: (state: State, data: GetOnlineTable) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.data

    },
}
// actions
const actions = {
    GetOnlineTable(context: { commit: Commit, state: State }, queryItem) { //获取在线表格
        return new Promise(async (resolve, reject) => {
            getOnlineTable(queryItem).then((response: { data }) => {
                context.commit('SET_ONLINESTATIC_ONLINETABLE', <GetOnlineTable>response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)

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
