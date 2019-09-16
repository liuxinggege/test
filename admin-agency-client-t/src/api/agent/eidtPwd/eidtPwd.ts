import { axiosInstance } from '../../../utils/request';


/** 提交密码 */
export function updatePwd(data) {
    return axiosInstance.post(`/api/agency/user/fixPwd`, data);
}