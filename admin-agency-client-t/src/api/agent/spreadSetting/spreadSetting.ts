import { axiosInstance } from '../../../utils/request';


export function getSpreadSettingData(data) {
    return axiosInstance.post(`/api/agency/promotionCfg`, data);
}

export function promotionLoad() {
    return axiosInstance.post(`/api/agency/promotionLoad`);
}
