import { getBalanceRecordData } from '../../../api/agent/balanceRecord/balanceRecord'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    balanceRecordData:IncomeInfoDataType[]
    code:number
    totalCount:number
}

export interface IncomeInfoDataType {
    status:string
    withdrawOrderID:string
    act:string
    settleUser:string
    applyMoney:string
    applyDate:Date
    dealWithDate:Date
    arrivedDate:Date
    operator:string
    ip:string
    totalSetMoney:string
}
// initial state
const state: State = {  
    balanceRecordData:[],
    totalCount:0,
    code:0
}

const mutations = {

    SET_GETBALANCERECORDDATA: (state: State, data:any) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.balanceRecordData = data.msg.data.map(e=>{
            return {
                
            }
        })
    },
}
// actions
const actions = {
    GetBalanceRecordData(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getBalanceRecordData(queryItem).then((response: { data }) => {
                context.commit('SET_GETBALANCERECORDDATA', response.data)
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
    // getters,
    actions,
    mutations
}
