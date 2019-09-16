/*游戏管理*/
import { State as _JinhuaMatchRulesState } from './modules/gameManager/jinhuaMatchRules'
import { State as _JinhuaMatchStagesState } from './modules/gameManager/jinhuaMatchStages'
import { State as _NiuniuMatchRulesState } from './modules/gameManager/niuniuMatchRules'
import { State as _NiuniuMatchStagesState } from './modules/gameManager/niuniuMatchStages'
import { State as _BrnnMatchRulesState } from './modules/gameManager/brnnMatchRules'
import { State as _BrnnMatchStagesState } from './modules/gameManager/brnnMatchStages'
import { State as _BuyuMatchRulesState } from './modules/gameManager/buyuMatchRules'
import { State as _BuyuMatchStagesState } from './modules/gameManager/buyuMatchStages'
import { State as _HongheiMatchRulesState } from './modules/gameManager/hongheiMatchRules'
import { State as _HongheiMatchStagesState } from './modules/gameManager/hongheiMatchStages'
import { State as _ErmjMatchRulesState } from './modules/gameManager/ermjMatchRules'
import { State as _ErmjMatchStagesState } from './modules/gameManager/ermjMatchStages'
import { State as _LonghuMatchRulesState } from './modules/gameManager/longhuMatchRules'
import { State as _LonghuMatchStagesState } from './modules/gameManager/longhuMatchStages'
import { State as _DoudizhuMatchRulesState } from './modules/gameManager/doudizhuMatchRules'
import { State as _DoudizhuMatchStagesState } from './modules/gameManager/doudizhuMatchStages'
import { State as _DezhoupukeMatchRulesState } from './modules/gameManager/dezhoupukeMatchRules'
import { State as _DezhoupukeMatchStagesState } from './modules/gameManager/dezhoupukeMatchStages'
import { State as _QianghongbaoMatchRulesState } from './modules/gameManager/qianghongbaoMatchRules'
import { State as _QianghongbaoMatchStagesState } from './modules/gameManager/qianghongbaoMatchStages'
import { State as _ErbagangMatchRulesState } from './modules/gameManager/erbagangMatchRules'
import { State as _ErbagangMatchStagesState } from './modules/gameManager/erbagangMatchStages'
import { State as _DuofuduocaiMatchRulesState } from './modules/gameManager/duofuduocaiMatchRules'
import { State as _DuofuduocaiMatchStagesState } from './modules/gameManager/duofuduocaiMatchStages'
import { State as _MajiangMatchRulesState } from './modules/gameManager/majiangMatchRules'
import { State as _MajiangMatchStagesState } from './modules/gameManager/majiangMatchStages'
import { State as _SuohaMatchRulesState } from './modules/gameManager/suohaMatchRules'
import { State as _SuohaMatchStagesState } from './modules/gameManager/suohaMatchStages'
import { State as _taxDivisionSetting } from './modules/agentManager/taxDivisionSetting'
import { State as _PaodekuaiMatchRulesState } from './modules/gameManager/paodekuaiMatchRules'
import { State as _PaodekuaiMatchStagesState } from './modules/gameManager/paodekuaiMatchStages'
import { State as _JDNiuniuMatchRulesState } from './modules/gameManager/jdniuniuMatchRules'
import { State as _JDNiuniuMatchStagesState } from './modules/gameManager/jdniuniuMatchStages'

/** 代理周期结算设置 */
import { State as _settlementCycle } from './modules/agentManager/settlementCycle'
/** 代理查询 */
import { State as _agentQueryModel } from './modules/agentManager/agentQueryModel'
/** 代理操作 */
import { State as _agentModel } from './modules/agentManager/agentManager'
/** 下拉框等一些初始值的初始化 */
import { State as _libInitVal } from './modules/agentManager/libInitVal'
export type AgentQueryModel = _agentQueryModel
export type AgentModel = _agentModel
export type SettlementCycle = _settlementCycle

export type JDNiuniuMatchRulesState = _JDNiuniuMatchRulesState
export type JDNiuniuMatchStagesState = _JDNiuniuMatchStagesState
export type PaodekuaiMatchRulesState = _PaodekuaiMatchRulesState
export type PaodekuaiMatchStagesState = _PaodekuaiMatchStagesState
export type BuyuMatchRulesState = _BuyuMatchRulesState
export type BuyuMatchStagesState = _BuyuMatchStagesState
export type NiuniuMatchRulesState = _NiuniuMatchRulesState
export type NiuniuMatchStagesState = _NiuniuMatchStagesState
export type BrnnMatchRulesState = _BrnnMatchRulesState
export type BrnnMatchStagesState = _BrnnMatchStagesState
export type JinhuaMatchRulesState = _JinhuaMatchRulesState
export type JinhuaMatchStagesState = _JinhuaMatchStagesState
export type HongheiMatchRulesState = _HongheiMatchRulesState
export type HongheiMatchStagesState = _HongheiMatchStagesState
export type ErmjMatchRulesState = _ErmjMatchRulesState
export type ErmjMatchStagesState = _ErmjMatchStagesState
export type LonghuMatchRulesState = _LonghuMatchRulesState
export type LonghuMatchStagesState = _LonghuMatchStagesState
export type DoudizhuMatchRulesState = _DoudizhuMatchRulesState
export type DoudizhuMatchStagesState = _DoudizhuMatchStagesState
export type DezhoupukeMatchRulesState = _DezhoupukeMatchRulesState
export type DezhoupukeMatchStagesState = _DezhoupukeMatchStagesState
export type QianghongbaoMatchRulesState = _QianghongbaoMatchRulesState
export type QianghongbaoMatchStagesState = _QianghongbaoMatchStagesState
export type ErbagangMatchRulesState = _ErbagangMatchRulesState
export type ErbagangMatchStagesState = _ErbagangMatchStagesState
export type DuofuduocaiMatchRulesState = _DuofuduocaiMatchRulesState
export type DuofuduocaiMatchStagesState = _DuofuduocaiMatchStagesState
export type MajiangMatchRulesState = _MajiangMatchRulesState
export type MajiangMatchStagesState = _MajiangMatchStagesState
export type SuohaMatchRulesState = _SuohaMatchRulesState
export type SuohaMatchStagesState = _SuohaMatchStagesState
export type TaxDivisionSetting = _taxDivisionSetting
export type LibInitVal = _libInitVal

/*日志查询*/
import { State as _LoginLogState } from './modules/logManager/loginLog'
import { State as _GameLogState } from './modules/logManager/gameLog'
import { State as _JinhuaGameLogState } from './modules/logManager/jinhuaGameLog'
import { State as _TransferLogState } from './modules/logManager/transferLog'
import { State as _RecoverSection } from './modules/logManager/riskControlLog/recoverSection'
import { State as _QznnGameLogState } from './modules/logManager/qznnGameLog'
import { State as _BrnnGameLogState } from './modules/logManager/brnnGameLog'
import { State as _XuezhanGameLogState } from './modules/logManager/xuezhanGameLog'
import { State as _SuohaGameLogState } from './modules/logManager/suohaGameLog'
import { State as _DoudizhuGameLogState } from './modules/logManager/doudizhuGameLog'
import { State as _DezhoupukeGameLogState } from './modules/logManager/dezhoupukeGameLog'
import { State as _QianghongbaoGameLogState } from './modules/logManager/qianghongbaoGameLog'
import { State as _ErbagangGameLogState } from './modules/logManager/erbagangGameLog'
import { State as _DuofuduocaiGameLogState } from './modules/logManager/duofuduocaiGameLog'
import { State as _HongheiGameLogState } from './modules/logManager/hongheiGameLog'
import { State as _ErmjGameLogState } from './modules/logManager/ermjGameLog'
import { State as _LonghuGameLogState } from './modules/logManager/longhuGameLog'
import { State as _BuyuGameLogState } from './modules/logManager/buyuGameLog'
import { State as _UpPointLogState } from './modules/logManager/riskControlLog/upPoint'
import { State as _BackstageLoginlog } from './modules/logManager/backstageLoginlog'

import { State as _JdnnGameLogState } from './modules/logManager/jdnnGameLog'
import { State as _PaodekuaiGameLogState } from './modules/logManager/paodekuaiGameLog'

export type JdnnGameLogState = _JdnnGameLogState
export type PaodekuaiGameLogState = _PaodekuaiGameLogState
export type LoginLogState = _LoginLogState
export type GameLogState = _GameLogState
export type JinhuaGameLogState = _JinhuaGameLogState
export type QznnGameLogState = _QznnGameLogState
export type BrnnGameLogState = _BrnnGameLogState
export type XuezhanGameLogState = _XuezhanGameLogState
export type SuohaGameLogState = _SuohaGameLogState
export type DoudizhuGameLogState = _DoudizhuGameLogState
export type DezhoupukeGameLogState = _DezhoupukeGameLogState
export type QianghongbaoGameLogState = _QianghongbaoGameLogState
export type ErbagangGameLogState = _ErbagangGameLogState
export type DuofuduocaiGameLogState = _DuofuduocaiGameLogState
export type HongheiGameLogState = _HongheiGameLogState
export type ErmjGameLogState = _ErmjGameLogState
export type LonghuGameLogState = _LonghuGameLogState
export type BuyuGameLogState = _BuyuGameLogState
export type TransferLogState = _TransferLogState
export type RecoverSection = _RecoverSection
export type UpPointLogState = _UpPointLogState
export type BackstageLoginlog = _BackstageLoginlog

/* 游戏设置 */
import { State as _SmsValidate } from './modules/gameSetting/smsValidate'
import { State as _Register } from './modules/gameSetting/register'
import { State as _AllowLoginIP } from './modules/gameSetting/allowLoginIP'
import { State as _StopServer } from './modules/gameSetting/stopServer'
import { State as _GameLobbyMarquee } from './modules/gameSetting/gameLobbyMarquee'
import { State as _FullMarquee } from './modules/gameSetting/fullMarquee'
import { State as _Billboard } from './modules/gameSetting/billboard'
import { State as _Faq } from './modules/gameSetting/faq'
import { State as _Robot } from './modules/gameSetting/robot'
import { State as _RechargeCfg } from './modules/gameSetting/rechargeCfg'
import { State as _WithdrawCfg } from './modules/gameSetting/withdrawCfg'
import { State as _NewBieBonus } from './modules/gameSetting/newBieBonus'
import { State as _BindBonus } from './modules/gameSetting/bindBonus'
import { State as _Dictionary } from './modules/gameSetting/dictionary'
import { State as _SubGameSwitch } from './modules/gameSetting/subGameSwitch'
import { State as _SubGlobalConfig } from './modules/gameSetting/subGlobalConfig'
import { State as _BlackList } from './modules/gameSetting/blackList'
import { State as _Report } from './modules/gameSetting/report'
import { State as _SubWhiteList } from './modules/gameSetting/subWhiteList'
import { State as _FakeLocation } from './modules/gameSetting/fakeLocation'
import { State as _JushangConfig } from './modules/gameSetting/jushangConfig'
import { State as _Iap } from './modules/gameSetting/iap'
import { State as _MailManager } from './modules/gameSetting/mailManager'

import { State as _ChannelBusiness } from './modules/gameSetting/channelBusiness'
import { State as _PersonWaterCfg } from './modules/gameSetting/personWaterCfg'
import { State as _IpTable } from './modules/gameSetting/ipTable'
import { State as _LocationRWRule } from './modules/gameSetting/locationRWRule'
export type LocationRWRule = _LocationRWRule
export type Register = _Register
export type SmsValidate = _SmsValidate
export type Robot = _Robot
export type RechargeCfg = _RechargeCfg
export type WithdrawCfg = _WithdrawCfg
export type PersonWaterCfg = _PersonWaterCfg
export type IpTable = _IpTable
export type NewBieBonus = _NewBieBonus
export type BindBonus = _BindBonus
export type Dictionary = _Dictionary
export type SubGameSwitch = _SubGameSwitch
export type SubGlobalConfig = _SubGlobalConfig
export type BlackList = _BlackList
export type Report = _Report
export type SubWhiteList = _SubWhiteList
export type FakeLocation = _FakeLocation
export type JushangConfig = _JushangConfig
export type Iap = _Iap
export type AllowLoginIP = _AllowLoginIP
export type StopServer = _StopServer
export type GameLobbyMarquee = _GameLobbyMarquee
export type FullMarquee = _FullMarquee
export type BillboardState = _Billboard
export type FaqState = _Faq
export type MailManagerState = _MailManager
export type ChannelBusiness = _ChannelBusiness

/** 交易管理 */
import { State as _OnlineChargeState } from './modules/transactionManager/onlineCharge'
import { State as _OfficialWithdrawState } from './modules/transactionManager/officialWithdraw'
import { State as _AgentChargeState } from './modules/transactionManager/agentCharge'
import { State as _TaobaoWithdrawState } from './modules/transactionManager/taobaoWithdraw'
//购物支付-cn
import { State as _BuyWithdrawState } from './modules/transactionManager/buyWithdraw'
//代付订单
import { State as _PayWithdrawState } from './modules/transactionManager/payWithdraw'
import { State as _RechargeCallback } from './modules/transactionManager/rechargeCallback'

import { State as _RechargeQuestionState } from './modules/transactionManager/rechargeQuestion'

export type OnlineChargeState = _OnlineChargeState
export type OfficialWithdrawState = _OfficialWithdrawState
export type AgentChargeState = _AgentChargeState
export type TaobaoWithdrawState = _TaobaoWithdrawState
//购物支付-cn
export type BuyWithdrawState = _BuyWithdrawState
//代付订单
export type PayWithdrawState = _PayWithdrawState
export type RechargeCallback = _RechargeCallback
export type RechargeQuestionState = _RechargeQuestionState

/** 兑换管理 */
import { State as _AgentWithdrawInfo } from './modules/withdrawManager/agentWithdrawInfo'
import { State as _AgentDetail } from './modules/withdrawManager/agentDetail'
import { State as _AgentException } from './modules/withdrawManager/agentException'
import { State as _AgentOverview } from './modules/withdrawManager/agentOverview'
import { State as _WithdrawReview } from './modules/withdrawManager/withdrawReview'
import { State as _WithdrawList } from './modules/withdrawManager/withdrawList'
import { State as _MerchantOrders } from './modules/withdrawManager/merchantOrders'

export type AgentWithdrawInfoState = _AgentWithdrawInfo
export type AgentDetailState = _AgentDetail
export type AgentExceptionState = _AgentException
export type AgentOverviewState = _AgentOverview
export type WithdrawReview = _WithdrawReview
export type WithdrawList = _WithdrawList
export type MerchantOrders = _MerchantOrders

/*首页*/
import { State as _AdminHome } from './modules/home/adminHome'
import { State as _BusinessHome } from './modules/home/businessHome'
export type AdminHome = _AdminHome
export type BusinessHome = _BusinessHome

/*用户信息*/
import { State as _GeneralUser } from './modules/userManager/generalUser'
import { State as _BusinessUser } from './modules/userManager/businessUser'
import { State as _Attribution } from './modules/userManager/userAttribution'
import { State as _UserForbidden } from './modules/userManager/userForbidden'
import { State as _UserCreate } from './modules/userManager/userCreate'
export type GeneralUser = _GeneralUser
export type BusinessUser = _BusinessUser
export type Attribution = _Attribution
export type UserForbidden = _UserForbidden
export type UserCreate = _UserCreate

import { State as _OnlineUser } from './modules/userManager/onlineUser'
export type OnlineUser = _OnlineUser
/*数据统计*/
import { State as _TotalStaticState } from './modules/dataStatic/totalStatic'
import { State as _TodayStaticState } from './modules/dataStatic/todayStatic'
import { State as _PlayerRetentionState } from './modules/dataStatic/playerRetention'
import { State as _GameRetentionState } from './modules/dataStatic/gameRetention'
import { State as _UserWinLoseState } from './modules/dataStatic/userWinLose'
import { State as _OnlineGraphState } from './modules/dataStatic/onlineStatic/onlineGraph'
import { State as _ChannelInfoState } from './modules/dataStatic/channelInfo'
export type ChannelInfoState = _ChannelInfoState
import { State as _WithdrawMonitorState } from './modules/dataStatic/withdrawMonitor'
import { State as _OnlineTableState } from './modules/dataStatic/onlineStatic/onlineTable'

export type TotalStaticState = _TotalStaticState
export type TodayStaticState = _TodayStaticState
export type PlayerRetentionState = _PlayerRetentionState
export type GameRetentionState = _GameRetentionState
export type UserWinLoseState = _UserWinLoseState
export type OnlineGraphState = _OnlineGraphState
export type OnlineTableState = _OnlineTableState
export type WithdrawMonitorState = _WithdrawMonitorState

/**管理员信息 */
import { State as _AdminUserManagerState } from './modules/adminUserManager/adminUserManager'
import { State as _RoleEditState } from './modules/adminUserManager/roleEdit'
import { State as _AllowLoginIpState } from './modules/adminUserManager/allowLoginIp'

export type AllowLoginIpState = _AllowLoginIpState
export type RoleEditState = _RoleEditState
export type AdminUserManagerState = _AdminUserManagerState

/** 渠道管理 */
import { State as _ChannelGroupState } from './modules/channelManager/channelGroup'
import { State as _ChannelDiscountState } from './modules/channelManager/channelDiscount'
import { State as _BillingAuditState } from './modules/channelManager/billingAudit'
import { State as _SettlementAccountManagementState } from './modules/channelManager/settlementAccountManagement'
import { State as _ChannelAccountState } from './modules/channelManager/channelAccountMgr/channelAccount'
import { State as _ChannelRelationState } from './modules/channelManager/channelAccountMgr/channelRelation'
import { State as _ChannelShieldState } from './modules/channelManager/channelAccountMgr/channelShield'
import { State as _BalanceMgrState } from './modules/channelManager/balanceMgr'
import { State as _BalanceCfgState } from './modules/channelManager/balanceCfg'

export type ChannelGroupState = _ChannelGroupState
export type ChannelDiscountState = _ChannelDiscountState
export type BillingAuditState = _BillingAuditState
export type SettlementAccountManagementState = _SettlementAccountManagementState
export type ChannelAccountState = _ChannelAccountState
export type ChannelRelationState = _ChannelRelationState
export type ChannelShieldState = _ChannelShieldState
export type BalanceMgrState = _BalanceMgrState
export type BalanceCfgState = _BalanceCfgState

import { State as _SelfInfoState } from './modules/selfInfo/selfInfo'

export type SelfInfoState = _SelfInfoState

import { State as _AgentMgrState } from './modules/agentMgr/agentMgr'
import { State as _SpreadDayTableState } from './modules/agentMgr/spreadDayTable'
import { State as _SpreadMonthTableState } from './modules/agentMgr/spreadMonthTable'
import { State as _AgentTotalDataState } from './modules/agentMgr/agentTotalData'
import { State as _AgentTaxSettingState } from './modules/agentMgr/agentTaxSetting'
import { State as _AgencyCfgState } from './modules/agentMgr/agencyCfg'
import { State as _AgentWithdrawOrderState } from './modules/agentMgr/agentWithdrawOrder'
import { State as _GroupRelationState } from './modules/agentMgr/groupRelation'
import { State as _TempletState } from './modules/agentMgr/templet'
import { State as _SpreadSettingState } from './modules/agentMgr/spreadSetting'
import { State as _AgentTaxInfoState } from './modules/agentMgr/agentTaxInfo'
import { State as _IncomeDetail } from './modules/agentMgr/incomeDetail'

import { State as _GameEachDayUserWinAndLoseState } from './modules/gameManager/gameEachDayUserWinAndLose'

export type AgentMgrState = _AgentMgrState
export type SpreadDayTableState = _SpreadDayTableState
export type SpreadMonthTableState = _SpreadMonthTableState
export type AgentTotalDataState = _AgentTotalDataState
export type AgentTaxSettingState = _AgentTaxSettingState
export type AgencyCfgState = _AgencyCfgState
export type AgentWithdrawOrderState = _AgentWithdrawOrderState
export type GroupRelationState = _GroupRelationState
export type TempletState = _TempletState
export type SpreadSettingState = _SpreadSettingState
export type AgentTaxInfoState = _AgentTaxInfoState
export type IncomeDetail = _IncomeDetail

export type GameEachDayUserWinAndLoseState = _GameEachDayUserWinAndLoseState
