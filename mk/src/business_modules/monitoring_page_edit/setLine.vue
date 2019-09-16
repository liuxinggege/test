<style type="text/css">
	.colortext{
	    display: block;
	    color: #8492a6;
	    font-size: 14px;
	    margin-bottom: 20px;
	}
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-edit"> 编辑曲线</span>
    </p>
	<el-card class="box-card">

        <div slot="header" class="clearfix">
            <span>自定义曲线颜色</span>
        </div>

        <el-row>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">实时值显示颜色</span>
                    <el-color-picker v-model="rdata.realvalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">平均值显示颜色</span>
                    <el-color-picker v-model="rdata.avgvalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">最大值显示颜色</span>
                    <el-color-picker v-model="rdata.maxvalues" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">最小值显示颜色</span>
                    <el-color-picker v-model="rdata.minvalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">调校值显示颜色</span>
                    <el-color-picker v-model="rdata.cbvalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">断电值显示颜色</span>
                    <el-color-picker v-model="rdata.feedvalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
        </el-row>

        <el-row style="margin-top: 20px;">
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">标校值显示颜色</span>
                    <el-color-picker v-model="rdata.calibratevalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">设备异常显示颜色</span>
                    <el-color-picker v-model="rdata.unusualvalue" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">一级报警颜色</span>
                    <el-color-picker v-model="rdata.level1" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">二级报警颜色</span>
                    <el-color-picker v-model="rdata.level2" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">三级报警颜色</span>
                    <el-color-picker v-model="rdata.level3" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">四级报警颜色</span>
                    <el-color-picker v-model="rdata.level4" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
        </el-row >

        <el-row  style="margin-top: 20px;">
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">馈电状态图显示颜色</span>
                    <el-color-picker v-model="rdata.supplyvalue" @change="changeColor"></el-color-picker>
                </div>
                </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">初始化状态颜色</span>
                    <el-color-picker v-model="rdata.initialColor" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">值持续升高颜色</span>
                    <el-color-picker v-model="rdata.changing2value" @change="changeColor"></el-color-picker>
                </div>
                </el-col>
            <el-col :span="4">
                <div class="block">
                    <span class="colortext">突变数据颜色</span>
                    <el-color-picker v-model="rdata.changing3value" @change="changeColor"></el-color-picker>
                </div>
            </el-col>
        </el-row>
</el-card>
	 <el-row >
                <el-col :span="8">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>传感器报警曲线</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="changeLimit('warning')">保存</el-button>
                        </div>
                        <el-dragable-table
                            v-model="list.warning"
                            :columns-list="columnsList"
                            @on-start="handleOnstart"
                            @on-end="handleOnend($event,'warning')"
                            >
                        </el-dragable-table>
                    </el-card>
			    </el-col>
			    <el-col :span="8">
			     <el-card class="box-card">
					  <div slot="header" class="clearfix">
					    <span>传感器断电控制曲线</span>
					    <el-button style="float: right; padding: 3px 0" type="text" @click="changeLimit('power')">保存</el-button>
					  </div>
			    	<el-dragable-table
	                    v-model="list.power"
	                    :columns-list="columnsList"
	                    @on-start="handleOnstart"
	                    @on-end="handleOnend($event,'power')">
	                </el-dragable-table>
			     </el-card>
			    </el-col>
			    <el-col :span="8">
			     <el-card class="box-card">
					  <div slot="header" class="clearfix">
					    <span>传感器馈电异常曲线</span>
					    <el-button style="float: right; padding: 3px 0" type="text" @click="changeLimit('repower')">保存</el-button>
					  </div>
			    	<el-dragable-table
	                    v-model="list.repower"
	                    :columns-list="columnsList"
	                    @on-start="handleOnstart"
	                    @on-end="handleOnend($event,'repower')">
	                </el-dragable-table>
			     </el-card>
			    </el-col>
			 </el-row >
    
</el-card>
</template>

<script>
	import api from 'src/api'
	import store from 'src/store'
	import _ from 'lodash'
	import ElDragableTable from '../../common_bar/EledragableTable.vue'

	export default {
		components: {
	        ElDragableTable
	    },
		name: 'list',
		data() {
			return {
				state:store.state,
				action:store.actions,
				rdata:{
                    avgvalue:"#6FB8D7",
                    cbvalue:"#EE0909",
                    feedvalue:"#479811",
                    level1:"red",
                    level2:"#FF6100",
                    level3:"#F7BA2A",
                    level4:"#1D8CE0",
                    maxvalues:"#E484DC",
                    minvalue:"#93F2C2",
                    realvalue:"#8485D9",
                    supplyvalue:'#E80B0B',
                    initialColor:'#E77D7D',
                    calibratevalue:'red',
                    unusualvalue:'red',
                    changing2value:'red',
                    changing3value:'red',
                },
				normalColor:[
					{name:'断电门限',color:'rgb(255, 64, 64)'},
					{name:'报警门限',color:'rgb(229, 173, 16)'},
					{name:'复电门限',color:'rgb(18, 124, 232)'}
				],
				table1: {
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
               },
               colorId:'',
               ids:{
					'warning':{id:''},
					'power':{id:''},
					'repower':{id:''}
				},
                list:{
                    'warning':[
					    {title: '地点/名称'},
                        {title: '报警门限(下/上)'},
                        {title: '读值时刻',key: 'starttime'},
                        {title: '监测值',key: 'avalue'},
                        {title: '调校',key: 'debug'},
                        {title: '最大值' },
                        {title: '平均值'},
                        {title: '报警/解除', key: 'alarmStatus'},
                        {title: '断电/复电',key: 'powerStatusList'},
                        {title: '馈电状态', key:'feedStatusList'},
                        {title: '措施及时刻',key:'measure'}
				    ],
				    'power':[
					    {title:'地点/名称'},
                        {title:'断电门限(下/上)'},
                        {title:'断电范围'},
                        {title:'读值时刻',key:'starttime'},
                        {title:'监测值',key: 'avalue'},
                        {title:'调校', key: 'debug'},
                        {title:'最大值'},
                        {title:'平均值'},
                        {title:'报警/解除',key:'alarmStatus'},
                        {title:'断电/复电',key: 'powerStatusList'},
                        {title:'馈电状态',key: 'feedStatusList'},
                        {title:'措施及时刻',key: 'measure'}
				    ],
				    'repower':[
					    {title:'地点/名称'},
                        {title:'复电门限(下/上)'},
                        {title:'读值时刻',key: 'starttime'},
                        {title:'最大值'},
                        {title:'监测值',key: 'avalue'},
                        {title:'调校',key: 'debug'},
                        {title:'平均值'},
                        {title:'报警/解除',key: 'alarmStatus'},
                        {title:'断电/复电',key: 'powerStatusList'},
                        {title:'馈电状态',key: 'feedStatusList'},
                        {title:'措施及时刻',key: 'measure'}
				    ],
                },
				columnsList:[{title: '默认表头显示顺序如下，可以拖拽自定义显示顺序'}],
			}
		},
		methods: {
			changeLimit(name){
				api.user.editorAdd({list:this.list[name],type:name,id:this.ids[name].id}).then(res => {
					console.log(res)
					if(res.data.status==0){
						this.$message({
		                    type: 'success',
		                    message: '操作成功!'
		                });
		                this.getInfo()
					}else{
						this.$message.error('操作失败!')
					}
				})
			},
			sure(){
				if(this.colorId){
					this.rdata.id = this.colorId
				}
				api.user.addColor(this.rdata).then(res => {
					console.log(res)
					if(res.data.status==0){
						this.$message({
		                    type: 'success',
		                    message: '操作成功!'
		                });
                        this.action.getColor()
					}else{
						this.$message.error('操作失败!')
					}
				})
			},
			changeColor(val){
				//console.log(val)
				var check = false
				_.forEach(this.normalColor, (m) => {
					if(m.color==val){
						this.$message.error('颜色已存在于'+m.name+',请重新选择!')
					}else{
						check = true
					}
				})
				if(check){
					this.sure()
				}
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
            getColor(){
            	var vm = this
            	api.user.getColor().then(function(res) {
            		console.log(res,'getcolor')
            		vm.colorId = res.data.id
            		_.assign(vm.rdata,res.data.data)
            	})
            },
            getInfo(){
            	var vm = this
            	api.user.editorGetAll().then(function(res) {
					console.log(res)
					if(res.data.status==0){
						if(res.data.data.length){
							_.forEach(res.data.data, (m) => {
								if(m.type=='warning'){
									vm.list.warning = m.list
									vm.ids['warning'].id = m.id
								}else if(m.type=='power'){
									vm.list.power = m.list
									vm.ids['power'].id = m.id
								}else if(m.type=='repower'){
									vm.list.repower = m.list
									vm.ids['repower'].id = m.id
								}
							})
						}
					}else{
						vm.$message.error(res.data.msg)
					}
				})
            }
		},
		mounted() {
			// this.getInfo()
			this.getColor()
		}
	};
</script>
