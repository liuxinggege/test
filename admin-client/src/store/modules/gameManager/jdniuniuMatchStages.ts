import { getJDNiuniuMatchStages, updateJDNiuniuMatchStages } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'

export interface State {
    matchStagesData: matchStagesData[],
    code: number,
    minRobotRoomCountEditFlag: boolean[],
    minRoomCountEditFlag: boolean[]
}
export interface matchStagesData {
    active: boolean,
    bets: string,
    color: number,
    id: string,
    idx: number,
    maxMoney: string,
    maxRobotCount: number,
    maxRound: number,
    minMoney: string,
    minRobotRoomCount: number,
    minRoomCount: number,
    name: string,
    poolLine: string,
    poolValue: string,
    robotMaxMoney: string,
    robotMinMoney: string,
    robotWinRate: any[],
    minRobotRoomCountEditFlag?: boolean
    minRoomCountEditFlag?: boolean
}
// initial state
const state: State = {
    matchStagesData: [{
        active: false,
        bets: "0",
        color: 0,
        id: "0",
        idx: 0,
        maxMoney: "0",
        maxRobotCount: 0,
        maxRound: 0,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "0",
        poolLine: "0",
        poolValue: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
        minRobotRoomCountEditFlag: false,
        minRoomCountEditFlag: false
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0
}

const mutations = {
    SET_JDNIUNIUMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_JDNIUNIUMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetJDNiuniuMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getJDNiuniuMatchStages().then(response => {
                context.commit('SET_JDNIUNIUMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    //UpdateJDNiuniuMatchStages
    UpdateJDNiuniuMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateJDNiuniuMatchStages(updateData).then(response => {
                context.commit('UPDATE_JDNIUNIUMATCHSTAGES', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    }
}
export default {
    state,
    actions,
    mutations
}
