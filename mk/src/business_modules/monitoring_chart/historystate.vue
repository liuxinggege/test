<style>
</style>

<template>
<div>
    <el-card>
        <p slot="header">
            <span class="fa fa-sliders"> 开关量历史状态</span>
        </p>
        <el-form label-width="100px" inline>
            <el-form-item label="选择传感器">
                <el-select v-model="nowSensor" style="width:300px;" value-key="id" @change="chooseSensor" size="small" filterable :disabled="isloading">
                    <el-option v-for="item in analog" :value="item" :key="item.id" :label="item.alais+'/'+item.type+'/'+item.position"></el-option>
                </el-select>
                <el-button size="small" type="primary" @click="toBar" icon="el-icon-tickets" :disabled="isloading">开机效率图</el-button>
                <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" :disabled="isloading">打印图表</el-button>
                <el-button size="small" type="primary" @click="back" icon="el-icon-back" :disabled="isloading">返回</el-button>
            </el-form-item>
            <el-form-item label="" v-if="showdata" style="margin-left: 50px;">
                <el-date-picker v-model="day" align="right" type="date" v-show="model==1" :clearable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1" size="small" style="width:150px;" @change="alldaylong"></el-date-picker>
                    <el-button-group v-if="model==2">
                        <el-button size="small" @click="alldaylong" style="margin-right: 10px;">查看全天数据</el-button>
                        <el-button icon="el-icon-arrow-left" size="small" @click="sethour(-1)">前一小时</el-button>
                        <el-button size="small" @click="sethour(1)" :disabled="overtime">后一小时<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </el-button-group>
                    <el-button-group v-else-if="model==1">
                        <el-button icon="el-icon-arrow-left" size="small" @click="setday(-1)">前一天</el-button>
                        <el-button size="small"  @click="setday(1)" :disabled="overtime">后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </el-button-group>
            </el-form-item>
        </el-form>
    </el-card>
    <div  v-loading.body="isloading" element-loading-text="加载中..." style="padding: 20px;" id="showprint">
        <div v-if="showdata">
             <div>
                 <div v-if="showimg">打印时间：{{printTime()}}</div>
                 <div style="position: relative;">
                     <div style="flex-direction: column;position: absolute;top:20px;left:20px" :style="{fontSize:showimg?'12px':'14px'}">
                          <label>分站：</label><span>{{nowSensor.ipaddr}}</span><br>
                          <label>编号：</label><span>{{nowSensor.alais}}</span><br>
                          <label>类型：</label><span>{{nowSensor.type}}</span><br>
                          <label>位置：</label><span>{{nowSensor.position}}</span><br>
                          <label>报警值：</label><span v-if="nowSensor.alarm_status==-1">未设置</span><span v-else>{{nowSensor.valueText[nowSensor.alarm_status]}}</span>
                    </div>
                    <h4 style="font-size: 18px;text-align: center;margin-bottom:60px">{{nowSensor.alais}}&nbsp;{{day}}&nbsp;{{startTime}}~{{endTime}}<br>开关量历史状态图</h4>
                 </div>
                 <img :src="imgsrc" v-if="showimg"  style="width: 100%;">
                 <switchstatebar
                    v-show="!showimg"
                    ref="echartBar"
                    @datazooms='datazooms'
                    @dblclicks="dblclicks"
                    :chartData="chartData"
                    :anchor="anchor"
                    :model="model"
                    :sensor="propsSensor"
                    :valueText="valueText">
                 </switchstatebar>
            </div>
        </div>
    </div>
    <div v-if="!showimg">
        <el-table :data="state.showlist" border :row-class-name="tableRowClassName">
            <el-table-column  :prop="item.key" v-for="item in columns"  :label="item.title">
                <template scope="scope">
                    <div v-if="item.key=='position'">{{nowSensor.alais}}/{{nowSensor.position}}</div>
                    <div v-if="item.key=='type'">{{nowSensor.type}}</div>
                    <div v-else-if="item.key=='avalue'">{{scope.row.status}}</div>
                    <div v-else-if="item.key=='debug'">{{scope.row.debug>0?state.debugMap[scope.row.debug]:'--'}}</div>
                    <div v-else-if="item.key=='powerStatusList'||item.key=='feedStatusList'">
                        <span v-for="ob in scope.row[item.key]">{{ob}}<br></span>
                    </div>
                    <div v-else>{{scope.row[item.key]}}</div>
                </template>
            </el-table-column>
        </el-table>
        <my-pagination></my-pagination>
    </div>
</div>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import switchstatebar from "./switchstatebar.vue"
    export default {
        components: {
            switchstatebar
        },
        data() {
            return {
                imgsrc:'',
                showimg:false,
                paramsId:'',
                model:'1',
                day:'',
                startTime:'',
                endTime:'',
                analog:[],
                state: store.state,
                action: store.actions,
                isloading:false,
                showdata:false,
                lineTitle:"开关量",
                rdata:{detailHourType:0},
                nowSensor: {},
                psensor:{},
                alldata:[],
                timeRange:[],
                columns:[
					   {title: '地点/名称',key:'position'},
					   {title: '类型',key:'type'},
                       {title: '值',key:'avalue'},
                       {title: '调校',key: 'debug',},
                       {title: '读值时刻',key: 'starttime'},
                       {title: '起止时刻',key: 'startEndTime'},
                       {title: '报警/解除及时刻',key: 'alarmStatus'},
                       {title: '断电/复电',key: 'powerStatusList'},
                       {title: '馈电状态',key: 'feedStatusList'},
                       {title: '措施及时刻',key: 'measure'}
				],
                pickerOptions1: {
                      disabledDate(time) {
                        return time.getTime() > Date.now();
                      },
                      shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                          picker.$emit('pick', new Date());
                        }
                      }, {
                        text: '昨天',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24);
                          picker.$emit('pick', date);
                        }
                      }, {
                        text: '一周前',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                          picker.$emit('pick', date);
                        }
                      }]
                },

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
	   computed: {
	   	      chartData(){
                var vm = this
                var obj = {
                    list:[],
                    // debugDataList:[],
                    // debugDataList1:[],
                    // debugDataList2:[],
                    feedList:[],
                    yAxis:[]
                };
                obj.yAxis = [
                     {
                        type: 'value',
                        max:2,
                        minInterval: 1,
                        boundaryGap: [0, '60%'],
                        splitLine: {
                            show: false
                        },
                        axisLabel:{
                            formatter: function (value) {
                                var texts = [];
                                texts.push(vm.valueText[value+""] + '('+ value+')');
                                // if(value == 0){
                                //   texts.push(vm.valueText['0'] + '(0)');
                                // }
                                // else if (value == 1) {
                                // texts.push(vm.valueText['1'] + '(1)');
                                // }
                                // else if (value == 2) {
                                // texts.push('断线(2)');
                                // }
                                return texts;
                            }
                       },
                    },
                    {
                            type: 'value',
                            name: '馈电状态',
                            minInterval: 1,
                            min: 0,
                            max: 2,
                            show:vm.propsSensor.sensor_type===56?true:false,
                            nameGap:50,
                            offset:10,
                            position: 'right',
                            splitLine: {show: false},
                            nameTextStyle:{fontWeight:'bold',fontSize:14},
                            axisLabel:{
                                formatter: function (value) {
                                    var texts = [];
                                    if(value==0){
                                        texts.push('无馈电(0)');
                                    }else if(value == 1){
                                        texts.push('有馈电(1)');
                                    }else if(value == 2){
                                        texts.push('断线(2)')
                                    }
                                    return texts
                                }
                            },
                    }
                    ]

                _.forEach(vm.alldata, (m,index) => {
                    if(vm.propsSensor.sensor_type===56){
                         obj.feedList.push({
                            name:m.starttime,
                            value:[m.starttime,m.feedback],
                          })
                    }
                    obj.list.push({
                        name:m.starttime,
                        value:[m.starttime,m.avalue],
                        label:m
                    })
                    // if(m.debug>0){
                    //         if(m.debug==3){
                    //             //调校
                    //             obj.debugDataList.push({
                    //                 name:m.starttime,
                    //                 value:[m.starttime,m.avalue]
                    //             })
                    //         }else if(m.debug == 5){
                    //             //biao校
                    //             obj.debugDataList1.push({
                    //                 name:m.starttime,
                    //                 value:[m.starttime,m.avalue]
                    //             })
                    //         }else{
                    //             obj.debugDataList2.push({
                    //                 name:m.starttime,
                    //                 value:[m.starttime,m.avalue]
                    //             })
                    //         }
                    // }
                })
                vm.alldata.length = 0;
                return obj
           },
	   	   anchor(){
                let list = []
                list = this.timeRange
                return list
	     	 },
            propsSensor(){
                let obj = this.nowSensor
                return obj
            },
            valueText(){
                let obj = this.nowSensor.valueText
                return obj
            },
            overtime(){
                if(this.model=='1'&&this.day>=moment().format('YYYY-MM-DD')){
                    return true
                }else if(this.startTime=='23:00'&&this.day >= moment().format('YYYY-MM-DD')){
                    return true
                }
            },
        },
        created(){},
        mounted() {
             if(this.$route.params.aname=='0'){
                    this.paramsId = 0
             }else{
                this.paramsId =  this.$route.params.aname
             }
             this.state.listinfo.numperPage = 10
             this.getall()
        },
        methods: {
            printTime(){
                return moment().format('YYYY-MM-DD HH:mm:ss')
            },
            back(){
                if(this.model=='1'){
                   this.$router.go(-1)
                }else if(this.model=='2'){
                   this.alldaylong()
                }
            },
            tableRowClassName({row}){
                if(row.debug>0) {
                  return 'info-row-debug';
                }
                return '';
            },
            exportPrint(){
                this.imgsrc = this.$refs.echartBar.getImg()
                this.showimg = true
	        	setTimeout(() => {
                    $('#showprint').jqprint()
                    setTimeout(() => {
                        this.showimg = false
                    },10)
		  		},10)
            },
            fetchData(){
                this.day = this.day?this.day:moment().format('YYYY-MM-DD')
                this.startTime = this.startTime?this.startTime:'00:00'
                this.endTime = this.endTime?this.endTime:'23:59'
            },
            setday(val){
                 this.day = moment(this.day).add(val,'day').format('YYYY-MM-DD')
                 this.alldaylong()
            },
            alldaylong(){
                this.model = '1'
                this.startTime = '00:00'
                this.endTime = '23:59'
                this.inquire(0)
            },
            sethour(val){
                let startnowTime = this.day + ' ' + this.startTime + ':00'
                let endnowTime = this.day + ' ' + this.endTime + ':00'
                this.day = moment(startnowTime).add(val,'hour').format('YYYY-MM-DD')
                this.startTime = moment(startnowTime).add(val,'hour').format('HH:mm')
                this.endTime = moment(endnowTime).add(val,'hour').format('HH:mm')
                this.model = '2'
//                console.log(this.day,this.startTime,this.endTime,'sethour')
                this.inquire(1)
            },
            dblclicks(day,startTime,endTime){
//                console.log(day,startTime,endTime,'dblclicks')
                this.model = '2'
                this.day = day
                this.startTime = startTime
                this.endTime = endTime
                this.inquire(1)
            },
            inquire(num){
                   if(this.nowSensor.id){
//                        this.psensor = this.nowSensor
                        this.isloading = true
                        this.showdata = false
                        this.rdata.detailHourType = num
                        this.setRdata()
                        this.getData()
                   }else{
                       this.$message.error('请选择测点！');
                   }
            },
            getall(){
                this.analog = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['switch'] && m.sensor_type != 71)
                if(!this.analog.length){
                    return this.$message.error('系统没有开关量传感器！');
                }
                if(this.paramsId){
                        for(let item of this.analog){
                            if(item.uid == this.paramsId){
                                 this.nowSensor = item
                                 break;
                            }
                        }
                }else{
                   this.nowSensor = this.analog[0]
//                   console.log('来1')
                }
                this.day = moment().format('YYYY-MM-DD');
                this.alldaylong()
            },
            getTime(){
                if(this.model == '2'){
                    this.timeRange = [{name:this.day + ' ' + (this.endTime=='00:00'?'23:59:59':this.endTime+':00'),value:[this.day + ' ' + (this.endTime=='00:00'?'23:59:59':this.endTime+':00'),0]},
                                  {name:this.day + ' ' + this.startTime + ':00',value:[this.day + ' ' + this.startTime + ':00',0]}]
                    this.rdata.startTime = this.startTime
                    this.rdata.endTime = this.endTime
                }else if(this.model == '1'){
                    this.timeRange = [{name:this.day + ' 00:00:00',value:[this.day + ' 00:00:00',0]},
                                     {name:this.day + ' 23:59:59',value:[this.day + ' 23:59:59',0]}]
                    delete this.rdata.startTime
                    delete this.rdata.endTime
                }
            },
            setRdata(){
                this.getTime()
                this.rdata.day = this.day
                this.rdata.model = this.model
                this.rdata.ip = this.nowSensor.ipaddr
                this.rdata.devid = this.nowSensor.sensorId
                this.rdata.uid = this.nowSensor.uid
                this.rdata.type = 0
                this.rdata.typeName = 'StatusCurve'
                this.rdata.max = 2
//                console.log(this.rdata,'this.rdata')
            },
            getData(){
            	 var vm = this
                 api.analyze.realtime(vm.rdata).then(function(res){
//                     console.log(res,'开关量历史状态数据')
            	 	if(res.data.result.status==0){
                         vm.alldata = []
                         vm.alldata = res.data.result.data
                         vm.action.setShowList(vm.alldata)
                         vm.showdata = true
            	 	 }else{
                        vm.$message.error(res.data.result.msg);
                     }
                     vm.isloading = false
            	 })
            },
            chooseSensor(){
                    this.showdata = false
                    this.isloading = true
                    this.setRdata()
                    this.getData()
            },
            datazooms(val){},
            toBar(){
                this.$router.push({
                        name: 'bar',
                        query:{
                            id:this.nowSensor.id||0,
                            startTime:this.day?this.day+' 00:00:00':moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                })
            }
        },
    };

</script>
