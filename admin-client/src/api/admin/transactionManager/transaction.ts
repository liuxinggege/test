declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

/*在线充值*/
export function getOnlineCharge(queryItem) {//pageData用
    return axios.get(`/api/admin/financial/billRecords/log`, { params: queryItem });
}
export function getOnlineChargeExcel(queryItem) {//Excel用
    return axios.get(`/api/admin/export/financial/billRecords/logExcel`, { params: queryItem, timeout: 180000 });
}
//在线充值回调函数
export function onlineRechargeCb(parameter) {
    return axios.post(`/api/admin/financial/onlineRechargeCb`, parameter);
}

/**官方兑换 */
export function getOfficialWithdraw(queryItem) {
    return axios.get(`/api/admin/financial/withdraw/log`, { params: queryItem });
}
// export function getOfficialWithdrawExcel(queryItem) {
//     return axios.get(`/api/admin/financial/billRecords/log`, { params: queryItem });
// }

/*转账日志*/
export function getTransferLog(queryItem) {
    return axios.get(`/api/admin/financial/transfer/log`, { params: queryItem });
}
export function getTransferLogExcel(queryItem) {
    return axios.get(`/api/admin/financial/transfer/log`, { params: queryItem });
}
//淘宝支付获取所有订单
export function getTaobaoOrder(parameter) {
    return axios.get(`/api/admin/financial/getTaobaoOrder`, { params: parameter });
}
//淘宝支付创建订单
export function createTaobaoOrder(parameter) {
    return axios.post(`/api/admin/financial/createTaobaoOrder`, parameter);
}
export function deleteTaobaoOrder(parameter) {
    return axios.post(`/api/admin/financial/deleteTaobaoOrder`, parameter);
}
//淘宝支付提交订单
export function taobaoWithdraw(parameter) {
    return axios.post(`/api/admin/financial/taobaoWithdraw`, parameter);
}
//淘宝支付查询订单
export function postTaobaoWithdrawResult(parameter) {
    return axios.post(`/api/admin/financial/postTaobaoWithdrawResult`, parameter);
}

//充值问题
export function getRechargeQuestion(parameter) {
    return axios.get(`/api/admin/financial/getRechargeQuestion`, { params: parameter });
}
export function getRechargeQuestionExcel(parameter) {
    return axios.get(`/api/admin/export/downlodRechargeQuestionToExcel`, { params: parameter });
}
export function editOrderId(parameter) {
    return axios.post(`/api/admin/financial/editOrderId`, parameter);
}
export function replyRechargeQuestion(parameter) {
    return axios.post(`/api/admin/financial/replyQuestion`, parameter);
}

/*cn 2018-12-21 add*/
//购物支付-获取所有订单
export function getBuyOrder(parameter) {
    return axios.get(`/api/admin/financial/getCartOrder`, { params: parameter });
}
//购物支付-创建订单
export function createBuyOrder(parameter) {
    return axios.post(`/api/admin/financial/createCartOrder`, parameter);
}
//购物支付-删除订单
export function deleteBuyOrder(parameter) {
    return axios.post(`/api/admin/financial/deleteCartOrder`, parameter);
}
//购物支付-提交订单
export function buyWithdraw(parameter) {
    return axios.post(`/api/admin/financial/submitCartWithdraw`, parameter);
}
//购物支付-查询订单
export function getBuyWithdrawResult(parameter) {
    return axios.get(`/api/admin/financial/searchCartTransferRet`, { params: parameter });
}

/*cn 2018-12-27 add*/
//代付订单-查询
export function getPayOrder(parameter) {
    return axios.get(`/api/admin/financial/getPayOrder`, { params: parameter });
}
//代付订单-创建
export function createPayOrder(parameter) {
    return axios.post(`/api/admin/financial/createPayOrder`, parameter);
}
//代付订单-配置字段
export function getPayConfig(parameter) {
    return axios.get(`/api/admin/financial/getPayConfig`, { params: parameter });
}
//代付订单-关闭订单
export function closePayOrder(parameter) {
    return axios.post(`/api/admin/financial/closePayOrder`, parameter);
}

export function getRepeat(parameter) {
    return axios.get(`/api/admin/financial/getRepeat`, { params: parameter });
}
export function getRepeatByExcel(parameter) {
    return axios.get(`/api/admin/export/getRepeatByExcel`, { params: parameter, timeout: 180000 });
}
export function updateRepeat(parameter) {
    return axios.post(`/api/admin/financial/updateRepeat`, parameter);
}