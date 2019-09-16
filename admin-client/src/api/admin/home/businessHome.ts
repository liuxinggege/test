declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

/*登录日志*/
export function getJuBusinessInfo() {
    return axios.get(`/api/admin/userMgr/gather/vip`);
}

