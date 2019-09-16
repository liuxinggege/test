declare var require: any
import axios from '../../../utils/request'



/**
 * 税收分成设置  查询
 */
export function getTaxDivisionSettingList() {
    return axios.post(`/api/admin/agent/getTaxDivisionSettingList`);
}
/**
 * 税收分成设置   添加
 */
export function addTaxDivisionSetting(data) {
    return axios.post(`/api/admin/agent/addTaxDivisionSetting`, data);
}
/**
 * 税收分成设置   编辑
 */
export function updateTaxDivisionSetting(data) {
    return axios.post(`/api/admin/agent/updateTaxDivisionSetting`, data);
}

/**
 * 税收分成设置   删除
 */
export function deleteTaxDivisionSetting(id) {
    return axios.post(`/api/admin/agent/deleteTaxDivisionSetting`, { id: id });
}

/**  
 * 添加  代理 
 */
export function addAgent(agent) {
    return axios.post(`/api/admin/agent/addAgent`, agent);
}

/**  
 *  查询  代理 
 */
export function getAgetList(queryModel) {
    return axios.post(`/api/admin/agent/getAgentList`, queryModel);
}

/**  
 *  更新  代理 
 */
export function updateAgent(agent) {
    return axios.post(`/api/admin/agent/updateAgent`, agent);
}

/**
 *  结算周期  查询
 */
export function getSettlementCycleList() {
    return axios.post(`/api/admin/agent/getSettlementCycleList`);
}
/**
 * 结算周期   添加
 */
export function addSettlementCycle(data) {
    return axios.post(`/api/admin/agent/addSettlementCycle`, data);
}
/**
 * 结算周期   编辑
 */
export function updateSettlementCycle(data) {
    return axios.post(`/api/admin/agent/updateSettlementCycle`, data);
}

/**
 * 结算周期   删除
 */
export function deleteSettlementCycle(id) {
    return axios.post(`/api/admin/agent/deleteSettlementCycle`, { id: id });
}

/**
 * 结算周期   删除
 */
export function updateAgentSettlementSetting(data) {
    return axios.post(`/api/admin/agent/updateAgentSettlementSetting`, data);
}


