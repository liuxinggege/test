import axios from '../../utils/request'

export function upPointLog(data) {
  return axios.get('/api/agent/log/transfer', { params: data });
}