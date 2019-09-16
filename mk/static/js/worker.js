(function () {
/*
     Worker 创建的一个子线程 用来处理定时器的就是文件
*/
// importScripts("加载的脚本文件");
// console.log(location,'能访问到的对象') 
var state = {
    name: self.name, 
    wsuri: null,     //websocket服务器地址
    ws: null,        //websocket实例对象
    echoTime: new Date().getTime(), //保持连接记录的时间:ms
    echoIntervalId: null, //心跳监测的定时器id
    wsIntervalId: null,   //向主线程发送数据的定时器id
    arrData: [], //websocket Array类型消息缓存数据
    objData: [], //websocket Object类型缓存数据
};
var actions = {
        //ws连接成功  开启定时器定时向主线程发送websocket数据和心跳连接定时器
        wsopen: function () {
            console.log("WEBSOCKET连接成功:" + state.wsuri);
            state.echoTime = new Date().getTime(); //更新心跳监测时间
            state.echoIntervalId = setInterval(echoWatch, 5000);
            state.wsIntervalId = setInterval(postRealData, 1500);
        },
        //ws关闭连接
        wsclose: function () {
            console.log("WEBSOCKET连接关闭:" + state.wsuri);
            self.postMessage({cmd:'wsclose'});
        },
        //ws连接错误 
        wserror: function () {
            console.log("WEBSOCKET连接错误:" + state.wsuri);
            self.postMessage({cmd:'wserror'});
            // 5秒后发起重连
            // setTimeout(function(){
            //     actions.initWebsocket();
            // },5000);
        },
        //ws消息回调
        wsmessage: function (e) {
            if (e.data == '') {
                actions.initWebsocket();
            } else if (e.data.length > 10) {
                var socketData = JSON.parse(e.data);
                if (socketData instanceof Array) {
                  state.arrData.push(...socketData)
                } else {
                  state.objData.push(socketData);
                }
            }
            if (e.data === 'echo') {
                state.echoTime = new Date().getTime();
            }
        },
        //ws初始化 
        initWebsocket: function () {
            clearIdCloseWs();
            if(WebSocket){
                state.ws = new WebSocket(state.wsuri);
                state.ws.onopen = this.wsopen;
                state.ws.onclose = this.wsclose;
                state.ws.onerror = this.wserror;
                state.ws.onmessage = this.wsmessage;
            }else{
                console.log('当前浏览器 Not support websocket')
            }         
        },
        //入口函数 子线程初始化配置 初始化ws
        main: function (config) {
            state.wsuri = config.wsuri;//获取websocket服务器地址
            this.initWebsocket();
        },
  };
  
//关闭ws和清除定时器  在退出登录的时候和心跳过期重连之前调用
function clearIdCloseWs(){
    clearInterval(state.echoIntervalId);
    clearInterval(state.wsIntervalId);
    if (state.ws && state.ws.close) { 
        state.ws.close();
        state.ws = null;
    }
};
//心跳监测 超过15秒没有接受到echo信息则发起重连ws
function echoWatch(){
    var time = (new Date().getTime() - state.echoTime) / 1000;
    if (time > 15) {
        actions.initWebsocket();
    } else {
        sendmsg("echo");
    }
};
// 发送实时数据 postRealData
function postRealData(){
    self.postMessage({
        cmd: 'data',
        arrData: state.arrData.splice(0, state.arrData.length),
        objData: state.objData.splice(0, state.objData.length)
    });
};
//向websocket发送消息 sendmsg  data  需要发送数据的最终格式 字符串或者JSON字符串
function sendmsg(data){
    try{
        state.ws.send(data);
    }catch(err){
        actions.initWebsocket();
    }
};

//消息菜单
self.onmessage = function (event) {
    switch (event.data.cmd) {
    case "init":
        actions.main(event.data);
        break;
    case "sendmsg"://使用这个方法 必须将需要的数据封装
        sendmsg(event.data.data)
        break;
    case "close":
        clearIdCloseWs();
    default:
        console.log(event.data)
        break;
    }
};

})();
