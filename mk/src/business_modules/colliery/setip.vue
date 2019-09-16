<style>
	.ipbody{
		width: 100%;
		height: 400px;
		padding-right: 200px;
		box-sizing: border-box;
	}
</style>
<template>
	<el-card v-loading="loading" element-loading-text="服务正在重启中,请稍等5分钟...">
	<p slot="header">
		<span class="fa fa-edit"> IP地址配置</span>
	</p>
	<el-row style="margin-bottom: 20px">
		<el-col>
			<el-radio v-model="radio" label="true">单机模式</el-radio>
  			<el-radio v-model="radio" label="false">双机模式</el-radio>
		</el-col>
	</el-row>
	<el-row>
        <el-col :span="12">
			<el-card class="box-card">
				<div slot="header" style="text-align: center;">
					<span>{{radio == 'true'?'单机模式':'双机模式'}}</span>
				</div>
				<div class="ipbody">
					<el-form ref="ipform" :model="ipform" :rules="ruleInline" label-width="100px">
						<el-form-item label="主机IP" prop="ip">
			    			<el-input v-model="ipform.ip"></el-input>
			  			</el-form-item>
			  			<el-form-item label="子网掩码">
			    			<el-input v-model="ipform.netmask"></el-input>
			  			</el-form-item>
			  			<el-form-item label="网关">
			    			<el-input v-model="ipform.gateway"></el-input>
			  			</el-form-item>
			  			<el-form-item label="DNS">
			    			<el-input v-model="ipform.dns"></el-input>
			  			</el-form-item>
			  			<el-form-item v-if="radio == 'false'" label="备机IP" prop="peerip">
			    			<el-input v-model="ipform.peerip"></el-input>
			  			</el-form-item>
			  			<el-form-item v-if="radio == 'false'" label="虚拟IP" prop="vip">
			    			<el-input v-model="ipform.vip"></el-input>
			  			</el-form-item>
					</el-form>	
				</div>
				<el-row type="flex" justify="center">
					<el-col :span="6">
                    	<el-button @click="addSure('ipform')" type="primary" size="small">确定</el-button>
                    </el-col>
                </el-row>
			</el-card>
		</el-col>
	</el-row>
</el-card>
</template>

<script>
	import _ from 'lodash'
	import api from 'src/api'

	var timeout = null;
	export default {
		data() {
			var checkIp = (rule,value,callback)=>{
				if(value === undefined){
					callback(new Error('请输入ip，不能为空！'))
				}
				var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
				if(reg.test(value)===false){
					callback(new Error('ip格式不正确！请重新输入'))
				}else{
					callback()
				}
			}
			return {
				radio:"true",
				ipform:{
					dns:'',
					gateway:'',
					ip:'',
					netmask:'',
					peerip:'',
					standalone:'',
					vip:''
				},
				ruleInline:{
					ip:[
						{validator:checkIp,trigger:'blur'}
					],
					peerip:[
						{validator:checkIp,trigger:'blur'}
					],
					vip:[
						{validator:checkIp,trigger:'blur'}
					]
				},
				tcp:'',
				loading:false,
			}
		},
		methods: {
			// 修改ip
			addSure(name){
            	this.$refs[name].validate((valid) => {
            		if (valid) {
				 		let vm = this;
            			vm.ipform.standalone = vm.radio
            			vm.$confirm('是否确定修改此配置？', '提示', {
		                    confirmButtonText: '确定',
		                    cancelButtonText: '取消',
		                    type: 'warning'
		                }).then(() => {
							vm.loading = true
							api.role.updateProper(vm.ipform).then((res)=>{
								if(res.data.status ==0){
									if(vm.tcp == vm.ipform.ip){//判断是否修改了IP，修改了要重启服务
										vm.getip()
										vm.$message.success('修改成功')
										vm.loading = false
									}else{
										timeout = setTimeout(()=>{
											let url = 'http://' +vm.ipform.ip+':8080'
											window.location.href = url
											vm.loading = false
										},1000*60*5)
									}
								}
							})
		                }).catch(() => {
		                    vm.$message({
		                        type: 'warning',
		                        message: '操作已取消'
		                    });          
		                });
            		}else{
	                  vm.$message.error('操作失败！')
            		}
            	})
			},
			getip(){
				api.role.getProper().then((res)=>{
					if(res.data.status ==0){
						this.ipform = res.data.data
						this.radio = res.data.data['standalone']
						this.tcp = res.data.data['ip']
					}else{
						this.$message.error(res.data.msg)
					}
				})
			}
		},
		mounted(){
			this.getip()
		},
		beforeDestroy(){
			clearTimeout(timeout)
		}
	};
</script>
