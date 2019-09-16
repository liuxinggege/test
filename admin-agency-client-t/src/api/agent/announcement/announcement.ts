import { axiosInstance } from '../../../utils/request';



export function getAnnouncementList(data) {
    return axiosInstance.get(`/api/agency/getAnnouncementList`,{params:data});
}
export function readAgencyBillboard(data) {
    return axiosInstance.get(`/api/agency/readAgencyBillboard`,{params:data});
}