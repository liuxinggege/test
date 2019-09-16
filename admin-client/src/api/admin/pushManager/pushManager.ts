declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'


//-------推送配置---------
// 推送配置列表
export function getPushCfg(data) {
    return axios.get(`/api/admin/apns/apnsCfg/getCfg`,{params:data});
}
// 添加推送配置
export function insertCfg(data) {
    return axios.post(`/api/admin/apns/apnsCfg/insertCfg`, data);
}
// 修改推送配置
export function updateCfg(data) {
    return axios.post(`/api/admin/apns/apnsCfg/updateCfg`, data);
}
// 删除推送配置
export function deleteCfg(data) {
    return axios.post(`/api/admin/apns/apnsCfg/deleteCfg`, data);
}

// 推送任务列表
export function getApnsTask(data) {
    return axios.get(`/api/admin/apns/getApnsTask`,{params:data});
}
// 批量添加推送任务
export function createApnsTask(data) {
    return axios.post(`/api/admin/apns/createApnsTask`, data);
}


// 推送任务明细
export function getApnsTaskDetail(data) {
    return axios.get(`/api/admin/apns/getApnsTaskDetail`,{params:data});
}
// 重新推送（单个）
export function repushTaskDetail(data) {
    return axios.post(`/api/admin/apns/repushTaskDetail`, data);
}
// 重新推送（多个）
export function repushTaskManyDetail(data) {
    return axios.post(`/api/admin/apns/repushTaskManyDetail`, data);
}