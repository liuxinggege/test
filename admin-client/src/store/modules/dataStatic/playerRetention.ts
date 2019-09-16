import { getPlayerRetention } from '../../../api/admin/dataStatic/dataStatic'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    transferData: PlayerRetentionData[],
    code: number
    totalCount: number
    heh: number
}
export interface PlayerRetentionData {
    sumDate: string
    localeSumDate: string
    newUserCount: number
    channel: string
    retentionDay2: string
    retentionDay3: string
    retentionDay4: string
    retentionDay5: string
    retentionDay6: string
    retentionDay7: string
    retentionDay8: string
    retentionDay9: string
    retentionDay10: string
    retentionDay11: string
    retentionDay15: string
    retentionDay30: string
}
type Msg = {
    data: PlayerRetentionData[]
    totalCount: number
}
type GetPlayerRetention = {
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
    SET_PLAYERRETENTION: (state: State, data: GetPlayerRetention) => {

        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.transferData = data.msg.data

    },
}
// actions
const actions = {
    GetPlayerRetention(context: { commit: Commit, state: State }, queryItem) { //玩家留存
        return new Promise(async (resolve, reject) => {
            getPlayerRetention(queryItem).then((response: { data }) => {
                context.commit('SET_PLAYERRETENTION', <GetPlayerRetention>response.data)
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
