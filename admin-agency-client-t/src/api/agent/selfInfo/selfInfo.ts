import { axiosInstance } from '../../../utils/request';
import { PID } from '../../../const/status';


/** 修改信息 */
export function updateSelfChat(data) {
    return axiosInstance.post(`/api/agency/user/updateSelfChat`, data);
}
export function updateSelfPhone(data) {
    return axiosInstance.post(`/api/agency/user/updateSelfPhone`, data);
}
export function bindPhone(data) {
    return axiosInstance.post(`/api/agency/user/bindPhone`, data);
}
export function updateSelfLoginPwd(data) {
    return axiosInstance.post(`/api/agency/user/updateSelfLoginPwd`, data);
}
export function updateSelfSettlePwd(data) {
    return axiosInstance.post(`/api/agency/user/updateSelfSettlePwd`, data);
}
export function fixPwdByPhone(data) {
    data.pid = PID;
    return axiosInstance.post(`/api/agency/user/fixPwdByPhone`, data);
}
export function getParentInfo(data) {
    return axiosInstance.get(`/api/agency/user/getParentInfo`, { params: data });
}
export function getUserInfo() {
    return axiosInstance.get(`/api/agency/user/currLoginUserInfo`)
}

export function getSelfPhoneReg(data) {
    return axiosInstance.get(`/api/agency/user/getSelfPhoneReg`, { params: data });
}
export function getOldPhoneReg(data) {
    data.pid = PID;
    return axiosInstance.get(`/api/agency/user/getOldPhoneReg`, { params: data });
}
export function getNewPhoneReg(data) {
    data.pid = PID;
    return axiosInstance.get(`/api/agency/user/getNewPhoneReg`, { params: data });
}
export function getSettlementReg(data) {
    return axiosInstance.get(`/api/agency/user/getSettlementReg`, { params: data });
}
export function getFixPwdReg(data) {
    data.pid = PID;
    return axiosInstance.get(`/api/agency/user/getFixPwdReg`, { params: data });
}