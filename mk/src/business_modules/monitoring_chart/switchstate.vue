<style>
</style>
<template>
<div>
    <el-card>
        <p slot="header">
            <span class="fa fa-sliders"> 开关量实时状态图</span>
        </p>
        <el-form label-width="100px" inline>
             <el-form-item label="选择设备">
                    <el-select v-model="nowSensor" style="width:350px;"  value-key="id" @change="chooseSensor" size="small" :disabled="isloading" filterable>
                        <el-option
                            v-for="item in analog"
                            :value="item"
                            :key="item.id"
                            :label="item.alais + '/'+item.type+'/'+item.position">
                        </el-option>
                    </el-select>
                    <el-button size="small" type="primary" :disabled="isloading" @click="toSwitchHistoryLine">历史状态</el-button>
                    <el-button size="small" type="primary" :disabled="isloading" @click="toSwitchHistoryLine" icon="el-icon-tickets">开机效率图</el-button>
                    <el-button size="small" type="primary" @click="$router.push({name: 'sensorcall',query: {id:nowSensor.id,type:2}})"  :disabled="isloading"  icon="el-icon-tickets">调用列表</el-button>
                    <el-button size="small" type="primary" @click="$router.push({path: '/mcall/switchcallp',query: {id:nowSensor.sensorId,ob:nowSensor,type:2}})"  :disabled="isloading"  icon="el-icon-tickets">调用报表</el-button>
                    <el-button size="small" type="primary" :disabled="isloading" @click="exportPrint"  icon="el-icon-printer">打印图表</el-button>
                    <el-button size="small" type="primary" :disabled="isloading" @click="$router.go(-1)" icon="el-icon-back">返回</el-button>
             </el-form-item>
         </el-form>
    </el-card>
    <div v-loading.body="isloading" element-loading-text="加载中..." style="padding:20px;" id="showprint">
        <div v-if="showimg">打印时间：{{printTime()}}</div>
        <div style="position: relative;"  v-if="showdata">
            <div style="flex-direction: column;position: absolute;top:0;left:20px" :style="{fontSize:showimg?'12px':'14px'}">
                <label>分站：</label><span>{{nowSensor.ipaddr}}</span><br>
                <label>编号：</label><span>{{nowSensor.alais}}</span><br>
                <label>类型：</label><span>{{nowSensor.type}}</span><br>
                <label>位置：</label><span>{{nowSensor.position}}</span><br>
                <label>报警值：</label><span v-if="nowSensor.alarm_status==-1">未设置</span><span v-else>{{nowSensor.valueText[nowSensor.alarm_status]}}</span>
            </div>
            <h4 style="font-size: 18px;text-align: center;margin-bottom: 60px">{{nowSensor.alais}}&nbsp;十分钟内<br>开关量实时状态图</h4>
        </div>
       <img :src="imgsrc" v-if="showimg"  style="width: 100%;">
       <switchstatebar
              v-show="!showimg"
              v-if="showdata"
              ref="echartBar"
              @datazooms='datazooms'
              :chartData="chartData"
              :anchor="anchor"
              :sensor="propsSensor"
              :valueText="valueText">
       </switchstatebar>
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
                timeId:'',
                analog:[],
                state: store.state,
                action: store.actions,
                nowSensor: {},
                rdata:{},
                alldata:[],
                isloading:false,
                showdata:false,
                timeRange:[],
                startTime:'',
                endTime:'',
                psensor:{}

           }
        },
//        watch: {
//	       '$route': 'fetchData',
//	   },
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
                        max:vm.propsSensor.sensor_type===56?1:2,
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
                                //     texts.push(vm.valueText['0'] + '(0)');
                                // }
                                // else if (value == 1) {
                                //     texts.push(vm.valueText['1'] + '(1)');
                                // }
                                // else if (value == 2) {
                                //     texts.push(vm.valueText['2'] + '(2)');
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
                            max: vm.propsSensor.sensor_type===56?1:2,
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
                let obj = this.propsSensor.valueText
                return obj
            }
        },
        created(){},
        mounted() {
            if(this.$route.params.aname=='0'){
                    this.paramsId = 0
             }else{
                    this.paramsId = this.$route.params.aname
             }
            // this.state.indexNum = false
            this.getAll()
        },
        beforeDestroy: function (){
			window.clearInterval(this.timeId);
	    },
        methods: {
            printTime(){
                return moment().format('YYYY-MM-DD HH:mm:ss')
            },
            exportPrint(){
                this.imgsrc = this.$refs.echartBar.getImg()
                this.showimg = true
	        	setTimeout(() => {
                    $('#showprint').jqprint()
                    this.showimg = false
		  		},10)
            },
            getAll(){
                this.analog = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['switch'] && m.sensor_type != 71)
                if(this.paramsId){
                        for(let item of this.analog){
                            if(item.uid == this.paramsId){
                                this.nowSensor = item
                                break;
                            }
                        }
                }else{
                    this.nowSensor = this.analog[0]
                }
                this.checks()
            },
            toSwitchHistoryLine(){
                this.$router.push({name:'switchHistoryLine',params:{aname:this.nowSensor.uid?this.nowSensor.uid:0}})
            },
            toBar(){
               this.$router.push({
                        name: 'bar',
                        query:{
                            id:this.nowSensor.id||0,
                            startTime:this.day?this.day+' 00:00:00':moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                })
            },
            chooseSensor(){
               this.sure()
            },
            datazooms(val){},
            toHome(){
                this.$router.go(-1)
            },
            sure(){
                   if(this.nowSensor.id){
                        this.checks()
                   }else{
                       this.$message.error('请选择测点！');
                   }
            },
            checks(){
                this.showdata = false;
                this.isloading = true;
                this.rdata.type = 0;
                this.rdata.model = 2;
                this.rdata.typeName = 'StatusCurve';
                this.rdata.ip = this.nowSensor.ipaddr;
                this.rdata.devid = this.nowSensor.sensorId;
                this.rdata.uid = this.nowSensor.uid;
                this.rdata.max = 2;
                this.nowSensor.max = this.rdata.max;
                this.getData();
                clearInterval(this.timeId);
                this.timeId = setInterval(() => {
                      this.getData()
                },5000)
            },
//            切换时间
            getTime(){
                this.startTime = moment().add(-1/6,'hour').format('YYYY-MM-DD HH:mm:ss');
                this.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
                this.timeRange = [{name:this.endTime,value:[this.endTime,0]},
                                  {name:this.startTime,value:[this.startTime,0]}]
                this.rdata.day = moment().format('YYYY-MM-DD');
                this.rdata.startTime = moment().add(-1/6,'hour').format('HH:mm');
                this.rdata.endTime = moment().format('HH:mm');

            },
            getData(){
            	 var vm = this
                 vm.getTime()
//                 console.log(this.rdata,'this.rdata')
                 api.analyze.realtime(vm.rdata).then(function(res){
//                 	console.log(res,'开关量状态')
            	 	if(res.data.result.status==0){
                         vm.alldata = []
                         vm.alldata = res.data.result.data
                         vm.showdata = true
                         vm.isloading = false
            	 	 }else{
                        vm.isloading = false
                        vm.$message.error(res.data.result.msg);
                    }
            	 })
            },
        },
    };

</script>
