declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

// 活动配置
export function create(data) {
    return axios.post(`/api/admin/activity/cfg/create`, data);
}
export function update(data) {
    return axios.post(`/api/admin/activity/cfg/update`, data);
}
export function deleteCfg(data) {
    return axios.post(`/api/admin/activity/cfg/delete`, data);
}
export function getMany(data) {
    return axios.get(`/api/admin/activity/cfg/getMany`, { params: data });
}
export function getSelect() {
    return axios.get(`/api/admin/activity/cfg/getSelect`);
}

// 活动兑换码
export function addCode(data) {
    return axios.post(`/api/admin/activity/cfg/addCode`, data);
}
export function getCode(data) {
    return axios.get(`/api/admin/activity/cfg/getCode`, { params: data });
}

// 活动渠道
export function createChannelCfg(data) {
    return axios.post(`/api/admin/activity/channelCfg/create`, data);
}
export function updateChannelCfg(data) {
    return axios.post(`/api/admin/activity/channelCfg/update`, data);
}
export function deleteChannelCfg(data) {
    return axios.post(`/api/admin/activity/channelCfg/delete`, data);
}
export function getManyChannelCfg(data) {
    return axios.get(`/api/admin/activity/channelCfg/getMany`, { params: data });
}
// 活动玩家
export function eventResult(data) {
    return axios.get(`/api/admin/activity/eventResult`, { params: data });
}
// 活动类型
export function getEventType() {
    return axios.get(`api/admin/activity/cfg/getEventType`,);
}
export function getOneByType(data) {
    return axios.get(`api/admin/activity/cfg/getOneByType`,{ params: data });
}
// 返利活动配置
export function getRechargeRebate() {
    return axios.get(`/api/admin/activity/cfg/rechargeRebate`);
}
// 修改
export function updateRechargeRebate(data) {
    return axios.post(`/api/admin/activity/cfg/rechargeRebate`,data);
}


