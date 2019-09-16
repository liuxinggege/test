import axios from '../../../utils/request'
// import axios from 'axios'

/* 首页 */
export function getChannelInfo(data) {
    return axios.get(`/api/admin/statSummary/channelDetail`, { params: data });
}
export function getChannelInfoExcel(data) {
    return axios.get(`/api/admin/export/getChannelInfoExcel`, { params: data, timeout: 60000 });
}
export function channelStatExcel(data) {
    return axios.get(`/api/admin/export/channelStatExcel`, { params: data });
}
export function getChannelStat(data) {
    return axios.get(`/api/admin/statSummary/channelDetailStat`, { params: data });
}

