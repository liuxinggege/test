<style lang="less">
    @import '../../styles/common.less';
    .imitate_card{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border: 1px solid #ebeef5;
        transition: .3s;
    }
    .card_header{
        padding: 10px 20px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
    }
    .card_body{
        padding: 10px;
    }
    .font_title{
		color: #333;
		font-size: 14px;
    	font-weight: 700;
    }
    .redword{
    	color: red;
    }
    .print_title{
    	text-align: center;
    }
    .select_box{
		position: absolute;
		left: 0;
		top:36px;
		z-index: 555;
		cursor: pointer;
    }
</style>
<template>
    <div class="imitate_card" v-if="showdata">
        <div class="card_header">
            <span class="fa fa-file-text">
            	&nbsp;<span class="font_title" v-if="!this.$route.query.type">每天区域出入查询</span>
            	<span class="font_title" v-if="this.$route.query.type==3">每天重点区域出入查询</span>
	    		<span class="font_title" v-if="this.$route.query.type==4">每天限制区域出入查询</span>
            </span>
        </div>
        <div class="card_body">
		<el-row>
			<el-form :inline="true" ref="searchform" :model="searchform">
			 	<el-form-item label="时间">
					<el-date-picker
				      v-model="days"
				      size="small"
				      @change = "selectDay"
				      align="right"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
			 	</el-form-item>
				</el-form-item>
			 	<el-form-item label="工作区域">
                  	<el-cascader
					    size="small"
	                    :options="areaData"
                  		change-on-select
						@change="checkArea"
	                    v-model="selectArea"
	                    :disabled="!!this.$route.query.type"
                  	></el-cascader>
				</el-form-item>
				<el-form-item label="卡号">
                    <el-input size="small" v-model="formInline.callcard" style="width:200px;" @keyup.native="getCardNum($event)"></el-input>
                    <div v-if="userList.length" class="select_box">
                       	<el-table :data="userList" @row-click="selects" border max-height="400">
							<el-table-column prop="name" label="姓名" width="100"></el-table-column>
							<el-table-column prop="rfcard_id" label="卡号" width="100"></el-table-column>
						</el-table>
                    </div>
                </el-form-item>
				<el-form-item label="部门">
		            <el-select size="small" style="width:130px" clearable v-model="searchform.depart_id">
				    	<el-option key="" label="所有部门" value=""></el-option>
                        <el-option
                        	v-for="item in deplist"
                        	:value="item.id"
                        	:label="item.name"
                        	:key="item.id">
                    	</el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="工种" >
				    <el-select size="small" :disabled="checked" clearable v-model="searchform.worktype_id" style="width:120px">
				    	<el-option key="" label="所有工种" value=""></el-option>
                        <el-option
                        	v-for="item in typeList"
                        	:value="item.id"
                        	:label="item.name"
                        	:key="item.id">
                    	</el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="职务">
				    <el-select size="small" clearable v-model="searchform.dutyId" style="width:130px">
				    	<el-option key="" label="所有职务" value=""></el-option>
                        <el-option
                        	v-for="item in dutyList"
                        	:value="item.id"
                        	:label="item.v"
                        	:key="item.id">
                    	</el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="">
					<el-checkbox v-model="checked">特种人员</el-checkbox>
			 	</el-form-item>
				<el-form-item>
                 	<el-button type="primary" size="small" @click="onSearch()" icon="el-icon-search">查询</el-button>
	               	<el-button type="primary" size="small" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
	               	<el-button type="primary" size="small" @click="$router.go(-1)" icon="el-icon-back" style="margin-left:10px">返回</el-button>
      			</el-form-item>
			</el-form>
		</el-row>
		<div id="show" class="show-image mytable">
	    	<h4 class="print_title" v-if="showpage&&!this.$route.query.type">每天区域出入查询</h4>
	    	<h4 class="print_title" v-else-if="showpage&&this.$route.query.type==3">每天重点区域出入查询</h4>
	    	<h4 class="print_title" v-else-if="showpage&&this.$route.query.type==4">每天限制区域出入查询</h4>
    		<div style="display: flex;flex-direction: row;margin-bottom:10px;">
		    	<div>进入区域人员总数：<span class="redword">{{inAreaSize}}</span></div>&nbsp;&nbsp;
				<div>超员总数：<span class="redword">{{overManSize}}</span></div>&nbsp;&nbsp;
				<div >超时人员总数：<span class="redword">{{OverTime}}</span></div>
			</div>
			<div style="text-align:right" v-if="showpage">打印时间：{{nowtime}}</div>
		    <print-page @clickLine="clickLine" :excelColumns="columnList" :tableExcelData="!showpage?state.showlist:tableData" :printOb="printOb" ref="print"></print-page>
	    </div>
		<my-pagination></my-pagination>
	</div>
</div>
</template>

<script>
 	import api from 'src/api'
 	import _ from 'lodash'
 	import moment from 'moment'
 	import store from 'src/store'
	import printPage from '../../business_bar/print.vue';

 	export default{
 		components: {
    		printPage
    	},
 		data(){
 			return{
 				printOb:{
	    			showLine:true,
	    			thead:'人员跟踪',
	    			tbody:'活动轨迹',
	    			showEdit:false
    			},
    			columns1: [{
                    width: 100,
                    title: '姓名',
                    key: 'name'
                }, {
                    width: 100,
                    title: '卡号',
                    key: 'rfcard_id'
                }],
 				state:store.state,
				action:store.actions,
 				showpage:false,
 				showdata:false,
 				days:'',
 				checkday:'',
 				inAreaSize:'',
 				overManSize:'',
 				OverTime:'',
				typeList:[],
				deplist:[],//单层部门列表
				dutyList:[],
 				searchform:{},
 				formInline: {}, //表单和规则
 				checked:false,
 				dayQuery:[],
 				tableData:[],
 				allData:[],
				selectPerson:'所有',
				nowtime:'',//打印时间
          		selectArea:[],
			    userList:[],
 				areaData:[{
                    label:'所有区域',
                    value:1,
                    children:[]
                },{
                    label:'普通区域',
                    value:2,
                    children:[]
                },
                {
                    label:'重点区域',
                    value:3,
                    children:[]
                },
                {
                    label:'限制区域',
                    value:4,
                    children:[]
                }],
 				columnList:[{
					key:'areaName',
					title:'工作区域',
					isArea:true
				},
				{
					key:'card',
					title:'卡号'
				},
				{
					key:'name',
					title:'姓名'
				},
				{
					key:'departName',
					title:'部门'
				},
				{
					key:'worktypeName',
					title:'工种'
				},
				{
					title:'异常情况',
		          	key:'eptList',
	          	},
				{
					key:'startTime',
					title:'进入区域时刻',
				},
				{
					key:'endTime',
					title:'离开区域时刻'
				},
				{
					key:'wellduration',
					title:'进入区域时长'
				}],
 			}
 		},
 		watch:{
 			'$route': 'fecthdata',
 			'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.tableData)
		      },
		      deep: true
		    },
 		},
 		methods:{
 			fecthdata(){
 				if(this.$route.query.type){
	 				let arr = [parseInt(this.$route.query.type)]
	            	this.selectArea = arr
	            	this.searchform.type = this.$route.query.type
                }
 				else if(this.$route.query.area_ids){
	            	this.selectArea = [1,parseInt(this.$route.query.area_ids)]
                }
 				else{
                	this.selectArea = [1]
                	delete this.searchform.type
                }
 				this.showdata = false
 				this.onSearch()
 			},
			onSearch(){
				var vm = this
	  			vm.searchform.starttime =  vm.dayTime(vm.checkday)
	  			if(vm.checked){
	        		vm.searchform.special = 1
					vm.searchform.worktype_id = ""
	        	}else{
	        		delete vm.searchform.special
	        	}
				if(vm.$route.query.type){
					api.searchs.getareaPass(vm.searchform).then((res)=>{
						if(res.data.status === 0){
							vm.tableData = res.data.inArea
							vm.inAreaSize = res.data.inAreaSize
							vm.overManSize = res.data.overManSize
							vm.OverTime = res.data.OverTime
							vm.showdata = true
                            vm.action.setShowList(vm.tableData)
						}
						else{
		         			vm.$message.error(res.data.msg)
						}
					})
				}
				else{
					api.searchs.getDayArea(vm.searchform).then((res)=>{
						if(res.data.status === 0){
							vm.allData = res.data.inArea
							vm.tableData = []
							vm.inAreaSize = res.data.inAreaSize
							vm.overManSize = res.data.overManSize
							vm.OverTime = res.data.OverTime
							if(vm.selectPerson=='所有') {
	                            vm.tableData = res.data.inArea
	                        }else{
	                            _.forEach(vm.allData,(ob)=>{
	                                if(ob.eptList && ob.eptList.length){
	                                    for(let oob of ob.eptList){
	                                        if(vm.selectPerson == oob){
												vm.tableData.push(ob)
	                                            break;
											}
	                                    }
	                                }
								})
	                        }
							vm.showdata = true
	                        vm.action.setShowList(vm.tableData)
						}else{
		         			vm.$message.error(res.data.msg)
						}
					})
				}
			},
			exportPrint(){
				this.showpage = true
            	this.$refs.print.getPrintInfo()
	        	setTimeout(() => {
		  			$('#show').jqprint()
		  			this.showpage = false
		  			this.printOb.showEdit = false
		  			setTimeout(() => {
                        this.printOb.showLine = true
                    },1)
		  		},50)
			},
 			checkArea(arr){
 				if(arr.length === 2){
 					this.searchform.area_ids = [_.last(arr)]
 				}else if(arr.length === 1){
 					this.areaData.forEach((ob)=>{
 						if(ob.value == arr[0]){
 							this.searchform.area_ids = ob.children.map((oob)=>{
 								return oob.id
 							})
 						}
 					})
                	if(!this.searchform.area_ids.length) delete this.searchform.area_ids
 				}
 			},
 			dayTime(time){
				return moment(time, 'YYYY/MM/DD').format('YYYY-MM-DD')
		    },
 			selectDay(val){
            	this.checkday = val
            },
            //部门
            getDepartlist(){
				var vm = this
				api.routeLine.getDepartList().then((res)=>{
		            if (res.data.status === 0) {
				       	vm.deplist = res.data.data
			        }else{
                        vm.$message.error(res.data.msg)
                    }
				})
			},
			//工种
			getWorktype(){
				var vm = this
				api.routeLine.getWorkType().then(function(res){
	        		if (res.data.status === 0) {
						vm.typeList = res.data.data
					}else{
                        vm.$message.error(res.data.msg)
                    }
				})
			},
			//地点、职务
			getAll(){
				var vm = this
				api.searchs.getallData().then((res)=>{
					if(res.data.status === 0){
						vm.dutyList = res.data.duty
					}else{
						vm.$message.error(res.data.msg)
					}
				})
			},
			//获取区域
			getArea(){
				let me = this
                api.routeLine.getAllarea().then(function(res) {
                	if(res.data.status === 0){
                		res.data.data.forEach((ob)=>{
                			ob.label = ob.areaname
		                    ob.value = ob.id
                            me.areaData[0].children.push(ob)
		                    if(ob.emphasis != 2 && ob.default_allow != 2) {
		                    	me.areaData[1].children.push(ob)
		                    }
		                    if(ob.emphasis == 2){
		                    	me.areaData[2].children.push(ob)
		                	}
		                    if(ob.default_allow == 2){
		                     	me.areaData[3].children.push(ob)
		                    }
                		})
                	}else{
                    	me.$message.error(res.data.msg)
                	}
                })
			},
			getCardNum(ev) {
                let me = this
                if (ev.keyCode == 38 || ev.keyCode == 40) return;
                if (!/^[0-9]+$/.test(me.formInline.callcard)) {
                	me.searchform.rfcard_id = ''
                    me.userList = []
                    return
                }
                api.routeLine.getstaff({
                    rfcard_id: me.formInline.callcard
                }).then(function(res) {
                       me.userList = res.data.data
                })
            },
            //        选择卡号名字
            selects(row) {
                this.formInline.callcard = row.rfcard_id
                this.searchform.rfcard_id = row.rfcard_id
                this.userList = []
            },
			clickLine(row){
				var rdata = {
            		card_id:row.cardId,
            		intoTime:row.startTime,
            		outTime:row.endTime,
            		name:row.name,
            		type:row.workday
            	}
            	if(row.endTime=='出井异常'){
            		rdata.outTime = moment(new Date(), 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
            	}
	    		this.$router.push({name:'detailTable',query:rdata})
			},
 		},
 		mounted(){
        	this.dayQuery = _.cloneDeep(this.columnList)
			this.getDepartlist()
			this.getAll()
			this.getArea()
			this.getWorktype()
        	this.nowtime = moment().format('YYYY-MM-DD')//打印时间
 		},
 		created(){
 			this.showdata = false
 			this.selectArea = [1]
    		this.days =this.$route.query.day || new Date()
    		this.checkday = this.dayTime(this.days)
    		if(this.$route.query.area_ids){
    			let arr = [parseInt(this.$route.query.area_ids)]
    			this.searchform.area_ids = arr
    			this.selectArea = [1,parseInt(this.$route.query.area_ids)]
    		}
            else if(this.$route.query.type) {
            	let arr = [parseInt(this.$route.query.type)]
            	this.selectArea = arr
            	this.searchform.type = this.$route.query.type
            }
            else{
            	this.selectArea = [1]
            }
            this.$route.query.label?this.selectPerson = this.$route.query.label:this.selectPerson = '所有'
            this.onSearch()
 		}
 	}

</script>
