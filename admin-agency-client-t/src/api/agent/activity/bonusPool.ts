import { axiosInstance } from '../../../utils/request';

//获取基金和状态
export function getBonusPool() {
    return axiosInstance.get(`/api/agency/getBonusPool`);
}
//开启
export function openBonusPool() {
    return axiosInstance.post(`/api/agency/openBonusPool`);
}
//领取
export function receiveBonusPool() {
    return axiosInstance.post(`/api/agency/receiveBonusPool`);
}
//资金记录
export function getBonusPoolRecord(data) {
    return axiosInstance.get(`/api/agency/getBonusPoolRecord`, { params: data });
}
//排名
export function getBonusPoolRank() {
    return axiosInstance.get(`/api/agency/getBonusPoolRank`);
}
//获取活动列表
export function getActivity() {
    return axiosInstance.get(`/api/agency/getActivity`);
}
