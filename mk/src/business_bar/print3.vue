<template>
    <div>
    	<table style="display: table;border-collapse: separate;border-spacing: 0px;border-color: grey;border: 1px solid #dfe6ec;width:100%;font-size:100%">
    		<thead style="background-color: #f8f8f9;font-size: 12px;">
    			<tr style="height: 30px;">				
    				<th v-for='item in excelColumns' style="background-color: #f8f8f9;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;font-weight: bold;">{{item.title}}</th>
    			</tr>			
    		</thead>
    			<tbody v-for='(item,index) in tableExcelData' v-if="tableExcelData.length">
    				<tr v-for='(ob,dindex) in item.feedstatuslist'>
    					<td v-if="dindex == 0" v-for='oob in excelColumns1' :rowspan="item.feedstatuslist.length" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
    						{{tableExcelData[index][oob.key]}}
    					</td>
    					<td v-for='ooc in excelColumns2' style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
    						{{ob}}
    					</td>
						<td v-if="dindex == 0" v-for='oob in excelColumns3' :rowspan="item.feedstatuslist.length" style="background-color: #fff;text-align: center;padding: 5px 15px;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
    						{{tableExcelData[index][oob.key]}}
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
    </div>
</template>

<script>
import _ from 'lodash'
import api from 'src/api'


export default {
    name: 'print3',
    data () {
    	return {
    		excelColumns1:[],
    		excelColumns2:[],
    		excelColumns3:[]
    	}
    },
    props:{     	
			excelColumns:Array,
			tableExcelData:Array,
			showLine:Boolean,
			print:Boolean,
			showEdit:Boolean
			
	},
	watch: {
		//'$route':'fetchData',
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
    	this.excelColumns3 = []
    	this.excelColumns.forEach((item,index) => {
    		if(item.rowspan){
    			this.excelColumns2.push(item)
			}else if(item.last){
				this.excelColumns3.push(item)
			}else{
    			this.excelColumns1.push(item)
    		}
		})
    },
    methods:{
         
    },
};
</script>