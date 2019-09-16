<style lang="less">
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
        overflow: hidden;
    }
</style>
<template>
<div>
   <el-card>
        <p slot="header">
            <span class="fa fa-line-chart"> 模拟量历史曲线</span>
        </p>
        <el-form ref="form" :model="form" inline label-position="right" class="formcss">
            <el-form-item label="选择测点">
                    <el-select v-model="nowSensor"  value-key="id" @change="chooseSensor" size="small" style="width:350px;" :disabled="isloading" filterable>
                        <el-option
                            v-for="item in sensorList"
                            :value="item"
                            :key="item.id"
                            :label="item.alais + '/'+item.type + '/' + item.position">
                            </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="断馈电仪">
                    <el-select v-model="feedSensorUid" filterable size="small" :disabled="!feedSensorList.length" style="width: 350px;" @change="changefeed" :placeholder="!feedSensorList.length?'没有数据上报':'请选择'">
                        <el-option
                            v-for="item in feedSensorList"
                            :value="item.uid"
                            :key="item.uid"
                            :label="item.detailDescription">
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="">
                        <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" :disabled="isloading">打印图表</el-button>
                        <el-button size="small" type="primary" @click="$router.go(-1)" icon="el-icon-back" :disabled="isloading">返回</el-button>
            </el-form-item>
            <br/>
            <el-form-item  label="选择日期">
                    <el-date-picker
                        v-model="day"
                        align="right"
                        type="date"
                        :disabled="isloading"
                        :clearable="false"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="pickerOptions1"
                        size="small"
                        style="width:150px;"
                        @change="chooseDate">
                    </el-date-picker>
            </el-form-item>
            <el-form-item  label="开始时间">
                <el-time-picker
                :disabled="isloading"
                    v-model="startTime"
                    :clearable="false"
                    type="date"
                    placeholder="开始时间"
                    size="small"
                    format="HH:mm:ss"
                    value-format="HH:mm:ss">
                    </el-time-picker>
            </el-form-item>
            <el-form-item  label="结束时间">
                <el-time-picker
                :disabled="isloading"
                    v-model="endTime"
                    :clearable="false"
                    type="date"
                    placeholder="结束时间"
                    size="small"
                    format="HH:mm:ss"
                    value-format="HH:mm:ss">
                </el-time-picker>
            </el-form-item>
            <el-form-item  label="">
                <el-button size="small" @click="handleFind" type="primary" icon="el-icon-search" :disabled="isloading">查询</el-button>
            </el-form-item>
            <el-form-item label="" style="margin-left: 30px;" v-show="showdata">
                    <el-button icon="el-icon-arrow-left" size="small" @click="sethour(-1)">前一小时</el-button>
                    <el-button size="small" @click="sethour(1)" :disabled="overtime">后一小时<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <div style="padding:20px;" v-loading.body="isloading" element-loading-text="拼命加载中" id="showprint">
        <div v-if="showdata">
            <div v-if="showimg">打印时间：{{printTime()}}</div>
            <div style="position: relative;">
                    <div :style="{display:'flex',flexDirection:'row',position:'absolute',top:'20px',left:'20px',backgroundColor:'white',fontSize:showimg?'12px':'14px'}">
                            <div style="flex-direction: column;">
                                <label>编号：</label><span>{{nowSensor.alais}}</span><br>
                                <label>类型：</label><span>{{nowSensor.type}}</span><br>
                                <label>位置：</label><span>{{nowSensor.position}}</span><br>
                                <label>最大值：</label><span>{{valuesItem.max}}</span><br>
                                <label>最小值：</label><span>{{valuesItem.min}}</span><br>
                                <label>平均值：</label><span>{{valuesItem.avg}}</span><br>
                            </div>
                            <div style="flex-direction: column;margin-left: 20px;" v-if="nowSensor.hasfloor != 2">
                                <label>上限断电门限：</label><span>{{nowSensor.limit_power}}</span><br>
                                <label>上限复电门限：</label><span>{{nowSensor.limit_repower}}</span><br>
                                <label>上限报警(1级)：</label><span>{{nowSensor.upper_level1}}</span><br>
                                <label>上限报警(2级)：</label><span>{{nowSensor.upper_level2}}</span><br>
                                <label>上限报警(3级)：</label><span>{{nowSensor.upper_level3}}</span><br>
                                <label>上限报警(4级)：</label><span>{{nowSensor.upper_level4}}</span><br>
                            </div>
                            <div style="flex-direction: column;margin-left: 20px;"  v-if="nowSensor.hasfloor == 1||nowSensor.hasfloor == 2">
                                <label>下限限断电门限：</label><span>{{nowSensor.floor_power}}</span><br>
                                <label>下限限复电门限：</label><span>{{nowSensor.floor_repower}}</span><br>
                                <label>下限限报警(1级)：</label><span>{{nowSensor.floor_level1}}</span><br>
                                <label>下限限报警(2级)：</label><span>{{nowSensor.floor_level2}}</span><br>
                                <label>下限限报警(3级)：</label><span>{{nowSensor.floor_level3}}</span><br>
                                <label>下限限报警(4级)：</label><span>{{nowSensor.floor_level4}}</span><br>
                            </div>
                </div>
               <h4 style="font-size: 18px;text-align: center;margin-bottom:60px">{{nowSensor.alais}}&nbsp;{{day}}&nbsp;{{startTime}}~{{endTime}}<br>模拟量历史曲线</h4>
            </div>
            <img :src="imgsrc" v-if="showimg" style="width: 100%;">
            <historycurvebar
                v-show="!showimg"
                ref="echartBar"
                @datazooms='datazooms'
                @dblclicks="dblclicks"
                @changevalue="changevalue"
                :chartData="chartData"
                :feedDataList="feedDataList"
                :anchor="anchor"
                :sensor="nowSensor">
            </historycurvebar>
        </div>
    </div>
    <div v-if="!showimg && !isloading">
        <p class="list-title">所有数据</p>
        <el-table :data="state.showlist"  border :row-class-name="tableRowClassName">
            <el-table-column  :prop="item.key" v-for="item in ColumData"  :label="item.title">
                <template scope="scope">
                    <div v-if="item.title=='地点/名称'">{{nowSensor.position}}/{{nowSensor.alais}}</div>
                    <div v-else-if="item.title=='报警门限(下/上)'">{{nowSensor.limit_alarm2}}</div>
                    <div v-else-if="item.title=='断电门限(下/上)'">{{nowSensor.limit_power2}}</div>
                    <div v-else-if="item.title=='复电门限(下/上)'">{{nowSensor.limit_repower2}}</div>
                    <div v-else-if="item.title=='断电范围'">{{nowSensor.areaname2}}</div>
                    <div v-else-if="item.title=='最大值'">{{valuesItem.max}}</div>
                    <div v-else-if="item.title=='最小值'">{{valuesItem.min}}</div>
                    <div v-else-if="item.title=='平均值'">{{valuesItem.avg}}</div>
                    <div v-else-if="item.key=='debug'">{{scope.row.debug>0?state.debugMap[scope.row.debug]:'-'}}</div>
                    <div v-else-if="item.key=='powerStatusList'||item.key=='feedStatusList'">
                        <span v-for="ob in scope.row[item.key]">
                            {{ob}}<br>
                        </span>
                    </div>
                    <div v-else>{{scope.row[item.key]}}</div>
                </template>
            </el-table-column>
        </el-table>
        <my-pagination ></my-pagination>
    </div>
</div>
</template>

<script>
    import api from 'src/api';
    import store from 'src/store';
    import historycurvebar from "./historycurvebar.vue";
    export default {
        components: {
            historycurvebar
        },
        data() {
            return {
                ColumData:[
					   {title: '地点/名称'},
                       { title: '报警门限(下/上)'},
                       {title: '复电门限(下/上)'},
                       {title: '断电门限(下/上)'},
                       {title: '读值时刻',key: 'starttime'},
                       {title: '实时值',key:'avalue'},
                       {title: '平均值',key:'avgValue'},
                       {title: '最大值',key:'maxValue'},
                       {title: '最小值',key:'minValue'},
                       {title: '数据状态',key: 'debug'},
                       {title: '断电范围'},
                       {title: '报警及起止时刻',key: 'alarmStatus'},
                       {title: '断电及起止时刻',key: 'powerStatusList'},
                       {title: '馈电状态及起止时刻',key: 'feedStatusList' },
                       {title: '措施及时刻',key: 'measure'}
				],
                 pickerOptions1: {
                      disabledDate(time) {
                        return time.getTime() > Date.now();
                      },
                      shortcuts: [
                      {
                        text: '今天',
                        onClick(picker) {
                          picker.$emit('pick', new Date());
                        }
                      },
                      {
                        text: '昨天',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24);
                          picker.$emit('pick', date);
                        }
                      },
                      {
                        text: '前天',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 48);
                          picker.$emit('pick', date);
                        }
                      },
                      {
                        text: '一周前',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                          picker.$emit('pick', date);
                        }
                      }
                      ]
                },
                valueRange:{
                    '33':3,
                    '34':3,
                    '35':100,
                    '70':3,
                    '80':3,
                    '37':25,
                    '39':0.0007,
                    '44':1000,
                    '47':15,
                    '48':15,
                    '49':100,
                    '40':40,
                    '41':25
                },
                valuesItem:{
                    max:'',
                    min:'',
                    avg:''
                },
                paramsAname:'0',
                sensorList:[],
                nowSensor: {},
                 day:'',
                 startTime:'',
                 endTime:'',
                 timeRange:[],
                 showdata:false,
                 isloading:false,
                 alldata:[],
                 imgsrc:'',
                 showimg:false,
                 state: store.state,
                 action: store.actions,
                 rdata:{},
                 feedSensorUid:'',
                 feedSensorList:[],
                 feedData:[],
                 lineTitle:'历史',
                 isSetLevel:{
                    level1:false,
                    level2:false,
                    level3:false,
                    level4:false
                }
            }
        },
        watch: {
	         '$route': 'fetchData',
	         'state.listinfo' : {
			      handler: function (newValue, oldValue) {
			        this.action.setShowList(this.alldata)
			      },
			      deep: true
			}
         },
         beforeDestroy:function(){
                 this.alldata = null;
                 this.feedData = null;
         },
         mounted() {
            this.fetchData()
            // this.getInfo()
        },
        methods: {
            changevalue(params){
                this.valuesItem = params;
            },
            fetchData(){
                this.state.listinfo.numperPage = 10;
                this.showdata = false;
                this.isloading = true;
                this.paramsAname = this.$route.params.aname || '0';
                this.nowSensor = {};
                this.initFindTime();
                this.getSensorList();
            },
            // 初始化查询时间
            initFindTime(){
                this.day = moment().format('YYYY-MM-DD');
                this.startTime = moment().add(-1,'hour').format('HH:00:00');
                this.endTime = moment().format('HH:mm:ss');
            },
            // 获取所有设备
            getSensorList(){
                api.station.getalarmequipment(0).then((res) => {
                    if(res.data.status == 0){
                        this.sensorList = res.data.data;
                        this.setNowSensor();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    
                });
            },
            //设置初始设备
            setNowSensor(){
                this.nowSensor = this.sensorList[0];
                if(this.paramsAname != '0'){
                    for(let item of this.sensorList){
                        if(item.uid === this.paramsAname){
                            this.nowSensor = item;
                            break;
                        }
                    }
                }
                this.initSensor();
            },
             //切换设备
            chooseSensor(row){
                    this.feedSensorList = []
                    this.feedData = [];
                    this.feedSensorUid = '';
                    this.initSensor();
            },
            initSensor(){
                this.nowSensor.hasfloor = this.nowSensor.hasfloor || 0;
                this.action.initLevelValue(this.nowSensor)//初始化分级值
                this.isSetLevel = {
                    level1:this.nowSensor.upper_level1 || this.nowSensor.floor_level1 ? true:false,
                    level2:this.nowSensor.upper_level2 || this.nowSensor.floor_level2 ? true:false,
                    level3:this.nowSensor.upper_level3 || this.nowSensor.floor_level3 ? true:false,
                    level4:this.nowSensor.upper_level4 || this.nowSensor.floor_level4 ? true:false,
                };
                this.rdata.ip = this.nowSensor.ipaddr;
                this.rdata.devid = this.nowSensor.sensorId;
                // this.rdata.max = this.nowSensor.limit_power; // Y轴上限 最大值;
                this.rdata.max = Math.max(this.nowSensor.limit_power || this.nowSensor.floor_repower) ; // Y轴上限 最大值;

                this.nowSensor.max = this.rdata.max;
                this.rdata.typeName = 'RealTimeCurve';
                this.rdata.type = 1;
                this.inquire();
            },

            // 切换日期
            chooseDate(val){
                // console.log(this.day,val)
                // this.day = val;
                // this.inquire();
                // this.handleFind();
            },
            //切换小时 转换成整点
            sethour(val){
                let nowtime;
                this.day = moment(this.day + ' ' + this.startTime).add(val,'hour').format('YYYY-MM-DD');
                if(val === 1 ){
                    nowtime = this.day + ' ' + this.endTime;
                    this.startTime =  moment(nowtime).format('HH:00:00');
                    this.endTime = moment(nowtime).add(val,'hour').format('HH:00:00');
                }else if(val === -1){
                    nowtime = this.day + ' ' + this.startTime;
                    this.startTime =  moment(nowtime).add(val,'hour').format('HH:00:00');
                    this.endTime = moment(nowtime).format('HH:00:00');
                }
                this.inquire();
            },
            //点击查询
            handleFind(){
                let etime = ~~this.endTime.split(':').join('');
                let stime = ~~this.startTime.split(':').join('');
                let times = etime - stime;
                if(times > 10000){
                     this.$confirm('查询时间范围过长可能造成数据量较大,等待时间较长, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
                        .then(() => {
                            this.inquire();
                        })
                        .catch(() => {
                            this.$message.info('操作已取消删除');
                        });
                }else if(times <= 0){
                    this.$message.error('时间设置错误!');
                }else{
                    this.inquire();
                }
            },
            datazooms(val){},
            dblclicks(day,startTime,endTime){
                this.startTime = startTime;
                this.endTime = endTime;
                this.day = day;
                this.inquire();
            },
            // 查询
            inquire(){
                if(this.nowSensor.uid){
                     this.showdata = false;
                     this.isloading = true;
                     this.getTime();
                     this.getData();
                }else{
                     this.showdata = true;
                     this.isloading = false;
                     this.$message.error('请选择查询的测点!');
                }

            },
            // 获取时间 设置时间范围
            getTime(){
                this.timeRange = [
                    {
                        name:this.day + ' ' + this.startTime,
                        value:[this.day + ' ' + this.startTime,0]
                    },
                    {
                        name:this.day + ' ' + (this.endTime=='00:00:00'?'23:59:59':this.endTime),
                        value:[this.day + ' ' + (this.endTime=='00:00:00'?'23:59:59':this.endTime),0]
                    }
                ]
                this.rdata.day = this.day;
                this.rdata.startTime = this.startTime;
                this.rdata.endTime = this.endTime;
            },
            getData(){
            	 var vm = this
                 api.analyze.realtime(vm.rdata).then(function(res){
                 	console.log(res,"res.data.result.data.length:",res.data.result.data.length)
            	 	if(res.data.result.status==0){
                         if(res.data.result.data && res.data.result.data.length > 10000){ 
                            vm.$message.error("数据量较大，无法加载，请缩短查询时间范围！");
                            vm.alldata = [];
                            vm.feedSensorList =[];
                            vm.setFeedList();
                            vm.isloading = false;
                            vm.showdata = true;
                            return;
                         }
                         vm.alldata = [];
                         vm.alldata = res.data.result.data;
                         vm.nowSensor.limit_alarm2 = res.data.result.limit_warning;
                         vm.nowSensor.limit_repower2 = res.data.result.limit_repower;
                         vm.nowSensor.limit_power2 = res.data.result.limit_power;
                         vm.nowSensor.areaname2 = res.data.result.areaname;
                         vm.nowSensor.max = res.data.result.max;
                         vm.nowSensor.avg = res.data.result.avg;
                         vm.feedSensorList = res.data.result.feedData || [];
                         vm.setFeedList();
                         vm.action.setShowList(vm.alldata);
            	 	 }else{
                         vm.$message.error(res.data.result.msg);
                    }
                    vm.isloading = false;
                    vm.showdata = true;
            	 })
            },
            //馈电值处理
            setFeedList(){
                  if(this.feedSensorList && this.feedSensorList.length){
                      let row = this.feedSensorList.find(m1 => m1.uid === this.feedSensorUid)
                      if(row){
                          this.feedData = row.dataList
                      }else{
                          this.feedSensorUid = this.feedSensorList[0].uid
                          this.feedData = this.feedSensorList[0].dataList
                      }
                  }else{
                      this.feedSensorUid = '';
                      this.feedData = [];
                  }
            },
            changefeed(val){
                for(let item of this.feedSensorList){
                    if(val === item.uid){
                        this.feedData = item.dataList
                        break;
                    }
                }
            },
            exportPrint(){
                this.imgsrc = this.$refs.echartBar.getImg()
                this.showimg = true
	        	setTimeout(() => {
                    $('#showprint').jqprint()
                        this.showimg = false
                    },10)
            },
            printTime(){
                return moment().format('YYYY-MM-DD HH:mm:ss')
            },
            tableRowClassName({row}){
                if (row.debug>0) {
                  return 'info-row-debug';
                }
                return '';
            },
           //获取表头
            getInfo(){
            	var vm = this
                api.user.editorGetAll().then((res) => {
                    if(res.data.status==0){
                    }
                })
            },
        },
         computed: {
             chartData(){
                 console.time('time');
                 var vm = this
                 var obj = {
                    yAxis:[],//Y轴
                    avalueList:[],//实时值
                    avgValueList:[],//平均值
                    maxList:[],//最大
                    minList:[],//最小
                    debugDataList:[],//调校
                    debugDataList1:[],//标校
                    debugDataList2:[],//异常
                    level1List:[],//一级报警
                    level2List:[],//二级报警
                    level3List:[],//三级报警
                    level4List:[],//四级报警
                    changing_2:[],//突变
                    changing_3:[],//持续升高
                }
                 obj.yAxis = [{
                            type: 'value',
                            name:vm.nowSensor.type,
                            max:vm.nowSensor.max || vm.valueRange[vm.nowSensor.sensor_type],
                            axisLabel:{formatter:'{value}' + vm.nowSensor.sensorUnit,},
                            nameGap:50,
                            splitLine: {show: false},
                            nameTextStyle:{fontWeight:'bold',fontSize:14},
                            triggerEvent:true,
                        },
                        {
                            type: 'value',
                            name: '断电值',
                            minInterval: 1,
                            min: 0,
                            max: 1,
                            show:vm.feedSensorList.length>0?true:false,
                            nameGap:50,
                            offset:60,
                            position: 'right',
                            splitLine: {show: false},
                            nameTextStyle:{fontWeight:'bold',fontSize:14},
                            axisLabel:{
                                formatter: function (value) {
                                    return [value==1?'断开(1)':'接通(0)']
                                }
                            },
                    }]
                let beforelevel = 0;
                vm.alldata.forEach((m,index) => {
                        // m.changing = Math.round(Math.random()*4);
                        // m.debug = Math.round(Math.random()*8);
                        let itemData = {
                            name:m.starttime,
                            value:[m.starttime,m.avalue],
                        };
                        let itemLevelData = {
                            name:m.starttime,
                            value:[m.starttime,null]
                        };
                        //  实时值 avalue
                        obj.avalueList.push({
                            name:m.starttime,
                            value:[m.starttime,m.avalue],
                            label:m
                        });
                          //三量 avgValue maxValue minValue // isAvg: 0 isMax: 0 isMin: 0
                        if(m.isAvg > 0 ){
                            // console.log(m,'平均')
                            obj.avgValueList.push({
                                name:m.starttime,
                                value:[m.starttime,m.avgValue]
                            });
                        }
                        if(m.isMax > 0 ){
                            // console.log(m,'最大')
                            obj.maxList.push({
                                name:m.starttime,
                                value:[m.starttime,m.maxValue]
                            });
                        }
                        if(m.isMin > 0 ){
                            //  console.log(m,'最小')
                             obj.minList.push({
                                name:m.starttime,
                                value:[m.starttime,m.minValue]
                            });
                        }
                         //异常数据
                        if(m.debug>0){
                                if(m.debug === 3){
                                    //调校
                                    obj.debugDataList.push(itemData);
                                }else if(m.debug === 5){
                                    //标校
                                    obj.debugDataList1.push(itemData);
                                }else{
                                    //设备异常
                                    obj.debugDataList2.push(itemData);
                                }
                        }
                        //值变化
                         if(m.changing === 2){
                             obj.changing_2.push(itemData)
                         }else if(m.changing === 3){
                             obj.changing_3.push(itemData)
                         }
                        //分级报警
                        if(m.level && m.level>0){
                             switch(m.level){
                                  case 1:
                                    vm.isSetLevel.level1 && obj.level1List.push(itemData);
                                    vm.isSetLevel.level2 && obj.level2List.push(itemLevelData);
                                    vm.isSetLevel.level3 && obj.level3List.push(itemLevelData);
                                    vm.isSetLevel.level4 && obj.level4List.push(itemLevelData);
                                     break;
                                  case 2:
                                    vm.isSetLevel.level1 && obj.level1List.push(itemLevelData);
                                    vm.isSetLevel.level2 && obj.level2List.push(itemData);
                                    vm.isSetLevel.level3 && obj.level3List.push(itemLevelData);
                                    vm.isSetLevel.level4 && obj.level4List.push(itemLevelData);
                                     break;
                                  case 3:
                                    vm.isSetLevel.level1 && obj.level1List.push(itemLevelData);
                                    vm.isSetLevel.level2 && obj.level2List.push(itemLevelData);
                                    vm.isSetLevel.level3 && obj.level3List.push(itemData);
                                    vm.isSetLevel.level4 && obj.level4List.push(itemLevelData);
                                     break;
                                  case 4:
                                    vm.isSetLevel.level1 && obj.level1List.push(itemLevelData);
                                    vm.isSetLevel.level2 && obj.level2List.push(itemLevelData);
                                    vm.isSetLevel.level3 && obj.level3List.push(itemLevelData);
                                    vm.isSetLevel.level4 && obj.level4List.push(itemData);
                                     break;
                             }
                        }else{
                            vm.isSetLevel.level1 && obj.level1List.push(itemLevelData);
                            vm.isSetLevel.level2 && obj.level2List.push(itemLevelData);
                            vm.isSetLevel.level3 && obj.level3List.push(itemLevelData);
                            vm.isSetLevel.level4 && obj.level4List.push(itemLevelData);
                       }
                       if(beforelevel !=  m.level){
                                switch(beforelevel){
                                    case 1:
                                        if(vm.isSetLevel.level1){
                                            obj.level1List[index] = itemData;
                                        }
                                    break;
                                    case 2:
                                        if(vm.isSetLevel.level2){
                                            obj.level2List[index] = itemData;
                                        }
                                    break;
                                    case 3:
                                        if(vm.isSetLevel.level3){
                                            obj.level3List[index] = itemData;
                                        }
                                    break;
                                    case 4:
                                        if(vm.isSetLevel.level4){
                                            obj.level4List[index] = itemData;
                                        }
                                    break;
                                }
                        }
                        beforelevel = m.level;
                })
                // vm.alldata.length = 0;
                console.timeEnd('time');
                console.log(obj.level1List.length)
                console.log(obj.level2List.length)
                console.log(obj.level3List.length)
                console.log(obj.level4List.length)
                return obj
             },
            feedDataList(){
                 var list = []
                 if(this.feedData.length){
                     list = this.feedData.map(m => {
                         return {
                             name:m.starttime,
                             value:[m.starttime,m.avalue]
                         }
                     })
                 }
                 this.feedData.length = 0;
                 return list
             },
             anchor(){
                let list = []
                list = this.timeRange
                return list
             },
             overtime(){
                if(this.startTime == '23:00:00' && this.day >= moment().format('YYYY-MM-DD')){
                         return true
                }
             },
        },
    };

</script>
