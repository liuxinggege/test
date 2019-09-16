<style lang="less">
    @import '../../styles/common.less'; 
	.el-upload-list--picture .el-upload-list__item-thumbnail{
		width: 200px !important;
		height: 220px !important;
		margin-top: -80px !important;        	   
	}
	.text{
		float: right;
		margin:5px 10px;
	}
</style>
<template> 
<el-card>
	<p slot="header">
		<span class="fa fa-cloud-upload"> 模拟图上传</span>
	</p>
	<el-row >
		<el-col :span="7" :offset='1'>
			<el-card class="box-card">
					<div slot="header" class="clearfix">	
						<span>监控系统模拟图</span>
					</div>
					<div>
						<el-upload 
							class="upload-demo"
							drag
							:data = "rdata1"
							:on-success ="success"
							:file-list="fileList0"
							:on-error = 'errorInfo'
							list-type="picture"
							:action="this.state.uploadUrl"
							multiple>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将<em>监控系统图纸文件</em>拖到此处，或<em>点击上传</em></div>
							<!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</div>
			</el-card>
		</el-col>
		<el-col :span="7" :offset='1'>
			<el-card class="box-card">
					<div slot="header" class="clearfix">	
						<span>瓦斯抽放系统模拟图</span>
					</div>
				<div>
				<el-upload 
					class="upload-demo"
					drag
					:data = "rdata2"
					:on-success ="success"
					:file-list="fileList1"
					:on-error = 'errorInfo'
					list-type="picture"
					:action="this.state.uploadUrl"
					multiple>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将<em>瓦斯抽放系统图纸文件</em>拖到此处，或<em>点击上传</em></div>
					<!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
				</el-upload>
				</div>
			</el-card>
		</el-col>
		<el-col :span="7" :offset='1'>
			<el-card class="box-card">
					<div slot="header" class="clearfix">	
						<span>通风系统模拟图</span>
					</div>
				<div>
					<el-upload 
						class="upload-demo"
						drag
						:data = "rdata3"
						:on-success ="success"
						:file-list="fileList2"
						:on-error = 'errorInfo'
						list-type="picture"
						:action="this.state.uploadUrl"
						multiple>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将<em>通风系统图纸文件</em>拖到此处，或<em>点击上传</em></div>
						<!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
					</el-upload>
				</div>
			</el-card>
		</el-col>
	</el-row>
</el-card>
</template>
<script>
import store from 'src/store'
import api from 'src/api'

export default {
    components: {
    },
    data () {
        return {
        	map:'',
        	state:store.state,
        	action:store.actions,
        	showdata:false,
        	fileList0:[],
        	fileList1:[],
        	fileList2:[],
        	//fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        	showfile:true,
        	rdata1:{
        		longitude:90,
        		latitude:10,
        		type:1
        	},
        	rdata2:{
        		longitude:90,
        		latitude:10,
        		type:2
        	},
        	rdata3:{
        		longitude:90,
        		latitude:10,
        		type:3
        	},
        }
    },
    computed:{ 
    },
    watch:{
          '$route':'fetchData',
    },
    methods: {
    	success(response, file, fileList){
    		if(response.status==0){
    		   this.getCenter()
    		   this.$store.dispatch("getCenter");
	      	   this.$message({message:'上传成功!图纸已经更新！', type:"success"})
	      	} else{
	      	   this.$message.error(response.msg)
	      	}
    	},
    	errorInfo(response, file, fileList){
    		this.$message.error('上传失败!')
    	},
    	getCenter(){
    		 var vm = this
    		 vm.fileList0 = []
        	 vm.fileList1 = []
        	 vm.fileList2 = []
	       	 api.user.getMap().then(function(res){
	       	 	  console.log(res)
	       	 	  if(res.data.status==0){
	       	 	  	_.forEach(res.data.data, (m) => {
	       	 	  		if(m.type==1){
	       	 	  			vm.fileList0.push({
		       	 	  	  	 name:m.filename,
		       	 	  	  	 url:'data:image/svg+xml;base64,'+ m.img
		       	 	  	  })
	       	 	  		}else if(m.type==2){
	       	 	  			vm.fileList1.push({
		       	 	  	  	 name:m.filename,
		       	 	  	  	 url:'data:image/svg+xml;base64,'+ m.img
		       	 	  	  })
	       	 	  		}else if(m.type==3){
	       	 	  			vm.fileList2.push({
		       	 	  	  	 name:m.filename,
		       	 	  	  	 url:'data:image/svg+xml;base64,'+ m.img
		       	 	  	  })
	       	 	  		}
	       	 	  	})	       	 	  	    
	       	 	  }
	       	 })
        },
    },
    mounted () {   
    	 this.getCenter()	 
    }
};
</script>
