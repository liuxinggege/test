import { axiosInstance } from '../../../utils/request';



export function getTempletData(data) {
    return axiosInstance.post(`/api/agency/qrTemplate`, data);
}