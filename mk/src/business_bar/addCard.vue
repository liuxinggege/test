<style lang="less">
</style>
<template>
    <el-form :model="formItem" label-width="105px" :rules="ruleInline" ref="formItem">
		<el-form-item label="分站">
			<el-select size="small" v-model="formItem.substation_id" :disabled="!!formItem.id">
			    <el-option v-for="item in stationList" :value="item.id" :key="item.ipaddr" :label="item.station_name + ':' +item.ipaddr"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="设备地址" prop="did" v-if="!state.isedit">
			<el-input-number size="small" v-model="formItem.did" :max="255" :min="1" style="width:200px" placeholder="请输入ID" :disabled="!!formItem.id"></el-input-number>
		</el-form-item>
		<el-form-item label="设备地址" v-if="state.isedit" >
			<el-input-number size="small" v-model="formItem.cid" @blur="change" :max="255" :min="1" style="width:200px" placeholder="请输入ID" :disabled="!!formItem.id"></el-input-number>
		</el-form-item>							
		<el-form-item label="读卡器位置" prop="position">
			<el-select size="small" v-model="formItem.position" filterable allow-create  default-first-option style="width:100%;">
                 <el-option
                     v-for="item in positionList"
                     :key="item.id"
                     :label="item.v"
                     :value="item.v">
                  </el-option>
            </el-select>
		</el-form-item>
		<el-row>
			<el-col :span="12">
				<el-form-item label="X坐标" prop="x_point">
					<el-input size="small" v-model="formItem.x_point"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="Y坐标" prop="y_point">
				 <el-input size="small" v-model="formItem.y_point"></el-input>
			    </el-form-item>
			</el-col>
		</el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="">
                    <el-checkbox v-model="formItem.entrance">出入口</el-checkbox>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="">
                    <el-checkbox v-model="is_exit">是否门禁口</el-checkbox>
                </el-form-item>
            </el-col>
        </el-row>
		<el-form-item style="text-align:right;" v-if="$route.query.type=='edit'||$route.query.type=='route-edit'||$route.name=='card'">
			<el-button size="small" type="ghost" @click="backup">关闭</el-button>
			<el-button size="small" type="primary" @click="sure('formItem')" icon="el-icon-message">保存</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import api from 'src/api'
import store from 'src/store'

export default {
	props: ["formItem"],
    watch:{
       'formItem.is_exit': {
            handler: function(val) { 
                this.is_exit = !!val
            },
            deep: true
        },
    },
    data () {
        const validateCid = (rule, value, callback) => {
               if (!value) {
                    return callback(new Error('设备地址不能为空!'));
                }
                // 模拟异步验证效果
                setTimeout(() => {
                    if (!Number.isInteger(parseInt(value))) {
                        callback(new Error('请输入1~255之间的整数！'));
                    } else {
                        if (value > 255|| value < 1) {
                            callback(new Error('请输入1~255之间的整数！'));
                        } else {  
                        	var vm = this
			                   api.routeLine.validateCard({cid:value,substation_id:vm.formItem.substation_id}).then(function(res){
							         if(res.data.status==0){
							         	callback();
							         }else{
							         	callback(new Error('卡号已经存在！'))
							         }
							})
                       }
                    }
               }, 200);                        
        };
        const validateRange = (rule, value, callback) => {
        	if (!value) {
                    return callback(new Error('设备地址不能为空!'));
                }
                // 模拟异步验证效果
                setTimeout(() => {
                    if (!Number.isInteger(parseInt(value))) {
                        callback(new Error('请输入1~7之间的整数！'));
                    } else {
                        if (value > 7 || value < 1) {
                            callback(new Error('请输入1~7之间的整数！'));
                        } else {
                        	callback()
                        }
                    }
                }, 200);
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
               is_exit:false,
    		   state:store.state,
    		   actions:store.actions,
               ruleInline: {
		        did: [
		             { validator: validateCid, trigger: 'blur' }
		             ],
		        crange: [
		             { validator: validateRange, trigger: 'blur' }
		             ],
		        position:{required: true, message: '位置信息不能为空', trigger: 'change' },
		        x_point:{ validator: validateNumber, trigger: 'blur' },
		        y_point:{ validator: validateNumber, trigger: 'blur' },
		       }
    	 }
     },
    methods: {
      backup(){
            this.$emit("backup")
      },
      change(){
    	  if(this.formItem.did==this.formItem.cid){
    	  }
    	  else{
    	  	api.routeLine.validateCard({cid:this.formItem.did,substation_id:this.formItem.substation_id}).then(function(res){
				    if(res.data.status==0){
				         	
				    }else{
				       this.$message({
			              type: 'warning',
			              message: res.data.msg
			            })
				    }
				  })
    	  }
      },
      sure(name) { 
      	this.$refs[name].validate((valid) => {
      		if (valid) { 
    		var vm = this   		
    		if(vm.formItem.entrance){
    			vm.formItem.ctype = 1
    		}else{
    			vm.formItem.ctype = 0
    		}
            if(vm.is_exit){
    			vm.formItem.is_exit = 1
    		}else{
    			vm.formItem.is_exit = 0
    		}
    		if(!vm.state.isedit){
    			vm.formItem.cid = vm.formItem.did
    		}
    		vm.formItem.position_id  = 0
    		_.findIndex(vm.positionList, function(chr) {
					if(chr.v == vm.formItem.position){
						vm.formItem.position_id = chr.id
					}
			 })
    		 delete vm.formItem.isTrusted
    		 delete vm.formItem._index
    		 delete vm.formItem._rowKey
    		 delete vm.formItem.card
    		 delete vm.formItem.battary
    		 delete vm.formItem.people_num
    		 delete vm.formItem.traffic_status
    		 delete vm.formItem.k
    		 delete vm.formItem.alarm
    		 delete vm.formItem.times
    		 delete vm.formItem.emerge
    		 delete vm.formItem.now_value
    		 delete vm.formItem.statusText
    		 delete vm.formItem.now_status
    		 delete vm.formItem.debug
    		 delete vm.formItem.showColor
    		 delete vm.formItem.action_value
    		 api.routeLine.addupCard(vm.formItem).then((res) => {
	            if (res.data.status === 0) {  	 
	            	  vm.$message({
			              type: 'success',
			              message: '操作成功!'
			            })
	            	vm.actions.getCard()
	            	vm.$emit("saveDate",vm.formItem)
	            } else {
	              vm.$message.error(res.data.msg)
	            }
	        }) 
	      }
      	})
      }
    },
    mounted () {
	    this.$store.dispatch("getPosition");
	    this.$store.dispatch("getStation");
	        
    },
    computed: {        	
	     stationList(){
	         return this.$store.state.AllStation;
	     },
	    positionList(){
	        return this.$store.state.positionList;
	      }
     },
};
</script>
