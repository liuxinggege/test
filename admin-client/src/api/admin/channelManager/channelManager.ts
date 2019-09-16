declare var require: any
import axios from '../../../utils/request';

/**
 * 角色  创建
 */
export function createParent(data) {
    return axios.post(`/api/admin/channel/group/createParent`, data);
}
export function createSub(data) {
    return axios.post(`/api/admin/channel/group/createSub`, data);
}
/**
 * 角色   编辑
 */
export function updateChannelGroup(data) {
    return axios.post(`/api/admin/channel/group/update`, data);
}

/**
 * 角色   查询
 */
export function getParents(data) {
    return axios.get(`/api/admin/channel/group/parents`, { params: data });
}
export function getSubs(data) {
    return axios.get(`/api/admin/channel/group/subs`, { params: data });
}


// 渠道账号管理 查询
export function getChannelCountMgr(data) {
    return axios.get(`/api/admin/channel/group/parents`, { params: data });
}

export function deleteChannelCountMgr(data) {
    return axios.post(`/api/admin/channel/group/parents`, data);
}

export function addChannelCountMgr(data) {
    return axios.post(`/api/admin/channel/group/parents`, data);
}

export function editChannelCountMgr(data) {
    return axios.post(`/api/admin/channel/group/parents`, data);
}


// 扣量比设置
export function getChannelDiscount(data) {
    return axios.get(`/api/admin/channel/discount/getMany`, { params: data });
}

export function deleteChannelDiscount(data) {
    return axios.post(`/api/admin/channel/discount/delete`, data);
}

export function addChannelDiscount(data) {
    return axios.post(`/api/admin/channel/discount/create`, data);
}

export function editChannelDiscount(data) {
    return axios.post(`/api/admin/channel/discount/update`, data);
}

// 结算审核
export function getBillingAudit(data) {
    return axios.post(`/api/admin/authority/getSetOrder`, data);
}

export function agreeBillingAudit(data) {
    return axios.post(`/api/admin/authority/agreeChannelSetMoney
`, data);
}

export function refuseBillingAudit(data) {
    return axios.post(`/api/admin/authority/refuseChannelSetMoney`, data);
}


// export function deleteChannelDiscount(data){
//     return axios.post(`/api/admin/channel/discount/delete`,data);
// }

// export function addChannelDiscount(data){
//     return axios.post(`/api/admin/channel/discount/create`,data);
// }

// export function editChannelDiscount(data){
//     return axios.post(`/api/admin/channel/discount/update`,data);
// }


// 结算账号管理
// 查询
export function getChannelUser(data) {
    return axios.get(`/api/admin/authority/getChannelUser`, { params: data });
}

// 修改支付宝
export function updateChannelAlipayAccount(data) {
    return axios.post(`/api/admin/authority/updateChannelAlipayAccount`, data);
}

// 修改支付宝姓名
export function updateChannelAlipayName(data) {
    return axios.post(`/api/admin/authority/updateChannelAlipayName`, data);
}

// 修改支付宝密码
export function updateChannelPayPwd(data) {
    return axios.post(`/api/admin/authority/updateChannelPayPwd`, data);
}

// 修改渠道账号分成比例
export function updateChannelSharingRatio(data) {
    return axios.post(`/api/admin/authority/updateChannelSharingRatio`, data);
}

// 改变渠道账号结算总金额
export function updateChannelTotalMoney(data) {
    return axios.post(`/api/admin/authority/updateChannelTotalMoney`, data);
}

// 查看流水记录
export function getSetHistory(data) {
    return axios.post(`/api/admin/authority/getSetHistory`, data);
}

// 账号状态
export function updateChannelStatus(data) {
    return axios.post(`/api/admin/authority/updateChannelStatus`, data);
}



//渠道关系
export function getChannelRelation(data) {
    return axios.get(`/api/admin/gameSetting/channelRelation`, { params: data });
}

export function deleteChannelRelation(data) {
    return axios.delete(`/api/admin/gameSetting/channelRelation`, { data: data });
}

export function addChannelRelation(data) {
    return axios.put(`/api/admin/gameSetting/channelRelation`, data);
}

export function addChannelRelationList(data) {
    return axios.post(`/api/admin/gameSetting/channelRelationList`, data);
}

export function editChannelRelation(data) {
    return axios.post(`/api/admin/gameSetting/channelRelation`, data);
}

// 显示渠道自己代理配置
export function getChannelShieldFather(data) {
    // return axios.get(`/api/admin/gameSetting/channelShieldFather`, { params: data });
}

export function deleteChannelShieldFather(data) {
    // return axios.delete(`/api/admin/gameSetting/channelShieldFather`, { data: data });
}

export function editChannelShieldFather(data) {
    // return axios.post(`/api/admin/gameSetting/channelShieldFather`, data);
}


//渠道状态
export function getChannelShield(data) {
    return axios.get(`/api/admin/gameSetting/channelShield/list`, { params: data });
}

export function deleteChannelShield(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/delete`, data);
}

export function addChannelShield(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/create`, data);
}

export function editChannelShield(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/update`, data);
}

export function getChannelFather(data) {
    return axios.get(`/api/admin/gameSetting/channelShield/fathers`, { params: data });
}
export function fixAgencyChannelDomain(data) {
    return axios.post(`/api/admin/agencyMgr/fixAgencyChannelDomain`, data);
}

export function enableShieldByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableShieldByChannels`, data);
}
export function enableStatusJmpByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableStatusJmpByChannels`, data);
}
export function enableBanMasterByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableBanMasterByChannels`, data);
}
export function enableReportAgentByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableReportAgentByChannels`, data);
}
export function enableRechargeEnforceByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableRechargeEnforceByChannels`, data);
}
export function enableOnlineRechargeByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableOnlineRechargeByChannels`, data);
}
export function enableLowerBonusByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableLowerBonusByChannels`, data);
}
export function enableTyShieldByChannels(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/enableTyShieldByChannels`, data);
}

export function fixWXByBatch(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/fixWXByBatch`, data);
}
export function changeManyChannelUrl(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/changeManyChannelUrl`, data);
}
export function updateOneChannel(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/updateOneChannel`, data);
}
export function changeDomain(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/changeDomain`, data);
}
export function getChannelPage(data) {
    return axios.get(`/api/admin/gameSetting/channelPage/getChannelPage`, { params: data });
}
export function changeWeb(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/changeWeb`, data);
}
export function changeManyWeb(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/changeManyWeb`, data);
}
export function delDomain(data) {
    return axios.post(`/api/admin/gameSetting/channelShield/delDomain`, data);
}





// 渠道账号管理
export function getLeaders(data) {//主账号
    return axios.get(`/api/admin/authority/cps/leaders`, { params: data });
}
export function getMembers(data) {//子账号
    return axios.get(`/api/admin/authority/cps/members`, { params: data });
}

export function createUser(data) {
    return axios.post(`/api/admin/authority/cps/users`, data);
}

export function updateUser(data) {
    return axios.post(`/api/admin/authority/cps/updateUsers`, data);
}

export function getUserByAct(data) {
    return axios.get(`/api/admin/authority/cps/users`, { params: data });
}

export function addMembers(data) {
    return axios.post(`/api/admin/authority/cps/relations/members/add`, data);
}

export function deleteMembers(data) {
    return axios.post(`/api/admin/authority/cps/relations/members/delete`, data);
}

export function updateMembers(data) {
    return axios.post(`/api/admin/authority/cps/relations/members/channels`, data);
}

export function deleteRelation(data) {
    return axios.post(`/api/admin/authority/cps/delRelations`, data);
}


export function createRelation(data) {//创建渠道账号
    return axios.post(`/api/admin/authority/cps/relations`, data);
}

export function updateChannel(data) {
    return axios.post(`/api/admin/authority/cps/relations/channels`, data);
}



export function getChannelList(data) {
    return axios.get(`/api/admin/authority/corp/auditChannelList`, { params: data });
}

export function getBalanceDeatile(data) {
    return axios.get(`/api/admin/authority/corp/auditChannelsDetail`, { params: data });
}

export function getBalanceCfg(data) {
    return axios.get(`/api/admin/channel/getChannelSettlementCfg`, { params: data });
}
export function addBalanceCfg(data) {
    return axios.post(`/api/admin/channel/addChannelSettlementCfg`, data);
}
export function deleteBalanceCfg(data) {
    return axios.get(`/api/admin/channel/deleteChannelSettlementCfg`, { params: data });
}
export function editBalanceCfg(data) {
    return axios.post(`/api/admin/channel/editChannelSettlementCfg`, data);
}

//根据落地页域名获取URL
export function getDownloadUrls(data) {
    return axios.get(`/api/admin/export/downloadUrlExcel`, { params: data });
}

//查询域名
export function getUrlMaintenance(data) {
    return axios.get(`/api/admin/channel/urlMaintenance/get`, { params: data });
}
//新增域名
export function addUrlMaintenance(data) {
    return axios.post(`/api/admin/channel/urlMaintenance/insert`, data);
}
//修改域名
export function updateUrlMaintenance(data) {
    return axios.post(`/api/admin/channel/urlMaintenance/update`, data);
}
//删除域名
export function deleteUrlMaintenance(data) {
    return axios.post(`/api/admin/channel/urlMaintenance/delete`, data);
}
//导出域名库
export function downUrlMaintenanceExcel(data) {
    return axios.post(`/api/admin/export/urlMaintenanceExcel`, data)
}
//增加落地页
export function addDlInfos(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/channelPageDlInfos/add`, data);
}
//修改落地页
export function updateDlInfos(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/channelPageDlInfos/update`, data);
}
//模版下拉框
export function getTmplByPid(data) {
    return axios.get(`/api/admin/gameSetting/channelPageHost/getTmplByPid`, { params: data });
}

//落地页兼容
export function getChannelPageCompat(data) {
    return axios.get(`/api/admin/gameSetting/channelPageCompat/get`, { params: data });
}
//落地页兼容 添加
export function addChannelPageCompat(data) {
    return axios.post(`/api/admin/gameSetting/channelPageCompat/add`, data);
}

//落地页短域名
export function getChannelPageHost(data) {
    return axios.get(`/api/admin/gameSetting/channelPageHost/get`, { params: data });
}
//落地页短域名 添加
export function addChannelPageHost(data) {
    return axios.post(`/api/admin/gameSetting/channelPageHost/add`, data);
}
//落地页短域名 修改
export function updateChannelPageHost(data) {
    return axios.post(`/api/admin/gameSetting/channelPageHost/update`, data);
}
//落地页短域名 删除
export function delChannelPageHost(data) {
    return axios.post(`/api/admin/gameSetting/channelPageHost/del`, data);
}
//ios下载地址批量替换
export function updateIosUrl(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/channelPageUpdateIosUrl `, data);
}
//安卓下载地址批量替换
export function updateAndrUrl(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/updateAndroidDomains `, data);
}
//修改跳转域名
export function changeDl(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/changeDl`, data);
}
//渠道列表导出
export function getChannelShieldsExcel(data) {
    return axios.get(`/api/admin/export/channel/shields`, { params: data });
}
//渠道落地页导出
export function getChannelPagesExcel(data) {
    return axios.get(`/api/admin/export/channel/pages`, { params: data });
}
//修改普通渠道入口地址
export function changeGeneralDomain(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/changeGeneralDomain`, data);
}
//落地页兼容批量添加
export function addMany(data) {
    return axios.post(`/api/admin/gameSetting/channelPageCompat/addMany`, data);
}

//渠道落地页-地推域名更换
export function changeGPDomain(data) {
    return axios.post(`/api/admin/gameSetting/channelPage/changeGPDomain`, data);
}
/* 域名状态管理  查询*/
export function getDomainStatus(data) {
    return axios.get(`/api/admin/gameSetting/domainStatus/getDomainStatus`, {
        params: data
    })
}
/* 域名状态管理  修改间隔时间*/
export function updateCanceledInterval(data) {
    return axios.get(
        `/api/admin/gameSetting/domainStatus/updateCanceledInterval`,
        {
            params: data
        }
    )
}
/* 域名状态管理  删除单个*/
export function deleteOne(data) {
    return axios.delete(`/api/admin/gameSetting/domainStatus/deleteOne`, {
        params: data
    })
}

/* 域名状态管理  删除全部*/
export function deleteAll() {
    return axios.delete(`/api/admin/gameSetting/domainStatus/deleteAll`)
}
// 商店包tips管理

export function getIosPackageCfg(data) {
    return axios.get(`/api/admin/gameSetting/iosPackageCfg/list`, { params: data });
}
export function addIosPackageCfg(data) {
    return axios.post(`/api/admin/gameSetting/iosPackageCfg/add`, data);
}
export function updateIosPackageCfg(data) {
    return axios.post(`/api/admin/gameSetting/iosPackageCfg/update`, data);
}
export function delIosPackageCfg(data) {
    return axios.post(`/api/admin/gameSetting/iosPackageCfg/delete`, data);
}