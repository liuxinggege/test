<style type="text/css">
.mainTopo {
    margin: 0px;
    padding: 0px;
    /*position: absolute !important;*/
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
}
#topoPage{
	background-color:#B2EFF8;
	/* background-color:white; */
	/*height: 900px;*/
}
.ht-widget-panel{
 right:30px !important;
}
.locate{
    position: absolute;
    top:400px;
    left: 50px;
    z-index: 2000;
}
 .wrapper{
    border:1px solid #333;
    background:#eee;
    font-size:13px;
    width:10em;
    position: absolute;
}
.infowindow{
	overflow: auto;
}
.turnCss{
	margin-right: 13px;
}
</style>
<template>	
    <div id="topoPage">
    </div>    
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
		   dragList:Array,
		   undragList:Array,
	},
    data () {
    	return {
    		formItem:{},
    		svgUrl2:'./static/svg/',
    		ctrlKey:false,
    		table1: {
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
            },
            intervalId:'',
            IntervalId1:'',
    		state:store.state,
    		dataModel:'',
    		graphView:'',
    		routeName:'',
    		typeName:'',
    		action:store.actions,   
    		columnsList:[{
                key:'path2',
                title:'拖动传感器到底图'
            }],
            target:{},
            dragData:[],
            sensorList:[],
            panel2:'',
            PanelConfig:'',
            drawLines:false,
            menuList:[],
            selectionModel:'',
            selectedFeature:'',
            pointData:[],
            FlowList:[],
            cancelClean:false,            
            selectArea:'',
            beginPos:'',
            ruler:'',
            flow:{},
            newNode:[],
            EquipList:[],
            RouteList:[],
            edge:'',
            overviewPanel:'',
            moveData:{}
    	}
    },
    watch: {
		'$route':'fetchData',       
		 'state.frequency': {
				handler: function(val) {
					window.vuef.edge.s("flow.step", val);
				},
				deep: true
		 },
         'dragList': {
				handler: function(val, oldVal) {
					console.log(val)
					this.dragData = []
					if(val.length){
						this.dragData = val
					}
				},
				deep: false
		  },
		  'undragList':{
		  	handler: function(val, oldVal) {
		  		//console.log(val)
		    },
		    deep: false
		  }		
    },
    methods: {
       measure(){
       	
       },
       transfer(){
       	
       },
       addLine(data){
       	    console.log(data)      	   
       	    var node = new ht.Node();
		    var str = data.lineString.split(',')
		    var x = parseInt(str[0]),y = parseInt(str[1]);
			    node.setSize(data.n_point, data.e_point);
				node.setPosition(x,y);
				node.setLayer(1);
				node.setName('区域:'+data.areaname);
				node.setParent('');
				node.s({
				 'label.color': 'red',
			    });
				node.setTag(data.id)
				node.setStyle('shape','roundRect');
				node.setStyle('shape.background', null);
				node.setStyle('shape.border.width', 2);
				node.setStyle('shape.border.pattern', [5, 5]);
				node.s({
					'2d.movable': false,
					 'shape.border.color':'blue'
				});
				this.dataModel.add(node)
       },
       addNode(k){
       	  console.log(window.vuef.newNode)
       	  var rdata = window.vuef.newNode
       	  var node = new ht.Node();
			  node.setLayer(1);
			  node.s({
				'label.color': 'red',
			  });				        
			  node.setWidth(36);
			  node.setHeight(36);
			  node.setPosition(rdata.point.x,rdata.point.y)
			  node.setName(rdata.newone[0].v)
			  node.setTag(k)
			  node.setImage(window.vuef.svgUrl2+(rdata.newone[0].path2?rdata.newone[0].path2:rdata.newone[0].path))
			  this.dataModel.add(node)
       },
       removeNode(k){
       	  console.log(k)
	      window.vuef.dataModel.removeDataByTag(k)
       },
       clean(){
       	  console.log('clean')
       	  this.cancelClean = true
       	  this.selectionModel.clearSelection()        
       },
       reload(){
    	    this.action.getOwnList()
    	    this.fetchData()
    	},
    	fetchData(){
    		this.ruler.dispose()
    		this.ruler = ''
    		this.graphView = ''
	        clearInterval(this.IntervalId1)
	        clearInterval(this.intervalId)
	        topoPage.removeChild(this.overviewPanel.getView());
	        topoPage.removeChild(this.mainPanel.getView());
    		this.dataModel.clear()
    		this.getRouteArea()
    	},
    	changeMap(){
			console.log(11,this.$route.query.type)
			this.routeName = this.$route.query.type
			this.typeName =  this.$route.name
			if(this.$route.name=='watching-index/wind'){
				return  this.$store.state.url3
			}else if(this.$route.name=='Dsystem'){
				return this.$store.state.url2
			}else{
				return this.$store.state.url1
			}						
		},
	    handleOnstart1(from) {
            this.table1.oldIndex = from;
            this.table1.hasDragged = true;
            this.table1.isDragging = true;
        },
        handleOnend1(e) {
          	window.vuef.target.data = []
            this.table1.isDragging = false
            this.table1.draggingRecord.unshift({
                    from: e.from + 1,
                    to: e.to + 1
            });
            window.vuef.target.data = e.value[e.from]
            window.vuef.$emit('edit',window.vuef.target.data)
        },
        update(){
        	//console.log('update')
        	var dm = window.vuef.graphView.dm();        	
	        	dm.each(function(data) {
	        		//区域更新
	        		if(window.vuef.state.AllhashSensor[data._tag]&&window.vuef.state.AllhashSensor[data._tag].type==900){
	        			var rdata = window.vuef.state.AllhashSensor[data._tag]
	        			if(!window.vuef.state.AllhashSensor[data._tag].lineString){
		        			data.s({
							    'label.color': rdata.showColor,							    
							});
						}else{
							//data.setName(rdata.statusText?rdata.statusText:'')
							data.s({
							    'shape.border.color':rdata.showColor?rdata.showColor:'blue'
							});
						}	
	        		}
	        		//传感器、分站、电源更新
	        		else if(window.vuef.state.AllhashSensor[data._tag]){
		        			var rdata = window.vuef.state.AllhashSensor[data._tag]
		        			data.s({
							    'label.color': rdata.showColor,
							});
							if(rdata.type!=72){
		        			    data.setName(rdata.now_value+(rdata.statusText?rdata.statusText:''))
		        		    }else{
		        		    	//电源更新
		        		    	data.setName(rdata.currentText+'('+rdata.percent+')')
		        		    }
		        			var status = rdata.now_status
		        			//正常状态
		        			if(status==0||status==6||status==7){
					            data.setImage(window.vuef.svgUrl2+ rdata.path)
					        }else{
					            data.setImage(window.vuef.svgUrl2 + rdata.path2)
					        }				        
					        if(rdata.pid==window.vuef.state['sensorConfig']['analog']||rdata.pid==window.vuef.state['sensorConfig']['switch']){
					        	//不同系统不同坐标
						        if(window.vuef.$route.name=='Dsystem'){
						        	data.setPosition({x:rdata.x3_point,y:rdata.y3_point})
						        }else if(window.vuef.$route.name=='watching-index/wind'){					        	
						        	data.setPosition({x:rdata.x2_point,y:rdata.y2_point})
						        }else{
						        	data.setPosition({x:rdata.x_point,y:rdata.y_point})
						        }
						    }else{
						        data.setPosition({x:rdata.x_point,y:rdata.y_point})
						 }						    
				    }else if(!window.vuef.state.AllhashSensor[data._tag]&&window.vuef.FlowList.length){
				    	//刷选出巷道的传感器
				    	// console.log(window.vuef.FlowList,data)
				    	_.findIndex(window.vuef.FlowList, function(ob) {
						    	if(ob.uid==data._tag){
						    		var sdata = window.vuef.state.AllhashSensor[ob.k]
									//console.log(sdata)
									if(undefined == sdata){
										data.s("shape.dash.flow", false);
									}else{
										var str = sdata.now_value.split('(')
										//console.log(str,sdata.now_status)
										if(str[0]!='停'&&sdata.now_status!=5){
											data.s("shape.dash.flow", true);
										}else{
											data.s("shape.dash.flow", false);
										}
									}
						    		
						    	}
						})
				    }
	        	})
	        	window.vuef.sensorList = dm
        },
        showDailog(e,rdata){	        	
	        	var topoPage = document.getElementById('topoPage')	
	        	var x_point,y_point;
	        	if(rdata.pid==window.vuef.state['sensorConfig']['analog']||rdata.pid==window.vuef.state['sensorConfig']['switch']){
		        	if(window.vuef.$route.name=='watching-index/wind'){
						x_point = rdata.x2_point
						y_point = rdata.y2_point
					}else if(window.vuef.$route.name=='Dsystem'){
						x_point = rdata.x3_point
						y_point = rdata.y3_point
					}else{
						x_point = rdata.x_point
						y_point = rdata.y_point
					}
				}else{
					x_point = rdata.x_point
					y_point = rdata.y_point
				}
				var str = ''
				if(rdata.type==900&&rdata.emphasis==3){
					var html = '<div class="infowindow"><p>区域名称：'+rdata.areaname+'</p><p>状态：'+rdata.statusText+'</p>'+
					'<p>区域类型：'+rdata.area_type_name+'</p><p>属性：'+(rdata.emphasis ==1?'非重点区域':(rdata.emphasis ==2?'重点区域':''))+'</p>'
				}else if(rdata.emphasis&&rdata.emphasis!=3){
					//console.log(rdata)
					var html = '<div class="infowindow"><p>区域名称：'+rdata.areaname+'</p>'+
					'<p>属性：'+(rdata.emphasis ==1?'非重点区域':(rdata.emphasis ==2?'重点区域':''))+'</p>'+
					'<p>最大允许人数(人)：'+rdata.max_allow+'</p><p>最大允许时长(分钟)：'+rdata.max_time+'</p>'+
					'<p>出入口：'+(rdata.is_exit==0?'否':'是')+'</p>'
				}
				else if(rdata.type==102||rdata.type==103){
					var html = '<div class="infowindow"><p>名称：'+rdata.sensorname+'('+rdata.name+')'+'</p>'+
	        		'<p>X坐标：'+x_point+'</p><p>Y坐标：'+y_point+'</p>'
				}
				else{
	        	  var html = '<div class="infowindow"><p>名称：'+(rdata.radioId?rdata.name:rdata.type)+'</p><p>状态：'+rdata.statusText+'</p>'+
	        		'<p>X坐标：'+x_point+'</p><p>Y坐标：'+y_point+'</p>'
	            }
	        	if(rdata.pid==window.vuef.state['sensorConfig']['analog']&&rdata.sensor_type!=69){
	        		str = '<p>上限报警：'+(rdata.limit_alarm==999999||rdata.limit_alarm==-999999?'':rdata.limit_alarm)+'</p><p>上限断电：'+(rdata.limit_power==999999||rdata.limit_power==-999999?'':rdata.limit_power)+
	        		'</p><p>上限复电：'+(rdata.limit_repower==999999||rdata.limit_repower==-999999?'':rdata.limit_repower)+'</p>'+
	        		'</p><p>下限报警：'+(rdata.floor_alarm==999999||rdata.floor_alarm==-999999?'':rdata.floor_alarm)+'</p>'+
	        		'</p><p>下限断电：'+(rdata.floor_power==999999||rdata.floor_power==-999999?'':rdata.floor_power)+'</p>'+
	        		'</p><p>下限复电：'+(rdata.floor_repower==999999||rdata.floor_repower==-999999?'':rdata.floor_repower)+'</p></div>'	        		
	        	}else if(rdata.sensor_type==69){
	        		str = '<p>一氧化碳(%)：'+rdata.co+'</p>'+'<p>温度(℃)：'+rdata.temperature+'</p>'+
	        		'<p>压力(KPa)：'+rdata.pressure+'</p>'+'<p>甲烷(%)：'+rdata.wasi+'</p>'+
	        		'<p>工况混合流量/总累积量(m³/分)：'+rdata.flow_work+'/'+(rdata.total_flow_work?rdata.total_flow_work.toFixed(2):0)+'</p>'+
	        		'<p>标况混合流量/总累计量(m³/分)：'+rdata.flow_standard+'/'+(rdata.total_flow_standard?rdata.total_flow_standard.toFixed(2):0)+'</p>'+
	        		'<p>标况纯流量/总累计量(m³/分)：'+rdata.flow_pure+'/'+(rdata.total_flow_pure?rdata.total_flow_pure.toFixed(2):0)+'</p>'
	        	}
	        	if(rdata.type==72){
	        		str = '<p>电量：'+rdata.currentText+'('+rdata.percent+')'+'</p>'
	        	}
	        	if((rdata.pid==window.vuef.state['sensorConfig']['analog']||rdata.pid==window.vuef.state['sensorConfig']['switch'])&&rdata.sensor_type!=69){
	        		
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置</a><a class="turnCss" onclick="window.vuef.showReal(window.vuef.selectedFeature)">实时曲线</a><a class="turnCss" onclick="window.vuef.showList(window.vuef.selectedFeature)">调用列表</a><a onclick="window.vuef.showTable(window.vuef.selectedFeature)">调用报表</a></p>'
	        	}else if(rdata.sensor_type==69){
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置</a><a class="turnCss" onclick="window.vuef.showReal(window.vuef.selectedFeature)">实时曲线</a></p>'
	        	}else if(rdata.typeid==window.vuef.state['sensorConfig']['cardReader']){
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置</a><a class="turnCss" onclick="window.vuef.showReal(window.vuef.selectedFeature)">列表显示</a></p>'
	        	}else if(rdata.emphasis&&window.vuef.$route.name=='Wsub'){
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkArea(window.vuef.selectedFeature)">设备配置</a><a class="turnCss" onclick="window.vuef.drawArea(window.vuef.selectedFeature)">绘制区域</a></p>'+
	        		     '<p style="color:red;font-size:8px">按住Ctrl键,鼠标拉框绘制区域</p>'
	        	} else if(rdata.type==900&&window.vuef.$route.name!='Wsub'){
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkArea(window.vuef.selectedFeature)">设备配置</a></p>'
	        	}else if((rdata.type==102||rdata.type==103)&&window.vuef.$route.name=='Wsub'){
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置</a><a class="turnCss" onclick="window.vuef.drawLine(window.vuef.selectedFeature)">绘制设备</a></p>'
	        	}
	        	else{
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.checkInfo(window.vuef.selectedFeature)">设备配置</a></p>'
	        	}
	        	if(rdata.sensor_type==51&&window.vuef.$route.name=='watching-index/wind'){
	        		str+='<p style="margin-top:5px"><a class="turnCss" onclick="window.vuef.drawLine(window.vuef.selectedFeature)">自定义风向巷道</a><a class="turnCss" onclick="window.vuef.deleteLine(window.vuef.selectedFeature)">删除风向巷道</a></p>'
	        	}	        	
	        	html+=str
	        	window.vuef.panel2 = new ht.widget.Panel({
	        		 id:'Panel2',
	                 title: rdata.alais?rdata.alais:(rdata.areaname?rdata.areaname:rdata.name),
	                 titleBackground:'#abb2b9',
	                 separatorColor:'#abb2b9',
	                 width: 290,
	                 borderWidth:2,
	                 narrowWhenCollapse: false,
	                 contentHeight: rdata.pid==window.vuef.state['sensorConfig']['analog']?220:130,
	                 content: html,
	                 buttons:[]
	           });	            
	            window.vuef.panel2.setPosition(e.offsetX+50, e.offsetY);	
	            topoPage.appendChild(window.vuef.panel2.getView());
	            window.vuef.PanelConfig = window.vuef.panel2.getPanelConfig('Panel2')	            
	    },
        selected(k){
        	var dm = window.vuef.graphView.dm();        	
	        	dm.each(function(data) {
        		if(window.vuef.state.AllhashSensor[data._tag]&&window.vuef.state.AllhashSensor[data._tag].uid==k){
        			var rdata = window.vuef.state.AllhashSensor[data._tag]
        			//window.vuef.showDailog(null,rdata)
        			window.vuef.selectionModel.setSelection(data)
        		}
        	})
        },
        init(list){       	
       	   var svgUrl = './static/img/';  
       	   var svgUrl2 = './static/svg/';
		
		    function makeTreeModel(name,type,dataModel) {
		        var group0 = dataModel.getDataByTag('group0');
		        var group1 = dataModel.getDataByTag('group1');
		        var group2 = dataModel.getDataByTag('group2');
		        var group3 = dataModel.getDataByTag('group3');
		
		        var troot = new ht.Group(),
		            tlay1 = new ht.Group(),
		            tlay2 = new ht.Group(),
		            tlay3 = new ht.Group();
		        var treeModel = new ht.DataModel();
		
		        troot.setName(group0.getName());
		        troot.setExpanded(true);
		        troot.setAttrObject(group0);
		        treeModel.add(troot);
		        if(group1){
			        tlay1.setName(group1.getName());
			        tlay1.setParent(troot);
			        tlay1.setAttrObject(group1);
			        if((name=='watching-scan'||name=='demo')||(type=='home_index'&&(name=='scan'||name=='edit'))){
			            treeModel.add(tlay1)
			        }else{
			        	treeModel.remove(tlay1);
			        }
		        }
		        if(group2){
			        tlay2.setName(group2.getName());
			        tlay2.setParent(troot);
			        tlay2.setAttrObject(group2);
			        if((name=='route-scan'||name=='demo')||(type=='home_index'&&name=='scan')){
			           treeModel.add(tlay2);
			        }else{
			       	   treeModel.remove(tlay2);
			        }
		        }
		        if(group3){
			        tlay3.setName(group3.getName());
			        tlay3.setParent(troot);
			        tlay3.setAttrObject(group3);
			        if((name=='voice-scan'||name=='demo')||(type=='home_index'&&name=='scan')){
			            treeModel.add(tlay3);
			        }else{
			        	treeModel.remove(tlay3);
			        }
		        }
		        var select = treeModel.getSelectionModel();
		        select.addSelectionChangeListener(function(event) {
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
		    }
		
			function nodifyData(name,type,dataModel) {	
				console.log(type,name)
				var group0 = new ht.Group(),
					group1 = new ht.Group(),
		       		group2 = new ht.Group(),
		       		group3 = new ht.Group();
			       	group0.setName("所有图层");
			       	group0.setTag("group0");
			       	group0.setExpanded(true);
			       	dataModel.add(group0);	
			       	//console.log(window.vuef.menuList)
			       	_.findIndex(window.vuef.menuList, function(ob) {			       		
			       		if(ob.label=='环境监测'){
			       			group1.setName("环境监测");
					        group1.setTag("group1");			        			        
					        if((name=='watching-scan'||name=='demo')||(type=='home_index'&&(name=='scan'||name=='edit'))){
					            group1.setExpanded(true);
					        }else{
					        	group1.setExpanded(false);
					        }
					        group1.setParent(group0);
					        dataModel.add(group1);
			       		}
			       		if(ob.label=='人员定位'){
			       			group2.setName("人员定位");
					        group2.setTag("group2");
					        if((name=='route-scan'||name=='demo')||(type=='home_index'&&name=='scan')){
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
					        if((name=='voice-scan'||name=='demo')||(type=='home_index'&&name=='scan')){
					            group3.setExpanded(true);
					        }else{
					        	group3.setExpanded(false);
					        }
					        group3.setParent(group0);
					        dataModel.add(group3);
			       		}
			       	})			       							        						        		
				    _.forEach(list, (m) => {
				    	//不是区域和GD5
				    	if(m.type!=900&&m.type!=102&&m.type!=103){
					        var node = new ht.Node();
					        node.setLayer(1);
					        node.s({
							    'label.color': m.showColor,
							});				        
					        node.setWidth(36);
					        node.setHeight(36);	
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
					          node.setPosition(m.x_point,m.y_point);	
					        }
				            node.setImage(svgUrl2+m.path);				        
					        node.setTag(m.k)
					        node.s("select.color", "red");
					        if(m.pid==window.vuef.state['sensorConfig']['switch']||m.pid==window.vuef.state['sensorConfig']['analog']){
					          if(type=='home_index'){
					          	node.setParent(group1);
					          }else{
					          	node.setParent('');
					          }					          
					        }else if(m.typeid==window.vuef.state['sensorConfig']['cardReader']){
					          if(name=='route-edit'||type=='detailTable'){
					          	node.setParent('');
					          }else{
					            node.setParent(group2);
					          }
					        }else if(m.radioId){
					        	node.setParent(group3);
					        }else{
					        	node.setParent(group0);
					        }
					        node.setName(m.now_value+m.statusText);					            					            
				        }
				    	else if(m.lineString&&m.type==900){
				    		//console.log(m)
				    		var node = new ht.Node();
				    		var str = m.lineString.split(',')
				    		var x = parseInt(str[0]),y = parseInt(str[1]);
					            node.setSize(m.n_point, m.e_point);
					            node.setPosition(x,y);
					            node.setLayer(1);
					            node.setName('区域:'+m.areaname);
					            node.setParent('');
					            node.setTag(m.id)
					            node.s({
							      'label.color': 'red',
							    });
					            node.setStyle('shape','roundRect');
					            node.setStyle('shape.background', null);
					            node.setStyle('shape.border.width', 2);
					            node.setStyle('shape.border.pattern', [5, 5]);
					            node.s({
					            	   '2d.movable': false,
					                   'shape.border.color':'blue'
					            });
				    	}else if(m.lineString&&(m.type==102||m.type==103)){
				    		
				    	}
				    	else {//区域
					        	//console.log(m)					        	
					        	var node = new ht.Node();
					        	    node.setLayer(1);						        	
						        	node.setTag(m.id)
						        	if(!m.lineString&&m.type==900){
						        		node.setImage(svgUrl+'test2.png');	
						        	}else{
				                   	    node.setWidth(36);
					                    node.setHeight(36);
						        		node.setImage(svgUrl2+m.path)
						        		node.setPosition(m.x_point,m.y_point);
						        		node.setName(m.name);		
						           }						        	
				        }
				    	if(m.type==16||m.type==72||m.typeid==window.vuef.state['sensorConfig']['cardReader']){
				    			//底图编辑
				    		if(type=='Wsub'){
					    			node.s({
								      '2d.movable': true,
								    })
					    	}else{
					    			node.s({
								      '2d.movable': false,
								    })
					    	}
				        }
				    	else if(name=='edit'){
				    		node.s({
								'2d.movable': true,
						    })
				    	}else{
				    		node.s({
							    '2d.movable': false,
							})
				    	}
				        dataModel.add(node);
				   })	    
			}
		
			function initOverviewPanel(graphView) {
				var overview = new ht.graph.Overview(graphView);
				var overviewPanel = new ht.widget.Panel({
		                    title: "鹰眼",
		                    restoreToolTip: "鹰眼",
		                    titleIcon: svgUrl+"eye.png",
		                    titleIconSize: 16,
		                    exclusive: true,
		                    width: 200,
		                    contentHeight: 100,
		                    narrowWhenCollapse: true,
		                    content: overview,
		                    expanded: window.localStorage.getItem('showOverview')==1?true:false,
		                    //buttons: ["minimize"]
		                });
		        overviewPanel.setPositionRelativeTo("rightBottom");
		        overviewPanel.setPosition(0, 0);
		        return overviewPanel;
			}
		
			function MainPanel(dataModel) {
				this.treeView = new ht.widget.TreeView(dataModel);
				this.treeView.setCheckMode('all');
				this.treeView.enableToolTip();
				this.treeView.setVisibleFunc(function(data) {
					if (data instanceof ht.Group) {
						return true;
					}
					return false;
				});
		
				this.mainPanel = new ht.widget.Panel({
		                title: "图层选项",
		                restoreToolTip: "图层选项",
		                exclusive: true,
		                titleIconSize: 16,
		                width: 200,
		                contentHeight: 100,
		                content: this.treeView,
		                narrowWhenCollapse: false,
		                expanded: true,
		                buttons: ["minimize"]
		            });
				this.mainPanel.setPositionRelativeTo("leftTop");
		        this.mainPanel.setPosition(0, 0);
		
		        this.init = function(dataModel) {
		            this.treeView.setDataModel(dataModel);
		        	var rootNode = dataModel.getRoots().get(0);
			        this.treeView.expand(rootNode);
			        this.treeView.checkData(rootNode);
		        };
			}
	        var back_width = 800;
	    	var back_height = 800;
	        ht.Default.setImage('back', {
	        	width: back_width,
	        	height: back_height,
	        	comps: [  
			    	{
			    	    type: 'image',
			    	    name: this.changeMap(),
			    	    relative: true
			    	}
			    ]
	        });
	
	        this.dataModel = new ht.DataModel();
	        this.selectionModel = this.dataModel.getSelectionModel();
	        this.selectionModel.addSelectionChangeListener(function(e){
	           //console.log(e)
               if(e.kind=='set'){               	      
	               	window.vuef.dataModel.addDataPropertyChangeListener(function(e){ 
	            	//console.log(e)
	            	if(e.property=='position'){
	            		var data = {}
	            		data = window.vuef.state.AllhashSensor[e.data._tag]
	            		//console.log(data)
	            		if(data){
	            			if(window.vuef.$route.name == 'Dsystem'){
	            				data.x3_point = parseInt(e.newValue.x)
			            		data.y3_point = parseInt(e.newValue.y)
	            			}else if(window.vuef.$route.name =='watching-index/wind'){
	            				//console.log(e.newValue.x,e.newValue.y)
	            				data.x2_point = parseInt(e.newValue.x)
			            		data.y2_point = parseInt(e.newValue.y)
	            			}else{
			            		data.x_point = parseInt(e.newValue.x)
			            		data.y_point = parseInt(e.newValue.y)
		            		}
	            			window.vuef.moveData = data
	            	  }
	                }
	             })
               }
            });            
	        this.graphView = new ht.graph.GraphView(this.dataModel);
	            //console.log(graphView)	
	        if(this.graphView){
	          this.ruler = new ht.widget.RulerFrame(this.graphView);	
	        }
	        this.overviewPanel = initOverviewPanel(this.graphView);
	        //var createNodeInteractor = new CreateNodeInteractor(graphView);
	        var mainPanelObj = new MainPanel();
	        this.mainPanel = mainPanelObj.mainPanel;
	
	        var mainView = this.ruler.getView();
	        this.graphView.setLayers([0, 1]);
	        this.ruler.getDefaultRulerConfig().guideVisible = true;
			this.ruler.getDefaultRulerConfig().guideTipVisible = true;
			this.ruler.getDefaultRulerConfig().guideTipBackground = "rgb(0, 173, 239)";
			this.ruler.getDefaultRulerConfig().guideTipTextColor = "white";
	
			this.ruler.getLeftRulerConfig().background = "yellow";
			this.ruler.getLeftRulerConfig().tickSpacingAdaptable = false;
			this.ruler.getLeftRulerConfig().defaultMajorTickSpacing = 100;
			this.ruler.getLeftRulerConfig().guideTipVisible = true;
	
			this.ruler.getTopRulerConfig().guideTipVisible = true;
			this.ruler.getRightRulerConfig().visible = false;
			this.ruler.getBottomRulerConfig().visible = false;
	        this.ruler.addComponentPropertyChangeListener(function(e){
	        	console.log(e)
	        })
			this.ruler.iv();
	
	        var back = new ht.Node();
	        back.setLayer(0);
	        back.setImage('back');
		    back.setSize(2000, 1000);
		    //back.setPosition(0, 0);
		    back.s({
		    	'2d.movable': false,
		    	'2d.selectable': false,
		    	'2d.editable': false,
		    });
	        this.dataModel.add(back);
	
	        this.dataModel.sm().ms(function(event) {	        	
			});
	
	        this.graphView.mp(function() {
	        	//back.setP(graphView.getWidth(), graphView.getWidth() * back_height / back_width);
	            back.setSize(2000, 1000);
	        })
	        this.graphView.setVisibleFunc(function(data) {
	            var vis = data.getAttr('vis');
	            if (vis && vis == 'hide') {
	                return false
	            }
	            return true
	        })
	
	        this.graphView.fitData(back, false,20, false, false)
	        var view = this.ruler.getView(); 
	        view.addEventListener('click', function(e){	       	        	
	        	var point = window.vuef.graphView.getLogicalPoint(e)
	        	var x_point = parseInt(point.x)
	        	var y_point = parseInt(point.y)
	            //console.log(point)
	        	if(window.vuef.drawLines){	        		
	        		window.vuef.pointData.push({
	        			x:x_point,
	        			y:y_point
	        		})
	        	}
	        	//console.log(e)
	        	else{
		        	var point = {x:x_point,y:y_point}
		        	window.vuef.Mapclick(point)
	        	}
	        })
	        view.addEventListener('mousemove', function(e){	        	
	        	var node = window.vuef.graphView.getDataAt(e)
	        	var topoPage = document.getElementById('topoPage')
	        	if(window.vuef.panel2){
		        	topoPage.removeChild(window.vuef.panel2.getView());
		        	 window.vuef.panel2 = ''
		        }
	        	//console.log(e)
	        	if(node!=undefined){
			        //console.log(node);
			        if(node._tag&&window.vuef.state.AllhashSensor[node._tag]){
				        var rdata = {}
				        var rdata = window.vuef.state.AllhashSensor[node._tag]			        					         
				        window.vuef.showDailog(e,rdata)
				        window.vuef.selectedFeature = rdata
			        }else{
			        	_.findIndex(window.vuef.RouteList, function(ob) {
			        		if(ob.id==node._tag){
			        			window.vuef.showDailog(e,ob)
			        			window.vuef.selectedFeature = ob
			        		}
			        	})
			        }
	        	}else{
        			//console.log('clean')
        			if(window.vuef.panel2){
	        		   topoPage.removeChild(window.vuef.panel2.getView());
	        		   window.vuef.panel2 = ''
	        	    }
	        	}
	        })
	        this.graphView.addInteractorListener(function (e) {	        	
	        	if(e.kind === 'beginMove'){
			        window.vuef.cancelClean = false
			    }else if(e.kind === 'endMove'){		
			    	//console.log(window.vuef.moveData)
			    	window.vuef.$emit('edit',window.vuef.moveData)
			    } 
			    else if(e.kind === 'beginRectSelect'&&window.vuef.ctrlKey){
			       window.vuef.beginPos = window.vuef.graphView.getLogicalPoint(e.event)
			    }            
			    else if(e.kind === 'endRectSelect'&&window.vuef.ctrlKey){
			    	console.log(window.vuef.selectArea)
			    	window.vuef.removeNode(window.vuef.selectArea.id)
			        var end = window.vuef.graphView.getLogicalPoint(e.event)	
			        var w = parseInt(end.x-window.vuef.beginPos.x)
			        var h = parseInt(end.y-window.vuef.beginPos.y)
			        var centerx = parseInt((end.x-window.vuef.beginPos.x)/2)+parseInt(window.vuef.beginPos.x)
			        var centery = parseInt((end.y-window.vuef.beginPos.y)/2)+parseInt(window.vuef.beginPos.y)
			        window.vuef.selectArea.n_point = w
			        window.vuef.selectArea.e_point = h
			        window.vuef.selectArea.lineString = centerx+','+centery
			        window.vuef.$emit('drawOver',window.vuef.selectArea)			        
			        window.vuef.addLine(window.vuef.selectArea)		        
			        window.vuef.ctrlKey = false
			    }
			    
	        })
	        mainView.className = 'mainTopo';
	        var height = (document.body.clientHeight - 150)+'px'
	        	mainView.style.setProperty("height", height, null);
	        window.addEventListener('resize', function(e){
	        	var height = (document.body.clientHeight - 150)+'px'
		        	mainView.style.setProperty("height", height, null);
	        	if(window.vuef.graphView){
                  window.vuef.graphView.fitContent(true);
                }
           });
	        var topoPage = document.getElementById('topoPage')
            topoPage.appendChild(mainView); 
	        //document.body.appendChild(mainView);
	    	topoPage.appendChild(this.overviewPanel.getView());
	    	if(this.$route.name=='Dsystem'||this.$route.name=='Wsub'||this.$route.name=='watching-index/wind'||this.$route.query.type=='edit'||this.$route.name=='detailTable'||this.$route.name=='Vsystem'){	    	  
	    	}else{
	    		topoPage.appendChild(this.mainPanel.getView());
	    	}
	        window.addEventListener('resize', function (e) {
	        	if(window.vuef.ruler){
	              window.vuef.ruler.invalidate();
	            }
	        });
	
	        var panelGroup = new ht.widget.PanelGroup({
	        	hGap: 10,
			    vGap: 30
	        });
	        panelGroup.setRightBottomPanels(this.overviewPanel, "v");
	        panelGroup.setRightTopPanels(this.mainPanel, "v");
	        //console.log(this.routeName)
	        nodifyData(this.routeName,this.typeName,this.dataModel);
	        if(this.$route.name=='watching-index/wind'){
	           this.getFlow()
	        }
	        var treeModel = makeTreeModel(this.routeName,this.typeName,this.dataModel);	 
	        mainPanelObj.init(treeModel);
	        this.IntervalId1 = setInterval(function() {
	        	window.vuef.update()
	        },2000)	   	        
        }, 
        drawArea(data){
        	console.log(data)
        	this.selectArea = data
        	this.ctrlKey = true
        },
        checkArea(data){
    	  window.vuef.$emit('checkArea',data)
        },
        deleteLine(data){
        	var vm = this
        	var id = ''
        	    _.findIndex(vm.FlowList, function(ob) {
        	    	if(ob.uid==data.uid){
        	    		id = ob.id
        	    		api.setting.delArrow(id).then((res)=>{
		            		if(res.data.status==0){
		            			vm.$message.success('操作成功!')
		            			vm.getFlow()
		            			vm.removeNode(data.uid)
		            		}
		                })
        	    	}
        	    })            	
        },
        drawLine(data){
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
			            	//console.log(e)
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
        	this.drawLines = true
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
        	console.log(window.vuef.state.frequency)
        	var node1 = new ht.Node(),
                node2 = new ht.Node();
                window.vuef.edge = new ht.Edge(node1, node2);
                node1.setPosition(data[0].x_point, data[0].y_point);     
                node2.setPosition(data[data.length-1].x_point, data[data.length-1].y_point);
                window.vuef.edge.s("edge.type", "points");
                window.vuef.edge.s("edge.points", new ht.List(point));
                window.vuef.edge.s("flow", true);
                window.vuef.edge.s("flow.step", window.vuef.state.frequency);
                window.vuef.edge.s("flow.element.max", 25);
                window.vuef.edge.s("flow.element.count", 1);
                window.vuef.edge.s({'edge.width':5});
                window.vuef.edge.s("flow.element.image", "./static/svg/people.svg");
                window.vuef.edge.s("flow.element.shadow.visible", false);
                window.vuef.edge.s("flow.element.autorotate", true);
                window.vuef.edge.s({
					'2d.movable': false
				});
                window.vuef.edge.setLayer(1)
                window.vuef.dataModel.add(window.vuef.edge);
                window.vuef.graphView.enableFlow();
        },
        drawover(data){
        	var controlForm = {}
	        	if(window.vuef.FlowList.length){
		        	_.findIndex(window.vuef.FlowList, function(ob) {
		        		if(data.uid==ob.uid){
		        			controlForm.id = ob.id
		        			window.vuef.removeNode(ob.uid)
		        		}
		        	})
	        	}
	        	controlForm.uid = data.uid
	        	controlForm.type = 2
	        	controlForm.list = window.vuef.pointData
	        	api.setting.addArrow(controlForm).then((res)=>{
	                	//console.log(res)
	                	if(res.data.status==0){
	                		window.vuef.getFlow()
	                	}
	           })
        },
        getFlow(){
        	var vm = this
            	api.setting.getArrow({type:2}).then((res)=>{
                	if(res.data.status==0){
                		vm.FlowList = res.data.data
                		console.log(vm.FlowList)
                		_.forEach(vm.FlowList, (m,index) => {               			
                			vm.updateView(m.list,m.uid)
                		})                		
                		//vm.updateView(vm.FlowList)
                	}
            })
        },
        updateView(list,uid){
        	var busLane = new ht.Shape();        	
                busLane.setPoints(list);
                busLane.s("shape.dash", true);
                busLane.s("shape.dash.flow", false);
                //busLane.s("shape.dash.flow.reverse", true);
                busLane.s("shape.dash.color", "#f1da88");
                busLane.setStyle("shape.border.width", 12);
                busLane.s("shape.background", null);
                busLane.s("shape.border.color", "blue");
                busLane.s("shape.border.width", 12);
                busLane.s({
					'2d.movable': false
				});
                busLane.setLayer(1);
                busLane.setTag(uid)
                window.vuef.dataModel.add(busLane);
                window.vuef.graphView.enableDashFlow();
        },
        Mapclick(point){
        	if (window.vuef.dragData.length) {				
					var rdata = []
					rdata.push({
						point: point,
						newone: window.vuef.dragData
					})
					console.log(111)
					window.vuef.newNode = rdata[0]
					window.vuef.$emit('edit', rdata[0])
					window.vuef.dragData = []
		    }
        },
        //设备配置
        checkInfo(data){       	
        	var rdata = {}
        	rdata.ob = data
	        window.vuef.$emit('edit', rdata)
	    },
	    //实时显示
	    showReal(data){
	    	console.log(data)
	    	if (data.sensor_type==69) {
				window.vuef.$router.push({
					name: 'gastime',
					params: {
						aname: data.uid,
					}
				})
			} else if (data.pid == window.vuef.state['sensorConfig']['analog'] && data.sensor_type!=69) {
				//console.log(feature)
				window.vuef.$router.push({
					name: 'analogCurve',
					params: {
						aname: data.uid,
					},
					query:{type:'call'}
				})
			} else if (data.pid == window.vuef.state['sensorConfig']['switch']) {
				//console.log(feature)
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
        edit(data){
       	  this.$emit('edit',data)
        },
        getEquip(){
        	var vm = this
        	api.station.getEquip().then(function(res) {  
        		if(res.data.status==0){
					vm.EquipList = res.data.data.filter(item => (item.type==103||item.type==102))
					console.log(vm.EquipList)
					vm.getOwnList()
				}
			})       	
        },
        getRouteArea(){
           var vm = this
		   api.routeLine.getAllarea().then(function(res) {
	            if (res.data.status === 0) {
	               console.log(res)
	               vm.RouteList = res.data.data
	               vm.getEquip()
	            }
	        })
		},
        getOwnList(){
    	    var vm = this
    	    var list = _.values(vm.state.AllhashSensor)
    	    console.log(list)
    	    var windList = list.filter(item => (item.pid==this.state['sensorConfig']['analog']||item.pid==this.state['sensorConfig']['switch'])&&item.x2_point) //通风系统
    	    var DrainList = list.filter(item => (item.pid==this.state['sensorConfig']['analog']||item.pid==this.state['sensorConfig']['switch'])&&item.x3_point) //瓦斯抽放
    	    var maxPageList = {list1:[],list2:[],list5:[],list3:[],list4:[]}
    	    var areaList = list.filter(item => (item.type==900))//区域
    	    maxPageList.list1 = list.filter(item => item.pid==this.state['sensorConfig']['switch'])   //模拟量		
    		maxPageList.list2 = list.filter(item => item.pid==this.state['sensorConfig']['switch']) //开关量
    		maxPageList.list5 = list.filter(item => (item.type==16||item.type==72)) //分站、电源箱
    		maxPageList.list3 = list.filter(item => item.typeid == this.state['sensorConfig']['cardReader']) //人员定位
    		maxPageList.list4 = list.filter(item => item.radioId)  //语音广播		
    		if(vm.$route.name=='Dsystem'){    
    			var list = [...DrainList,...vm.EquipList,...maxPageList.list5]
    			this.init(list)	
    		}else if(vm.$route.name=='watching-index/wind'){
    			var list = [...windList,...vm.EquipList,...maxPageList.list5]
    			this.init(list)
    		}else if(vm.$route.name=='Wsub'){    			    			    
    			if(vm.$route.query.type=='route-edit'){
    				var list = [...maxPageList.list5,...vm.EquipList,...vm.RouteList,...maxPageList.list3]
    			}else{
    				var list = [...maxPageList.list5,...vm.EquipList,...areaList]
    				//var list = [...areaList]
    			}
    			//console.log(list)
    			this.init(list)
    		}else if(vm.$route.name=='detailTable'){
    			var list = [...maxPageList.list3]
    			this.init(list)
    		}else if(vm.$route.name=='Vsystem'){
    			var list = []
    			this.init(list)
    		}
    		else{
    			var list = [...maxPageList.list1,...maxPageList.list3,...maxPageList.list2,...maxPageList.list4,...maxPageList.list5,...vm.EquipList]
    			if(vm.$route.query.type=='watching-scan'){
    				list  = list.concat(areaList) 
    			}else if(vm.$route.query.type=='route-scan'){
    				list  = list.concat(vm.RouteList)
    			}   
    			console.log(list)
    			this.init(list)
    		}
    	}
    },
    beforeCreate() {				
		this.$store.dispatch("getCenter");
	},	
	destroyed (){
		this.ruler = ''
        this.graphView = ''
        clearInterval(this.IntervalId1)
        clearInterval(this.intervalId)	    
    },
    mounted () {                     
       this.getRouteArea()
       this.action.getTotal()   
       this.intervalId = setInterval(() => {
               this.action.getTotal()
       },1000*60)
       if(this.$route.query.type!='demo'){
	       var menuList = JSON.parse(window.localStorage.getItem('MenuDatas'))   
	       //console.log(this.state.menuList)
	       this.menuList = []
		      _.forEach(menuList, (ob) => {
		      	if(ob.pname!=='系统配置'&&ob.pname!=='视频监控')
		      	this.menuList.push({
		      		label:ob.pname
		       })
		    })
	    }else{
	    	this.menuList = [{label:'环境监测'},{label:'人员定位'},{label:'语音广播'}]
	    }
	   //console.log(this.menuList)
       //this.state.Kindex = window.localStorage.getItem('storeIndex')
       //document.title = this.state.menuList[this.state.Kindex].pname
       $('.button-minimize').click(function(){
			//console.log('close')
			window.localStorage.setItem('showOverview',0)
		})		
		$('.button-minimize-restore').click(function(){
			window.localStorage.setItem('showOverview',1)
		})
		window.vuef = this
    }
};
</script>