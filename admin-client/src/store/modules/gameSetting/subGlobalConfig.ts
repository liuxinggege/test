import { Commit } from "vuex";
import { getChatConfig, getSubGlobalConfig, postChatConfig, updateSubGlobalConfig } from "../../../api/admin/gameSetting/gameSetting";

export interface State {
    // apprenticePageRecordCount: number
    bindTimeout: number;
    createRoomInterval: number;
    forceChangeRoom: number;
    // grandmasterGetMoneyRate: string
    // masterGetMoneyRate: string
    matchMoneyUpDownRate: string;
    minBillCanNotMatchRobot: number;
    showBillboard: any;
    checkRegister: boolean;
    secretId: string;
    secretKey: string;
    tempSwitch: boolean;
    transferPageRecordCount: number;
    bindAliBankMaxCount: number;
    withdrawAliLimit: string;
    withdrawAliTimesLimit: number;
    riskLevel: number;
    _id: string;
    agentShowLimitDay: string;
    banIpActive: boolean;
    code: number;
}

type GetSubGlobalConfigResp = State; //获取结果SubGlobalConfig

// initial state
const state: State = {
    // apprenticePageRecordCount: 0,
    bindTimeout: 0,
    createRoomInterval: 0,
    forceChangeRoom: 0,
    // grandmasterGetMoneyRate: "0",
    // masterGetMoneyRate: "0",
    matchMoneyUpDownRate: "0",
    minBillCanNotMatchRobot: 0,
    showBillboard: 0,
    checkRegister: false,
    secretId: "0",
    secretKey: "0",
    tempSwitch: false,
    transferPageRecordCount: 0,
    bindAliBankMaxCount: 0,
    withdrawAliLimit: "0",
    withdrawAliTimesLimit: 0,
    riskLevel: 0,
    _id: "0",
    agentShowLimitDay: "",
    banIpActive: false,
    code: 0
};

const mutations = {
    SET_SUBGLOBALCONFIG: (state: State, data: GetSubGlobalConfigResp) => {
        // state.apprenticePageRecordCount = data.apprenticePageRecordCount
        state.bindTimeout = data.bindTimeout;
        state.createRoomInterval = data.createRoomInterval;
        state.forceChangeRoom = data.forceChangeRoom;
        // state.grandmasterGetMoneyRate = data.grandmasterGetMoneyRate
        // state.masterGetMoneyRate = data.masterGetMoneyRate
        state.matchMoneyUpDownRate = data.matchMoneyUpDownRate;
        state.minBillCanNotMatchRobot = data.minBillCanNotMatchRobot;
        state.showBillboard = data.showBillboard;
        state.checkRegister = data.checkRegister;
        state.secretId = data.secretId;
        state.secretKey = data.secretKey;
        state.tempSwitch = data.tempSwitch;
        state.transferPageRecordCount = data.transferPageRecordCount;
        state.bindAliBankMaxCount = data.bindAliBankMaxCount;
        state.withdrawAliLimit = data.withdrawAliLimit;
        state.withdrawAliTimesLimit = data.withdrawAliTimesLimit;
        state.riskLevel = data.riskLevel;
        state._id = data._id;
        state.agentShowLimitDay = data.agentShowLimitDay;
        state.banIpActive = data.banIpActive;
    },
    UPDATE_SUBGLOBALCONFIG: (state: State, code) => {
        state.code = code;
    },
    RESET_SUBGLOBALCONFIG_CODE: (state: State) => {
        console.log("重置RESET_SUBGLOBALCONFIG_CODE");
        state.code = 0;
    }
};
// actions
const actions = {
    GetSubGlobalConfig(context: { commit: Commit; state: State }) {
        //获取SubGlobalConfig
        return new Promise(async (resolve, reject) => {
            getSubGlobalConfig()
                .then((response: { data }) => {
                    context.commit("SET_SUBGLOBALCONFIG", <GetSubGlobalConfigResp>(
                        response.data.msg
                    ));
                    resolve();
                })
                .catch(error => {
                    console.error("catch", error);
                    resolve();
                });
        });
    },
    UpdateSubGlobalConfig(context: { commit: Commit; state: State }, updateData) {
        //更新SubGlobalConfig
        context.commit("RESET_SUBGLOBALCONFIG_CODE");
        return new Promise(async (resolve, reject) => {
            updateSubGlobalConfig(updateData)
                .then((response: { data }) => {
                    context.commit("UPDATE_SUBGLOBALCONFIG", response.data.code);
                    resolve();
                })
                .catch(error => {
                    console.error("catch", error);
                    resolve();
                });
        });
    },
    GetChatConfig(context: { commit: Commit; state: State }) {
        //获取SubGlobalConfig
        return new Promise(async (resolve, reject) => {
            getChatConfig()
                .then((response: { data }) => {
                    console.log(response);
                    if (response.data.code == 200) {
                        resolve(response.data.msg);
                    } else if (response.data.err) {
                        reject(response.data.err);
                    }
                })
                .catch(error => {
                    console.error("catch", error);
                    reject(error);
                });
        });
    },
    PostChatConfig(context: { commit: Commit; state: State }, data) {
        //获取SubGlobalConfig
        return new Promise(async (resolve, reject) => {
            postChatConfig(data)
                .then((response: { data }) => {
                    if (response.data.code == 200) {
                        resolve(response.data);
                    } else if (response.data.err) {
                        reject(response.data.err);
                    }
                })
                .catch(error => {
                    console.error("catch", error);
                    reject(error);
                });
        });
    }
};
export default {
    state,
    // getters,
    actions,
    mutations
};
