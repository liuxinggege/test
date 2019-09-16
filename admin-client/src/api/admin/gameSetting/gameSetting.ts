declare var require: any
import axios from '../../../utils/request';
// import axios from 'axios'

/* 举报配置 */
export function getReport() {
    return axios.get(`/api/admin/gameSetting/report`);
}
export function updateReport(updateData) {
    return axios.post(`/api/admin/gameSetting/report`, updateData);
}

/* 游戏设置 */
export function getSmsValidate() {
    return axios.get(`/api/admin/gameSetting/smsValidate`);
}
export function updateSmsValidate(updateData) {
    return axios.put(`/api/admin/gameSetting/smsValidate`, updateData);
}

export function getRegister() {
    return axios.get(`/api/admin/gameSetting/register`);
}
export function updateRegister(updateData) {
    return axios.put(`/api/admin/gameSetting/register`, updateData);
}

export function getRobot() {
    return axios.get(`/api/admin/gameSetting/robot`);
}
export function updateRobot(updateData) {
    return axios.put(`/api/admin/gameSetting/robot`, updateData);
}

export function getRechargeCfg() {
    return axios.get(`/api/admin/gameSetting/rechargeCfg`);
}
export function getRechargeAndWithdrawItem(data) {
    return axios.get(`/api/admin/gameSetting/getRechargeAndWithdrawItem`, { params: data });
}
export function getAllRechargeChannel(data) {
    return axios.get(`/api/admin/gameSetting/getAllRechargeChannel`, { params: data });
}
export function updateRechargeCfg(updateData) {
    return axios.put(`/api/admin/gameSetting/rechargeCfg`, updateData);
}
export function addAliFixed(updateData) {
    return axios.post(`/api/admin/gameSetting/addAliFixed`, updateData);
}

export function getLocationRWRule() {
    return axios.get(`/api/admin/gameSetting/locationRWRule`);
}
export function updateLocationRWRule(updateData) {
    return axios.put(`/api/admin/gameSetting/locationRWRule`, updateData);
}
export function addLocationRWRule(updateData) {
    return axios.post(`/api/admin/gameSetting/locationRWRule`, updateData);
}
export function deleteLocationRWRule(updateData) {
    return axios.delete(`/api/admin/gameSetting/locationRWRule`, { data: updateData });
}
export function getWithdrawCfg() {
    return axios.get(`/api/admin/gameSetting/withdrawCfg`);
}
export function updateWithdrawCfg(updateData) {
    return axios.put(`/api/admin/gameSetting/withdrawCfg`, updateData);
}
export function getPersonWaterCfg() {
    return axios.get(`/api/admin/gameSetting/personWaterCfg`);
}
export function updatePersonWaterCfg(updateData) {
    return axios.put(`/api/admin/gameSetting/personWaterCfg`, updateData);
}
export function deletePersonWaterCfg(id) {
    return axios.delete(`/api/admin/gameSetting/personWaterCfg`, { data: { _id: id } });
}
export function createPersonWaterCfg(data) {
    return axios.post(`/api/admin/gameSetting/personWaterCfg`, data);
}
export function getNewBieBonus() {
    return axios.get(`/api/admin/gameSetting/newBieBonus`);
}
export function updateNewBieBonus(updateData) {
    return axios.put(`/api/admin/gameSetting/newBieBonus`, updateData);
}
export function getBindBonus() {
    return axios.get(`/api/admin/gameSetting/bindBonus`);
}
export function updateBindBonus(updateData) {
    return axios.post(`/api/admin/gameSetting/bindBonus`, updateData);
}
export function getDictionary() {
    return axios.get(`/api/admin/magEdit/dictionary`);
}
export function updateDictionary(updateData) {
    return axios.put(`/api/admin/magEdit/dictionary`, updateData);
}
export function getSubGlobalConfig() {
    return axios.get(`/api/admin/gameSetting/globalConfig`);
}
export function updateSubGlobalConfig(updateData) {
    return axios.put(`/api/admin/gameSetting/globalConfig`, updateData);
}
export function getSubGameSwitch(data) {
    return axios.get(`/api/admin/gameSetting/gameSwitch`, { params: data });
}
export function updateSubGameSwitch(updateData) {
    return axios.put(`/api/admin/gameSetting/gameSwitch`, updateData);
}

/** 黑名单 */
export function getBlackList(data) {
    return axios.get(`/api/admin/gameSetting/blackList/get`, { params: data });
}
export function addBlackList(data) {
    return axios.post(`/api/admin/gameSetting/blackList/add`, data);
}
export function delBlackList(id) {
    return axios.post(`/api/admin/gameSetting/blackList/del`, id);
}

/** 白名单 */
export function getSubWhiteList() {
    return axios.get(`/api/admin/gameSetting/whiteList`);
}
export function updateSubWhiteList(updateData) {
    return axios.post(`/api/admin/gameSetting/whiteList`, updateData);
}

export function getFakeLocation(updateData) {
    return axios.post(`/api/admin/gameSetting/getFakeLocation`, updateData);
}
export function insertFakeLocation(updateData) {
    return axios.post(`/api/admin/gameSetting/insertFakeLocation`, updateData);
}
export function fixFakeLocation(updateData) {
    return axios.put(`/api/admin/gameSetting/fakeLocation`, updateData);
}
export function deletFakeLocation(updateData) {
    return axios.delete(`/api/admin/gameSetting/fakeLocation`, { data: updateData });
}
/** 聚商配置*/
export function getJushangConfig() {
    return axios.get(`/api/admin/gameSetting/jushangConfig`);
}
export function insertJushangConfig(updateData) {
    return axios.put(`/api/admin/gameSetting/jushangConfig`, updateData);
}
export function fixJushangConfig(updateData) {
    return axios.post(`/api/admin/gameSetting/jushangConfig`, updateData);
}
export function deletJushangConfig(updateData) {
    return axios.delete(`/api/admin/gameSetting/jushangConfig`, { data: updateData });
}
/** IAP*/
export function getIap(updateData) {
    return axios.post(`/api/admin/gameSetting/getIap`, updateData);
}
export function insertIap(updateData) {
    return axios.post(`/api/admin/gameSetting/insertIap`, updateData);
}
export function fixIap(updateData) {
    return axios.put(`/api/admin/gameSetting/iap`, updateData);
}
export function deletIap(updateData) {
    return axios.delete(`/api/admin/gameSetting/iap`, { data: updateData });
}
/*允许登陆IP*/
export function getAllowLoginIP() {
    return axios.get(`/api/admin/gameSetting/allowLoginIP`);
}
export function updateAllowLoginIP(updateData) {
    return axios.post(`/api/admin/gameSetting/allowLoginIP`, updateData);
}
export function getStopServer() {
    return axios.get(`/api/admin/gameSetting/stopServer`);
}
/*跑马灯*/
export function getPid() {
    return axios.get(`/api/admin/magEdit/pid`);
}

//大厅公告管理
export function addgetAdvertisement(data) {
    return axios.post(`/api/admin/magEdit/advertisement/add`, data);
}
export function delgetAdvertisement(id) {
    return axios.post(`/api/admin/magEdit/advertisement/del`, id);
}
export function updategetAdvertisement(updateData) {
    return axios.post(`/api/admin/magEdit/advertisement/update`, updateData);
}
export function getgetAdvertisement(pid) {
    return axios.get(`/api/admin/magEdit/advertisement/get`, { params: pid });;
}


//全服公告
export function addFullServerMarquee(data) {
    return axios.post(`/api/admin/magEdit/marquee/add`, data);
}
export function delFullServerMarquee(id) {
    return axios.post(`/api/admin/magEdit/marquee/del`, id);
}
export function updateFullServerMarquee(updateData) {
    return axios.post(`/api/admin/magEdit/marquee/update`, updateData);
}
export function getFullServerMarquee() {
    return axios.get(`/api/admin/magEdit/marquee/get`);
}

/*编辑公告*/
export function getBillboard(pid) {
    return axios.get(`/api/admin/magEdit/billboard/get`, { params: pid });
}
export function updateBillboard(updateData) {
    return axios.post(`/api/admin/magEdit/billboard/update`, updateData);
}
export function delBillboard(id) {
    return axios.post(`/api/admin/magEdit/billboard/del`, id);
}
export function addBillboard(data) {
    return axios.post(`/api/admin/magEdit/billboard/add`, data);
}

/*编辑FAQ*/
export function getFaq() {
    return axios.get(`/api/admin/magEdit/faq`);
}
export function updateFaq(updateData) {
    return axios.post(`/api/admin/magEdit/faq`, updateData);
}
/*邮件*/
export function sendMail(sendData) {
    return axios.post(`/api/admin/magEdit/mail`, sendData);
}
/*获取邮件*/
export function getQuestion(queryItem) {
    return axios.get(`/api/admin/magEdit/getQuestion`, { params: queryItem });
}
/*获取邮件*/
export function getQuestionExcel(queryItem) {
    return axios.get(`/api/admin/export/magEdit/getQuestionExcel`, { params: queryItem, timeout: 120000 });
}
/*获取已发送邮件*/
export function getBeenSentMail(queryItem) {
    return axios.get(`/api/admin/magEdit/selfMail`, { params: queryItem });
}
/*回复*/
export function replyQuestion(updateData) {
    return axios.post(`/api/admin/magEdit/updateQuestion`, updateData);
}
/*编辑邮件内容*/
export function editQuestion(updateData) {
    return axios.post(`/api/admin/magEdit/editQuestion`, updateData);
}
/*获取邮件模版*/
export function getMailTemplate(cond) {
    return axios.get(`/api/admin/magEdit/getMailTemplate`, { params: cond });
}
/*删除邮件模版*/
export function delMailTemplate(data) {
    return axios.post(`/api/admin/magEdit/delMailTemplate`, data);
}
/*编辑邮件模版*/
export function updateMailTemplate(data) {
    return axios.post(`/api/admin/magEdit/updateMailTemplate`, data);
}
/*添加邮件模版*/
export function addMailTemplate(data) {
    return axios.post(`/api/admin/magEdit/addMailTemplate`, data);
}

// 全民代理配置
export function getChannelBusiness(updateData) {
    return axios.get(`/api/admin/gameSetting/channelBusiness/channelBusiness`, { params: updateData });
}
export function insertChannelBusiness(updateData) {
    return axios.post(`/api/admin/gameSetting/channelBusiness/create`, updateData);
}
export function fixChannelBusiness(updateData) {
    return axios.post(`/api/admin/gameSetting/channelBusiness/update`, updateData);
}
export function deletChannelBusiness(updateData) {
    return axios.post(`/api/admin/gameSetting/channelBusiness/delete`, updateData);
}

//ipTable配置
export function getIpTable() {
    return axios.get(`/api/admin/gameSetting/ipTable/list`);
}
export function insertIpTable(updateData) {
    return axios.post(`/api/admin/gameSetting/ipTable/insert`, updateData)
}
export function updateIpTable(updateData) {
    return axios.post(`/api/admin/gameSetting/ipTable/update`, updateData)
}
export function deleteIpTable(updateData) {
    return axios.post(`/api/admin/gameSetting/ipTable/delete`, updateData)
}

//充值配置
export function getRechargeLimitCfg(parameter) {
    return axios.get(`/api/admin/gameSetting/rechargeLimitCfg`, { params: parameter });
}
export function postRechargeLimitCfg(parameter) {
    return axios.post(`/api/admin/gameSetting/rechargeLimitCfg`, parameter);
}
export function addRechargeLimitCfg(parameter) {
    return axios.post(`/api/admin/gameSetting/addRechargeLimitCfg`, parameter);
}

//商人配置
export function getChatConfig() {
    return axios.get(`/api/admin/gameSetting/chatConfig`);
}
export function postChatConfig(parameter) {
    return axios.post(`/api/admin/gameSetting/chatConfig`, parameter);
}

//新充值配置
export function getPayTypeInfo(data) {
    return axios.get(`/api/admin/gameSetting/payTypeInfo/get`, { params: data });
}
export function addPayTypeInfo(data) {
    return axios.post(`/api/admin/gameSetting/payTypeInfo/add`, data);
}
export function delPayTypeInfo(data) {
    return axios.post(`/api/admin/gameSetting/payTypeInfo/del`, data);
}
export function updatePayTypeInfo(data) {
    return axios.post(`/api/admin/gameSetting/payTypeInfo/update`, data);
}

export function getPayType(data) {
    return axios.get(`/api/admin/gameSetting/payType/get`, { params: data });
}
export function addPayType(data) {
    return axios.post(`/api/admin/gameSetting/payType/add`, data);
}
export function editPayType(data) {
    return axios.post(`/api/admin/gameSetting/payType/update`, data);
}
export function delPayType(data) {
    return axios.post(`/api/admin/gameSetting/payType/del`, data);
}
// uuid白名单
export function getUuidWhiteList(data) {
    return axios.get(`/api/admin/gameSetting/uuidWhiteList/get`, { params: data });
}
export function addUuidWhiteList(data) {
    return axios.post(`/api/admin/gameSetting/uuidWhiteList/add`, data);
}
export function delUuidWhiteList(data) {
    return axios.post(`/api/admin/gameSetting/uuidWhiteList/del`, data);
}
// export function updateUuidWhiteList(data) {
//     return axios.post(`/api/admin/gameSetting/uuidWhiteList/update`, data);
// }
// 登录错误提示
export function getCustomerInfo(data) {
    return axios.get(`/api/admin/gameSetting/homePage/get`, { params: data });
}
export function addCustomerInfo(data) {
    return axios.post(`/api/admin/gameSetting/homePage/add`, data);
}
export function delCustomerInfo(data) {
    return axios.post(`/api/admin/gameSetting/homePage/del`, data);
}
export function updateCustomerInfo(data) {
    return axios.post(`/api/admin/gameSetting/homePage/update`, data);
}

//短信平台配置
export function getSmsSwitch() {
    return axios.get(`/api/admin/gameSetting/smsSwitch`);
}
export function postSmsSwitch(data) {
    return axios.post(`/api/admin/gameSetting/smsSwitch`, data);
}
//通知游戏服
export function smsAdvice() {
    return axios.post(`/api/admin/gameSetting/smsInfo/smsAdvice`);
}

// 防掉签配置获取
export function getPreventConfig() {
    return axios.get(`/api/admin/updatePackage/get`)
}
// 防掉签配置编辑
export function updatePreventConfig(data) {
    return axios.post(`/api/admin/updatePackage/update`, data)
}
// 兑换CD配置
export function getWithdrawTypeInfo(data) {
    return axios.get(`/api/admin/gameSetting/withdrawTypeInfo/get`, { params: data });
}
// 增加兑换CD配置
export function addWithdrawTypeInfo(data) {
    return axios.post(`/api/admin/gameSetting/withdrawTypeInfo/add`, data);
}
// 删除兑换CD配置
export function delWithdrawTypeInfo(data) {
    return axios.post(`/api/admin/gameSetting/withdrawTypeInfo/del`, data);
}
// 修改兑换CD配置
export function updateWithdrawTypeInfo(data) {
    return axios.post(`/api/admin/gameSetting/withdrawTypeInfo/update`, data);
}
// 保存权重自动配置
export function rechargeWeightTimeCfg(data) {
    return axios.post(`/api/admin/adminCfg/rechargeWeightTimeCfg`, data);
}


// 手机号前缀黑名单
export function getBanAct(data) {
    return axios.get(`/api/admin/gameSetting/banAct/get`, { params: data });
}
// 添加手机号前缀黑名单
export function addBanAct(data) {
    return axios.post(`/api/admin/gameSetting/banAct/add`, data);
}
// 删除手机号前缀黑名单
export function delBanAct(data) {
    return axios.post(`/api/admin/gameSetting/banAct/del`, data);
}

// 充值通知列表
export function getRechargeMsg(data) {
    return axios.get(`/api/admin/gameSetting/rechargeMsg/get`, { params: data });
}
// 添加充值通知
export function addRechargeMsg(data) {
    return axios.post(`/api/admin/gameSetting/rechargeMsg/add`, data);
}
// 删除充值通知
export function delRechargeMsg(data) {
    return axios.post(`/api/admin/gameSetting/rechargeMsg/del`, data);
}
// 修改充值通知
export function updateRechargeMsg(data) {
    return axios.post(`/api/admin/gameSetting/rechargeMsg/update`, data);
}
// vip特权
export function getVipPrivilegeList(data) {
    return axios.get(`/api/admin/gameSetting/vipPrivilegeList`, { params: data });
}
export function addVipPrivilegeList(data) {
    return axios.put(`/api/admin/gameSetting/vipPrivilegeList`, data );
}
export function updateVipPrivilegeList(data) {
    return axios.post(`/api/admin/gameSetting/vipPrivilegeList`, data );
}
export function deleteVipPrivilegeList(data) {
    return axios.delete(`/api/admin/gameSetting/vipPrivilegeList`, {data} );
}
//获取短信配置
export function getSmsInfo() {
    return axios.get(`/api/admin/gameSetting/smsInfo`);
}
//修改短信配置
export function updateSmsInfo(data) {
    return axios.post(`/api/admin/gameSetting/smsInfo`, data);
}
