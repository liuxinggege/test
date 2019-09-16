<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
	<p slot="header">
		<span class="fa fa-upload"> 数据上传</span>
	</p>
	<el-form :inline="true">
		<el-form-item label="文件类型">
			<el-select v-model="fileName" placeholder="请选择" size="small" clearable  @change="change">
			<el-option
				v-for="item in list"
				:key="item.value"
				:label="item.label+'('+item.value+')'"
				:value="item.value">
				<span style="float: left">{{ item.label }}</span>
				<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
				</el-option>
			</el-select>
			</el-form-item>
	</el-form>
	<el-table  v-loading="loading" element-loading-text="加载中..." :data="state.showlist" border stripe>
		<el-table-column prop="name" label="文件名"></el-table-column>
		<el-table-column label="下载">
			<template scope="scope">
				<a  @click="getFile(scope.row.encryptpath)" style="margin-right:60px">加密文件</a>
				<a  @click="getFile(scope.row.uncryptpath)">不加密文件</a>
			</template>
		</el-table-column>
	</el-table>
	<my-pagination></my-pagination>
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
        	starttime:'',
        	endtime:'',
        	state:store.state,
        	action:store.actions,
        	showdata:false,
        	loading:false,
        	fileName:'',
        	list:[
        	{
        		label:'测点定义',value:'CDDY',
        	},
        	{
        		label:'实时数据',value:'SSSJ',
        	},
        	{
        		label:'五分钟数据',value:'WFSJ',
        	},
        	{
        		label:'开关量变化记录',value:'KGBH',
        	},
        	{
        		label:'累积量数据',value:'LJSJ',
        	},
        	{
        		label:'异常/报警记录',value:'YCBJ',
        	},]
        }
    },
    computed:{
    },
    watch: {
            '$route': 'fetchData',
            'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.orderlist)
		      },
		      deep: true
		    }
    },
    methods: {
				getLog() {
					let vm = this
					vm.loading = true
					api.gas.getfilenames({name:vm.fileName}).then((res) => {
						console.log(res, "查询到的内容")
						if (res.data.status === 0) {
							vm.loading = false
							if (res.data.data.length) {
								vm.orderlist = res.data.data
								console.log(vm.orderlist)
							} else {
								vm.orderlist = []
							}
							vm.action.setShowList(vm.orderlist)
						} else {
							vm.loading = false
							vm.$message.error(res.data.msg)
						}
					})
				},
				change(){
					this.getLog()
				},
				getFile(name){
					  var form=$("#downfile");
			          if (form !== undefined) form.remove();

			          form=$("<form id='downfile'>"); //定义一个form表单
			          form.attr("style","display:none");
			          form.attr("target","");
			          form.attr("method","post");
			          form.attr("action", '/coalmine/file/download');
			          var input1=$("<input>");
			          input1.attr("type","hidden");
			          input1.attr("name","path");
			          input1.attr("value",name);
			          $("body").append(form); //将表单放置在web中
			          form.append(input1);
			          form.submit(); //表单提交
				}
    },
    mounted() {
    	 this.getLog()
    }
};
</script>
<style scoped="">
	.text{
	  float: right;
	  margin:5px 10px;
	}
</style>
