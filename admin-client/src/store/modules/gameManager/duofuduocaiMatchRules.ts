import {
  getDuofuduocaiMatchRules,
  updateDuofuduocaiMatchRules
} from "../../../api/admin/gameManager/gameManager";
import { Commit } from "vuex";

export interface State {
  minUserCnt: number;
  maxUserCnt: number;
  startTime: number;
  kickTime: number;
  chkIp: Boolean;
  taxRate: string;
  robotSwitch: Boolean;
  userWinProb: string;
  userLoseProb: string;
  code: number;
  matchRange: string;
  multLvOne: string;
  multLvTwo: string;
  multLvThree: string;
  multLvFour: string;
  multLvFive: string;
  doubleMaxRate: number,             //比倍最大倍率限制
  betsLevInfo: {
    levelOne: any,
    levelTwo: any,
    levelThree: any,
    levelFour: any,
    levelFive: any,
  }
}

type GetDuofuduocaiMatchRulesResp = State; //获取结果BuyuMatchRules

// initial state
const state: State = {
  minUserCnt: 0,
  maxUserCnt: 0,
  startTime: 0,
  kickTime: 0,
  chkIp: false,
  taxRate: "0",
  robotSwitch: true,
  userWinProb: "0",
  userLoseProb: "0",
  matchRange: "",
  multLvOne: "",
  multLvTwo: "",
  multLvThree: "",
  multLvFour: "",
  multLvFive: "",
  // doubleColorCft: 0,
  // doubleStyleCft: 0,
  doubleMaxRate: 0,
  betsLevInfo: {
    levelOne: {},
    levelTwo: {},
    levelThree: {},
    levelFour: {},
    levelFive: {},
  },
  code: 0
};

const mutations = {
  SET_DUOFUDUOCAIMATCHRULES: (
    state: State,
    data: GetDuofuduocaiMatchRulesResp
  ) => {
    state.minUserCnt = data.minUserCnt;
    state.maxUserCnt = data.maxUserCnt;
    state.startTime = data.startTime;
    state.kickTime = data.kickTime;
    state.chkIp = data.chkIp;
    state.taxRate = data.taxRate;
    state.robotSwitch = data.robotSwitch;
    state.userWinProb = data.userWinProb;
    state.userLoseProb = data.userLoseProb;
    state.matchRange = data.matchRange
    state.multLvOne = data.multLvOne
    state.multLvTwo = data.multLvTwo
    state.multLvThree = data.multLvThree
    state.multLvFour = data.multLvFour
    state.multLvFive = data.multLvFive
    // state.doubleColorCft = data.doubleColorCft
    // state.doubleStyleCft = data.doubleStyleCft
    state.doubleMaxRate = data.doubleMaxRate
    state.betsLevInfo = data.betsLevInfo
  },
  UPDATE_DUOFUDUOCAIMATCHRULES: (state: State, code) => {
    state.code = code;
  }
};
// actions
const actions = {
  GetDuofuduocaiMatchRules(context: { commit: Commit; state: State }) {
    //获取BuyuMatchRules
    return new Promise(async (resolve, reject) => {
      getDuofuduocaiMatchRules()
        .then((response: { data }) => {
          context.commit("SET_DUOFUDUOCAIMATCHRULES", <
            GetDuofuduocaiMatchRulesResp
            >response.data.msg[0]);
          resolve();
        })
        .catch(error => {
          resolve();
        });
    });
  },
  UpdateDuofuduocaiMatchRules(
    context: { commit: Commit; state: State },
    updateData
  ) {
    //获取BuyuMatchRules
    return new Promise(async (resolve, reject) => {
      updateDuofuduocaiMatchRules(updateData)
        .then((response: { data }) => {
          context.commit("UPDATE_DUOFUDUOCAIMATCHRULES", response.data.code);
          resolve();
        })
        .catch(error => {
          console.error("catch", error);
          resolve();
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
