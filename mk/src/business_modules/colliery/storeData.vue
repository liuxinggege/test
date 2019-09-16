<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
	<p slot="header">
		<span class="fa fa-clone"> 数据备份</span>
	</p>
	<el-form ref="form" inline label-position="right">
		<el-form-item label="开始时间">
			<el-date-picker
				v-model="starttime"
				type="datetime"
				placeholder="选择开始时间"
				size="small" 
				align="right"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="结束时间">
			<el-date-picker
				v-model="endtime"
				type="datetime"
				placeholder="选择结束时间"
				 size="small" 
				align="right"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="">
			<el-button type="primary" size="small" @click="getLog" icon="el-icon-search">查询记录</el-button>
			<el-button type="primary" size="small" @click="autohandle" icon="el-icon-setting">自动备份</el-button>
			<el-button type="primary" size="small" @click="handle" icon="el-icon-setting">手动备份</el-button>
		</el-form-item>
		<el-form-item>
			<el-upload
				:show-file-list = 'false'
				class="upload-demo"
				:action="state.importdbUrl"
				:on-success ="success"
				:on-error = 'errorInfo'
				:on-progress = 'progress'
				>
			<el-button type="primary" size="small" icon="el-icon-upload2" style="margin-top:-20px">导入数据</el-button>
			</el-upload>
		</el-form-item>
	</el-form>
    <el-table :data="state.showlist" border stripe>
        <el-table-column prop="filename" label="文件名">
            <template scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.filename}}</el-button>
            </template>
        </el-table-column>
        <el-table-column label="文件大小">
			<template scope="scope">
				{{scope.row.size}}M
			</template>
        </el-table-column>
        <el-table-column label="文件生成时间" prop="creatTime"></el-table-column>
    </el-table>
	<my-pagination></my-pagination>
	<el-dialog :visible.sync="showLog2" title="自动备份数据" width="600px"  :append-to-body="true" :close-on-click-modal="false">
		<el-form :model="editForm2" label-width="120px">
			<el-form-item label="备份时间">
				<el-input-number v-model="editForm2.v" :min="0" :max="23" label="备份时间" size="small"></el-input-number><span>&nbsp;时</span>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" type="text" @click="showLog2=false">取消</el-button>
			<el-button size="small" type="primary"  @click="autosave">保存</el-button>
		</div>
	</el-dialog>

	<el-dialog :visible.sync="showPro" title="进行中,请稍候..." width="600px"  :append-to-body="true" :close-on-click-modal="false">
		<el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
	</el-dialog>
	<el-dialog  :visible.sync="showDate" title="选择备份日期" width="600px"  :append-to-body="true" :close-on-click-modal="false">
		选择日期: 
		<el-date-picker
			style="width: 300px;margin-left: 30px;"
			type="date"
			v-model="datailDate"
			format="yyyy-MM-dd"
			value-format="yyyy_MM_dd"
			size="small"
			placeholder="选择备份日期">
		</el-date-picker>
		<div slot="footer">
			<el-button size="small" type="text" @click="showDate=false">关闭</el-button>
			<el-button size="small" type="primary"  @click="sure">保存</el-button>
		</div>
	</el-dialog>
</el-card>
</template>
<script>
import store from 'src/store'
import api from 'src/api'

export default {
    data () {
        return {
        	showLog2:false,
        	showPro:false,
        	starttime:'',
        	endtime:'',
        	showDate:false,
        	percentage:0,
        	state:store.state,
        	action:store.actions,
        	search:{},
        	tableData:[],
        	datailDate:moment(new Date(), 'YYYY/MM/DD').format('YYYY/MM/DD'),
        	editForm2:{
        		path:'',
        		v:'',
        		path2:''
        	},
        	showLog:false,
        	showhandle:false,
        	timeout1:'',
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
        	editForm:{
        		path:'',
        		password:'',
        		starttime:''
        	},
        }
    },
    computed:{
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
    	handleClick(row){
    		//下载文件post方法filename
            var form=$("#downfile");
				if (form !== undefined) form.remove();
				form=$("<form id='downfile'>"); //定义一个form表单
				form.attr("style","display:none");
				form.attr("target","");
				form.attr("method","post");
				form.attr("action", '/coalmine/backup/download');
				var input1=$("<input>");
				input1.attr("type","hidden");
				input1.attr("name","filename");
	            input1.attr("value",row.filename);
				$("body").append(form); //将表单放置在web中
				form.append(input1);
				form.submit(); //表单提交
    	},
    	sure(){
    		if(this.showhandle){
    			this.save()
    		}
    	},
    	handle(){
    		this.showDate = true
    		this.showhandle = true
    	},
    	autohandle(){
    		this.showLog2 = true
    		api.user.getProperty().then((res) => {
    			if(res.data.status==0){
    				_.assign(this.editForm2,res.data.data)
    			}
    		})
    	},
    	success(response, file, fileList){
    		if(response.status==0){
    		   this.showPro = false
	      	   this.$message({message:'导入成功!', type:"success"})
	      	   this.getLog()
	      	} else{
	      	   this.$message.error(response.msg)
	      	}
    	},
    	errorInfo(response, file, fileList){
    		this.$message.error('导入失败!')
    		this.showPro = false
    	},
    	progress(response, file, fileList){
         	this.showPro = true
         	this.percentage = response.flag
    	},
    	save(){
    		var vm = this
		    vm.editForm.starttime = vm.datailDate
    		api.user.store(vm.editForm).then((res) => {
    			if(res.data.status==0){
    				vm.showLog = false
    				vm.showPro = true
    				vm.timeout1 = setInterval(vm.check, 1000);
    			}else{
    				vm.showLog = false
    				vm.$message.error('保存失败!')
			  }
			})
		},
		autosave(){
    		var vm = this
    		api.user.autostore(vm.editForm2).then((res) => {
    			if(res.data.status==0){
    				vm.stopCron()
    			}else{
    				vm.showLog2 = false
    				vm.$message.error('保存失败!')
			  	}
		 	})
		},
		stopCron(){
			api.user.stopCron().then((res) => {
    			if(res.data.status==0){
    				this.startCron()
    			}else{
    				this.$message.error('配置失败!')
    			}
        	})
		},
		startCron(){
			api.user.startCron().then((res) => {
    			if(res.data.status==0){
    				this.showLog2 = false
    				this.$message.success('配置成功!')
    			}else{
    				this.$message.error('配置失败!')
    			}
           	})
		},
		check() {
			var vm = this
			api.user.getProcess().then((res) => {
				if (res.data.flag == -1) {
					vm.showPro = false
					vm.$message.error('数据备份失败!')
					clearInterval(vm.timeout1)
				} else if (res.data.flag == 100 || res.data.flag == 0) {
					vm.$message.success('数据备份成功!')
					vm.showPro = false
					clearInterval(vm.timeout1)
					vm.getLog()
				}else{
					vm.percentage = res.data.flag
				}
			})
		},
		beginTime() {
			return moment(this.starttime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
		},
		endTime() {
			return moment(this.endtime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
		},
		getLog() {
			let vm = this
			vm.search.starttime = vm.beginTime()
			vm.search.endtime =  vm.endTime()
            api.user.getFiles(vm.search).then((res) => {
                if(res.data.status==0){
                    if (res.data.data && res.data.data.length) {
                        vm.tableData = res.data.data
                    } else {
						vm.$message.warning(res.data.remark)
                        vm.tableData = []
                    }
                    vm.action.setShowList(vm.tableData)
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
		},
	},
	mounted() {
	  	this.endtime = new Date();
	  	this.starttime = new Date();
	  	this.starttime.setTime(this.starttime.getTime()- 3600 * 1000 * 24 * 7);
	  	this.getLog()
    }
};
</script>
