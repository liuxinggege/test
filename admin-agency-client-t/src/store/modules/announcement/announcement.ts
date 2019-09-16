import { getAnnouncementList,readAgencyBillboard } from '../../../api/agent/announcement/announcement'
import { Commit } from 'vuex'
import { xutil } from '../../../utils/xutil';

export interface State {
	announcementList: AnnouncementType[]
	code: number
	totalCount: number
	gonggaoRedDot:boolean
	gonglueRedDot:boolean
	msg?: string
	err?: string
}

export interface AnnouncementType {
	title:string,
	url:string,
	content:string,
	createTime:Date,
	redDot:boolean,
}
// initial state
const state: State = {
	announcementList: [],
	code: 0,
	totalCount: 0,
	gonggaoRedDot: false,
	gonglueRedDot: false,
	msg:"",
	err:""
}

const mutations = {

	SET_GETGONGGAOLIST: (state: State, result: any) => {
		state.code = result.code;
		let billboardRecord = JSON.parse(<any>sessionStorage.getItem("billboardRecord"));
		state.announcementList = result.msg.pageData.map(e=>{
			if(e.createTime){
				let date = new Date(e.createTime)
				e.createTime = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')
			}
			e.redDot = true;
			billboardRecord.forEach(element => {
				if(element===e._id){
					e.redDot=false;
				}
			});
			if(e.redDot){
				state.gonggaoRedDot = true;
			}
			return e;
		});
		state.totalCount = result.msg.totalCount;
	},
	SET_GETGONGLUELIST: (state: State, result: any) => {
		state.code = result.code;
		let billboardRecord = JSON.parse(<any>sessionStorage.getItem("billboardRecord"));
		state.announcementList = result.msg.pageData.map(e=>{
			if(e.createTime){
				let date = new Date(e.createTime)
				e.createTime = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')
			}
			e.redDot = true;
			billboardRecord.forEach(element => {
				if(element===e._id){
					e.redDot=false;
				}
			});
			if(e.redDot){
				state.gonglueRedDot = true;
			}
			return e;
		});
		state.totalCount = result.msg.totalCount;
	},
	SET_ERROR: (state: State, result: any) => {
		state.code = result.code;
		state.err = result.err;
	},
	SET_CODE: (state: State, result: any) => {
		state.code = result.code;
	},
}
// actions
const actions = {

	GetGonggaoAnnouncementList(context: { commit: Commit, state: State },data:any) {
		return new Promise(async (resolve, reject) => {
			getAnnouncementList(data).then(response => {
				context.commit('SET_GETGONGGAOLIST', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	GetGonglueAnnouncementList(context: { commit: Commit, state: State },data:any) {
		return new Promise(async (resolve, reject) => {
			getAnnouncementList(data).then(response => {
				context.commit('SET_GETGONGLUELIST', response.data)
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
	ReadAgencyBillboard(context: { commit: Commit, state: State },data:any) {
		return new Promise(async (resolve, reject) => {
			readAgencyBillboard(data).then(response => {
				context.commit('SET_CODE', response.data)
                xutil.sessionStorageSetItem("billboardRecord", response.data.msg.agencyBillboards);
				resolve()
			}).catch(error => {
				console.error("catch", error)
				context.commit('SET_ERROR', error)
				resolve()
			})
		});
	},
}
export default {
	state,
	// getters,
	actions,
	mutations
}
