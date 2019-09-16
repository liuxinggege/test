<template>
    <div>
    	<table style="display: table;border-collapse: separate;border-spacing: 0px;border-color: grey;border: 1px solid #dfe6ec;width:100%;font-size:100%">
    		<thead style="background-color: #f8f8f9;font-size: 12px;">
    			<tr style="height: 30px;">				
    				<th v-for='item in excelColumns' style="background-color: #f8f8f9;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;font-weight: bold;">{{item.title}}</th>
    				<th v-if="showLine" style="background-color: #f8f8f9;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;font-weight: bold;">人员跟踪</th>
    			</tr>			
    		</thead>
			<tbody v-for='(item,index) in tableExcelData' v-if="!print&&tableExcelData.length">
				<tr v-for='(ob,dindex) in item.list'>
					<td v-if="dindex == 0" v-for='oob in excelColumns1' :rowspan="item.list.length" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
						{{tableExcelData[index][oob.key]}}
					</td>
					<td v-for='ooc in excelColumns2' style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
						{{ob[ooc.key]}}
					</td>
					<td  v-if="showLine" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
						<a @click="getLine(item.rfcard_id,ob,item)">活动轨迹</a>
					</td>
				</tr>    				
			</tbody>
			<tbody v-for='(item,index) in tableExcelData' v-if="print&&tableExcelData.length">
				<tr>
					<td v-for='data in excelColumns' style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
							{{tableExcelData[index][data.key]}}
			         </td>
				</tr>
			</tbody>
			<tbody v-if="!tableExcelData.length">
				<tr>
					<td style="text-align: center;padding:5px;" :colspan="excelColumns.length">
						<span>暂无数据</span>
					</td>
				</tr>
			</tbody>
    	</table>
        <div v-for='item in printInfo.rules' v-if="showEdit" style="margin-top:50px">
	       <p>{{item.ruleDev}}:</p>
	    </div> 
    </div>
</template>

<script>
import _ from 'lodash'
import api from 'src/api'


export default {
    name: 'print2',
    data () {
    	return {
    		excelColumns1:[],
    		excelColumns2:[],
    		printInfo:{
    			rules:[]
    		},
    		format:['YYYY-MM-DD HH:mm:ss','YYYY/MM/DD HH:mm:ss'],
    	}
    },
    props:{     	
			excelColumns:Array,
			tableExcelData:Array,
			showLine:Boolean,
			print:Boolean,
	},
	watch: {
		'tableExcelData':{
		  handler: function(val, oldVal) {
				},
				deep: true
		},
		'excelColumns':{
		  handler: function(val, oldVal) {
				},
				deep: true
		}
	},  
    mounted () {  
    	this.excelColumns1 = []
    	this.excelColumns2 = []
        if(this.$route.name=="/watching-index/analyze"){//环境监测报表查询打印
            this.excelColumns.unshift({
                key:'alais',
                title:'测点号'
            })
        }
    	this.excelColumns.forEach((item,index) => {
    		if(item.rowspan){
    			this.excelColumns2.push(item)
    		}else{
    			this.excelColumns1.push(item)
    		}
    	})
    },
    methods:{
    	getLine(id,row,user){
           this.$emit('goLine',id,row,user)
    	},
        getPrintInfo(){
            this.showEdit = true
    	}, 
    },
    beforeDestroy(){
        if(this.$route.name=="/watching-index/analyze"){
            this.excelColumns.shift()
        }
    }
};
</script>