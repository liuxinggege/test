<style type="text/css">
	.uploadCss{
	 	margin-left:0px;
	 	margin-top:5px;
	 	width: 150px;
	 }
</style>
<template>
<el-card>
	<p slot="header">
		<span class="fa fa-book"> 授权管理</span>
	</p>
	<el-row style="color:red;padding:5px 0 5px 50px">
		<span v-if="ruleForm2.ip">双机模式</span>
		<span v-if="ruleForm1.ip&&!ruleForm2.ip">单机模式</span>
	</el-row>
	<el-row :gutter="24">
		<el-col :span="11" :offset='1'>
			<el-card class="box-card">
				<div>
					<el-form :model="ruleForm1"  ref="ruleForm1" label-width="120px" style="margin-top:15px">
						<el-form-item label="主机IP：">
								{{ruleForm1.ip}}
						</el-form-item>
						<el-form-item label="硬件ID：">
								{{ruleForm1.hardid}}
						</el-form-item>
						<el-form-item label="授权状态">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm1.license)">{{ruleForm1.license==1?'已授权':'未授权'}}</el-tag>							           
						</el-form-item>
						<el-form-item label="有效期为：">
							{{ruleForm1.expiretime}}
						</el-form-item>
						<el-form-item label="模块：环境监测">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm1.mod1)">{{ruleForm1.mod1==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item label="模块：人员定位">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm1.mod2)">{{ruleForm1.mod2==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item label="模块：语音广播">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm1.mod3)">{{ruleForm1.mod3==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item label="模块：视频监控">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm1.mod4)">{{ruleForm1.mod4==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" @click="upload(0)">导入授权</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-card>
		</el-col>
		<el-col :span="11">
			<el-card class="box-card" v-if="showmodel">
				<div>
					<el-form :model="ruleForm2"  ref="ruleForm2" label-width="150px" style="margin-top:15px">
						<el-form-item label="备机IP：">
								{{ruleForm2.ip}}
						</el-form-item>
						<el-form-item label="硬件ID：">
								{{ruleForm2.hardid}}
						</el-form-item>
						<el-form-item label="授权状态">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm2.license)">{{ruleForm2.license==1?'已授权':'未授权'}}</el-tag>							           
						</el-form-item>
						<el-form-item label="有效期为：">
							{{ruleForm2.expiretime}}
						</el-form-item>
						<el-form-item label="模块：环境监测">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm2.mod1)">{{ruleForm2.mod1==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item label="模块：人员定位">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm2.mod2)">{{ruleForm2.mod2==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item label="模块：语音广播">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm2.mod3)">{{ruleForm2.mod3==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item label="模块：视频监控">
							<el-tag  class="uploadCss"  :type="checkType(ruleForm2.mod4)">{{ruleForm2.mod4==1?'有':'无'}}</el-tag>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" @click="upload(1)">导入授权</el-button>
						</el-form-item>
						</el-form>
					</div>
			</el-card>
		</el-col>
	</el-row>
	<el-dialog width="600px" :visible.sync="showop" title="导入授权码" :modal-append-to-body="false" :close-on-click-modal="false"> 
			<p style="padding:20px 0;">
				<span>机器名：</span><label style="color:red;">{{ipname}}</label>
			</p>
			<el-form label-width="80px">
					<el-form-item label="授权码">
					<el-input v-model="editForm.licenseStr" type='textarea' :autosize="{ minRows: 16}" placeholder="请输入授权码"></el-input>
				</el-form-item>
			</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showop = false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
	</el-dialog>
</el-card>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
  components: {
  },
  data () {
    return {
      state: state,
      action:actions,      
      ruleForm1:{},
      ruleForm2:{},
      showop:false,
      showmodel:false,
      editForm:{
      	licenseStr:''
      },
      ipData:[],
      ipname:''
    }
  },
  methods: {
	checkType(status){
		if(status==0){
			return 'danger'
		}else if(status==1){
			return ''
		}else{
			return 'warning'
		}
	},
	upload(index) {//导入证书时，提供对应的ip号
		this.editForm.licenseStr = ''
		this.showop = true
		this.editForm.ip = this.ipData[index]
		this.ipname = this.ipData[index]
	},
	save() {
		var vm = this;
		api.user.addLicense(vm.editForm).then(function(res) {
			console.log(res)
			vm.editForm.licenseStr = ''
			if (res.data.status == 0) {
				vm.$message({
					type: 'success',
					message: '验证通过,请重新登录!'
				})
				api.user.signout().then((res)=>{
	                if(res.data.status==0){
						vm.action.notLogin();
	                    vm.$router.push({name: 'login'});
	                }else{
	                    vm.$message.error(res.data.msg);
	                }
	            })
			} else {
				vm.$message.error(res.data.msg)
			}
		 }, function(bad) {})
	  },
	  getall(){
	  	let me = this
	  	me.ipData = []
	  	api.user.getAllFiles().then((res)=>{
			  console.log(res)
	  		if(res.data.status == 0){
	  			if(res.data.data.length==2){
	  				me.ruleForm2 = res.data.data[1]
	  				me.ipData.push(res.data.data[0].ip,res.data.data[1].ip)
	  				me.showmodel = true
	  			}else{
	  				me.ipData.push(res.data.data[0].ip)
	  				me.showmodel = false
	  			}
				me.ruleForm1 = res.data.data[0]
	  		}else{
	  			me.$message.error(res.data.msg)
	  		}
	  	})
	  }
    },
    mounted() {
		this.$nextTick(() => {
			  this.getall()	//获取机器码	  			  
		})
	}
}
</script>