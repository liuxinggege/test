import { getNiuniuMatchStages, updateNiuniuMatchStages } from '../../../api/admin/gameManager/gameManager'
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
    allInMaxMoney: string,
    bets: string,
    blindFollowRound: number,
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
        allInMaxMoney: "0",
        bets: "0",
        blindFollowRound: 0,
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
    SET_NIUNIUMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_NIUNIUMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetNiuniuMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getNiuniuMatchStages().then(response => {
                context.commit('SET_NIUNIUMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    //UpdateNiuniuMatchStages
    UpdateNiuniuMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateNiuniuMatchStages(updateData).then(response => {
                context.commit('UPDATE_NIUNIUMATCHSTAGES', response.data.code)
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
