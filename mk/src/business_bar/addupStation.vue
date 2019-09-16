<style>
.ipparse {
  border: 1px solid #e5e9f2;
  border-radius: 3px;
  font-size: 8px;
}
.legend {
  font-weight: bold;
  font-size: 13px;
}
</style>
<template>
	<div style="height: 650px;overflow-y: scroll;">
		<el-form :model="addForm" label-width="125px" :rules="ruleInline" ref="formItem">
			<fieldset class="ipparse">
             	<legend class="legend">基本信息</legend>
             	<el-row>
	             	<el-col :span="12">
						<el-form-item label="分站名称" prop="station_name">
							<el-input size="small" v-model="addForm.station_name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分站地址" prop="ipaddr">
							<el-input size="small" v-model="addForm.ipaddr"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="X坐标" prop="x_point">
							<el-input size="small" v-model="addForm.x_point"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Y坐标" prop="y_point">
							 <el-input size="small" v-model="addForm.y_point"></el-input>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-form-item label="分站位置" prop="position">
					<el-select size="small" v-model="addForm.position" filterable allow-create  default-first-option style='width: 100%;' >
						<el-option v-for="item in AllPositionList" :key="item.id" :label="item.v" :value="item.v">{{item.v}}</el-option>
					</el-select>
				</el-form-item>
			</fieldset>
			<fieldset class="ipparse">
             	<legend class="legend">运行参数</legend>
             	<el-row>
	               	<el-col :span="12">
						<el-form-item label="用户程序启动地址">
							<el-input size="small" v-model="addForm.start_adr"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="发布时间">
							<el-input size="small" v-model="addForm.sys_info"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据校验长度">
							<el-input size="small" v-model="addForm.chksum_len"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="校验/检测参数">
							<el-input size="small" v-model="addForm.chksum"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="IP地址">
							<el-input size="small" v-model="addForm.s_ip"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="掩码">
							<el-input size="small" v-model="addForm.s_nm"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="网关">
							<el-input size="small" v-model="addForm.s_gw"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="DNS">
							<el-input size="small" v-model="addForm.dns_ip"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务器地址">
							<el-input size="small" v-model="addForm.ser_ip"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务器端口号">
						 	<el-input-number size="small" v-model="addForm.ser_port"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="外设使能">
							<el-input  size="small" v-model="addForm.dev_en"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="RS485显示端口">
							<el-input-number size="small" v-model="addForm.rs485_led"></el-input-number>
						</el-form-item>	
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="接收信息">
							<el-input  size="small" v-model="addForm.rcv"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备ID">
							<el-input-number size="small" v-model="addForm.dev_id" :min="1" :max="255"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item label="波特率设置">
		                <el-col :span="4">
	                        <el-input-number size="mini" style="width:80px;" v-model="addForm.can1_baud_rate" :min="0"></el-input-number >
		                </el-col>
	                	<el-col :span="1" style="text-align: center">-</el-col>
	                	<el-col :span="4">
                        	<el-input-number size="mini" style="width:80px;" v-model="addForm.can2_baud_rate" :min="0"></el-input-number >
	                	</el-col>
	                	<el-col :span="1" style="text-align: center">-</el-col>
	                 	<el-col :span="4">
	                  		<el-input-number size="mini" style="width:80px;" v-model="addForm.rs485_baud_rate" :min="0"></el-input-number >
	                	</el-col>
	                	<el-col :span="10">
							<span style="font-size:12px;">CAN1-CAN2-RS485 (波特率)</span>
						</el-col>
	               	</el-form-item>
	            </el-row>
				<el-row>
					<el-form-item label="挂载设备数量设置">
		                <el-col :span="4">
	                        <el-input-number size="mini" style="width:80px;" v-model="addForm.can1_mount_cnt" :min="0"></el-input-number >
		                </el-col>
		                <el-col :span="1" style="text-align: center">-</el-col>
		                <el-col :span="4">
	                        <el-input-number size="mini" style="width:80px;" v-model="addForm.can2_mount_cnt" :min="0"></el-input-number >
		                </el-col>
		                <el-col :span="1" style="text-align: center">-</el-col>
	                 	<el-col :span="4">
		                  	<el-input-number size="mini" style="width:80px;" v-model="addForm.rs485_mount_cnt" :min="0"></el-input-number >
		                </el-col>
		                <el-col :span="10">
							<span style="font-size:12px;">CAN1-CAN2-RS485 (挂载设备数量)</span>
						</el-col>
	               	</el-form-item>
	            </el-row>
				<el-row>
					<el-form-item label="数据上报间隔(ms)">
		                <el-col :span="4">
	                        <el-input-number  size="mini" style="width:80px;" v-model="addForm.send_msg_time1" :min="0"></el-input-number >
		                </el-col>
		                <el-col :span="1" style="text-align: center">-</el-col>
		                <el-col :span="4">
	                        <el-input-number  size="mini" style="width:80px;" v-model="addForm.send_msg_time2" :min="0"></el-input-number >
		                </el-col>
		                <el-col :span="1" style="text-align: center">-</el-col>
	                 	<el-col :span="4">
		                  	<el-input-number  size="mini" style="width:80px;" v-model="addForm.send_msg_time3" :min="0"></el-input-number >
		                </el-col>
		                <el-col :span="10">
							<span style="font-size:12px;">485轮训-数据无变化上报-CAN轮训</span>
						</el-col>
	               	</el-form-item>
	            </el-row>
            </fieldset>
            <el-form-item style="text-align:right;" v-if="$route.query.type!='scan'&&$route.query.type!='route-scan'&&$route.query.type!='watching-scan'&&$route.query.type!='voice-scan'&&$route.name!='Bsystem'">
				<el-button size="small" @click="backup">关闭</el-button>
				<el-button size="small" type="primary" @click="submitaddup(0,'formItem')" icon="el-icon-message">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import api from 'src/api'
	import store from 'src/store'
	export default {
        props:{
		    addForm:Object,
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
            const isNull = (rule, value, callback) => {
     		    if (!value) {
                    callback(new Error('不能为空！'));
                }else{
			    	callback()
			    }
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
				state:store.state,
				action:store.actions,
                AllPositionList:[],
                ruleInline: {
                    ipaddr: {validator: isIp,trigger: 'blur'},
                     position:{validator:isNull, trigger: 'change' },    
                     x_point: {validator:validateNumber,trigger: 'blur' },
                     y_point: {validator:validateNumber,trigger: 'blur' }
                }
            }
		},
		methods: {
            submitaddup(index,name){
                index = index || 0;
                name = name || 'formItem'
                this.$refs[name].validate((valid) => {
                    if (valid) {           	
                            delete this.addForm._index
                            delete this.addForm._rowKey
                            delete this.addForm.status
                            delete this.addForm.statusText
                            delete this.addForm.now_status
                            delete this.addForm.showColor
                            delete this.addForm.k
                            delete this.addForm.debug
                            delete this.addForm.boss
                            delete this.addForm.devid
                            delete this.addForm.alarm_drop
                            delete this.addForm.key
                            delete this.addForm.__gohashid
                            delete this.addForm.now_value
                            let vm = this                
                            api.station.addup(vm.addForm).then(function(res) {
                                if(res.data.status==0){
                                   vm.$emit('saveStation',vm.addForm.ipaddr)                        
                                   vm.$message({
                                    type: 'success',
                                    message: '操作成功!'
								 });								 
                                }else{
                                     vm.$message.error(res.data.msg);
                                }
                            })
	                }else{
	                  this.$message.error('操作失败！')
	                }
	            })

            },
            getAllPosition(){
                var vm = this
                 api.gas.getAllPosition().then(function(res){
                 	if(res.data.status == 0){
                   	  	vm.AllPositionList = res.data.data
                 	}else{
                 		vm.$message.error(res.data.msg)
                 	}
                 })
            },
            backup(){
            	this.$emit('backup')
            }
		},
		watch:{},
		created(){
			this.getAllPosition();
		},
		mounted() {}
	};
</script>