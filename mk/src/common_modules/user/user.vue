<template>
	<el-card>
		 <p slot="header">
        <span class="fa fa-user-plus"> 用户管理</span>
				<el-button size="mini" type="primary" @click="edit(-1)" icon="el-icon-plus" style="margin-left:30px;">新增用户</el-button>
		 </p>	
		<el-table :data="data" stripe  border>
    		<el-table-column label="用户名" prop="name"></el-table-column>
    		<el-table-column label="角色名" prop="roleName"></el-table-column>
    		<el-table-column label="操作">
      			<template scope="scope">
      				<div v-if="scope.row.roleName!=='超级管理员'">
			      		<el-button size="small" type="text" @click="edit(scope.row)">编辑</el-button>
			        	<el-button size="small" type="text" @click="deluser(scope.row.id)">删除</el-button>
      				</div>
      			</template>
    		</el-table-column>
  		</el-table>

			<el-dialog
				title="新增用户"
				:visible.sync="editModal"
				 :append-to-body="true" 
				 :close-on-click-modal="false"
				width="30%">
				<el-form :model="formItem" label-width="80px">
					<el-form-item label="用户名">
						<el-input size="small" v-model="formItem.name"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input size="small" v-model="formItem.password"></el-input>
					</el-form-item>
					<el-form-item label="选择角色">
						<el-select size="small" v-model="formItem.role_id">
								<el-option v-for="item in roleList" :value="item.id" :key="item.name" :label="item.name"></el-option>
						</el-select>
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
	import _ from 'lodash'
	
	export default {
		name: 'role',
		data() {
			return {
				editModal: false,
				formItem: {
					name: '',
					role_id: '',
					password:''
				},
				roleList:[],
				data: []
			}
		},
		methods: {
			getUser() {
				var vm = this
				api.user.all().then(function(res) {
					console.log(res)
					vm.data = res.data.userlist
					
				})
			},
			edit: function (row) {
		    	this.editModal = true
		    	if (row === -1){
		    	  this.formItem = {
			        name: '',
		            role_id: ''
		    	  }
		    	} else{
		           this.formItem.name = row.name
		           this.formItem.password = row.password
		           this.formItem.role_id = row.role_id
		           this.formItem.id = row.id
		       }
		    },
			deluser (id) {
		      this.$confirm('请确认是否删除本条记录?', '提示', {
		        confirmButtonText: '确定',
		        cancelButtonText: '取消',
		        type: 'warning'
		      }).then(() => {
		        api.user.del({
		          id: id
		        }).then((res) => {
		          console.log(res)
		          if (res.data.status === 0) {
		            this.$message({
		              type: 'success',
		              message: '删除成功!'
		            })
		            this.getUser()
		          } else {
		            this.$message({
		              type: 'warning',
		              message: res.data.msg
		            })
		          }
		        }, () => {})
		      }).catch(() => {
		      })
		    },
			sure() {
	          api.user.addup(this.formItem).then((res) => {
	            console.log(res)
	            if (res.data.status === 0) {
	              this.adduserDialog = false
		            this.$message({
		              type: 'success',
		              message: '操作成功!'
		            })              
								this.getUser()
								this.editModal = false
	            } else {
	              this.$message.error(res.data.msg)
	            }
	          }, () => {})
			},
			getRole(){
	    		var vm = this
	    		api.role.getAll().then(function(res){
	    			vm.roleList = res.data.res
	    		})
	    	},
		},
		mounted() {
			this.getUser();
			this.getRole();//不同用户通过角色来分配权限
		}
	};
</script>