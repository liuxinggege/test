import { getUserWinLose, getWithdrawMonitorLine } from '../../../api/admin/dataStatic/dataStatic'
import { Commit } from 'vuex'
import { formUtil } from "../../../utils/formatUtils";
interface HourTickLineData {
    hour: string,
    warningAmt: string,
    yestAmt: string,
    todayAmt: string
}


export interface State {
    code: number,
    lineData: HourTickLineData[]
}

interface WithdrawLineResp {
    code: number,
    msg: HourTickLineData[]
}


const state: State = {
    code: 0,
    lineData: [],
}

const mutations = {
    SET_WITHDRAWMONITOR: (state: State, data: WithdrawLineResp) => {
        state.code = data.code;
        state.lineData = data.msg.map(e=>{
            e.warningAmt = formUtil.moneyFormat(e.warningAmt);
            e.yestAmt = formUtil.moneyFormat(e.yestAmt);
            e.todayAmt = formUtil.moneyFormat(e.todayAmt);
            return e;
        });
    },
    SET_CLEAR: (state: State) => {
        state.code = 0;
        state.lineData = [];
    }
}
// actions
const actions = {
    GetWithdrawMonitor(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(resolve => {
            context.commit('SET_CLEAR');
            getWithdrawMonitorLine(queryItem).then((response: { data: WithdrawLineResp }) => {
                context.commit('SET_WITHDRAWMONITOR', response.data);
                resolve();
            }).catch(error => {
                console.error("GetWithdrawMonitor, err:", error);
                resolve();
            })
        })
    }
}
export default {
    state,
    // getters,
    actions,
    mutations
}
