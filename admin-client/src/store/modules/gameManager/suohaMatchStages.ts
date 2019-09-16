import { getSuohaMatchStages, updateSuohaMatchStages } from '../../../api/admin/gameManager/gameManager'
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
    allInMaxMoney: string;
    bets: string;
    color: number;
    extractPrizeMax: string;
    extractPrizeMin: string;
    extractPrizeRate: string;
    hasJoker: boolean;
    hasPrize: boolean;
    id: string;
    idx: number;
    maxMoney: string;
    maxRobotCount: number;
    minMoney: string;
    minRobotRoomCount: number;
    minRoomCount: number;
    name: string;
    poolLine: string;
    poolValue: string;
    robotMaxMoney: string;
    robotMinMoney: string;
    robotWinRate: robotWinRateType[];
    royalFlushPrize: string;
    straightFlushPrize: string;
}

// initial state
const state: State = {
    matchStagesData: [{
        active: false,
        allInMaxMoney: "0",
        bets: "0",
        color: 0,
        extractPrizeMax: "0",
        extractPrizeMin: "0",
        extractPrizeRate: "0",
        hasJoker: false,
        hasPrize: false,
        id: "0",
        idx: 0,
        maxMoney: "0",
        maxRobotCount: 0,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "0",
        poolLine: "0",
        poolValue: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
        royalFlushPrize: "0",
        straightFlushPrize: "0",
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0,
}


const mutations = {
    SET_SUOHAMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_SUOHAMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetSuohaMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getSuohaMatchStages().then(response => {
                context.commit('SET_SUOHAMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateSuohaMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateSuohaMatchStages(updateData).then(response => {
                context.commit('UPDATE_SUOHAMATCHSTAGES', response.data.code)
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
