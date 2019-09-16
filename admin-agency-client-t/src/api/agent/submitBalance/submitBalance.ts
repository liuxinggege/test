import { axiosInstance } from '../../../utils/request';


export function getSubmitBalanceData(data) {
    return axiosInstance.get(`/api/agency/getSettleHistory`, { params: data });
}

export function comfirmSubmitBalance(data) {
    return axiosInstance.post(`/api/agency/subSettlement`, data);
}
export function moneyHistoryExport(data) {
    return axiosInstance.get(`/api/export/moneyHistory`, { params: data });
}
