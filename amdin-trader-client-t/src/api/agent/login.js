import axios from '../../utils/request'
import { PID } from '../../const/status';

export function loginByUsername(username, password,code) {
  const data = {
    name: username,
    pwd: password,
    code:code,
    pid : PID,
  }
  return axios.post(`/api/agent/user/login`, data);
}

export function loginOut() {
  return axios.post(`/api/agent/user/logOut`);
}

export function getCode(username) {
  const data ={
    name:username,
    pid:PID,
  }
  return axios.post(`/api/agent/user/getSMSCode`,data);
}

export function getUpdateCode() {
  return axios.post(`/api/agent/user/getSMSCodeAtUpdate`);
}

export function updateAct() {
  return axios.post(`/api/agent/user/updateAct`);
}
// export function getUserInfo(token) {
//   return axios({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }  