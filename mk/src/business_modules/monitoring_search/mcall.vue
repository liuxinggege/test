<style lang="less">
</style>
<template>
<div style="background-color: white;">
 <el-card v-if="showdata">
     <p slot="header">
       <i class="el-icon-date"></i>
        <span>{{headlist[aname].title}}</span>
     </p>
     <el-form ref="form" :model="form" inline label-position="right" class="formcss">
       <el-form-item label="选择测点" v-if="headlist[aname].isMsensor">
                <el-select v-model="nowSensor"  filterable value-key="id" @change="chooseSensor" size="small" style="width:350px;">
                    <el-option v-for="item in analog" :value="item" :key="item.id" :label="item.alais + '/'+item.type + '/' + item.position"></el-option>
                </el-select>
       </el-form-item>
       <el-form-item label="选择测点" v-if="headlist[aname].isKsensor">
                <el-select v-model="nowSwitch" filterable value-key="id" @change="chooseSensor" size="small" style="width:350px;">
                    <el-option v-for="item in switchs" :value="item" :key="item.id" :label="item.alais + '/'+item.type + '/' + item.position"></el-option>
                </el-select>
       </el-form-item>
       <el-form-item label="位置">
            <el-select size="small" v-model="positionId" @change="choosePosition" placeholder="所有位置" filterable clearable style="width:100%;">
                <el-option key="" label="所有位置" :value="0"></el-option>
                <el-option
                    v-for="item in AllPositionList"
                    :key="item.id"
                    :label="item.v"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
              <span v-if="headlist[aname].isday">
              <el-form-item label="时间">
                <el-date-picker  size="small"
                    v-model="days"
                    @change = "select"
                    align="right"
                    type="date"
                    :clearable="false"
                    placeholder="选择日期"
                    :picker-options="pickerOptions1"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
              </span>
            <el-button size="small" type="primary" icon="el-icon-arrow-left" @click="setday(-1)" v-if="headlist[aname].isday">前一天</el-button>
            <el-button size="small" type="primary"  @click="setday(1)" v-if="headlist[aname].isday">后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
             <el-button size="small" type="primary"  @click="getData(1,state.listinfo.numperPage)" v-if="headlist[aname].isBtn" icon="el-icon-search">查询</el-button>
             <el-button size="small" type="primary"  @click="exportPrint" icon="el-icon-printer" style="margin-left:5px">打印表格</el-button>
             <el-button size="small" type="primary" @click="$router.go(-1)" style="margin-left:10px" icon="el-icon-back">返回</el-button>
          </el-form-item>
    </el-form>
    <div id="showprint" style="padding:20px;background-color: white;margin-bottom: 20px;" v-loading.body="isloading" element-loading-text="拼命加载中">
        <h4 v-if="showpage" style="text-align:center">{{headlist[aname].title}}</h4>
        <div v-if="showpage"><span>查询时间：{{rdata.day}}</span></div>
        <div><span v-if="showpage">打印时间：{{nowtime}}</span></div>
        <print-info  :excelColumns="headlist[aname].columnList" :tableExcelData="!showpage?state.showlist:alldata"  :printOb="printOb" ref="print"></print-info>
 </div>
 <my-pagination></my-pagination>
 </el-card>
</div>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import printInfo from '../../business_bar/print.vue';

    export default {
        components: {
            printInfo
        },
        data() {
            return {
                showimg:false,
                queryType:0,
                lineTitle:'历史',
                paramsId:'',
                form:{},
                positionId:0,
                model:'1',
                day:'',
                analog:[],
                switchs:[],
                AllPositionList:[],
              	printOb:{
  	              showLine:false,
  	              thead:'',
  	              tbody:'',
  	            },
                state: store.state,
                action: store.actions,
                isloading:false,
                rdata:{},
                alldata:[],
                showdata:false,
                showpage:false,
                startTime:'',
                endTime:'',
                days:'',
                nowtime:'',//打印时间
                nowSensor: {},
                nowSwitch: {},
                headlist:{
                  //打印模拟量
                  'analogcallp':{
                      isday:true,
                      isMsensor: true,
                      title:'模拟量调用',
                      'columnList':[
                          {
                              key: 'debug',
                              title: '数据状态',
                              isDebug:true
                          },
                          {
                            key: 'position',
                            title: '地点',
                            isNull:true
                          },
                          {
                            key: 'type',
                            title: '类型',
                          },
                          {
                            key: 'unit',
                            title: '单位',
                          },
                          {
                            key: 'avalue',
                            title: '监测值',
                            isNull:true
                          },
                          {
                            key: 'max',
                            title: '最大值',
                          },
                          {
                            key: 'avg',
                            title: '平均值',
                            isNull:true
                          },
                          {
                            key: 'alarmStatus',
                            title: '报警',
                            isNull:true
                          },
                          {
                            key: 'starttime',
                            title: '报警时刻'
                          },
                          {
                            key: 'powerStatusList',
                            title: '断电',
                            isNull:true
                          },
                          {
                            key: 'starttime',
                            title: '断电时刻',
                          },
                          {
                            key: 'feedStatusList',
                            title: '馈电状态',
                            isNull:true
                          },
                          {
                            key: 'starttime',
                            title: '馈电时刻'
                          },
                          {
                            key: 'measure',
                            title: '处理措施',
                            isNull:true
                          },
                          {
                            key: 'measuretime',
                            title: '措施时刻',
                            isNull:true
                          },
                      ]
                  },
                  //打印开关量
                  'switchcallp':{
                      isday: true,
                      isKsensor: true,
                      title:'开关量调用',
                      'columnList':[
                          {
                              key: 'debug',
                              title: '数据状态',
                              isDebug:true
                          },
                          {
                            key: 'position',
                            title: '地点',
                            isNull:true
                          },
                          {
                            key: 'type',
                            title: '类型',
                          },
                          {
                            key: 'status',
                            title: '状态',
                            isNull:true
                          },
                          {
                            key: 'alarmStatus',
                            title: '命令',
                            isNull:true
                          },
                          {
                            key: 'starttime',
                            title: '断电及报警时刻',
                          },
                          {
                            key: 'areaname',
                            title: '断电区域',
                            isNull:true
                          },
                          {
                            key: 'feedStatusList',
                            title: '馈电状态',
                            isNull:true
                          },
                          {
                            key: 'starttime',
                            title: '馈电时刻',
                          },
                          {
                            key: 'measure',
                            title: '处理措施',
                            isNull:true
                          },
                          {
                            key: 'measuretime',
                            title: '措施时刻',
                            isNull:true
                          },
                      ]
                  },
                }
            }
        },
        watch: {
	         '$route': 'fetchData',
            'state.listinfo.currentPage' : {
                handler: function (newValue, oldValue) {
                  this.getData(newValue,this.state.listinfo.numperPage)
                },
                deep: true
            },
            'state.listinfo.numperPage' : {
                handler: function (newValue, oldValue) {
                  this.getData(this.state.listinfo.currentPage,newValue)
                },
                deep: true
            },
	     },
        methods: {
          getData(page,rows){
               var vm = this
                  vm.rdata.day = vm.dayTime()
                  vm.rdata.startTime = "00:00:00"
                  vm.rdata.endTime = "23:59:59"
                  vm.rdata.positionId = vm.positionId
                  vm.rdata.cur_page = page || (vm.state.listinfo.currentPage)
                  vm.rdata.page_rows = rows || (vm.state.listinfo.numperPage)
                if(vm.$route.params.aname=='analogcallp'){//模拟量调用
                    vm.rdata.ip = vm.nowSensor.ipaddr
                    vm.rdata.devid = vm.$route.query.id?vm.$route.query.id:vm.nowSensor.sensorId
                }else if(vm.$route.params.aname=='switchcallp'){//开关量调用
                    vm.rdata.ip = vm.nowSwitch.ipaddr
                    vm.rdata.devid = vm.$route.query.id?vm.$route.query.id:vm.nowSwitch.sensorId
                }
                api.analyze.realtime(vm.rdata).then(function(res){
                if(res.data.result.status==0){
                         vm.alldata = []
                         res.data.result.data.map((ob)=>{
                            if(ob.feedStatusList){
                                ob.feedStatusList = ob.feedStatusList.join('/')
                            }
                            if(ob.powerStatusList){
                                ob.powerStatusList = ob.powerStatusList.join('/')
                            }
                            ob.position = res.data.result.position
                            ob.max = res.data.result.max
                            ob.min = res.data.result.min
                            ob.avg = res.data.result.avg
                            if(vm.$route.params.aname=='analogcallp'){
                                  ob.type = vm.nowSensor.type
                             }else if(vm.$route.params.aname=='switchcallp'){
                                  ob.type = vm.nowSwitch.type
                             }
                            ob.areaname = res.data.result.areaname
                        })
                         vm.alldata = res.data.result.data
                         vm.isloading = false
                         vm.showdata = true
                         vm.action.setCutList(vm.alldata,res.data.result.page.total_record)
                 }else{
                         vm.isloading = false
                         vm.$message.error(res.data.result.msg);
                    }
               })
            },
            // 打印
            exportPrint(){
                this.showpage = true
        	      setTimeout(() => {
                    $('#showprint').jqprint()
                        this.showpage = false
                    },10)
            },
            fetchData(){
                if(this.$route.params.aname=='analogcallp'){
                    this.aname = 'analogcallp'
                    this.rdata = {
                        typeName:'RealTimeCurve',
                        model:'1',
                        detailHourType:1
                    }
	            }else{
                    this.aname = 'switchcallp'
                    this.rdata = {
                        typeName:'StatusCurve',
                        model:'1',
                    }
	            }
                this.getData()
            },
            // 选择时间
            select(val){
                this.checkday = val
                this.getData()
            },
            // 选择测点
            getAll(){
                this.analog = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['analog']&&m.sensor_type!=69)
                this.switchs = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['switch'])
                if(this.$route.query.type==1){
            	   this.nowSensor = this.$route.query.ob
                }else{
                	this.nowSensor = this.analog[0]
                }
                if(this.$route.query.type==2){
                	this.nowSwitch = this.$route.query.ob
                }else{
                	this.nowSwitch = this.switchs[0]
                }
            },
            // 前一天、后一天
            setday(val){
                 this.days = moment(this.days).add(val,'days').format('YYYY-MM-DD')
                  this.checkday = this.days
                  this.getData()
            },
            dayTime(){
                return moment(this.days, 'YYYY/MM/DD').format('YYYY-MM-DD')
            },
            chooseSensor(row){
                    this.showdata = false;
                    this.isloading = true;
                    this.$route.query.id = ''
                    this.getData()
            },
            choosePosition(){
                this.getData()
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
        },
        mounted() {
            this.fetchData()
            this.getPosition()
            this.nowtime = new Date();
            this.nowtime = moment(this.nowtime, 'YYYY/MM/DD').format('YYYY-MM-DD')
        },
        created () {
            this.endTime = new Date();
            this.startTime = new Date();
            this.startTime.setTime(this.startTime.getTime()- 3600 * 1000 * 24 * 1);
            this.days = new Date()
            this.days.setTime(this.days.getTime());
            this.getAll()
        },
    };

</script>
