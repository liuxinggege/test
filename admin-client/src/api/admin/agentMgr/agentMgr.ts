declare var require: any
import axios from '../../../utils/request';




/**  
 * 添加  代理 
 */
export function addAgentNew(agent) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/addAgency`, agent);
}

/**  
 *  查询  代理 
 */
export function getAgetListNew(queryModel) {
    return axios.get(`/api/admin/agencyMgr/agencyMgr/agencyList`, { params: queryModel });
}
/**  
 *  Excel 
 */
export function getAgetListNewExcel(queryModel) {
    return axios.get(`/api/admin/export/agencyMgr/agencyListExcel`, { params: queryModel, timeout: 60000 });
}
/**  
 *  查询  代理tree 
 */
export function getAgentTree(cond) {
    return axios.get(`/api/admin/agencyMgr/agencyMgr/getAgentTree`, { params: cond });
}
/**  
 * 更新 转账至总代
 */
export function transferFromAgencyIdsToZongDai(data) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/transferToZongDai`, data);
}

/**  
 *  更新  代理 
 */
export function updateAgentNew(agent) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/fixAgency`, agent);
}


/**  
 *  删除  代理 
 */
// export function deleteAgentNew(agent) {
//     return axios.post(`/api/admin/agencyMgr/agencyMgr/`, agent);
// }

/**  
 *  冻结  代理 
 */
export function updateAgentStatus(agent) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/banOrAllow`, agent);
}

// 推广日表
export function getSpreadDayTable(queryModel) {
    return axios.get(`/api/admin/agencyMgr/promotionDay`, { params: queryModel });
}
// 推广日表总数据
export function getSpreadDayTotal(queryModel) {
    return axios.get(`/api/admin/agencyMgr/promotionDayTotal`, { params: queryModel, timeout: 60000 });
}
// 推广日表Excel
export function getSpreadDayTableExcel(queryModel) {
    return axios.get(`/api/admin/export/agencyMgr/promotionDayExcel`, { params: queryModel, timeout: 60000 });
}



// 推广月表
export function getSpreadMonthTable(queryModel) {
    return axios.post(`/api/admin/agent/aaa`, queryModel);
}

// 代理总数据-表格
export function getAgentTotalData(queryModel) {
    return axios.get(`/api/admin/agencyMgr/agencyStat`, { params: queryModel });
}
export function getAgentTotalDataExcel(queryModel) {
    return axios.get(`/api/admin/export/agencyMgr/agencyStatExcal`, { params: queryModel, timeout: 180000 });
}
export function addAgencyBlanceBatch(data) {
    return axios.post(`/api/admin/agencyMgr/addAgencyBlanceBatch`, data);
}
// 代理人为添加余额
export function addMoney(data) {
    console.log("in")
    return axios.post(`/api/admin/agencyMgr/addAgencyBlance`, data);
}


export function getAgenyDailyInfo(queryModel) {
    return axios.get(`/api/admin/agencyMgr/agencyDaliyInfo`, { params: queryModel });
}
export function getAgenyDailyInfoExcel(queryModel) {
    return axios.get(`/api/admin/export/agencyMgr/getAgenyDailyInfoExcel`, { params: queryModel, timeout: 120000 });
}

export function getGrandsonDetail(queryModel) {
    return axios.get(`/api/admin/agencyMgr/grandsonDetail`, { params: queryModel });
}
// 代理流水记录
export function getaAencyMoneyChange(queryModel) {
    return axios.get(`/api/admin/agencyMgr/getMoneyChange`, { params: queryModel });
}
export function exportAgencyMoneyChange(queryModel) {
    return axios.get(`/api/admin/export/agencyMgr/exportAgencyMoneyChange`, { params: queryModel, timeout: 120000 });
}


/**  
 *  查询  代理税收成分 
 */
export function getAgentTaxSetting() {
    return axios.get(`/api/admin/agencyMgr/getAgencyCfg`);
}

export function getDefaultRateCfg(data) {
    return axios.get(`/api/admin/agencyMgr/getDefaultRateCfg`, { params: data });
}
/**  
 *  查询  代理税收成分配置
 */
export function getAgentTaxCfg(data) {
    return axios.get(`/api/admin/agencyMgr/getTaxRateCfg`, { params: data });
}
//删除 
export function delAgentTaxCfg(id) {
    return axios.get(`/api/admin/agencyMgr/delAgentTaxCfg`, { params: id });
}
//修改 
export function updateAgentTaxCfg(data) {
    return axios.post(`/api/admin/agencyMgr/updateAgentTaxCfg`, data);
}
//添加 
export function addAgentTaxCfg(data) {
    return axios.post(`/api/admin/agencyMgr/addAgentTaxCfg`, data);
}

/**  
 *  查询  代理税收扣量比配置
 */
export function getAgencyDiscountRateCfg(data) {
    return axios.get(`/api/admin/agencyMgr/getAgencyDiscountRateCfg`, { params: data });
}
//删除 
export function delAgencyDiscountRateCfg(id) {
    return axios.post(`/api/admin/agencyMgr/delAgencyDiscountRateCfg`, id);
}
//修改 
export function updateAgencyDiscountRateCfg(data) {
    return axios.post(`/api/admin/agencyMgr/updateAgencyDiscountRateCfg`, data);
}
//添加 
export function addAgencyDiscountRateCfg(data) {
    return axios.post(`/api/admin/agencyMgr/addAgencyDiscountRateCfg`, data);
}

//代理配置
//获取 
export function getAgencyCfg() {
    return axios.get(`/api/admin/agencyMgr/getAgencyCfg`);
}
//修改 
export function updateAgencyCfg(data) {
    return axios.post(`/api/admin/agencyMgr/updateAgencyCfg`, data);
}





/**  
 *  查询  代理提现订单 
 */
export function getAgentWithdrawOrder(queryModel) {
    return axios.get(`/api/admin/agencyMgr/agencySettleCheck`, { params: queryModel });
}
/**  
 * Excel
 */
export function getAgentWithdrawOrderExcel(queryModel) {
    return axios.get(`/api/admin/export/agencyMgr/agencySettleCheckExcel`, { params: queryModel, timeout: 60000 });
}

/**  
 *  同意  代理提现订单 
 */
export function agreeAgentWithdrawOrder(queryModel) {
    return axios.post(`/api/admin/agencyMgr/agreeAgencySetMoney`, queryModel);
}

/**  
 *  拒绝  代理提现订单 
 */
export function refuseAgentWithdrawOrder(queryModel) {
    return axios.post(`/api/admin/agencyMgr/refuseAgencySetMoney`, queryModel);
}



export function insertBillboards(queryModel) {
    return axios.post(`/api/admin/agencyMgr/insertAgencyBillboard`, queryModel);
}
export function getAgencyBillboardList(queryModel) {
    return axios.post(`/api/admin/agencyMgr/getAgencyBillboardList`, queryModel);
}
export function deleteAgencyBillboard(queryModel) {
    return axios.post(`/api/admin/agencyMgr/deleteAgencyBillboard`, queryModel);
}
export function activeAgencyBillboard(queryModel) {
    return axios.post(`/api/admin/agencyMgr/agencyActiveBillboard`, queryModel);
}
export function editAgencyBillboard(queryModel) {
    return axios.post(`/api/admin/agencyMgr/editAgencyBillboard`, queryModel);
}




/**  
 *  增加  推广配置 
 */
export function addSpreadSetting(agent) {
    return axios.post(`/api/admin/agent/aa`, agent);
}

/**  
 *  查询  推广配置 
 */
export function getSpreadSetting(queryModel) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/promotionCfg`, queryModel);
}

/**  
 *  更新  推广配置 
 */
export function updateSpreadSetting(agent) {
    return axios.post(`/api/admin/agent/a`, agent);
}

/**  
 *  删除  推广配置 
 */
export function deleteSpreadSetting(agent) {
    return axios.post(`/api/admin/agent/a`, agent);
}



/**  
 *  查询 组长下拉 
 */
export function getLeaderList() {
    return axios.get(`/api/admin/agencyMgr/leader/leaders`);
}


/**  
 *  增加 组长 
 */
export function addGroupRelation(agent) {
    return axios.post(`/api/admin/agent/aa`, agent);
}

/**  
 *  查询 组长 
 */
export function getGroupRelation(queryModel) {
    return axios.get(`/api/admin/agencyMgr/leader/leaderList`, { params: queryModel });
}

/**  
 *  更新 组长 
 */
export function updateGroupRelation(agent) {
    return axios.post(`/api/admin/agencyMgr/leader/fixLeader`, agent);
}

/**  
 *  删除 组长 
 */
export function deleteGroupRelation(agent) {
    return axios.post(`/api/admin/agencyMgr/leader/delLeader`, agent);
}


/**  
 *  增加 组员 
 */
export function addSubGroupRelation(agent) {
    return axios.post(`/api/admin/agencyMgr/memberList/`, agent);
}

/**  
 *  查询 组员 
 */
export function getSubGroupRelation(queryModel) {
    return axios.get(`/api/admin/agencyMgr/memberList/memberList`, { params: queryModel });
}

/**  
 *  更新 组员 
 */
export function updateSubGroupRelation(agent) {
    return axios.post(`/api/admin/agencyMgr/memberList/fixMember`, agent);
}

/**  
 *  删除 组员 
 */
export function deleteSubGroupRelation(agent) {
    return axios.post(`/api/admin/agencyMgr/memberList/`, agent);
}





/**
 * 查询 模版管理
 */
export function getTemplet(queryModel) {
    return axios.get(`/api/admin/agencyMgr/agencyMgr/tmpl/list`, { params: queryModel });
}

/**
 * 增加 模版管理
 */
export function addTemplet(agent) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/tmpl/create`, agent);
}

/**
 * 更新 模版管理
 */
export function updateTemplet(agent) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/tmpl/update`, agent);
}


/**
 * 删除 模版管理
 */
export function deleteTemplet(agent) {
    return axios.post(`/api/admin/agencyMgr/agencyMgr/tmpl/delete`, agent);
}

export function getWelfareRecord(data) {
    return axios.get(`/api/admin/agencyMgr/getWelfareRecord`, { params: data });
}
export function exportWelfareRecord(data) {
    return axios.get(`/api/admin/export/agencyMgr/exportWelfareRecord`, { params: data, timeout: 60000 });
}

//-----代理邮件-----
//查邮件
export function getAgencyMail(data) {
    return axios.get(`/api/admin/agencyMgr/getAgencyMailList`, { params: data });
}
//发邮件
export function sendAgencyMail(data) {
    return axios.post(`/api/admin/agencyMgr/sendAgencyMail`, data);
}
//导出邮件
export function exportAgencyMail(data) {
    return axios.get(`/api/admin/export/agencyMgr/exportAgencyMail`, { params: data });
}

//-----总代提现-----
//体现列表
export function getZongDaiWithdraw(data) {
    return axios.get(`/api/admin/agencyMgr/getZongDaiWithdrawTask`, { params: data });
}
//批量提现
export function putZongDaiWithdraw(data) {
    return axios.post(`/api/admin/agencyMgr/putZongDaiWithdrawTask`, data);
}
//修改
export function updateZongDaiWithdraw(data) {
    return axios.post(`/api/admin/agencyMgr/updateZongDaiWithdrawTask`, data);
}
//取消排队
export function cancelZongDaiWithdraw(data) {
    return axios.post(`/api/admin/agencyMgr/cancelZongDaiWithdrawTask `, data);
}
//组员代理下级数量限制
export function getAgencyChildNumber(data) {
    return axios.get(`/api/admin/agencyMgr/agencyChildNumber/get`, { params: data });
}
export function updateAgencyChildNumber(data) {
    return axios.post(`/api/admin/agencyMgr/agencyChildNumber/update`, data);
}
// 代理封停记录
export function getforbiddenLog(data) {
    return axios.get(`/api/admin/agencyMgr/agencyMgr/forbiddenLog`, { params: data });
}
//-----代理奖金池-----
//查询列表
export function getAgencyBonusPoolOrder(data) {
    return axios.get(`/api/admin/agencyMgr/agencyBonusPool/getAgencyBonusPoolOrder`, { params: data });
}
//通过
export function passAgencyBonusPoolOrder(data) {
    return axios.post(`/api/admin/agencyMgr/agencyBonusPool/passAgencyBonusPoolOrder`, data);
}
//拒绝
export function refuseAgencyBonusPoolOrder(data) {
    return axios.post(`/api/admin/agencyMgr/agencyBonusPool/refuseAgencyBonusPoolOrder`, data);
}
//导出
export function exportAgency(data) {
    return axios.get(`/api/admin/export/agencyMgr/exportAgencyBonusPoolOrder`, data);
}


//-----代理活动列表配置-----
//查询列表
export function getActivity(data) {
    return axios.get(`/api/admin/agencyMgr/activity/getActivity`, { params: data });
}
//切换状态
export function changeActivityCfgState(data) {
    return axios.post(`/api/admin/agencyMgr/activity/changeActivityCfgState`, data);
}
//编辑
export function updateActivity(data) {
    return axios.post(`/api/admin/agencyMgr/activity/updateActivity`, data);
}
//删除
export function deleteActivity(data) {
    return axios.post(`/api/admin/agencyMgr/activity/deleteActivity`, data);
}
//新增
export function insertActivity(data) {
    return axios.post(`/api/admin/agencyMgr/activity/insertActivity`, data);
}
//活动类型
export function getActivityType() {
    return axios.get(`/api/admin/agencyMgr/getActivityType`);
}
/**
 * 素材中心
 */
// 查询列表
export function getAgencyMaterial(data) {
    return axios.get(`/api/admin/agencyMgr/app/agencyMaterial/list`, { params: data });
}
// 添加素材
export function addAgencyMaterial(data) {
    return axios.post(`/api/admin/agencyMgr/app/agencyMaterial/add`, data, { timeout: 60000 });
}
// 删除素材
export function delAgencyMaterial(data) {
    return axios.post(`/api/admin/agencyMgr/app/agencyMaterial/del`, data);
}
// 修改素材
export function updateAgencyMaterial(data) {
    return axios.post(`/api/admin/agencyMgr/app/agencyMaterial/update`, data);
}
// 获取模版类型
export function getMaterialType() {
    return axios.get(`/api/admin/agencyMgr/app/agencyMaterial/categoryList`);
}
/**
 * 代理App公告
 */
// 查询列表
export function getAgencyBulletin(data) {
    return axios.get(`/api/admin/agencyMgr/app/agencyBulletin/list`, { params: data });
}
// 添加公告
export function addAgencyBulletin(data) {
    return axios.post(`/api/admin/agencyMgr/app/agencyBulletin/add`, data);
}
// 删除公告
export function delAgencyBulletin(data) {
    return axios.post(`/api/admin/agencyMgr/app/agencyBulletin/del`, data);
}
// 修改公告
export function updateAgencyBulletin(data) {
    return axios.post(`/api/admin/agencyMgr/app/agencyBulletin/update`, data);
}
/**
 * 代理App轮播
 */
// 查询列表
export function getBanner(data) {
    return axios.get(`/api/admin/agencyMgr/app/banner/list`, { params: data });
}
// 添加
export function addBanner(data) {
    return axios.post(`/api/admin/agencyMgr/app/banner/add`, data);
}
// 删除
export function delBanner(data) {
    return axios.post(`/api/admin/agencyMgr/app/banner/del`, data);
}
/**
 * 代理App跑马灯
 */
// 查询列表
export function getMarquee(data) {
    return axios.get(`/api/admin/agencyMgr/app/marquee/list`, { params: data });
}
// 添加
export function addMarquee(data) {
    return axios.post(`/api/admin/agencyMgr/app/marquee/add`, data);
}
// 删除
export function delMarqueer(data) {
    return axios.post(`/api/admin/agencyMgr/app/marquee/del`, data);
}

/**
 * 代理App课程素材
 */
// 查询列表
export function getCoursematerial(data) {
    return axios.get(`/api/admin/agencyMgr/app/videoAudio/list`, { params: data });
}
// 添加
export function addCoursematerial(data) {
    return axios.post(`/api/admin/agencyMgr/app/videoAudio/add`, data);
}
// 修改
export function updateCoursematerial(data) {
    return axios.post(`/api/admin/agencyMgr/app/videoAudio/update`, data);
}
// 删除
export function delCoursematerial(data) {
    return axios.post(`/api/admin/agencyMgr/app/videoAudio/del`, data);
}
