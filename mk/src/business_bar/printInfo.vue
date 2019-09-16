<template>
   <div>	
	    <el-table 
	      :data="tableData"	     
	      :span-method="objectSpanMethod"
	      height="650"
	      border	 
	      stripe
	      style="width: 100%; margin-top:5px">
            <el-table-column  v-for="item in headlist"
		      :prop="item.key"
		      :width="item.width"
		      :label="item.title">
                <template scope="scope">
                	<div  v-if="item.key=='name'||item.key=='pos_type'">
                    	{{scope.row[item.key]}}
                    </div>
                    <div  v-else-if="item.key=='path'">
                    	<span v-if="scope.row.path!=''"><img :src="Url + scope.row.path" alt="" width="400px"/></span>
                    	<span v-else></span>
                    </div>
                    <div  v-else-if="item.key=='special'">
                    	<p v-for="item in scope.row.list" v-if="scope.row.list.length">
                    		{{item.position+'/'+item.sensor_type+'/'+item.uid+(item.is_area_alarm?'(关联区域报警)':'')}}
                    	</p>  
                    	<p v-if="!scope.row.list.length">
                    		<el-button type="text" size="small"   style="color: red">未配置</el-button>
                    	</p> 
                    </div>
                    <div v-else-if="item.key=='action'">
                    	<el-button type="primary" size="small" plain @click="setSensor(scope.row)">编辑</el-button>
                    </div>
                    <div v-else-if="item.key=='action2'&&scope.row.type_id==0">
                    	<el-button type="primary" size="small" plain @click="delSensor(scope.row)">删除</el-button>
                    </div>
                    <div v-else>{{scope.row[item.key]}}</div>
                </template>
	       </el-table-column>
	    </el-table>
    </div>
</template>

<script>
import _ from 'lodash'
import api from 'src/api'

export default {
	props:{
		headlist:Array,
		dataList:Array
	},
    data () {
    	return {  		
    		RindexList:[],
    		CindexList:[],
    		Url:'./static/areaTypeImg/'
    	}
    },
    computed: {
    	tableData () {
    		var data = []
    		return this.check(this.dataList)
    	}
    },
    methods:{
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
	     	if (_.indexOf(this.CindexList,columnIndex)!=-1) {
                return row.span
			}
        },
        setSensor(row){
	     	this.$emit('setSensor',row)
        },
        delSensor(row){
	     	let me = this
            me.$confirm('是否删除该区域规则', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {                    
                api.setting.delStrategy({id:row.area_type_id,type_id:row.type_id}).then((res) => {
                    if (res.data.status === 0) {
                 	    me.$emit('backup')
                        me.$message({
                            type: 'success',
                            message: '操作成功，已经删除!'
                        });		                    
                    }
                })
            }).catch(() => {
                me.$message({
                    type: 'warning',
                    message: '操作已取消'
                });
            });
	    },
        check(list){
	     	var data = []
	     	var card = []
	     	_.forEach(list, (m) => {
	     		if(m.list.length){
	     			_.forEach(m.list, (ob,k) => {
                        if (k == 0) {
                            ob.span = {rowspan:m.list.length, colspan:1};
                        } else {
                            ob.span = {rowspan:0, colspan:0};
						}
	     				_.forEach(this.headlist,(t,index)=> {
	     					if(!t.rowspan){
	     						ob[t.key] = m[t.key]
	     						this.CindexList.push(index)
	     					}	     					
	     				})
	     				data.push(ob)
	     			})
	     		}
	     	})
	     	return data	     	
        }
    },
};
</script>