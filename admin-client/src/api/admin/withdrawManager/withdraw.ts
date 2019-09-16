declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

/*代理兑换明细*/
export function getAgentWithdrawInfo(queryItem) {
    queryItem.type = 3;
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}
/** 代理回收总览 */
export function getAgentOverview(queryItem) {
    queryItem.type = 3;
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}
/** 代理兑换审核表 */
export function getAgentException(queryItem) {
    queryItem.type = 3;
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}
/** 代理明细 */
export function getAgentDetail(queryItem) {
    queryItem.type = 3;
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}




/** 兑换审核 */
export function getWithdrawReviewList(queryItem) {
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}

/** 兑换导出 */
export function exportWithdrawOrders(queryItem) {
    return axios.get(`/api/admin/export/withdraw/exportOrders`, { params: queryItem, timeout: 180000 });
}
/** 兑换导出 */
export function exportBillOrderList(queryItem) {
    return axios.get(`/api/admin/export/withdraw/exportBillOrders`, { params: queryItem, timeout: 180000 });
}

export function upadteOrders(queryItem) {
    return axios.post('/api/admin/withdraw/updateOrders', queryItem);
}
export function reFundOrder(queryItem) {
    return axios.post('/api/admin/withdraw/refundOrder', queryItem);
}
export function closeOrder(queryItem) {
    return axios.post('/api/admin/withdraw/closeOrder', queryItem);
}
/** 兑换列表 */
export function getWithdrawList(queryItem) {
    return axios.get(`/api/admin/withdraw/orders`, { params: queryItem });
}

/** 兑换列表 */
export function getMerchantOrders(queryItem) {
    return axios.get(`/api/admin/withdraw/getMerOrder`, { params: queryItem });
}
