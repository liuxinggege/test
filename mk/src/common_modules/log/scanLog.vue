<style>	
</style>
<template>
<el-card style="min-height:400px;">  
	<p slot="header">
		<span class="fa fa-list-alt"> 操作日志</span>
	</p>  
	<el-form ref="form" :model="form" :inline="true" label-position="right">
			<el-form-item label="开始时间" >
				    <el-date-picker
						v-model="starttime"
						type="datetime"
						placeholder="选择开始时间"
						 size="small" 
						align="right"
						:picker-options="pickerOptions">
					</el-date-picker>
			</el-form-item> 
			<el-form-item label="结束时间" >
				 <el-date-picker
					v-model="endtime"
					type="datetime"
					placeholder="选择结束时间"
					 size="small" 
					align="right"
					:picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="操作类型" >
				<el-select v-model="search.pname" filterable clearable placeholder="选择操作类型" size="small">
				<el-option  v-for="item in typeList"
					:label="item.pname"
					:value="item.pname"
					:key="item.id">{{item.pname}}
				</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" >
				<el-button type="primary" icon="el-icon-search" @click="getAll(0,state.listinfo.numperPage)" size="small">查询</el-button>
				<el-button type="primary" icon="el-icon-circle-close" @click="reset" size="small">重置</el-button>
				<el-upload style="margin-left:200px;margin-top:-40px"
						class="upload-demo"
						:file-list="fileList0"
						action="/coalmine/file/logUpload"
						:on-success ="success"
						:on-error = 'errorInfo'
						>
						<el-button size="small" type="primary" icon="el-icon-upload">上传日志</el-button>
				</el-upload>		            	
			</el-form-item>
	</el-form>    
	<el-table :data="state.showlist"  border>
	    <el-table-column  v-for="item in columns" :label="item.title" :prop="item.key">
			<template scope="scope">
				<div 
					v-if="item.key == 'remark'&&scope.row.remark!=null && scope.row.remark.length>2" 
					@click="showdetail(scope.row)" 
					style="color:rgb(32,160,255);cursor: pointer;">
					{{scope.row.remark.length<36?scope.row.remark:scope.row.remark.substring(0,35)+'...'}}
				</div>
				<span v-else>{{scope.row[item.key]}}</span>
			</template>
		</el-table-column>
	</el-table>
	<my-pagination></my-pagination>
	<el-dialog :visible.sync="showop" width="30%" title="操作详情"  :append-to-body="true" :close-on-click-modal="false">
			<div>
				<div style="display: flex;flex-direction: row;margin-bottom:10px;margin-top:5px">	         		
						<div>操作人：<span class="redword">{{user.userName}}</span></div>&nbsp;&nbsp;
						<div>描述：<span class="redword">{{user.operation}}</span></div>&nbsp;&nbsp;
						<div>时间：<span class="redword">{{user.log_time}}</span></div>&nbsp;&nbsp;
				</div>
				<el-input  v-model="user.remark" type="textarea"  :autosize="true">{{user.remark}}</el-input>
			</div>
			<div slot="footer">
				<el-button type="primary" @click="showop=false;">关闭</el-button>
			</div>
	</el-dialog>
</el-card>
</template>

<script>
import api from 'src/api'
import _ from 'lodash'
import moment from 'moment'
import store from 'src/store'
export default {
    name: 'scanLog',
    data () {
    	return {
    		form:{
    			date:''
    		},
    		fileList0:[],
    		search: {
	      	  name: '',
	      	  starttime: '',
	      	  endtime: '',
	      	  pname:''
	        },
	        user:{
	        	userName:'',
	        	operation:'',
	        	log_time:'',
	        	remark:''
	        },
	        starttime:'',
	        showop:false,
	        excelFileName:'',
	        endtime:'',
	        typeList:[],
	        state: store.state,
	        action: store.actions,
	        username:'',
			orderlist:[],
			pickerOptions: {
				shortcuts: [
					{
						text: '今天',
						onClick(picker) {
						picker.$emit('pick', new Date());
						}
					}, 
					{
						text: '昨天',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24);
						picker.$emit('pick', date);
						}
					}, 
					{
						text: '一周前',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', date);
					}
				}]
			},
            columns: [
				{title: '操作人',key: 'userName'},
				{title: '日志描述',key: 'operation'}, 
				{title: 'IP',key: 'ip'},
				{title: '操作时间',key: 'log_time'},
				{title: '详情',key: 'remark'}
			]            
    	}
    },
    computed: {
    },
  watch: {
    '$route': 'fetchData',
       'state.listinfo.currentPage' : {
		    handler: function (newValue, oldValue) {
		      console.log('page',newValue)
		      this.getAll(newValue-1,this.state.listinfo.numperPage)
		   },
		   deep: true
		},
		'state.listinfo.numperPage' : {
		    handler: function (newValue, oldValue) {
		       console.log('rows',newValue)
		       this.getAll(this.state.listinfo.currentPage-1,newValue)
		   },
		      deep: true
		},
  },
    methods: {
    	success(response, file, fileList){
    		if(response.status==0){
    		   this.$message.success('上传成功!')    	   
	      	} else{
	      	   this.$message.error(response.msg)
	      	}
    	},
    	errorInfo(response, file, fileList){
    		this.$message.error('上传失败!')
		},
    	showdetail(ob){
    		this.showop = true
    		_.assign(this.user,ob)
    	},
    	getTypeList(){
    		api.user.getLogtype(this.search).then((res) => {
    			this.typeList = res.data.data
    		})
    	},
    	getAll(page,rows) {
	  		this.search.name = this.username;
	  		this.search.starttime = this.beginTime();
			this.search.endtime = this.endTime();  
	        this.search.cur_page = page >=0 ? page : (this.state.listinfo.currentPage - 1);
			this.search.page_rows = rows || (this.state.listinfo.numperPage);
			
	        api.user.getAllLog(this.search).then((res) => {
				if (res.data.status === 0) {
					if(res.data.data.list && res.data.data.list.length) {
						this.orderlist = res.data.data.list;
					} else{
						this.orderlist = []
					}

					this.action.setCutList(this.orderlist,res.data.data.total,res.data.data.pageNum)
					// console.log(res.data.data,this.orderlist,res.data.total,res.data.pageNum,this.state.showlist)
				} else {
					this.$message.error(res.data.msg)
				}
	       })
	  	},
	    beginTime () {
	      return moment(this.starttime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
	    },
	    endTime () {
	      return moment(this.endtime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
	    },    
	    reset(){
	    	this.username = '';
	    	this.starttime = '';
	        this.endtime = '';
	    },
    },
    mounted () {	
         this.getAll(0,this.state.listinfo.numperPage);
         this.getTypeList()//分为不同类型的操作日志
    },
    created () {
    	this.endtime = new Date();
	    this.starttime = new Date();
	    this.starttime.setTime(this.starttime.getTime()- 3600 * 1000 * 24 * 1);
    }
};
</script>