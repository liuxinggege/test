<style lang="less">
    @import '../../styles/common.less';
    .markInfo{
    	position: absolute;
    	left:25px;
        top:78px;
        font-size: 18px;
        color: #0000CC;
        z-index: 1000;
        cursor: pointer;
    }

    .markInfo>p{
        display: flex;
        flex-wrap:wrap;
        padding: 5px 50px;
    }
</style>
<template>
    <div>
    	<el-card  v-if="showpage">
            <div v-if="editAnalog">
                <el-dialog :close-on-click-modal='false'
                    width="750px"
                    :visible.sync="editAnalog"
                    :title="editText">
                    <up-sensor style="text-align:right;" :formItem="nowGas" :isanalog="true" :isloding="isloding" @saveUpdate="save(nowGas,1)" @backup="backup"></up-sensor>
                    <div slot="footer"></div>
                </el-dialog>
            </div>
<!--            开关量 -->
            <div v-if="editSwitchs">
                <el-dialog  :close-on-click-modal='false'
                :visible.sync="editSwitchs"
                ok-text="退出"
                width="750px"
                cancel-text=""
                class="edit-switch"
                :title="editText">
                     <add-switch :addSwitchForm="swit" @saveUpdate="save(swit,0)" :isloding="isloding" @backup="backup"></add-switch>
                     <div slot="footer"></div>
                </el-dialog>
            </div>

            <div v-if="editCard">
               <el-dialog  :close-on-click-modal='false'
                :visible.sync="editCard"
                ok-text="退出"
                cancel-text=""
                title="新增/编辑读卡器">
                 <add-card :formItem="RowItem" @saveDate="saveDate" @backup="backup"></add-card>
                 <div slot="footer"></div>
               </el-dialog>
            </div>
            <div v-if="modal1">
			    <el-dialog :visible.sync="modal1" :close-on-click-modal='false' title="新增/编辑语音广播">
			        <add-voice  :formItem="voices" @saveVoice="saveVoice" @backup="backup"></add-voice>
			        <div slot="footer" styles="height:0;"></div>
			    </el-dialog>
			</div>
            <div class="markInfo" v-if="$route.query.type=='route-scan'">
        	    <p>
        		    <span>(总人数/限制人数)<span style="margin-left:15px">当前井下总人数：<span :style="{color:state.downholeTotalpersonNum> state.downholeTotal.max_allow?'red':'blue'}" @click="$router.push({name:'watch'})">{{state.downholeTotal.personNum}}/{{state.downholeTotal.max_allow}}(人)</span></span>
    	                <span v-for="item in state.downholeTotal.list">
        	                <span style="margin-left:40px" @click="$router.push({name:'watch',query:{id:item.areaid}})">
        	                    {{item.areaname}}:
        	                    <span :style="{color:item.personNum > item.max_allow?'red':'blue',cursor:item.personNum>item.max_allow?'pointer':''}">{{item.personNum}}</span>/{{item.max_allow}}(人)
        	                </span>
    	                </span>
                    </span>
        	    </p>
            </div>
            <short-cut style="position: absolute" ref="shortCut"></short-cut>
            <gis-map  @showReal="showReal" :dragList="dragList"  :undragList="undragList" @checkArea="checkArea" v-if="$store.state.center.length" ref='GisMap' @edit = 'edit' style="margin-top:-40px"></gis-map>
  
            <div v-if="showNum">
                <el-dialog
                :visible.sync="showNum"
                width="950px"
                title="当前设备人员信息"
                :close-on-click-modal="false">
                    <watch-real ref="watchInfo" @check="check"></watch-real>
                    <div slot="footer"></div>
                </el-dialog>
            </div>
        <!-- 折叠菜单栏 -->
        <div class="data-appear" v-if="showData">
            <el-button size="small" class="cssbtn"  @click="handleshowData(false)" type="primary">
                <i class="el-icon-caret-left"></i>
            </el-button>
        </div>
        </el-card>
    </div>
</template>
<script>
import store from 'src/store'
import api from 'src/api'
import GisMap from "./topo.vue"
import upSensor from './../../business_bar/upSensor.vue';
import addSwitch from './../../business_bar/addSwitch.vue';
import addCard from './../../business_bar/addCard.vue';
import addVoice from "./../../business_bar/addVoice.vue"
import watchReal from './../person_real_list/nowpersonlist.vue';
import ShortCut from './../../business_bar/shortcut.vue'
import EleDragableTable from './../../common_bar/EledragableTable.vue';

export default {
    components: {
        GisMap,
        upSensor,
        addSwitch,
        addCard,
        addVoice,
        watchReal,
        ShortCut,
        EleDragableTable
    },
    data () {
        return {
        	changePos:false,
        	showNum:false,
        	editAnalog:false,
        	editSwitchs:false,
        	modal1:false,
        	cardReader:[],
        	menuList:[],
        	tabData:[],
        	showFilter:false,
        	broadList:[],
        	editCard:false,
        	showpage:false,
        	showData:true,
            tabname:'name1',
            state:store.state,
            columnsList:[{
                key:'alais',
                title:'拖动传感器到底图'
            }],
            columnsList1:[{
                key:'path',
                title:'模拟量传感器'
            }],
            columnsList2:[{
                key:'path',
                title:'开关量传感器'
            }],
            action:store.actions,
            rdata:{},
            swit:{},
            voices:{},
            RowItem:{},
            nowGas:{},
            keywords:'',
            checkd:'',
            dragging:[],
            checkedKey:[],
            AddnewOne:false,
            table1: {
                hasDragged: false,
                isDragging: false,
                oldIndex: 0,
                newIndex: 0,
                draggingRecord: []
            },
            changedata:{},
            defaultProps: {
	          children: 'children',
	          label: 'label',
	          disabled:'disabled'
           }
        }
    },
    computed: {
    	watchingData(){
    		var arr = []
    		var list = []
    		if(this.showFilter){
    			list = this.tabData
	      	}
    		else{
    			if(this.$route.query.type=='watching-scan'){
    				list = [...this.state.maxPageList.list1,...this.state.maxPageList.list2]
    			}else if(this.$route.query.type=='route-scan'){
	      		    list = [...this.state.maxPageList.list3]
	            }
    			else if(this.$route.query.type=='voice-scan'){
	      		    list = [...this.state.maxPageList.list4]
	            }else{
	            	list = [...this.state.maxPageList.list1,...this.state.maxPageList.list2,...this.state.maxPageList.list3,...this.state.maxPageList.list4]
	            }
    		}
	      	arr = list
	      	return arr
    	},
        analogTypeList(){
           let arr = [...this.$store.state.AllTypeList]
           return arr
        },
        stationList(){
            return this.$store.state.AllStation;
        },
        switchTypeList(){
            let arr = []
      		   arr = [...this.$store.state.AllSwitch]
            return arr
        },
        undragList(){
            let arr = [...this.$store.state.undragList,...this.$store.state.undragList2,...this.$store.state.undragList6]
            return arr
        },
        dragList(){
            var list = []
            list = this.dragging
            return list
        },
    },
    watch:{
        //    'state.surePass':{
        //         handler:function(val){
        //             this.tabname = 'name2'
        //         }
        //     },
            'state.updateall':{
                handler:function(val){
                    this.getOwnList()
                }
            },
            '$route': 'fetchData',
    },
    methods: {
      handleshowData(bool){
          this.showData = bool;
          window.localStorage.setItem('showData',bool);
      },
      fetchData(){
      	  document.title = this.state.menuList[this.state.Kindex].pname || '煤矿安全监控系统'
      	  this.getOwnList()
       },
       showReal(id,sid){
            this.showNum = true
            setTimeout(() => {
            	this.$refs.watchInfo.getData(id,sid)
            },15)
       },
      checkInfo(){
      	 this.tabData = []
      	 this.showFilter = true
      	 var vm = this
      	 if(vm.keywords==''){
      	 	vm.showFilter = false
      	 }else{
	      	 api.station.getOwnList({keywords:vm.keywords}).then((res) => {
	      	 	vm.tabData = [
	                    ...res.data.data.list1,
	                    ...res.data.data.list2,
	                    ...res.data.data.list3,
	                    ]
	      	 })
      	 }
      },
      selectOnes(row, event, column){
      	   if(row.ob){
             this.$refs.GisMap.selected(row.ob.uid)
           }else{
           	 this.$refs.GisMap.selected(row.uid)
           }
      },
      backup(){
            this.editSwitchs = false
            this.editAnalog = false
            this.editCard = false
            this.isanalog = false
            this.isloding=false
            this.AddnewOne = false
            this.dragging = []
            this.modal1 = false
       },
      nodeClick(){
      	this.getCheckedKeys()
      },
        checkArea(data){
	        this.state.addArea = true
	        _.assign(this.state.areadata,data)
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
        edit(val){
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
      	        else if(val.ob&&val.ob.radioId){
	            	this.modal1 = true
	            	this.voices = val.ob
            	}
	      	    else if(val.ob&&val.ob.typeid==this.state.sensorConfig.cardReader){
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
	            else if(val.ob&&val.ob.type!=16){
			        this.state.controlModel = true
		        	_.assign(this.state.controlForm,val.ob)
			    }
				else if(val.ob&&val.ob.type==16){
					this.state.addModal = true
				    _.assign(this.state.addForm,val.ob)
			    }
				else if(val.newone&&!val.newone[0].alais){
				  this.AddnewOne = true
               	  this.swit = {}
               	  this.nowGas = {
						limit_alarm:0,
						error_band:0,
						floor_repower:0,
						limit_repower:0,
						control:0,
						max_range:0,
						min_range:0,
						max_frequency:0,
						floor_alarm:0,
						limit_power:0,
						floor_power:0,
						input_type:1,
						min_frequency:0,
						limit_warning:0,
						floor_warning:0,
						sensor_type:val.newone[0].id
				  }
               	  this.editText = '新增/编辑'+val.newone[0].v
               	  if(val.newone[0].pid==this.state['sensorConfig']['analog']){
               	  	 this.editAnalog = true
               	  	 this.nowGas.x_point = val.point.x
               	  	 this.nowGas.y_point = val.point.y
               	  }else if(val.newone[0].pid==this.state['sensorConfig']['switch']&&val.newone[0].k!=this.state['sensorConfig']['voice']&&val.newone[0].k!=this.state['sensorConfig']['cardReader']){
               	  	 this.editSwitchs = true
               	  	 this.swit.x_point = val.point.x
               	  	 this.swit.y_point = val.point.y
               	  }else if(val.newone[0].k==this.state['sensorConfig']['cardReader']){
               	  	this.modal1 = true
               	  	this.voices.x_point = val.point.x
               	  	this.voices.y_point = val.point.y
               	  }
               	  else if(val.newone[0].k==this.state['sensorConfig']['voice']){
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
               	  	this.modal1 = true
               	  	this.voices = rdata
               	  }
               }
        		else{
                	this.changePos = true
                	var vm = this
                	vm.changedata = {}
                	_.assign(vm.changedata,val)
                	vm.ok()
                }
        },
        handleOnstart1(from) {
            this.table1.oldIndex = from;
            this.table1.hasDragged = true;
            this.table1.isDragging = true;
        },
        saveDate(){
	    	this.editCard = false
	    	this.action.getOwnList()
	    },
        handleOnend1(e) {
            this.dragging = []
            this.table1.isDragging = false;
            this.table1.draggingRecord.unshift({
                    from: e.from + 1,
                    to: e.to + 1
            });
            this.dragging.push(e.value[e.from])
        },
      ok(){
      	var vm = this
      	vm.rdata = {}
      	vm.rdata.x_point = vm.changedata.x_point
        vm.rdata.y_point = vm.changedata.y_point
        vm.rdata.x2_point = vm.changedata.x2_point
        vm.rdata.y2_point = vm.changedata.y2_point
        vm.rdata.x3_point = vm.changedata.x3_point
        vm.rdata.y3_point = vm.changedata.y3_point
      	vm.rdata.uid = vm.changedata.uid
      	vm.rdata.id = vm.changedata.id
	  	api.station.updateSensor(vm.rdata).then((res) => {
	  		if(res.data.status==0){
	  			vm.$message.success('操作成功!')
	  			vm.action.getOwnList()
	  			vm.action.generate()
	  		}else{
	  			vm.action.getOwnList()
	  			vm.$message.error('操作失败!')
	  		}
	  	})
      },
      cancel(){
      	this.changePos = false
      	this.action.getOwnList()
      	this.$refs.GisMap.clean()
      },
      cleanInfo(){
      	this.showFilter = false
      },
      saveVoice(obj) {
            var me = this
                api.video.addup(obj).then(function(res){
                    if(res.data.status==0){
                    	me.action.getOwnList()
                        me.$message.success('操作成功!');
                        me.backup()
                    }else if(res.data.isuse ==1){
                        me.$message.error(res.data.msg)
                    }else{
                        me.$message.error(res.data.msg)
                        me.backup()
                    }
		        })
        },
        getOwnList(){
    	    var vm = this
    	    //vm.action.getTotal()
    	    var list = _.values(vm.state.AllhashSensor)
    	    vm.state.maxPageList.list1 = list.filter(item => item.pid==this.state['sensorConfig']['analog'])
    		// vm.$store.commit("getGasList",vm.state.maxPageList.list1)
    		vm.state.maxPageList.list2 = list.filter(item => item.pid==this.state['sensorConfig']['switch'])
    		// vm.$store.commit("getSwitchList",vm.state.maxPageList.list2)
    		/*vm.state.maxPageList.list5 = list.filter(item => (item.type==16||item.type==72))
    		vm.$store.commit("getDevice",vm.state.maxPageList.list5)*/
    		vm.state.maxPageList.list3 = list.filter(item => item.typeid == this.state['sensorConfig']['cardReader'])
    		vm.$store.commit("getRoute",vm.state.maxPageList.list3)
    		vm.state.maxPageList.list4 = list.filter(item => item.radioId)
    		vm.$store.commit("getAllBroadcast",vm.state.maxPageList.list4)
    		vm.showpage = true
    	}
    },
    beforeDestroy: function (){
        this.state.maxPageList = {list1:[],list2:[],list3:[],list5:[]}
    },
    beforeCreate() {
		this.$store.dispatch("getCenter");
	},
    created(){
    	this.state.downholeTotal = JSON.parse(window.localStorage.getItem('downholeTotal'))||{};
    },
    mounted () {
	    this.showpage = false
	    this.getOwnList()
        this.showData = JSON.parse(window.localStorage.getItem('showData'))
        this.$store.dispatch("getStation");
        this.$store.dispatch("getFacilityMsg");
	    this.$store.dispatch("getAllSwitch");
        this.cardReader.push(this.state.typeList[this.state['sensorConfig']['cardReader']+''])
        this.broadList.push(this.state.typeList[this.state['sensorConfig']['cardReader']+''])
    }
}
</script>
