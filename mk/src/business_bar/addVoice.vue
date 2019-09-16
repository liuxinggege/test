<style lang="less">
</style>
<template>
    <el-form :model="formItem" label-width="100px" :rules="ruleInline" ref="formItem">
        <el-form-item label="分站" prop="stationId">
            <el-select v-model="formItem.stationId" :disabled="hiddenEdit" size="small">
                <el-option v-for="item in allStation" :value="item.id" :key="item.ipaddr" :label="item.station_name + ':' + item.ipaddr"></el-option>
            </el-select>
        </el-form-item>  
        <el-form-item label="广播分站ID" prop="radioId">
              <el-input-number v-model="formItem.radioId" :max="255" :min="1" size="small" :disabled="hiddenEdit"></el-input-number>
        </el-form-item>
        <el-form-item label="广播站名称" prop="name">
             <el-input v-model="formItem.name" size="small" :readonly="hiddenEdit"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position">
            <el-select  v-model="formItem.position" size="small" :disabled="hiddenEdit" filterable allow-create  default-first-option style="width: 100%">
                <el-option
                    v-for="item in allPosition"
                    :key="item.id"
                    :label="item.v"
                    :value="item.v">
                </el-option>
            </el-select> 
        </el-form-item>
        <el-row>
    		<el-col :span="12">
    			<el-form-item label="X坐标" prop="x_point">
    				<el-input size="small" v-model="formItem.x_point" :readonly="hiddenEdit"></el-input>
    			</el-form-item>
    		</el-col>
    		<el-col :span="12">
    			<el-form-item label="Y坐标" prop="y_point">
    			    <el-input size="small" v-model="formItem.y_point" :readonly="hiddenEdit"></el-input>
    		    </el-form-item>
    		</el-col>
	    </el-row>
        <el-form-item style="text-align:right;" v-if="!hiddenEdit">
            <el-button size="small" @click="backup">取消</el-button>
            <el-button size="small" icon="el-icon-message" type="primary" @click="handleSubmit('formItem')" style="margin-right:15px;">保存</el-button>
        </el-form-item>      
    </el-form>
</template>

<script>
import api from 'src/api'
import store from 'src/store'    
	export default {
    	props: ["formItem",'hiddenEdit'],
    	data () {
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
          ruleInline: {
                stationId:{required: true, message: '不能为空', trigger: 'change'},
                  radioId:{required: true, message: '不能为空', trigger: 'change'},
                 position:{required: true, message: '不能为空', trigger: 'change'},
                  x_point:{validator:validateNumber, trigger: 'blur'},
                  y_point:{validator:validateNumber, trigger: 'blur'}
          }, 
          allStation:[],
          allPosition:[],  
          state:store.state
      	}
    },
    
    methods: {
        otherData(){
            let me = this
            api.switchs.getStation().then((res)=>{
                if(res.data.status==0){
                    me.allStation = res.data.data
                }
            })
            api.gas.getAllPosition().then(function(res){
                if(res.data.status==0){
                    me.allPosition = res.data.data
                }
            })
        },
        handleSubmit(name) { 
            this.$refs[name].validate((valid) => {
        	   if(valid){
                    delete this.formItem.now_status
                    delete this.formItem.now_value
                    delete this.formItem.k
                    delete this.formItem.debug
                    delete this.formItem.showColor
                    delete this.formItem.statusText
                    delete this.formItem.action_value
                    if(!this.formItem.id){
                        this.formItem.controlmode = 0;
                    }
                    this.$emit('saveVoice',this.formItem)
                }else{
                    this.$message.error('操作失败！')
                }
            })
        },
        backup(){
           this.$emit("backup") 
        },
    },
    mounted () {  
      this.otherData()
    },
    watch:{
    }
};
</script>