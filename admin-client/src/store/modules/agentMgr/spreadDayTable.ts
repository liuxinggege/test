import { getSpreadDayTable, getSpreadDayTableExcel, getSpreadDayTotal } from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
	spreadDayTableDatas: Agent[],
	totalStaticData: any,
	agentList: Agent[],
	code?: number,
	msg?: any,
	totalCount?: number
}

export interface Agent {
	userName: String,  //名字
	account: String, //账号
	pwd: String, //密码
	uid: String,  //ID
	IP: String,  //绑定IP
	QQ: String,  //QQ号码
	mobileNum: String, //手机号码
	remarks: String, //当前代理的描述
	taxRate: any, //自己的税收利润比
	downTaxRate: any, //下级利润比
	category: any, //类别：1----后台   2-------代理
	status: any,//状态：1---待审核   20----已审核   30----已审核（有效的） 40----冻结  99-----删除数据（逻辑删除）
	parentUid: String, //父级ID
	tgUrl: string,//  推广地址
	QRCode: string,//二维码
	xcyUrl: string,//宣传页
	gameId: string,//游戏ID
	imgQRCode: string,
	grade: any,
	platform: string,
	createTime: any,
	settlementSetting: {
		name: string,
		val: any
	},
	settlementTime: String,//结算时间
	settlementStatus: any,//结算状态： 10----手动结算   20----自动结算    30----停止结算
	hystereticDays: any,//滞压天数
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
	totalStaticData: {},
	spreadDayTableDatas: [],
	agentList: [],
	totalCount: 0,
}

const mutations = {

	CLEAR_CODE_SPREADATTABLE: (state: State) => {
		state.code = 0;
	},

	SET_GETSPREADDAYTABLE: (state: State, result: any) => {
		state.code = result.code;
		state.spreadDayTableDatas = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
	},
	SET_GETSPREADDAYTTOTAL: (state: State, result: any) => {
		state.code = result.code;
		state.totalStaticData = result.msg;
	},

	SET_GETALLAGENCYSTAT: (state: State, result: State) => {
		state.code = result.code;
		state.totalStaticData = result.msg;
	},

}
// actions
const actions = {

	GetSpreadDayTable(context: { commit: Commit, state: State }, agent: Agent) {//pageData用
		return new Promise(async (resolve, reject) => {
			getSpreadDayTable(agent).then(response => {
				context.commit('SET_GETSPREADDAYTABLE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetSpreadDayTotal(context: { commit: Commit, state: State }, agent: Agent) {//pageData用
		return new Promise(async (resolve, reject) => {
			getSpreadDayTotal(agent).then(response => {
				context.commit('SET_GETSPREADDAYTTOTAL', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetSpreadDayTableExcel(context: { commit: Commit, state: State }, agent: Agent) {//pageData用
		return new Promise(async (resolve, reject) => {
			getSpreadDayTableExcel(agent).then(response => {
				resolve(response.data);
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

}
export default {
	state,
	actions,
	mutations
}
