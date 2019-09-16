declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

/** vip推送通知接口 */
export function getVIPNotityPush(data) {
    return axios.post(`/api/admin/vip/notify/vipNotityPush`, data)
}
/** 获取通知配置： */
export function getConfig() {
    return axios.get(`/api/admin/vip/notify/config`)
}
/** 修改通知配置 */
export function updateConfig(data) {
    return axios.post(`/api/admin/vip/notify/updateConfig`, data)
}
/** Vip日志查询接口 */
export function getVipLogMsg(data) {
    return axios.get(`/api/admin/vip/vipLog/getVipLogMsg`, {
        params: data
    })
}
/** VipExcel导出接口 */
export function exportVipLogExcel(data) {
    return axios.get(`/api/admin/vip/vipLog/exportVipLogExcel`, {
        params: data
    })
}
/** 客服配置 */
/** 客服配置查询接口 */
export function getCusSer(data) {
    return axios.get(`/api/admin/vip/vipKF/getCusSer`, {
        params: data
    })
}
/** 客服配置导出Excel接口 */
export function exportCusSerCfgsExcel(data) {
    return axios.get(`/api/admin/vip/vipKF/exportCusSerCfgsExcel`, {
        params: data
    })
}
/** 客服配置批量添加接口 */
export function addServiceWx(data) {
    return axios.get(`/api/admin/vip/vipKF/addServiceWx`, {
        params: data
    })
}
/** 修改state接口 */
export function updateWxState(data) {
    return axios.get(`/api/admin/vip/vipKF/updateWxState`, {
        params: data
    })
}
/** 客服配置删除客服微信号接口 */
export function deleteServiceWx(data) {
    return axios.delete(`/api/admin/vip/deleteServiceWx`, {
        params: data
    })
}
/** 客服配置更改平台接口 */
export function updateServicePid(data) {
    return axios.post(`api/admin/vip/updateServicePid`, data)
}
/** Vip配置 */
/** Vip配置刷新接口 */
export function getVipCfg() {
    return axios.get(`/api/admin/vip/vipCfg/getVipCfg`)
}
/** Vip配置添加接口 */
export function addOneVipCfg(data) {
    return axios.post(`/api/admin/vip/vipCfg/addOneVipCfg`, data)
}
/** Vip配置编辑接口 */
export function updateVipCfg(data) {
    return axios.post(`/api/admin/vip/vipCfg/updateVipCfg`, data)
}
/** Vip配置删除接口 */
export function deleteVipCfgByid(data) {
    return axios.get(`/api/admin/vip/vipCfg/deleteVipCfgByid`, {
        params: data
    })
}
/** 修改客服名称 */
export function updateKFName(data) {
    return axios.get(`/api/admin/vip/vipKF/updateKFName`, {
        params: data
    })
}
/** 回归列表 */
/** 回归列表搜索接口 */
export function vipReturnList(data) {
    return axios.get(`/api/admin/vip/vipReturnList`, {
        params: data
    })
}
/** 信息库 */
/** 信息库搜索接口 */
export function vipList(data) {
    return axios.get(`/api/admin/vip/vipList`, {
        params: data
    })
}
/** 信息库获取vip用户详细信息接口 */
export function vipDetail(data) {
    return axios.get(`/api/admin/vip/vipDetail`, {
        params: data
    })
} /**  客服微信serviceWx */ /**  用户手机号phone */ /**  年龄age */ /** 信息库修改vip用户信息ALL接口 */ /**  职业occupation */ /**  城市city */ /**  用户描述desc */ /**  微信备注wxRemark */
/**  生日birthday */ /**  微信wx */ export function changeVipAll(data, name) {
    return axios.post(`/api/admin/vip/update/` + name, data)
}
/** 信息库维护日志接口 */
export function getVipLogByUid(data) {
    return axios.get(`/api/admin/vip/vipLog/getVipLogByUid`, {
        params: data
    })
}
/** 信息库维护编辑日志接口 */
export function updateVipLog(data) {
    return axios.post(`/api/admin/vip/vipLog/updateVipLog`, data)
}
/** 信息库维护添加日志接口 */
export function addVipLog(data) {
    return axios.post(`/api/admin/vip/vipLog/addVipLog`, data)
}
/** 信息库导出Vip用户接口 */
export function exportVipList(data) {
    return axios.get(`/api/admin/vip/exportVipList`, {
        params: data
    })
}
/** 信息库新增Vip用户接口 */
export function addVipUser(data) {
    return axios.get(`/api/admin/vip/addVipUser`, {
        params: data
    })
}
/** vip系统配置 */
/** vip系统获取值接口 */
export function getTaxLine() {
    return axios.get(`/api/admin/vip/getTaxLine`)
}
/** vip系统获取值接口 */
export function updateTaxLine(data) {
    return axios.post(`/api/admin/vip/updateTaxLine`, data)
}
/** vip系统获取客服微信号接口 */
export function getServiceWxLine() {
    return axios.get(`/api/admin/vip/getServiceWxLine`)
}
/** vip系统修改客服微信号接口 */
export function updateServiceWxLine(data) {
    return axios.post(`/api/admin/vip/updateServiceWxLine`, data)
}
/** vip系统修改客服微信分配玩家数量接口 */
export function updateVipCountPerService(data) {
    return axios.post(`api/admin/vip/updateVipCountPerService`, data)
}
/** vip系统获取客服微信分配玩家数量接口 */
export function getVipCountPerService() {
    return axios.get(`api/admin/vip/getVipCountPerService`)
}
/** vip礼包统计接口 */
export function getVipPrivilegeListCount(data) {
    return axios.get(`api/admin/vip/VipPrivilegeListCount`, { params: data});
}