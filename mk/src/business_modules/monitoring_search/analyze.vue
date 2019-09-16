<style scoped>
	.el-table__body-wrapper td{
        cursor: pointer;
	}
	.mytable table td{
        cursor: pointer!important;
	}
	.redword{
    	color: red
    }
</style>
<template>
     <div>
		<el-card v-if="showdata">
			<p slot="header">
				<i class="el-icon-date"></i>
			 	<span>{{headlist[aname].title[this.kindex-1]}}</span>
			</p>
			<el-row class="formcss">
				<el-form class="search" :inline="true" ref="searchform" label-width="70px">
					<el-form-item label="测点" v-if="headlist[aname].isMsensor">
				    	<el-cascader style="width:225px"
				    		:clearable = 'true'
				            :options="MSensor"
				            v-model="selectedMSensor"
				            :props="casMSensor"
				            placeholder="所有测点"
				            size="small"
				            filterable
				            change-on-select
				            :show-all-levels = 'false'
				            @change="handleChange">
			            </el-cascader>
					</el-form-item>
					<el-form-item label="测点" v-if="headlist[aname].isKsensor">
				    	<el-cascader style="width:225px"
				            :options="KSensor"
				            :clearable = 'true'
				            v-model="selectedKSensor"
				            :props="casMSensor"
				            placeholder="所有测点"
				            size="small"
				            filterable
				            change-on-select
				            :show-all-levels = 'false'
				            @change="handleChange">
			            </el-cascader>
					</el-form-item>
					<el-form-item label="测点" v-if="headlist[aname].allsensor">
				    	<el-cascader style="width:225px"
				            :options="AllSensor"
				            :clearable = 'true'
				            v-model="selectedallSensor"
				            :props="casMSensor"
				            placeholder="所有测点"
				            size="small"
				            filterable
				            change-on-select
				            :show-all-levels = 'true'
				            @change="handleChange">
			            </el-cascader>
					</el-form-item>
                    <el-form-item label="位置">
                        <el-select size="small" v-model="search.sensor_position" @change="choosePosition" placeholder="所有位置" filterable clearable style="width:100%;">
                            <el-option key="" label="所有位置" :value="0"></el-option>
                            <el-option
                                v-for="item in AllPositionList"
                                :key="item.id"
                                :label="item.v"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班次" v-if="headlist[aname].isClass">
			    		<el-select size="small" v-model="classtime" placeholder="所有班次" @change="chooseClass" filterable clearable style="width:100%;">
                            <el-option key="" label="所有班次" :value="0"></el-option>
                            <el-option
                                v-for="item in classOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
					</el-form-item>
					<el-form-item label="类型" v-if="headlist[aname].isType">
			    		<el-select size="small" v-model="equiptype" placeholder="所有类型" @change="chooseEquip" filterable clearable style="width:100%;">
                            <el-option key="" label="所有类型" :value="0"></el-option>
                            <el-option
                                v-for="item in equipList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                            </el-option>
                        </el-select>
					</el-form-item>
					<el-form-item>
					  	<span v-if="headlist[aname].isday">
						 	<el-form-item label="日期">
								<el-date-picker  size="small"
							      v-model="days"
							      @change = "select"
							      :clearable="false"
							      align="right"
							      type="date"
							      placeholder="选择日期"
							      :picker-options="pickerOptions1"
							      format="yyyy 年 MM 月 dd 日"
  								  value-format="yyyy-MM-dd">
							    </el-date-picker>
						 	</el-form-item>
					    </span>
						<span v-if="headlist[aname].isTimeRange">
							<el-form-item label="开始时间" >
			                   	<el-date-picker
					                v-model="starttime"
					                :clearable="false"
					                type="datetime"
					                placeholder="开始时间"
					                size="mini"
					                format="yyyy-MM-dd HH:mm:ss"
					                value-format="yyyy-MM-dd HH:mm:ss">
				                </el-date-picker>
						  	</el-form-item>
				            <el-form-item label="结束时间" >
			                   <el-date-picker
					                v-model="endtime"
					                :clearable="false"
					                type="datetime"
					                placeholder="开始时间"
					                size="mini"
					                format="yyyy-MM-dd HH:mm:ss"
					                value-format="yyyy-MM-dd HH:mm:ss">
				                </el-date-picker>
							</el-form-item>
						</span>
						<span v-if="headlist[aname].isSqlday">
							<el-form-item label="开始时间" >
                        		<el-time-picker
					                v-model="startstime"
					                :clearable="false"
					                type="date"
					                placeholder="开始时间"
					                size="mini"
					                format="HH:mm:ss"
					                value-format="HH:mm:ss">
				                </el-time-picker>
						  	</el-form-item>
				            <el-form-item label="结束时间" >
                        		<el-time-picker
					                v-model="endstime"
					                :clearable="false"
					                type="date"
					                placeholder="结束时间"
					                size="mini"
					                format="HH:mm:ss"
					                value-format="HH:mm:ss">
					            </el-time-picker>
							</el-form-item>
						</span>
                        <el-button icon="el-icon-arrow-left" type="primary" @click="setday(-1)" v-if="headlist[aname].isday&&!headlist[aname].isSqlday" size="small">前一天</el-button>
                        <el-button type="primary"  @click="setday(1)" size="small" v-if="headlist[aname].isday&&!headlist[aname].isSqlday">后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
					   	<el-button type="primary"  v-if="headlist[aname].isBtn" @click="getAll(1,state.listinfo.numperPage)" icon="el-icon-search" size="small">查询</el-button>
	                 	<el-button type="primary"  @click="exportPrint" icon="ios-printer-outline" style="margin-left:5px" size="small">打印表格</el-button>
	                 	<el-button type="primary"   icon="ios-undo"   style="margin-left:5px" v-if="headlist[aname].model" @click="$router.go(-1)" size="small">返回</el-button>
					</el-form-item>
                </el-form>
         </el-row>
			    <div id="show" class="show-image mytable" v-loading.body="isloading">
			    	<h2 style="text-align:center" v-if="showpage">{{headlist[aname].title[this.kindex-1]}}<span v-if="classname">——{{classname}}</span><span>(<span>{{search.endtime?search.starttime:search.starttime.split(" ")[0]}}</span><span v-if="search.endtime">~{{search.endtime}}</span>)</span></h2>
					<div style="text-align:right" v-if="showpage">打印时间：{{nowtime}}</div>
				    <print-info @checkDetails="checkDetails"  :excelColumns="headlist[aname].isTable1?headlist[aname].columnList:headlist[aname].columnList[this.kindex-1]" :tableExcelData="!showpage?state.showlist:tableData"  :printOb="printOb" ref="print"></print-info>
		       	</div>
                <my-pagination></my-pagination><!-- 分页组件 -->
        <el-dialog :visible.sync="alarmShow" width="70%" :close-on-click-modal='false' title="详情">
         	<div id="sensor">
				<h1 style="text-align:center" v-if="showpage2">{{headlist[aname].title[this.kindex-1]}}<span v-if="classname">——{{classname}}</span><span>(<span>{{search.endtime?search.starttime:search.starttime.split(" ")[0]}}</span><span v-if="search.endtime">~{{search.endtime}}</span>)</span></h1>
	         	<div style="display: flex;flex-direction: row;margin-bottom:10px;margin-top:5px">
					<div>设备类型：<span class="redword">{{sensor.sensortype}}</span></div>&nbsp;
					<div v-if="sensor.limit_alarm">报警浓度：<span class="redword">{{sensor.limit_alarm}}</span></div>&nbsp;
					<div v-if="sensor.power">断电门限：<span class="redword">{{sensor.power}}</span></div>&nbsp;
					<div v-if="sensor.repower">复电门限：<span class="redword">{{sensor.repower}}</span></div>&nbsp;
					<div v-if="sensor.average">平均值：<span class="redword">{{sensor.average}}</span></div>&nbsp;
					<div v-if="sensor.valueMax">最大值：<span class="redword">{{sensor.valueMax}}</span></div>&nbsp;
					<div v-if="sensor.timeMax">最大值时间：<span class="redword">{{sensor.timeMax}}</span></div>&nbsp;
					<div v-if="!showpage2">查询时间：<span class="redword">{{search.endtime?search.starttime:search.starttime.split(" ")[0]}}</span><span v-if="search.endtime" class="redword">~{{search.endtime}}</span></div>&nbsp;
					<div v-if="sensor.duration">累计时长：<span class="redword">{{sensor.duration}}</span></div>&nbsp;
					<div v-if="!showpage2"><span class="redword"><el-button @click="export2" type="primary" icon="el-icon-printer" size="small" style="margin-top:-5px">打印数据</el-button></span></div>
	         	</div>
				<div style="text-align: right" v-if="showpage2">打印时间：{{nowtime}}</div>
				<!-- 模拟量报警、模拟量报警日（班）报表报警详情 -->
	         	<print-info :excelColumns="alarmlist" :tableExcelData="!showpage2?state.showlist2:tablist" v-if="$route.params.aname=='getTable/1'||$route.params.aname=='analoginfo/1'" :printOb="printOb" ref="print"></print-info>
				<!-- 模拟量断电控制、模拟量馈电异常、模拟量断电控制日（班）报表、模拟量馈电异常日（班）报表等异常详情 -->
                <print-feed :excelColumns="detailHead" :tableExcelData="!showpage2?state.showlist2:tablist" v-if="headlist[aname].showMsensor&&$route.params.aname!='getTable/1'&&$route.params.aname!='analoginfo/1'" ref="print"></print-feed>
                <!-- 开关量馈电异常、开关量报警、开关量断电控制、开关量馈电异常日（班）报表、开关量报警及断电日（班）报表、开关量断电日（班）报表等异常详情 -->
         	   	<print-info :excelColumns="detailHead2" :tableExcelData="!showpage2?state.showlist2:tablist" v-if="headlist[aname].showKsensor&&$route.params.aname!='switchStatement/4'" :printOb="printOb" ref="print"></print-info>
         	   	<!-- 开关量状态变动日(班)报表 变动次数详情-->
         	   	<print-info :excelColumns="detailHead3" :tableExcelData="!showpage2?state.showlist2:tablist" v-if="$route.params.aname=='switchStatement/4'||$route.params.aname=='switchStateChange/1'" :printOb="printOb" ref="print"></print-info>
         	   	<!-- 监控设备故障日(班)报表故障详情 -->
         	   	<print-info :excelColumns="detailHead4" :tableExcelData="!showpage2?state.showlist2:tablist" v-if="headlist[aname].showEquip" :printOb="printOb" ref="print"></print-info>
         	   	<!-- 模拟量统计值历史记录 统计详情 -->
         	   	<print-info :excelColumns="detailHead5" :tableExcelData="!showpage2?state.showlist2:tablist" v-if="$route.params.aname=='nday/1'" :printOb="printOb" ref="print"></print-info>
         	</div>
         	<second-pagination ></second-pagination>
         </el-dialog>
      </el-card>
    </div>
</template>

<script>
import api from 'src/api'
import _ from 'lodash'
import moment from 'moment'
import store from 'src/store'
import printInfo from '../../business_bar/print.vue';
import printFeed from '../../business_bar/print3.vue';

export default {
    name: 'role',
    components: {
    	printInfo, //print-info
        printFeed, //print-feed
    },
    data () {
    	return {
    		printOb:{
    			showLine:false,
    			thead:'',
    			tbody:'',
    			showEdit:false
    		},
    		search: {
    			starttime: "",
	      	  	endtime: '',
	      	  	id:0,
	      	  	cur_page:'',
	      	  	atype:'',
	      	  	sensor_type:0,
              	sensor_position:0,
	       	},
	       	casMSensor:{
	      		label: 'name',
			    value: 'id',
			    children: 'list'
	      	},
      	 	pickerOptions1:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
    		days:'',
    		starttime:"",
            endtime:'',
            startstime:"",//统计值时间
            endstime:'',//统计值时间
	       	alarmShow:false,
       		nowtime:'',//打印时间
	       	classOptions:[],
	       	classtime:'',//班次id
	       	classname: null,
			classstart: null,
      	  	classend: null,
      	  	equipList:[],//设备故障
      	  	showpage:false,
	        showpage2:false,
	        isloading:false,
	        kindex:'',
	        timeType:'',
	        sensor:{},
	      	selectedMSensor:[],
	      	selectedKSensor:[],
	      	selectedallSensor:[],
	      	tableData:[],
	      	AllSensor:[],
	      	MSensor:[],
	      	KSensor:[],
            AllPositionList:[],
	      	times:'',
	      	showdata:false,
	      	aname:'',
	      	sensor:{},
	      	tablist:[],
	      	// 模拟量报警详情
      	  	alarmlist:[{
				key:'id',
				title:'序号'
			},{
    			key:'starttime',
    			title:'报警开始时间'
    		},{
    			key:'endtime',
    			title:'报警结束时间'
    		},{
    			key:'times',
    			title:'时长'
    		},{
    			key:'avgvalue',
    			title:'平均值'
    		},{
    			key:'maxvalues',
    			title:'最大值'
    		},{
    			key:'maxtime',
    			title:'最大值时刻'
    		},{
                key:'measures',
                title:'处理措施',
                isNull:true
            },{
                key:'measurestime',
                title:'采取措施时刻',
                isNull:true
            }],
            // 模拟量断电、模拟量馈电详情
	       	detailHead:[{
				key:'id',
				title:'序号',
			},{
    			key:'starttime',
    			title:'断电时刻'
    		},{
    			key:'endtime',
    			title:'复电时刻'
    		},{
    			key:'times',
    			title:'断电累计时长'
    		},{
    			key:'avgvalue',
    			title:'平均值'
    		},{
    			key:'maxvalues',
    			title:'最大值'
    		},{
    			key:'maxtime',
    			title:'最大值时刻'
    		},{
                key: 'feedstatuslist',
                title: '断电命令/断电区域/馈电状态及时刻',//断电
                rowspan:true
            },{
                key:'measures',
				title:'处理措施',
				last:true
            },{
                key:'measurestime',
				title:'采取措施时刻',
				last:true
            }],
            // 开关量馈电异常、开关量报警、开关量断电控制、开关量馈电异常日（班）报表、开关量报警及断电日（班）报表、开关量断电日（班）报表等异常详情
            detailHead2:[{
				key:'id',
				title:'序号'
			},
            {
                key:'position',
                title:'位置',
                isNull:true
            },{
                key:'startStatus',
                title:'报警/断电状态'
            },{
                key:'areaName',
                title:'断电区域',//馈电
                isNull:true
            },{
                key:'wellduration',
                title:'累计时间'
            },{
                key:'starttime',
                title:'开始时间'
            },{
                key:'endtime',
                title:'结束时间'
            },{
                key:'measure',
                title:'处理措施',
                isNull:true
            },{
                key:'measuretime',
                title:'采取措施时刻',
                isNull:true
            }],
            // 开关量状态变动日(班)报表 变动次数详情
    		detailHead3:[{
					key:'id',
					title:'序号'
				},{
					key: 'statechange',
					title: '变动状态',
				},
			 	{
					key: 'responsetime',
					title: '变动时刻',
			}],
			// 监控设备故障日班报表故障详情
			detailHead4:[{
				key:'id',
				title:'序号'
			},{
                key:'starttime',
                title:'开始时间'
            },{
                key:'endtime',
                title:'结束时间'
            },{
                key:'times',
                title:'累计故障时长'
            },{
            	key: 'faultstatus',
				title: '故障状态',
            },{
                key:'measures',
                title:'处理措施',
                isNull:true
            },{
                key:'measurestime',
                title:'采取措施时刻',
                isNull:true
            }],
            // 模拟量统计值历史记录 统计详情
            detailHead5:[{
					key:'id',
					title:'序号'
				},{
					key:'statistictime',
					title:'统计时段'
				},{
					key:'maxvalues',
					title:'最大值'
				},{
					key:'maxtime',
					title:'最大值时刻'
				},{
					key:'avgvalue',
					title:'平均值'
				},{
					key:'minvalue',
					title:'最小值'
				},{
					key:'mintime',
					title:'最小值时刻'
				}],
            headlist: {
               'calibrationData':{
                      isMsensor: true,
                      isTimeRange:true,
                      isBtn:true,
                      title:['标校维护数据查询'],
                      'columnList':[
                      [	  {
                            key: 'alais',
                            title: '测点号',
                          },
                          {
                            key: 'position',
                            title: '安装位置',
                          },
                          {
                            key: 'sensortype',
                            title: '类型',
                          },
                          {
                            key: 'max_value',
                            title: '最大值',
                          },
                          {
                            key: 'min_value',
                            title: '最小值',
                          },
                          {
                            key: 'calibrationstatus',
                            title: '标校状态',
                          },
                          {
                            key: 'starttime',
                            title: '开始时刻',
                          },
                          {
                            key: 'endtime',
                            title: '结束时刻'
                          }],
                    ]
             },
			'analoginfo': {
				isTimeRange: true,
				isMsensor: true,
				isCut:true,
				model:true,
				showMsensor:true,
                isBtn:true,
				title: ['模拟量报警', '模拟量断电控制', '模拟量馈电异常'],
				'columnList':[[
					{
	                    key: 'alais',
	                    title: '测点号',
                  	},
					{
						key: 'position',
						title: '地址'
					},
					{
						key: 'type',
						title: '类型',
					},
					{
						key: 'unit',
						title: '单位'
					},
					{
						key: 'limit_alarm',
						title: '报警浓度',
					},
					{
						key: 'alerts',
						title: '累计报警次数',
						flag:true
					},
					{
						key: 'alertTimes',
						title: '累计报警时间'
					},
					{
						key: 'maxvalues',
						title: '报警最大值'
					},
					{
						key: 'maxtime',
						title: '最大值时刻'
					},
					],
				[	{
	                    key: 'alais',
	                    title: '测点号',
                  	},
					{
						key: 'position',
						title: '地址'
					},
					{
						key: 'type',
						title: '类型',
					},
					{
						key: 'unit',
						title: '单位'
					},
					{
						key: 'limit_power',
						title: '断电门限(上/下限)'
					},
					{
						key: 'limit_repower',
						title: '复电门限(上/下限)',
					},
					{
						key: 'alerts',
						title: '累计断电次数',
						flag:true
					},
					{
						key: 'alertTimes',
						title: '累计断电时间'
					},
					{
						key: 'maxvalues',
						title: '断电最大值',
					},
					{
						key: 'maxtime',
						title: '最大值时刻',
					},
					],
				[	{
	                    key: 'alais',
	                    title: '测点号',
                  	},
					{
						key: 'position',
						title: '地址',
						isNull:true
					},
					{
						key: 'type',
						title: '类型',
					},
					{
						key: 'powerposition',
						title: '断电区域'
					},
					{
						key: 'limit_alarm',
						title: '报警门限(上/下限)'
					},
					{
						key: 'limit_power',
						title: '断电门限(上/下限)'
					},
					{
						key: 'limit_repower',
						title: '复电门限(上/下限)'
					},
					{
						key: 'alerts',
						title: '累计异常次数',
						flag:true
					},
					{
						key: 'alertTimes',
						title: '累计异常时间'
					},
				    ]
				]
			 },
			 'switchStateChange':{
			 	title:['开关量状态变动'],
			 	isTimeRange: true,
			 	isKsensor: true,
                isBtn:true,
			 	'columnList': [
			 	 [
					{
	                    key: 'alais',
	                    title: '测点号',
                  	},
					{
						key: 'position',
						title: '地点'
					},
					{
						key: 'sensortype',
						title: '名称'
					},
					{
						key: 'alarmpower',
						title: '报警及断电状态',
					},
			 	    {
						key: 'times',
						title: '累计报警/断电时间',
					},{
                        key: 'statechangecnt',
                        title: '累计动作次数',
                        flag:true
                    },
                    ]
			 	]
			  },
			 'switchinfo': {
				isTimeRange: true,
				isKsensor: true,
				showKsensor:true,
				isCut:true,
                isBtn:true,
				title: ['开关量馈电异常','开关量报警', '开关量断电控制'],
				'columnList': [[
					{
	                    key: 'alais',
	                    title: '测点号',
                  	},
					{
						key: 'position',
						title: '地址'
					},{
						key: 'type',
						title: '类型'
					},{
						key: 'powerArea',
						title: '断电区域',
                        isNull:true
					},{
						key: 'countTime',
						title: '异常时长'
					},{
						key: 'totalnum',
						title: '异常次数',
						flag:true
					},
				],[
					{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key: 'position',
						title: '地址'
					},{
						key: 'type',
						title: '类型'
					},{
						key: 'countTime',
						title: '累计报警时间'
					},{
						key: 'totalnum',
						title: '累计报警次数',
						flag:true
					},
				],[
					{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key: 'position',
						title: '地址'
					},{
						key: 'type',
						title: '类型'
					},{
						key: 'countTime',
						title: '累计断电时间'
					},{
						key: 'totalnum',
						title: '累计断电次数',
						flag:true
					},
				]]
			 },
			 'communication': {
				isTimeRange: true,
				allsensor: true,
				isCut:true,
                isBtn:true,
				title: ['设备故障记录'],
				columnList: [[{
                    key: 'alais',
                    title: '测点号',
              	},{
					key: 'sensortype',
					title: '类型'
				},{
					key: 'position',
					title: '位置'
				},{
					key: 'faultstatus',
					title: '故障状态'
				},{
					key: 'starttime',
					title: '开始时间'
				},{
					key: 'endtime',
					title: '结束时间'
				},{
					key:'times',
					title:'中断时长'
				},{
					key: 'measures',
					title: '措施',
					isNull:true
				},{
					key: 'measurestime',
					title: '措施时间',
					isNull:true
				}]]
			 },
			'analogStatement/getottable': {
				isClass:true,
				isday:true,
				isTable1:true,
				isCut:false,
        		isMsensor: true,
				title: ['模拟量日（班）报表'],
				columnList: [
				{
                    key: 'alais',
                    title: '测点号',
              	},{
					key: 'position',
					title: '地址'
				},{
					key: 'sensortype',
					title: '类型'
				},{
					key: 'unit',
					title: '单位'
				},{
					key: 'limit_alarm',
					title: '报警门限(上/下限)'
				},{
					key: 'limit_power',
					title: '断电门限(上/下限)'
				},{
					key: 'limit_repower',
					title: '复电门限(上/下限)'
				},{
					key: 'midvalue',
					title: '平均值',
				},{
					key: 'maxvalues',
					title: '最大值'
				},{
					key: 'maxtime',
					title: '最大值时刻',
                	isNull:true
				},{
					key: 'alerts',
					title: '报警次数'
				},{
					key: 'alerttime',
					title: '累计报警时间',
                    isNull:true
				},{
					key: 'powerfres',
					title: '断电次数'
				},{
					key: 'powertime',
					title: '累计断电时间',
                    isNull:true
				},{
					key: 'feeabnums',
					title: '馈电异常次数'
				},{
					key: 'feedtime',
					title: '馈电异常累计时间',
                    isNull:true
				}],
			 },
			 'equipStatement': {
				showEquip:true,
		 	 	isday:true,
				isCut:false,
                allsensor: true,
                isClass:true,
				title: ['监控设备故障日(班)报表'],
				'columnList': [
					[{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key: 'sensortype',
						title: '类型'
					},{
						key: 'position',
						title: '地址'
					},{
						key: 'times',
						title: '累计故障时间'
					},{
						key: 'alerts',
						title: '故障次数',
						flag:true
					},
					]
				]
			 },
			 'analogStatement/getTable':{
		 	    isday:true,
		 	    isCut:false,
		 	    showMsensor:true,
                isMsensor: true,
                isClass:true,
		 	    title: ['模拟量报警日（班）报表','模拟量断电日（班）报表','模拟量馈电异常日（班）报表'],
			 	 'columnList':[
			 	    [	{
		                    key: 'alais',
		                    title: '测点号',
	                  	},{
							key:'position',
							title:'位置'
						},{
							key:'type',
							title:'类型'
						},{
							key: 'unit',
							title: '单位'
						},{
							key: 'limit_alarm',
							title: '报警门限(上/下限)'
						},{
							key: 'alerts',
							title: '报警次数',
							flag:true
						},{
							key: 'alertTimes',
							title: '累计报警时间'
						},{
							key: 'maxvalues',
							title: '报警最大值'
						},{
							key: 'maxtime',
							title: '最大值时刻'
						},{
							key: 'avgvalue',
							title: '平均值'
						},
						],
			 	    	[{
		                    key: 'alais',
		                    title: '测点号',
	                  	},{
							key:'position',
							title:'位置'
						},{
							key:'type',
							title:'类型'
						},{
							key: 'unit',
							title: '单位'
						},{
							key: 'limit_power',
							title: '断电门限(上/下限)'
						},{
							key: 'limit_repower',
							title: '复电门限(上/下限)'
					    },{
							key: 'alerts',
							title: '断电次数',
							flag:true
						},{
							key: 'alertTimes',
							title: '累计断电时间'
						},{
							key: 'maxvalues',
							title: '断电最大值'
						},{
							key: 'maxtime',
							title: '最大值时刻'
						},{
							key: 'avgvalue',
							title: '平均值'
						},
						],
			 	    	[{
		                    key: 'alais',
		                    title: '测点号',
	                  	},{
							key:'position',
							title:'位置'
						},{
							key:'type',
							title:'类型'
						},{
							key: 'powerposition',
							title: '断电区域'
						},{
							key: 'alerts',
							title: '累计次数',
							flag:true
						},{
							key: 'alertTimes',
							title: '累计时间'
						},
						],
			 	  ]
			  },
			 'switchStatement':{
			 	isday:true,
			 	showKsensor:true,
                isKsensor: true,
                isClass:true,
			 	isCut:false,
				title: ['开关量馈电异常日（班）报表','开关量报警及断电日（班）报表','开关量断电日（班）报表','开关量状态变动日(班)报表',],
				'columnList': [
					[{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key:'position',
						title:'地址'
					},{
						key:'type',
						title:'类型'
					},{
						key:'powerArea',
						title:'断电区域',
                        isNull:true
					},{
						key:'countTime',
						title:'累计异常时间'
					},{
						key:'totalnum',
						title:'异常次数',
						flag:true
					},
					],
					[{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key:'position',
						title:'地址'
					},{
						key:'type',
						title:'类型'
					},{
						key:'countTime',
						title:'累计报警时间'
					},{
						key:'totalnum',
						title:'报警次数',
						flag:true
					},
					],
					[{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key:'position',
						title:'地址'
					},{
						key:'type',
						title:'类型'
					},{
						key:'countTime',
						title:'累计断电时间'
					},{
						key:'totalnum',
						title:'断电次数',
						flag:true
					},
					],
					[{
	                    key: 'alais',
	                    title: '测点号',
                  	},{
						key: 'position',
						title: '地点'
					},{
						key: 'sensortype',
						title: '名称'
					},{
						key: 'times',
						title: '累计运行时间'
					},{
						key: 'statechangecnt',
						title: '变动次数',
						flag:true
					},
					],
				]
			 },
			 'analogStatistics':{
			 	isTable1:true,
				isCut:false,
				isBtn:true,
                isday:true,
                isSqlday:true,
                isMsensor: true,
				title:['模拟量统计值历史记录'],
				columnList:[{
		    		key:'alais',
		    		title:'测点号'
		    	},{
					key:'position',
					title:'位置'
				},{
					key:'sensortype',
					title:'传感器类型'
				},{
					key:'unit',
					title:'单位'
				},{
					key:'limit_alarm',
					title:'报警门限(上/下限)'
				},{
					key:'limit_power',
					title:'断电门限(上/下限)'
				},{
					key:'limit_repower',
					title:'复电门限(上/下限)'
				},{
					key:'maxvalues',
					title:'最大值'
				},{
					key:'maxtime',
					title:'最大值时刻'
				},{
					key:'avgvalue',
					title:'平均值'
				},{
					key:'minvalue',
					title:'最小值'
				},{
					key:'mintime',
					title:'最小值时刻'
				},{
					key:'alerts',
					title:'统计详情',
					flag:true
				}]

			 }
			},
			state: store.state,
			action: store.actions,
    	}
    },
    computed: {

    },
  watch: {
    '$route': 'fetchData',
    'state.listinfo.currentPage' : {
      	handler: function (newValue, oldValue) {
        	this.getAll(newValue,this.state.listinfo.numperPage)
      	},
      deep: true
    },
    'state.listinfo.numperPage' : {
      handler: function (newValue, oldValue) {
        this.getAll(this.state.listinfo.currentPage,newValue)
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
    	getAll:function(page,rows) {
	        let vm  =  this
	  		if(vm.headlist[vm.aname].isday&&!vm.headlist[vm.aname].isSqlday){
	  			vm.search.starttime = vm.days + " " + "00:00:00"
	  			vm.search.atype = vm.kindex
	  			vm.search.endtime = null
	  			delete vm.search.day
	  		}else if(vm.headlist[vm.aname].isSqlday){
	  			vm.search.day = vm.days
	  			vm.search.starttime = vm.startstime
	  			vm.search.endtime = vm.endstime
	  		}else{
	  			vm.search.atype = vm.kindex
	  			vm.search.starttime = vm.starttime
	  		    vm.search.endtime = vm.endtime
	  			delete vm.search.day
	  		}
  			vm.search.classname = vm.headlist[vm.aname].isClass ? vm.classname : null
			vm.search.classstart = vm.headlist[vm.aname].isClass ? vm.classstart : null
			vm.search.classend = vm.headlist[vm.aname].isClass ? vm.classend : null
	        vm.search.cur_page = page || (vm.state.listinfo.currentPage)
	        vm.search.page_rows = rows || (vm.state.listinfo.numperPage)
            vm.isloading = true
	        if(vm.$route.params.aname=='switchStatement/4'){//开关量状态变动日(班)报表
	        	 api.analyze.getAll('switchStateChange',vm.search).then((res) => {
	        	 	if (res.data.status === 0) {
		          	   	vm.showdata = true
		          		vm.tableData = []
                        vm.isloading = false
		          	   	vm.tableData = res.data.data
		          	   	vm.getClassList(res.data.envclass)
		          	   	vm.action.setShowList(vm.tableData)//分页展示
		            }
	        	 })
			}else if(vm.$route.params.aname=='communicat/1'){//设备故障记录
	        	api.analyze.getAll('equipStatement',vm.search).then((res) => {
	        	 	if (res.data.status === 0) {
		          	   vm.showdata = true
                        vm.isloading = false
		          	    vm.tableData = []
		        	 	res.data.data.map((ob)=>{
			        		vm.tableData = vm.tableData.concat([],ob.list)
			        	})
		          	   vm.getClassList(res.data.envclass)
		          	   vm.action.setShowList(vm.tableData)
		            }
	        	 })
	        }else if(vm.aname == 'switchinfo'){//开关量馈电异常、开关量报警、开关量断电控制
	        	api.analyze.getAll('switchStatement',vm.search).then((res) => {
	        	 	if (res.data.status === 0) {
		          	   	vm.showdata = true
                        vm.isloading = false
		          	    vm.tableData = []
	            		vm.tableData = res.data.data
		          	   	vm.action.setShowList(vm.tableData)
		            }
	        	 })
	        }else if(vm.$route.params.aname == 'calibrationData/1'){//标校维护数据查询
	        	api.analyze.getAll(vm.aname,vm.search).then((res) => {
	        		if (res.data.status === 0) {
		          		vm.tableData = []
	        			vm.tableData = res.data.data
	        			vm.action.setCutList(vm.tableData,res.data.nametime.total_rows)//分页展示
	        			vm.showdata = true
	        			vm.isloading = false
	        		}
	        	})
	        }else if(vm.aname == 'analogStatistics'){//模拟量统计值历史记录
	        	api.analyze.getStatistics(vm.search).then((res)=>{
        			if (res.data.status === 0) {
			          	vm.showdata = true
	                    vm.isloading = false
			          	vm.tableData = []
			        	if(res.data.data.length&&res.data.namTime) {
			                vm.tableData = res.data.data
			                vm.tableData.map(m=> m['alerts'] = "查看详情")
			            }
		                vm.action.setCutList(vm.tableData,res.data.namTime.total_rows)
			        } else {
			          vm.$message.error(res.data.msg)
			        }
	        	})
	        }
	        else{//其他报表
		        api.analyze.getAll(vm.aname,vm.search).then((res) => {
		          if (res.data.status === 0) {
		          	vm.showdata = true
                    vm.isloading = false
		          	vm.tableData = []
		          	// 班次
		          	if(res.data.envclass){
		          	   vm.getClassList(res.data.envclass)
		          	}
		        	if(res.data.data.length&&res.data.namTime) {
		                vm.tableData = res.data.data
		                vm.action.setCutList(vm.tableData,res.data.namTime.total_rows)
		            }else if(!res.data.namTime&&!vm.headlist[vm.isCut]){
		            	vm.tableData = []
                        vm.tableData = res.data.data
		            	vm.action.setShowList(vm.tableData)
		            }else{
		         	  vm.action.setCutList(vm.tableData,res.data.namTime.total_rows)
		            }
		        } else {
		          vm.$message.error(res.data.msg)
		        }
		      })
	        }
	  	},
	    handleChange(value) {
            if(value.length){
            	if(value=='6'){
		        	this.search.sensor_type = 16
            	}else if(value=='7'){
		        	this.search.sensor_type = 104
            	}else if(value=='8'){
		        	this.search.sensor_type = 72
            	}else{
            		var str = _.last(value)+''
					var arr = str.split('-')
			        if(!arr[1]){
			        	this.search.ip = arr[0]
			        	this.search.id = 0
			            this.search.sensor_type = 0
			        }else{
	                    this.search.id = arr[0]
		                this.search.sensor_type = arr[1]
			        }
            	}
            }else{
	       	    this.search.id = 0
	       	    this.search.ip = ''
		        this.search.sensor_type = 0
	        }
            this.getAll()
	    },
	    // 选择日期
	    select(){
            this.getAll(1)
	    },
	    // 前一天、后一天
        setday(val){
            this.days = moment(this.days).add(val,'days').format('YYYY-MM-DD')
            this.getAll()
        },
        // 打印报表
	    exportPrint(){
        	this.showpage = true
        	setTimeout(() => {
	  			$('#show').jqprint()
	  			this.showpage = false
	  			this.printOb.showEdit = false
	  		},50)
        },
        // 打印详情
        export2(){
        	this.showpage2 = true
        	setTimeout(() => {
        		this.showpage2 = false
	  			this.printOb.showEdit = false
		  		$('#sensor').jqprint()
		  	},10)
        },
	    fetchData(){
	    	this.selectedMSensor = []
	    	this.selectedKSensor = []
	    	this.search.id = 0
	    	this.search.sensor_type = 0
	    	this.search.ip = ''
	    	this.showpage = false
	    	this.showdata = false
	    	this.selectedallSensor = []
	    	this.state.listinfo.count = 0
			if(this.$route.params.aname=='analoginfo/1'||this.$route.params.aname=='analoginfo/2'||this.$route.params.aname=='analoginfo/3'){
				this.aname = 'analoginfo'
			}
			else if(this.$route.params.aname=='switch/1'||this.$route.params.aname=='switch/2'||this.$route.params.aname=='switch/3'){
				this.aname = 'switchinfo'
			}
			else if(this.$route.params.aname=='communicat/1'){
				this.aname = 'communication'
			}
			else if(this.$route.params.aname=='mday/1'){
				this.aname = 'analogStatement/getottable'
				this.timeType = 2
			}else if(this.$route.params.aname=='nday/1'){
				this.aname = 'analogStatistics'
			}
			else if(this.$route.params.aname=='getTable/1'||this.$route.params.aname=='getTable/2'||this.$route.params.aname=='getTable/3'){
                 this.aname = 'analogStatement/getTable'
			}
			else if(this.$route.params.aname=='switchStatement/1'||this.$route.params.aname=='switchStatement/2'||this.$route.params.aname=='switchStatement/3'||this.$route.params.aname=='switchStatement/4'){
                 this.aname = 'switchStatement'
			}
			else if(this.$route.params.aname=='equipStatement/1'){
                 this.aname = 'equipStatement'
			}
			else if(this.$route.params.aname=='switchStateChange/1'){
                 this.aname = 'switchStateChange'
			}else if(this.$route.params.aname=='calibrationData/1'){
				this.aname = 'calibrationData'
			}
			this.state.listinfo.currentPage = 1
			var str = this.$route.params.aname
			var arr= str.split('/')
			if(arr.length){
                this.kindex = arr[1]
            } else{
            	this.kindex = this.$route.params.aname
            }
			this.getAll(1,this.state.listinfo.numperPage)
	   	},
	   	// 传感器列表
	   	getMensor(){
		   	var vm = this
		   	api.station.getEquipAll().then((res)=> {
                if(res.data.status==0){
                	// 模拟量
					vm.MSensor = []
					_.forEach(res.data.data,function(ob) {
					    let slist = []
					    if(ob.lists.length){
							_.forEach(ob.lists,function(oob) {
								    slist.push({
						                name: oob.alais+'('+oob.position + '--' + oob.type+')',
						                id: oob.id+'-'+oob.sensor_type
						          })
							})
						}
					    slist.unshift({
							name:'所有模拟量传感器('+slist.length+')',
							id:ob.ipaddr
						})
					    vm.MSensor.push({
				          	name: ob.ipaddr,
					        id: ob.ipaddr,
					        list: slist
				      	})
					})
					// 开关量
					vm.KSensor = []
    				_.forEach(res.data.list,function(ob) {
    				  let slist = []
    				    if(ob.lists.length){
                            ob.lists = ob.lists.filter(bb=>bb.sensor_type!=56)
    				    	_.forEach(ob.lists,function(oob) {
    							  slist.push({
    				                 name: oob.alais+'('+oob.position + '--' + oob.type+')',
    				                 id: oob.id+'-'+oob.sensor_type
    				            })
    						})
    				    }
    				    slist.unshift({
    						name:'所有开关量传感器('+slist.length+')',
    					    id:ob.ipaddr
    					})
    				    vm.KSensor.push({
    			          	name: ob.ipaddr,
    				        id: ob.ipaddr,
    				        list: slist
    			      	})
    				})
    			    vm.getAllSensor()
				}
            })
	    },
        getAllSensor(){
      	    var vm = this
            vm.AllSensor = []
		    var len = Math.min(vm.MSensor.length,vm.KSensor.length)
			for(var i = 0; i < len;i++){
				if(vm.MSensor[i].id==vm.KSensor[i].id){
					var list = vm.MSensor[i].list.concat(vm.KSensor[i].list)
					vm.AllSensor.push({
						name:vm.MSensor[i].name,
						id:vm.MSensor[i].id,
						list:list
					})
				}	
			}
			if(vm.MSensor.length>len){
				for(var i = len; i < vm.MSensor.length;i++){
				    vm.AllSensor.push({
						name:vm.MSensor[i].name,
						id:vm.MSensor[i].id,
						list:vm.MSensor[i].list
					})
				}
			}
			if(vm.KSensor.length>len){
				for(var i = len; i < vm.KSensor.length;i++){
				    vm.AllSensor.push({
						name:vm.KSensor[i].name,
						id:vm.KSensor[i].id,
						list:vm.KSensor[i].list
					})
				}
			}
			api.gas.getAllList().then((res)=>{
				if(res.data.status == 0 ){
					for(var i = 0; i < res.data.data.length;i++){
						if(res.data.data[i].id==6||res.data.data[i].id==7||res.data.data[i].id==8)
					    vm.AllSensor.push({
							name:res.data.data[i].label,
							id:res.data.data[i].id,
						})
					}
				}else{
					vm.$message.error(res.data.msg)
				}
			})
		},
		// 详情
		checkDetails(ob){
    		this.alarmShow = true
    		this.tablist = ob.list
    		this.sensor.sensortype = ob.position+ '-' +ob.alais+'-'+(ob.type?ob.type:ob.sensortype)
    		this.sensor.limit_alarm = ob.limit_alarm?(ob.limit_alarm+ob.unit):''
    		this.sensor.power = ob.limit_power?(ob.limit_power+ob.unit):''
    		this.sensor.repower = ob.limit_repower?(ob.limit_repower+ob.unit):''
    		this.sensor.duration = ob.alertTimes||ob.countTime||ob.times
    		this.sensor.ranges = this.days
    		this.sensor.valueMax = ob.maxvalues
    		this.sensor.average = ob.avgvalue
    		this.sensor.timeMax = ob.maxtime
    		this.action.setShowList2(this.tablist)
    	},
    	// 位置
        getPosition(){
            var vm = this
            api.gas.getAllPosition().then(function (res) {
                if(res.data.status ==0){
                    vm.AllPositionList = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        choosePosition(){
            this.getAll()
        },
        // 班次
        getClassList(row){
        	let i = 0
        	if(row.length){
        		row.map((ob)=>{
        			i--;
        			if(ob.status == 3){
        				ob.name = ob.name + '(历史)'
        			}
        			if(ob.id == 0){
	        			ob.id = i
	        		}
        		})
        	}
	   		this.classOptions = row
	   	},
        chooseClass(){
        	if(this.classtime == 0){
				this.classname = null
    			this.classstart = null
    			this.classend = null
        	}else{
	        	_.forEach(this.classOptions,(ob)=>{
	        		if(ob.id === this.classtime){
	        			this.classname = ob.name
	        			this.classstart = ob.start
	        			this.classend = ob.end
	        		}
	        	})
	        	if(this.classname.indexOf('(历史)')!= -1){
        			this.classname = this.classname.split('(')[0]
        		}
        	}
            this.getAll()
        },
	   	//初始化时间
	   	initFindTime(){
            this.days = moment().add(-1,'day').format('YYYY-MM-DD');
            this.starttime = moment().add(-1,'day').format('YYYY-MM-DD HH:mm:ss');
            this.endtime = moment().format('YYYY-MM-DD HH:mm:ss');
            this.startstime = moment().add(-1,'hour').format('HH:mm:ss');
            this.endstime = moment().format('HH:mm:ss');
        	this.nowtime = moment().format('YYYY-MM-DD')//打印时间
        },

    },
    mounted () {
        this.initFindTime()
        this.getPosition()
        this.fetchData()
    },
    beforeMount(){
      this.getMensor()
    },
};
</script>
