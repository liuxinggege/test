import { axiosInstance } from '../../../utils/request';



export function getWelfare(data) {
    return axiosInstance.get(`/api/agency/getWelfare`, { params: data });
}
export function receiveWelfare(data) {
    return axiosInstance.post(`/api/agency/receiveWelfare`, data);
}
