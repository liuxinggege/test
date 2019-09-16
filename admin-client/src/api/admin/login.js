import axios from '../../utils/request'

export function loginByUsername(username, password,code) {
  const data = {
    name: username,
    pwd: password,
    code:code
  }
  return axios.post(`/api/admin/user/login`, data);
}

export function logout() {
  return axios.post(`/api/admin/user/logout`);
}




export function getUserInfo(token) {
  return axios({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}  