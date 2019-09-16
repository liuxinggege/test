import { getDataReport,getChildInfo,getIncomeDetail ,downloadChildInfoExcel,getAgencyOrder} from '../../../api/agent/dataReport/dataReport'
import { Commit } from 'vuex'
import { formUtil } from "../../../utils/formatUtils";
import { BigNumber } from "bignumber.js";
export interface State {
    dataReport:DataReportDoc
    childInfo:ChildInfo[]
    incomeDetail:IncomeDetailDoc[]
    agencyOrder:IncomeDetailDoc[]
    code:number
    totalCount:number
    totalSetMoney:number
    err:string
}
export interface IncomeDetailDoc {
    sumDate:Date,
    recordType:string,
    changeMoney:string,  
}
export interface DataReportDoc {
    totalIncome:string,
    sysIncome:string,
    yesTotalIncome:string,
    myChannelTotalIncome:string,
    subPromotionProfit:string,
    gameTax:string,
    myChannelTotalGameTax:string,
    subPromotionGameTax:string,
    totalNewUserCount:string,
    myChannelNewUserCount:string,
    subNewUserCount:string,
    totalGameUserCount:string,
    totalChargeUserCount:string,
    totalChargeAmt:string,
    totalWithdrawAmt:string,
    totalProfit:string,
    newAgency:number,
}
export interface ChildInfo {
    agencyId:number,
    taxRate:string,
    totalTax:string,
    newUserCount:number,
    childCount:number,
    income:string
}
// initial state
const state: State = {  
    dataReport:{
        totalIncome:"0",
        sysIncome:"0",
        yesTotalIncome:"0",
        myChannelTotalIncome:"0",
        subPromotionProfit:"0",
        gameTax:"0",
        myChannelTotalGameTax:"0",
        subPromotionGameTax:"0",
        totalNewUserCount:"0",
        myChannelNewUserCount:"0",
        subNewUserCount:"0",
        totalGameUserCount:"0",
        totalChargeUserCount:"0",
        totalChargeAmt:"0",
        totalWithdrawAmt:"0",
        totalProfit:"0",
        newAgency:0,
    },
    childInfo:[],
    incomeDetail:[],
    agencyOrder:[],
    totalCount:0,
    totalSetMoney:0,
    code:0,
    err:"",
}

const mutations = {
    SET_DATAREPORT: (state: State, data:any) => {
        state.code = data.code
        state.dataReport = data.msg
    },
    SET_CHILDINFO: (state: State, data:any) => {
        state.code = data.code
        state.childInfo = data.msg.pageData
        state.totalCount = data.msg.totalCount
    },
    SET_INCOMEDETAIL: (state: State, data:any) => {
        state.code = data.code
        state.incomeDetail = data.msg.pageData.map(element => {
            let isPlus = true;
            if(new BigNumber(element?element.changeMoney:"0").lt("0")){
                isPlus = false
            }
            return {
            sumDate:formUtil.getDateYYYYMMDDHHmmss(element.sumDate),
            logDate:formUtil.getDateYYYYMMDDHHmmss(element.logDate),
            recordType:formUtil.getRecordType(element.recordType),
            changeMoney:element.changeMoney,
            isPlus:isPlus,
        }
        });
        state.totalCount = data.msg.totalCount
    },
    SET_AGENCYORDER: (state: State, data:any) => {
        state.code = data.code
        state.agencyOrder = data.msg.pageData.map(element => {
            let isPlus = true;
            return {
            applyDate:formUtil.getDateYYYYMMDDHHmmss(element.applyDate),
            status:formUtil.getStatus(element.status),
            type:element.status||"await",
            realMoney:element.realMoney,
            isPlus:isPlus,
        }
        });
        state.totalCount = data.msg.totalCount
        state.totalSetMoney = data.msg.totalSetMoney
    },
    SET_ERROR: (state: State, data:any) => {
        state.code = data.code
        state.err = data.err
    },
}
// actions
const actions = {
    GetDataReport(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getDataReport(queryItem).then((response: { data }) => {
                context.commit('SET_DATAREPORT', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    GetChildInfo(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getChildInfo(queryItem).then((response: { data }) => {
                context.commit('SET_CHILDINFO', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    GetIncomeDetail(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getIncomeDetail(queryItem).then((response: { data }) => {
                context.commit('SET_INCOMEDETAIL', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    GetAgencyOrder(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getAgencyOrder(queryItem).then((response: { data }) => {
                context.commit('SET_AGENCYORDER', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    DownloadChildInfoExcel(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            downloadChildInfoExcel(queryItem).then((response: { data }) => {
                context.commit('SET_CHILDINFO', response.data)
                resolve(response.data)
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
    actions,
    mutations
}
