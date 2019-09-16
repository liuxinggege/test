<style lang="less">
	@import '../../styles/common.less';
	.graph_content{
		width: 100%;
		height: 100%;
	}
    .markInfo{
    	position: absolute;
    	left:20px;
        top:78px;
        font-size: 18px;
        z-index: 1;
        cursor: pointer;
    }
    .markInfo>p{
        display: flex;
        flex-wrap:wrap;
		padding: 5px 50px;
		font-weight:bold;
	}
</style>
<template>
<div class="graph_content">
		<!-- gis模拟图组件 -->
        <gis-map
			ref="GisMap"
			v-if="$store.state.center.length"
			:addDeviceList="[]"
			@showReal="showReal"
			@checkArea="checkArea"
			@edit="edit">
		</gis-map>
		<!-- 快捷方式组件 -->
		<short-cut style="position: absolute" ref="shortCut"></short-cut>
		<!-- 井下人员统计显示 -->
        <div class="markInfo" v-if="($route.query.type=='route-scan'||$route.query.type=='scan')&&$route.query.type!='edit'">
        	<p style="color: #0000CC;">
        		<span>(总人数/限制人数)
					<span style="margin-left:15px">当前井下总人数：
						<span 
						:style="{color:state.downholeTotal.personNum > state.downholeTotal.max_allow?'red':'blue'}" 
						@click="$router.push({name:'watch'})">
						{{state.downholeTotal.personNum}}/{{state.downholeTotal.max_allow}}(人)
						</span>
					</span>
					<span v-for="item in state.downholeTotal.list">
						<span style="margin-left:40px" @click="$router.push({name:'watch',query:{id:item.areaid}})">
							{{item.areaname}}:
						<span :style="{color:item.personNum > item.max_allow?'red':'blue',cursor:item.personNum>item.max_allow?'pointer':''}">{{item.personNum}}</span>/{{item.areaid==-2?"∞":item.max_allow}}(人)
						</span>
					</span>
				</span>
        	</p>
        </div>
		<!-- 环境监测联动报警显示 -->
		<div  class="markInfo" style="top:120px;" v-if="($route.query.type=='watching-scan'||$route.query.type=='scan')&&$route.query.type!='edit'">
			 <p :style="{color:state.colorData.level1}">
				 <span
					v-for="item in actionStatusList"
					style="margin-right:30px;font-weight:bold;"
					@click="$router.push({name:'nowtime',query:{row:'action_'+item.msgid}})">
					 {{item.name}}:报警中
				 </span>
			 </p>
		</div>
		<!-- 模拟量 -->
		<div v-if="editAnalog">
			<el-dialog :visible.sync="editAnalog" width="40%" :title="editText" :append-to-body="true" :close-on-click-modal="false">
				<up-sensor :formItem="nowGas" :isanalog="true" :isloding="isloding" @saveUpdate="save(nowGas,1)" @backup="backup"></up-sensor>
			</el-dialog>
		</div>
		<!-- 开关量 -->
		<div v-if="editSwitchs">
			<el-dialog :visible.sync="editSwitchs" width="40%" :title="editText" :append-to-body="true" :close-on-click-modal="false">
				<add-switch :addSwitchForm="swit" @saveUpdate="save(swit,0)" :isloding="isloding" @backup="backup"></add-switch>
			</el-dialog>
		</div>
		<!-- 读卡器 -->
		<div v-if="editCard">
			<el-dialog :visible.sync="editCard" width="40%" title="新增/编辑读卡器" :append-to-body="true" :close-on-click-modal="false">
                 <add-card :formItem="RowItem" @saveDate="saveDate" @backup="backup"></add-card>
			</el-dialog>
        </div>
		<!-- 读卡器当前人员列表 -->
        <div v-if="showNum">
			<el-dialog :visible.sync="showNum" width="950px" title="当前设备人员信息" :append-to-body="true" :close-on-click-modal="false">
                <watch-real ref="watchInfo" @check="check"></watch-real>
			</el-dialog>
        </div>
		<!-- 人员定位区域 -->
		<div v-if="showArea">
			<el-dialog :visible.sync="showArea" width="40%" title="区域详情" :append-to-body="true" :close-on-click-modal="false">
				<route-area @backup="backup" :formInline="routearea"></route-area>
			</el-dialog>
        </div>
		<!-- 广播 -->
		<div v-if="editvoice">
			<el-dialog :visible.sync="editvoice" width="40%" title="广播" :append-to-body="true" :close-on-click-modal="false">
				<add-voice @backup="backup" @saveVoice="saveVoice" :formItem="voices" :hiddenEdit="true"></add-voice>
			</el-dialog>
        </div>
</div>
</template>
<script>
import store from 'src/store'
import api from 'src/api'
import GisMap from "./topobar.vue"
import ShortCut from './../../business_bar/shortcut.vue'
import upSensor from './../../business_bar/upSensor.vue';
import addSwitch from './../../business_bar/addSwitch.vue';
import addCard from './../../business_bar/addCard.vue';
import watchReal from './../person_real_list/nowpersonlist.vue';
import routeArea from './../../business_bar/addPersonArea.vue';
import addVoice from './../../business_bar/addVoice.vue';

export default {
    components: {
		GisMap,
		ShortCut,
        upSensor,
        addSwitch,
        addCard,
        watchReal,
		routeArea,
		addVoice
    },
    data () {
        return {
        	changePos:false,
        	showNum:false,
        	editAnalog:false,
        	editSwitchs:false,
        	editvoice:false,
        	editCard:false,
            state:store.state,
            action:store.actions,
            rdata:{},
            swit:{},
            voices:{},
            RowItem:{},
			nowGas:{},
			routearea:{},
			showArea:false,
			changedata:{},
			actionStatusList:[]
        }
    },
    computed: {
        stationList(){
            return this.$store.state.AllStation;
        },
    },
    watch:{
		'$route': 'fetchData',
		'state.skIndex': {
			handler: function(val) {
				this.actionStatusList = Object.values(this.state.actionStatus).filter(item => item.type === 1)
			},
			deep: false
		},
    },
    methods: {
      	fetchData(){},
	   	saveDate(obj){
			this.editCard = false;
			let itemIp = this.stationList.find(ob => ob.id == obj.substation_id);
			if(this.AddnewOne && itemIp && obj.cid){
					this.renderAddGis(itemIp.ipaddr + ':' + obj.cid + this.state.sensorConfig.cardReader);
			}
			this.AddnewOne = false
	 	},
        showReal(id,sid){
            this.showNum = true
            console.log(this.$refs)
            setTimeout(() => {
            	this.$refs.watchInfo.getData(id,sid)
            },15)
        },
        backup(){
            this.editSwitchs = false
            this.editAnalog = false
            this.editCard = false
            this.isanalog = false
            this.isloding=false
            this.AddnewOne = false
            this.dragging = []
            this.editvoice = false
        },
        checkArea(data){
			  console.log(data,"区域:",data.area_type_id)
			  if(data.area_type_id){
				   this.state.addArea = true
	     		   _.assign(this.state.areadata,data)
			  }else{
				  this.showArea = true;
				  this.routearea = data;
			  }
	    },
	    check(id){
            	if(id){
            		this.showNum = true
            	}else{
            	  this.showNum = false
	        	  this.$message.error('没有数据!')
	        	}
	    },
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
                                me.action.getOwnList()
	                            me.$message.success('操作成功!')
	                            if(me.AddnewOne){
                                  me.$refs.GisMap.addNode(ip+':'+obj.sensorId+':'+obj.sensor_type)
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
                                me.action.getOwnList()
                                me.$message.success('操作成功!');
                                if(me.AddnewOne){
                                  me.$refs.GisMap.addNode(ip+':'+obj.sensorId+':'+obj.sensor_type)
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
		saveVoice(obj) {
			delete obj.now_status
			delete obj.now_value
			delete obj.showColor
			delete obj.statusText
			delete obj.k
			api.video.addup(obj).then(res => {
				if(res.data.status==0){
					this.$message.success('操作成功!');
					this.backup()
				}else if(res.data.isuse ==1){
					this.$message.error(res.data.msg)
				}else{
					this.$message.error(res.data.msg)
					this.backup()
				}
			})
        },
        edit(val){
        		console.log(val)
				if(val.ob&&val.ob.sensorId){
					let row = val.ob
						if(row.pid==this.state['sensorConfig']['switch']){
							this.swit = row
							this.swit.control = row.control + ''
							this.editSwitchs = true
							this.editText = '新增/编辑'+row.type
						}else if(row.pid==this.state['sensorConfig']['analog']){
							this.isanalog = true
							this.nowGas = row
							this.editAnalog = true
							this.editText = '新增/编辑'+(row.type!=69?row.type:row.name)
						}
	            }
      	        else if(val.ob&&val.ob.radioId){//广播
	            	this.editvoice = true
	            	this.voices = val.ob
            	}
	      	    else if(val.ob&&val.ob.typeid==this.state.sensorConfig.cardReader){//读卡器
			    	  this.editCard = true
			          let row = val.ob
			          this.RowItem = row
			          this.RowItem.did = row.cid
			          this.state.isedit = true
			          if(row.ctype==1){
			          	this.RowItem.entrance = true
			          }else{
			            this.RowItem.entrance = false
			          }
		        }
	            else if(val.ob&&val.ob.type!=16){//其他
			        this.state.controlModel = true
		        	_.assign(this.state.controlForm,val.ob)
			    }
				else if(val.ob&&val.ob.type==16){
					this.state.addModal = true
				    _.assign(this.state.addForm,val.ob)
			    }
				else if(val.newone&&!val.newone[0].alais){
				  console.log(val)
				  this.AddnewOne = true
               	  this.swit = {}
               	  this.nowGas = {sensor_type:val.newone[0].id}
               	  this.editText = '新增/编辑'+val.newone[0].v
               	  if(val.newone[0].pid==this.state['sensorConfig']['analog']){
               	  	 this.editAnalog = true
               	  	 this.nowGas.x_point = val.point.x
               	  	 this.nowGas.y_point = val.point.y
               	  }else if(val.newone[0].pid==this.state['sensorConfig']['switch']&&val.newone[0].k!=this.state['sensorConfig']['voice']&&val.newone[0].k!=this.state['sensorConfig']['cardReader']){
               	  	 this.editSwitchs = true
               	  	 this.swit.x_point = val.point.x
               	  	 this.swit.y_point = val.point.y
               	  }else if(val.newone[0].k==this.state['sensorConfig']['voice']){
               	  	this.editvoice = true
               	  	this.voices.x_point = val.point.x
               	  	this.voices.y_point = val.point.y
               	  }
               	  else if(val.newone[0].k==this.state['sensorConfig']['cardReader']){
               	  	this.editCard = true
               	  	this.RowItem.x_point = val.point.x
               	  	this.RowItem.y_point = val.point.y
               	  }
                }
				else if(val.newone&&val.newone[0].alais){
				  this.AddnewOne = true
               	  var rdata = val.newone[0]
               	  rdata.x_point = val.point.x
               	  rdata.y_point = val.point.y
               	  this.editText = '新增/编辑'+rdata.type
               	  if(rdata.pid==this.state['sensorConfig']['analog']){
               	  	this.editAnalog = true
               	  	this.nowGas = rdata
               	  }else if(rdata.pid==this.state['sensorConfig']['switch']){
               	  	this.editSwitchs = true
               	  	this.swit = rdata
               	  }else if(rdata.typeid==this.state['sensorConfig']['cardReader']){
               	  	this.editCard = true
               	  	this.RowItem = rdata
               	  }else{
               	  	this.editvoice = true
               	  	this.voices = rdata
               	  }
               }
        		else{
                	this.changePos = true
                	this.changedata = {}
                	_.assign(this.changedata,val)
                	this.ok()
                }
        },
        ok(){
			this.rdata = {}
			this.rdata.x_point  = this.changedata.x_point
			this.rdata.y_point  = this.changedata.y_point
			this.rdata.x2_point = this.changedata.x2_point
			this.rdata.y2_point = this.changedata.y2_point
			this.rdata.x3_point = this.changedata.x3_point
			this.rdata.y3_point = this.changedata.y3_point
			this.rdata.uid = this.changedata.uid
			this.rdata.id = this.changedata.id
			api.station.updateSensor(this.rdata).then((res) => {
				console.log(res)
				if(res.data.status==0){
					this.$message.success('操作成功!')
					this.action.getOwnList()
					this.action.generate()
				}else{
					this.action.getOwnList()
					this.$message.error('操作失败!')
				}
			})
      }
	},
	mounted () {},
    created(){
		this.state.downholeTotal = JSON.parse(window.localStorage.getItem('downholeTotal')) || {list:[],personNum:0,max_allow:0};
		this.$store.dispatch("getStation");
	    this.$store.dispatch("getFacilityMsg");
    	this.$store.dispatch("getAllSwitch");
	},
    
}
</script>
