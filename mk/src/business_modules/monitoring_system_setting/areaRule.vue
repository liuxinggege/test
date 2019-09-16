<style>
</style>
<template>
    <el-card>
    	<p slot="header">
			<span class="fa fa-cog"> 区域规则配置</span>
			<el-button size="mini" type="primary" @click="addtype" icon="el-icon-plus" style="margin-left:30px;">新增区域规则</el-button> 
        </p>	
       	<print-info :headlist="headlist" :dataList="state.showlist" @backup="backup" v-loading="loading" element-loading-text="加载中..."></print-info>
        <my-pagination></my-pagination>
        <el-dialog :visible.sync="ruleShow" width="600px" :close-on-click-modal='false' title="新增/编辑区域规则">
      	    <el-form  :model="formData" ref="formData" label-width="120px">
	      	 	<el-form-item label="区域/设施类型">
	      	 		<el-input size="small" v-model="formData.area_type"></el-input>
				</el-form-item>
				<el-form-item label="位置类型">
                  <el-select size="small" v-model="areapos"  filterable multiple style="width: 100%">
                    <el-option
                      v-for="item in PosTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary"  @click="saveRule" style="float: right;">确定</el-button>
					<el-button size="small" @click="cancel" style="float: right;margin-right:15px">取消</el-button>				            
			     </el-form-item>
		    </el-form>
        </el-dialog>
    </el-card>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'
import printInfo from '../../business_bar/printInfo'

export default {
    name: 'role',
    components: {
    	printInfo
    },
    data () {
    	return {
    		ruleShow:false,
    		loading:false,
    		state:store.state,
    		action:store.actions,
    		tableData:[],
    		areapos:[],
    		headlist:[
    		{
    			key:'area_type',
    			title:'区域/设施类型'
    		},
    		{
    			key:'name',
    			title:'位置类型',
    			rowspan:true
    		},
    		{
    			key:'path',
    			title:'示意图',
    			width:450
    		},
    		{
    			key:'action2',
    			title:'操作',
    			width:250
    		}],
    		formData:{
    			area_type:''
    		},
    	}
    },
    watch: {
            '$route': 'fetchData',
            'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.tableData)
		      },
		      deep: true
		    },
    },
    methods: {
    	getRule(){
    		var vm = this  
    		vm.loading = true
    		api.setting.getRule({type_id:0,area_type_id:0}).then(function(res) {
    			if(res.data.status==0){
    				vm.loading = false
	    			vm.tableData = res.data.data
	    			vm.action.setShowList(vm.tableData)
    			}else{
    				vm.loading = false
    			}
    		})
    	},
    	addtype(){
    		this.formData.area_type = ''
            this.areapos = []
    		this.ruleShow = true
    	},
    	backup(){
    		this.getRule()
    	},
    	cancel(){
    		this.ruleShow = false
    		if(this.$route.query.id){
	    		this.$router.push({
					name: 'areaRule'
				})
    		}
    	},
    	getPosType(){
    		var vm = this
    	    api.gas.getAllPosType().then(function(res){
	       	 	  if(res.data.status==0&&res.data.data.length){
	       	 	  	  vm.PosTypeList = res.data.data
	       	 	  	   if(vm.$route.query.id){
				       	  vm.ruleShow = true
				       	  vm.formData.area_type = vm.$route.query.name
				       	  vm.formData.area_type_id = vm.$route.query.id
				       }
	       	 	  }
       	   })
        },
    	saveRule(){ 
    		this.formData.list = []
    		_.forEach(this.areapos,(m) => {
    			this.formData.list.push({
    				pos_type_id:m
    			})
    		})     		
    		if(!this.formData.area_type_id){
    			this.formData.type_id = 0
    		}
    		var vm = this
    		api.setting.addRule(vm.formData).then(function(res) {
    			if(res.data.status==0){
    				vm.getRule()
    				vm.$message.success('操作成功!')
    				vm.ruleShow = false
    				if(vm.$route.query.id){
    					vm.$router.push({
					 		name: 'areaRule'
					 	})
    				}
    			}else{
    				vm.$message.error(res.data.msg)
    			}
    		})
    	}
    },
    mounted () {        
       this.getPosType() 
       this.getRule()      
    }
};
</script>