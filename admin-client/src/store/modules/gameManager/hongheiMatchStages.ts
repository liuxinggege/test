import { getHongheiMatchStages, updateHongheiMatchStages } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {
    matchStagesData: matchStagesData[],
    code: number,
    minRobotRoomCountEditFlag: boolean[],
    minRoomCountEditFlag: boolean[]
}
export interface robotWinRateType {
    value: string;
    rate: string;
}
export interface matchStagesData {
    active: boolean;
    bets: string;
    color: number;
    id: string;
    idx: number;
    allowBetMinMoney: string;
    blackOrRedMaxMoney: string;
    maxMoney: string;
    maxRobotCount: number;
    minMoney: string;
    minRobotRoomCount: number;
    minRoomCount: number;
    name: string;
    personBetMaxMoney: string;
    poolLine: string;
    poolValue: string;
    robotMaxMoney: string;
    robotMinMoney: string;
    robotSpecialMaxMoney: string;
    robotWinRate: robotWinRateType[];
    roomBetMaxMoney: string;
    specialMaxMoney: string;
}

// initial state
const state: State = {
    matchStagesData: [{
        active: false,
        bets: "0",
        color: 0,
        id: "0",
        idx: 0,
        allowBetMinMoney: "0",
        blackOrRedMaxMoney: "0",
        maxMoney: "0",
        maxRobotCount: 0,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "",
        personBetMaxMoney: "0",
        poolLine: "0",
        poolValue: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotSpecialMaxMoney: "0",
        robotWinRate: [],
        roomBetMaxMoney: "0",
        specialMaxMoney: "0",
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0,
}


const mutations = {
    SET_HONGHEIMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_HONGHEIMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetHongheiMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getHongheiMatchStages().then(response => {
                context.commit('SET_HONGHEIMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateHongheiMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateHongheiMatchStages(updateData).then(response => {
                context.commit('UPDATE_HONGHEIMATCHSTAGES', response.data.code)
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
