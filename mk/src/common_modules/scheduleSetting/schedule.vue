<style type="text/css">
	/* .ivu-modal-footer{
		display: block !important;
	} */
</style>
<template>
    <el-card>
		<p slot="header">
			<span class="fa fa-newspaper-o"> 班次配置</span>
       		<el-button size="mini" type="primary" @click="addSure(-1)" icon="el-icon-plus" style="margin-left: 30px">新增班次</el-button>
		</p>
        <el-table :data="data" border >
            <el-table-column label="工种时间" prop="week"></el-table-column>
            <el-table-column label="时间段" prop="dayrange"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="sureDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="editModal"
			:append-to-body="true" 
			:close-on-click-modal="false"
            title="新增/编辑班次"
            width="600px">
            <el-form :model="formItem" label-width="80px" :rules="ruleInline">
                <el-form-item label="工作时间">
                    <el-select v-model="week" multiple placeholder="请选择" style="width: 450px">
                        <el-option
                          v-for="item in weeklist"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间段">
                    <el-time-picker style="width: 450px"
                        is-range
                        v-model="value4"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModal = false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </div>
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
    		store:{},
    		weeklist:[
    		{
    			id:1,
    			name:'周一'
    		},
    		{
    			id:2,
    			name:'周二'
    		},
    		{
    			id:3,
    			name:'周三'
    		},
    		{
    			id:4,
    			name:'周四'
    		},
    		{
    			id:5,
    			name:'周五'
    		},
    		{
    			id:6,
    			name:'周六'
    		},
    		{
    			id:7,
    			name:'周七'
    		}],
    		week:[],
    		editModal:false,
    		value4: [new Date(2016, 9, 10, 9, 0), new Date(2016, 9, 10, 17, 0)],
    		state:store.state,
    		action: store.actions,
    		formItem:{
    			week:'',
    			dayrange:''
    		},
            data: []               
    	}
    },
    methods: {
    	getSchedule(){
    		var vm = this
    		api.routeLine.getSchedule().then(function(res){
                if(res.data.status==0){
                    vm.data = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
    		})
    	},
    	getStr(arr){
            return arr.map((item) => {
                return item
            }).join(",")
        },
    	sureDelete(id){
    		this.$confirm('请确认是否删除本条记录？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	        api.routeLine.delSchedule(id).then((res) => {
	          if (res.data.status === 0) {
	            this.$message({
	              type: 'success',
	              message: '删除成功!'
	            })
	            this.store.id = ''
	            this.getSchedule()
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
	    addSure(row){
            this.formItem = {}
            this.editModal = true
	    },
	    beginTime () {
	      return moment(this.value4[0], 'YYYY/MM/DD').format('HH:mm:ss')
	    },     
	    endTime () {
	      return moment(this.value4[1], 'YYYY/MM/DD').format('HH:mm:ss')
	    },
    	sure() {   
    		var vm = this
    		vm.formItem.week = vm.getStr(vm.week)
    		if(vm.value4[0]){
    		   vm.formItem.dayrange = vm.beginTime()+'-'+vm.endTime()
    		}
            delete vm.formItem._index
            delete vm.formItem._rowKey
    		api.routeLine.addSchedule(vm.formItem).then((res) => {
	            if (res.data.status === 0) {  
	            	vm.editModal = false
	            	vm.getSchedule()
	            } else {
	              vm.$message.error(res.data.msg)
	            }
	       }, () => {})
	    }
    },
    mounted () {
       this.getSchedule();
    }
};
</script>