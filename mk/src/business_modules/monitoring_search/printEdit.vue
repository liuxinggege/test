<style>
</style>
<template>
<el-card>
	<p slot="header">
		<span class="fa fa-edit"> 打印编辑</span>
	</p>
	<el-row>
		<el-col :span="14" :offset="5">
			<el-card class="box-card">
				<p slot="header">表头</p>
				<el-form label-width="150px">
					<el-form-item label="选择打印时间格式" >
						<el-select v-model="rdata.dates" @change="saveRule" placeholder="请选择" size="small">
							<el-option
								v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									{{item.label}}
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card class="box-card">
				<p slot="header">表尾</p>                     	
				<el-table
						:data="tabledata"
						border
						stripe>
						<el-table-column label="显示内容">
							<template scope="scope">
							<el-tag v-if="scope.row.list[0].rules.length" style="margin-right: 10px"
								:key="tag.ruleDev"
								v-for="tag in scope.row.list[0].rules"
								:disable-transitions="false"
								>
								{{tag.ruleDev}}
							</el-tag> 
							<el-button size="small" type="text" icon="el-icon-plus" class="button-new-tag" @click="addup" style="width: 200px;" v-if="!scope.row.list[0].rules.length">添加内容</el-button>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" >
							<template scope="scope" v-if="scope.row.list[0].rules.length">
								<el-button type="text" @click="deletes(scope.row)" style="margin-right: 25px">删除</el-button>
								<el-button type="text" @click="edits(scope.row)">编辑</el-button>
								</template>
						</el-table-column>
				</el-table>
			</el-card>
			<el-card class="box-card">
				<p slot="header">定时打印</p>
				<el-form label-width="150px">
					<el-form-item label="选择定时打印时间" >
						<el-time-picker
						 	size="small"
							v-model="printTime"
							:picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
							:clearable="false"
							value-format="HH:mm:ss"
							@change="saveRule">
						</el-time-picker>
					</el-form-item>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
	<el-dialog  :visible.sync="ruleShow" :title="showtext" width="600px"  :append-to-body="true" :close-on-click-modal="false">
		<el-form  :model="rdata" label-width="80px">
				<el-form-item :label="'内容'+(findex+1)" v-for="(f,findex) in rdata.rules" v-if="rdata.rules.length">
					<el-row :gutter="21">
						<el-col :span="3">
							
						</el-col>
						<el-col :span="16">
							<el-input  v-model="f.ruleDev" size="small" :style="{marginLeft:showdel?'-40px':'-3px'}"></el-input>
						</el-col>
						<el-col :span="2" v-if="showedit">
							<el-button size="small" class="button-new-tag" @click="reduceRule(findex)">-</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item v-if="rdata.rules&&!rdata.rules.length">
					<p>还没有配置任何内容!</p>
				</el-form-item>
				<el-form-item v-if="showedit">
					<el-button size="small" class="button-new-tag" @click="addRule">+ 添加内容</el-button>
				</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" type="text"  @click="cancel">取消</el-button>	
			<el-button size="small" type="primary"  @click="saveRule">确定</el-button>	
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
    		state:store.state,
    		action:store.actions,
    		tabledata:[],
    		rdata:{
    			dates:'',
    			rules:[]
    		},
    		showedit:false,
    		showdel:false,
    		showtext:'',
    		ruleShow:false,
    		rulelist:[],
    		checkid:'',
    		printTime:'',
    		options:[
	    		{
	    			label:'YYYY-MM-DD HH:mm:ss',
	    			value:1
	    		},
	    		{
	    			label:'YYYY/MM/DD HH:mm:ss',
	    			value:2
	    		},
    		]
    	}
    },
     watch:{
		'$route': 'fecthdata',
    },
    methods: {
    	saveRule(){   		
    		var list = []
    		list.push(this.rdata)
    		console.log(list)
    		var vm = this
				api.user.editorAdd({list:list,type:'print',id:vm.checkid,times:vm.printTime}).then(function(res) {
					console.log(res)
					if(res.data.status==0){
						vm.$message({
		                    type: 'success',
		                    message: '操作成功!'
		                });
		                vm.ruleShow = false
		                vm.getInfo()
					}else{
						vm.$message.error('操作失败!')
					}
			})
    	},
    	cancel(){
    		this.ruleShow = false
    		this.getInfo()
    	},
    	getInfo(){
    		var vm = this
            api.user.editorGet({type:'print'}).then(function(res) {
				console.log(res)
				if(res.data.status==0){						
					if(res.data.data){
						vm.checkid = res.data.data.id
						vm.tabledata = []
						vm.tabledata.push(res.data.data)
						vm.printTime = res.data.data.times//定时打印时间
						_.assign(vm.rdata,res.data.data.list[0])
					}else{
						vm.tabledata = []
						var list = [{
							rules:[],
							dates:'',
						}]
						vm.tabledata.push({list:list})
						vm.rdata.dates = ''
					}
				}
			})
    	},
    	addup(){
    		this.ruleShow = true
    		this.showedit = true
    		this.showdel = false
    		this.$set(this.rdata, 'rules', this.rdata.rules)
    		this.rdata.rules = []
    		this.rdata.rules.push({
    			ruleDev:''
    		})
    		this.showtext = '添加显示内容'
    	},
    	reduceRule(index){
    		this.rdata.rules.splice(this.rdata.rules.indexOf(index), 1)
    	},
    	addRule(){    		
    		this.rdata.rules.push({
    			ruleDev:''
    		})
    		console.log(this.tabledata)
    	},
    	edits(row){
    		console.log(row)
    		this.rdata.rules = row.list[0].rules
    		this.showtext = '编辑显示内容'
    		this.ruleShow = true
    		this.showedit = true
    	},
    	deletes(row){
    		this.$confirm('请确认是否删除所有显示内容?', '提示', {
		        confirmButtonText: '确定',
		        cancelButtonText: '取消',
		        type: 'warning'
		    }).then(() => {
		    	 var vm = this
		    	 //console.log(11)
	    		 api.user.deleteRule(row.id).then(function(res) {
					console.log(res)
					if(res.data.status==0){
						vm.getInfo()
					}
			     })
    		}).catch(() => {		      	 
		    })		    
    	}
    },
    mounted () { 
       this.getInfo()
    }
};
</script>