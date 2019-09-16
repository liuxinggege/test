import { axiosInstance } from '../../../utils/request';

// 普通用户列表
export function getUserList(queryModel) {
    return axiosInstance.get(`/api/agency/agencyList/userList`, { params: queryModel });
}
// 代理列表
export function getAgencyList(queryModel) {
    return axiosInstance.get(`/api/agency/agencyList/list`, { params: queryModel });
}