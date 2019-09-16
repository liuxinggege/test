import { getDezhoupukeMatchStages, updateDezhoupukeMatchStages } from '../../../api/admin/gameManager/gameManager'
import { Commit, Dispatch } from 'vuex'
export interface State {
    matchStagesData: matchStagesData[],
    code: number,
    minRobotRoomCountEditFlag: boolean[],
    minRoomCountEditFlag: boolean[],
}
export interface robotWinRateType {
    value: string;
    rate: string;
}
export interface matchStagesData {
    active: boolean;//
    bets: string;//
    color: number;//
    id: string;//
    idx: number;//
    maxTakeMoney: string;//
    maxMoney: string;//
    maxRobotCount: number;
    minMoney: string;//
    minRobotRoomCount: number;
    minRoomCount: number;
    name: string;//
    poolLine: string;
    poolValue: string;
    robotMaxMoney: string;//
    robotMinMoney: string;//
    robotWinRate: robotWinRateType[];
}

// initial state
const state: State = {
    matchStagesData: [{
        active: false,
        bets: "0",
        color: 0,
        id: "0",
        idx: 0,
        maxTakeMoney: "0",
        maxMoney: "0",
        maxRobotCount: 0,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "",
        poolLine: "0",
        poolValue: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0,
}


const mutations = {
    SET_DEZHOUPUKEMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_DEZHOUPUKEMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetDezhoupukeMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getDezhoupukeMatchStages().then(response => {
                context.commit('SET_DEZHOUPUKEMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateDezhoupukeMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateDezhoupukeMatchStages(updateData).then(response => {
                context.commit('UPDATE_DEZHOUPUKEMATCHSTAGES', response.data.code)
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
