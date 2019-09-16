declare var require: any
import axios from '../../../utils/request';
// import axios from 'axios'

/*登录日志*/
export function getLoginLog(queryItem) {
    return axios.get(`/api/admin/log/login`, { params: queryItem });
}
/*后台登录日志*/
export function getBackstageLoginlog(queryItem) {
    return axios.get(`/api/admin/log/getBackstageLoginlog`, { params: queryItem });
}
/*后台登录日志 Excel用*/
export function getBackstageLoginlogExcel(queryItem) {
    return axios.get(`/api/admin/export/log/getBackstageLoginlogExcel`, { params: queryItem });
}
/*游戏日志*/
export function getGameLog(queryItem) {
    return axios.get(`/api/admin/log/gameLog`, { params: queryItem });
}
export function getGameLogExcel(queryItem) {
    return axios.get(`/api/admin/export/log/gameLogExcel`, { params: queryItem, timeout: 60000 });
}
//pageData
export function gameOneLog(queryItem) {
    return axios.get(`/api/admin/log/gameOneLog`, { params: queryItem });
}
//Excel
export function gameOneLogExcel(queryItem) {
    return axios.get(`/api/admin/export/log/gameOneLogExcel`, { params: queryItem, timeout: 60000 });
}
/*转账日志*/
export function getTransferLog(queryItem) {//pageData用
    return axios.get(`/api/admin/financial/transfer/log`, { params: queryItem });
}
export function getTransferLogExcel(queryItem) {//Excel用
    return axios.get(`/api/admin/export/financial/transfer/logExcel`, { params: queryItem, timeout: 60000 });
}
/*追分日志*/
export function getRecoverSectionLog(queryItem) {
    return axios.get(`/api/admin/log/recoverSection`, { params: queryItem });
}
/*追分日志 Excel用*/
export function getRecoverSectionLogExcel(queryItem) {
    return axios.get(`/api/admin/export/log/recoverSectionExcel`, { params: queryItem });
}
/*上下分日志*/
export function getupPointLog(queryItem) {
    return axios.get(`/api/admin/log/upPointLog`, { params: queryItem });
}
/*上下分日志 Excel用*/
export function getupPointLogExcel(queryItem) {
    return axios.get(`/api/admin/export/log/upPointLogExcel`, { params: queryItem });
}

export function getExportInfo(queryItem) {
    return axios.get(`/api/admin/log/getExportInfo`, { params: queryItem });
}
export function downloadExcel(queryItem) {
    return axios.get(`/api/admin/log/downloadExcel`, { params: queryItem, timeout: 180000, responseType: 'blob' });
}
//删除导出日志
export function deleteTask(params) {
    return axios.post(`/api/admin/log/deleteTask`, params);
}

/*日志查询*/
export function getNewLog(queryItem) {
    return axios.get(`/api/admin/log/newLog`, { params: queryItem });
}
/*操作日志 Excel用*/
export function getAdminNewLogLogExcel(queryItem) {
    return axios.get(`/api/admin/export/log/getAdminNewLogLogExcel`, { params: queryItem });
}
/*商人信息修改日志*/
export function getAgentContactInfoLog(queryItem) {
    return axios.get(`/api/admin/userMgr/adminBusiness/agentContactInfoLog`, { params: queryItem });
}

/*  统计代理的税收和利润的总和 */
export function exportTotalTaxAndIncome(params) {
    return axios.post(`/api/admin/export/agency/totalTaxAndIncome`, params);
}
/*  统计代理下级的兑换数据的总和 */
export function exportTotalExchange(params) {
    return axios.post(`/api/admin/export/agency/totalExchange`, params);
}
/*  统计用户信息 */
export function exportUserBaseInfo(params) {
    return axios.post(`/api/admin/export/user/info`, params);
}
/*  统计充值用户信息 */
export function exportUserChargedInfo(params) {
    return axios.post(`/api/admin/export/user/chargedInfo`, params);
}

/*  获取导出日志查询 */
export function getExportLog(params) {
    return axios.get(`/api/admin/log/getExportLog`, { params });
}