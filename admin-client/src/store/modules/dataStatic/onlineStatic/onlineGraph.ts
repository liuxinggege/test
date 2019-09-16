import { getOnlineGraph } from '../../../../api/admin/dataStatic/dataStatic'
import { CodeMsg } from '../../../index'
import { Commit } from 'vuex'
import store from '../../../../store'

export interface State {
    transferData: OnlineGraphData[],
    code: number
    totalCount: number
    heh: number
}
export interface OnlineGraphData {
    sumDate: string
    localeSumDate: string
    minOnline: number
    maxOnline: number
    avgOnline: number
}
type Msg = {
    data: OnlineGraphData[]
    totalCount: number
}
type GetOnlineGraph = {
    code: number
    msg: OnlineGraphData[]
}//获取结果LoginLog

// initial state
const state: State = {
    transferData: [],
    code: 0,
    totalCount: 0,
    heh: 0,
}

const mutations = {
    SET_ONLINEGRAPH: (state: State, data: GetOnlineGraph) => {
        state.code = data.code;
        state.transferData = data.msg;

    },
}
// actions
const actions = {
    GetOnlineGraph(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getOnlineGraph(queryItem).then((response: { data }) => {
                context.commit('SET_ONLINEGRAPH', <GetOnlineGraph>response.data);
                resolve()
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
