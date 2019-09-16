import { getPaodekuaiMatchStages, updatePaodekuaiMatchStages } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
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
    id: string,
    active: boolean,
    idx: number,
    color: number,
    name: string,
    bets: string,
    minMoney: string,
    maxMoney: string,
    robotMinMoney: string,
    robotMaxMoney: string,
    maxBet: number
    minRoomCount:number
    maxRobotCount:number
    minRobotRoomCount:number
    poolLine: string
    poolValue: string
    robotWinRate: robotWinRateType[];
}

// initial state
const state: State = {
    matchStagesData: [{
        id: "",
        active: false,
        idx: 0,
        color: 0,
        name: "",
        bets: "",
        minMoney: "",
        maxMoney: "",
        robotMinMoney: "",
        robotMaxMoney: "",
        maxBet: 0,
        minRoomCount:0,
        maxRobotCount:0,
        minRobotRoomCount:0,
        poolLine: "",
        poolValue: "",
        robotWinRate:[],
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0,
}


const mutations = {
    SET_PAODEKUAIMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_PAODEKUAIMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetPaodekuaiMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getPaodekuaiMatchStages().then(response => {
                context.commit('SET_PAODEKUAIMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdatePaodekuaiMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updatePaodekuaiMatchStages(updateData).then(response => {
                context.commit('UPDATE_PAODEKUAIMATCHSTAGES', response.data.code)
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
