import axios from '../../utils/request'

export function transferLog(data) {
  return axios.get('/api/agent/log/transfer', { params: data });
}
export function getTransferMoneyLog(data) {
  return axios.get('/api/agent/user/transferLog', { params: data });
}
export function updateTransferMoneyLog(data) {
  return axios.post('/api/agent/user/UpdateTransfer', data);
}