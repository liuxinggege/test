import { axiosInstance } from '../../utils/request';
import { PID } from '../../const/status';

export function loginByUsername(username, password) {
  const data = {
    name: username,
    pwd: password,
    pid:PID,
  }
  return axiosInstance.post(`/api/agency/user/login`, data);
}

export function logout() {
  return axiosInstance.post(`/api/agency/user/logout`);
}

export function getUserInfo(token: string) {
  axiosInstance.get("/user/info", { params: { token } });
}  