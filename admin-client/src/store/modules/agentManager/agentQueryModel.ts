import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    page?: number,
    count?: number,
    uid?: String,
    agentId?: string     //代理id
    agentName?: string,  //代理名称
    startTime?: string,  //结束时间
    endTime?: string,    // 结束时间
    startAndEndTime?: any,
    platform?: string,  //渠道
    isDeducted?: number,// 是否显示扣量的数据  1--->显示   0----> 不显示
    downTaxRate?: any,  //下级税收
    toDownTaxRate?: any,//到下级税收
    account?: string,//代理账号
    mobileNum?: string,//代理电话
}

type GetQueryModel = State;

const state: State = {
    page: 1,
    count: 10,
    agentId: "",
    downTaxRate: null,
    toDownTaxRate: null,
    uid: "",
}

const mutations = {

}
// actions
const actions = {
    initQueryModel() {
        state.page = 1;
        state.count = 10;
        state.agentId = "";
        state.downTaxRate = null;
        state.toDownTaxRate = null;
        state.uid = "";
    }
}
export default {
    state,
    actions,
    mutations
}
