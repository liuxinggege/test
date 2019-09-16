
import { getUserList, getAgencyList } from '../../../api/agent/groupManage/groupManage'
import { CodeMsg } from '../..'
import { Commit } from 'vuex'


export interface State {
	userList: any[],
	userTotalCount?: number
	agencyList: any[],
	agencyTotalCount?: number
	code?: number,
	msg?: any,
}

type GetQueryModel = State;//获取结果JinhuaMatchRules

// initial state
const state: State = {
	userList: [],
	userTotalCount: 0,
	agencyList: [],
	agencyTotalCount: 0,
	msg: ""
}

const mutations = {

	SET_USERLIST: (state: State, result: CodeMsg<any>) => {
		state.code = result.code;
		if (result.code === 200) {
			if(result.msg.pageData){
				state.userList  = result.msg.pageData.map(e=>{
					let createDate = new Date(e.createDate);
					let month:any = createDate.getMonth()+1;
					let day:any = createDate.getDate();
					let hour:any = createDate.getHours();
					let minnutes:any = createDate.getMinutes();
					if(month<10){
						month="0"+month;
					}
					if(day<10){
						day="0"+day;
					}
					if(hour<10){
						hour="0"+hour;
					}
					if(minnutes<10){
						minnutes="0"+minnutes;
					}
					let date = 	[createDate.getFullYear(), month, day].join('-')
					date+=" "+hour+":"+minnutes;
					return {uid:e.uid,createDate:date,platform:e.platform,}
				})
			}else{
				state.userList = result.msg.pageData;
			}
			state.userTotalCount = result.msg.totalCount;
		} else {
			state.msg = result.msg || result.err;
		}
	},
	SET_AGENCYLIST: (state: State, result: CodeMsg<any>) => {
		state.code = result.code;
		if (result.code === 200) {
			if(result.msg.pageData){
				state.agencyList  = result.msg.pageData.map(e=>{
					let createDate;
					let loginDate;
					let date;
					let month;
					let day;
					let hour;
					let minnutes;
					if(e.createDate){
						date = new Date(e.createDate);
						month = date.getMonth()+1;
						day = date.getDate();
						hour = date.getHours();
						minnutes = date.getMinutes();
						if(month<10){
							month="0"+month;
						}
						if(day<10){
							day="0"+day;
						}
						if(hour<10){
							hour="0"+hour;
						}
						if(minnutes<10){
							minnutes="0"+minnutes;
						}
						createDate = 	[date.getFullYear(), month, day].join('-');
						createDate+=" "+hour+":"+minnutes;
					}else{
						createDate = e.createDate;
					}
					if(e.loginDate){
						date = new Date(e.loginDate);
						month = date.getMonth()+1;
						day = date.getDate();
						hour = date.getHours();
						minnutes = date.getMinutes();
						if(month<10){
							month="0"+month;
						}
						if(day<10){
							day="0"+day;
						}
						if(hour<10){
							hour="0"+hour;
						}
						if(minnutes<10){
							minnutes="0"+minnutes;
						}
						loginDate = 	[date.getFullYear(), month, day].join('-')
						loginDate+=" "+hour+":"+minnutes;
					}else{
						loginDate =e.loginDate
					}
					return {name: e.name,
						agencyId: e.agencyId,
						channel: e.channel,
						act: e.act,
						createDate: createDate,
						loginDate: loginDate,
						taxRate: e.taxRate,
						remarks: e.remarks,
					}
				})
			}else{
				state.agencyList = result.msg.pageData;
			}
			state.agencyTotalCount = result.msg.totalCount;
		} else {
			state.msg = result.msg || result.err;
		}
	},
}
// actions
const actions = {

	GetUserList(context: { commit: Commit, state: State }, agent) {
		return new Promise(async (resolve, reject) => {
			getUserList(agent).then(response => {
				context.commit('SET_USERLIST', response.data);
				resolve()
			}).catch(error => {
				context.commit('SET_USERLIST', error)
				console.error("catch", error);
				resolve()
			})
		});
	},
	GetAgencyList(context: { commit: Commit, state: State }, agent) {
		return new Promise(async (resolve, reject) => {
			getAgencyList(agent).then(response => {
				context.commit('SET_AGENCYLIST', response.data);
				resolve(response.data);
			}).catch(error => {
				context.commit('SET_AGENCYLIST', error)
				console.error("catch", error);
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

