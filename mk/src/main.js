console.log(process.interface,process.env);
import Vue from 'vue';
import Resource from 'vue-resource';
import Router from 'vue-router';
import Vuex from 'vuex';
import ElementUI,{ Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './styles/reset_el_style.css'; //重置element-ui表格组件样式文件
import {routers} from 'src/router';
import store from 'src/vuexStore';
import simpleStore from 'src/store';
import App from './App';
import myPagination from './common_bar/myPagination';
import secondPagination from './common_bar/secondPagination';

//加载插件和加载全局组件
Vue.use(Resource);
Vue.use(Router);
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.component('my-pagination', myPagination);
Vue.component('second-pagination', secondPagination);

//设置接口前缀 设置ajax ithCredentials每次请求携带cookie 
//设置文件接口、语音接口、websocket地址
//ajax请求的错误拦截  状态不为200识别为服务器错误 状态-1识别为未登录  
Vue.http.options.root = "/coalmine";
Vue.http.options.withCredentials = true;
simpleStore.state.uploadUrl = Vue.http.options.root + '/maporg/upload';
simpleStore.state.decodeUrl = Vue.http.options.root + '/rsa/decryptFile';
simpleStore.state.LicenseUrl = Vue.http.options.root + '/rsa/keyUpload';
simpleStore.state.importdbUrl = Vue.http.options.root + '/backup/importdb';
if (process.env.NODE_ENV === 'production') {
    simpleStore.state.wsuri = 'ws://' + location.host + Vue.http.options.root + '/websocket';
    simpleStore.state.voiceUrl = 'http://' + location.host + '/voice/getvoice?text=';
} else {
    simpleStore.state.wsuri = process.interface.wsAddress;
    simpleStore.state.voiceUrl = process.interface.address + '/voice/getvoice?text=';
}
Vue.http.interceptors.push({
  request: function (request) {
    return request
  },
  response: function (response) {
    if(response.status !== 200){
        Message.error('服务器异常！');
    }
    if (response.data.status === -1 ) {
        simpleStore.actions.notLogin();
        router.push({name:'login'});
        Message.error('请重新登录！');  
    }
    return response
  }
})

// 构建需要密码验证的路由hash 初始化路由 路由拦截
simpleStore.actions.setRouteName();
const router = new Router({routes: routers });
router.beforeEach((to,from,next) => {
    if( (Date.now() < window.localStorage.getItem('times')) || //距离上次验证低于五分钟 跳过密码验证
        (to.name == 'watching-index/wind' && to.query.type == 'scan') || //通风系统预览页面 跳过密码验证
        (to.name == 'Dsystem' && to.query.type == 'scan') || //瓦斯抽放预览页面 跳过密码验证
        (!simpleStore.state.routeName[to.name]) ){ //不在验证范围内的页面
            next();
            simpleStore.state.passwordShow = false;
    }else{
        next(false);
        simpleStore.state.passwordShow = true;  
        simpleStore.state.nextrouter = to;
    }   
})

// 启动 App 挂载 vuex router 
new Vue({
    el:'#app',
    store,
    router,
    render: h => h(App)
})

