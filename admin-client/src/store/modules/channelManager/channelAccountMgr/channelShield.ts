import {
	getChannelShield,
	addChannelShield,
	deleteChannelShield,
	editChannelShield,
	getChannelFather,
	fixAgencyChannelDomain,
	enableShieldByChannels,
	enableStatusJmpByChannels,
	enableBanMasterByChannels,
	enableReportAgentByChannels,
	enableRechargeEnforceByChannels,
	enableOnlineRechargeByChannels,
	enableLowerBonusByChannels,
	enableTyShieldByChannels,
	fixWXByBatch,
	changeManyChannelUrl,
	changeDomain,
	delDomain,
	getDownloadUrls,
	updateOneChannel,
	changeWeb,
	changeManyWeb
} from '../../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
export interface State {
	channelShieldData: any[]
	downloadUrlsData: any[]
	totalCount: number
	fatherChannels: any
	code: number
	msg: string
	getCode: number
	addCode: number
	eidtCode: number
	deleteCode: number
}

export interface channelShieldType {//登陆参数
	channel: string,
	status: number,
	web: string,
	father: string,
	type: string,
	state: number,
	downloadUrl: string,
}

// initial state
const state: State = {
	channelShieldData: [],
	downloadUrlsData: [],
	totalCount: 0,
	fatherChannels: 0,
	code: 0,
	msg: "",
	getCode: 0,
	addCode: 0,
	deleteCode: 0,
	eidtCode: 0,
}

const mutations = {
	CLEAR_CODE: (state: State) => {
		state.getCode = 0;
		state.addCode = 0;
		state.eidtCode = 0;
		state.deleteCode = 0;
		state.code = 0;
	},

	SET_GETCHANNELSHIELD: (state: State, result: any) => {
		state.channelShieldData = result.msg.data;
		state.totalCount = result.msg.totalCount;
		state.getCode = result.code
	},
	SET_GETDOWNLOADURLS: (state: State, result: any) => {
		state.downloadUrlsData = result.msg;
		state.totalCount = result.msg.totalCount;
		state.getCode = result.code
	},

	SET_ADDCHANNELSHIELD: (state: State, result: any) => {
		state.addCode = result.code
		state.msg = result.msg || result.err
	},

	SET_EDITCHANNELSHIELD: (state: State, result: any) => {
		state.eidtCode = result.code
		state.msg = result.msg || result.err
	},
	SET_DELETCHANNELSHIELD: (state: State, result: any) => {
		state.deleteCode = result.code
		state.msg = result.msg || result.err
	},

	SET_GETFATHERCHANNLE: (state: State, result: any) => {
		state.getCode = result.code
		state.fatherChannels = result.msg
	},
	SET_FIXAGENCYDOMAIN: (state: State, result: any) => {
		state.code = result.code
		state.msg = result.msg || result.err
	}

}
// actions
const actions = {
	FixAgencyChannelDomain(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			fixAgencyChannelDomain(data).then(response => {
				context.commit('SET_FIXAGENCYDOMAIN', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_FIXAGENCYDOMAIN', error)
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetChannelFather(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getChannelFather(data).then(response => {
				context.commit('SET_GETFATHERCHANNLE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},

	GetChannelShield(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getChannelShield(data).then(response => {
				context.commit('SET_GETCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	AddChannelShield(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			addChannelShield(data).then(response => {
				context.commit('SET_ADDCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				context.commit('SET_ADDCHANNELSHIELD', error)
				console.error("catch", error)
				resolve()
			})
		});
	},

	EditChannelShield(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			editChannelShield(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},



	DeleteChannelShield(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			deleteChannelShield(data).then(response => {
				context.commit('SET_DELETCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error);
				context.commit('SET_DELETCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableShieldByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableShieldByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableStatusJmpByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableStatusJmpByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableBanMasterByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableBanMasterByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableReportAgentByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableReportAgentByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableRechargeEnforceByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableRechargeEnforceByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableOnlineRechargeByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableOnlineRechargeByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableLowerBonusByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableLowerBonusByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	EnableTyShieldByChannels(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			enableTyShieldByChannels(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	FixWXByBatch(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			fixWXByBatch(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	ChangeDomain(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			changeDomain(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	ChangeWeb(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			changeWeb(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	ChangeManyWeb(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			changeManyWeb(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	DelDomain(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			delDomain(data).then(response => {
				context.commit('SET_EDITCHANNELSHIELD', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELSHIELD', error)
				resolve()
			})
		});
	},
	GetDownloadUrls(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getDownloadUrls(data).then(response => {
				context.commit('SET_GETDOWNLOADURLS', response.data)
				resolve()
			}).catch(error => {
				//console.error("catch", error)
				reject(error)
			})
		});
	}
}
export default {
	state,
	// getters,
	actions,
	mutations
}
