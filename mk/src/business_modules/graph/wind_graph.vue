<style>
    .graph_content{
		width: 100%;
		height: 100%;
	}
</style>
<template>
<div class="graph_content">
    	<short-cut style="position: absolute" ref="shortCut"></short-cut>
        <gis-map  :addDeviceList="TypeList"  @checkArea="checkArea" @edit="edit"  ref="GisMap"  v-if="$store.state.center.length"></gis-map>
        <!--模拟量-->
        <div v-if="editAnalog">
            <el-dialog :visible.sync="editAnalog" width="40%" :title="editText" :append-to-body="true" :close-on-click-modal="false">
                <up-sensor :formItem="nowGas" :isanalog="isanalog" :isloding="isloding" @saveUpdate="save(nowGas,1)" @backup="backup"></up-sensor>
            </el-dialog>
        </div>
        <!-- 开关量 -->
        <div v-if="editSwitchs">
            <el-dialog :visible.sync="editSwitchs" width="40%" :title="editText" :append-to-body="true" :close-on-click-modal="false">
                <add-switch :addSwitchForm="swit" :isloding="isloding" @saveUpdate="save(swit,0)" @backup="backup"></add-switch>
            </el-dialog>
        </div>
         <!--分站 -->
        <div v-show="addModal">
            <el-dialog :visible.sync="addModal" width="40%" :title="stationTitle" :append-to-body="true" :close-on-click-modal="false">
                <addup-station @backup="backStation" @saveStation="saveStation" :addForm="addForm"></addup-station>
            </el-dialog>
        </div>
        <!-- 电源箱 等 系统设备 -->
        <div v-show="controlModel">
            <el-dialog :visible.sync="controlModel" width="30%" :title="controlTitle" :append-to-body="true" :close-on-click-modal="false">
                <addup-equip  @backEquip="backEquip" @backup="cenceladd" :controlForm="controlForm"></addup-equip>
            </el-dialog>
        </div>
</div>  
</template>
<script>
    import api from 'src/api'
    import store from 'src/store'
    import _ from 'lodash'
    import GisMap from "./topobar.vue"
    import upSensor from "../../business_bar/upSensor.vue"
    import addSwitch from "../../business_bar/addSwitch.vue"
    import shortCut from "../../business_bar/shortcut.vue"
    import addupEquip from '../../business_bar/addupEquip.vue'
	import addupStation from '../../business_bar/addupStation.vue'
    export default {
        name: 'route-index',
        components: {
            GisMap,
            upSensor,
            addSwitch,
            shortCut,
            addupEquip,
            addupStation
        },
        watch: {
            '$route': 'fetchData',
        },
        data() {
            return {
                addModal:false,
                stationTitle:"",
                addForm:{},
                controlModel:false,
                controlTitle:"",
                controlForm:{},
                state:store.state,
                action:store.actions,
                editText:'',
                editSwitchs:false,
                editAnalog:false,
                isloding:false,
                isanalog:false,
                AddnewOne:false,
                nowGas:{},
                swit:{},
                changedata:{},
                TypeList:[]
            }
        },
        methods: {
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
            //模拟量 开关量保存
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
            backup(){
            	this.AddnewOne = false
                this.editSwitchs = false
                this.editAnalog = false
                this.isanalog = false
                this.isloding=false
            },
            renderAddGis(k){
				this.action.getOwnList();
				this.$refs.GisMap.addNode(k);
				this.$message.success('操作成功!');
				setTimeout(() => {//延时将刚才添加的设备添加到gis图中的列表中去
					this.$refs.GisMap.addNodeToListView(this.state.AllhashSensor[k]);
				},1500)
			},
            checkArea(data){
	        	this.state.addArea = true
	        	_.assign(this.state.areadata,data.ob)
            },
            //编辑
			edit(row){
				console.log(row,'row')
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
            //拖动编辑
			editDrag(ob){
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
                }
                else if(ob.pid == this.state['sensorConfig']['analog']){
					this.isanalog = true;
					this.nowGas = ob;
					this.editAnalog = true;
					this.editText = '编辑'+(ob.type!=69?ob.type:ob.name);
				}else if(ob.pid == this.state['sensorConfig']['switch']){
					this.isanalog = true;
					this.swit = ob;
					this.swit.control = ob.control + '';
					this.editSwitchs = true;
					this.editText = '编辑'+ob.type;
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
                }
                else if(ob.pid == this.state['sensorConfig']['analog'] ){//模拟量
					this.editText = '添加' + ob.v;
					this.nowGas = {};
					this.nowGas.sensor_type = ob.id;
					this.nowGas.x2_point = point.x;
					this.nowGas.y2_point = point.y;
					this.editAnalog = true;
				}else if(ob.pid == this.state['sensorConfig']['switch']){//开关量
					this.editText = '添加' + ob.v;
					this.swit = {};
					this.swit.sensor_type = ob.id;
					this.swit.x2_point = point.x;
					this.swit.y2_point = point.y;
					this.editSwitchs = true;
				}
			},
            fetchData(){
                let list = Object.values(this.state.typeList)
                    this.TypeList = list.filter(item => (item.id != this.state['sensorConfig']['cardReader'] && item.id != this.state['sensorConfig']['voice'] &&
                    item.id != 101 && item.id != 102 && item.id != 103 && item.id != 104 &&
                    item.id != 72 && item.id != 16 && item.id != 900))
            },
        },
        computed: {
            stationList(){
            	return this.$store.state.AllStation;
            }
        },
        mounted() {
           this.fetchData();
        },
        beforeCreate(){
            this.$store.dispatch("getFacilityMsg");
            this.$store.dispatch("getAllSwitch");
            this.$store.dispatch("getStation");
        },
    };

</script>
