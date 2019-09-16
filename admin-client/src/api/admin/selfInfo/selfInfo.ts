declare var require: any
import axios from '../../../utils/request'


/** 提交密码 */
export function submitPwd(data) {
    return axios.post(`/api/admin/user/changePwd`, data);
}