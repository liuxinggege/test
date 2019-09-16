declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

// 获取配置
export function getAdminCfg() {
    return axios.get(`/api/admin/adminCfg/adminCfg`);
}
// 修改配置
export function updateAdminCfg(data) {
    return axios.post(`/api/admin/adminCfg/adminCfg`, data);
}


// 充值权重对应配置
// 费率配置
export function getRateWeight() {
    return axios.get(`/api/admin/adminCfg/rechargeWeightCfg/getRateWeight`);
}
// 添加费率配置
export function addRateWeight(data) {
    return axios.post(`/api/admin/adminCfg/rechargeWeightCfg/addRateWeight`, data);
}
// 修改费率配置
export function updateRateWeight(data) {
    return axios.post(`/api/admin/adminCfg/rechargeWeightCfg/updateRateWeight`, data);
}
// 删除费率配置(与删除成功率配置公用)
export function delRateWeight(data) {
    return axios.post(`/api/admin/adminCfg/rechargeWeightCfg/del`, data);
}

// 成功率配置
export function getSuccessRateWeight() {
    return axios.get(`/api/admin/adminCfg/rechargeWeightCfg/getSuccessRateWeight`);
}
// 添加成功率配置
export function addSuccessRateWeight(data) {
    return axios.post(`/api/admin/adminCfg/rechargeWeightCfg/addSuccessRateWeight`, data);
}
// 修改成功率配置
export function updateSuccessRateWeight(data) {
    return axios.post(`/api/admin/adminCfg/rechargeWeightCfg/updateSuccessRateWeight`, data);
}
