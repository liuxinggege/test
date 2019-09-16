declare var require: any
import axios from '../../../utils/request'
// 客服信息配置
export function getOneChatCfg() {
    return axios.get(`/api/admin/customerService/getOneChatCfg`);
}
export function updateChatCfg(data) {
    return axios.post(`/api/admin/customerService/updateChatCfg`, data);
}
// 快捷聊天
export function getChatQuicks() {
    return axios.get(`/api/admin/customerService/getChatQuicks`);
}
export function addChatQuick(data) {
    return axios.post(`/api/admin/customerService/addChatQuick`, data);
}
export function upChatQuick(data) {
    return axios.post(`/api/admin/customerService/upChatQuick`, data);
}
export function delChatQuick(data) {
    return axios.post(`/api/admin/customerService/delChatQuick`, data);
}
// 聊天记录
export function getHistoryRecord(data) {
    return axios.get(`/api/admin/customerService/history/historyRecord`, { params: data });
}
// 详细聊天记录
export function getHistoryMsg(data) {
    return axios.get(`/api/admin/customerService/history/historyMsg`, { params: data });
}
// 禁言
export function shutUp(data) {
    return axios.post(`/api/admin/customerService/blackList/shutUp`, data);
}
// 解除禁言
export function notShutUp(data) {
    return axios.post(`/api/admin/customerService/blackList/notShutUp`, data);
}
// 聊天黑名单
export function getBlackList(data) {
    return axios.get(`/api/admin/customerService/blackList/list`, { params: data });
}
// 客服统计
export function getStatisticst(data) {
    return axios.get(`/api/admin/customerService/history/statistics`, { params: data });
}
// 充值问题录入
export function rechargeQuestion(data) {
    return axios.post(`/api/admin/customerService/rechargeQuestion`, data);
}
// 当日统计
export function todayInfo() {
    return axios.get(`/api/admin/customerService/history/todayInfo`);
}
// 聊天记录导出
export function chatRecord(data) {
    return axios.get(`/api/admin/export/chat/chatRecord`, { params: data });
}
// 客服统计导出
export function chatAggregate(data) {
    return axios.get(`/api/admin/export/chat/chatAggregate`, { params: data });
}
// 咨询人数分布查询
export function advisoryStat(data) {
    return axios.get(`/api/admin/customerService/advisoryStat`, { params: data });
}