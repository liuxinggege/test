import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
	brnnGameLogData: BrnnGameLogData[],
	code: number
	totalCount: number
	gameId: string
	BrnnStageLog: object
	next: boolean
}
export interface BrnnGameLogData {
	bets: string
	endDate: string
	gameData: object
	gameId: number
	gid: string
	logDate: string
	rType: number
	rid: number
	stageId: string
	startDate: string
	users: any[]
	_id: string
}
type Msg = {
	data: BrnnGameLogData[]
	totalCount: number
	next: boolean
}
type GetBrnnGameLog = {
	code: number
	msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
	brnnGameLogData: [],
	code: 0,
	totalCount: 1,
	gameId: "",
	BrnnStageLog: [],
	next: false,
}

const mutations = {
	SET_BRNNGAMELOG: (state: State, data: GetBrnnGameLog) => {
		state.code = data.code
		state.brnnGameLogData = data.msg.data
		state.next = data.msg.next
	},
	//将当前的user字段的数据，保存到全局的store中
	SET_CUBBRNNUSERDETAIL: (state: State, data: any) => {
		state.gameId = data.gameId;
		state.BrnnStageLog = data.data;
	},
}
// actions
const actions = {
	GetBrnnGameLog(context: { commit: Commit, state: State }, queryItem) { //获取BrnnGameLog
		return new Promise(async (resolve, reject) => {
			gameOneLog(queryItem).then((response: { data }) => {
				context.commit('SET_BRNNGAMELOG', <GetBrnnGameLog>response.data)
				resolve(response.data)
			}).catch(error => {
				console.error("catch", error)
				resolve()
			})
		});
	},
	GetBrnnGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
		return new Promise(async (resolve, reject) => {
			gameOneLogExcel(queryItem).then((response: { data }) => {
				resolve(response.data)
			}).catch(error => {
				console.error("catch", error)
				resolve()
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
