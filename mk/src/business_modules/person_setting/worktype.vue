<style type="text/css">
</style>
<template>
    <el-card>
		<p slot="header">
			<span class="fa fa-group"> 工种管理</span>
			<el-button size="mini" type="primary" @click="addSure(-1)" icon="el-icon-plus" style="margin-left:30px;">新增工种</el-button>
		</p>
        
        <el-table :data="data" border>
            <el-table-column prop="name" label="工种名">
                <template scope="scope">
                    <span>{{scope.row.specia == 1?scope.row.name+'（特殊工种）':scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否为特殊工种">
                <template scope="scope">
                    <el-tag :type="scope.row.specia==1?'danger':''">{{scope.row.specia==1?'是':'否'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button @click="addSure(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="sureDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="editModal"
            title="新增/编辑工种"
            :close-on-click-modal="false"
            >
            <el-form :model="formItem" label-width="80px" :rules="ruleInline">
                <el-form-item label="工种名">
                    <el-input size="small" v-model="formItem.name"></el-input>
                </el-form-item>
                <el-form-item label="特殊工种">
                    <el-checkbox v-model="checked"></el-checkbox> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'

export default {
    name: 'role',
    data () {
    	return {
    		id:'',
            checked:false,
    		editModal:false,
    		store:{},
    		formItem:{
    			name:'',
                specia:''
    		},
		    ruleInline: {
		        name: [
		            { required: true, message: '不能为空', trigger: 'blur' },
		         ]
		    },
            data: []               
    	}
    },
    methods: {
    	getWorkType(){
    		var vm = this
    		api.routeLine.getWorkType().then(function(res){
    			vm.data = res.data.data
    		})
    	},
    	sureDelete(id){
    		this.$confirm('请确认是否删除本条记录？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	        api.routeLine.delWorkType({
	          id: id
	        }).then((res) => {
	          if (res.data.status === 0) {
	            this.$message({
	              type: 'success',
	              message: '删除成功!'
	            })
	            this.store.id = ''
	            this.getWorkType()
	          } else {
	            this.$message({
	              type: 'error',
	              message: res.data.msg
	            })
	          }
	        }, () => {})
	      }).catch(() => {
	      	this.store.id = ''
	      })
    	},
	    addSure(ob){
            let row = JSON.parse(JSON.stringify(ob))
	    	if(row == -1){
              this.formItem = {}
              this.checked = false
	    	}else{
              this.formItem = row
              this.formItem.specia == 1?this.checked =true:this.checked = false
            }
            this.editModal = true
	    },
    	sure() {   
    		var vm = this
            vm.checked ? vm.formItem.specia = 1 : vm.formItem.specia = 2
            delete vm.formItem._index
            delete vm.formItem._rowKey
    		api.routeLine.addWorkType(vm.formItem).then((res) => {
	            if (res.data.status === 0) {  
	            	vm.dialogVisible = false
	            	vm.getWorkType()
	            } else {
	              vm.$message.error(res.data.msg)
	            }
	       }, () => {})
	    }
    },
    mounted () {
       this.getWorkType();
    }
};
</script>