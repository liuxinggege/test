<template>
	<el-card>
	<p slot="header">
		<span class="fa fa-edit"> 编辑列表</span>
	</p>
	<el-row>
        <el-col :span="8">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				<span>传感器实时列表</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="changeLimit('nowtime')">保存</el-button>
				</div>
				<el-dragable-table
					v-model="list.nowtime"
					:columns-list="columnsList"
					@on-start="handleOnstart"
					@on-end="handleOnend($event,'nowtime')"
					>
				</el-dragable-table>
			</el-card>
		</el-col>
		<el-col :span="8">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				<span>开关量传感器实时调用列表</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="changeLimit('switchCall')">保存</el-button>
				</div>
				<el-dragable-table
					v-model="list.switchCall"
					:columns-list="columnsList"
					@on-start="handleOnstart"
					@on-end="handleOnend($event,'switchCall')">
				</el-dragable-table>
			</el-card>
		</el-col>
		<el-col :span="8">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
				<span>模拟量传感器实时调用列表</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="changeLimit('sensorCall')">保存</el-button>
				</div>
				<el-dragable-table
					v-model="list.sensorCall"
					:columns-list="columnsList"
					@on-start="handleOnstart"
					@on-end="handleOnend($event,'sensorCall')">
				</el-dragable-table>
		    </el-card>
		</el-col>
	</el-row>
</el-card>
</template>

<script>
	import api from 'src/api'
	import _ from 'lodash'
	import ElDragableTable from '../../common_bar/EledragableTable.vue'

	export default {
		components: {
			ElDragableTable
	    },
		name: 'list',
		data() {
			return {
				table1: {
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
               },
				columnsList:[{
                            title: '默认表头显示顺序如下，可以拖拽自定义显示顺序',
                            render: (h, params) => {
                                return h('div',{
                                        style:{
                                                display: 'flex',
                                                alignItems: 'start',
                                                justifyContent: 'start',
                                                flexDirection: 'column',
                                                padding:'5px 0'
                                            }
                                        },
                                    [
                                    h('div',params.row.title)
                                 ]);
                            }
                     }
				],
				ids:{
					'sensorCall':{id:''},
					'switchCall':{id:''},
					'nowtime':{id:''}
				},
				list:{
	            'sensorCall':[
	                 {title:'地点/名称/类型',key:'position'},
	                 {title:'报警门限',key:'limit_alarm',width:85,sortable:true},
	                 {title:'断电门限',key:'limit_power',width:85,sortable:true},
	                 {title:'复电门限',key:'limit_repower',width:85,sortable:true},
	                 {title:'实时值',key:'now_value',width:85,value:100,sortable:true},
	                 {title:'状态',key:'statusText',now:true},
	                 {title:'最大值',key:'maxvalue',width:85,sortable:true},
	                 {title:'最小值',key:'minvalue',width:85,sortable:true},
	                 {title:'平均值',key:'avgvalue',width:85,sortable:true},
	                 {title:'最后一次-报警及时刻',key:'alarmStarttime',},
					 {title:'最后一次-断电及时刻',key:'powerStarttime'},
                 ],
	            'switchCall':[
					 {title:'地点/名称/类型',key:'position'},
					 {title:'报警/断电状态',key:'alarmstatus'},
	                 {title:'当前状态',key:'now_value',value:25},
	                //  {title:'状态',key:'statusText',now:true},
	                 {title:'最近一次状态变动及时刻',key:'statusChange'},
	                 {title:'最后一次-报警/断电及时刻',key:'alarmStarttime'},
                     {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                ],
				'nowtime':[
				  {key:'alais',title:'设备编号',width:110,sortable:1},
				  {key:'type',title:'设备信息'},
				  {key:'statusText',title:'状态'},
				  {key:'now_value',title:'值',sortable:1},
//                {key:'faultFeeder',title:'断馈电'}
				],
				}
			}
		},
		mounted() {
			this.getInfo()
		},
		methods: {
			changeLimit(name){
				var vm = this
				api.user.editorAdd({list:vm.list[name],type:name,id:vm.ids[name].id}).then(function(res) {
					if(res.data.status==0){
						vm.$message({
		                    type: 'success',
		                    message: '操作成功!'
		                });
		                vm.getInfo()
					}else{
						vm.$message.error('操作失败!')
					}
				})
			},
			handleOnstart(from) {
                this.table1.oldIndex = from;
                this.table1.hasDragged = true;
                this.table1.isDragging = true;
            },
            handleOnend(e,columnType) {
                this.table1.isDragging = false;
                this.table1.draggingRecord.unshift({
                    from: e.from + 1,
                    to: e.to + 1
                });
                var list = _.cloneDeep(this.list[columnType])
                var data = list.splice(this.table1.newIndex,1,list[this.table1.oldIndex])
            },
            getInfo(){
            	var vm = this
            	api.user.editorGetAll().then(function(res) {
					if(res.data.status==0){
						if(res.data.data.length){
							_.forEach(res.data.data, (m) => {
								if(m.type=='nowtime'){
									vm.list.nowtime = m.list
									vm.ids['nowtime'].id = m.id
								}else if(m.type=='switchCall'){
									 vm.list.switchCall = m.list
									vm.ids['switchCall'].id = m.id
								}else if(m.type=='sensorCall'){
									 vm.list.sensorCall = m.list
									vm.ids['sensorCall'].id = m.id
								}
							})
						}
					}else{
						vm.$message.error(res.data.msg)
					}
				})
            }
		}	
	};
</script>
