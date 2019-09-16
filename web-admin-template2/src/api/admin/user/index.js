import axios from '../../../utils/request';
//登录 put /api/login      userid  password
export function login(userid,password) {
  const data = {
    userid,
    password
  }
  return axios.put(`/api/login`, data);
}
//注册 userid    username   password
export function reg(userid, username, password) {
  const data = {
    userid,
    username,
    password
  }
  return axios.put(`/api/addAccount`, data);
}

