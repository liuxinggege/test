import axios from '../../utils/request'

export function moneyTotal(data) {
  return axios.get('/api/agent/log/total', { params: data });
}