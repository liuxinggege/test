import { getRobot, updateRobot } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    activeRoomSwitch: boolean
    joinRobotSwitch: boolean
    robotSwitch: boolean
    location: object
    withdrawNoticeActive: boolean
    withdrawNoticeFrequencyMax: number
    withdrawNoticeFrequencyMin: number
    withdrawNoticeMoneyMin: number
    code: number
}

type GetRobotResp = State;//获取结果Robot

// initial state
const state: State = {
    activeRoomSwitch: false,
    joinRobotSwitch: false,
    robotSwitch: false,
    location: {},
    withdrawNoticeActive: false,
    withdrawNoticeFrequencyMax: 0,
    withdrawNoticeFrequencyMin: 0,
    withdrawNoticeMoneyMin: 0,
    code: 0,
}

const mutations = {
    SET_ROBOT: (state: State, data: GetRobotResp) => {
        state.activeRoomSwitch = data.activeRoomSwitch
        state.joinRobotSwitch = data.joinRobotSwitch
        state.robotSwitch = data.robotSwitch
        state.location = data.location
        state.withdrawNoticeActive = data.withdrawNoticeActive
        state.withdrawNoticeFrequencyMax = data.withdrawNoticeFrequencyMax
        state.withdrawNoticeFrequencyMin = data.withdrawNoticeFrequencyMin
        state.withdrawNoticeMoneyMin = data.withdrawNoticeMoneyMin
    },
    UPDATE_ROBOT: (state: State, code) => {
        state.code = code
    },
    RESET_ROBOT_CODE: (state: State) => {
        console.log("重置RESET_ROBOT_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetRobot(context: { commit: Commit, state: State }) { //获取Robot
        return new Promise(async (resolve, reject) => {
            getRobot().then((response: { data }) => {
                context.commit('SET_ROBOT', <GetRobotResp>response.data.msg[0])
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateRobot(context: { commit: Commit, state: State }, updateData) { //更新Robot
        context.commit("RESET_ROBOT_CODE")
        return new Promise(async (resolve, reject) => {
            updateRobot(updateData).then((response: { data }) => {
                context.commit('UPDATE_ROBOT', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
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
