<style type="text/css">
 .el-table tr{
 	cursor: pointer;
 }
 .setInfo{
 	color: #616161;
 	margin:5px;
 }
 .ivu-input[disabled], fieldset[disabled] .ivu-input{
 	color:#232121;
 }
</style>
<template>
<el-card>
	<p slot="header">
		<span class="fa fa-folder-open-o"> 文件解密</span>
	</p>
	<el-row class="formcss">
		<el-upload
			class="upload-demo"
			:action="state.decodeUrl"
			:on-success ="success"
			:on-error = 'errorInfo'
			>
			<p>上传加密文件<el-button size="small" type="primary" style="margin-left: 20px">点击上传</el-button></p>
		</el-upload>
	</el-row>
	<el-row style="margin-top:35px" v-if="showop">
		<el-input
			disabled
			type="textarea"
			:autosize='true'
			placeholder="解密内容如下"
			v-model="textareas">
		</el-input>
	</el-row>
</el-card>
</template>

<script>
import store from 'src/store'
export default {
    data () {
    	return {
    		state:store.state,
    		showop:false,
    		textareas:''
    	}
    },
    methods: {
    	success(response, file, fileList){
    		if(response.status==0){
    		   //this.getDeatail()	
    		   this.showop = true
    		   //console.log(response.data)
    		   this.textareas = response.data
    		   if(response.isEqual){
    		   	 this.$message({message:'与明文文件一致!', type:"success"})
    		   }else{
    		   	 this.$message({message:'与明文文件不一致!', type:"error"})
    		   }	      	   
	      	} else{
	      	   this.$message.error(response.msg)
	      	}
    	},
    	errorInfo(response, file, fileList){
    		this.$message.error('上传失败!')
    	}
    },
    mounted () { 
    }
};
</script>