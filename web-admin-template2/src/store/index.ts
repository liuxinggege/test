import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import user from './modules/user';

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        user,
        app,
        errorLog,
        permission,
        tagsView
    },
    getters
})

/** 后台的返回数据interface*/
export interface CodeMsg<T> {
    code: number
    msg: T
    err?: any
}
