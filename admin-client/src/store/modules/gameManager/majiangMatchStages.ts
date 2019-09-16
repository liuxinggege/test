import { getMajiangMatchStages, updateMajiangMatchStages } from '../../../api/admin/gameManager/gameManager'
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
    dianGangCaGua: boolean;
    dianGangHuaZiMo: boolean;
    fanMaxLimit: number;
    haiDiLao: boolean;
    huJiaoZhuanYi: boolean;
    id: string;
    idx: number;
    jiShiYu: boolean;
    maxMoney: string;
    maxRobotCount: number;
    menQingZhongZhuang: boolean;
    minMoney: string;
    minRobotRoomCount: number;
    minRoomCount: number;
    name: string;
    poolLine: string;
    poolValue: string;
    robotMaxMoney: string;
    robotMinMoney: string;
    robotWinRate: robotWinRateType[];
    tianDiHu: boolean;
    yaoJiuJiangDui: boolean;
    ziMoType: number;
}

// initial state
const state: State = {
    matchStagesData: [{
        active: false,
        bets: "0",
        color: 0,
        dianGangCaGua: false,
        dianGangHuaZiMo: false,
        fanMaxLimit: 0,
        haiDiLao: false,
        huJiaoZhuanYi: false,
        id: "0",
        idx: 0,
        jiShiYu: false,
        maxMoney: "0",
        maxRobotCount: 0,
        menQingZhongZhuang: false,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "0",
        poolLine: "0",
        poolValue: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
        tianDiHu: false,
        yaoJiuJiangDui: false,
        ziMoType: 0,
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0,
}


const mutations = {
    SET_MAJIANGMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_MAJIANGMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetMajiangMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getMajiangMatchStages().then(response => {
                context.commit('SET_MAJIANGMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateMajiangMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateMajiangMatchStages(updateData).then(response => {
                context.commit('UPDATE_MAJIANGMATCHSTAGES', response.data.code)
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
