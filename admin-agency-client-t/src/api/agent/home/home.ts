import { axiosInstance } from '../../../utils/request';

export function getHomeData() {
    return axiosInstance.get(`/api/agency/home`);
}
export function getAnnouncementNotRead() {
    return axiosInstance.get(`/api/agency/getAnnouncementNotRead`);
}
export function setChangeChannelFlagFlase() {
    return axiosInstance.post(`/api/agency/setChangeChannelFlagFlase`);
}

//-----邮件-----
//查询列表
export function getAgencyMailList(data) {
    return axiosInstance.get(`/api/agency/getAgencyMailList`, { params: data });
}
//查询详情
export function readAgencyMail(data) {
    return axiosInstance.post(`/api/agency/readAgencyMail`, data);
}

//发放奖金池通知
export function fundFlagFalse() {
    return axiosInstance.post(`/api/agency/fundFlagFalse`);
}
