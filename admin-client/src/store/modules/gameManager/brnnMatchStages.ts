import { getBrnnMatchStages, updateBrnnMatchStages } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'

export interface State {
    matchStagesData: matchStagesData[],
    code: number
    minRobotRoomCountEditFlag: boolean[],
    minRoomCountEditFlag: boolean[]
}
export interface matchStagesData {
    active: boolean
    bankerMaxCnt: number
    bankMaxMoney: string
    bankerMinMoney: string
    bets: string
    bombBullBoost: number
    boomBullPrize: string
    bullBullBoost: number
    color: number
    yardType: number 
    extractPrizeMax: string
    extractPrizeMin: string
    extractPrizeRate: string
    fanMaxBoost: number
    hasPrize: true
    id: string
    idx: number
    marbledBullBoost: number
    marbledBullPrize: string
    maxAllBetPoint: string
    maxBetBoost: number
    maxMoney: string
    maxRobotCount: number
    readyBankerMaxLen: number
    minMoney: string
    minRobotRoomCount: number
    minRoomCount: number
    name: string
    notBullBoost: number
    poolLine: string
    poolValue: string
    robotMaxBetRealBanker: string
    robotMaxMoney: string
    robotMinMoney: string
    robotWinRate: any[]
    smallBullBoost: number
    smallBullPrize: string
}
// initial state
const state: State = {
    matchStagesData: [{
        yardType: 1,  
        active: false,
        bankerMaxCnt: 0,
        bankMaxMoney: "0",
        bankerMinMoney: "0",
        bets: "0",
        bombBullBoost: 0,
        boomBullPrize: "0",
        bullBullBoost: 0,
        color: 0,
        extractPrizeMax: "0",
        extractPrizeMin: "0",
        extractPrizeRate: "0",
        fanMaxBoost: 0,
        hasPrize: true,
        id: "0",
        idx: 0,
        marbledBullBoost: 0,
        marbledBullPrize: "0",
        maxAllBetPoint: "0",
        maxBetBoost: 0,
        maxMoney: "0",
        maxRobotCount: 0,
        readyBankerMaxLen: 0,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "0",
        notBullBoost: 0,
        poolLine: "0",
        poolValue: "0",
        robotMaxBetRealBanker: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
        smallBullBoost: 0,
        smallBullPrize: "0",
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0
}

const mutations = {
    SET_BRNNMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_BRNNMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetBrnnMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getBrnnMatchStages().then(response => {
                context.commit('SET_BRNNMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    //UpdateBrnnMatchStages
    UpdateBrnnMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateBrnnMatchStages(updateData).then(response => {
                context.commit('UPDATE_BRNNMATCHSTAGES', response.data.code)
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
