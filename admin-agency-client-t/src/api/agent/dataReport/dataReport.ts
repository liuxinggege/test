import { axiosInstance } from '../../../utils/request';

export function getDataReport(data) {
    return axiosInstance.get(`/api/agency/getDateInfo`, { params: data });
}
export function getChildInfo(data) {
    return axiosInstance.get(`/api/agency/getChildInfo`, { params: data });
}
export function getIncomeDetail(data) {
    return axiosInstance.get(`/api/agency/getIncomeDetail`, { params: data });
}
export function getAgencyOrder(data) {
    return axiosInstance.get(`/api/agency/getAgencyOrder`, { params: data });
}
export function downloadChildInfoExcel(data) {
    return axiosInstance.get(`/api/export/agency/downloadChildInfoExcel`, { params: data,timeout:180000 });
}