import { axiosInstance } from '../../../utils/request';



export function getAgetListNew(data) {
    return axiosInstance.post(`/api/agency/agencyList/list`, data);
}

export function addAgentNew(data) {
    return axiosInstance.post(`/api/agency/agencyList/addAgency`, data);
}

export function updateAgentNew(data) {
    return axiosInstance.post(`/api/agency/agencyList/fixAgency`, data);
}

/**  
 *  冻结  代理 
 */
export function updateAgentStatus(agent) {
    return axiosInstance.post(`/api/agency/agencyList/banOrAllow`, agent);
}


export function parentTaxRate() {
    return axiosInstance.get(`/api/agency/agencyList/parentTaxRate`)
}


export function getAgentTaxSetting() {
    return axiosInstance.get(`/api/agency/getTaxRate`);
}
