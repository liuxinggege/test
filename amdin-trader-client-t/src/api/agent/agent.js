import axios from '../../utils/request'

//获取代理充值订单
export function agentOrder(data) {
    return axios.get('/api/agent/user/agentOrder', { params: data });
}
//获取可用账户
export function getActivation(data) {
    return axios.get('/api/agent/user/agentReceivablesMgr/getActivation', { params: data });
}
//获取欢迎语
export function getAgentWelcomeMsg(data) {
    return axios.get('/api/agent/user/agentReceivablesMgr/getAgentWelcomeMsg', { params: data });
}

//获取收款账户信息
export function getmgr(data) {
    return axios.get('/api/agent/user/agentReceivablesMgr/getAll', { params: data });
}
//获取现有收款银行
export function getMyBanks() {
    return axios.get('/api/agent/user/agentReceivablesMgr/getMyBanks');
}
//新增账户
export function addmgr(data) {
    return axios.post('/api/agent/user/agentReceivablesMgr/add', data);
}
//修改账户
export function updatemgr(data) {
    return axios.post('/api/agent/user/agentReceivablesMgr/update', data);
}
//保存自助充值信息
export function saveAuto(data) {
    return axios.post('/api/agent/user/agentActInfo', data);
}
//删除账户
export function deleteData(data) {
    return axios.post('/api/agent/user/agentReceivablesMgr/del', data);
}
//根据_id 获取具体收款账户
export function getAgentActById(data) {
    return axios.get('/api/agent/user/agentReceivablesMgr/getAgentActById', { params: data });
}
//获取聊天记录
export function chatDetail(data) {
    return axios.get('/api/agent/user/chatDetail', { params: data });
}
//获取可用的自动回复的收款账户
export function getAutoAct(data) {
    return axios.get('/api/agent/user/agentReceivablesMgr/agentAutoActivation', { params: data });
}
//代理收款账户自助充值状态
export function autoRechargeOn(data) {
    return axios.post('/api/agent/user/agentReceivablesMgr/updateIsSelfHelp', data);
}
//修改账户状态
export function updateActState(data) {
    return axios.post('/api/agent/user/agentReceivablesMgr/updateAccountState', data);
}
//黑名单查询
export function getBlackList(data) {
    return axios.get('/api/agent/user/chatBlackList/get', { params: data });
}
//黑名单移除
export function deleteBlack(data) {
    return axios.post('/api/agent/user/chatBlackList/del', data);
}
//黑名单新增
export function addBlack(data) {
    return axios.post('/api/agent/user/chatBlackList/add', data);
}