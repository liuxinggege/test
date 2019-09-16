declare var require: any;
import axios from "../../../utils/request";
// import axios from 'axios'

//代理充值
export function agentRecharge(data) {
  return axios.get(`/api/admin/agentRecharge/rechageOrder`, { params: data });
}

//代理接待监控
export function onlineMonitor() {
  return axios.get(`/api/admin/agentRecharge/onlineMonitor`);
}

//查看聊天记录
export function chatDetail(data) {
  return axios.get(`/api/admin/agentRecharge/chatDetail`, { params: data });
}
//举报确认
export function checkOrderReport(data) {
  return axios.post(`/api/admin/agentRecharge/checkOrderReport`, data);
}
//数据导出
export function agentOrderExcel(data) {
  return axios.get(`/api/admin/export/agentOrderExcel`, { params: data });
}

//收款账户历史记录
export function agentActHistory(data) {
  return axios.get(`/api/admin/agentRecharge/agentActHistory`, {
    params: data
  });
}

//商人重权规则修改列表
export function getAgenStats(data) {
  return axios.get(`/api/admin/agentRecharge/getAgenStats`, { params: data });
}

//切换账户使用状态
export function getContacDetails(data) {
  return axios.get(`/api/admin/agentContact/getContacDetails`,{ params: data });
}
//商人联系方式查询
export function getContacInfos(data) {
  return axios.get(`/api/admin/agentContact/getContacInfos`, { params: data });
}
//查询白名单列表
export function getAgentWhiteList(data) {
  return axios.get(`/api/admin/agentContact/getAgentWhiteList`, { params: data });
}

//添加白名单
export function addAgentWhiteList(data) {
  return axios.post(`/api/admin/agentContact/addAgentWhiteList`, data);
}

//移除白名单
export function delAgentWhiteList(data) {
  return axios.post(`/api/admin/agentContact/delAgentWhiteList`, data);
}
//获取代充方式
export function getDisplayContact() {
  return axios.get(`/api/admin/agentContact/getDisplayContact`);
}

//切换代充方式
export function updateDisplayContact(data) {
  return axios.post(`/api/admin/agentContact/updateDisplayContact`, data);
}