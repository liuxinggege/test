import { getBuyuMatchStages, updateBuyuMatchStages } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {
    matchStagesData: matchStagesData[],
    code: number
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
    maxMoney: string;
    maxRobotCount: number;
    minMoney: string;
    minRobotRoomCount: number;
    minRoomCount: number;
    name: string;
    poolLine: string;
    poolValue: string;
    ratePeriodD: string[];
    ratePeriodG: string[];
    ratePeriodTimeMax: number;
    ratePeriodTimeMin: number;
    ratio: number;
    robotMaxMoney: string;
    robotMinMoney: string;
    robotWinRate: robotWinRateType[];
    taxRate:string
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
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "捕鱼",
        poolLine: "0",
        poolValue: "0",
        ratePeriodD: ["-0.1", "-0.2"],
        ratePeriodG: ["0.1", "0.2"],
        ratePeriodTimeMax: 0,
        ratePeriodTimeMin: 0,
        ratio: 0,
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
        taxRate:"0"
    }],
    code: 0,
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
}


const mutations = {
    SET_BUYUMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_BUYUMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetBuyuMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getBuyuMatchStages().then(response => {
                context.commit('SET_BUYUMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateBuyuMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateBuyuMatchStages(updateData).then(response => {
                context.commit('UPDATE_BUYUMATCHSTAGES', response.data.code)
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
