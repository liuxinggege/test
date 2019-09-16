<template>	
	<div>
	<table class="showPage" style="display: table;border-collapse: separate;border-spacing: 0px;border-color: grey;border: 1px solid #dfe6ec;width:100%;font-size:100%;">
		<thead :style="{backgroundColor: '#f8f8f9',borderBottom: '1px solid #dfe6ec',width:$route.name == 'Wsub'||$route.name == 'home_index'?'100%':'',fontSize: '12px'}">
			<tr style="height: 30px;">				
				<th v-for='item in excelColumns' style="background-color: #f8f8f9;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;font-weight: bold;">{{item.title}}</th>
				
				<th v-if='printOb.showLine' style="background-color: #f8f8f9;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;font-weight: bold;">{{printOb.thead}}</th>
			</tr>			
		</thead>
		<tbody :style="{height:$route.name == 'Wsub'||$route.name == 'home_index'?'auto !important':'',overflowY:$route.name == 'Wsub'||$route.name == 'home_index'?'hidden':''}" v-if="tableExcelData.length">
			<tr v-for='(item,index) in tableExcelData'>
				<td v-for='ob in excelColumns' style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
					<span v-if="ob.flag" @click ='clickLine(item,ob)' style="cursor: pointer;color: #20A0FF;">{{tableExcelData[index][ob.key]}}</span>
					<span v-else-if="ob.areaRange">{{printOb.tbody}}</span>
					<span v-else-if="ob.isArea">{{tableExcelData[index][ob.key]}}{{tableExcelData[index]['default_allow']==2?'限制':''}}{{tableExcelData[index]['emphasis']==2?'重点':''}}</span>
					<!-- <span v-else-if="ob.battary" :style="{color:tableExcelData[index]['battary']=='0'?'#19be6b':'color: #FF4949'}">{{tableExcelData[index]['battary']=='0'?'正常':'电量低'}}</span> -->
					<span v-else-if="ob.battary">
						<label v-if="tableExcelData[index]['battary']== -1"  style="color: #FF4949;">未知</label>
						<label v-else-if="tableExcelData[index]['battary']== -2"  style="color: #FF4949;">监测中</label>
						<label v-else-if="tableExcelData[index]['battary']== 0" style="color:#19be6b">正常</label>
						<label v-else  style="color:#FF4949">{{tableExcelData[index]['battary']}}</label>
					</span>
					<span v-else-if="ob.isStatus">
                            <label v-if="tableExcelData[index][ob.key] == 0" style="color:#19be6b;">正常</label>
					        <label v-else-if="tableExcelData[index][ob.key] == -1" style="color: #FF4949;">未知</label>
					        <label v-else-if="tableExcelData[index][ob.key] == -2" style="color: #FF4949;">监测中</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 1" style="color: #FF4949;">井下超员</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 2" style="color: #FF4949;">区域超员</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 3" style="color: #FF4949;">井下超时</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 4" style="color: #FF4949;">区域超时</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 5" style="color: #FF4949;">人员失联</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 6" style="color: #FF4949;">工作异常</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 7" style="color: #FF4949;">限制区域</label>
					</span>
					<span v-else-if="ob.isDebug">
                            <label v-if="tableExcelData[index][ob.key] == 0" style="color:#19be6b;">正常</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 1" style="color: blue;">欠压</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 2" style="color: red;">故障</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 3" style="color: blue;">调校</label>
					        <label v-else-if="tableExcelData[index][ob.key] == 4" style="color: #FF4949;">开机</label>
                            <label v-else-if="tableExcelData[index][ob.key] == 5" style="color: red;">标校</label>
                            <label v-else-if="tableExcelData[index][ob.key] == 6" style="color: blue;">标校成功</label>
                            <label v-else-if="tableExcelData[index][ob.key] == 7" style="color: red;">离线</label>
					</span>
					<span v-else-if="ob.isNull">
                            <label>{{tableExcelData[index][ob.key] == null||tableExcelData[index][ob.key] == ''?'-':tableExcelData[index][ob.key]}}</label>
					</span>
					<!-- 下面的是gd多参的设备信息 -->
					<span v-else-if="ob.gdsensormsg">
						     <label>{{tableExcelData[index].position||'未配置位置'}}/{{tableExcelData[index].alais}}</label>
					</span>
					<span v-else-if="ob.key == 'totalnum'||ob.key == 'statechangecnt'" @click='checkDetail2(item)'>{{tableExcelData[index][ob.key]}}</span>
					<span v-else :style="{color:tableExcelData[index][ob.key]=='异常'?'#FF4949':''}">{{tableExcelData[index][ob.key]}}</span>
				</td>
				<td v-if='printOb.showLine' style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;"><el-button size="mini" type="text" @click ='clickLine(item)'>{{printOb.tbody}}</el-button></td>
			</tr>
		</tbody>
		<tbody v-else>
			<tr>
				<td style="text-align: center;padding:5px;" :colspan="excelColumns.length">
					<span>暂无数据</span>
				</td>
			</tr>
		</tbody>
    </table>
    <div v-for='item in printInfo.rules' v-if="printOb.showEdit" style="margin-top:80px">
      <p>{{item.ruleDev}}:</p>
    </div>
</div>
</template>
<!--isStatus-->
<script>
import api from 'src/api'
import _ from 'lodash'

export default {
    name: 'print',
    data () {
    	return {
    		printInfo:{
    			rules:[]
    		},
    		format:['YYYY-MM-DD HH:mm:ss','YYYY/MM/DD HH:mm:ss'],
    		nowtime:'',
    		showRules:false
    	}
    },
    props:{
            printOb:Object,
            print:Boolean,
			excelColumns:Array,
			tableExcelData:Array,
            showEdit:Boolean
	},
	watch: {
		'tableExcelData':{
		  handler: function(val, oldVal) {
				},
				deep: true
		},
	},
    mounted () {
    },
    methods:{
    	getPrintInfo(){
            this.printOb.showEdit = true
    		
    	},
        clickLine(ob,item){
			if( this.$route.name =='/route-index/searchswithCard'||//人员定位携卡
		    	this.$route.name == '/route-index/searchsmonthAreaAccess'||//人员定位每月区域出入查询
				this.$route.name == '/route-index/searchsdayAreaAccess'||//人员定位每天区域出入查询
				this.$route.name == 'watch'||//当前人员信息
				//this.$route.name == 'Rsystem'||以前人员定位的系统总览
				this.$route.name == 'Wsub'||this.$route.name == 'home_index'//现在人员定位模拟图系统总览和编辑
				){	
                this.$emit('clickLine',ob,item)
            }else if(this.$route.name == '/route-index/searchsmonthWell'){//人员定位每月下井人员查询
					let val = {day:ob.day}
					if(item.label){
						val.label = item.label
					}
                    this.$router.push({path:'/search/dayQueryWell',query:val})       
			}else if(this.$route.name=='ErrorMessage'|| //人员定位通讯中断记录查询
					this.$route.name=='/watching-index/analyze'|| //环境监测查询和统计
					this.$route.path=='/search/personAlarmSearch'){
                	this.$emit('checkDetails',ob)
            }
            else{
               ob.day = moment(ob.filltime, 'YYYY/MM/DD').format('YYYY-MM-DD')
               this.$router.push({path:'/search/dayQueryWell',query:{day:ob.day}})  
            } 
        },
    },
};
</script>