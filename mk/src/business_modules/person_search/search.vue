<style lang="less" scope>
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
    .over{
    	margin-left: 80px;
    }
    .redword{
    	color: red
    }
</style>
<template>
	<div class="imitate_card" v-if="showdata">
        <div class="card_header">
            <span class="fa fa-file-text">
			&nbsp;<span class="font_title">{{headlist[aname].title}}</span>
			</span>
        </div>
        <div class="card_body">
			<el-row>
				<el-form :inline="true" ref="searchform" :model="searchform" label-width="70px">
					<el-form-item label="卡号" v-if="headlist[aname].isread">
					    <el-input size="small" v-model="searchform.rfcard_id" style="width:130px"  @keyup.native="getCardNum($event)" placeholder="请输入卡号关键字"></el-input>
					    <div class="select_card" style="position: absolute;z-index: 555;cursor: pointer;" v-if="userList.length!=0">
					    	<el-table :data="userList" border @row-click="sele">
                                <el-table-column v-for="item in columns1" :prop="item.key" :label="item.title"></el-table-column>
                            </el-table>
					    </div>
					</el-form-item>
					<span v-if="headlist[aname].isday">
					 	<el-form-item label="时间">
							<el-date-picker
						      v-model="days"
						      @change = "selectDay"
						      align="right"
						      type="date"
						      size="small"
						      placeholder="选择日期">
						    </el-date-picker>
					 	</el-form-item>
				    </span>
					<el-form-item label="工作区域" v-if="headlist[aname].isWorkplace">
					    <el-select size="small" clearable v-model="searchform.workerPlaceId" style="width:145px">
					    	<el-option key="" label="所有区域" value=""></el-option>
	                        <el-option
	                        	v-for="item in areaList"
	                        	:value="item.id"
	                        	:label="item.areaname"
	                        	:key="item.id">
	                        	<span style="float: left">{{ item.areaname }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.emphasis ==1?'':'重点区域'}}{{item.default_allow ==1?'':'限制区域'}}</span>
	                    	</el-option>
	                    </el-select>
					</el-form-item>
					<span v-if="headlist[aname].isPer">
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
					</span>
					<el-form-item label="职务" v-if="headlist[aname].isDuty">
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
					<el-form-item label="工作区域" v-if="headlist[aname].isArea">
					    <el-select clearable size="small" v-model="searchform.area_id" style="width:130px">
					    	<el-option
								v-for="item in areaList"
								:key="item.id"
								:label="item.areaname"
								:value="item.id">
								<span style="float: left">{{ item.areaname }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.emphasis ==1?'':'重点区域'}}{{item.default_allow ==1?'':'限制区域'}}</span>
							</el-option>
					    </el-select>
					</el-form-item>
				    <el-form-item label="" v-if="headlist[aname].isCheck">
						<el-checkbox v-model="checked">特种人员</el-checkbox>
				 	</el-form-item>
					<span v-if="headlist[aname].isTimeRange">
					  	<el-form-item label="开始时间" >
                           	<el-date-picker size="small" v-model="starttime" type="date" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px"></el-date-picker>
					   	</el-form-item>
			            <el-form-item label="结束时间" >
		                   	<el-date-picker size="small" v-model="endtime" type="date" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px"></el-date-picker>
						</el-form-item>
					</span>
					<span v-if="headlist[aname].isCardNum">
						<el-form-item label="读卡器">
					    	<el-select size="small" filterable width="135px" clearable v-model="searchform.devid">
						    	<el-option
                 					v-for="item in routeCardList"
				                 	:key="item.id"
			                 		:label="item.addr"
				                 	:value="item.id">
				                 	<span style="float: left">{{item.addr}}</span>
      								<span style="float: right; color: #8492a6; font-size: 13px">{{item.position}}</span>
				              	</el-option>
					  		</el-select>
						</el-form-item>
					</span>
					<el-form-item>
	                 	<el-button size="small" type="primary"  @click="onSearch(1,state.listinfo.numperPage)" icon="el-icon-search">查询</el-button>
		               	<el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
          			</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<el-tabs v-model="activeName1" @tab-click="handleClick" v-if="headlist[aname].isCard1">
					<el-tab-pane
					    v-for="(item, index) in personAlarmTab"
					    :key="item.name"
					    :label="item.title"
					    :name="item.name">
					</el-tab-pane>
				</el-tabs>
			</el-row>
			<div id="show" class="show-image mytable">
			    	<h4 v-if="showpage&&!headlist[aname].isCard1">{{headlist[aname].title}}</h4>
			    	<h4 v-if="showpage&&headlist[aname].isCard1">{{personAlarmTab[activeName1-1].title}}</h4>
			    	<div style="display: flex;flex-direction: row;margin-bottom:10px;" v-if="headlist[aname].isInform">
						<div>当日井下人员数/井下允许总人数：<span :class="MaxPersonNumber>MaxAllow?'redword':''">{{MaxPersonNumber}}</span>/<span>{{MaxAllow}}</span></div>&nbsp;&nbsp;
						<div class="over">超员总数：<span class="redword" v-if="MaxPersonNumber>MaxAllow">{{MaxPersonNumber-MaxAllow}}</span></div>&nbsp;&nbsp;
						<div class="over">超时人员总数：<span class="redword" v-if="overTimeNum!==0">{{overTimeNum}}</span></div>
					</div>
					<div v-if="headlist[aname].isCard1&&(activeName1==6||activeName1==7)">超员总数:<span class="redword">{{MaxPersonNumber1}}</span></div>
					<div v-if="headlist[aname].isCard1&&(activeName1==4||activeName1==5)">超时人员总数:<span class="redword">{{overTimeNum1}}</span></div>
					<!-- 每天下井人员 -->
				    <print-info :excelColumns="headlist[aname].columnList" v-if="!headlist[aname].PrintOne" :print="headlist[aname].One" :showLine="headlist[aname].showLine" :tableExcelData="!showpage?state.showlist:tableData" @goLine="goLine" ref="print"></print-info>
				    <!-- 员工告警、通讯异常 -->
				    <print-page @checkDetails="checkDetail"  v-if="headlist[aname].PrintOne" :excelColumns="headlist[aname].columnList" :printOb="printOb" :tableExcelData="!showpage?state.showlist:tableData" ref="print" :showEdit="showEdit"></print-page>
		    </div>
			<my-pagination></my-pagination>
			<el-dialog :visible.sync="alarmShow" width="900px" :close-on-click-modal='false' title="详情">
	         	<div id="sensor">
		         	<div style="display: flex;flex-direction: row;margin-bottom:10px;margin-top:5px">
		         		<div>区域：<span class="redword">{{sensor.sensortype}}</span></div>&nbsp;&nbsp;
		         		<div>区域超员总数：<span class="redword">{{sensor.overMan}}</span></div>&nbsp;&nbsp;
						<div>报警时间：<span class="redword">{{sensor.ranges}}</span></div>&nbsp;&nbsp;
						<div>报警时长(分)：<span class="redword">{{sensor.duration}}</span></div>&nbsp;&nbsp;
						<div v-if="!showpage2"><span class="redword"><el-button size="small" type="primary" icon="el-icon-printer"  style="margin-top:-5px" @click="export2">打印数据</el-button></span></div>
		         	</div>
	         	   <print-page :excelColumns="thead2" :tableExcelData="!showpage2?state.showlist2:tablist" :printOb="printOb"></print-page>
	         	</div>
	         	<second-pagination ></second-pagination>
         	</el-dialog>
		</div>
	</div>
</template>
<script>
	import store from 'src/store'
	import api from 'src/api'
	import moment from 'moment'
	import _ from 'lodash'
	import printInfo from '../../business_bar/print2.vue';
	import printPage from '../../business_bar/print.vue';
	export default {
		components: {
    		printInfo,
    		printPage
    	},
		data() {
			return {
				printOb:{
	    			showLine:false,
	    			thead:'',
	    			tbody:'',
	    			showEdit:false
    		    },
    		    showEdit:false,
    		    thead2:[
				{
					key:'card_id',
					title:'卡号'
				},
				{
					key:'name',
					title:'姓名'
				},
        	   ],
        	    sensor:{},
    		    alarmShow:false,
    		    tablist:[],
    		    showpage2:false,
				MaxAllow:'',//井下允许人数
				MaxPersonNumber:'',//井下已在人数
				MaxPersonNumber1:'',
				overTimeNum1:'',
				overTimeNum:'',//超时人数
				days:'',//选择日期
				checkday:'',
				searchform:{
					depart_id:'',//部门
					worktype_id:'',//工种
					area_id:'',//区域
					emphasis:'',
					dutyId:'',
					starttime: '',
	      	  		cur_page:'',
	      	  		page_rows:'',
					special:'',
	      	  		iType : 'UnderMineOvermanQueryService'
				},
				warnForm:{
					starttime:'',
					endtime:'',
					id:'',
				},
				alarmForm:{
				},
				showpage:false,
				checked:false,
				selectPerson:'所有',
				starttime:'',
				endtime:'',
				state:store.state,
				action:store.actions,
				userList:[],
				aname:'',
				typeList:[],
				dayQuery:[],
				workplace:[],//工作位置
				dutyList:[],//职务
				routeCardList:[],
				columns1:[
				{
                    title: '姓名',
                    key: 'name'
                }, {
                    title: '卡号',
                    key: 'rfcard_id'
                }, {
                    title: '工种',
                    key: 'worktypename'
                }],
				activeName1:'',
				disabled:false,
				deplist:[],//单层部门列表
			    areaList:[],//区域
				personAlarmTab:[
					{title:'限制区域报警',name:'1'},
					{title:'门禁异常报警',name:'2'},
					{title:'人员失联报警',name:'3'},
					{title:'区域超时报警',name:'4'},
					{title:'井下超时报警',name:'5'},
					{title:'区域超员报警',name:'6'},
					{title:'井下超员报警',name:'7'},
				],
				head: {
					// 限制区域报警
		        	'1':[
		        	{
			          	title:'姓名',
			          	key:'name'
		          	},
		          	{
			          	title:'卡号',
			          	key:'card_id'
		          	},
		          	{
			          	title:'区域',
			          	key:'areaname'
		         	},
		          	{
			          	title:'位置',
			          	key:'position'
		          	},
		          	{
			          	title:'报警时间',
			          	key:'responsetime'
		          	}
				  	],
				  	// 门禁异常报警
		         	'2':[
		          	{
			          	title:'姓名',
			          	key:'name'
		          	},
		          	{
			          	title:'卡号',
			          	key:'card_id'
		          	},
		          	{
			          	title:'门禁卡号',
			          	key:'entranceGuardNum'
		          	},
		          	{
			          	title:'位置',
			          	key:'position'
		          	},
		          	{
			          	title:'告警时间',
			          	key:'responsetime'
		          	},
				     ],
				     //人员失联报警
		          	'3':[
		          	{
			          	title:'姓名',
			          	key:'name'
		          	},
		          	{
			          	title:'卡号',
			          	key:'card_id'
		          	},
		          	{
			          	title:'最后出现的位置',
			          	key:'position'
		          	},
		          	{
			          	title:'最后出现的时间',
			          	key:'responsetime'
		          	},
		          	{
			          	title:'最后出现的区域',
			          	key:'areaname'
		          	},
		          	{
			          	title:'失联时间(分)',
			          	key:'during'
		          	}
				    ],
				    // 区域超时报警
				    '4':[
		          	{
			          	title:'姓名',
			          	key:'name'
		          	},
		          	{
			          	title:'卡号',
			          	key:'card_id'
		          	},
		          	{
		          		title:'区域',
			          	key:'areaname'
		          	},
		          	{
			          	title:'区域最大允许时长(分)',
			          	key:'max_time'
		          	},
		          	{
			          	title:'入井时刻',
			          	key:'inarea_time'
		          	},
		          	{
			          	title:'开始时间',
			          	key:'alarm_time'
		          	},
		          	{
			          	title:'结束时间',
			          	key:'endtime'
		          	},
		          	{
			          	title:'超时时长(分)',
			          	key:'timeout_time'
		          	},
				    ],
				    // 井下超时报警
				    '5':[
		          	{
			          	title:'姓名',
			          	key:'name'
		          	},
		          	{
			          	title:'卡号',
			          	key:'card_id'
		          	},
		          	{
			          	title:'井下最大允许时长(分)',
			          	key:'max_time'
		          	},
		          	{
			          	title:'入井时刻',
			          	key:'inarea_time'
		          	},
		          	{
			          	title:'开始时间',
			          	key:'alarm_time'
		          	},
		          	{
			          	title:'结束时间',
			          	key:'endtime'
		          	},
		          	{
			          	title:'超时时长(分)',
			          	key:'timeout_time'
		          	},
				    ],
				    // 区域超员报警
				    '6':[
		          	{
		          		title:'区域',
			          	key:'areaName'
		          	},
		          	{
			          	title:'区域总人数',
			          	key:'personNum',
		          	},
		          	{
			          	title:'区域限制人数',
			          	key:'maxAllow'
		          	},
		          	{
			          	title:'区域超员人数',
			          	key:'overNum',
			          	flag:true
		          	},
		          	{
			          	title:'开始时间',
			          	key:'responsetime'
		          	},
		          	{
			          	title:'结束时间',
			          	key:'endtime'
		          	},
		          	{
			          	title:'报警时长(分)',
			          	key:'times'
		          	}],
		          	// 井下超员报警
		          	'7':[
		          	{
			          	title:'井下总人数',
			          	key:'personNum',
		          	},
		          	{
			          	title:'井下限制人数',
			          	key:'maxAllow'
		          	},
		          	{
			          	title:'井下超员人数',
			          	key:'overNum',
			          	flag:true
		          	},
		          	{
			          	title:'开始时间',
			          	key:'responsetime'
		          	},
		          	{
			          	title:'结束时间',
			          	key:'endtime'
		          	},
		          	{
			          	title:'报警时长(分)',
			          	key:'times'
		          	}
				    ],
				},
				headlist:{
					'dayQueryWell':{
						title:'每天下井人员查询',
						PrintOne:false,
						isPer:true,
						showLine:true,
						isday:true,
						isInform:true,
						isCheck:true,
						isWorkplace:true,
						isDuty:true,
						columnList:[
							{
					          	title:'卡号',
					          	key:'rfcard_id'
				          	},
				          	{
					          	title:'姓名',
					          	key:'name'
				          	},
				          	{
					          	title:'部门',
					          	key:'departName'
				         	},
				          	{
					          	title:'工种',
					          	key:'worktypeName'
				          	},
				          	{
								title:'异常情况',
					          	key:'remark',
					          	rowspan:true
				          	},
				          	{
					          	title:'入井时刻',
					          	key:'starttime',
					          	rowspan:true
				         	},
				          	{
					          	title:'出井时刻',
					          	key:'endtime',
					          	rowspan:true
				          	},
				          	{
					          	title:'下井工作时间',
					          	key:'wellduration',
					          	rowspan:true
				          	}
				        ]},
						'personAlarmSearch':{
							PrintOne:true,
							title:'员工告警查询',
							isTimeRange:true,
							isArea:true,
							isread:true,
							isSearch:true,
							isStatus:true,
							isCard1:true
						},
						'messageError':{
							title:'通讯异常查询',
							isTimeRange:true,
							isCardNum:true,
							PrintOne:true,
							columnList:[
								{
									key:'alais',
									title:'测点号'
								},
								{
									key:'position',
									title:'位置'
								},
								{
									key:'starttime',
									title:'开始时间'
								},
								{
									key:'endtime',
									title:'结束时间'
								},
							    {
									key:'times',
									title:'异常时长'
								}]
						},
				},
				showdata:false,
				tableData:[],
				allData:[]
			}

		},
		watch:{
 		 	 '$route':'fecthdata',
	    	 'state.listinfo.currentPage' : {
			      handler: function (newValue, oldValue) {
			        this.onSearch(newValue,this.state.listinfo.numperPage)
			      },
			      deep: true
			    },
			    'state.listinfo.numperPage' : {
			      handler: function (newValue, oldValue) {
			        this.onSearch(this.state.listinfo.currentPage,newValue)
			      },
			      deep: true
			 },
			 'state.listinfo2' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList2(this.tablist)
		      },
		      deep: true
		    },
    	},
		methods: {
			//职务、工作地点
			getAll(){
				var vm = this
				api.searchs.getallData().then((res)=>{
					if(res.data.status === 0){
						vm.workplace = res.data.workplace
						vm.dutyList = res.data.duty
					}
				})
			},
			onSearch(page,rows){
				let vm = this
				vm.tableData = []
				if(vm.$route.query.day){
		  			vm.searchform.starttime = vm.$route.query.day
				}
				if(vm.headlist[vm.aname].isday){
					vm.searchform.starttime = vm.dayTime()
				}else{
					vm.searchform.starttime = vm.beginTime()
				}
	        	if(vm.checked){
	        		vm.searchform.special = 1
					vm.searchform.worktype_id = ""
	        	}else{
	        		delete vm.searchform.special
	        	}
	        	if(vm.aname=='messageError'){//通讯异常查询
	        		vm.warnForm.starttime = vm.beginTime()
	        		vm.warnForm.endtime = vm.endTime()
	        		vm.warnForm.id = vm.searchform.devid||0
	        	   	api.searchs.getAll(vm.aname,vm.warnForm).then((res)=>{
	        	   		if(res.data.status==0){
	        	   			vm.showdata = true
	        	   			vm.tableData = res.data.data
	        	   			vm.action.setShowList(vm.tableData)
	        	   		}
	        	   	})
	        	}
	        	else if(vm.aname=='personAlarmSearch'){//员工告警查询
	        		vm.alarmForm.cur_page = page || (vm.state.listinfo.currentPage)
	                vm.alarmForm.page_rows = rows || (vm.state.listinfo.numperPage)
	        		vm.alarmForm.starttime = vm.beginTime()
	        		vm.alarmForm.endtime = vm.endTime()
	        		vm.alarmForm.card_id = vm.searchform.rfcard_id||''
	        		vm.alarmForm.type = vm.activeName1
	        		if(vm.activeName1==4||vm.activeName1==6){
	        		  vm.alarmForm.area_id = vm.searchform.area_id
	        		}else{
	        			vm.alarmForm.area_id = ''
	        		}
	        	   	api.searchs.getAll(vm.aname,vm.alarmForm).then((res)=>{
	        	   		if(res.data.status==0&&res.data.data){
	        	   			vm.showdata = true
	        	   			vm.tableData = res.data.data
	        	   			vm.MaxPersonNumber1 = res.data.count
	        	   			vm.overTimeNum1 = res.data.count
	        	   			vm.action.setCutList(vm.tableData,res.data.search.total_rows,res.data.search.cur_page)
	        	   		}else{
	        	   			vm.showdata = true
	        	   			vm.tableData = []
	        	   		}
	        	   	})
	        	}
	        	else{
		        	api.searchs.getDaily(vm.aname,vm.searchform.starttime,vm.searchform).then((res)=>{
			            if (res.data.status === 0) {
							vm.MaxPersonNumber = res.data.overMan.MaxPersonNumber
							vm.MaxAllow = res.data.overMan.MaxAllow
							vm.overTimeNum = res.data.OverTime
							vm.allData = Object.values(res.data.inMine)
                         	vm.tableData = []
                            if(vm.selectPerson=='所有') {
                                vm.tableData = Object.values(res.data.inMine)
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
			beginTime(){
	      		return moment(this.starttime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
			},
			endTime(){
	      		return moment(this.endtime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
			},
			dayTime(){
				return moment(this.days, 'YYYY/MM/DD').format('YYYY-MM-DD')
		    },
		    // 切换告警tab
			handleClick(){
				this.state.showlist = []
				this.state.listinfo.count = 0
				this.state.listinfo.currentPage = 1
				if(this.activeName1==4||this.activeName1==6){
                   this.headlist[this.aname].isArea = true
	        	}
                else{
	        		this.headlist[this.aname].isArea = false

	        	}
	        	this.headlist[this.aname].columnList = this.head[this.activeName1+'']
	        	this.onSearch()
			},
			export2(){
	        	this.showpage2 = true
	        	setTimeout(() => {
	        		this.showpage2 = false
			  		$('#sensor').jqprint()
			  	},10)
	        },
			exportPrint(){
            	this.showpage = true
            	this.$refs.print.getPrintInfo()
            	this.headlist[this.aname].showLine = false
	        	setTimeout(() => {
		  			$('#show').jqprint()
		  			this.showpage = false
		  			this.printOb.showEdit = false
	  			    this.showEdit = false
		  			setTimeout(() => {
                        this.headlist[this.aname].showLine = true
                    },1)
		  		},50)
			},
			fecthdata(){
				if(this.$route.query.day){
				  this.days =this.$route.query.day
				}
				this.state.listinfo.count = 0
				this.state.listinfo.currentPage = 1
				this.showpage = false
				this.aname = this.$route.params.aname
	    		this.tableData = []
                this.showdata = false
                if(this.aname=='personAlarmSearch'){
                	this.headlist[this.aname].isArea = true
                	if(this.$route.query.alarm){
                	  this.headlist[this.aname].columnList = this.head[this.$route.query.alarm]
                	  this.activeName1 = this.$route.query.alarm + ''
				    }else{
				    	this.activeName1 = '4'
				    	this.headlist[this.aname].columnList = this.head[this.activeName1+'']
				    }
                }
                if(this.aname =='dayQueryWell'){
                	this.dayQuery = _.cloneDeep(this.headlist['dayQueryWell'].columnList)
                	//this.onSearch()
                }
                this.onSearch(1,this.state.listinfo.numperPage)
			},
			//获取区域
			getAllarea(){
				let me = this
                api.routeLine.getAllarea().then(function(res) {
                    if (res.data.status === 0) {
                        me.areaList = res.data.data
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
			},
			//获取工种
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
			// 卡号查询
			getCardNum(ev){
				let me = this
                if (ev.keyCode == 38 || ev.keyCode == 40) return;
                if (!/^[0-9]+$/.test(me.searchform.rfcard_id)) {
                    me.userList = []
                    return
                }
                api.routeLine.getstaff({rfcard_id: me.searchform.rfcard_id}).then(function(res) {
                	if(res.data.status===0){
                    	me.userList = res.data.data
                	}else{
                        me.$message.error(res.data.msg)
                    }
                })
			},
			sele(ev){
				this.searchform.rfcard_id = ev.rfcard_id
				this.userList = []
			},
			//获取单层部门
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
			//获取读卡器
			getCard() {
                var vm = this
                api.routeLine.getCard({}).then(function(res) {
                	if(res.data.status==0){
                    	vm.routeCardList = res.data.data
                	}else{
                        vm.$message.error(res.data.msg)
                    }
                })
            },
            //选取日期
            selectDay(val){
            	this.checkday = val
            },
            checkDetail(ob){
            	this.alarmShow = true
            	this.sensor.overMan = ob.overNum
            	this.sensor.sensortype = ob.areaName
    		    this.sensor.ranges = ob.responsetime+'~~'+ob.filltime
    		    this.sensor.duration = ob.times
	    		this.tablist = ob.list
	    		this.action.setShowList2(this.tablist)
            },
            goLine(id,ob,user){
            	var rdata = {
            		card_id:id,
            		intoTime:ob.starttime,
            		outTime:ob.endtime,
            		name:user.name,
            		time:user.workday
            	}
            	if(ob.endtime=='出井异常'){
            		rdata.outTime = moment(new Date(), 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
            	}
	    		this.$router.push({name:'detailTable',query:rdata})
	    	},

		},
		created(){
			this.endtime = new Date();
		    this.starttime = new Date();
		    this.starttime.setTime(this.starttime.getTime()- 3600 * 1000 * 24 * 1);
    		this.days = this.$route.query.day || new Date()
    		this.selectPerson = this.$route.query.label?this.$route.query.label:'所有'
		},
		mounted() {
    		this.checkday = this.dayTime()
			this.fecthdata()
			this.getAll()
			this.getCard()
			this.getAllarea()
			this.getWorktype()
			this.getDepartlist()
		},
	};
</script>

