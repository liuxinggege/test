import {
  getDuofuduocaiMatchStages,
  updateDuofuduocaiMatchStages
} from "../../../api/admin/gameManager/gameManager";
import { Commit, Dispatch } from "vuex";
export interface State {
  matchStagesData: matchStagesData[];
  code: number;
  minRobotRoomCountEditFlag: boolean[];
  minRoomCountEditFlag: boolean[];
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
  robotMaxMoney: string;
  robotMinMoney: string;
  robotWinRate: robotWinRateType[];
  allowBetMinMoney: string;
}

// initial state
const state: State = {
  matchStagesData: [
    {
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
      name: "",
      poolLine: "0",
      poolValue: "0",
      robotMaxMoney: "0",
      robotMinMoney: "0",
      robotWinRate: [],
      allowBetMinMoney:"0"
    }
  ],
  minRobotRoomCountEditFlag: [],
  minRoomCountEditFlag: [],
  code: 0
};

const mutations = {
  SET_DUOFUDUOCAIMATCHSTAGES: (state: State, data: matchStagesData[]) => {
    state.matchStagesData = data;
    state.minRobotRoomCountEditFlag = [];
    state.minRoomCountEditFlag = [];
    data.forEach(() => {
      state.minRobotRoomCountEditFlag.push(false);
      state.minRoomCountEditFlag.push(false);
    });
  },
  UPDATE_DUOFUDUOCAIMATCHSTAGES: (state: State, code) => {
    state.code = code;
  }
};
// actions
const actions = {
  GetDuofuduocaiMatchStages(context: { commit: Commit; state: State }) {
    return new Promise(async (resolve, reject) => {
      getDuofuduocaiMatchStages()
        .then(response => {
          context.commit("SET_DUOFUDUOCAIMATCHSTAGES", response.data.msg);
          resolve();
        })
        .catch(error => {
          console.error("catch", error);
          resolve();
        });
    });
  },

  UpdateDuofuduocaiMatchStages(
    context: { commit: Commit; dispatch: Dispatch; state: State },
    updateData
  ) {
    return new Promise(async (resolve, reject) => {
      updateDuofuduocaiMatchStages(updateData)
        .then(response => {
          context.commit("UPDATE_DUOFUDUOCAIMATCHSTAGES", response.data.code);
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
  actions,
  mutations
};
