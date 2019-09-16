import axios from '../../utils/request'

export function userInfo(data) {
  return axios.get('/api/agent/user/userInfo', { params: data });
}
export function upPoint(data) {
  return axios.post('/api/agent/user/transfer', data)
}
export function getRegistrantInfo() {
  return axios.get('/api/agent/user/registrantInfo')
}

//新版充值
export function newUpPoint(data) {
  return axios.post('/api/agent/user/chatTransfer', data)
} 