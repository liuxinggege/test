import { addAgent, getAgetList, updateAgent, updateAgentSettlementSetting } from "../../../../src/api/admin/agent/manager"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
	agent: Agent,
	agentList: Agent[],
	code?: number,
	msg?: any,
	total?: number
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
	agent: {
		userName: "",
		account: "",
		pwd: "",
		uid: "",
		IP: "",
		QQ: "",
		mobileNum: "",
		remarks: "",
		taxRate: null,
		downTaxRate: null,
		category: 2,
		status: 1,
		parentUid: "",
		tgUrl: "",
		QRCode: "",
		xcyUrl: "",
		gameId: "",
		imgQRCode: "",
		grade: null,
		platform: "",
		createTime: null,
		settlementSetting: {
			name: "",
			val: null
		},
		settlementTime: "",
		settlementStatus: null,
		hystereticDays: null
	},
	agentList: [],
	total: 0,
}

const mutations = {
	SET_INITAGENT: (state: State, data: Agent) => {
		state.agent = data
	},
	SET_ADDAGENTRESULT: (state: State, result: State) => {
		state.code = result.code;
		state.msg = result.msg;
	},
	SET_ADDAGENTLISTRESULT: (state: State, result: State) => {
		state.code = result.code;
		state.agentList = result.msg;
		state.total = result.total;
	},
}
// actions
const actions = {
	initAgentVal(context: { commit: Commit, state: State }) {
		return new Promise(async (resolve, reject) => {
			context.commit('SET_INITAGENT', {
				userName: "",
				account: "",
				pwd: "",
				uid: "",
				IP: "",
				QQ: "",
				mobileNum: "",
				remarks: "",
				taxRate: null,
				downTaxRate: null,
				category: 2,
				status: 1,
				parentUid: "",
			})
		});
	},
	addAgent(context: { commit: Commit, state: State }, agent: Agent) {
		return new Promise(async (resolve, reject) => {
			addAgent(agent).then(response => {
				context.commit('SET_ADDAGENTRESULT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	updateAgentSettlementSetting(context: { commit: Commit, state: State }, agent: Agent) {
		if (agent.tgUrl == null) {
			agent.tgUrl = "";
		}
		return new Promise(async (resolve, reject) => {
			updateAgentSettlementSetting(agent).then(response => {
				context.commit('SET_ADDAGENTRESULT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	updateAgent(context: { commit: Commit, state: State }, agent: Agent) {
		if (agent.tgUrl == null) {
			agent.tgUrl = "";
		}
		return new Promise(async (resolve, reject) => {
			updateAgent(agent).then(response => {
				context.commit('SET_ADDAGENTRESULT', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	getAgentList(context: { commit: Commit, state: State }, agentQueryModel: AgentQueryModel) {
		return new Promise(async (resolve, reject) => {
			getAgetList(agentQueryModel).then(response => {
				context.commit('SET_ADDAGENTLISTRESULT', response.data)
				resolve()
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
