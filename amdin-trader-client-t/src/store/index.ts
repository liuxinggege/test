import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'
import upPoint from './modules/agent/upPoint'
import businessInfo from './modules/agent/businessInfo'
import upPointLog from './modules/agent/upPointLog'
import search from './modules/agent/search'
import transferLog from './modules/agent/transferLog'
import agentRecharge from './modules/agent/agentRecharge'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    errorLog,
    tagsView,
    permission,
    user,
    upPoint,
    businessInfo,
    upPointLog,
    search,
    transferLog,
    agentRecharge
  },
  getters
})

/** 后台的返回数据interface*/
export interface CodeMsg<T> {
  code: number;
  msg: T;
  err?: any;
}

