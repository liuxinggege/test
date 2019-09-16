<style>
	.graph_content{
		width: 100%;
		height: 100%;
	}
</style>
<template>
<div class="graph_content">
	<gis-map 
		ref="GisMap" :addDeviceList="TypeList"
		@showReal="showReal" 
		@edit="edit" 
		@checkArea="checkArea" 
		@clean="cleanInfo" 
		@drawOver="drawOver" 
		v-if="$store.state.center.length">
	</gis-map>
	<div v-show="addModal">
		<el-dialog :visible.sync="addModal" width="40%" :title="stationTitle" :append-to-body="true" :close-on-click-modal="false">
			<addup-station ref="addupStation"  @backup="backStation" @saveStation="saveStation" :addForm="addForm"></addup-station>
		</el-dialog>
	</div>
	<div v-show="controlModel">
		<el-dialog :visible.sync="controlModel" width="30%" :title="controlTitle" :append-to-body="true" :close-on-click-modal="false">
			<addup-equip ref="addupEquip" @backEquip="backEquip" @backup="cenceladd" :controlForm="controlForm"></addup-equip>
		</el-dialog>
	</div>
	<div v-if="editCard">
		<el-dialog :visible.sync="editCard" width="40%" title="新增/编辑读卡器" :append-to-body="true" :close-on-click-modal="false">
			<add-card :formItem="RowItem" @saveDate="saveDate" @backup="backup"></add-card>
		</el-dialog>
	</div>
	<div v-if="editAnalog">
		<el-dialog :visible.sync="editAnalog" width="40%" :title="editText" :append-to-body="true" :close-on-click-modal="false">
			<up-sensor :formItem="nowGas" :isanalog="isanalog" :isloding="isloding" @saveUpdate="save(nowGas,1)" @backup="backup"></up-sensor>
		</el-dialog>
	</div>
	<div v-if="editSwitchs">
		<el-dialog :visible.sync="editSwitchs" width="40%" :title="editText" :append-to-body="true" :close-on-click-modal="false">
			<add-switch :addSwitchForm="swit" @saveUpdate="save(swit,0)" :isloding="isloding" @backup="backup"></add-switch>
		</el-dialog>
	</div>
	<div v-if="addArea">
		<el-dialog :visible.sync="addArea" width="40%" title="编辑区域" :append-to-body="true" :close-on-click-modal="false">
			<add-area ref="areaaddup" @backup="backup" :formInline="areadata" @handleSubmit="sureArea"></add-area>
		</el-dialog>
	</div>
	<div v-if="addRouteArea">
		<el-dialog :visible.sync="addRouteArea" width="40%" title="编辑区域" :append-to-body="true" :close-on-click-modal="false">
			<route-area @backup="backup" :formInline="Routearea"></route-area>
		</el-dialog>
	</div>
	<div v-if="showNum">
		<el-dialog :visible.sync="showNum" width="950px" title="当前设备人员信息" :append-to-body="true" :close-on-click-modal="false">
			<watch-real ref="watchInfo" @check="check"></watch-real>
		</el-dialog>
	</div>
</div>
</template>

<script>
	import api from 'src/api'
	import store from 'src/store'
	import _ from 'lodash'
	import GisMap from "./topobar.vue"
	import addupEquip from '../../business_bar/addupEquip.vue'
	import addupStation from '../../business_bar/addupStation.vue'
	import upSensor from '../../business_bar/upSensor.vue'
	import addSwitch from '../../business_bar/addSwitch'
    import addArea from '../../business_bar/addArea.vue'
	import routeArea from '../../business_bar/addPersonArea.vue'
	import addCard from '../../business_bar/addCard.vue';
	import watchReal from '../person_real_list/nowpersonlist.vue';

	export default {
		components: {
			watchReal,
        	GisMap,
        	addupEquip,
        	addupStation,
        	addArea,
        	routeArea,
			addCard,
			upSensor,
			addSwitch
        },
		data() {
			return {
				changedata:{},
				areadata:{},
				changePos:false,
				addArea:false,
				controlModel:false,
				addRouteArea:false,
				editCard:false,
				editAnalog:false,
        		editSwitchs:false,
				TypeList:[
				  {v:'分站',path:'fenzhan.svg'},
				  {v:'电缆',path:'dianlan.svg'},
				  {v:'传输接口',path:'chuanshujiekou.svg'},
				  {v:'电源箱',path:'dianyuanxiang.svg'},
//				  {v:'交换机',path:'jiaohuanji.svg'},
				],
                state:store.state,
                action:store.actions,
                stationTitle:'',
				controlTitle:'',
				editText:'',
                addModal: false,
                AddnewOne:false,
                controlForm:{},//电源箱等系统设备
				addForm: {},//分站
				isanalog:false,
				nowGas:{},//模拟量
				swit:{},//开关量
				RowItem:{},//读卡器
				Routearea:{},//人员定位区域
				showNum:false
			}
		},
		watch: {
           '$route': 'fetchData',
	   },
	   computed: {
			stationList(){
				return this.$store.state.AllStation;
			}
		},
		methods: {
			showReal(id,sid){
					this.showNum = true
					console.log(this.$refs)
					setTimeout(() => {
						this.$refs.watchInfo.getData(id,sid)
					},15)
			},
			check(id){
            	if(id){
            		this.showNum = true
            	}else{
            	  this.showNum = false
	        	  this.$message.error('没有数据!')
	        	}
	  	    },
            fetchData(){
				this.$store.dispatch("getStation");
				let list = Object.values(this.state.typeList)
				if(this.$route.query.type=='route-edit'){//人员定位编辑
					this.TypeList = list.filter(item => (item.pid != this.state['sensorConfig']['analog'] &&
					item.pid != this.state['sensorConfig']['switch']
					&& item.id != this.state['sensorConfig']['voice'] && item.id != 101 && item.id != 102 && item.id != 103 && item.id != 104 && item.id != 900))
				}else if(this.$route.query.type=='watching-edit'){//环境监测编辑
					this.TypeList = list.filter(item => (item.id != this.state['sensorConfig']['cardReader'] && item.id != this.state['sensorConfig']['voice'] &&
					item.id != 101 && item.id != 102 && item.id != 103 && item.id != 104 && item.id != 900))
				}
				console.log(this.TypeList)
			},
			//模拟量 开关量
		    save(obj,isanalog) {
	    	    var me = this
	    	    var ip = ''
	    		_.findIndex(me.stationList, function(ob) {
	    			if(ob.id==obj.station){
	    				ip = ob.ipaddr
	    			}
	    		})
                if(isanalog){
                      api.gas.addGas(obj).then(function(res) {
                         if(res.data.status===0){
	                            if(me.AddnewOne){
									me.renderAddGis(ip+':'+obj.sensorId+':'+obj.sensor_type);
                                }
	                            me.action.generate()
	                            me.backup()
                        }else{
                            me.$message.error(res.data.msg)
                        }
                        me.isloding=false
                    })
                }else{
                    api.switchs.addSwitch(obj).then((res)=>{
                        if(res.data.status===0){
                                if(me.AddnewOne){
								   me.renderAddGis(ip+':'+obj.sensorId+':'+obj.sensor_type);
                                }
                                me.action.generate()
                                me.backup()
                        }else{
                            me.$message.error(res.data.msg)
                        }
                        me.isloding=false
                    })
                }
			},
			//取消
			backup(){
				this.editSwitchs = false
				this.editAnalog = false
				this.isanalog = false
				this.isloding=false
				this.AddnewOne = false
            	this.editCard = false
            	this.addArea = false
            	this.addRouteArea = false
            	this.$store.dispatch("getAllArea");
			},
			//读卡器保存
            saveDate(obj){
				this.editCard = false;
				let itemIp = this.stationList.find(ob => ob.id == obj.substation_id);
		    	if(this.AddnewOne && itemIp && obj.cid){
						this.renderAddGis(itemIp.ipaddr + ':' + obj.cid + this.state['sensorConfig']['cardReader']);
                }
		    	this.AddnewOne = false
			},
			//电源箱等 保存
            backEquip(obj){
                this.controlModel = false;
                let itemIp = this.stationList.find(ob => ob.id == obj.stationId);
                if(this.AddnewOne && itemIp && obj.devid){
					this.renderAddGis(itemIp.ipaddr+':'+obj.devid+':'+obj.type);
				}
				this.AddnewOne = false;
			},
			//电源等 取消
            cenceladd(){
                this.controlModel = false
                this.AddnewOne = false
                this.$refs.GisMap.clean()
             	this.$store.dispatch("getAllArea");
			},
			//分站 保存
            saveStation(k){
            	this.addModal = false
            	if(this.AddnewOne){
					this.renderAddGis(k);
                }
            	this.AddnewOne = false;
			},
			//分站 取消
			backStation(){
                this.addModal = false
                this.AddnewOne = false
			},
			renderAddGis(k){
				this.action.getOwnList();
				this.$refs.GisMap.addNode(k);
				this.$message.success('操作成功!');
				setTimeout(() => {//延时将刚才添加的设备添加到gis图中的列表中去
					this.$refs.GisMap.addNodeToListView(this.state.AllhashSensor[k]);
				},1500)
			},
            cleanInfo(){
            	this.controlForm = {}
            	this.addForm = {}
            },
			//保存 环境监测区域
            sureArea(){
            	console.log(this.areadata)
            	delete this.areadata.showColor
            	delete this.areadata.level
            	delete this.areadata.areatype
            	delete this.areadata.alarm
            	delete this.areadata.statusText
            	delete this.areadata.k
            	delete this.areadata.type
            	delete this.areadata.time
            	delete this.areadata.now_status
            	delete this.areadata.now_value
            	delete this.areadata.worker_timeout
            	delete this.areadata.alarmMap
            	//console.log(this.areadata)
            	let me = this
            	if(this.areadata.emphasis==3){
	            	api.gas.addWatchArea(this.areadata).then(function(res) {
	                  console.log(res)
	                    if(res.data.status === 0){
	                        me.$message({
			                    type: 'success',
			                    message: '操作成功!'
			                });
			                me.action.getOwnList();
			                me.addArea = false
	                      }else{
	                        me.$message.error(res.data.msg)
	                      }
	                })
	            }else{
	            	api.routeLine.addupArea(this.areadata).then(function(res) {
	                  console.log(res)
	                    if(res.data.status === 0){
	                        me.$message({
			                    type: 'success',
			                    message: '操作成功!'
			                });
			                me.$store.dispatch("getAllArea");
			                me.addArea = false
	                      }else{
	                        me.$message.error(res.data.msg)
	                      }
	                })
	            }

			},
            drawOver(data){
            	console.log(data)
            	this.areadata = data
            	this.sureArea()
            },
            //区域
            checkArea(data){
            	console.log(data)
            	this.areadata = {}
            	this.Routearea = {}
            	if(data.emphasis==3){
            		this.addArea = true
            		_.assign(this.areadata,data)
            		//this.$refs.areaaddup.check(data.ob.adjoin+'')
            	}else if(data.emphasis!=3){
            		this.addRouteArea = true
            		_.assign(this.Routearea,data)
            	}
            	else{
            		_.assign(this.areadata,data)
            	}
			},
			//拖动编辑
			editDrag(ob){
				this.changePos = true;
				this.changedata = {};
				if(ob.type == 16){
					_.assign(this.changedata,ob);
					this.addForm = ob;
					this.addForm.x_point = ob.x_point;
					this.addForm.y_point = ob.y_point;
				}
				else if(ob.type == 72){
					_.assign(this.changedata,ob);
					this.controlForm = ob;
					this.controlForm.x_point = ob.x_point;
					this.controlForm.y_point = ob.y_point;
				}
				else if(ob.type==102||ob.type==103){
				}
				else if(ob.typeid == this.state['sensorConfig']['cardReader']){//读卡器
					_.assign(this.changedata,ob);
				}
				else if(ob.pid == this.state['sensorConfig']['analog'] || ob.pid == this.state['sensorConfig']['switch']){
					_.assign(this.changedata,ob)
				}

				if(this.changedata.uid&& this.changedata.id){
					this.saveeditDrag();
				}else{
					this.action.getOwnList();
					this.$message.error('操作失败!');
				}
			},
			//保存拖动
			saveeditDrag(){
				let rdata = {};
				rdata.uid = this.changedata.uid;
				rdata.id = this.changedata.id
				rdata.x_point = this.changedata.x_point;
				rdata.y_point = this.changedata.y_point;
				if(this.changedata.pid == this.state['sensorConfig']['analog'] ||this.changedata.pid == this.state['sensorConfig']['switch']){
					rdata.x2_point = this.changedata.x2_point;
					rdata.y2_point = this.changedata.y2_point;
					rdata.x3_point = this.changedata.x3_point;
					rdata.y3_point = this.changedata.y3_point;
				}
				api.station.updateSensor(rdata).then(res => {
					console.log(rdata,res)
					if(res.data.status==0){
						this.action.getOwnList();
						this.$message.success('操作成功!');
					}else{
						this.action.getOwnList();
						this.$message.error('操作失败!');
					}
				})
			},
			//修改设备配置或查看设备详情
			editSersor(ob){
				if(ob.type == 72 || ob.type == 102 || ob.type == 103){
					this.controlTitle = '编辑系统设备';
					this.controlModel = true;
					this.controlForm = ob;
				}
				else if(ob.type == 16){
					this.stationTitle = '编辑分站';
					this.addModal = true;
					this.addForm = ob;
				}else if(ob.typeid == this.state['sensorConfig']['cardReader']){
					this.RowItem = ob
					this.editCard = true
					this.state.isedit = true
				}else if(ob.pid == this.state['sensorConfig']['analog']){
					this.isanalog = true;
					this.nowGas = ob;
					this.editAnalog = true;
					this.editText = '编辑'+(ob.type!=69?ob.type:ob.name);
				}else if(ob.pid == this.state['sensorConfig']['switch']){
					console.log("ob",ob)
					this.isanalog = true;
					this.swit = ob;
					this.swit.control = ob.control + '';
					this.editSwitchs = true;
					this.editText = '编辑'+ob.type;
				}
			},
			//编辑
			edit(row){
				console.log(row,'row',this.state['sensorConfig']['switch'])
				let {editType,ob,point} = row;
				switch(editType){
					case 1://新加
						this.editAdd(ob,point)
					break;
					case 2://拖动
						this.editDrag(ob);
					break;
					case 3://设备配置
						this.editSersor(ob);
					break;
					default:
						console.log(row,editType)
					break;
				}
			},
			//添加
			editAdd(ob,point){
				this.AddnewOne = true;//新添加设备模式
				if(ob.id == 72||ob.id == 102||ob.id == 103||ob.id == 104){//电源箱 传输接口 设备 电缆 交换机
					this.controlTitle = '添加' + ob.v;
					this.controlForm = {};
					this.controlForm.type = ob.id;
					this.controlForm.x_point = point.x;
					this.controlForm.y_point = point.y;
					this.controlModel = true;
				}else if(ob.id == 16){ //分站
					this.stationTitle = '添加' + ob.v;
					this.addForm = {};
					this.addForm.type = 16;
					this.addForm.x_point = point.x;
					this.addForm.y_point = point.y;
					this.addModal = true;
				}else if(ob.id == this.state['sensorConfig']['cardReader']){	//人员定位读卡器
					this.RowItem = {};
					this.RowItem.x_point = point.x;
					this.RowItem.y_point = point.y;
					this.editCard = true;
				}else if(ob.pid == this.state['sensorConfig']['analog']){//模拟量
					this.editText = '添加' + ob.v;
					this.nowGas = {};
					this.nowGas.sensor_type = ob.id;
					this.nowGas.x_point = point.x;
					this.nowGas.y_point = point.y;
					this.editAnalog = true;
				}else if(ob.pid == this.state['sensorConfig']['switch'] ){//开关量
					this.editText = '添加' + ob.v;
					this.swit = {};
					this.swit.sensor_type = ob.id;
					this.swit.x_point = point.x;
					this.swit.y_point = point.y;
					this.editSwitchs = true;
				}
			}
		},
		mounted() {
			this.fetchData();
		}
	};
</script>
