declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

/*登录日志*/
export function getTodaySum(data) {
    return axios.get(`/api/admin/home/adminHome/todaySum`, { params: data });
}
export function getTotalSum(data) {
    return axios.get(`/api/admin/home/adminHome/totalSum`, { params: data });
}
export function getTodayWinAndLoseHistory(data) {
    return axios.get(`/api/admin/home/adminHome/todayWinAndLoseHistory`, { params: data });
}
export function getOnlineInfo(data) {
    return axios.get(`/api/admin/home/adminHome/onlineTable`, { params: data });
}
export function getTodayAndYestRealOnline(data) {
    return axios.get(`/api/admin/home/adminHome/todayAndYestRealOnline`, { params: data });
}
export function getPTodaySum(data) {
    return axios.get(`/api/admin/home/adminHome/ptodaySum`, { params: data });
}
export function getPOnlineInfo(data) {
    return axios.get(`/api/admin/home/adminHome/ponlineTable`, { params: data });
}
export function getPTodayAndYestRealOnline(data) {
    return axios.get(`/api/admin/home/adminHome/ptodayAndYestRealOnline`, { params: data });
}
