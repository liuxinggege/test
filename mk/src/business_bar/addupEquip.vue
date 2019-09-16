<style>
</style>
<template>
	<div>
        <el-form :model="controlForm"  label-width="90px" ref="formItem" :rules="ruleInline">         
            <el-form-item label="类型" prop="type">
                <el-select v-model="controlForm.type" @change="pidchange" size="small">
                    <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属分站" v-if="controlForm.type==72" prop="stationId">
                <el-select v-model="controlForm.stationId" filterable size="small">
                    <el-option v-for="item in stationList" :value="item.id" :key="item.ipaddr" :label="item.station_name + ':'+ item.ipaddr"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="传感器ID" prop="devid" v-if="controlForm.type==72">
                <el-input-number :max="255" :min="1" v-model="controlForm.devid" size="small" style="width:215px"></el-input-number>
            </el-form-item>
            <el-form-item label="交换机IP" v-if="controlForm.type==104" prop="ip">
                <el-input size="small" v-model="controlForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="名称" v-if="controlForm.type!=72">
                <el-input size="small" v-model="controlForm.name" style="width: 210px;"></el-input>
            </el-form-item>
            <el-form-item label="位置" prop="position">
                <el-select  v-model="controlForm.position" filterable allow-create  default-first-option size="small">
                    <el-option
                        v-for="item in AllPositionList"
                        :key="item.id"
                        :label="item.v"
                        :value="item.v">
                    </el-option>
                </el-select> 
           </el-form-item>
           <el-form-item label="X坐标" prop="x_point" v-if="controlForm.type!=104">
				<el-input size="small" v-model="controlForm.x_point"  style="width: 210px;"></el-input>
			</el-form-item>
			<el-form-item label="Y坐标" prop="y_point" v-if="controlForm.type!=104">
			    <el-input size="small" v-model="controlForm.y_point"  style="width: 210px;"></el-input>
			</el-form-item>
            <el-form-item label="" style="text-align: right;" v-if="$route.query.type!='scan'&&$route.query.type!='route-scan'&&$route.query.type!='watching-scan'&&$route.query.type!='voice-scan'&&$route.name!='Bsystem'">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" icon="el-icon-message" type="primary" @click="submitaddup(0,'formItem')">保存</el-button>
            </el-form-item>
        </el-form>
	</div>
</template>

<script>
	import api from 'src/api'
	import store from 'src/store'
	export default {
        props:{
		    controlForm:Object,
	    },
		components: {
        },
		data() { 
            const isIp = (rule, value, callback) => {
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!value) {
                    return callback(new Error('IP不能为空'));
                } else if (reg.test(value)) {
                    return callback();
                }
                callback(new Error('不符合IP格式'));
            };
            const validateNumber = (rule, value, callback) => {
        		var re=/^-?\d+(\.{1}\d+)?$/;
     		    if (value === '') {
                    callback(new Error('不能为空！'));
                }
        	 	else if(!re.test(value)){ 
			        callback(new Error('请输入数字！')); 
			    }else{
			    	callback()
			    }
        	};
			return {
                AllPositionList:[],
                state:store.state,
                action:store.actions,
                typeList:[{
                    label:'电源箱',
                    value:72
                },{
                    label:'传输接口',
                    value:102
                },{
                    label:'电缆',
                    value:103
                },{
                    label:'交换机',
                    value:104
                }],
                ruleInline:{
                     stationId:{required: true, message: '不能为空', trigger: 'change'},
                     position:{required: true, message: '不能为空', trigger: 'change'},
                     ip: {validator: isIp,trigger: 'blur'},
                     x_point:{validator: validateNumber,trigger: 'blur'},
                     y_point:{validator: validateNumber,trigger: 'blur'}
                }
            }
		},
		methods: {
            submitaddup(index,name){
            	index = index || 0;
                name = name || 'formItem'
                 let vm = this
                 this.$refs[name].validate((valid) => {
        	     	if(valid){
                        delete this.controlForm._index
                        delete this.controlForm._rowKey
                        delete this.controlForm.status
                        delete this.controlForm.value
                        delete this.controlForm.statusText
                        delete this.controlForm.showColor
                        delete this.controlForm.k
                        delete this.controlForm.debug
                        delete this.controlForm.now_status
                        delete this.controlForm.now_value
                        delete this.controlForm.percent
                        delete this.controlForm.recharge
                        delete this.controlForm.rechargeText
                        delete this.controlForm.time
                        delete this.controlForm.alarm_drop
                        delete this.controlForm.discharging
                        delete this.controlForm.dischargingText
                        delete this.controlForm.key
                        delete this.controlForm.ipaddr
                        delete this.controlForm.__gohashid
                        delete this.controlForm.boss   
                        delete this.controlForm.sensorId   
                        if(this.controlForm.type != 104){
                            delete this.controlForm.ip
                        } 
                        delete this.controlForm.battary
                        delete this.controlForm.balance
                        delete this.controlForm.current
                        delete this.controlForm.currentText
                        delete this.controlForm.balanceText
                        delete this.controlForm.cut1
                        delete this.controlForm.cut1Text
                        delete this.controlForm.cut2
                        delete this.controlForm.cut2Text
                        delete this.controlForm.can1
                        delete this.controlForm.can2                      
                        api.station.addupEquip(this.controlForm).then(function(res) {                   
                            if(res.data.status==0){
                                vm.$emit('backEquip',vm.controlForm)
                                vm.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });                                
                            }else{
                            	vm.$message.error(res.data.msg)
                            }
                        })
                        }else{
                            vm.$message.error('操作失败！')
                        }
                	 })
            },
            cancel(){
                this.$emit('backup')
            },
            pidchange(val){
                switch(val){
                    case 72:
                        this.controlForm.sensorname = '电源箱'
                        this.controlForm.path = 'dianyuanxiang.svg'
                    break; 
                    case 102:
                        this.controlForm.sensorname = '传输接口'
                        this.controlForm.path = 'chuanshujiekou.svg'
                    break; 
                    case 103:
                        this.controlForm.sensorname = '电缆'
                        this.controlForm.path = 'dianlan.svg'
                    break; 
                    case 104:
                        this.controlForm.sensorname = '交换机'
                        this.controlForm.path = 'jiaohuanji.svg'
                    break; 
                }
            },
            getAllPosition(){
                var vm = this
                 api.gas.getAllPosition().then(function(res){
                    if(res.data.status ==0){
                        vm.AllPositionList = res.data.data
                    }else{
                        vm.$message.error(res.data.msg)
                    }
                 })
            },
		},
		mounted() {
			this.getAllPosition();
			this.$store.dispatch("getStation");
            this.pidchange(this.controlForm.type)
		},
		watch:{ 
        },
		computed: {        	
            stationList(){
            	return this.$store.state.AllStation;
            }
       }
	};
</script>