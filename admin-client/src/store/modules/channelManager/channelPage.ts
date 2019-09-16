import {
	changeManyChannelUrl,
	updateOneChannel,
	getDownloadUrls,
	changeDomain,
	getChannelPage,
} from '../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
export interface State {
	channelPageData: any[]
	downloadUrlsData: any[]
	totalCount: number
	fatherChannels: any
	code: number
	msg: string
	getCode: number
	eidtCode: number
}

// initial state
const state: State = {
	channelPageData: [],
	downloadUrlsData: [],
	totalCount: 0,
	fatherChannels: 0,
	code: 0,
	msg: "",
	getCode: 0,
	eidtCode: 0,
}

const mutations = {
	CLEAR_CODE: (state: State) => {
		state.getCode = 0;
		state.eidtCode = 0;
		state.code = 0;
	},

	SET_GETCHANNELPAGE: (state: State, result: any) => {
		state.channelPageData = result.msg.pageData;
		state.totalCount = result.msg.totalCount;
		state.getCode = result.code
	},
	SET_GETDOWNLOADURLS: (state: State, result: any) => {
		state.downloadUrlsData = result.msg;
		state.totalCount = result.msg.totalCount;
		state.getCode = result.code
	},

	SET_EDITCHANNELPAGE: (state: State, result: any) => {
		state.eidtCode = result.code
		state.msg = result.msg || result.err
	},

}
// actions
const actions = {
	GetChannelPage(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			getChannelPage(data).then(response => {
				context.commit('SET_GETCHANNELPAGE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	ChangeManyChannelUrl(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			changeManyChannelUrl(data).then(response => {
				context.commit('SET_EDITCHANNELPAGE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELPAGE', error)
				resolve()
			})
		});
	},
	UpdateOneChannel(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			updateOneChannel(data).then(response => {
				context.commit('SET_EDITCHANNELPAGE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELPAGE', error)
				resolve()
			})
		});
	},
	ChangeDomain(context: { commit: Commit, state: State }, data) {
		context.commit('CLEAR_CODE');
		return new Promise(async (resolve, reject) => {
			changeDomain(data).then(response => {
				context.commit('SET_EDITCHANNELPAGE', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_EDITCHANNELPAGE', error)
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
