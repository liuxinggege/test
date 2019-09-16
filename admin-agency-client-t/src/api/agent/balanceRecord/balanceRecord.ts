import { axiosInstance } from '../../../utils/request';

// 推广统计
export function getBalanceRecordData(data) {
    return axiosInstance.get(`/api/agency/getSettleOrder`, { params: data });
}