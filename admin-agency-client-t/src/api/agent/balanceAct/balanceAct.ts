import { axiosInstance } from "../../../utils/request";




export function confirmAli(data) {
    return axiosInstance.post(`/api/agency/user/bindAliPayAct`, data);
}

export function confirmBankCard(data) {
    return axiosInstance.post(`/api/agency/user/bindBankCardAct`, data);
}

export function getUserInfo() {
    return axiosInstance.get(`/api/agency/user/currLoginUserInfo`)
}
//获取师徒结算
export function masterIncomeSettle() {
    return axiosInstance.post(`/api/agency/master`)
}