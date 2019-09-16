declare var require: any
import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '../views/layout/Layout.vue';
let _import = (file: string) => {
  let a = require('@/views/' + file + '.vue')
  return a.default
}
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)


/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'hello',
    hidden: true,
    children: [
      {
        path: 'hello',
        name: 'hello',
        component: _import('hello'),
        meta: { title: '欢迎', icon: 'hello', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: 'selfInfo',
    hidden: true,
    children: [
      {
        path: 'selfInfo',
        component: _import('selfInfo'),
        name: 'selfInfo',
        meta: { title: '个人信息', icon: 'selfInfo', noCache: true }
      }
    ]
  },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/500', component: _import('errorPage/401'), hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: (to, from, savedPosition) => {
    return { x: 0, y: 0 }
  },
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/home',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '主页',
      icon: 'chart'
    },
    children: [
      {
        path: 'home_adminHome',
        component: _import('home/adminHome/homeTab'),
        name: 'adminHome',
        meta: { title: '主页', icon: 'chart', noCache: true }
      },
      {
        path: 'home_operationsHome',
        component: _import('home/operationsHome/home'),
        name: 'operationsHome',
        meta: { title: '主页', icon: 'chart', noCache: true }
      }, //运营主页
      {
        path: 'home_customerServiceHome',
        component: _import('home/customerServiceHome/home'),
        name: 'customerServiceHome',
        meta: { title: '主页', icon: 'chart', noCache: true }
      }, //客服主页
      {
        path: 'home_businessHome',
        component: _import('home/businessHome/home'),
        name: 'businessHome',
        meta: { title: '主页', icon: 'chart', noCache: true }
      } //聚商主页
    ]
  },
  // { path: '*', redirect: '/404', hidden: true },
  {
    path: '/gameSetting',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'gameSetting',
    meta: {
      title: '游戏设置',
      icon: 'example'
    },
    children: [
      {
        path: 'gameSetting_downForMaintenance',
        component: _import('gameSetting/downForMaintenance/downForMaintenance'),
        name: 'downForMaintenance',
        meta: { title: '停机维护', noCache: true }
      },
      {
        path: 'gameSetting_marquee',
        component: _import('gameSetting/editMarquee/marquee'),
        name: 'marquee',
        meta: { title: '编辑跑马灯', noCache: true }
      },
      {
        path: 'gameSetting_billboard',
        component: _import('gameSetting/billboard'),
        name: 'billboard',
        meta: { title: '编辑公告', noCache: true }
      },
      {
        path: 'gameSetting_globalConfig',
        component: _import('gameSetting/globalConfig/globalConfig'),
        name: 'globalConfig',
        meta: { title: '全局配置', noCache: true }
      },
      {
        path: 'gameSetting_dictionary',
        component: _import('gameSetting/dictionary'),
        name: 'dictionary',
        meta: { title: '编辑字典和FAQ', noCache: true }
      },
      // { path: 'gameSetting_faq', component: _import('gameSetting/faq'), name: 'faq', meta: { title: '编辑FAQ', noCache: true } },
      { path: 'gameSetting_emailManager', component: _import('gameSetting/emailManager/emailManager'), name: 'emailManager', meta: { title: '邮件管理', noCache: true } },
      { path: 'gameSetting_emailTemplate', component: _import('gameSetting/emailManager/emailTemplate'), name: 'emailTemplate', meta: { title: '邮件模板', noCache: true } },
      { path: 'gameSetting_newPerson', component: _import('gameSetting/newPerson/newPerson'), name: 'newPerson', meta: { title: '新人奖励', noCache: true } },
      { path: 'gameSetting_blackList', component: _import('gameSetting/blackList'), name: 'blackList', meta: { title: '黑名单', noCache: true } },
      { path: 'gameSetting_report', component: _import('gameSetting/report'), name: 'report', meta: { title: '举报配置', noCache: true } },
      { path: 'gameSetting_whiteList', component: _import('gameSetting/whiteList/whiteList'), name: 'whiteList', meta: { title: '白名单', noCache: true } },
      { path: 'gameSetting_uuidWhiteList', component: _import('gameSetting/uuidWhiteList'), name: 'uuidWhiteList', meta: { title: 'uuid白名单', noCache: true } },
      { path: 'gameSetting_jushangConfig', component: _import('gameSetting/jushangConfig'), name: 'jushangConfig', meta: { title: '聚商配置', noCache: true } },
      { path: 'gameSetting_withdrawCfg', component: _import('gameSetting/withdrawCfg'), name: 'withdrawCfg', meta: { title: '兑换配置', noCache: true } },
      { path: 'gameSetting_rechargeCfg', component: _import('gameSetting/rechargeCfg'), name: 'rechargeCfg', meta: { title: '充值配置', noCache: true } },
      { path: 'gameSetting_rechargeMsg', component: _import('gameSetting/rechargeMsg'), name: 'rechargeMsg', meta: { title: '充值通知', noCache: true } },
      // { path: 'gameSetting_rechargeLocationCfg', component: _import('gameSetting/rechargeLocationCfg'), name: 'rechargeLocationCfg', meta: { title: '充值地区配置', noCache: true } },
      // { path: 'gameSetting_robot', component: _import('gameSetting/robot'), name: 'robot', meta: { title: '机器人配置', noCache: true } },
      {
        path: 'gameSetting_register',
        component: _import('gameSetting/register'),
        name: 'register',
        meta: { title: '登录配置', noCache: true }
      },
      // { path: 'gameSetting_smsValidate', component: _import('gameSetting/smsValidate'), name: 'smsValidate', meta: { title: '短信登录配置', noCache: true } },
      { path: 'gameSetting_iap', component: _import('gameSetting/iap'), name: 'iap', meta: { title: 'IAP', noCache: true } },
      { path: 'gameSetting_channelBusiness', component: _import('gameSetting/channelBusiness'), name: 'channelBusiness', meta: { title: '渠道商人配置', noCache: true } },
      { path: 'gameSetting_personWaterCfg', component: _import('gameSetting/personWaterCfg'), name: 'personWaterCfg', meta: { title: '个人水位配置', noCache: true } },
      { path: 'gameSetting_ipTable', component: _import('gameSetting/ipTable'), name: 'ipTable', meta: { title: 'VIP链路配置', noCache: true } },
      { path: 'gameSetting_loginErrorMessage', component: _import('gameSetting/loginErrorMessage'), name: 'loginErrorMessage', meta: { title: '登陆失败提示配置', noCache: true } },
      { path: 'gameSetting_banAct', component: _import('gameSetting/banAct'), name: 'banAct', meta: { title: '手机号前缀黑名单', noCache: true } },
      {
        path: 'gameSetting_preventSignOffConfig',
        component: _import('gameSetting/preventSignOffConfig'),
        name: 'preventSignOffConfig',
        meta: { title: '防掉签配置', noCache: true }
      },
      {
        path: 'gameSetting_privilegedManager',
        component: _import('gameSetting/privilegedManager'),
        name: 'gameSetting_privilegedManager',
        meta: {
          title: 'VIP特权管理',
          noCache: true
        }
      },
      {
        path: 'gameSetting_smsInfoCfg',
        component: _import('gameSetting/smsInfoCfg'),
        name: 'smsInfoCfg',
        meta: { title: '短信配置', noCache: true }
      }
    ]
  },
  {
    path: '/gameManager',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'gameManager',
    meta: {
      title: '游戏管理',
      icon: 'star'
    },
    children: [
      {
        path: 'gameManager_jinhuaGameConfig',
        component: _import('gameManager/jinhuaGameConfig/jinhuaGameConfig'),
        name: 'jinhuaGameConfig',
        meta: { title: '炸金花配置', noCache: true }
      },
      // { path: 'gameManager_suohaGameConfig', component: _import('gameManager/suohaGameConfig/suohaGameConfig'), name: 'suohaGameConfig', meta: { title: '港式梭哈配置', noCache: true } },
      // { path: 'gameManager_majiangGameConfig', component: _import('gameManager/majiangGameConfig/majiangGameConfig'), name: 'majiangGameConfig', meta: { title: '血战麻将配置', noCache: true } },
      {
        path: 'gameManager_doudizhuGameConfig',
        component: _import('gameManager/doudizhuGameConfig/doudizhuGameConfig'),
        name: 'doudizhuGameConfig',
        meta: { title: '斗地主配置', noCache: true }
      },
      {
        path: 'gameManager_dezhoupukeGameConfig',
        component: _import(
          'gameManager/dezhoupukeGameConfig/dezhoupukeGameConfig'
        ),
        name: 'dezhoupukeGameConfig',
        meta: { title: '德州扑克配置', noCache: true }
      },
      {
        path: 'gameManager_qianghongbaoGameConfig',
        component: _import(
          'gameManager/qianghongbaoGameConfig/qianghongbaoGameConfig'
        ),
        name: 'qianghongbaoGameConfig',
        meta: { title: '抢红包配置', noCache: true }
      },
      {
        path: 'gameManager_erbagangGameConfig',
        component: _import('gameManager/erbagangGameConfig/erbagangGameConfig'),
        name: 'erbagangGameConfig',
        meta: { title: '二八杠配置', noCache: true }
      },
      {
        path: 'gameManager_duofuduocaiGameConfig',
        component: _import('gameManager/duofuduocaiGameConfig/duofuduocaiGameConfig'),
        name: 'duofuduocaiGameConfig',
        meta: { title: '多福多财配置', noCache: true }
      },
      {
        path: 'gameManager_hongheiGameConfig',
        component: _import('gameManager/hongheiGameConfig/hongheiGameConfig'),
        name: 'hongheiGameConfig',
        meta: { title: '红黑配置', noCache: true }
      },
      {
        path: 'gameManager_longhuGameConfig',
        component: _import('gameManager/longhuGameConfig/longhuGameConfig'),
        name: 'longhuGameConfig',
        meta: { title: '龙虎配置', noCache: true }
      },
      {
        path: 'gameManager_buyuGameConfig',
        component: _import('gameManager/buyuGameConfig/buyuGameConfig'),
        name: 'buyuGameConfig',
        meta: { title: '捕鱼配置', noCache: true }
      },
      {
        path: 'gameManager_niuniuGameConfig',
        component: _import('gameManager/niuniuGameConfig/niuniuGameConfig'),
        name: 'niuniuGameConfig',
        meta: { title: '抢庄牛牛配置', noCache: true }
      },
      {
        path: 'gameManager_brnnGameConfig',
        component: _import('gameManager/brnnGameConfig/brnnGameConfig'),
        name: 'brnnGameConfig',
        meta: { title: '百人牛牛配置', noCache: true }
      },
      {
        path: 'gameManager_paodekuaiGameConfig',
        component: _import(
          'gameManager/paodekuaiGameConfig/paodekuaiGameConfig'
        ),
        name: 'paodekuaiGameConfig',
        meta: { title: '跑得快配置', noCache: true }
      },
      {
        path: 'gameManager_jdniuniuGameConfig',
        component: _import('gameManager/jdniuniuGameConfig/jdniuniuGameConfig'),
        name: 'jdniuniuGameConfig',
        meta: { title: '经典牛牛配置', noCache: true }
      },
      {
        path: 'gameManager_ermjGameConfig',
        component: _import('gameManager/ermjGameConfig/ermjGameConfig'),
        name: 'ermjGameConfig',
        meta: { title: '二人麻将配置', noCache: true }
      },
      {
        path: 'gameManager_totalLine',
        component: _import('gameManager/totalLine'),
        name: 'totalLine',
        meta: { title: '总走势图', noCache: true }
      }
    ]
  },
  {
    path: '/dataStatic',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'dataStatic',
    meta: {
      title: '数据统计',
      icon: 'documentation'
    },
    children: [
      {
        path: 'dataStatic_totalStatic',
        component: _import('dataStatic/totalStatic'),
        name: 'totalStatic',
        meta: { title: '统计总汇', noCache: true }
      },
      {
        path: 'channelManager_channelInfo',
        component: _import('dataStatic/channelInfo'),
        name: 'channelInfo',
        meta: { title: '渠道统计', noCache: true }
      },
      {
        path: 'dataStatic_todayStatic',
        component: _import('dataStatic/todayStatic'),
        name: 'todayStatic',
        meta: { title: '每日统计总汇', noCache: true }
      },
      {
        path: 'dataStatic_agentTodayStatic',
        component: _import('dataStatic/agentTodayStatic'),
        name: 'agentTodayStatic',
        meta: { title: '商人每日统计', noCache: true }
      },
      {
        path: 'dataStatic_playerRetention',
        component: _import('dataStatic/playerRetention'),
        name: 'playerRetention',
        meta: { title: '玩家留存', noCache: true }
      },
      {
        path: 'dataStatic_dailyRecharge',
        component: _import('dataStatic/dailyRecharge'),
        name: 'dailyRecharge',
        meta: { title: '充值每日数据', noCache: true }
      },
      // { path: 'dataStatic_gameRetention', component: _import('dataStatic/gameRetention'), name: 'gameRetention', meta: { title: '游戏留存', noCache: true } },
      {
        path: 'dataStatic_userWinLose',
        component: _import('dataStatic/userWinLose'),
        name: 'userWinLose',
        meta: { title: '用户输赢排名', noCache: true }
      },
      {
        path: 'kefu_dataStatic_userWinLose',
        component: _import('dataStatic/kefu_userWinLose'),
        name: 'kefu_userWinLose',
        meta: { title: '用户输赢排名', noCache: true }
      },
      {
        path: 'dataStatic_onlineStatic',
        component: _import('dataStatic/onlineStatic/onlineStatic'),
        name: 'onlineStatic',
        meta: { title: '在线统计', noCache: true }
      },
      // { path: 'dataStatic_withdrawMonitor', component: _import('dataStatic/withdrawMonitor'), name: 'withdrawMonitor', meta: { title: '兑换监控', noCache: true } },
      { path: 'dataStatic_rechargeFlowStat', component: _import('dataStatic/rechargeFlowStat'), name: 'rechargeFlowStat', meta: { title: '跑量统计', noCache: true } },
      {
        path: 'dataStatic_preventSignOffGuide',
        component: _import('dataStatic/preventSignOffGuide'),
        name: 'preventSignOffGuide',
        meta: { title: '防掉签引导数据统计', noCache: true }
      },
    ]
  },
  {
    path: '/userManager',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManager',
    meta: {
      title: '用户信息',
      icon: 'user'
    },
    children: [
      {
        path: 'admin_userManager',
        component: _import('admin_userManager/generalUser/generalUser'),
        name: 'admin_generalUser',
        meta: { title: '普通用户', noCache: true }
      },
      {
        path: 'kefu_userManager',
        component: _import('admin_userManager/generalUser/kefu_generalUser'),
        name: 'kefu_userManager',
        meta: { title: '普通用户', noCache: true }
      },
      {
        path: 'admin_businessUser',
        component: _import('admin_userManager/businessUser/businessUser'),
        name: 'admin_businessUser',
        meta: { title: '商人用户', noCache: true }
      },
      {
        path: 'admin_addUser',
        component: _import('admin_userManager/addUser/addUserManage'),
        name: 'admin_addUser',
        meta: { title: '创建账号', noCache: true }
      },
      {
        path: 'admin_personWaterLine',
        component: _import('admin_userManager/personWaterLine/personWaterLine'),
        name: 'admin_personWaterLine',
        meta: { title: '个人水位线', noCache: true }
      },
      {
        path: 'admin_userForbidden',
        component: _import('admin_userManager/userForbidden/userForbidden'),
        name: 'admin_userForbidden',
        meta: { title: '账号封停', noCache: true }
      },
      {
        path: 'admin_onlineUser',
        component: _import('admin_userManager/onlineUser/onlineUser'),
        name: 'admin_onlineUser',
        meta: { title: '在线玩家列表', noCache: true }
      },
      {
        path: 'business_userManager',
        component: _import('business_userManager/generalUser/generalUser'),
        name: 'business_generalUser',
        meta: { title: '普通用户', noCache: true }
      },
      {
        path: 'business_businessUser',
        component: _import('business_userManager/businessUser/businessUser'),
        name: 'business_businessUser',
        meta: { title: '商人用户', noCache: true }
      },
      {
        path: 'business_businessInfo',
        component: _import('businessInfo/businessInfo'),
        name: 'business_businessInfo',
        meta: { title: '商人信息', noCache: true }
      }
    ]
  },
  {
    path: '/withdrawManager',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'withdrawManager',
    meta: {
      title: '兑换管理',
      icon: 'money'
    },
    children: [
      // { path: 'withdrawManager_agentWithdrawInfo', component: _import('withdrawManager/agentWithdrawInfo'), name: 'agentWithdrawInfo', meta: { title: '代理兑换明细', noCache: true } },
      // { path: 'withdrawManager_agentOverview', component: _import('withdrawManager/agentOverview'), name: 'agentOverview', meta: { title: '代理回收总览', noCache: true } },
      // { path: 'withdrawManager_agentException', component: _import('withdrawManager/agentException'), name: 'agentException', meta: { title: '代理兑换审核表', noCache: true } },
      // { path: 'withdrawManager_agentDetail', component: _import('withdrawManager/agentDetail'), name: 'agentDetail', meta: { title: '代理明细表', noCache: true } },
      {
        path: 'withdrawManager_withdrawReview',
        component: _import('withdrawManager/withdrawReview'),
        name: 'withdrawReview',
        meta: { title: '兑换审核', noCache: true }
      },
      {
        path: 'withdrawManager_withdrawReview_crew',
        component: _import('withdrawManager/withdrawReview_crew'),
        name: 'withdrawReview_crew',
        meta: { title: '兑换审核', noCache: true }
      },
      // { path: 'withdrawManager_withdrawList', component: _import('withdrawManager/withdrawList'), name: 'withdrawList', meta: { title: '兑换列表', noCache: true } },
      {
        path: 'withdrawManager_merchantOrders',
        component: _import('withdrawManager/merchantOrders'),
        name: 'merchantOrders',
        meta: { title: '商户订单', noCache: true }
      }
    ]
  },
  {
    path: '/logManager',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'logManager',
    meta: {
      title: '日志查询',
      icon: 'form'
    },
    children: [
      {
        path: 'logManager_loginLog',
        component: _import('logManager/loginLog'),
        name: 'loginLog',
        meta: { title: '用户登录日志', noCache: true }
      },
      {
        path: 'logManager_gameLog',
        component: _import('logManager/gameLog'),
        name: 'gameLog',
        meta: { title: '游戏日志', noCache: true }
      },
      {
        path: 'logManager_jinhuaGameLog',
        component: _import('logManager/jinhuaGameLog'),
        name: 'jinhuaGameLog',
        meta: { title: '金花游戏日志', noCache: true }
      },
      {
        path: 'logManager_qznnGameLog',
        component: _import('logManager/qznnGameLog'),
        name: 'qznnGameLog',
        meta: { title: '抢庄牛牛游戏日志', noCache: true }
      },
      {
        path: 'logManager_brnnGameLog',
        component: _import('logManager/brnnGameLog'),
        name: 'brnnGameLog',
        meta: { title: '百人牛牛游戏日志', noCache: true }
      },
      // { path: 'logManager_xuezhanGameLog', component: _import('logManager/xuezhanGameLog'), name: 'xuezhanGameLog', meta: { title: '血战麻将游戏日志', noCache: true } },
      // { path: 'logManager_suohaGameLog', component: _import('logManager/suohaGameLog'), name: 'suohaGameLog', meta: { title: '港式梭哈游戏日志', noCache: true } },
      {
        path: 'logManager_doudizhuGameLog',
        component: _import('logManager/doudizhuGameLog'),
        name: 'doudizhuGameLog',
        meta: { title: '斗地主游戏日志', noCache: true }
      },
      {
        path: 'logManager_dezhoupukeGameLog',
        component: _import('logManager/dezhoupukeGameLog'),
        name: 'dezhoupukeGameLog',
        meta: { title: '德州扑克游戏日志', noCache: true }
      },
      {
        path: 'logManager_qianghongbaoGameLog',
        component: _import('logManager/qianghongbaoGameLog'),
        name: 'qianghongbaoGameLog',
        meta: { title: '抢红包游戏日志', noCache: true }
      },
      {
        path: 'logManager_erbagangGameLog',
        component: _import('logManager/erbagangGameLog'),
        name: 'erbagangGameLog',
        meta: { title: '二八杠游戏日志', noCache: true }
      },
      {
        path: 'logManager_duofuduocaiGameLog',
        component: _import('logManager/duofuduocaiGameLog'),
        name: 'duofuduocaiGameLog',
        meta: { title: '多福多财游戏日志', noCache: true }
      },
      {
        path: 'logManager_hongheiGameLog',
        component: _import('logManager/hongheiGameLog'),
        name: 'hongheiGameLog',
        meta: { title: '红黑游戏日志', noCache: true }
      },
      {
        path: 'logManager_longhuGameLog',
        component: _import('logManager/longhuGameLog'),
        name: 'longhuGameLog',
        meta: { title: '龙虎斗游戏日志', noCache: true }
      },
      {
        path: 'logManager_buyuGameLog',
        component: _import('logManager/buyuGameLog'),
        name: 'buyuGameLog',
        meta: { title: '捕鱼游戏日志', noCache: true }
      },
      {
        path: 'logManager_jdniuniuGameLog',
        component: _import('logManager/jdnnGameLog'),
        name: 'jdnnGameLog',
        meta: { title: '经典牛牛游戏日志', noCache: true }
      },
      {
        path: 'logManager_paodekuaiGameLog',
        component: _import('logManager/paodekuaiGameLog'),
        name: 'paodekuaiGameLog',
        meta: { title: '跑得快游戏日志', noCache: true }
      },
      {
        path: 'logManager_ermjGameLog',
        component: _import('logManager/ermjGameLog'),
        name: 'ermjGameLog',
        meta: { title: '二人麻将游戏日志', noCache: true }
      },
      {
        path: 'logManager_riskControlLog',
        component: _import('logManager/riskControlLog'),
        name: 'riskControlLog',
        meta: { title: '风控日志', noCache: true }
      },
      {
        path: 'logManager_transferLog',
        component: _import('logManager/transferLog'),
        name: 'transferLog',
        meta: { title: '转账日志', noCache: true }
      },
      {
        path: 'logManager_backstageLoginlog',
        component: _import('logManager/backstageLoginlog'),
        name: 'backstageLoginlog',
        meta: { title: '后台登陆日志', noCache: true }
      },
      {
        path: 'logManager_newLog',
        component: _import('logManager/newLog'),
        name: 'newLog',
        meta: { title: '操作日志', noCache: true }
      },
      {
        path: 'logManager_agentContactInfoLog',
        component: _import('logManager/agentContactInfoLog'),
        name: 'agentContactInfoLog',
        meta: { title: '商人信息修改日志', noCache: true }
      },
      {
        path: 'logManager_export',
        component: _import('logManager/export'),
        name: 'export',
        meta: { title: '导出管理', noCache: true }
      },
      {
        path: 'export_user_and_agency',
        component: _import('logManager/exportOperation'),
        name: 'exportOperation',
        meta: { title: '常用导出', noCache: true }
      },
      {
        path: 'logManager_export_log',
        component: _import('logManager/exportLog'),
        name: 'exportLog',
        meta: { title: '导出日志', noCache: true }
      }
    ]
  },
  {
    path: '/agentRecharge',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'agentRecharges',
    meta: {
      title: '商人充值管理',
      icon: 'money'
    },
    children: [
      {
        path: "agentRecharge_searchContact",
        component: _import("agentRecharge/searchContact"),
        name: "searchContact",
        meta: { title: "商人联系方式查询", noCache: true }
      },
      {
        path: "agentRecharge_contactSwitch",
        component: _import("agentRecharge/contactSwitch"),
        name: "contactSwitch",
        meta: { title: "联系方式开关", noCache: true }
      },
      {
        path: 'agentRecharge_agentRecharge',
        component: _import('agentRecharge/agentRecharge'),
        name: 'agentRecharge',
        meta: { title: '商人充值', noCache: true }
      },
      {
        path: 'agentRecharge_agentMonitor',
        component: _import('agentRecharge/agentMonitor'),
        name: 'agentMonitor',
        meta: { title: '商人接待监控', noCache: true }
      },
      {
        path: 'agentAccount_Management',
        component: _import('agentRecharge/agentAccountManagement'),
        name: 'agentAccountManagement',
        meta: { title: '收款账户记录', noCache: true }
      }
    ]
  },
  {
    path: '/transactionManager',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'transactionManager',
    meta: {
      title: '交易管理',
      icon: 'money'
    },
    children: [
      {
        path: 'transactionManager_totalStatic',
        component: _import('finance_transactionManager/totalStatic'),
        name: 'finance_totalStatic',
        meta: { title: '统计总汇', noCache: true }
      },
      {
        path: 'transactionManager_onlineCharge',
        component: _import('admin_transactionManager/onlineCharge'),
        name: 'onlineCharge',
        meta: { title: '在线充值', noCache: true }
      },
      {
        path: 'kefu_transactionManager_onlineCharge',
        component: _import('admin_transactionManager/kefu_onlineCharge'),
        name: 'kefu_onlineCharge',
        meta: { title: '在线充值', noCache: true }
      },
      {
        path: 'transactionManager_officialWithdraw',
        component: _import('admin_transactionManager/officialWithdraw'),
        name: 'officialWithdraw',
        meta: { title: '官方兑换', noCache: true }
      },
      {
        path: 'transactionManager_agentCharge',
        component: _import('admin_transactionManager/agentCharge'),
        name: 'agentCharge',
        meta: { title: '代理充值', noCache: true }
      },
      {
        path: 'transactionManager_agencyRecharge',
        component: _import('admin_transactionManager/agentCharge'),
        name: 'agencyRecharge',
        meta: { title: '代理充值', noCache: true }
      },
      {
        path: 'transactionManager_taobaoWithdraw',
        component: _import('admin_transactionManager/taobaoWithdraw'),
        name: 'taobaoWithdraw',
        meta: { title: '淘宝支付', noCache: true }
      },
      {
        path: 'transactionManager_rechargeQuestion',
        component: _import('admin_transactionManager/rechargeQuestion'),
        name: 'rechargeQuestion',
        meta: { title: '充值问题', noCache: true }
      },
      {
        path: 'transactionManager_buyWithdraw',
        component: _import('admin_transactionManager/buyWithdraw'),
        name: 'buyWithdraw',
        meta: { title: '购物支付', noCache: true }
      },
      {
        path: 'transactionManager_payWithdraw',
        component: _import('admin_transactionManager/payWithdraw'),
        name: 'payWithdraw',
        meta: { title: '代付订单', noCache: true }
      },
      {
        path: 'transactionManager_rechargeCallback',
        component: _import('admin_transactionManager/rechargeCallback'),
        name: 'rechargeCallback',
        meta: { title: '支付回调', noCache: true }
      }
    ]
  },

  {
    path: '/adminUser',
    component: Layout,
    redirect: 'noredirect',
    name: 'adminUser',
    meta: {
      title: '账号管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'adminUser_adminUserManager',
        component: _import('adminUserManager/adminUserManager'),
        name: 'adminUserManager',
        meta: { title: '账号信息', noCache: true }
      },
      {
        path: 'adminUser_adminGoogleAuth',
        component: _import('adminUserManager/adminGoogleAuth'),
        name: 'adminGoogleAuth',
        meta: { title: '谷歌验证', noCache: true }
      },
      {
        path: 'adminUser_taxDivisionSetting',
        component: _import('adminUserManager/roleEdit'),
        name: 'roleEdit',
        meta: { title: '角色编辑', noCache: true }
      },
      {
        path: 'adminUser_allowLoginIp',
        component: _import('adminUserManager/allowLoginIp'),
        name: 'allowLoginIp',
        meta: { title: '登陆白名单', noCache: true }
      }
    ]
  },
  {
    path: '/adminCfg',
    component: Layout,
    redirect: 'noredirect',
    name: 'adminCfg',
    meta: {
      title: '后台配置',
      icon: 'peoples'
    },
    children: [
      { path: "adminCfg_adminCfg", component: _import("adminCfg/adminCfg"), name: "adminCfg_adminCfg", meta: { title: "后台全局配置", noCache: true, icon: "example" } },
      { path: "adminCfg_rechargeWeightRateCfg", component: _import("adminCfg/rechargeWeightRateCfg"), name: "adminCfg_rechargeWeightRateCfg", meta: { title: "充值权重配置", noCache: true, icon: "example" } },
    ]
  },
  {
    path: '/channelManager',
    component: Layout,
    redirect: 'noredirect',
    name: 'channelManager',
    meta: {
      title: '渠道管理',
      icon: 'peoples'
    },
    children: [
      // { path: 'channelManager_channelGroup', component: _import('channelManager/channelGroup'), name: 'channelGroup', meta: { title: '渠道组', noCache: true } },
      {
        path: 'channelManager_channelAccountMgr',
        component: _import('channelManager/subChannelAccountMgr'),
        name: 'channelAccountMgr',
        meta: { title: '渠道账号管理', noCache: true }
      },
      {
        path: 'channelManager_channelRelation',
        component: _import('channelManager/channelRelation'),
        name: 'channelRelation',
        meta: { title: '渠道关系', noCache: true }
      },
      {
        path: 'channelManager_channelShield',
        component: _import('channelManager/channelShield'),
        name: 'channelShield',
        meta: { title: '渠道列表', noCache: true }
      },
      {
        path: 'channelManager_channelPage',
        component: _import('channelManager/channelPage'),
        name: 'channelPage',
        meta: { title: '渠道落地页配置', noCache: true }
      },
      {
        path: 'channelManager_channelPageHost',
        component: _import('channelManager/channelPageHost'),
        name: 'channelPageHost',
        meta: { title: '落地页短域名管理', noCache: true }
      },
      {
        path: 'channelManager_channelPageCompat',
        component: _import('channelManager/channelPageCompat'),
        name: 'channelPageCompat',
        meta: { title: '落地页兼容查询', noCache: true }
      },
      {
        path: 'channelManager_channelDiscount',
        component: _import('channelManager/channelDiscount'),
        name: 'channelDiscount',
        meta: { title: '扣量比设置', noCache: true }
      },
      // { path: 'channelManager_billingAudit', component: _import('channelManager/billingAudit'), name: 'billingAudit', meta: { title: '结算审核', noCache: true } },
      { path: 'channelManager_balanceCfg', component: _import('channelManager/balanceCfg'), name: 'balanceCfg', meta: { title: '渠道结算配置', noCache: true } },
      { path: 'channelManager_corpBalanceMgr', component: _import('channelManager/balanceMgr'), name: 'balanceMgr', meta: { title: '渠道结算管理', noCache: true } },
      { path: 'channelManager_urlMaintenance', component: _import('channelManager/domainName'), name: 'urlMaintenance', meta: { title: '域名维护', noCache: true } },
      {
        path: 'channelManager_domainStatusManager',
        component: _import('channelManager/domainStatusManager'),
        name: 'domainStatusManager',
        meta: { title: '域名状态管理', noCache: true }
      },
      {
        path: 'channelManager_iosPackageCfg',
        component: _import('channelManager/iosPackageCfg'),
        name: 'iosPackageCfg',
        meta: { title: '商店包TIPS管理', noCache: true }
      }
    ]
  },

  {
    path: '/agentMgr',
    component: Layout,
    redirect: 'noredirect',
    name: 'agentMgr1',
    meta: {
      title: '代理管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'agentMgr_agentMgr',
        component: _import('agentMgr/agentMgr'),
        name: 'agentMgr',
        meta: { title: '代理列表', noCache: true }
      },
      {
        path: 'kefu_agentMgr_agentMgr',
        component: _import('agentMgr/kefu_agentMgr'),
        name: 'kefu_agentMgr',
        meta: { title: '代理列表', noCache: true }
      },
      {
        path: 'agentMgr_spreadDayTable',
        component: _import('agentMgr/spreadDayTable'),
        name: 'spreadDayTable',
        meta: { title: '推广日表', noCache: true }
      },
      {
        path: 'agentMgr_agentTotalData',
        component: _import('agentMgr/agentTotalData'),
        name: 'agentTotalData',
        meta: { title: '代理总数据', noCache: true }
      },
      {
        path: 'agentMgr_moneyChange',
        component: _import('agentMgr/moneyChange'),
        name: 'moneyChange',
        meta: { title: '代理流水记录', noCache: true }
      },
      {
        path: 'agentMgr_agencyDaliyInfo',
        component: _import('agentMgr/agencyDaliyInfo'),
        name: 'agencyDaliyInfo',
        meta: { title: '代理每日数据', noCache: true }
      },
      {
        path: 'agentMgr_agentWithdrawTask',
        component: _import('agentMgr/agentWithdraw'),
        name: 'agentWithdraw',
        meta: { title: '总代提现', noCache: true }
      },
      {
        path: 'agentMgr_agencyTaxRateSetting',
        component: _import('agentMgr/agentTaxRateSetting'),
        name: 'agentTaxRateSetting',
        meta: { title: '代理税收点位设置', noCache: true }
      },
      {
        path: 'agentMgr_agentForbidden',
        component: _import('agentMgr/agentForbidden'),
        name: 'agentForbidden',
        meta: { title: '代理账号封停', noCache: true }
      },
      {
        path: 'agentMgr_agentCfg',
        component: _import('agentMgr/agencyCfg'),
        name: 'agentCfg',
        meta: { title: '代理配置', noCache: true }
      },
      {
        path: 'agentMgr_agentWithdrawOrder',
        component: _import('agentMgr/agentWithdrawOrder'),
        name: 'agentWithdrawOrder',
        meta: { title: '代理兑换订单', noCache: true }
      },
      {
        path: 'agentMgr_spreadSetting',
        component: _import('agentMgr/spreadSetting'),
        name: 'spreadSetting',
        meta: { title: '推广配置', noCache: true }
      },
      {
        path: 'agentMgr_templet',
        component: _import('agentMgr/templet'),
        name: 'templet',
        meta: { title: '推广二维码', noCache: true }
      },
      {
        path: 'agentMgr_billboard',
        component: _import('agentMgr/billboard'),
        name: 'agencyBillboard',
        meta: { title: '代理公告', noCache: true }
      },
      {
        path: 'agentMgr_welfareReceiveRecord',
        component: _import('agentMgr/welfareReceiveRecord'),
        name: 'agencyWelfareReceiveRecord',
        meta: { title: '代理福利领取记录', noCache: true }
      },
      {
        path: 'agentMgr_mail',
        component: _import('agentMgr/agentEmail'),
        name: 'agentMgr_mail',
        meta: { title: '代理邮件', noCache: true }
      },
      {
        path: 'agentMgr_bonusPoolRecord',
        component: _import('agentMgr/agencyBonusPool'),
        name: 'agentMgr_bonusPoolRecord',
        meta: { title: '资金池记录', noCache: true }
      },
      {
        path: 'agentMgr_agencyActivity',
        component: _import('agentMgr/agencyActivity'),
        name: 'agentMgr_agencyActivity',
        meta: { title: '代理活动', noCache: true }
      },
      {
        path: "agentMgr_agencyMaterialCenter",
        component: _import("agentMgr/agencyMaterialCenter"),
        name: "agentMgr_agencyMaterialCenter",
        meta: { title: "素材中心", noCache: true }
      },
      {
        path: "agentMgr_appBillboard",
        component: _import("agentMgr/appBillboard"),
        name: "agentMgr_appBillboard",
        meta: { title: "代理APP公告", noCache: true }
      },
      {
        path: "agentMgr_appBanner",
        component: _import("agentMgr/appBanner"),
        name: "agentMgr_appBanner",
        meta: { title: "代理APP轮播图", noCache: true }
      },
      {
        path: "agentMgr_appMarquee",
        component: _import("agentMgr/appMarquee"),
        name: "agentMgr_appMarquee",
        meta: { title: "代理APP跑马灯", noCache: true }
      },
      {
        path: "agentMgr_appCoursematerial",
        component: _import("agentMgr/appCoursematerial"),
        name: "agentMgr_appVideoMgr",
        meta: { title: "代理APP学院素材", noCache: true }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: 'noredirect',
    name: 'activity',
    meta: {
      title: '活动管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'activity_activityCfg',
        component: _import('activity/activityCfg'),
        name: 'activity_activityCfg',
        meta: { title: '活动配置', noCache: true }
      },
      {
        path: 'activity_activityChannel',
        component: _import('activity/activityChannel'),
        name: 'activity_activityChannel',
        meta: { title: '活动渠道配置', noCache: true }
      },
      {
        path: 'activity_activityCodeMgr',
        component: _import('activity/activityCodeMgr'),
        name: 'activity_activityCodeMgr',
        meta: { title: '活动兑换码', noCache: true }
      },
      {
        path: 'activity_activityUsers',
        component: _import('activity/activityUsers'),
        name: 'activity_activityUsers',
        meta: { title: '活动领取记录', noCache: true }
      },
      {
        path: 'activity_rechargeRebateCfg',
        component: _import('activity/rechargeRebate'),
        name: 'activity_rechargeRebateCfg',
        meta: { title: '返利活动配置', noCache: true }
      }
    ]
  },
  {
    path: '/pushManager',
    component: Layout,
    redirect: 'noredirect',
    name: 'pushManager',
    meta: {
      title: '推送管理',
      icon: 'form'
    },
    children: [
      {
        path: 'pushManager_pushCfg',
        component: _import('pushManager/pushCfg'),
        name: 'pushCfg',
        meta: { title: '推送配置', noCache: true }
      },
      {
        path: 'pushManager_pushList',
        component: _import('pushManager/pushList'),
        name: 'pushList',
        meta: { title: '推送任务列表', noCache: true }
      },
      {
        path: 'pushManager_pushDetail',
        component: _import('pushManager/pushDetail'),
        name: 'pushDetail',
        meta: { title: '推送任务明细', noCache: true }
      }
    ]
  },
  {
    path: '/VIPManager',
    component: Layout,
    redirct: 'nnoredirect',
    name: '',
    meta: {
      title: 'VIP管理',
      icon: 'form'
    },
    children: [
      {
        path: 'VIPManager_information',
        component: _import('VIPManager/information'),
        name: 'VIPManager_information',
        meta: {
          title: '信息库',
          noCache: true
        }
      },
      {
        path: 'VIPManager_customerServiceConfig',
        component: _import('VIPManager/customerServiceConfig'),
        name: 'VIPManager_customerServiceConfig',
        meta: {
          title: '客服配置',
          noCache: true
        }
      },
      {
        path: 'VIPManager_logQualityInspection',
        component: _import('VIPManager/logQualityInspection'),
        name: 'VIPManager_logQualityInspection',
        meta: {
          title: '日志质检',
          noCache: true
        }
      },
      {
        path: 'VIPManager_regressionList',
        component: _import('VIPManager/regressionList'),
        name: 'VIPManager_regressionList',
        meta: {
          title: '回归列表',
          noCache: true
        }
      },
      {
        path: 'VIPManager_VIPConfig',
        component: _import('VIPManager/VIPConfig'),
        name: 'VIPManager_VIPConfig',
        meta: {
          title: 'VIP配置',
          noCache: true
        }
      },
      {
        path: 'VIPManager_notifyConfig',
        component: _import('VIPManager/notifyConfig'),
        name: 'VIPManager_notifyConfig',
        meta: {
          title: '通知配置',
          noCache: true
        }
      },
      {
        path: 'VIPManager_systemConfig',
        component: _import('VIPManager/vipSystem'),
        name: 'VIPManager_systemConfig',
        meta: {
          title: 'VIP系统配置',
          noCache: true
        }
      },
      {
        path: 'VIPManager_giftPackageStatistics',
        component: _import('VIPManager/giftPackageStatistics'),
        name: 'VIPManager_giftPackageStatistics',
        meta: {
          title: 'VIP礼包统计',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/customerSevice',
    component: Layout,
    redirct: 'noredirect',
    name: 'customerSevice',
    meta: {
      title: '客服管理',
      icon: 'form'
    },
    children: [
      {
        path: 'customerSevice_customerChat',
        component: _import('customerSevice/customerChat'),
        name: 'customerSevice_customerChat',
        meta: {
          title: '客服聊天',
          noCache: true
        }
      },
      {
        path: 'customerSevice_chatHistory',
        component: _import('customerSevice/chatHistory'),
        name: 'customerSevice_chatHistory',
        meta: {
          title: '客服聊天记录',
          noCache: true
        }
      },
      {
        path: 'customerSevice_chatBlackList',
        component: _import('customerSevice/chatBlackList'),
        name: 'customerSevice_chatBlackList',
        meta: {
          title: '聊天黑名单',
          noCache: true
        }
      },
      {
        path: 'customerSevice_customerSeviceStatic',
        component: _import('customerSevice/customerSeviceStatic'),
        name: 'customerSevice_customerSeviceStatic',
        meta: {
          title: '客服统计',
          noCache: true
        }
      },
      {
        path: 'customerSevice_advisoryStat',
        component: _import('customerSevice/advisoryStat'),
        name: 'customerSevice_advisoryStat',
        meta: {
          title: '咨询人数分布查询',
          noCache: true
        }
      },
      {
        path: 'customerSevice_customerSeviceCfg',
        component: _import('customerSevice/customerSeviceCfg'),
        name: 'customerSevice_customerSeviceCfg',
        meta: {
          title: '客服信息配置',
          noCache: true
        }
      },
    ]
  }
]
