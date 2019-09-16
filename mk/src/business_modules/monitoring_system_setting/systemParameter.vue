<style type="text/css">

 .uploadCss{
 	margin-left:20px;
 	margin-top:15px;
 	width: 200px;
 }
 .ivu-input[disabled], fieldset[disabled] .ivu-input{
 	color:#232121;
 }
 .el-collapse-item__header{
 	color: #0e4fd2;
	 font-size: 14px;
 }
</style>
<template>
 <el-card>
	<p slot="header">
		<span class="fa fa-cog"> 系统参数</span>
	</p>
	<div style="margin:0 auto; width:50%;">
		<el-collapse v-model="activeNames" @change="handleChange" accordion>
			<el-card>
				<el-collapse-item title="系统证书配置" name="1" >	       
					<el-form label-width="130px">
						<el-form-item label="上传CA根证书" >
							<el-upload
								:show-file-list = 'false'
								class="upload-demo"
								:action="state.LicenseUrl"
								:on-success="success"
								:data = "rdata"
								:on-error = 'errorInfo'>
								<el-button size="small" type="primary" style="margin-left: 20px" @click="check(0)">点击上传</el-button>
							</el-upload>
							<el-tag  class="uploadCss" :type="FormList.ca=='已上传'?'success':'warning'">{{FormList.ca?FormList.ca:'未上传'}}</el-tag>
						</el-form-item>
						<el-form-item label="上传公钥">
							<el-upload
								class="upload-demo"
								:show-file-list = 'false'
								:action="state.LicenseUrl"
								:on-success ="success"
								:data = "rdata"
								:on-error = 'errorInfo'>
								<el-button size="small" type="primary" style="margin-left: 20px" @click="check(1)">点击上传</el-button>
							</el-upload>
							<el-tag  class="uploadCss" :type="FormList.pubKey=='已上传'?'success':'warning'">{{FormList.pubKey?FormList.pubKey:'未上传'}}</el-tag>
						</el-form-item>	
						<el-form-item label="上传私钥">
							<el-upload
								class="upload-demo"
								:show-file-list = 'false'
								:action="state.LicenseUrl"
								:on-success ="success"
								:data = "rdata"
								:on-error = 'errorInfo'>
								<el-button size="small" type="primary" style="margin-left: 20px" @click="check(2)">点击上传</el-button>
							</el-upload>
							<el-tag  class="uploadCss" :type="FormList.priKey=='已上传'?'success':'warning'"  >{{FormList.priKey?FormList.priKey:'未上传'}}</el-tag>
						</el-form-item>
					</el-form>   			                
			    </el-collapse-item>
			</el-card>	
			<el-card>
				<el-collapse-item title="数据上传接口配置" name="2" >
					<el-form :model="uploadForm" label-width="130px">
						<el-form-item label="加密文件夹路径" >
							<el-input v-model="uploadForm.encryptpath" placeholder="请输入文件夹路径"></el-input>
						</el-form-item>
						<el-form-item label="不加密文件夹路径" >
							<el-input v-model="uploadForm.uncryptpath" placeholder="请输入文件夹路径"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" icon="el-icon-message" @click="savePath">保存</el-button>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-card>
			<el-card>
				<el-collapse-item title="操作日志上传接口配置" name="3" >
					<el-form :model="uploadForm" label-width="130px">
						<el-form-item label="操作日志上传路径" >
							<el-input v-model="uploadForm.logpath" placeholder="请输入操作日志上传路径"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" icon="el-icon-message" @click="savePath">保存</el-button>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-card>
			<el-card>
				<el-collapse-item title="数据上传FTP配置" name="4" >
					<el-form :model="formItem" label-width="130px" :rules="ruleInline" ref="formItem">
						<el-form-item label="服务器地址" prop="ftp_ip">
							<el-input v-model="formItem.ftp_ip" placeholder="请输入服务器地址"></el-input>
						</el-form-item>
						<el-form-item label="端口" prop="ftp_port">
							<el-input-number v-model="formItem.ftp_port"  placeholder="请输入端口号" style="width:300px"></el-input-number>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" icon="el-icon-message" @click="submitForm('formItem')">保存</el-button>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-card>
			<el-card>
				<el-collapse-item title="数据异常状态是否控制断电配置" name="5" >
					<el-form label-width="130px">
						<el-form-item label="点击勾选">
							<el-checkbox-group v-model="checkedCities">
								<el-checkbox v-for="item in cities" :label="item" :key="item">{{item}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" icon="el-icon-message" @click="saveConfig">保存</el-button>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-card> 
			<el-card>
			<el-collapse-item title="语音报警配置" name="6" >
					<el-form :model="voiceDate.v" label-width="130px">
						<el-form-item label="后台请求方式">
							<el-radio-group v-model="voiceDate.v.type">
								<el-radio :label="0">百度语音接口</el-radio>
								<el-radio :label="1">服务器合成</el-radio>
							</el-radio-group>
						</el-form-item>
						<template v-if="voiceDate.v.type === 0">
							<el-form-item label="APP_ID">
								<el-input v-model="voiceDate.v.APP_ID" placeholder="请输入AppID"></el-input>
							</el-form-item>
							<el-form-item label="API_KEY">
								<el-input v-model="voiceDate.v.API_KEY" placeholder="请输入API_KEY"></el-input>
							</el-form-item>
							<el-form-item label="SECRET_KEY">
								<el-input v-model="voiceDate.v.SECRET_KEY" placeholder="请输入SECRET_KEY"></el-input>
							</el-form-item>
							<el-form-item label="语速">
								<el-slider v-model="voiceDate.v.spd" :min="0" :max="9" show-input></el-slider>
							</el-form-item>
							<el-form-item label="音调">
								<el-slider v-model="voiceDate.v.pit" :min="0" :max="9" show-input></el-slider>
							</el-form-item>
							<el-form-item label="音量">
								<el-slider v-model="voiceDate.v.vol" :min="0" :max="15" show-input></el-slider>
							</el-form-item>
							<el-form-item label="发音人">
								<el-radio-group v-model="voiceDate.v.per">
									<el-radio :label="0">普通话女声</el-radio>
									<el-radio :label="1">普通话男声</el-radio>
									<el-radio :label="3">情感合成-度逍遥</el-radio>
									<el-radio :label="4">情感合成-度丫丫</el-radio>
								</el-radio-group>
							</el-form-item>
						</template>
						<el-form-item>
							<el-button size="small" type="primary" icon="el-icon-message" @click="saveVoiceConfig">保存</el-button>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-card>
		</el-collapse>
	</div>
 </el-card>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'

export default {
    name: 'role',
    data () {
    	const isIp = (rule, value, callback) => {
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!value) {
                    return callback(new Error('IP不能为空'));
                } else if (reg.test(value)) {
                    return callback();
                }
                callback(new Error('不符合IP格式'));
         };
         const isPort = (rule, value, callback) => {
                const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
                if (!value) {
                    return callback(new Error('端口号不能为空'));
                } else if (reg.test(value)) {
                    return callback();
                }
                callback(new Error('不符合格式'));
         };
    	return {
			voiceDate:{
				id:55,
				k: "VoiceController",
				v:{
					"type":1,// 0百度1 本地
					"APP_ID":"11820629",//App ID
					"API_KEY":"eRQQ2W2HoOhQn0Bg7muKKzVm",//Api Key
					"SECRET_KEY":"13W2XSnpHAgARQg5dTYAT5KillUgK9MV",//Secret Key
					"spd":9,//spd	语速，取值0-9，默认为5中语速
					"pit":9,//pit	音调，取值0-9，默认为5中语调
					"vol":15,//vol	音量，取值0-15，默认为5中音量
					"per":0 //per	发音人选择, 0为女声，1为男声，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女
				}
			},
			checkedCities:[],
			cities:[],
			confing:{
				id:40,
				k:"debugController",
				v:[]
			},
    		state:store.state,
    		action:store.actions,
    		editForm:['ca','pubKey','priKey'],
    		formItem:{
    			ftp_port:1,
    			ftp_ip:'',
    		},
    		FormList:{
    			ca:'',
    			pubKey:'',
    			priKey:''
    		},
    		ruleInline: {
                ftp_ip: {validator: isIp,trigger: 'blur'},
                ftp_port: {validator: isPort,trigger: 'blur'}
            },
    		rdata:{type:''},
    		uploadForm:{
    			encryptpath:'',
    			uncryptpath:'',
    			logpath:'',
    		},
    		path:[],
    		activeNames:'1'
    	}
    },
     watch:{
		// '$route': 'fecthdata',
    },
    methods: {
		getVoiceConfig(){
			api.setting.getvoiceconfig()
			.then(res => {
				if(res.data.status == 0){
					this.voiceDate.v = JSON.parse(res.data.data.v);
				}else{
					this.$message.error(res.data.msg);
				}
			})
			.catch(err => {
				this.$message.error('服务器异常！');
			})
			
		},
		saveVoiceConfig(){
			let rdata = {
				id:this.voiceDate.id,
				k:this.voiceDate.k,
				v:JSON.stringify(this.voiceDate.v)
			}
			api.setting.updatevoice(rdata)
				.then(res => {
					console.log(res)
					if(res.data.status == 0){
						this.getVoiceConfig();
						this.$message.success(res.data.msg);
					}else{
						this.$message.error(res.data.msg);
					}
				})
				.catch(err => {
					this.$message.error('服务器异常！');
				})
		},
    	fecthdata(){
			this.activeNames = this.$route.query.type + ''
		},
    	handleChange(){
    		
		},
		saveConfig(){
				let me = this;
				this.confing.v.forEach(item => {
					let result = this.checkedCities.find(label => item.name === label);
				    item.ctl = result?1:0;
				})
				let rdata = {
					id:this.confing.id,
					k:this.confing.k,
					v:JSON.stringify(this.confing.v)
				}	
				api.setting.updateConfig(rdata).then(res => {
				     	me.$message({message:'设置成功！', type:"success"})
						me.getConfig();
				})
		},
		getConfig(){
			let me = this;
			api.setting.getConfig().then(res => {
				console.log(res,'confing')
					let result = res.data.data;
					me.confing.id = result.id;
					me.confing.k = result.k;
					me.confing.v = JSON.parse(result.v);
					me.cities = [];
					me.checkedCities = [];
					me.confing.v.forEach(item => {
						me.cities.push(item.name);
						if(item.ctl === 1){
							me.checkedCities.push(item.name);
						}
					})
			})
		},
    	success(response, file, fileList){
    		if(response.status==0){
    		   this.getLicense()
	      	   this.$message({message:'上传成功!', type:"success"})
	      	} else{
	      	   this.$message.error(response.msg)
	      	}
    	},
    	errorInfo(response, file, fileList){
    		this.$message.error('上传失败!')
    	},
    	check(index){
    		this.rdata.type = this.editForm[index]
    	},
    	savePath(){
    		var vm = this
    		api.setting.fileSetting(vm.uploadForm).then(function(res){
    			console.log(res)
    			if(res.data.status==0){   	
    				vm.getpath()
    				vm.$message({message:'设置成功！', type:"success"})
    			}else{
    				vm.$message.error('设置失败!')
    			}
    		})
    	},
    	getLicense(){
    		var vm = this
    		api.setting.getKeys().then(function(res){
    			console.log(res)
    			if(res.data.status==0){
    				_.assign(vm.FormList,res.data.data) 
    			}
    		})
    	},
    	getpath(){
    		var vm = this
    		api.setting.getpath().then(function(res){
    			console.log(res)
    			if(res.data.status==0){
    				_.assign(vm.uploadForm,res.data.data)
    				vm.formItem.ftp_ip = res.data.data.ftp_ip
    				vm.formItem.ftp_port = parseInt(res.data.data.ftp_port)
    			}
    		})
    	},
    	submitForm(name){
    		this.$refs[name].validate((valid) => {
                    if (valid) { 
                    	var vm = this
    		            api.setting.fileSetting(vm.formItem).then(function(res){
    		            	if(res.data.status==0){   	
			    				vm.getpath()
			    				vm.$message({message:'设置成功！', type:"success"})
			    			}else{
			    				vm.$message.error('设置失败!')
			    			}
    		            })
                    }
          })
    	}
    },
    mounted () { 
       this.getLicense();
	   this.getpath();
	   this.getConfig();
	   this.getVoiceConfig();
    }
};
</script>