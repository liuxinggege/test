import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import activityMgr from './modules/activity/activityMgr';
// admin用户信息
import adminUserManager from './modules/adminUserManager/adminUserManager';
import allowLoginIp from './modules/adminUserManager/allowLoginIp';
import roleEdit from './modules/adminUserManager/roleEdit';
/*代理*/
import agentModel from './modules/agentManager/agentManager';
/*代理查询条件*/
import agentQueryModel from './modules/agentManager/agentQueryModel';
/** 下拉框等一些初始值的初始化 */
import libInitVal from './modules/agentManager/libInitVal';
/*周期结算设置*/
import settlementCycle from './modules/agentManager/settlementCycle';
/*税收分成设置*/
import taxDivisionSetting from './modules/agentManager/taxDivisionSetting';
import agencyCfg from './modules/agentMgr/agencyCfg';
import agencyMoneyChange from './modules/agentMgr/agencyMoneyChange';
import agencyTaxRateCfg from './modules/agentMgr/agencyTaxRateCfg';
import agencyWelfareRecord from './modules/agentMgr/agencyWelfareRecord';
//  代理管理
import agentMgr from './modules/agentMgr/agentMgr';
import agentTaxInfo from './modules/agentMgr/agentTaxInfo';
import agentTaxSetting from './modules/agentMgr/agentTaxSetting';
import agentTotalData from './modules/agentMgr/agentTotalData';
import agentWithdrawOrder from './modules/agentMgr/agentWithdrawOrder';
import agencyBillboard from './modules/agentMgr/billboard';
import groupRelation from './modules/agentMgr/groupRelation';
import agencyIncomeDetail from './modules/agentMgr/incomeDetail';
import spreadDayTable from './modules/agentMgr/spreadDayTable';
import spreadMonthTable from './modules/agentMgr/spreadMonthTable';
import spreadSetting from './modules/agentMgr/spreadSetting';
import templet from './modules/agentMgr/templet';
import app from './modules/app';
import balanceCfg from './modules/channelManager/balanceCfg';
import balanceMgr from './modules/channelManager/balanceMgr';
import billingAudit from './modules/channelManager/billingAudit';
import channelAccount from './modules/channelManager/channelAccountMgr/channelAccount';
import channelRelation from './modules/channelManager/channelAccountMgr/channelRelation';
import channelShield from './modules/channelManager/channelAccountMgr/channelShield';
import channelDiscount from './modules/channelManager/channelDiscount';
// 渠道管理
import channelGroup from './modules/channelManager/channelGroup';
import channelPage from './modules/channelManager/channelPage';
import settlementAccountManagement from './modules/channelManager/settlementAccountManagement';
import channelInfo from './modules/dataStatic/channelInfo';
import gameRetention from './modules/dataStatic/gameRetention';
import onlineGraph from './modules/dataStatic/onlineStatic/onlineGraph';
import onlineTable from './modules/dataStatic/onlineStatic/onlineTable';
import playerRetention from './modules/dataStatic/playerRetention';
import todayStatic from './modules/dataStatic/todayStatic';
/** 数据统计 */
import totalStatic from './modules/dataStatic/totalStatic';
import userWinLose from './modules/dataStatic/userWinLose';
import withdrawMonitor from './modules/dataStatic/withdrawMonitor';
import errorLog from './modules/errorLog';
import gameEachDayUserWinAndLose from './modules/gameManager/gameEachDayUserWinAndLose';
import allowLoginIP from './modules/gameSetting/allowLoginIP';
import billboard from './modules/gameSetting/billboard';
import bindBonus from './modules/gameSetting/bindBonus';
import blackList from './modules/gameSetting/blackList';
import channelBusiness from './modules/gameSetting/channelBusiness';
import dictionary from './modules/gameSetting/dictionary';
import fakeLocation from './modules/gameSetting/fakeLocation';
import faq from './modules/gameSetting/faq';
import fullMarquee from './modules/gameSetting/fullMarquee';
import gameLobbyMarquee from './modules/gameSetting/gameLobbyMarquee';
import iap from './modules/gameSetting/iap';
import ipTable from './modules/gameSetting/ipTable';
import jushangConfig from './modules/gameSetting/jushangConfig';
import locationRWRule from './modules/gameSetting/locationRWRule';
import mailManager from './modules/gameSetting/mailManager';
import newBieBonus from './modules/gameSetting/newBieBonus';
import personWaterCfg from './modules/gameSetting/personWaterCfg';
import privilegedManager from "./modules/gameSetting/privilegedManager";
import rechargeAndWithdrawCfg from './modules/gameSetting/rechargeAndWithdrawCfg';
import rechargeCfg from './modules/gameSetting/rechargeCfg';
import register from './modules/gameSetting/register';
import report from './modules/gameSetting/report';
import robot from './modules/gameSetting/robot';
/**游戏设置 */
import smsValidate from './modules/gameSetting/smsValidate';
import stopServer from './modules/gameSetting/stopServer';
import subGameSwitch from './modules/gameSetting/subGameSwitch';
import subGlobalConfig from './modules/gameSetting/subGlobalConfig';
import subWhiteList from './modules/gameSetting/subWhiteList';
import withdrawCfg from './modules/gameSetting/withdrawCfg';
//首页admin-home
import adminHome from './modules/home/adminHome';
import businessHome from './modules/home/businessHome';
import exportInfo from './modules/logManager/exportInfo';
import exportLog from './modules/logManager/exportLog';
import exportOperation from './modules/logManager/exportOperation';
/*日志查询*/
import jinhuaMatchRules from './modules/gameManager/jinhuaMatchRules'
import jinhuaMatchStages from './modules/gameManager/jinhuaMatchStages'
import niuniuMatchRules from './modules/gameManager/niuniuMatchRules'
import niuniuMatchStages from './modules/gameManager/niuniuMatchStages'
import brnnMatchRules from './modules/gameManager/brnnMatchRules'
import brnnMatchStages from './modules/gameManager/brnnMatchStages'
import buyuMatchRules from './modules/gameManager/buyuMatchRules'
import buyuMatchStages from './modules/gameManager/buyuMatchStages'
import hongheiMatchRules from './modules/gameManager/hongheiMatchRules'
import hongheiMatchStages from './modules/gameManager/hongheiMatchStages'
import ermjMatchRules from './modules/gameManager/ermjMatchRules'
import ermjMatchStages from './modules/gameManager/ermjMatchStages'
import longhuMatchRules from './modules/gameManager/longhuMatchRules'
import longhuMatchStages from './modules/gameManager/longhuMatchStages'
import doudizhuMatchRules from './modules/gameManager/doudizhuMatchRules'
import doudizhuMatchStages from './modules/gameManager/doudizhuMatchStages'
import dezhoupukeMatchRules from './modules/gameManager/dezhoupukeMatchRules'
import dezhoupukeMatchStages from './modules/gameManager/dezhoupukeMatchStages'
import qianghongbaoMatchRules from './modules/gameManager/qianghongbaoMatchRules'
import qianghongbaoMatchStages from './modules/gameManager/qianghongbaoMatchStages'
import erbagangMatchRules from './modules/gameManager/erbagangMatchRules'
import erbagangMatchStages from './modules/gameManager/erbagangMatchStages'
import duofuduocaiMatchRules from './modules/gameManager/duofuduocaiMatchRules'
import duofuduocaiMatchStages from './modules/gameManager/duofuduocaiMatchStages'
import majiangMatchRules from './modules/gameManager/majiangMatchRules'
import majiangMatchStages from './modules/gameManager/majiangMatchStages'
import suohaMatchRules from './modules/gameManager/suohaMatchRules'
import suohaMatchStages from './modules/gameManager/suohaMatchStages'
import paodekuaiMatchRules from './modules/gameManager/paodekuaiMatchRules'
import paodekuaiMatchStages from './modules/gameManager/paodekuaiMatchStages'
import jdniuniuMatchRules from './modules/gameManager/jdniuniuMatchRules'
import jdniuniuMatchStages from './modules/gameManager/jdniuniuMatchStages'
/*日志查询*/
import loginLog from './modules/logManager/loginLog'
import gameLog from './modules/logManager/gameLog'
import jinhuaGameLog from './modules/logManager/jinhuaGameLog'
import qznnGameLog from './modules/logManager/qznnGameLog'
import brnnGameLog from './modules/logManager/brnnGameLog'
import doudizhuGameLog from './modules/logManager/doudizhuGameLog'
import dezhoupukeGameLog from './modules/logManager/dezhoupukeGameLog'
import qianghongbaoGameLog from './modules/logManager/qianghongbaoGameLog'
import erbagangGameLog from './modules/logManager/erbagangGameLog'
import duofuduocaiGameLog from './modules/logManager/duofuduocaiGameLog'
import hongheiGameLog from './modules/logManager/hongheiGameLog'
import ermjGameLog from './modules/logManager/ermjGameLog'
import longhuGameLog from './modules/logManager/longhuGameLog'
import buyuGameLog from './modules/logManager/buyuGameLog'
import jdnnGameLog from './modules/logManager/jdnnGameLog'
import paodekuaiGameLog from './modules/logManager/paodekuaiGameLog'
import backstageLoginlog from './modules/logManager/backstageLoginlog'
/*追分*/
import recoverSection from './modules/logManager/riskControlLog/recoverSection';
import upPoint from './modules/logManager/riskControlLog/upPoint';
import suohaGameLog from './modules/logManager/suohaGameLog';
/*转账日志*/
import transferLog from './modules/logManager/transferLog';
import xuezhanGameLog from './modules/logManager/xuezhanGameLog';
import permission from './modules/permission';
import selfInfo from './modules/selfInfo/selfInfo';
import tagsView from './modules/tagsView';
import agentCharge from './modules/transactionManager/agentCharge';
import buyWithdraw from './modules/transactionManager/buyWithdraw'; //购物支付-cn
import officialWithdraw from './modules/transactionManager/officialWithdraw';
/** 交易管理 */
import onlineCharge from './modules/transactionManager/onlineCharge';
import payWithdraw from './modules/transactionManager/payWithdraw'; //代付订单
import rechargeCallback from './modules/transactionManager/rechargeCallback';
import rechargeQuestion from './modules/transactionManager/rechargeQuestion';
import taobaoWithdraw from './modules/transactionManager/taobaoWithdraw';
import user from './modules/user';
//商人信息
import businessUser from './modules/userManager/businessUser';
//用户信息
import generalUser from './modules/userManager/generalUser';
import onlineUser from './modules/userManager/onlineUser';
//个人信息
import attribution from './modules/userManager/userAttribution';
import userCreate from './modules/userManager/userCreate';
//用户封停
import userForbidden from './modules/userManager/userForbidden';
import giftPackageStatistics from "./modules/VIPManager/giftPackageStatistics";
/*水池配置*/
import waterPoolAndConfig from './modules/waterPoolAndConfig';
import agentDetail from './modules/withdrawManager/agentDetail';
import agentException from './modules/withdrawManager/agentException';
import agentOverview from './modules/withdrawManager/agentOverview';
/**
 * 兑换管理
 */
import agentWithdrawInfo from './modules/withdrawManager/agentWithdrawInfo';
import merchantOrders from './modules/withdrawManager/merchantOrders';
import withdrawList from './modules/withdrawManager/withdrawList';
import withdrawReview from './modules/withdrawManager/withdrawReview';










Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    errorLog,
    tagsView,

    permission,
    user,
    /*水池配置*/
    waterPoolAndConfig,
    /*游戏管理*/
    jinhuaMatchRules,
    jinhuaMatchStages,
    buyuMatchRules,
    buyuMatchStages,
    niuniuMatchRules,
    niuniuMatchStages,
    brnnMatchRules,
    brnnMatchStages,
    jdniuniuMatchRules,
    jdniuniuMatchStages,

    hongheiMatchRules,
    hongheiMatchStages,
    ermjMatchRules,
    ermjMatchStages,
    longhuMatchRules,
    longhuMatchStages,
    doudizhuMatchRules,
    doudizhuMatchStages,
    dezhoupukeMatchRules,
    dezhoupukeMatchStages,
    qianghongbaoMatchRules,
    qianghongbaoMatchStages,
    erbagangMatchRules,
    erbagangMatchStages,
    duofuduocaiMatchRules,
    duofuduocaiMatchStages,
    paodekuaiMatchRules,
    paodekuaiMatchStages,
    majiangMatchRules,
    majiangMatchStages,
    suohaMatchRules,
    suohaMatchStages,
    /*日志查询*/
    loginLog,
    gameLog,
    transferLog,
    recoverSection,
    jinhuaGameLog,
    qznnGameLog,
    brnnGameLog,
    xuezhanGameLog,
    suohaGameLog,
    doudizhuGameLog,
    dezhoupukeGameLog,
    qianghongbaoGameLog,
    erbagangGameLog,
    duofuduocaiGameLog,
    hongheiGameLog,
    ermjGameLog,
    longhuGameLog,
    buyuGameLog,
    jdnnGameLog,
    paodekuaiGameLog,
    backstageLoginlog,

    taxDivisionSetting,
    upPoint,

    exportInfo,
    exportLog,
    exportOperation,
    agentQueryModel,
    agentModel,
    settlementCycle,
    /*游戏设置*/
    smsValidate,
    register,
    robot,
    rechargeCfg,
    withdrawCfg,
    rechargeAndWithdrawCfg,
    newBieBonus,
    bindBonus,
    dictionary,
    subGameSwitch,
    subGlobalConfig,
    blackList,
    report,
    subWhiteList,
    fakeLocation,
    jushangConfig,
    iap,
    allowLoginIP,
    stopServer,
    gameLobbyMarquee,
    fullMarquee,
    libInitVal,
    channelBusiness,
    locationRWRule,
    personWaterCfg, //个人水位配置
    ipTable,

    /**交易管理 */
    onlineCharge,
    officialWithdraw,
    agentCharge,
    taobaoWithdraw,
    buyWithdraw, //购物支付-cn
    payWithdraw, //代付订单
    rechargeQuestion,
    rechargeCallback,
    billboard,
    faq,
    mailManager,
    agentWithdrawInfo,
    agentException,
    agentDetail,
    agentOverview,
    withdrawReview,
    withdrawList,
    merchantOrders,
    //adminHome
    adminHome,
    businessHome,
    //用户信息
    generalUser,
    businessUser,
    userForbidden,
    userCreate,
    attribution,
    onlineUser,
    /** 数据统计 */
    totalStatic,
    todayStatic,
    playerRetention,
    gameRetention,
    userWinLose,
    onlineGraph,
    onlineTable,
    withdrawMonitor,

    adminUserManager,
    roleEdit,
    // 渠道管理
    channelGroup,
    channelDiscount,
    billingAudit,
    settlementAccountManagement,
    channelAccount,
    channelRelation,
    channelShield,
    channelPage,
    selfInfo,
    balanceMgr,
    balanceCfg,
    allowLoginIp,
    channelInfo,
    // 代理管理
    agentMgr,
    spreadDayTable,
    spreadMonthTable,
    agentTotalData,
    agentTaxSetting,
    agencyTaxRateCfg,
    agencyCfg,
    agentWithdrawOrder,
    groupRelation,
    templet,
    agentTaxInfo,
    spreadSetting,
    agencyIncomeDetail,
    agencyBillboard,
    agencyWelfareRecord,
    agencyMoneyChange,
    //游戏水位统计图
    gameEachDayUserWinAndLose,
    activityMgr,
    giftPackageStatistics,//vip礼包领取统计
    privilegedManager//vip特权管理
  },
  getters
})

/** 后台的返回数据interface*/
export interface CodeMsg<T> {
  code: number
  msg: T
  err?: any
}
