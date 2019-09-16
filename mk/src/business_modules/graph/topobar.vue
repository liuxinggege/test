<style type="text/css">
.mainTopo {
    margin: 0px;
    padding: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
#topoPage{
	background-color: #B2EFF8;
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.infowindow{
	overflow: auto;
	padding: 5px;
}
.infowindow p{
    margin: 0;
	padding: 0;
	color: #777;
}
.turnCss{
	color:rgb(32,160,255);
	cursor: pointer;
	margin-right: 5px;
}
</style>
<template>	
	<div id="topoPage"></div>   
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'

export default {
    name: 'topo',
    components: {     
    },
    props:{
		addDeviceList:Array,//添加设备类型列表
	},
    data () {
    	return {
			state:store.state,
			action:store.actions, 
			svgUrl:'./static/svg/',
			imgUrl:'./static/img/',
            intervalId:null,//获取GD设备定时器ID
            updateTimer:null,//更新数据定时器ID
    		routeName:'',
    		typeName:'',
            dragData:[],//绘制
			ctrlKey:false,
            drawLines:false,
            menuList:[{label:'环境监测'},{label:'人员定位'},{label:'语音广播'}],//图层菜单
            selectionModel:'',
            selectedFeature:'',
            pointData:[],
            FlowList:[],
            maxPageList:{list1:[],list2:[],list3:[],list4:[],list5:[]},
            cancelClean:false,            
            selectArea:'',
			beginPos:'',
			dataModel:null,//数据模型
			graphView:null,//拓扑组件视图对象
			ruler:null,//标尺
			overviewPanel:null,//鹰眼面板
			treePanel:null,//图层面板
			listPanel:null,//列表面板
			panel2:null,//设备信息面板
			PanelConfig:null,//设备信息面板配置项
			dragImage:null,//列表里面被拖动的图标对象
            RouteList:[],
            edge:'',
			moveData:{},
			newNode:{},
			splitView:null
    	}
    },
    computed: {
		//设备列表数据
    	watchingData(){
		  var list = []  
			if( this.$route.query.type == 'watching-scan' || this.$route.query.type == 'watching-edit' ||  //环境监测设备列表(显示、编辑) 
			    this.$route.name=='Dsystem' ||  //瓦斯抽放设备列表(显示、编辑)
			    this.$route.name=='watching-index/wind'){ // 通风系统设备列表(显示、编辑)
				list = [...this.maxPageList.list1,...this.maxPageList.list2,...this.maxPageList.list5];
			}
			else if(this.$route.query.type=='route-scan' || this.$route.query.type=='route-edit'){ 	//人员定位设备列表(显示、编辑)
				list = [...this.maxPageList.list3,...this.maxPageList.list5];
			}
			else if(this.$route.query.type=='voice-scan'){ //语音广播设备列表(显示、编辑)
				list = [...this.maxPageList.list4,...this.maxPageList.list5];
			}
			else if(this.$route.name=='home_index' && this.$route.query.type == "scan"){ //首页设备列表(显示)
				list = [...this.maxPageList.list1,...this.maxPageList.list2,...this.maxPageList.list3,...this.maxPageList.list4,...this.maxPageList.list5];
			}
			return list
    	}
    },
    watch: {
		'$route':'fetchData',       
		 'state.frequency': {
			handler: function(val) {
				//轨迹回放的频率 数字越大越快
				this.edge && this.edge.s("flow.step", val);
			},
			deep: true
		 },		
    },
    methods: {
        //添加区域 为了用户体验 先主动添加区域 不再重构地图
        addLine(data){     	   
       	    var node = new ht.Node();
		    var str = data.lineString.split(',') //添加区域的时候，需要知道矩形的宽、高、中心点 
		    var x = parseInt(str[0]),y = parseInt(str[1]);
			    node.setSize(data.n_point, data.e_point); //宽、高都为正整数
				node.setPosition(x,y);//中心点也是正整数
				node.setLayer(1);
				node.setName('区域:'+data.areaname);
				node.setParent('');
				node.s({'label.color': 'red'});//字体的颜色
				node.setTag(data.id)
				node.setStyle('shape','roundRect');
				node.setStyle('shape.background', null);
				node.setStyle('shape.border.width', 2);
				node.setStyle('shape.border.pattern', [5, 5]);
				node.s({
					'2d.movable': false, //不允许拖动
					 'shape.border.color':'blue'  //线框颜色
				});
				this.dataModel.add(node)
        },  
        //删除巷道、传感器
        removeNode(k){
       	  console.log(k)
	      window.vuef.dataModel.removeDataByTag(k)
        },	
		//设置广播播放动画 alarmMusic-icon  music-icon
		setVoiceAnimation(data,img){
			data.addStyleIcon('action', {
                    position: 20,
                    width: 32,
                    height: 32,
                    names: [img],
                    opacity: { func: 'attr@action.opacity' },   
            }); 
            data.setAnimation({
                        hide: {
                            property: "action.opacity",
                            accessType: "attr", 
                            from: 1, 
                            to: 0.2,
                            frames: 1,
                            next: "show",
                        },
                        show: {
                            property: "action.opacity",
                            accessType: "attr", 
                            from: 0.2, 
                            to: 1,
                            frames: 1,
                            next: "hide"
                        },
                        start: ["hide"]
            });
		},
		//设置报警动画
		setSensorAnimation(data,color,p  = 20 , w = 32 , h = 32){
			data.setAttr('alarm.color', color);
			data.addStyleIcon('alarm', {
				position: p,
				width: w,
				height: h,
				names: ['alarm-icon']
			}); 
			data.setAnimation({
				hide: {
					property: "alarm.opacity",
					accessType: "attr", 
					from: 1, 
					to: 0.2,
					frames: 1,
					next: "show"
				},
				show: {
					property: "alarm.opacity",
					accessType: "attr", 
					from: 0.2, 
					to: 1,
					frames: 1,
					next: "hide"
				},
				start: ["hide"]
			});
		},
		//移除动画
		removeSensorAnimation(data,name){
			data.removeStyleIcon(name);
			data.setAnimation(null);
		},
		//更新图所有设备的状态、值、图标、位置等相关实时信息  获取地图上的所有节点进行遍历 
        update(){	  	
	        this.graphView.dm().each(function(data) {	
				if(data._image === "back"){
					return
				}
				if(window.vuef.state.AllhashSensor[data._tag] != undefined && window.vuef.state.AllhashSensor[data._tag].type==900){//区域更新
					var rdata = window.vuef.state.AllhashSensor[data._tag]
					if(!window.vuef.state.AllhashSensor[data._tag].lineString){
						data.s({'label.color': rdata.showColor});
					}else{
						data.s({
							'shape.border.color':rdata.showColor?rdata.showColor:'blue',
							'label.color': rdata.showColor
						});
						data.setName(rdata.areaname + ':' + (rdata.statusText||'正常'));
						if(rdata.now_status == 1 || rdata.now_status == 2 ){
							!data._animation && window.vuef.setSensorAnimation(data, "red",19,60,60);								
						}else{
							data._animation	&& window.vuef.removeSensorAnimation(data,'alarm');
						}
					}	
				}else if(window.vuef.state.AllhashSensor[data._tag]){ //传感器、分站、电源更新
		        	var rdata = window.vuef.state.AllhashSensor[data._tag]
		        		data.s({'label.color': rdata.showColor});
						if(rdata.type!=72){
							data.setName((rdata.statusText?rdata.statusText:'') + rdata.now_value);
						}else{	
							data.setName((rdata.currentText?rdata.currentText:'-')+'('+(rdata.percent?rdata.percent:'-')+')');//电源更新
						}
		        		var status = rdata.now_status;
						if(status==0||status==6||status==7){ //正常状态
							data.setImage(window.vuef.svgUrl+ rdata.path);
						}else{
							data.setImage(window.vuef.svgUrl + rdata.path2)
						}				        
						if(rdata.pid==window.vuef.state['sensorConfig']['analog']||rdata.pid==window.vuef.state['sensorConfig']['switch']){ //不同系统不同坐标  瓦斯抽放为x3_point，y3_point  通风系统为x2_point，y2_point	
							if(window.vuef.$route.name=='Dsystem'){
								data.setPosition({x:rdata.x3_point,y:rdata.y3_point});
							}else if(window.vuef.$route.name=='watching-index/wind'){					        	
								data.setPosition({x:rdata.x2_point,y:rdata.y2_point});
							}else{
								data.setPosition({x:rdata.x_point,y:rdata.y_point});
							}
						}else{
							data.setPosition({x:rdata.x_point,y:rdata.y_point});
						}	
						if(status == 5){
							data._animation && window.vuef.removeSensorAnimation(data,'action');
						}else if(rdata.sensor_type == 53 || rdata.sensor_type == 56){ //断电控制器断馈电仪器控制动作  power-icon
							if(rdata.action_value == 1){
								!data._animation && window.vuef.setVoiceAnimation(data,'power-icon');
							}else{
								data._animation && window.vuef.removeSensorAnimation(data,'action');
							}		
						}else if(rdata.pid == window.vuef.state['sensorConfig']['voice']){ //广播播放动作 music-icon
							if(rdata.action_value == 2){
								!data._animation && window.vuef.setVoiceAnimation(data,"music-icon");
							}else{
								data._animation && window.vuef.removeSensorAnimation(data,'action');
							}		
						}else if(rdata.sensor_type == 71){ 	//声光报警器分级报警动作 alarmMusic-icon
							if(rdata.action_value && rdata.action_value > 0){
								!data._animation && window.vuef.setVoiceAnimation(data,'alarmMusic-icon');
							}else{
								data._animation && window.vuef.removeSensorAnimation(data,'action');
							}		
						}else if(rdata.typeid == window.vuef.state['sensorConfig']['cardReader']){ //读卡器呼叫动作 call-icon
							if(rdata.action_value == 1){
								!data._animation && window.vuef.setVoiceAnimation(data,"call-icon");
							}else{
								data._animation && window.vuef.removeSensorAnimation(data,'action');
							}		
						}
				}else if(!window.vuef.state.AllhashSensor[data._tag]&&window.vuef.FlowList.length){
					//刷选出巷道的传感器
					window.vuef.FlowList.forEach(function(ob) {
						if(ob.uid==data._tag){
							var sdata = window.vuef.state.AllhashSensor[ob.k];
							if(undefined == sdata){
								data.s("shape.dash.flow", false);
							}else{
								var str = sdata.now_value.split('(');	
								if(str[0]!='停'&&sdata.now_status!=5){ //当设备传感器为停的时候为通讯中断的 时候停止流动
									data.s("shape.dash.flow", true);
								}else{
									data.s("shape.dash.flow", false);
								}
							}
							
						}
					})
				}
			})
		},
		//清除关闭设备信息面板
		closeDailog(){
			var topoPage = document.getElementById('topoPage');
			if(this.panel2 &&this.PanelConfig){
				topoPage.removeChild(this.panel2.getView());
				this.panel2 = null;
				this.PanelConfig = null;	
			}
		},
        //显示设备信息面板
        showDailog(e,rdata){	    		
			this.closeDailog(); //确保图上只有一个showDailog面板
			var x_point,y_point;
			if((rdata.pid==this.state['sensorConfig']['analog']||rdata.pid==this.state['sensorConfig']['switch']) && (this.$route.name=='watching-index/wind')){
				x_point = rdata.x2_point;
				y_point = rdata.y2_point;
			}else if((rdata.pid==this.state['sensorConfig']['analog']||rdata.pid==this.state['sensorConfig']['switch']) && (this.$route.name=='Dsystem')){
				x_point = rdata.x3_point;
				y_point = rdata.y3_point;	
			}else{
				x_point = rdata.x_point;
			    y_point = rdata.y_point;
			}
			//浮窗显示内容
			var html,str = '';
			if(rdata.type == 900 && rdata.emphasis == 3 ){//环境监测的区域
				html = `<div class="infowindow">
							<p>区域名称：${rdata.areaname}</p>
							<p>状态：${rdata.statusText}</p>
							<p>区域类型：${rdata.area_type_name}</p>
							<p>属性：${(rdata.emphasis==1?"非重点区域":(rdata.emphasis ==2?"重点区域":""))}</p>
						</div>`;
			}else if(rdata.type == 900 && rdata.emphasis && rdata.emphasis !=3 ){//人员定位的区域
				html = `<div class="infowindow">
							<p>区域名称：${rdata.areaname}</p>
							<p>属性${rdata.emphasis == 1 ?"非重点区域":(rdata.emphasis ==2?"重点区域":"")}</p>
							<p>最大允许人数(人)：${rdata.max_allow}</p>
							<p>最大允许时长(分钟)：${rdata.max_time}</p>
							<p>出入口：${rdata.is_exit==0?"否":"是"}</p>
						</div>`;
			}else if(rdata.type == 72 || rdata.type == 102 || rdata.type == 103){//电源箱电缆、传输接口
				html = `<div class="infowindow">
							<p>名称：${rdata.sensorname}</p>
							<p>状态：${rdata.statusText}</p>
							<p>X坐标：${x_point}</p>
							<p>Y坐标：${y_point}</p>
							${rdata.type==72?`<p>电量：${rdata.currentText||"-"}(${rdata.percent||"-"})</p>`:""}
						</div>`;
			}else if(rdata.type == 16){//分站
				html = `<div class="infowindow">
							<p>名称：${rdata.station_name}</p>
							<p>状态：${rdata.statusText}</p>
							<p>X坐标：${x_point}</p>
							<p>Y坐标：${y_point}</p>
						</div>`;
			}else if(rdata.radioId){//广播分站
				html = `<div class="infowindow">
							<p>名称：${rdata.name}</p>
							<p>状态：${rdata.statusText}</p>
							<p>X坐标：${x_point}</p>
							<p>Y坐标：${y_point}</p>
						</div>`;
			}else{ //其他
				html = `<div class="infowindow">
							<p>名称：${rdata.type}</p>
							<p>状态：${rdata.statusText}</p>
							<p>X坐标：${x_point}</p>
							<p>Y坐标：${y_point}</p>
						</div>`;
			}
			//模拟量传感器的展示
			if(rdata.pid==window.vuef.state['sensorConfig']['analog']&&rdata.sensor_type!=69){
				str += `<div class="infowindow">
							<p>上限报警：${rdata.limit_alarm == null || Math.abs(rdata.limit_alarm) >= 999999?'':rdata.limit_alarm}</p>
							<p>上限断电：${rdata.limit_power == null || Math.abs(rdata.limit_power) >= 999999?'':rdata.limit_power}</p>
							<p>上限复电：${rdata.limit_repower == null|| Math.abs(rdata.limit_repower) >= 999999?'':rdata.limit_repower}</p>
							<p>下限报警：${rdata.floor_alarm == null || Math.abs(rdata.floor_alarm) >= 999999?'':rdata.floor_alarm}</p>
							<p>下限断电：${rdata.floor_power == null || Math.abs(rdata.floor_power) >= 999999?'':rdata.floor_power}</p>
							<p>下限复电：${rdata.floor_repower == null ||Math.abs(rdata.floor_repower) >= 999999?'':rdata.floor_repower}</p>
						</div>`;       		
			}else if(rdata.sensor_type==69){//gd5传感器的特殊展示
				str += `<div class="infowindow"> 
							<p>一氧化碳(%)：${rdata.co}</p>
							<p>温度(℃)：${rdata.temperature}</p>
							<p>压力(KPa)：${rdata.pressure}</p>
							<p>甲烷(%)：${rdata.wasi}</p>
							<p>工况混合流量/总累积量(m³/分)：${rdata.flow_work}/${rdata.total_flow_work?rdata.total_flow_work.toFixed(2):0}</p>
							<p>标况混合流量/总累计量(m³/分)：${rdata.flow_standard}/${rdata.total_flow_standard?rdata.total_flow_standard.toFixed(2):0}</p>
							<p>标况纯流量/总累计量(m³/分)：${rdata.flow_pure}/${rdata.total_flow_pure?rdata.total_flow_pure.toFixed(2):0}</p>
						</div>`;	
			}
		
			// 操作面板 快捷跳转 
			if((rdata.pid==window.vuef.state['sensorConfig']['analog']||rdata.pid==window.vuef.state['sensorConfig']['switch'])&&rdata.sensor_type!=69){ //模拟量、开关量	
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置详情</a>
							<a class="turnCss" onclick="window.vuef.showReal(window.vuef.selectedFeature)">实时曲线</a>
							<a class="turnCss" onclick="window.vuef.showList(window.vuef.selectedFeature)">调用列表</a>
							<a class="turnCss" onclick="window.vuef.showTable(window.vuef.selectedFeature)">调用报表</a>
						</p>`;
				if(rdata.sensor_type == 51 && this.$route.name == 'watching-index/wind'){ //设备开停传感器的其它操作 设备传感器的相关巷道
					str += `<p style="margin:5px">
								<a class="turnCss" onclick="window.vuef.drawLine(window.vuef.selectedFeature)">自定义风向巷道</a>
								<a class="turnCss" onclick="window.vuef.deleteLine(window.vuef.selectedFeature)">删除风向巷道</a>
							</p>`;
				}	
			}else if(rdata.sensor_type==69){ //gd5传感器	
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置详情</a>
							<a class="turnCss" onclick="window.vuef.showReal(window.vuef.selectedFeature)">实时曲线</a>
						</p>`;
			}else if(rdata.typeid==window.vuef.state['sensorConfig']['cardReader']){//人员定位
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置详情</a>
							<a class="turnCss" onclick="window.vuef.showReal(window.vuef.selectedFeature)">列表显示</a>
						</p>`;
			}else if(rdata.type == 900 && rdata.emphasis && this.$route.name=='Wsub'){ //区域绘制
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkArea(window.vuef.selectedFeature)">设备配置详情</a>
							<a class="turnCss" onclick="window.vuef.drawArea(window.vuef.selectedFeature)">绘制区域</a><br>
							<span style="color:red;font-size:8px">(按住Ctrl键,鼠标拉框绘制区域)</span>
						</p>`;
			} else if(rdata.type == 900 && this.$route.name != 'Wsub'){ //区域展示	
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkArea(window.vuef.selectedFeature)">区域详情</a>
						</p>`;
			}else if((rdata.type==102||rdata.type==103) && this.$route.name=='Wsub'){ //电缆、传输接口 绘制
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置详情</a>
							<a class="turnCss" onclick="window.vuef.drawLine(window.vuef.selectedFeature)">绘制设备</a>
						</p>`;
			}else{ //其他 分站 等
				str += `<p style="margin:5px">
							<a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置详情</a>
					    </p>`;
			}
	        html += str;
			this.panel2 = new ht.widget.Panel({
					id:'Panel2',
					title: rdata.alais|| rdata.areaname || rdata.name,//展示的标题
					titleBackground:'#2C3E50',
					separatorColor:'#abb2b9',
					width: 290,
					borderWidth:2,
					narrowWhenCollapse: false,
					contentHeight: rdata.pid==window.vuef.state['sensorConfig']['analog']?250:150,//展示的高度
					content: html, //展示的内容
					buttons:[],
					selfAttr:{
						x:e.offsetX + 35,
						y:e.offsetY,
						k:rdata.k
					}
			});	            
			this.panel2.setPosition(e.offsetX + 35, e.offsetY);//离传感器的距离	
			this.PanelConfig = this.panel2.getPanelConfig('Panel2');
			document.getElementById('topoPage').appendChild(this.panel2.getView());
		},	
	    //选中传感器的相关动作
        selected(k){
			var hasData = false;
        	window.vuef.graphView.dm().each(function(data) {
        		if(window.vuef.state.AllhashSensor[data._tag]&&window.vuef.state.AllhashSensor[data._tag].uid==k){
        			var rdata = window.vuef.state.AllhashSensor[data._tag];
					window.vuef.selectionModel.setSelection(data);
					if(data._position.x || data._position.y){
							window.vuef.graphView.fitRect({
								x:data._position.x,
								y:data._position.y,
								width:data._width,
								height:data._height
							},false,true)
							window.vuef.showDailog({
								offsetX:document.body.clientWidth/2 - 20,
								offsetY:document.body.clientHeight/2 - 60
							},rdata)
							hasData = true;
					}
        		}
			})
			if(!hasData){
				window.vuef.$message.warning("尚未配置坐标，请将设备拖动到底图配置坐标！");
				window.vuef.closeDailog();
			}	
		},
		//清除选中的节点
        clean(){
       	  console.log('clean')
       	  this.cancelClean = true
       	  this.selectionModel.clearSelection()        
        },
		//设置ht图片 图标
		setHtImage(){	
			ht.Default.setImage('alarm-icon', {//设备超限断电报警  alarm-icon  
						width: 100,
						height: 100,
						opacity: { func: 'attr@alarm.opacity' },
						comps: [
							{
								type: 'triangle',
								rect: [2, 2, 96, 96],
								background: { 
									value : 'gray',
									func: 'attr@alarm.color'
								}
							},
							{
								type: 'rect',
								rect: [45, 30, 10, 40],
								background: 'white'
							},
							{
								type: 'circle',
								rect: [40, 72, 20, 20],
								background: 'white'
							}
						]
			});				
			ht.Default.setImage('alarmMusic-icon', this.imgUrl + "alarm_1234.svg");//声光报警器动作后的 alarmMusic-icon 
			ht.Default.setImage('music-icon', this.imgUrl + "music.svg");	//广播播放中  music-icon
			ht.Default.setImage('power-icon', this.imgUrl + "power_action.svg");//断馈电仪器控制 power-icon
			ht.Default.setImage('call-icon', this.imgUrl + "call_action.svg");//读卡器呼叫控制 call-icon
			ht.Default.setImage('eye', this.imgUrl + "eye.png");//鹰眼图标	
			ht.Default.setImage('area', this.imgUrl + "test2.png");//没有绘制的区域图标	
		},
		//改变底图  通过this.$route.name
    	changeMap(){
			this.routeName = this.$route.query.type;
			this.typeName =  this.$route.name;
			if(this.$route.name=='watching-index/wind'){
				return  this.$store.state.url3
			}else if(this.$route.name=='Dsystem'){
				return this.$store.state.url2
			}else{
				return this.$store.state.url1
			}						
		},
		//新增的传感器主动添加到底图
        addNode(k,newPoint){
			 console.log(window.vuef.newNode,k,this.dataModel.getDataByTag(k))
       	  if(!this.dataModel.getDataByTag(k)){//先判断是否具有，否，添加 
	       	  var rdata = window.vuef.newNode;
	       	  var node = new ht.Node();
				  node.setLayer(1);
				  node.s({'label.color': 'red'});				        
				  node.setWidth(30);
				  node.setHeight(30);
				  node.setPosition(rdata.point.x,rdata.point.y)
				  node.setName(rdata.ob.v)
				  node.setTag(k) //为了hash表的更新 以k值配对
				  node.setImage( window.vuef.svgUrl + (rdata.ob.path2 || rdata.ob.path))
				  this.dataModel.add(node)
	      }
		},
		//函数控制图层tree组件的默认勾选 并且遍历传感器建立设备与不同图层的对应关系、并将配置过坐标的设备添加到数据模型
		nodifyData(list,dataModel) {	
			var name = this.routeName,type = this.typeName;
			var group0 = new ht.Group(),
				group1 = new ht.Group(),
				group2 = new ht.Group(),
				group3 = new ht.Group();
				group0.setName("所有图层");//图层tree组件根节点
				group0.setTag("group0");
				group0.setExpanded(true);
				dataModel.add(group0);	
				//图层tree组件的默认勾选 
				window.vuef.menuList.forEach(function(ob) {			       		
					if(ob.label=='环境监测'){
						group1.setName("环境监测");
						group1.setTag("group1");			        			        
						if((type=='home_index'&& name == 'scan')||name=='watching-scan'){
							group1.setExpanded(true);  //选中
						}else{
							group1.setExpanded(false); //不选中
						}
						group1.setParent(group0);
						dataModel.add(group1);
					}
					if(ob.label=='人员定位'){
						group2.setName("人员定位");
						group2.setTag("group2");
						if((type=='home_index'&&name=='scan')||name=='route-scan'){
							group2.setExpanded(true);
						}else{
							group2.setExpanded(false);
						}
						group2.setParent(group0);
						dataModel.add(group2);
					}
					if(ob.label=='语音广播'){
						group3.setName("语音广播");
						group3.setTag("group3");
						if((type=='home_index'&&name=='scan')||name=='voice-scan'){
							group3.setExpanded(true);
						}else{
							group3.setExpanded(false);
						}
						group3.setParent(group0);
						dataModel.add(group3);
					}
				})			 
				//遍历传感器区分图层显示
				list.forEach(m => {
					//不是区域和GD5
					if(m.type!=900 && m.type!=102 && m.type!=103){
						var node = new ht.Node();
						node.setLayer(1);
						node.s({'label.color': m.showColor});				        
						node.setWidth(30);
						node.setHeight(30);	
						var x_point,y_point;
						if(m.pid==window.vuef.state['sensorConfig']['analog']||m.pid==window.vuef.state['sensorConfig']['switch']){
							if(type=='Dsystem'){
								x_point = m.x3_point
								y_point = m.y3_point
							}else if(type=='watching-index/wind'){
								x_point = m.x2_point
								y_point = m.y2_point
							}else{
								x_point = m.x_point
								y_point = m.y_point
							}
							node.setPosition(x_point,y_point);	
						}else{
							x_point = m.x_point
							y_point = m.y_point
							node.setPosition(m.x_point,m.y_point);	
						}
						node.setImage(window.vuef.svgUrl + m.path);				        
						node.setTag(m.k);
						node.s("select.color", "red");
						//环境监测显示
						if(m.pid==window.vuef.state['sensorConfig']['switch']||m.pid==window.vuef.state['sensorConfig']['analog']){
							if(type=='home_index'){
							node.setParent(group1);
							}else{
							node.setParent('');
							}					          
						}else if(m.typeid==window.vuef.state['sensorConfig']['cardReader']){//人员定位显示
							if(name=='route-edit'||type=='detailTable'){
							node.setParent('');
							}else{
							node.setParent(group2);
							}
						}else if(m.radioId){//语音广播显示
							node.setParent(group3);
						}else{
							node.setParent(group0);
						}
						node.setName(m.statusText + m.now_value);					            					            
					}else if(m.lineString&&m.type==900){//已绘制过的区域
						var node = new ht.Node();
						var str = m.lineString.split(',')
						var x = parseInt(str[0]),y = parseInt(str[1]);
							node.setSize(m.n_point, m.e_point);
							node.setPosition(x,y);
							node.setLayer(1);
							node.setName('区域:'+m.areaname);
							node.setParent('');
							node.setTag(m.id)
							node.s({'label.color': 'red'});
							node.setStyle('shape','roundRect');
							node.setStyle('shape.background', null);
							node.setStyle('shape.border.width', 2);
							node.setStyle('shape.border.pattern', [5, 5]);
							node.s({
								'2d.movable': false,
								'shape.border.color':'blue'
							});
					}else if(m.lineString&&(m.type==102||m.type==103)){
						//已经绘制的电缆、传输接口
					}else {//区域未绘制的时候					        	
						var node = new ht.Node();
							node.setLayer(1);						        	
							node.setTag(m.id)
							if(!m.lineString&&m.type==900){
								node.setImage('area');	
							}else{
								node.setWidth(30);
								node.setHeight(30);
								node.setImage(window.vuef.svgUrl + m.path);
								node.setPosition(m.x_point,m.y_point);
								node.setName(m.name);		
							}						        	
					}
					if((name == 'edit'||name == 'route-edit'||name == 'watching-edit')&&(m.type==16||m.type==72||m.typeid==window.vuef.state['sensorConfig']['cardReader']||m.pid==window.vuef.state['sensorConfig']['analog']||m.pid==window.vuef.state['sensorConfig']['switch'])){
						node.s({'2d.movable': true});
					}else{
						node.s({'2d.movable': false});
					}
					if(m.type==900){//区域暂时直接加进去
						if(m.lineString){
							dataModel.add(node);
						}else{
							if((name == 'watching-edit') && m.area_type_id){
								dataModel.add(node);
							}else if((name == 'route-edit') && !m.area_type_id){
								dataModel.add(node);
							}
						}	
					}else{
						if(x_point || y_point){//设备判断是否配置过坐标 只有设置过的坐标的设备才会添加到数据模型中去
							dataModel.add(node);
						}
					}		 
				})	    
		},
		//创建图层tree组件 建立数据关系  函数控制传感器在不同图层的显示
		makeTreeModel(dataModel) {
			var name = this.routeName,type = this.typeName;
			var group0 = dataModel.getDataByTag('group0'),
				group1 = dataModel.getDataByTag('group1'),
				group2 = dataModel.getDataByTag('group2'),
				group3 = dataModel.getDataByTag('group3'),
				troot = new ht.Group(),
				tlay1 = new ht.Group(),
				tlay2 = new ht.Group(),
				tlay3 = new ht.Group(),
				treeModel = new ht.DataModel();
		        troot.setName(group0.getName());
		        troot.setExpanded(true);
		        troot.setAttrObject(group0);
		        treeModel.add(troot);
		        //权限是否有环境监测
		        if(group1){
			        tlay1.setName(group1.getName());
			        tlay1.setParent(troot);
			        tlay1.setAttrObject(group1);
			        if(name=='watching-scan'||(type=='home_index'&&name=='scan')){
			            treeModel.add(tlay1)
			        }else{
			        	treeModel.remove(tlay1);
			        }
		        }
		        //权限是否有人员定位
		        if(group2){
			        tlay2.setName(group2.getName());
			        tlay2.setParent(troot);
			        tlay2.setAttrObject(group2);
			        if(name=='route-scan'||(type=='home_index'&&name=='scan')){
			           treeModel.add(tlay2);
			        }else{
			       	   treeModel.remove(tlay2);
			        }
		        }
		        //权限是否有语音广播
		        if(group3){
			        tlay3.setName(group3.getName());
			        tlay3.setParent(troot);
			        tlay3.setAttrObject(group3);
			        if(name=='voice-scan'||(type=='home_index'&&name=='scan')){
			            treeModel.add(tlay3);
			        }else{
			        	treeModel.remove(tlay3);
			        }
		        }
		        //图层的改变事件控制设备隐藏和显示
		        treeModel.getSelectionModel().addSelectionChangeListener(function(event) {
		            event.datas.each(function(item) {
		                var node = item.getAttrObject();
		                if (node) {
		                    node.eachChild(function(child) {
		                        if (event.kind == "remove") {
		                            child.setAttr('vis', 'hide');
		                        } else if (event.kind == "append") {
		                            child.setAttr('vis', 'visible');
		                        }
		                    })
		                }
		            })
		        })
		        return treeModel;
		},
		//图层面板的绘制 
		setTreePanel(dataModel,treeModel){
			var treeView = new ht.widget.TreeView(dataModel);
				treeView.setCheckMode('all');
				treeView.enableToolTip();
				treeView.setVisibleFunc(function(data) {
					if (data instanceof ht.Group) {
						return true;
					}
					return false;
				});
				treeView.setDataModel(treeModel);
			var rootNode = treeModel.getRoots().get(0);
				treeView.expand(rootNode);
				treeView.checkData(rootNode);
			var treePanel = new ht.widget.Panel({
		                title: "图层选项",
		                restoreToolTip: "图层选项",
		                exclusive: true,
		                titleIconSize: 16,
		                width: 200,
		                contentHeight: 100,
		                content:treeView,
		                narrowWhenCollapse: false,
		                expanded: true,
		                buttons: ["minimize"]
				});	
				treePanel.setPositionRelativeTo("rightTop");
				treePanel.setPosition(0, 0);
				return treePanel;
		},
		//鹰眼组件面板的创建 
		initOverviewPanel(graphView) {
			let overviewPanel = new ht.widget.Panel({
					title: "鹰眼",
					restoreToolTip: "鹰眼",
					titleIcon:'eye',
					titleIconSize: 16,
					exclusive: true,
					width: 200,
					contentHeight: 100,
					narrowWhenCollapse: true,
					content: new ht.graph.Overview(graphView),
					expanded: true,
				});
				overviewPanel.setPositionRelativeTo("rightBottom");
				overviewPanel.setPosition(0, 0);
				return overviewPanel;
		},
		//创建createListView组件  list列表数据   type列表类型
		createListView(list,type){
			let listView = new ht.widget.ListView();
				listView.setRowHeight(26); 
				listView.setIndent(20);    
				listView.setRowLineVisible(true);
				listView.drawRowBackground = function(g, data, selected, x, y, width, height){
					if(this.isSelected(data)){
						g.fillStyle = '#87A6CB';
					}
					else if(this.getRowIndex(data) % 2 === 0){
						g.fillStyle = '#F1F4F7';
					}
					else{
						g.fillStyle = '#FAFAFA';
					}
					g.beginPath();
					g.rect(x, y, width, height);
					g.fill();
				};  
				listView.enableToolTip();       
				list.forEach(function(item){
					window.vuef.addNodeToListView(item,listView,type);
				}); 	
				listView.getIcon = function(data){  //设置图标
					return ht.Default.getImage(window.vuef.svgUrl + data.a("path"));
				}; 
				listView.getLabel = function(data){//设置显示文字
					return data.showLabel;
				}; 
				let splitView = null,toolbar = null;
				if(type == 2){ //设备列表 输入框查询
					let searchSensor = null;
					toolbar = new ht.widget.Toolbar();//顶部搜索栏
					toolbar.setItems([                    
						{
							id: 'searchSensor',
							label: ' ',
							icon: window.vuef.imgUrl +'search.png',
							unfocusable:true,
							textField: {
								width: 180
							}
						},
						"separator",
						{
							icon:window.vuef.imgUrl +'timg.png',
							label:'',
							type: '',
							unfocusable:true,
							selected: false,
							action: function(){
								searchSensor.value = "";
								listView.invalidateModel();
							}
						}
					]);    
					
					searchSensor = toolbar.getItemById('searchSensor').element.getElement();
					searchSensor.placeholder = "请输入关键字或者坐标筛选";
					searchSensor.onkeyup = function(e){
						listView.invalidateModel();
					};  
					splitView = new ht.widget.SplitView(toolbar, listView, 'v', 25);//分割组件  
					splitView.setDraggable(false);    
					splitView.setDividerBackground("#ccc");    
					// splitView.setDividerSize(5);  
					// splitView.invalidate();
					// splitView.validate();
					// splitView.iv();
					window.vuef.splitView = splitView;
					listView.setVisibleFunc(function(data){
						
						var text = toolbar.v('searchSensor');
						if(text){                        
							return data.showLabel.toLowerCase().indexOf(text.toLowerCase()) >= 0;
						}
						return true;
					});
					
				}
			//拖拽交互事件
			let hasCoord = null,isPermission = window.vuef.$route.name=='Wsub'||window.vuef.$route.query.type == 'edit'? true :false;
			listView.handleDragAndDrop = function(e, state){
				if(state === 'prepare'){
					if(window.vuef.dragImage && window.vuef.dragImage.parentNode){
						document.body.removeChild(window.vuef.dragImage);
					}
					window.vuef.dragData = listView.getDataAt(e);
					listView.sm().ss(window.vuef.dragData);
					hasCoord = true;	
					if(type != 1){
						hasCoord = window.vuef.dragData.coord.x || window.vuef.dragData.coord.y ? false : true;
						window.vuef.selected(window.vuef.dragData.a("uid"));
					}
					if(isPermission && hasCoord){
						window.vuef.dragImage = ht.Default.toCanvas(window.vuef.svgUrl + window.vuef.dragData.a("path"), 30, 30, 'uniform', window.vuef.dragData);     
						window.vuef.dragImage.style.zIndex = 100;
					}			
				}
				else if(state === 'begin' && isPermission && hasCoord){
					if(window.vuef.dragImage){
						let pagePoint = ht.Default.getPagePoint(e);
						window.vuef.dragImage.style.left = pagePoint.x - window.vuef.dragImage.width/2  + 'px';
						window.vuef.dragImage.style.top = pagePoint.y - window.vuef.dragImage.height/2  + 'px';
						document.body.appendChild(window.vuef.dragImage);
					}
				}
				else if(state === 'between' && isPermission && hasCoord){
					if(window.vuef.dragImage){
						let pagePoint = ht.Default.getPagePoint(e);
						window.vuef.dragImage.style.left = pagePoint.x - window.vuef.dragImage.width/2 + 'px';
						window.vuef.dragImage.style.top = pagePoint.y - window.vuef.dragImage.height/2 + 'px';   
					}
				}
				else if(state === 'end'){
					if(window.vuef.dragImage){    
						document.body.removeChild(window.vuef.dragImage);
						window.vuef.dragImage = null;  
					}
					let isInTablePanel = ht.Default.containedInView(e, window.vuef.listPanel),
						isInGraphView = ht.Default.containedInView(e, window.vuef.graphView);
						if(isPermission && hasCoord && !isInTablePanel && isInGraphView){
							let dragData = window.vuef.dragData._attrObject;
							let point = window.vuef.graphView.getLogicalPoint(e),   
								coords = {x:parseInt(point.x),y:parseInt(point.y)};
								if(type === 1){
									window.vuef.Mapclick(coords,dragData);
								}else{
									if(dragData.pid === window.vuef.state['sensorConfig']['analog'] ||dragData.pid === window.vuef.state['sensorConfig']['switch']){
										if(window.vuef.$route.name == 'Dsystem'){
											dragData.x3_point = coords.x;
											dragData.y3_point = coords.y;
										}else if(window.vuef.$route.name =='watching-index/wind'){
											dragData.x2_point = coords.x;
											dragData.y2_point = coords.y;
										}else{
											dragData.x_point = coords.x;
											dragData.y_point = coords.y;
										}
									}else{
										dragData.x_point = coords.x;
										dragData.y_point = coords.y;
									}
									window.vuef.dragData.coord = coords;
									window.vuef.newNode = {point:coords,ob:{v:dragData.statusText,path:dragData.path,path2:dragData.path2}}
									window.vuef.$emit('edit',{ob:dragData,editType:2});
									window.vuef.addNode(dragData.k);
								}		
						}
				}
			};   
			if(splitView && toolbar && type == 2){
				return splitView;
			}
			return listView
		},
		//将node添加到列表组件中
		addNodeToListView(item,listView,type){
			let data = new ht.Data(),showLabel = '',coord = {x:'',y:''};
				if(type==1){
					showLabel = item.v;
				}else if(type == 2){
					coord.x = item.x_point;
					coord.y = item.y_point;
					if(item.pid==window.vuef.state['sensorConfig']['analog'] || item.pid== window.vuef.state['sensorConfig']['switch']){
						if(window.vuef.$route.name=='watching-index/wind'){
							coord.x = item.x2_point;
							coord.y = item.y2_point;
						}else if(window.vuef.$route.name=='Dsystem'){
							coord.x = item.x3_point;
							coord.y = item.y3_point;
						}
						showLabel = item.alais + '/' +item.type;
					}else if(item.type == 16){
						showLabel =  item.alais + "/分站";
					}else if(item.type == 72){
						showLabel =  item.alais + "/电源箱";
					}else if(item.radioId){
						showLabel = item.alais + "/语音广播";
					}else if(item.typeid == window.vuef.state['sensorConfig']['cardReader']){
						showLabel = item.alais + '/人员定位读卡器';
					}else{
						showLabel = '';
					}
					if(coord.x || coord.y){
						showLabel += `(X${coord.x}Y${coord.y})`;
					}else{
						showLabel += '(未配置坐标)';
					}
					data.coord = coord;
					data.setTag(item.k)
			}	
			data.showLabel = showLabel;
			data.a(item);
			listView.dm().add(data);
		},
		//设置listView面板组件
		setListViewPanel(){
			let items = [];
			if(this.$route.name=='Wsub' || this.$route.query.type=='edit'){
				items =  [{
							title: "添加新设备",
							expanded: false,
							width: 250,
							contentHeight: 300,
							content:this.createListView(this.addDeviceList,1) //新添设备图例列表 1	
						},
						{
							title: '设备列表',
							expanded: true,
							width: 250,
							contentHeight: 300,
							content:this.createListView(this.watchingData,2)//展示所有设备的列表  2
						}] 
            }else if(this.$route.name != 'detailTable'){
				items =  [{
							title: "设备列表",
							expanded: true,
							width: 250,
							contentHeight: 300,
							content:this.createListView(this.watchingData,2)//展示所有设备的列表  2
						}]
			}
	        var listPanel = new ht.widget.Panel({//将列表组件放置在操作面板组件里面
					title: "操作面板",
					restoreToolTip: "操作面板",
					titleIconSize: 16,
					titleIcon:'eye',
					width: 252,
					contentHeight: 400,
                    titleColor: "white",
					buttons:["minimize"],
					exclusive:true,//手风琴模式
					items: items,
					
            });
            listPanel.setPositionRelativeTo("rightTop");
			listPanel.setPosition(0, 180);
			listPanel.addEventListener(function (listener, scope, ahead){
				if("endRestore" == listener.kind){
					if(window.vuef.splitView && window.vuef.splitView.iv){
						window.vuef.splitView.iv();
					}
				}
			})
			return listPanel;
		},
		//设置标尺
		setRuler(graphView){
			var ruler = new ht.widget.RulerFrame(graphView);
				ruler.getDefaultRulerConfig().guideVisible = true;
				ruler.getDefaultRulerConfig().guideTipVisible = true;
				ruler.getDefaultRulerConfig().guideTipBackground = "rgb(0, 173, 239)";
				ruler.getDefaultRulerConfig().guideTipTextColor = "white";
				ruler.getLeftRulerConfig().tickSpacingAdaptable = false;
				ruler.getLeftRulerConfig().defaultMajorTickSpacing = 100;
				ruler.getLeftRulerConfig().guideTipVisible = true;
				ruler.getTopRulerConfig().guideTipVisible = true;
				ruler.getRightRulerConfig().visible = false;
				ruler.getBottomRulerConfig().visible = false;
				ruler.iv();
	        	// ruler.addComponentPropertyChangeListener(function(e){
				// 	console.log(e)
				// })		    	
			var height = (document.body.clientHeight - 80)+'px';//展示容器的控制 考虑到全屏 linux系统用document.body.clientHeight控制
			var mainView = ruler.getView(); 
				mainView.className = 'mainTopo';			
				mainView.style.setProperty("height", height, null);
				mainView.addEventListener('click', function(e){	    //流动图在底图的点击转化为比列尺坐标   	        	
					var point = window.vuef.graphView.getLogicalPoint(e);
					var x_point = parseInt(point.x);
					var y_point = parseInt(point.y);
					if(window.vuef.drawLines){	        		
						window.vuef.pointData.push({
							x:x_point,
							y:y_point
						})
					}
				})
				mainView.addEventListener('mousemove', function(e){	  //地图上鼠标移动事件 自动打开设备信息面板	
					var node = graphView.getDataAt(e); //移动的点位上是否有node
					if(!node){
						if(window.vuef.panel2 && window.vuef.PanelConfig){
							let x = Math.abs(e.offsetX - window.vuef.PanelConfig.selfAttr.x);
							let y = Math.abs(e.offsetY - window.vuef.PanelConfig.selfAttr.y);
							if(x > 80 || y > 80){
								window.vuef.closeDailog();
							}		
						}
					}else if(node != undefined){
						window.vuef.closeDailog();
						if(node._tag && window.vuef.state.AllhashSensor[node._tag]){
							var rdata = window.vuef.state.AllhashSensor[node._tag]			        					         
							window.vuef.showDailog(e,rdata)
							window.vuef.selectedFeature = rdata//用于编辑保存的缓存
						}else{
							_.findIndex(window.vuef.RouteList, function(ob) {
								if(ob.id==node._tag){
									window.vuef.showDailog(e,ob)
									window.vuef.selectedFeature = ob;
								}
							})
						}	
					}
				})
				window.addEventListener('resize',this.resizeChange); //监听窗口大小变化 使图形界面跟着变化
				return ruler;
		},
		resizeChange(){
			if(this.graphView){
				this.graphView.fitContent(false);
			}
			if(this.ruler){
				this.ruler.invalidate();
				let height = (document.body.clientHeight - 80) + 'px';
				this.ruler.getView().style.setProperty("height", height, null);
			}
		},
		//设置graphView
		setGraphView(dataModel,back){
			var graphView = new ht.graph.GraphView(dataModel);	
				graphView.setLayers([0,1,2]);
				graphView.fitData(back, false,20, false, false)//将背景图坐标(0,0)移动到窗口中心	
	        	graphView.addInteractorListener(function (e) {	//拖动事件与绘制区域事件    	
					if(e.kind === 'beginMove'){//开始拖动事件
						window.vuef.cancelClean = false;
					}
					else if(e.kind === 'endMove'){		//结束拖动事件
						console.log(window.vuef.moveData)
						window.vuef.$emit('edit',{ob:window.vuef.moveData,editType:2});
					} 
					else if(e.kind === 'beginRectSelect'&&window.vuef.ctrlKey){//开始绘制区域事件
						window.vuef.beginPos = window.vuef.graphView.getLogicalPoint(e.event);
					}            
					else if(e.kind === 'endRectSelect'&&window.vuef.ctrlKey){//结束绘制区域事件
						window.vuef.removeNode(window.vuef.selectArea.id);
						var end = window.vuef.graphView.getLogicalPoint(e.event);	
						var w = parseInt(end.x-window.vuef.beginPos.x)//获取的宽度
						var h = parseInt(end.y-window.vuef.beginPos.y)//获取矩形的高度
						var centerx = parseInt((end.x-window.vuef.beginPos.x)/2)+parseInt(window.vuef.beginPos.x)
						var centery = parseInt((end.y-window.vuef.beginPos.y)/2)+parseInt(window.vuef.beginPos.y)//中心点
						window.vuef.selectArea.n_point = w;
						window.vuef.selectArea.e_point = h;
						window.vuef.selectArea.lineString = centerx+','+centery;
						window.vuef.$emit('drawOver',window.vuef.selectArea);			        
						window.vuef.addLine(window.vuef.selectArea)	;	        
						window.vuef.ctrlKey = false;
					}	    
				})
				graphView.setVisibleFunc(function(data) {//设置可见过滤器
					var vis = data.getAttr('vis');
					if (vis && vis == 'hide') {
						return false
					}
					return true
				})
			// 	graphView.mp(function(e) {
			//   	console.log(e,'视图平移 界面缩放 都会触发')
	        // 	    //back.setP(graphView.getWidth(), graphView.getWidth() * back_height / back_width);
	        //      back.setSize(1960, 1080);
			// })
			return graphView;
		},
		//设置数据模型
		setDataModel(list,back){
			var dataModel = new ht.DataModel(); 
				this.nodifyData(list,dataModel);//这个必须比创建图层组件要先执行，有了数据图层才能找到对应的设备绑定控制显示隐藏	
				dataModel.add(back);
				dataModel.enableAnimation(400);//设置动画闪烁频率  
				// dataModel.sm().ms(function(e) {	  
				// 	console.log(e,'选中和选中清除时触发');  //图上node被 选中和选中清除时触发	
				// });
				return dataModel;
		},
		//初始化地图
        init(list){  
			ht.Default.setImage('back', { //底图
					width: 1960,
					height:1080,
					comps: [{type: 'image',name: this.changeMap(),relative: true}]
			});   
			var back = new ht.Node();
				back.setLayer(0);
				back.setImage('back');
				back.setSize(1960, 1080);
				back.setPosition(0, 0);
				back.s({
					'2d.movable': false,
					'2d.selectable': false,
					'2d.editable': false
				});	
				this.dataModel = this.setDataModel(list,back); //数据模型	加载数据和底图
				this.graphView = this.setGraphView(this.dataModel,back); //设置拓扑组件视图 平移中心点
				this.ruler = this.setRuler(this.graphView);	//设置标尺组件
				this.overviewPanel = this.initOverviewPanel(this.graphView);  //设置鹰眼面板组件	
				this.treePanel = this.setTreePanel(this.dataModel,this.makeTreeModel(this.dataModel)); //设置图层面板组件	
				this.listPanel = this.setListViewPanel(); //设置操作面板组件		
	        var panelGroup = new ht.widget.PanelGroup({hGap: 0,vGap: 20}); //作用与管理panel面板的对象
				panelGroup.setRightBottomPanels(this.overviewPanel, "v");
				panelGroup.setRightTopPanels(this.treePanel, "v");
			this.selectionModel = this.dataModel.getSelectionModel();//获取拖动传感器的位置等信息 按下去那一下的位置
			this.selectionModel.addSelectionChangeListener(function(e){
				if(e.kind=='set'){               	      
					window.vuef.dataModel.addDataPropertyChangeListener(function(e){ 
						if(e.property=='position'){
							var data = window.vuef.state.AllhashSensor[e.data._tag];
							if(data){
								if(window.vuef.$route.name == 'Dsystem'){
									data.x3_point = parseInt(e.newValue.x);
									data.y3_point = parseInt(e.newValue.y);
								}else if(window.vuef.$route.name =='watching-index/wind'){
									data.x2_point = parseInt(e.newValue.x);
									data.y2_point = parseInt(e.newValue.y);
								}else{
									data.x_point = parseInt(e.newValue.x);
									data.y_point = parseInt(e.newValue.y);
								}
								window.vuef.moveData = data;
							}
						}
					})
				}
			}); 
			//将各个组件添加到dom中去
			var topoPage = document.getElementById('topoPage');
				topoPage.appendChild(this.ruler.getView()); //标尺组件
				topoPage.appendChild(this.overviewPanel.getView());//鹰眼面板组件
				if(this.$route.name!='detailTable'){ //只要不是活动轨迹都把  操作面板列表组件添加进去
					topoPage.appendChild(this.listPanel.getView());
				}
				if(this.$route.name=='home_index'){	 //图层面板组件的隐藏和展示  在各系统预览界面添加
					topoPage.appendChild(this.treePanel.getView());	  
				}
				if(this.$route.name == 'watching-index/wind'){
					this.getFlow(); //获取传感器对应的流动巷道
				}
			//每俩秒更新一次底图的状态	
			clearInterval(this.updateTimer);
			this.updateTimer = null;
			this.update();
			this.updateTimer = setInterval(() => {
				this.update();
			},2000)	       
		}, 
        //绘制区域
        drawArea(data){
        	this.selectArea = data
        	this.ctrlKey = true
        },
        //区域信息查看
        checkArea(data){
    	  window.vuef.$emit('checkArea',data)
        },
        //删除风向巷道
        deleteLine(data){
        	var id = '';
        	_.findIndex(this.FlowList, ob => {
				if(ob.uid==data.uid){
					id = ob.id
					api.setting.delArrow(id).then((res)=>{
						if(res.data.status==0){
							this.$message.success('操作成功!')
							this.getFlow()
							this.removeNode(data.uid)
						}
					})
				}
        	})            	
        },
        drawLine(data){
        	//允许画线条的交互功能
        	window.vuef.pointData = []
        	var CreateShapeInteractor = function (graphView) {
			    CreateShapeInteractor.superClass.constructor.call(this, graphView);                
			    this._points = new ht.List();
			};
			ht.Default.def(CreateShapeInteractor, ht.graph.Interactor, {
			    setUp: function () {
			        CreateShapeInteractor.superClass.setUp.call(this); 
			        this._graphView.addTopPainter(this);
			        this._onBackgroundDoubleClicked = this._graphView.onBackgroundDoubleClicked;
			        this._graphView.onBackgroundDoubleClicked = function(){};
			    },
			    tearDown: function () {
			        CreateShapeInteractor.superClass.tearDown.call(this);
			        this._graphView.removeTopPainter(this);
			        this._graphView.onBackgroundDoubleClicked = this._onBackgroundDoubleClicked;
			    },    
			    handle_mousedown: function (e) {
			        this.handle_touchstart(e);
			    },
			    handle_touchstart: function (e) {
			        this.isLeftClick = ht.Default.isLeftButton(e) && ht.Default.getTouchCount(e) === 1;                 
			    },    
			    handle_mouseup: function (e) {
			        this.handle_touchend(e);
			    },
			    handle_touchend: function (e) {
			        var graphView = this._graphView;
			        if(!graphView._panning && !graphView._pinching && this.isLeftClick){
			            this.redraw();
			            if(ht.Default.isDoubleClick(e)){
			            	//console.log(e) 双击以后执行的事件
			            	window.vuef.drawover(data)
			                if(this._points.size() > 1){
			                    var shape = new ht.Shape();
			                    shape.setPoints(this._points);
			                    shape.setParent(graphView.getCurrentSubGraph());
			                    //graphView.getDataModel().add(shape);    
			                    graphView.getSelectionModel().setSelection(shape);
			                    this._points = new ht.List();
			                }else{
			                    this._points.clear();
			                } 
			                this._movePoint = null;
			            }else{
			                this._points.add(this._graphView.getLogicalPoint(e));
			            }  
			            this.redraw();
			            delete this.isLeftClick;
			        }
			    },          
			    handle_mousemove: function (e) {
			        if(this._points.size() > 0){
			            this.redraw();
			            this.autoScroll(e);        
			            this._movePoint = this._graphView.getLogicalPoint(e);
			            this.redraw();            
			        }
			    },                      
			    redraw: function(){        
			        var points = this._points;
			        if(points.size() > 0){
			            if(this._movePoint){
			                points = new ht.List(points);
			                points.add(this._movePoint);
			            }
			            var rect = ht.Default.unionPoint(points);
			            if(rect){
			                ht.Default.grow(rect, 5);
			                this._graphView.redraw(rect);
			            }              
			        }                 
			    },
			    //画线条的颜色和宽度
			    draw: function (g) {   
			        var size = this._points.size();
			        if(size > 0){
			            var point = this._points.get(0);
			            g.lineWidth = 5;
			            g.strokeStyle = '#1ABC9C';
			            g.beginPath();
			            g.moveTo(point.x, point.y);
			            
			            for(var i=1; i<size; i++){
			                point = this._points.get(i);
			                g.lineTo(point.x, point.y);
			            }
			            if(this._movePoint){
			                g.lineTo(this._movePoint.x, this._movePoint.y);
			            }
			            g.stroke();  
			            
			            for(i=0; i<size; i++){
			                point = this._points.get(i);
			                g.fillStyle = 'white';
			                g.strokeStyle = '#34495E';
			                g.lineWidth = 5;
			                g.beginPath();
			                g.arc(point.x, point.y, 4, 0, Math.PI * 2, true);
			                g.fill();
			                g.stroke();                 
			            }            
			        }                               
			    }               
			});
        	this.drawLines = true;
        	this.graphView.setInteractors([
                    new ht.graph.DefaultInteractor(this.graphView),
                    new ht.graph.TouchInteractor(this.graphView, {
                        selectable: false
                    }),
                    new CreateShapeInteractor(this.graphView)
            ]);
        },
        //轨迹列表
        replay(data,point){
        	//先确定起始点、终点  然后将其中的坐标点连接起来 结构为[{x:12,y:5},{x:12,y:5}...]
			//console.log(this.state.frequency)
			if(!data.length || data.length == 1){
				return
			}
        	var node1 = new ht.Node(),
                node2 = new ht.Node();
                this.edge = new ht.Edge(node1, node2);
                node1.setPosition(data[0].x_point, data[0].y_point);     
                node2.setPosition(data[data.length-1].x_point, data[data.length-1].y_point);
                this.edge.s("edge.type", "points");
                this.edge.s("edge.points", new ht.List(point));
                this.edge.s("flow", true);
                this.edge.s("flow.step", this.state.frequency);
                this.edge.s("flow.element.max", 25); //人物的大小 数字越大就越大
                this.edge.s("flow.element.count", 1); //人物的个数
                this.edge.s({'edge.width':5}); //线条的宽度
                this.edge.s("flow.element.image", "./static/svg/people.svg");
                this.edge.s("flow.element.shadow.visible", false);
                this.edge.s("flow.element.autorotate", true);  //是否自动循环
                this.edge.setLayer(1) //添加到底图
                this.dataModel.add(this.edge); //添加到底图
                this.graphView.enableFlow(); //允许流动
        },
        //画完流动图 提交给后端
        drawover(data){
        	var controlForm = {}
	        	if(window.vuef.FlowList.length){
		        	_.findIndex(window.vuef.FlowList, function(ob) {
		        		if(data.uid==ob.uid){
		        			controlForm.id = ob.id
		        			window.vuef.removeNode(ob.uid)
		        		}//判定传感器是否已有相应的流动图 如果是 先添加  为了用户体验 先直接添加到底图  不在重构底图
		        	})
	        	}
	        	controlForm.uid = data.uid
	        	controlForm.type = 2
	        	controlForm.list = window.vuef.pointData
	        	api.setting.addArrow(controlForm).then((res)=>{
	                	if(res.data.status==0){
	                		window.vuef.getFlow();
	                	}
	           })
        },
        //获取传感器对应的流动巷道
        getFlow(){
			api.setting.getArrow({type:2}).then((res)=>{
				if(res.data.status==0){
					this.FlowList = res.data.data
					_.forEach(this.FlowList, (m,index) => {                			
						this.updateView(m.list,m.uid)
					})                		
				}
            })
        },
        //巷道流动图 
        updateView(list,uid){
        	var busLane = new ht.Shape();        	
                busLane.setPoints(list);
                busLane.s("shape.dash", true);
                busLane.s("shape.dash.flow", false);//流动的状图true或者false
                //busLane.s("shape.dash.flow.reverse", true);
                busLane.s("shape.dash.color", "#f1da88");
                busLane.setStyle("shape.border.width", 12);
                busLane.s("shape.background", null);
                busLane.s("shape.border.color", "blue");
                busLane.s("shape.border.width", 12);
                busLane.setLayer(1);
                busLane.setTag(uid)
                window.vuef.dataModel.add(busLane);
                window.vuef.graphView.enableDashFlow();//允许流动
        },   
		//构建传感器的坐标及相关设备信息 新添加设备 需要新坐标和设备类型
        Mapclick(point,data){				
			this.newNode = {editType:1,ob: data,point,};
			this.$emit('edit', this.newNode);
		},
		//设备信息与配置  无需坐标
        checkInfo(data){       	
	        this.$emit('edit', {ob:data,editType:3});
		}, 
	    //实时显示
	    showReal(data){
	    	if (data.sensor_type==69) {
				window.vuef.$router.push({
					name: 'gastime',
					params: {
						aname: data.uid,
					}
				})
			} else if (data.pid == window.vuef.state['sensorConfig']['analog'] && data.sensor_type!=69) {
				window.vuef.$router.push({
					name: 'analogCurve',
					params: {
						aname: data.uid,
					},
					query:{type:'call'}
				})
			} else if (data.pid == window.vuef.state['sensorConfig']['switch']) {
				window.vuef.$router.push({
					name: 'watching-index/switch-data',
					params: {
						aname: data.uid,
					}
				})
			} else if (data.typeid==window.vuef.state['sensorConfig']['cardReader']) {
				window.vuef.$emit('showReal', data.cid, data.substation_id)
			}
			else {
				window.vuef.$emit('check', data)
			}
		},
	    //调用列表
	    showList(data){
	    	if(data.pid == window.vuef.state['sensorConfig']['analog']) {
	    		window.vuef.$router.push({
					name: 'sensorcall',
					query: {
						id: data.id,
						type:1
					}
				})
	    	}else{
	    		window.vuef.$router.push({
					name: 'sensorcall',
					query: {
						id: data.id,
						type:2
					}
				})
	    	}
	    },
	    //调用报表
	    showTable(data){
	    	if(data.pid == window.vuef.state['sensorConfig']['analog']) {
	    		window.vuef.$router.push({
					path: '/mcall/analogcallp',
					query:{
						id:data.sensorId,
						ob:data,
						type:1
					}
				})
	    	}else{
	    		window.vuef.$router.push({
					path: '/mcall/switchcallp',
					query:{
						id:data.sensorId,
						ob:data,
						type:2
					}
				})
	    	}
		},	  
		//人员定位区域   环境监测区域直接从hash表里面取
        getRouteArea(){
           var vm = this
		   api.routeLine.getAllarea().then(function(res) {
	            if (res.data.status === 0) {
	               console.log(res.data.data,'人员定位区域');
				   vm.RouteList = res.data.data;   
				   vm.getOwnList();         
	            }
	        })
		},
		//根据hash表构建不同系统的底图设备 然后初始化到地图
        getOwnList(){
			let areaList = [];
			this.maxPageList = {list1:[],list2:[],list3:[],list4:[],list5:[]};
			for(let k in this.state.AllhashSensor){
				let item = this.state.AllhashSensor[k]; 
				if(item.type==900){//区域
					areaList.push(item);
				}else if(item.pid == this.state['sensorConfig']['analog']){//模拟量
					this.maxPageList.list1.push(item);
				}else if(item.pid == this.state['sensorConfig']['switch']){//开关量
					this.maxPageList.list2.push(item);
				}else if(item.typeid == this.state['sensorConfig']['cardReader']){//人员定位
					this.maxPageList.list3.push(item);
				}else if(item.pid == this.state['sensorConfig']['voice']){//语音广播
					this.maxPageList.list4.push(item);
				}else if(item.type==16||item.type==72){//分站、电源箱
					this.maxPageList.list5.push(item);
				}	
			}
			let list = [];
			if(this.$route.name == 'Dsystem' || this.$route.name=='watching-index/wind'){  //抽放界面(显示、编辑)、通风系统(显示、编辑)
				list = [...this.maxPageList.list1,...this.maxPageList.list2,...this.maxPageList.list5];
			}
			else if(this.$route.name=='Wsub'){ //设备编辑界面			    			    
				if(this.$route.query.type=='route-edit'){//人员定位(编辑)
					list = [...this.maxPageList.list3,...this.maxPageList.list5,...this.RouteList];
				}else if(this.$route.query.type=='watching-edit'){//环境监测(编辑)
					list = [...this.maxPageList.list1,...this.maxPageList.list2,...this.maxPageList.list5,...areaList];
				}
    		}else if(this.$route.name=='detailTable'){//活动轨迹界面(显示)
    			 list = [...this.maxPageList.list3];
    		}else if(this.$route.name=='Vsystem'){//视频监控界面(显示)
    			 list = [];
    		}else{ //设备显示界面	
    		    list = [...this.maxPageList.list1,...this.maxPageList.list2,...this.maxPageList.list3,...this.maxPageList.list4,...this.maxPageList.list5];
    			if(this.$route.query.type=='watching-scan' || this.$route.query.type=='scan' ){
    				list  = list.concat(areaList);
    			}else if(this.$route.query.type=='route-scan'){
    				list  = list.concat(this.RouteList);
    			}    	
			}
			this.init(list);
		},
		//初始化加载
		load(){
			//获取gd传感器的累积量 累积量每分钟更新一次
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.action.getTotal();  
			this.intervalId = setInterval(() => {
				this.action.getTotal();
			},1000*60)
			//底图分为俩层  图片为Layer0,其他传感器、流动图、轨迹列表均为Layer1
			//获取人员定位区域和基本设备 电源箱和网络设备这个直接从哈希表里面找
			this.getRouteArea();
			window.vuef = this;
		},
		//页面切换的时候 重构底图 鹰眼 table 图层
    	fetchData(){
			clearInterval(this.intervalId);
			clearInterval(this.updateTimer);
			try{
				new ht.DataModel().disableAnimation();
				this.ruler.dispose();
				this.ruler = null;
				this.graphView = null;	
				this.splitView = null;
				var topoPage = document.getElementById('topoPage');
				if(this.listPanel && this.listPanel.getView()){
					topoPage.removeChild(this.listPanel.getView());
				}	        
				topoPage.removeChild(this.overviewPanel.getView());
				if(this.treePanel && this.treePanel.getView()){
					topoPage.removeChild(this.treePanel.getView());
				}
				this.dataModel.clear();
				this.getRouteArea();
			}catch(err){
				console.log(err)
				this.splitView = null;
				this.dataModel = null;
				this.graphView = null;
				this.ruler = null;
				this.treePanel = null;
				this.listPanel = null;
				this.overviewPanel = null;
				this.load();
			}
    	},
    },
    beforeCreate() {				
		this.$store.dispatch("getCenter");//获取底图图片
	},	
	created(){},
	mounted(){
		this.load();
		this.setHtImage();
	},
	//组件销毁
	beforeDestroy(){
		window.removeEventListener('resize',this.resizeChange);
		clearInterval(this.updateTimer);
		this.updateTimer = null;
		clearInterval(this.intervalId);	
		this.intervalId = null;
		this.ruler = null;
		this.graphView = null;
		this.splitView = null;
		this.listPanel = null;
		this.overviewPanel = null;
		this.treePanel = null;    
		this.dataModel && this.dataModel.disableAnimation && this.dataModel.disableAnimation();	
		window.vuef = null;	
	}
};
</script>