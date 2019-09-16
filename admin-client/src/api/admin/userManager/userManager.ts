declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'

/**用户详情 */
export function getAttribution(uid) {
    return axios.get(`/api/admin/userMgr/attribution/${uid}`);
}
/* 将金币转入银行 */
export function toBank(data) {
    return axios.get(`/api/admin/userMgr/toBank`, { params: data });
}
/* 将金币转到身上 */
export function toPeople(data) {
    return axios.get(`/api/admin/userMgr/toPeople`, { params: data });
}
/* 普通用户信息 */
export function changeChannel(data) {
    return axios.post(`/api/admin/userMgr/changeChannel`, data);
}
/* 普通用户信息 */
export function getGeneralUser(queryItem) {
    return axios.get(`/api/admin/userMgr/ordUserData`, { params: queryItem });
}
export function waterLineUserData(queryItem) {
    return axios.get(`/api/admin/userMgr/waterLineUserData`, { params: queryItem });
}
export function downloadGeneralUserExcel(queryItem) {//Excel用
    return axios.get(`/api/admin/export/userMgr/downloadGeneralUserExcel`, { params: queryItem, timeout: 60000 });
}
export function getGeneralUserByCreateIP(queryItem) {
    return axios.get(`/api/admin/userMgr/createIP`, { params: queryItem });
}
export function downloadGeneralUserExcelByIP(queryItem) {//Excel用
    return axios.get(`/api/admin/export/userMgr/downloadGeneralUserExcelByIP`, { params: queryItem, timeout: 60000 });
}
/* 添加用户信息 */
export function addGeneralUser(queryItem) {
    return axios.post(`/api/admin/userMgr/addUserData`, queryItem);
}
export function downloadUserCreateExcel(queryItem) {//Excel用
    return axios.get(`/api/admin/export/userMgr/downloadUserCreateExcel`, { params: queryItem, timeout: 60000 });
}
export function getUserCreateRecord(queryItem) {
    return axios.get(`/api/admin/userMgr/getUserCreateRecord`, { params: queryItem });
}
/* 普通用户登陆权限 */
export function loginForbidden(updateData) {
    return axios.post(`/api/admin/userMgr/user/loginForbidden`, updateData);
}
/* 普通用兑换权限 */
export function userWithdrawForbidden(updateData) {
    return axios.post(`/api/admin/userMgr/user/userWithdrawForbidden`, updateData);
}
/* 普通用充值权限 */
export function userChargeForbidden(updateData) {
    return axios.post(`/api/admin/userMgr/user/userChargeForbidden`, updateData);
}
export function userVipRechargeForbidden(updateData) {
    return axios.post(`/api/admin/userMgr/user/userVipRechargeForbidden`, updateData);
}
/* 踢出玩家 */
export function forceKickUser(uid) {
    return axios.post(`/api/admin/userMgr/user/forceKickUser`, { uid: uid });
}
/* 删除玩家 */
export function delUser(uid) {
    console.log("删除玩家", uid)
    return axios.post(`/api/admin/userMgr/user/delUser`, { uid: uid });
}
/**师徒信息 */
export function getMasterApprentice(queryItem) {
    return axios.get(`/api/admin/userMgr/masterApprentice/apprentices`, { params: queryItem });
}
/**修改用户信息 */
export function updateUserInfo(updateData) {
    return axios.post(`/api/admin/userMgr/users`, updateData);
}
/**修改用户个人水位线 */
export function updateUserPersonWaterLine(updateData) {
    return axios.post(`/api/admin/userMgr/personWaterLine`, updateData);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**转账 */
export function transfer(updateData) {
    return axios.post(`/api/admin/userMgr/transfer`, updateData);
}
/**追分 */
export function recoverySection(updateData) {
    return axios.post(`/api/admin/userMgr/recoverySection`, updateData);
}
/**上分 */
export function recharge(updateData) {
    return axios.post(`/api/admin/userMgr/recharge`, updateData);
}
/**下分 */
export function withdraw(updateData) {
    return axios.post(`/api/admin/userMgr/withdraw`, updateData);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**账单 */
export function getBillRecords(queryItem) {
    return axios.get(`/api/admin/userMgr/billRecords/log/${queryItem.uid}`, { params: queryItem });
}
/**流水 */
export function getMoneyChange(queryItem) {//pageData用
    return axios.get(`/api/admin/userMgr/moneyChange/${queryItem.uid}`, { params: queryItem });
}
/**流水 */
export function getMoneyChangeExcel(queryItem) {//Excel用
    return axios.get(`/api/admin/export/userMgr/moneyChangeExcel/${queryItem.uid}`, { params: queryItem, timeout: 60000 });
}

/**商人信息 */
export function getBusinessInfo(queryItem) {
    return axios.get(`/api/admin/userMgr/businessInfo`, { params: queryItem });
}
/**修改商人信息 */
export function updateBusinessInfo(updateData) {
    return axios.post(`/api/admin/userMgr/user/vip/info`, updateData);
}
/**添加商人 */
export function addBusinessInfo(updateData) {
    return axios.post(`/api/admin/userMgr/user/vip`, updateData);
}

//获取权重
export function getWeightByUid(data) {
    return axios.get(`/api/admin/userMgr/user/agentState/getAgentState`, { params: data });
}
//修改权重
export function setWeightByUid(updateData) {
    return axios.post(`/api/admin/userMgr/user/agentState/setWeightByUid`, updateData);
}
//修改是否接单
export function setBDisableByUid(updateData) {
    return axios.post(`/api/admin/userMgr/user/agentState/setBDisableByUid`, updateData);
}
//修改是否接单
export function setCloseTodayOrderTimes(updateData) {
    return axios.post(`/api/admin/userMgr/user/agentState/setCloseTodayOrderTimes`, updateData);
}

/**获取当前登陆的聚商 下的商人 */
export function getJsBusinessInfo(queryItem) {
    return axios.get(`/api/admin/userMgr/GatherInfo`, { params: queryItem });
}
/**设置商人登录ip */
export function updateBusinessIps(updateData) {
    return axios.post(`/api/admin/userMgr/user/vip/ips`, updateData);
}
/**修改商人手机号 */
export function fixBusinessPhone(updateData) {
    return axios.post(`/api/admin/userMgr/user/vip/fixBusinessPhone`, updateData);
}
///////////////////////////////////////////////////////在线列表///////////////////////////////////////////////////////////////
/**在线列表 */
export function getOnlineUser(queryItem) {
    return axios.get(`/api/admin/user/getOnlineUser`, { params: queryItem });
}
/**导出在线列表 */
export function downloadOnlineUser(queryItem) {
    return axios.get(`/api/admin/export/downloadOnlineUserExcel`, { params: queryItem });
}
/**踢人 */
export function kickUser(queryItem) {
    return axios.get(`/api/admin/userMgr/user/kickUser`, { params: queryItem });
}
////////////////////////////////////////////////用户封号//////////////////////////////////////////////////////////////////////
/**获得用户封号log */
export function getUserForbiddenLog(updateData) {
    return axios.get(`/api/admin/userMgr/userForbidden`, { params: updateData });
}
export function getSystemUserForbiddenLog(updateData) {
    return axios.get(`/api/admin/userMgr/systemUsersForbidden`, { params: updateData });
}
export function forbiddenUser(updateData) {
    return axios.post(`/api/admin/userMgr/userForbidden`, updateData);
}
export function forbiddenUsers(updateData) {
    return axios.post(`/api/admin/userMgr/usersForbidden`, updateData);
}
export function downloadUserForbiddenExcel(updateData) {
    return axios.get(`/api/admin/export/userMgr/downloadUserForbiddenExcel`, { params: updateData, timeout: 60000 });
}
export function downloadSystemUserForbiddenExcel(updateData) {
    return axios.get(`/api/admin/export/userMgr/downloadSystemUserForbiddenExcel`, { params: updateData, timeout: 60000 });
}
// 商人信息
export function getAgentStat(data) {
    return axios.get(`/api/admin/userMgr/adminBusiness/agentStat`, { params: data });
}
// 导出商人信息
export function getAgentStatExcel(data) {
    return axios.get(`/api/admin/export/userMgr/agentStatExcel`, { params: data });
}