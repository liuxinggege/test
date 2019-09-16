export const routers = [
	/*************************************************业务模块 **********************************************************************/
	//系统配置
	{path:'/setting',title:'系统配置',redirect:{path: '/setting/role',name: 'role'}},
	{path:'/setting/license',name:'license',title:'证书管理',component: resolve => require(['./business_modules/license/license.vue'], resolve)},
	{path:'/setting/ddic',name:'ddic',title:'系统配置-数据字典',component: resolve => require(['./business_modules/colliery/ddic.vue'], resolve)},
	{path:'/setting/projectinfo',name:'projectinfo',title:'系统配置-煤矿简介',component: resolve => require(['./business_modules/colliery/projectinfo.vue'], resolve)},
	{path:'/setting/store',name:'store',title:'系统配置-数据备份',component: resolve => require(['./business_modules/colliery/storeData.vue'], resolve)},  
	{path:'/watching-index/Wsubaddup',name:'Wsubaddup',title:'系统配置-分站及设备配置',component: resolve => require(['./business_modules/colliery/setInfo.vue'], resolve)},
	{path:'/wstest',name:'wstest',title:'系统配置-实时通讯服务测试',component: resolve => require(['./business_modules/colliery/wstest.vue'], resolve)},
	{path:'/setip',name:'setip',title:'系统配置-IP地址修改',component: resolve => require(['./business_modules/colliery/setip.vue'], resolve)},

	//图形界面 graph
	{path:'/home',name:'home_index',title:'首页-模拟图',component: resolve => require(['./business_modules/graph/home_graph.vue'], resolve)},
	{path:'/watching-index/Wsub',name:'Wsub',title:'模拟图-设备编辑',component: resolve => require(['./business_modules/graph/edit_graph.vue'], resolve)},
	{path:'/drainage-index/system',name:'Dsystem',title:'模拟图-抽放系统-显示、编辑',component: resolve => require(['./business_modules/graph/gas_graph.vue'], resolve)},
	{path:'/watching-index/wind',name:'watching-index/wind',title:'模拟图-通风系统-显示、编辑',component: resolve => require(['./business_modules/graph/wind_graph.vue'], resolve)},
	{path:'/video-index/system',name: 'Vsystem',title:'模拟图-视频监控',component: resolve => require(['./business_modules/graph/video_graph.vue'], resolve)},
	{path:'/detailTable',name:'detailTable',title: '模拟图-活动轨迹',component: resolve => require(['./business_modules/graph/detailTable.vue'], resolve)},
	{path: '/watching-index/topo',name: 'watching-index/topo',title:'模拟图-自检图',component: resolve => require(['./business_modules/graph/webTopo3.vue'], resolve)},

	//语音广播系统
	{path:'/voice/system',name:'Bsystem',title:'语音广播-广播设备配置',component: resolve => require(['./business_modules/voice/voice_setting.vue'], resolve)},
	{path:'/voice/realList',name:'voiceRealList',title:'语音广播-广播实时列表',component: resolve => require(['./business_modules/voice/voice_list.vue'], resolve)},
	
	//人员定位 参数设置类
	{path:'/route-index/card',name:'card',title:'人员定位-读卡器管理',component: resolve => require(['./business_modules/person_setting/card.vue'], resolve)},
	{path:'/route-index/department',name:'department',title:'人员定位-部门管理',component: resolve => require(['./business_modules/person_setting/department.vue'], resolve)},	        
	{path:'/route-index/worktype',name:'worktype',title:'人员定位-工种管理',component: resolve => require(['./business_modules/person_setting/worktype.vue'], resolve)},
	{path:'/route-index/user',name:'users',title:'人员定位-人员管理',component: resolve => require(['./business_modules/person_setting/user.vue'], resolve)},
	{path:'/route-index/area',name:'area',title:'人员定位-区域配置',component: resolve => require(['./business_modules/person_setting/areaDeploy.vue'], resolve)},
	//人员定位 实时列表类
	{path:'/route-index/watch',name:'watch',title: '人员定位-当前人员信息', component: resolve => require(['./business_modules/person_real_list/nowpersonlist.vue'], resolve)},
	{path:'/route-index/areaNow',name:'areaNow',title:'人员定位-呼叫',component: resolve => require(['./business_modules/person_real_list/areaNow.vue'], resolve)},
	{path:'/route-index/helpNow',name:'helpNow',title:'人员定位-求救信息',component: resolve => require(['./business_modules/person_real_list/helpBar.vue'], resolve)},
	{path:'/route-index/helpHis',name:'/route-index/helpHis',title:'人员定位-求救历史',component: resolve => require(['./business_modules/person_real_list/helpMsg.vue'], resolve)},
	{path:'/route-index/cardNow',name:'cardNow',title:'人员定位-读卡器实时列表',component: resolve => require(['./business_modules/person_real_list/cardNow.vue'], resolve)},
	//人员定位 打印查询类
	{path: '/route-index/callout',name: 'callout',title:'人员定位-呼叫历史查询',component: resolve => require(['./business_modules/person_search/callout.vue'], resolve)},
	{path: '/searchcard',name: '/route-index/searchcard',title:'人员定位-分类查询',component: resolve => require(['./business_modules/person_search/searchcard.vue'], resolve)},
	{path: '/searchs/dayAreaAccess',name:'/route-index/searchsdayAreaAccess',title:'人员定位-每天区域出入查询',component: resolve => require(['./business_modules/person_search/dayAreaAccess.vue'], resolve)},
	{path:'/route-index/line',name:'line',title:'人员定位-活动轨迹',component: resolve => require(['./business_modules/person_search/line.vue'], resolve)},
	{path:'/searchs/withCard',name:'/route-index/searchswithCard',title:'人员定位-携卡人员查询',component: resolve => require(['./business_modules/person_search/withCard.vue'], resolve)},
	{path:'/wellDetails/:aname',name:'wellDetails',title:'人员定位-某人某月下井详情',component: resolve => require(['./business_modules/person_search/wellDetails.vue'], resolve)},
	{path:'/route-index/unNormal',name:'unNormal',title:'人员定位-工作异常人员查询',component: resolve => require(['./business_modules/person_search/unNormal.vue'], resolve)},
	{path:'/route-index/searchs/monthWell/:aname',name:'/route-index/searchsmonthWell',title: '人员定位-每月下井人员查询',component: resolve => require(['./business_modules/person_search/monthWell.vue'], resolve)},
	{path:'/searchs/monthAreaAccess',name:'/route-index/searchsmonthAreaAccess',title:'人员定位-每月区域出入查询',component: resolve => require(['./business_modules/person_search/monthAreaAccess.vue'], resolve)},
	{path:'/search/:aname',name:'/route-index/search',title:'人员定位-查询和统计',component: resolve => require(['./business_modules/person_search/search.vue'], resolve)},
	
	//环境监测-- system_setting 参数设置类
	{path:'/watching-index/setting',name:'watching-index/setting',title:'环境监测-系统参数',component: resolve => require(['./business_modules/monitoring_system_setting/systemParameter.vue'], resolve)},
	{path:'/watching-index/station',name:'station',title:'环境监测-设备管理',component: resolve => require(['./business_modules/monitoring_system_setting/sensorSeting.vue'], resolve)},
	{path:'/watching-index/looklog',name:'looklog',title:'环境监测-设备管理-运行日志',component: resolve => require(['./business_modules/monitoring_system_setting/looklog.vue'], resolve)},
	{path:'/watching-index/upload',name:'upload',title:'环境监测-数据上传',component: resolve => require(['./business_modules/monitoring_system_setting/upload.vue'], resolve)},
	{path:'/watching-index/decode',name:'watching-index/decode',title:'环境监测-文件解密',component: resolve => require(['./business_modules/monitoring_system_setting/decode.vue'], resolve)},	
	{path:'/areaPos',name:'areaPos',title:'环境监测-区域类型/位置类型配置',component: resolve => require(['./business_modules/monitoring_system_setting/areaPosSetting'], resolve)},
	{path:'/setting/areaSetting',name: 'areaSetting',title:'环境监测-区域配置',component: resolve => require(['./business_modules/monitoring_system_setting/areasetting.vue'], resolve)},
	{path:'/setting/areaRule',name: 'areaRule',title: '环境监测-区域规则配置',component: resolve => require(['./business_modules/monitoring_system_setting/areaRule.vue'], resolve)},
	//环境监测-- page_edit 页面编辑类
	{path:'/setting/list',name:'list',title:'环境监测-列表编辑',component: resolve => require(['./business_modules/monitoring_page_edit/setList.vue'], resolve)},
	{path:'/setting/line',name:'setting/line',title:'环境监测-曲线编辑',component: resolve => require(['./business_modules/monitoring_page_edit/setLine.vue'], resolve)},
	{path:'/setting/import',name: 'import',title:'环境监测-模拟图上传',component: resolve => require(['./business_modules/monitoring_page_edit/import.vue'], resolve)},
	//环境监测-- control_system 控制类
	{path:'/watching-index/logic',name:'logic',title:'环境监测-控制逻辑、情景模式',component: resolve => require(['./business_modules/monitoring_control_system/relation.vue'], resolve)},
	{path:'/watching-index/windwatt',name: 'windwatt',title:'环境监测-风瓦电闭锁',component: resolve => require(['./business_modules/monitoring_control_system/windwatt.vue'], resolve)},
	{path:'/watching-index/handle',name:'handle',title:'环境监测-手动操作',component: resolve => require(['./business_modules/monitoring_control_system/handle.vue'], resolve)},
	//环境监测-- real_list 实时列表类
	{path:'/watching-index/nowtime',name: 'nowtime',title:'环境监测-列表-实时数据',component: resolve => require(['./business_modules/monitoring_real_list/nowtime.vue'], resolve)},
	{path:'/watching-index/nowtimestate/:aname',name: 'nowtimestate',title:'列环境监测-列表-报警列表',component: resolve => require(['./business_modules/monitoring_real_list/nowtimestate.vue'], resolve)},
	{path:'/watching-index/sensorcall',name:'sensorcall',title:'列环境监测-列表-调用',component: resolve => require(['./business_modules/monitoring_real_list/sensorcall.vue'], resolve)},
	{path:'/watching-index/statechange',name:'statechange',title:'环境监测-列表-状态变动',component: resolve => require(['./business_modules/monitoring_real_list/statechange.vue'], resolve)},
	{path:'/watching-index/inspectiontest',name:'inspectiontest',title:'环境监测-列表-巡检测试',component: resolve => require(['./business_modules/monitoring_real_list/inspectiontest.vue'], resolve)},
	{path:'/watching-index/scroll',name: 'scroll',title:'环境监测-列表-大屏显示',component: resolve => require(['./business_modules/monitoring_real_list/scroll.vue'], resolve)},

	//环境监测-- chart 图形图表类
	{path:'/analogCurve/:aname',name:'analogCurve',title:'模拟量曲线-实时调用、报警、断电、馈电',component: resolve => require(['./business_modules/monitoring_chart/analogCurve.vue'], resolve)},
	{path:'/historyLine/:aname',name:'historyLine',title:'模拟量曲线-历史',component: resolve => require(['./business_modules/monitoring_chart/historycurve.vue'], resolve)},
	{path:'/watching-index/switch-data/:aname',name:'watching-index/switch-data',title:'开关量-实时状态',component: resolve => require(['./business_modules/monitoring_chart/switchstate.vue'], resolve)},
	{path:'/watching-index/switchHistoryLine/:aname',name:'switchHistoryLine',title:'开关量-历史状态',component: resolve => require(['./business_modules/monitoring_chart/historystate.vue'], resolve)},
	{path:'/watching-index/bar',name:'bar',title:'开关量-开机效率',component: resolve => require(['./business_modules/monitoring_chart/workpiece.vue'], resolve)},
	{path:'/gastime/:aname',name:'gastime',title: '瓦斯抽放-实时曲线',component: resolve => require(['./business_modules/monitoring_chart/gastime.vue'], resolve)},
	{path:'/gashistory/:aname',name:'gashistory',title: '瓦斯抽放-历史曲线',component: resolve => require(['./business_modules/monitoring_chart/gashistory.vue'], resolve)},
	//环境监测-- gas_drainage 瓦斯抽放类
	{path:'/drainage-index/actual',name:'actual',title:'瓦斯抽放-实时数据',component: resolve => require(['./business_modules/gas_drainage/actual.vue'], resolve)},
	{path:'/drainage-index/sample',name:'drainage-index/sample',title:'瓦斯抽放-抽样测点管理',component: resolve => require(['./business_modules/gas_drainage/momentflow.vue'], resolve)},
	{path:'/drainage-index/inquire',name:'inquire',title:'瓦斯抽放-报表',component: resolve => require(['./business_modules/gas_drainage/inquire.vue'], resolve)},    
	{path:'/drainage-index/cumulant',name: 'cumulant',title:'瓦斯抽放-累计量',component: resolve => require(['./business_modules/gas_drainage/cumulant.vue'], resolve)},
	//环境监测-- 打印查询类
	{path:'/printEdit',name:'printEdit',title:'环境监测-打印编辑',component: resolve => require(['./business_modules/monitoring_search/printEdit'], resolve)},
	{path:'/watching-index/dense',name:'dense',title:'环境监测-密采记录查询',component: resolve => require(['./business_modules/monitoring_search/dense.vue'], resolve)},
	{path:'/analyze/:aname',name:'/watching-index/analyze',title: '环境监测-查询和统计',component: resolve => require(['./business_modules/monitoring_search/analyze.vue'], resolve)},
	{path:'/mcall/:aname',name:'watching-index/mcall',title:'环境监测-调用查询打印',component: resolve => require(['./business_modules/monitoring_search/mcall.vue'], resolve)},
	{path:'/watching-index/guide',name:'guide',title: '环境监测-帮助文档',component: resolve => require(['./business_modules/monitoring_search/guide.vue'], resolve)}, 
	
	/***************************************** 通用模块 *******************************************************************/
	{path:'/setting/role',name: 'role',title: '角色管理',component: resolve => require(['./common_modules/role/role.vue'], resolve)},
	{path:'/setting/user',name: 'user',title: '用户管理',component: resolve => require(['./common_modules/user/user.vue'], resolve)},
	{path:'/setting/scanLog',name:'log',title:'操作日志',component: resolve => require(['./common_modules/log/scanLog.vue'], resolve)},
	{path:'/route-index/schedule',name:'schedule',title:'人员定位-班次配置',component: resolve => require(['./common_modules/scheduleSetting/schedule.vue'], resolve)},
	{path:'/setting/timeSetting',name:'timeSetting',title:'环境监测-班次配置',component: resolve => require(['./common_modules/scheduleSetting/timesetting.vue'], resolve)},
	//重定向到首页
	{path:'/', redirect: {path:'/home',name:'home_index',query:{type:'scan'}}},
	{path:'/login',name: 'login',component: resolve => require(['./common_modules/login/login.vue'], resolve)},
	{path:'/locking',name: 'locking',component: resolve => require(['./common_modules/lock_page/locking-page.vue'], resolve)},
	{path:'/500',name: 'error_500',component: resolve => require(['./common_modules/error_page/500.vue'], resolve)},
	{path:'/401',name: 'error_401',component: resolve => require(['./common_modules/error_page/401.vue'], resolve)},
	{path:'/*',name: 'error_404',component: resolve => require(['./common_modules/error_page/404.vue'], resolve)}	
]; 
