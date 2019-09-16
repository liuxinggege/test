declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'


//-------文件服务---------
// 获取oss配置
export function getOssToken(data) {
    return axios.post(`/api/admin/ossToken`,data);
}