import { getGroupRelation, addGroupRelation, deleteGroupRelation, updateGroupRelation , getLeaderList ,
		 getSubGroupRelation ,addSubGroupRelation , deleteSubGroupRelation, updateSubGroupRelation} from "../../../../src/api/admin/agentMgr/agentMgr"
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { AgentQueryModel } from '../../stateInterface';

export interface State {
	fatherData: leaderType[],
	sonData: leaderType[],
	leaderListData: any,
	code?: number,
	msg?: any,
	fatherTotalCount?: number,
	sonTotalCount ?: number,

}

export interface leaderType {
	adminAct: String,  //名字
	agencyId: String, //账号
	memberCount: String, //密码
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
	fatherData:[],
	sonData: [],
	fatherTotalCount: 0,
	sonTotalCount:0,
	leaderListData:0,
}

const mutations = {
	CLEAR_CODE_RELATION:(state:State)=>{
		state.code = 0;
	},

	SET_GETGROUPRELATION: (state: State, result: State) => {
		console.log("result.msg",result);
		state.code = result.code;
		state.fatherData = result.msg.pageData;
		state.fatherTotalCount = result.msg.totalCount;

		
	},

	SET_ADDGROUPRELATION: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
	SET_DELETEGROUPRELATION: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
	SET_UPDATEGROUPRELATION: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},

	SET_SUBGETGROUPRELATION: (state: State, result: State) => {
		state.code = result.code;
		state.sonData = result.msg.pageData;
		state.sonTotalCount = result.msg.totalCount;
	},

	SET_SUBADDGROUPRELATION: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
	SET_SUBDELETEGROUPRELATION: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},
	SET_SUBUPDATEGROUPRELATION: (state: State, result: any) => {
		state.code = result.code;
		state.msg = result.err;
	},

	SET_GETLEAADERLIST:(state :State , result: State) =>{
		state.code = result.code;
		state.leaderListData = result.msg;
	},
}
// actions
const actions = {
	

	GetLeaderList(context: { commit: Commit, state: State }) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			getLeaderList().then(response => {
				context.commit('SET_GETLEAADERLIST', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	GetGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			getGroupRelation(agent).then(response => {
				context.commit('SET_GETGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	AddGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			addGroupRelation(agent).then(response => {
				context.commit('SET_ADDGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	DeleteGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			deleteGroupRelation(agent).then(response => {
				context.commit('SET_DELETEGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	UpdateGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			updateGroupRelation(agent).then(response => {
				context.commit('SET_UPDATEGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},



	GetSubGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			getSubGroupRelation(agent).then(response => {
				context.commit('SET_SUBGETGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	AddSubGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			addSubGroupRelation(agent).then(response => {
				context.commit('SET_SUBADDGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	DeleteSubGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			deleteSubGroupRelation(agent).then(response => {
				context.commit('SET_SUBDELETEGROUPRELATION', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	UpdateSubGroupRelation(context: { commit: Commit, state: State }, agent: any) {
		context.commit('CLEAR_CODE_RELATION');
		return new Promise(async (resolve, reject) => {
			updateSubGroupRelation(agent).then(response => {
				context.commit('SET_SUBUPDATEGROUPRELATION', response.data)
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
