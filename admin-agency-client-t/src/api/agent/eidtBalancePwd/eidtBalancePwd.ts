import { axiosInstance } from '../../../utils/request';


/** 提交密码 */
export function updateBalancePwd(data) {
    return axiosInstance.post(`/api/agency/user/fixSettlePwd`, data);
}