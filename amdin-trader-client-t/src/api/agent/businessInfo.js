import axios from '../../utils/request'

export function getUpdateCode(data) {
  return axios.post('/api/agent/user/getSMSCodeAtUpdate', data);
}
export function updateAct(data) {
  return axios.post('/api/agent/user/updateAct',data)
} 