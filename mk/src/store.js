import { Message } from 'element-ui';
import api from 'src/api'
import _ from 'lodash'
export const state = {
    home:{path:"/home",name:"home_index",title:"首页",query:{type:"scan"}},
    isLogin:-1,
    user: {},
    permissionlist: [],
    Kindex:0,//页面对应菜单索引
    menuList:[],//菜单数据
    licenseText:"",//授权验证
    /* 文件接口 */
    voiceUrl:'',
    uploadUrl:'',
    decodeUrl:'',
    LicenseUrl:'',
    importdbUrl:'',
    /* websocket */
    wsuri:'',
    wsid:'',
    websock: '',
    ackTime:Date.now(),//验证保持连接的时间
    intervalId:null,  
    allData:[],//websocket Array类型消息缓存数据
    objData:[],//websocket Object类型缓存数据
    skIndex:1, //用于实时watch的变量
    updateall:1,//发现新设备监听的变了
    connecTotal:0,//连接 监听变量
    isOpenReal:false,//判断是否为需要打开实时
    maxPageList:{list1:[],list2:[],list3:[],list6:[]},//实时列表
    /* 哈希表 */
    AllhashSensor: {}, //所有设备哈希表
    typeList: {}, //所有传感器类型Map
    stationHash:{},//分站hash表
    areaHash:{},//用于清除区域的状态的哈希表
    colorData:{},
    debugMap:{'0':'(正常)','1':'(欠压)','2':'(故障)','3':'(调校)','4':'(开机)','5':'(标校)','6':'(标校成功)','7':'(离线)'},
    /* 报警对话框 设备编辑框 新发现识别卡  */
    alarmAuList:[], //报警语音队列
    alarmTextList:[],//滚动文字列表
    sensorAlarmMap:{},//设备报警
    sensorAlarmList:[],
    areaAlarmMap:{},//区域报警
    areaAlarmList:[],
    actionAlarmMap:{},//联动报警
    actionAlarmList:[],
    systemAlarmMap:{},//系统报警
    systemAlarmList:[],
    alarmUser:[],//人员报警
    seekHelpData:[],//人员求救报警列表
    systemAlarm:[],
    actionAlarm:[],
    areaAlarm:[],  
    isedit: false,//读卡器
    addArea:false,//区域查看
    controlModel:false,//设备
    addModal:false,//分站
    addForm:{},
    controlForm:{},
    areadata:{},
    newCard:[],//新识别卡
    allCard:[],//全部卡片
    /* 分页组件参数 */
    listinfo: {
        numperPage: 15,
        count: 0,
        currentPage: 1
    },
    showlist: [],
    pageSize: [5, 10, 15, 20, 30],
    listinfo2: {
        numperPage: 15,
        count: 0,
        currentPage: 1
    },
    showlist2:[],
    pageSize2: [5, 10, 15],
    /* 模拟图 */
    lineUser:'',//活动轨迹
    frequency:1,//活动轨迹移动速度
    downholeTotal:{},//井下人数的统计 模拟图上使用
    actionStatus:{},//联动情景的状态  模拟图上使用  
    nodeDataArray:[],//自检图数据
    /* 密码验证 */
    passwordShow:false,
    nextrouter:null,
    routeName:{},
    routeNameList:[//需要密码权限验证的路由name
        'role','user','license','log','ddic','projectinfo','store','Wsubaddup',//系统配置
        'watching-index/setting','station','areaPos','drainage-index/sample','upload','watching-index/decode','areaSetting','areaRule','timeSetting',
        'list','setting/line','import','Wsub','watching-index/wind','Dsystem',
        'logic','handle','windwatt','printEdit',
        'card','worktype','department','users','area','schedule','areaNow',//人员定位
        'Vsystem','Bsystem'//视频监控 语音广播
    ],
    /* websocket测试 */
    wstest:{
        isOpen:false,//测试是否开启状态
        connectCount:0,//连接次数
        closeCount:0,//关闭次数
        errorCount:0,//错误次数
        msgCount:0,//收到数据次数
        startTime:"",
        stopTime:"",
        heartbeatList:[]
    },
    sensorConfig:{
        analog:100,
        switch:25,
        voice:65,
        cardReader:64
    }
}
export let actions = {
    setRouteName(){
        if(!window.localStorage.getItem('times')){
            window.localStorage.setItem('times',Date.now()-100);
        }
        state.routeName = {};
        state.routeNameList.forEach(item => {
            state.routeName[item] = true;
        })
    },
    //websocket测试 
    resetWsTest(){
        state.wstest = {
            isOpen:false,
            connectCount:0,
            closeCount:0,
            errorCount:0,
            msgCount:0,
            startTime:"",
            stopTime:"",
            heartbeatList:[]
        }
    },
    startWsTest(){
        actions.resetWsTest(); 
        state.wstest.isOpen = true;
        state.wstest.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        actions.addToWsTestHeartbeatList({msg:"websock测试开始！",alarm:0});
    },
    stopWsTest(){
        state.wstest.isOpen = false;
        state.wstest.stopTime = moment().format('YYYY-MM-DD HH:mm:ss');
        actions.addToWsTestHeartbeatList({msg:"websock测试结束！",alarm:1});
    },
    addToWsTestHeartbeatList(prams,callback){
        prams.time = moment().format('YYYY-MM-DD HH:mm:ss');
        state.wstest.heartbeatList.push(prams);
        callback && callback();
    },
    //分页组件 
    setCutList(list, count, page) {
        state.showlist = list
        if(state.listinfo.numperPage > state.listinfo.count) actions.handleCurrentChange(1)
        if((count !== undefined) && (count !== state.listinfo.count)) {
            state.listinfo.count = count
        }
        if((page !== undefined) && (page !== state.listinfo.page)) {
            state.listinfo.currentPage = page
        }
    },
    setShowList(list, page) {
        state.showlist = []     
        state.listinfo.count = list.length
        if(state.listinfo.numperPage > state.listinfo.count) actions.handleCurrentChange(1)
        if(page) {
            state.listinfo.currentPage = page
        }
        if(state.listinfo.currentPage > parseInt(state.listinfo.count/state.listinfo.numperPage+1))  {
            actions.handleCurrentChange(1) 
        }
        state.showlist = list.slice(((state.listinfo.currentPage - 1) * state.listinfo.numperPage), (state.listinfo.currentPage * state.listinfo.numperPage))
    },
    setShowList2(list, page) {
        state.showlist2 = []
        state.listinfo2.count = list.length
        if(state.listinfo2.numperPage > state.listinfo2.count) actions.handleCurrentChange2(1)
        if(page) {
            state.listinfo2.currentPage = page
        }
        if(state.listinfo2.currentPage > parseInt(state.listinfo2.count/state.listinfo2.numperPage+1))  {
            actions.handleCurrentChange2(1) 
        }
        state.showlist2 = list.slice(((state.listinfo2.currentPage - 1) * state.listinfo2.numperPage), (state.listinfo2.currentPage * state.listinfo2.numperPage))
    },
    handleSizeChange(val) {
        state.listinfo.numperPage = val;
    },
    handleSizeChange2(val) {
        state.listinfo2.numperPage = val;
    },
    handleCurrentChange(val) {
        state.listinfo.currentPage = val;
    },
    handleCurrentChange2(val) {
        state.listinfo2.currentPage = val;
    },
    //自检图数据接口
    getRelation(){
        state.nodeDataArray = [];
        api.user.getTopo().then((res) => {  
            if(res.data.status==0){                         
                state.nodeDataArray = res.data.data
                state.nodeDataArray.unshift({
                    key: "服务器",
                    name: "服务器",
                    now_status:0,
                    path:'server.svg',
                    type:'服务器',
                    position:'',
                    showColor:state.colorData.realvalue
                })
                window.localStorage.setItem('nodeDataArray',JSON.stringify(state.nodeDataArray))                
            }
        })
    },
    //通知创建文件
    generate(){
       api.station.generate();
    },
    getTotal(){
        let rdata = {
            sensor_position:0,
            day:moment().format('YYYY-MM-DD'),
            sensorId:'',
            ip:'' 
        };
        api.searchs.getCumulant(rdata).then(function(res) {
            if (res.data.status === 0) {
                let list = [...res.data.data]
                _.forEach(list, function(ob) { 
                    var k = ob.ip+':'+ob.sensorId+':'+ob.type;
                    if(state.AllhashSensor[k]&&ob.status==1){
                        state.AllhashSensor[k].total_flow_work = ob.flow_work
                        state.AllhashSensor[k].total_flow_standard = ob.flow_standard
                        state.AllhashSensor[k].total_flow_pure = ob.flow_pure
                    }
                })
            }
        })
    },
    notLogin() {
        state.user = {};
        state.isLogin = 0;
        actions.websocketclear();//清除关闭websocket连接
    },
    login(userinfo, permission) {
        state.user = userinfo;
        state.permissionlist = permission;
        state.menuList = state.permissionlist.list;
        window.localStorage.setItem('MenuDatas',JSON.stringify(state.permissionlist.list));
        window.localStorage.setItem('sysuser',JSON.stringify(userinfo));
        actions.getHashData();   
        actions.initWebSocket();  //连接websocket
    },
    getHashData(){
        Promise.all([
            api.setting.getSensorConfig(),
            api.user.getAlltype(),
            api.user.getColor(),
            api.routeLine.getstaff({})
        ]).then(res => {
            let [sensorConfig,types,colors,cards] = res;
            state.sensorConfig = sensorConfig.data.data
            types.data.data.push({id:900})//区域
            actions.setAllType(types.data.data);
            _.assign(state.colorData,colors.data.data);
            state.allCard =  _.map(cards.data.data,'posta');
            // window.localStorage.setItem('typeList',JSON.stringify(state.typeList));
            // window.localStorage.setItem('colorData',JSON.stringify(state.colorData));    
            actions.getOwnList();  
        })
        .catch(err => {
            Message.error(err)
        })
    },
    getCard(){
        api.routeLine.getstaff({}).then((res) => {
            if(res.data.status==0){
                state.allCard =  _.map(res.data.data,'posta')
            }else{
                Message.error(res.data.msg)
            }
        })
    },
    getColor(){
        api.user.getColor().then(res => {
            if(res.data.status==0){
                _.assign(state.colorData,res.data.data);
                // window.localStorage.setItem('colorData',JSON.stringify(state.colorData));
            }else{
                Message.error(res.data.msg) 
            }
        })
    },
    // 设备类型 创建hash表
    getAlltype() {
        api.user.getAlltype().then((res) => {
            if(res.data.status === 0){
                actions.setAllType(res.data.data);
                // window.localStorage.setItem('typeList',JSON.stringify(state.typeList));
            }else{
                Message.error(res.data.msg);
            }
        })
    },
    setAllType(list) {
        state.typeList = {};
        list.forEach(ob => {
            // common 模拟量
            ob.statusMap = {
                '-4':'下限复电报警',
                '-3':'下限断电报警',
                '-2':'下限复电报警',
                '-1':'下限复电报警',
                '0':'正常上报',
                '2':'超限报警',
                '3':'断电报警',
                '4':'复电报警',
                '5':'通讯中断',
                '6':'通讯恢复',
                '7':'报警解除',
                '8':'风向反向',
            };
            //开关量
            if(ob.pid==state.sensorConfig.switch){
                ob.statusMap['2'] = '报警';
                ob.valueText = eval('('+ ob.value_range +')');
                //断馈电仪
                if(ob.id==56){
                    ob.statusMap['1'] = '馈电异常' ;
                }
            }
            //读卡器
            if(ob.id == state.sensorConfig.cardReader){
                ob.statusMap['2'] = '紧急呼救';
            }
            //广播
            if(ob.id == state.sensorConfig.voice){
                ob.valueText = {
                    '0':'(关闭)',
                    '1':'(在线)',
                    '2':'(播放中)',
                }
            }    
            //电源箱
            if(ob.id==72){
                ob.currentText = {'0':"交流",'1':"直流"};
                ob.rechargeText = {'0':"充电",'1':"未充电"};
                ob.dischargingText = {'0':"放电",'1':"未放电"};
                ob.balanceText = {'0':"均衡",'1':"未均衡"};
                ob.cut1Text = {'1':"断电",'2':"复电"};
                ob.cut2Text = {'1':"断电",'2':"复电"};
            }
            // 区域/设施
            if(ob.id===900){
                ob.statusMap = {
                    '0':'正常',
                    '1':'未配置报警',
                    '2':'区域分级报警'
                };
            }
            state.typeList[ob.id] = ob; 
        })
        // console.log(state.typeList);
    },
    //所有设备 创建更新hash表
    getOwnList(bool,params){
        api.station.getOwnList({}).then((res) => {
            if(res.data.status){
                return Message.error(res.data.msg);
            }
            state.stationHash = {};
            res.data.data.list9.forEach(m => {
                state.stationHash[m.ipaddr] = { count:1,keys:[]};
            })
            let reslut  = [
                ...res.data.data.list1,
                ...res.data.data.list2,
                ...res.data.data.list3,
                ...res.data.data.list4,
                ...res.data.data.list6,
                ...res.data.data.list7,
                ...res.data.data.list8,
                ...res.data.data.list9,
                ...res.data.data.list10
            ];
            reslut.forEach(item => {
                let ip = '';
                if(item.typeid && item.typeid == state.sensorConfig.cardReader){
                    item.k = item.subname + ':' + item.cid + ':' + item.typeid;
                    ip = item.subname;
                }
                switch(item.pid){
                    case state.sensorConfig.switch:
                        item.k = item.ipaddr + ':' + item.sensorId + ':' + item.sensor_type;
                        item.valueText = state.typeList[item.sensor_type].valueText;
                        item.break_display = item.break_display || 0;//用于断馈电仪器的常闭常开状态的默认值可能为null的处理
                        item.action_value = 0;//默认未被控制
                        ip = item.ipaddr;
                        break;
                    case state.sensorConfig.analog:
                        item.k = item.ipaddr + ':' + item.sensorId + ':' + item.sensor_type;
                        ip = item.ipaddr;
                        break;
                    // case state.sensorConfig.cardReader:
                    //     item.k = item.subname + ':' + item.cid + ':' + item.typeid;
                    //     ip = item.subname;
                    //     break;
                    case state.sensorConfig.voice:
                        item.k =  item.ip + ':' + item.radioId + ':' + item.pid; 
                        ip = item.ip;
                        break;
                };
                switch(item.type){
                    case 72:
                        item.k =  item.ipaddr + ':' + item.devid + ':' + item.type; 
                        ip = item.ipaddr;
                        break;
                    case 16:
                        item.k = item.ipaddr;
                        break;
                    case 104:
                        item.k = item.ip + ':' + item.type;
                        break;
                    case 900:
                        item.alarmMap = {};
                        state.areaHash[item.id] = item;
                        item.k = item.id ;
                        break;
                };
                if(ip && state.stationHash[ip]){
                    state.stationHash[ip].keys.push(item.k);
                }
                if(!params){
                    if(state.AllhashSensor[item.k]){
                        state.AllhashSensor[item.k] = {...state.AllhashSensor[item.k],...item};  
                    }else{
                        item.now_status = '5'
                        item.statusText = '通信中断' ;
                        item.showColor = state.colorData.initialColor;
                        item.now_value = '-';
                        state.AllhashSensor[item.k] = item;
                        if(item.type == 900){
                            item.statusText = '-';
                            item.showColor = state.colorData.realvalue;
                            state.AllhashSensor[item.k] = item;
                        }
                    }
                }else{
                    item.now_status = '5'
                    item.statusText = '通信中断' ;
                    item.showColor = state.colorData.level1 ;
                    item.now_value = '-';
                    state.AllhashSensor[item.k] = item;
                    if(item.type == 900){
                        item.statusText = '-' ;
                        item.showColor = state.colorData.realvalue;
                        state.AllhashSensor[item.k] = item;
                    }
                }  
            })  
            // console.log(state.AllhashSensor)
            if(!bool){
                state.skIndex++;
            }else{
                state.skIndex = bool;
            }
        
            if(state.isOpenReal&&params){
                actions.chageList();    
            }
            reslut = null;
            state.isLogin = 1;
        })
    },   
    //开启websocket
    initWebSocket() {   
        actions.websocketclear();//防止多次重复连接
        if('WebSocket' in window) { 
            state.wsid = Date.now()+'';     
            let url = state.wsuri+"/"+state.wsid;                   
            state.websock = new WebSocket(url);
            state.websock.onerror = actions.websocketonerror; 
            state.websock.onclose = actions.websocketonclose;
            state.websock.onopen = actions.websocketonopen; 
            state.websock.onmessage = actions.websocketonmessage;
            state.ackTime = Date.now();//初始化心跳时间
            state.intervalId = setInterval(() => {
                if((Date.now() - state.ackTime)/1000 > 6){
                    actions.initWebSocket();  //心跳超时 重新连接websocket
                }else{
                    actions.websocketsend("echo","心跳包发送");  //发送心跳包
                }    
                if(state.allData && state.allData.length){
                    actions.socketArray(state.allData.splice(0,state.allData.length));              
                }
                if(state.objData && state.objData.length){
                    actions.bulkDeal(state.objData.splice(0,state.objData.length));
                }  
                if(state.isOpenReal){
                    actions.chageList();   
                }
                state.skIndex++;
                state.alarmAuList = state.alarmAuList.splice(-99,99);//语音
                state.alarmTextList = state.alarmTextList.splice(-99,99);//文字
                state.areaAlarmList = state.areaAlarmList.splice(0,99);//区域
                state.actionAlarmList = state.actionAlarmList.splice(0,99);//联动
                state.systemAlarmList = state.systemAlarmList.splice(0,99);//系统
                state.sensorAlarmList = state.sensorAlarmList.splice(0,99);//设备
                state.alarmUser = state.alarmUser.splice(0,99);//人员   
            },1000);
        } else {
            Message.error('当前浏览器 Not support websocket');
        }
    },
    //清除或者关闭websocket 清除定时器
    websocketclear(){ 
        if(state.websock && state.websock.close){
            state.websock.close();
            state.websock = null;
            state.newCard = [];
        }   
        window.clearInterval(state.intervalId);
        state.intervalId = null;
    },
    //ws发送数据  如果服务器关闭或者ws连接断开 再使用ws可能会发生报错
    websocketsend(agentData,type = "命令下发") {
        // console.log("ws.readyState:",state.websock.readyState);
        try{
            state.websock.send(agentData);
        }catch(error){
            // actions.websocketerrorAlarm(type + '失败，实时通讯服务连接异常！');
        }  
    },
    websocketonerror(e) {
        console.log('WEBSOCKET连接发生错误：' + state.wsuri);
        console.log(e);
        let msg = '实时通讯服务连接错误！';
        // actions.websocketerrorAlarm(msg,state.colorData.level1);
        actions.addNewAlarm(msg,state.colorData.level1); 
        actions.getOwnList(null,true);//重置所有设备状态通信中断
        if(state.wstest.isOpen){   
            actions.addToWsTestHeartbeatList({msg:msg,alarm:1},() => {
                state.wstest.errorCount++;
            });
        }
    },
    websocketonclose(e){
        console.log('WEBSOCKET连接连接关闭：' + state.wsuri);
        console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
        let msg = '实时通讯服务连接中断！';
        // actions.websocketerrorAlarm(msg,state.colorData.level1);
        actions.addNewAlarm(msg,state.colorData.level1); 
        actions.getOwnList(null,true);//重置所有设备状态通信中断
        if(state.wstest.isOpen){   
            actions.addToWsTestHeartbeatList({msg:msg,alarm:1,code:e.code,reason:e.reason,wasClean:e.wasClean?"是":"否"},() => {
                state.wstest.closeCount++;
            });
        }  
    },
    websocketonopen(){
        state.connecTotal++;//作用 重构刷新所有实时列表
        console.log('WEBSOCKET连接成功：' + state.wsuri);
        let msg = '实时通讯服务连接成功！';
        // actions.websocketerrorAlarm(msg,state.colorData.realvalue,"实时服务连接成功");
        if(state.wstest.isOpen){    
            actions.addToWsTestHeartbeatList({msg:msg,alarm:0},() => {
                state.wstest.connectCount++;
            });
        }
    },
    websocketonmessage(e) {  
        if(e.data === 'echo'){
            state.ackTime = Date.now();
        }else if(e.data.length > 4){
            let socketData = JSON.parse(e.data);
            if(socketData instanceof Array){
                state.allData.push(...socketData);
            }else{
                state.objData.push(socketData);
            } 
        } 
    },
     //ws实时服务报警信息
    // websocketerrorAlarm(alarm,showColor = state.colorData.level1,name = '系统报警'){
    //     state.systemAlarmList.unshift({
    //         cmd:'system',            
    //         time:moment().format('YYYY-MM-DD HH:mm:ss'),
    //         name,
    //         alarm,
    //         showColor
    //     }); 
    // },
    //批处理
    bulkDeal(list){
        list.forEach(ob => {
            switch(ob.cmd){
                case 'area'://区域
                        ob.statusText = state.typeList['900'].statusMap[ob.type];
                       //收到id为0 清空 alarmMap
                        if(ob.areaid === 0){
                            actions.clearAreaHash();
                            return
                        }
                        if(ob.positionid && ob.type == 1){
                            state.AllhashSensor[ob.areaid].alarmMap[ob.positionid] = ob.alarm;
                        }
                        if(!state.AllhashSensor[ob.areaid]) {
                            return 
                        }
                        if(ob.level && ob.level>0){
                                switch(ob.level){
                                        case 1:
                                        ob.showColor = state.colorData.level1;
                                        break;
                                    case 2:
                                        ob.showColor = state.colorData.level2;
                                        break;
                                    case 3:
                                        ob.showColor = state.colorData.level3;
                                        break;
                                    case 4:
                                        ob.showColor = state.colorData.level4;
                                        break;   
                                }  
                                ob.statusText += `(${ob.level}级)`;
                        }else if(ob.type == 0){
                            ob.showColor = state.colorData.realvalue;
                        }else{
                            ob.showColor = state.colorData.level1;
                        }
                        state.AllhashSensor[ob.areaid].now_status = ob.type;
                        state.AllhashSensor[ob.areaid].time = ob.time;
                        state.AllhashSensor[ob.areaid].statusText = ob.statusText;
                        state.AllhashSensor[ob.areaid].showColor = ob.showColor || '';
                        state.AllhashSensor[ob.areaid].alarm = ob.alarm || '';
                        state.AllhashSensor[ob.areaid].level = ob.level || '';
                        state.AllhashSensor[ob.areaid].areatype = ob.areatype || ''; 
                        if(ob.type > 0){
                            if(ob.alarm_drop===1||ob.alarm_drop==undefined){
                                actions.addNewAlarm(ob.alarm,ob.showColor);
                            }
                            if(!state.areaAlarmMap[ob.msgid] || state.areaAlarmMap[ob.msgid].alarm != ob.alarm || state.areaAlarmMap[ob.msgid].level != ob.level){
                                state.areaAlarmMap[ob.msgid] = ob;
                                state.areaAlarmList.unshift(ob);
                            }           
                        }  
                     break;
                case 'action': 
                        state.actionStatus[ob.msgid] = ob;//模拟图使用
                        if(ob.type === 0 &&  undefined == state.actionAlarmMap[ob.msgid]){//初始如果没有报警 正常情况不加入报警窗
                            return;
                        }
                        if(ob.type === 1){
                            ob.showColor = state.colorData.level1;
                        }else if(ob.type === 0){
                            ob.showColor = state.colorData.realvalue;
                        }
                        if((ob.alarm_drop===1||ob.alarm_drop==undefined )&& ob.type === 1){//语音队列
                            actions.addNewAlarm(ob.alarm,ob.showColor);
                        }  
                        if(!state.actionAlarmMap[ob.msgid] || state.actionAlarmMap[ob.msgid].type != ob.type){
                            state.actionAlarmMap[ob.msgid] = ob;
                            state.actionAlarmList.unshift(ob);
                        }
                    break;
                case 'system':
                    if(ob.alarm_drop===1||ob.alarm_drop==undefined){
                        actions.addNewAlarm(ob.alarm,state.colorData.level1); 
                    }
                    if(!state.systemAlarmMap[ob.msgid] || state.systemAlarmMap[ob.msgid].name != ob.name || state.systemAlarmMap[ob.msgid].alarm != ob.alarm){
                        state.systemAlarmMap[ob.msgid] = ob;
                        state.systemAlarmList.unshift(ob);
                    }
                 break;
                case 'person':
                    // state.routeCard.forEach((item) => {
                    //     if(ob.areaid &&!ob.cid && item.areaid == ob.areaid){
                    //         state.AllhashSensor[item.k].alarm = ob 
                    //     }else if(!ob.areaid && ob.type > 3 && item.cid == ob.cid){
                    //         state.AllhashSensor[item.k].alarm = ob     
                    //     }
                    // })
                    state.alarmUser.unshift(ob)
                    actions.addNewAlarm(ob.text,state.colorData.level1); 
                break;
                case 'helpMe':
                        state.seekHelpData.unshift(ob)
                    break;
                case 'downholeTotal':
                        state.downholeTotal = ob
                        window.localStorage.setItem('downholeTotal',JSON.stringify(ob));
                    break;
                case "inspectiontest": //case穿透
                    // if(ob.status == 0){
                    //     Message.success("命令下发成功！");
                    // }else{
                    //     Message.error("命令下发失败！");
                    // }
                    // break;
                case "inspectionstop":
                    if(ob.status == 0){
                        Message.success("命令下发成功！");
                    }else{
                        Message.error("命令下发失败！");
                    }
                    break;
                case "wstest"://websocket测试数据
                    if(state.wstest.isOpen){
                        state.wstest.msgCount++;
                    }
                    break;
                default:
                    console.log(ob,'default')
                    break;
              }
        })
    },
    clearAreaHash(){
        for(let item in state.areaHash){
            state.AllhashSensor[item].alarmMap = {};
        }
    },
    //求救措施处理
    helpDispose(row){
        state.seekHelpData = state.seekHelpData.filter((item) => { 
            if(item.card == row.card_id && item.responsetime == row.responsetime){
                return true
            }else{
                return false
            }
        })
    },
    //ws数组类型数据处理
    socketArray(list){
        var newcardlist = [];//新卡片
        let flagNewSensor = false;//用于判断是否有新设备的变量
        let typeMap = state.typeList; //各种设备类型
        let {colorData,debugMap} = state; //报警颜色和各种debug
        list.forEach(ob => {
            let k,{type,ip,status,devid} = ob;
            //构建当前处理的数据对应设备的k,用于匹配hash表，方便快速查找并修改hash表对应的设备
            switch(type){
                case 16:  //分站  
                    k = ip;
                    break;   
                case 104:   //交换机 
                    k = `${ip}:${type}`;
                    break;  
                default:  //其他设备 
                    k = `${ip}:${devid}:${type}`;
                    break;
            }     
             // statusText pid name
                ob.pid = 0;
                ob.name = ''; 
                if(typeMap[type]){
                    ob.statusText = typeMap[type].statusMap[status];
                    ob.pid = typeMap[type].pid;
                    ob.name = typeMap[type].v;
                }
               // debug状态
                if(ob.debug && ob.debug > 0){
                    ob.statusText +=  debugMap[ob.debug] || '';
                }
              // 设置 分级报警和不同状态显示颜色
                if(undefined == ob.level){
                    ob.level = 0;
                }
                if(ob.level && ob.level > 0){
                     ob.statusText += `(${ob.level}级)`;
                     switch(ob.level){
                        case 1:
                            ob.showColor = colorData.level1;
                            break;
                        case 2:
                            ob.showColor = colorData.level2;
                            break;
                        case 3:
                            ob.showColor = colorData.level3;
                            break;
                        case 4:
                            ob.showColor = colorData.level4;
                            break;   
                     }
                }else if(status === 0 || status === 6 || status === 7){
                    ob.showColor = colorData.realvalue;
                }else{
                    ob.showColor = colorData.level1;
                }
                // 模拟量的公共属性
                if(ob.pid === state.sensorConfig.analog){
                    if(ob.reverting && ob.reverting > 0){
                        ob.statusText += '(风向反向)';
                        ob.showColor = colorData.level1;
                    }
                    if(ob.changing === 2){
                        ob.statusText += '(突变数据)';
                    }else if(ob.changing === 3){
                        ob.statusText += '(持续升高)';
                        ob.showColor = colorData.changing3value;
                    }
                    if(ob.rescale == -1){
                        ob.statusText += `(未标校)`;
                    }else if(ob.rescale > 0){
                        ob.statusText += `(未标校${ob.rescale}天)`;
                    }
                 }
        //更新hash表
        let hashItem = state.AllhashSensor[k];
        if(hashItem){
            ob.areaname = hashItem.areaname;
            ob.position = hashItem.position;
            ob.sensorId = hashItem.alais;
            hashItem.statusText = ob.statusText;
            hashItem.now_status = status;
            hashItem.debug = ob.debug;
            hashItem.showColor = ob.showColor;
            //开关量 
            if(ob.pid === state.sensorConfig.switch){
                ob.valueText = typeMap[type].valueText;
                ob.now_value = ob.valueText[ob.value]||ob.value;
                if(ob.last_value == undefined || ob.change_time == undefined){//最近一次状态变化情况
                    ob.statusChange =  '-';
                }else{
                    ob.statusChange = ob.valueText[ob.last_value] + '/' + ob.change_time;
                }
                if(type === 53 || type === 56 ){ 
                    if(ob.feedback === 0){
                        ob.now_value += '、无馈电';
                    }else if(ob.feedback === 1){
                        ob.now_value += '、有馈电' ;
                    }
                    if(hashItem.break_display == ob.value || status == 5){
                        hashItem.action_value = 0;
                    }else{
                        hashItem.action_value = 1;
                    }
                }else if(type == 71){
                    hashItem.action_value = ob.value;
                }
                if(ob.duration){   //变动多长时间
                    ob.now_value += `(${ob.duration})`;
                }
                hashItem.now_value = ob.now_value;
                hashItem.statusChange = ob.statusChange;
            }
            //模拟量
            if(ob.pid === state.sensorConfig.analog && type != 69){
                ob.value = ob.value.toFixed(2);//模拟量实时值显示 四舍五入保留两位小数
                ob.now_value = ob.value + typeMap[type].k;
                hashItem.change = ob.change;//值变化情况
                if(ob.rescale){//标校周期超过天数
                    hashItem.rescale = ob.rescale;
                }
                if(ob.reverting && ob.reverting>0){
                    hashItem.reverting = ob.reverting
                }
                if(type == 70 && ob.battary){
                    ob.now_value += `(电量${ob.battary}%)`;
                }
                hashItem.now_value = ob.now_value;
            }
            switch(type){
            //分站   
                case 16:
                    ob.name = '分站';
                    ob.sensorId = ip;   
                    hashItem.status = status;   
                    // 分站中断,该分站地下所有设备中断
                    if(status === 5){
                        if(state.stationHash[ip].count){
                            state.stationHash[ip].keys.forEach(key => {
                                    state.AllhashSensor[key].now_status = 5;
                                    state.AllhashSensor[key].statusText = '通讯中断';
                                    state.AllhashSensor[key].showColor = colorData.level1;
                                    if(state.AllhashSensor[key].type === 69){
                                        // state.AllhashSensor[key].avg = '-';
                                        state.AllhashSensor[key].temperature  = '-';
                                        state.AllhashSensor[key].pressure  = '-';
                                        state.AllhashSensor[key].wasi = '-';
                                        state.AllhashSensor[key].co = '-';
                                        state.AllhashSensor[key].flow_work = '-';
                                        state.AllhashSensor[key].flow_standard = '-';
                                        state.AllhashSensor[key].flow_pure = '-';
                                    }else if(state.AllhashSensor[key].type === 72){
                                        state.AllhashSensor[key].currentText = '-';
                                        state.AllhashSensor[key].rechargeText = '-';
                                        state.AllhashSensor[key].dischargingText = '-';
                                        state.AllhashSensor[key].balanceText = '-';
                                        state.AllhashSensor[key].cut1Text = '-';
                                        state.AllhashSensor[key].cut2Text = '-';
                                        state.AllhashSensor[key].percent = '-';
                                        state.AllhashSensor[key].battary = '-';
                                    }else{
                                        state.AllhashSensor[key].now_value = '-';
                                    }
                            })
                            state.stationHash[ip].count = 0;
                        }
                    }else{
                            state.stationHash[ip].count = 1; 
                    }
                break;
             //读卡器   
                case state.sensorConfig.cardReader:
                    if(status != 5){
                        ob.value = ob.card.length + '人';
                        ob.now_value = ob.value;
                        if(ob.card.length){
                            newcardlist.push(ob);
                        }  
                    }else if(ob.time < moment().add(-10, 'm').format('YYYY-MM-DD HH:mm:ss')){
                        ob.value ='0人';
                    }else{
                        ob.value = '0人';
                    }
                    hashItem.now_value = ob.now_value;
                    if(ob.calling == 1){
                         hashItem.action_value = 1;
                         hashItem.now_value += "(呼叫中)";
                    }else{
                         hashItem.action_value = ob.calling ||0;         
                    }
                    hashItem.card = ob.card;
                    hashItem.emerge = ob.emerge;
                    hashItem.battary = ob.battary; 
                break;
                //广播
                case state.sensorConfig.voice:
                    ob.valueText = typeMap[type].valueText;
                    ob.now_value = ob.valueText[ob.value];
                    hashItem.action_value = ob.value;
                    hashItem.now_value = ob.now_value;
                break;
            //GD多参数传感器
                case 69:
                    if(status === 5){
                        // hashItem.avg = '-';
                        hashItem.temperature  = '-';
                        hashItem.pressure  = '-';
                        hashItem.wasi = '-';
                        hashItem.co = '-';
                        hashItem.flow_work = '-';
                        hashItem.flow_standard = '-';
                        hashItem.flow_pure = '-';
                    }else{
                        // hashItem.avg = ob.avg;
                        hashItem.temperature  = ob.temperature;
                        hashItem.pressure  = ob.pressure;
                        hashItem.wasi = ob.wasi;
                        hashItem.co = ob.co;
                        hashItem.flow_work = ob.flow_work;
                        hashItem.flow_standard = ob.flow_standard;
                        hashItem.flow_pure = ob.flow_pure;
                    }
                break;
            //交换机
                case 104:
                    ob.name = '交换机';
                    ob.sensorId = ob.ip;
                break;
            //电源箱
                case 72:
                    if(status === 5){
                        hashItem.currentText = '-';
                        hashItem.rechargeText = '-';
                        hashItem.dischargingText = '-';
                        hashItem.balanceText = '-';
                        hashItem.cut1Text = '-';
                        hashItem.cut2Text = '-';
                        hashItem.percent = '-';
                        hashItem.battary = '-';
                    }else{
                        hashItem.currentText = typeMap['72'].currentText[ob.current] || ob.current || '-';                                                               
                        hashItem.rechargeText = typeMap['72'].rechargeText[ob.recharge] || ob.recharge ||'-';
                        hashItem.dischargingText = typeMap['72'].dischargingText[ob.discharging] || ob.discharging ||'-';
                        hashItem.balanceText = typeMap['72'].balanceText[ob.balance] || ob.balance ||'-';
                        hashItem.cut1Text = typeMap['72'].cut1Text[ob.cut1] || ob.cut1 ||'-';
                        hashItem.cut2Text = typeMap['72'].cut2Text[ob.cut2] || ob.cut2 ||'-';
                        hashItem.percent = ob.percent + '%';
                        hashItem.battary = ob.battary + 'mAh';
                    }  
                 break;
            }
            if(status === 5){
                hashItem.now_value = '-';
                hashItem.statusText = '通讯中断';
                delete hashItem.reverting;
            }
            state.AllhashSensor[k] = hashItem;   
            //设备报警   
            if(status > 0){
                if(!state.sensorAlarmMap[k] || state.sensorAlarmMap[k].status != status || state.sensorAlarmMap[k].level != ob.level){
                    state.sensorAlarmList.unshift(ob);
                    state.sensorAlarmMap[k] = ob; 
                }
                //加入语音报警队列
                if(ob.alarm_drop==undefined||ob.alarm_drop===1){    
                    let alarmText = '';
                    if(type == 16){
                        alarmText = '分站'+ ip + ob.statusText + '。';
                    }else if(type == 104){
                        alarmText = '交换机'+ ip + ob.statusText + '。'; 
                    }else if(type == state.sensorConfig.cardReader ||type == state.sensorConfig.voice){
                        alarmText = ob.position + ob.sensorId + ob.name +  ob.statusText +'。';
                    }else if(type == 69){
                        alarmText = ob.position + ob.sensorId + ob.name +  ob.statusText +'。' ; 
                    }else if(ob.pid == state.sensorConfig.switch){
                        alarmText = ob.position + ob.sensorId + ob.name +  ob.statusText +'。';
                    }else if(ob.pid == state.sensorConfig.analog){
                        alarmText = ob.position + ob.sensorId + ob.name +  ob.value + ob.statusText +'。';  
                    }
                    actions.addNewAlarm(alarmText,ob.showColor);                    
                }     
            }
        }else{
            if(ob.id){
                flagNewSensor = true;        
            }   
        }
    });
    // }  
        state.newCard = newcardlist;
        if(flagNewSensor){
            state.updateall++;
            actions.getOwnList();
        }        
    }, 
    //更新实时数据列表
    chageList(){  
        if(state.maxPageList.list1 && state.maxPageList.list1.length){
            state.maxPageList.list1 = state.maxPageList.list1.map(ob => state.AllhashSensor[ob.k])  
        }
        if(state.maxPageList.list2 && state.maxPageList.list2.length){
            state.maxPageList.list2 = state.maxPageList.list2.map(ob => state.AllhashSensor[ob.k]) 
        }
        if(state.maxPageList.list3 && state.maxPageList.list3.length){
            state.maxPageList.list3 = state.maxPageList.list3.map(ob => state.AllhashSensor[ob.k]) 
        }  
        if(state.maxPageList.list6 && state.maxPageList.list6.length){
            state.maxPageList.list6 = state.maxPageList.list6.map(ob => state.AllhashSensor[ob.k]) 
        }
    },
    //添加到 滚动报警窗口
    addNewAlarm(text,color){
        state.alarmAuList.push(text)   
        state.alarmTextList.push(`<span style="color:${color};">${text}</span>`);    
    },
    // 运行参数值初始化
    initLevelValue(sensor,alarmOb = sensor){
        const { 
             upper_level1,upper_level2,upper_level3,upper_level4,
             floor_level1,floor_level2,floor_level3,floor_level4,
             limit_alarm,limit_power,limit_repower,
             floor_alarm,floor_power,floor_repower,
             upgrade1,upgrade2,upgrade3
         } = sensor;
        alarmOb.limit_repower = actions.getLevelValue(limit_repower);
        alarmOb.floor_repower = actions.getLevelValue(floor_repower);
        alarmOb.limit_power = actions.getLevelValue(limit_power); 
        alarmOb.floor_power = actions.getLevelValue(floor_power); 
        alarmOb.limit_alarm = actions.getLevelValue(limit_alarm); 
        alarmOb.floor_alarm = actions.getLevelValue(floor_alarm); 
        alarmOb.upper_level1 = actions.getLevelValue(limit_alarm);//旧协议的报警字段
        alarmOb.upper_level2 = actions.getLevelValue(upper_level2);
        alarmOb.upper_level3 = actions.getLevelValue(upper_level3);
        alarmOb.upper_level4 = actions.getLevelValue(upper_level4);
        alarmOb.floor_level1 = actions.getLevelValue(floor_alarm);//旧协议的报警字段
        alarmOb.floor_level2 = actions.getLevelValue(floor_level2);
        alarmOb.floor_level3 = actions.getLevelValue(floor_level3);
        alarmOb.floor_level4 = actions.getLevelValue(floor_level4);
        alarmOb.upgrade1 = upgrade1;
        alarmOb.upgrade2 = upgrade2;
        alarmOb.upgrade3 = upgrade3;
    }, 
    getLevelValue(value){
        return value != null  && Math.abs(value) < 999999 ? value : '';
    }
}
export default {
    state,
    actions
}