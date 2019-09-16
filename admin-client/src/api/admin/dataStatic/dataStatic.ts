declare var require: any
import axios from '../../../utils/request';
// import axios from 'axios'

/*统计总汇*/
export function getTotalStatic(queryItem) {
    return axios.get(`/api/admin/statSummary/global/daySum`, { params: queryItem });
}

export function getExportTotalStatic(queryItem) {
    return axios.get(`/api/admin/export/statSummary/global/exportDaySumExcel`, { params: queryItem, timeout: 60000 });
}

/** 每日统计 */
// 历史查询
export function getTodayStatic(queryItem) {
    return axios.get(`/api/admin/statSummary/channel/daySum`, { params: queryItem });
}

export function getExportCDaySum(queryItem) {
    return axios.get(`/api/admin/export/statSummary/channel/exportCDaySumExcel`, { params: queryItem, timeout: 120000 });
}

/** 玩家留存 */
export function getPlayerRetention(queryItem) {

    return axios.get(`/api/admin/statSummary/retention`, { params: queryItem });
}

/** 游戏留存 */
export function getGameRetention(queryItem) {
    return axios.get(`/api/admin/statSummary/gameRetention`, { params: queryItem });
}

/** 游戏时长 */
export function getGameTime(queryItem) {
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}

/** 用户输赢排名 */
export function getUserWinLose(queryItem) {
    return axios.get(`/api/admin/statSummary/winLoseRank`, { params: queryItem });
}
/** 用户输赢排名导出excel */
export function getUserWinLoseExcel(queryItem) {
    return axios.get(`/api/admin/export/statSummary/winLoseRankExcel`, { params: queryItem, timeout: 180000 });
}
/** 在线统计 */
export function getOnlineGraph(queryItem) {
    return axios.get(`/api/admin/statSummary/online/graph`, { params: queryItem });
}

/** 在线统计 */
export function getOnlineTable(queryItem) {
    return axios.get(`/api/admin/statSummary/online/history`, { params: queryItem });
}

/** 兑换预警 */
export function getWithdrawMonitorLine(queyItem) {
    return axios.get(`/api/admin/statSummary/withdrawMonitor`, { params: queyItem });
}
// 商人每日统计
export function getAgentDailyStat(queyItem) {
    return axios.get(`/api/admin/statSummary/agentDailyStat`, { params: queyItem });
}
// 充值每日数据统计
export function getDailyRecharge(queyItem) {
    return axios.get(`/api/admin/statSummary/rechargeChannelPDaySum/daySum`, {
        params: queyItem
    });
}
// 充值每日时间段统计
export function getDailyRechargeDay(queyItem) {
    return axios.get(`/api/admin/statSummary/rechargeChannelPDaySum/realDay`, {
        params: queyItem
    });
}
//跑量统计
export function getRechargeFlowStat(queyItem) {
    return axios.get(`/api/admin/statSummary/rechargeFlowStat/get`, {
        params: queyItem
    });
}
//跑量统计提现
export function rechargeFlowStatWithdraw(data) {
    return axios.post(`api/admin/statSummary/rechargeFlowStat/withdraw`, data);
}
// 防掉签数据统计查询
export function statPreventSignOff(queyItem) {
    return axios.get(`/api/admin/updatePackage/stat`, {
        params: queyItem
    })
}