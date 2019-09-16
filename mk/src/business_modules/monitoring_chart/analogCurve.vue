<style>
</style>
<template>
<div>
    <el-card>
            <p slot="header">
                <span class="fa fa-line-chart"> {{pageTitle}}</span>
            </p>
             <el-form ref="form" :model="form" inline label-position="right" class="formcss">
                 <el-form-item label="选择测点">
                    <el-select v-model="nowSensor" style="width:350px;" value-key="id" @change="chooseSensor" size="small" filterable>
                        <el-option v-for="item in sensorList" :value="item" :key="item.id" :label="item.alais + '/' +item.type+ '/' +item.position"></el-option>
                    </el-select>
                 </el-form-item>
                 <el-form-item label="断馈电仪">
                    <el-select v-model="feedSensorUid" filterable size="small" :disabled="!feedSensorList.length" style="width: 350px;" @change="changefeed" :placeholder="!feedSensorList.length?'没有数据上报':'请选择'">
                            <el-option v-for="item in feedSensorList" :value="item.uid" :key="item.uid" :label="item.detailDescription"></el-option>
                     </el-select>
                 </el-form-item>
                 <el-form-item label="">
                         <el-button size="small" type="primary" @click="toHistoryLine" :disabled="isloading">历史曲线</el-button>
                         <el-button size="small" type="primary" @click="$router.push({name: 'sensorcall',query: {id:nowSensor.id,type:1}})" :disabled="isloading" icon="el-icon-tickets">调用列表</el-button>
                         <el-button size="small" type="primary" @click="$router.push({path: '/mcall/analogcallp',query: {id:nowSensor.sensorId,ob:nowSensor,type:1}})" :disabled="isloading" icon="el-icon-tickets">调用报表</el-button>
                         <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" :disabled="isloading">打印图表</el-button>
                         <el-button size="small" type="primary" @click="$router.go(-1)" :disabled="isloading" icon="el-icon-back">返回</el-button>
                 </el-form-item>
             </el-form>
	</el-card>
    <div style="padding:20px;" v-loading.body="isloading" element-loading-text="加载中..." id="showprint">
        <div v-if="showimg">打印时间：{{printTime()}}</div>
        <div v-if="showdata" style="position: relative;">
            <div :style="{display:'flex',flexDirection:'row',position:'absolute',top:0,left:'20px',backgroundColor:'white',fontSize:showimg?'12px':'14px'}">
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
            <h4  style="font-size: 18px;text-align: center;margin-bottom: 60px">{{nowSensor.alais}}&nbsp;十分钟内<br>{{pageTitle}}</h4>
        </div>
        <img :src="imgsrc" v-if="showimg"  style="width: 100%;">
        <analogcurvebar
                v-show="!showimg"
                v-if="showdata"
                ref="echartBar"
                @datazooms='datazooms'
                @changevalue="changevalue"
                :chartData="chartData"
                :anchor="anchor"
                :start="start"
                :end="end"
                :feedDataList="feedDataList"
                :sensor="nowSensor">
        </analogcurvebar>
	</div>
</div>
</template>

<script>
    import api from 'src/api';
    import store from 'src/store';
    import analogcurvebar from "./analogcurvebar.vue";
    export default {
        components: {
            analogcurvebar
        },
        data() {
            return {
                feedSensorUid:'',
                feedSensorList:[],
                feedData:[],
                valuesItem:{
                    max:'',
                    min:'',
                    avg:''
                },
                state: store.state,
                action: store.actions,
                sensorList:[],
                getDataTimeId:'',
                getSensorListTimeId:'',
                pageName:'analogCurve',
                queryType:'call',
                pageTitle:'模拟量实时曲线',
                paramsAname:'0',
                paramsApi:0,
                pageContent:{
                    'call':{label:'模拟量实时曲线',params:0},
                    'alarm':{label:'模拟量报警曲线',params:1},
                    'outage':{label:'模拟量断电控制曲线',params:2},
                    'feed':{label:'模拟量馈电异常曲线',params:3},
                },
                timeRange:[],
                startTime:'',
                endTime:'',
                day:'',
                nowSensor: {},
                rdata:{},
                alldata:[],
                showdata:false,
                isloading:false,
                showimg:false,
                imgsrc:'',
                startNum:0,
                endNum:100,
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
       },
       mounted() {
            this.fetchData();
        },
        methods: {
            changevalue(params){
                this.valuesItem = params;
            },
            //  切换菜单和初始化处理
            fetchData(){
                this.paramsAname = this.$route.params.aname || '0';
                this.queryType = this.$route.query.type || 'call';
                this.pageTitle = this.pageContent[this.queryType].label;
                this.paramsApi = this.pageContent[this.queryType].params;
                this.pageName = this.$route.name;
                this.showdata = false;
                this.isloading = true;
                this.nowSensor = {};
                this.getSensorList();
                window.clearInterval(this.getDataTimeId)
                window.clearInterval(this.getSensorListTimeId);
                if(this.$route.name === 'analogCurve' && this.queryType != 'call'){
                      this.getSensorListTimeId = setInterval(() => {
                                this.getSensorList();
                      },10000)
                }
            },
            // 获取设备列表
            getSensorList(){
                 api.station.getalarmequipment(this.paramsApi).then((res) => {
                         console.log(res,'设备')
                         if(res.data.status == 0){
                            this.sensorList = []
                            this.sensorList = res.data.data;
                            if(!this.nowSensor.uid&&this.sensorList.length){
                                this.setNowSensor();
                            }else{
                                this.isloading = false;
                            }
                         }else{
                             this.$message.error(res.data.msg);
                         }
                 	    
                 });
            },
            // 设备当前设备
            setNowSensor(){
                this.nowSensor = this.sensorList[0];
                if(this.queryType === 'call' && this.paramsAname !== '0'){
                    for(let item of this.sensorList){
                        if(item.uid === this.paramsAname){
                            this.nowSensor = item;
                            break;
                        }
                    }
                }
                this.initSensor();

            },
             // 初始化设备信息 和 参数信息
            initSensor(){
                this.showdata = false;
                this.isloading = true;
                this.nowSensor.hasfloor = this.nowSensor.hasfloor || 0;
                this.action.initLevelValue(this.nowSensor);//初始化分级值
                this.isSetLevel = {
                    level1:this.nowSensor.upper_level1 || this.nowSensor.floor_level1 ? true:false,
                    level2:this.nowSensor.upper_level2 || this.nowSensor.floor_level2 ? true:false,
                    level3:this.nowSensor.upper_level3 || this.nowSensor.floor_level3 ? true:false,
                    level4:this.nowSensor.upper_level4 || this.nowSensor.floor_level4 ? true:false,
                };
                this.rdata.typeName = 'RealTimeCurve';
                this.rdata.ip = this.nowSensor.ipaddr;
                this.rdata.devid = this.nowSensor.sensorId;
                // this.rdata.max = this.nowSensor.limit_power; // Y轴上限 最大值;
                this.rdata.max = Math.max(this.nowSensor.limit_power || this.nowSensor.floor_repower) ; // Y轴上限 最大值;
                this.nowSensor.max = this.rdata.max;
                this.callGetData();
            },
            // 开始定时器 轮询getdata
            callGetData(){
                this.getData();
                window.clearInterval(this.getDataTimeId);
                this.getDataTimeId = setInterval(() => {
                        this.getData();
                },5000)
            },
            getTime(){
                this.startTime = moment().add(-1/6,'hour').format('YYYY-MM-DD HH:mm:ss');
                this.endtime = moment().format('YYYY-MM-DD HH:mm:ss');
                this.timeRange = [{name:this.endtime,value:[this.endtime,0]},
                                  {name:this.startTime,value:[this.startTime,0]}]
                this.rdata.startTime = this.startTime.split(' ')[1];
                this.rdata.endTime = this.endtime.split(' ')[1];
                this.rdata.day = moment().format('YYYY-MM-DD');
            },
            getData(){
            	 var vm = this
                 vm.getTime()
                 api.analyze.realtime(vm.rdata).then(function(res){
                    //  console.log(res,'data');
                     let result = res.data.result;
            	 	if(result.status === 0){
                         vm.alldata = [];
                         vm.alldata = result.data;
                         vm.nowSensor.max = result.max;
                         vm.nowSensor.avg = result.avg;
                         vm.feedSensorList = result.feedData || [];
                         vm.setFeedList();

            	 	 }else{
                        vm.$message.error(result.msg);
                    }
                    vm.isloading = false
                    vm.showdata = true
            	 })
            },
            //断电设备列表
            setFeedList(){
                  if(this.feedSensorList && this.feedSensorList.length){
                      let row = this.feedSensorList.find(m1 => m1.uid === this.feedSensorUid);
                      if(row){
                          this.feedData = row.dataList;
                      }else{
                          this.feedSensorUid = this.feedSensorList[0].uid;
                          this.feedData = this.feedSensorList[0].dataList;
                      }
                  }else{
                      this.feedSensorUid = '';
                      this.feedData = [];
                  }
            },
            // 切换设备
            chooseSensor(){
                this.feedSensorList = [];
                this.feedData = [];
                this.feedSensorUid = '';
                this.initSensor();
            },
            //打印时间
            printTime(){
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            //打印图片
            exportPrint(){
                this.imgsrc = this.$refs.echartBar.getImg()
                this.showimg = true
	        	setTimeout(() => {
                    $('#showprint').jqprint()
                    this.showimg = false
		  		},10)
            },
            //曲线放大缩小回调
            datazooms(val){
                if(val.batch){
                    this.startNum = ~~val.batch[0].start
                    this.endNum = ~~val.batch[0].end
                }else{
                    this.startNum = ~~val.start
                    this.endNum = ~~val.end
                }
                // console.log(this.startNum,this.endNum)
            },
            //返回上一次页面
            toHome(){
                this.$router.go(-1)
            },
            //模拟量历史曲线
            toHistoryLine(){
                this.$router.push({name:'historyLine',params:{aname:this.nowSensor.uid||'0'}})
            },
            changefeed(val){
                this.getData();
            },
        },
        beforeDestroy: function (){
                 console.log("beforeDestroy -- 实时曲线");
                 this.alldata = null;
                 this.feedData = null;
				 window.clearInterval(this.getDataTimeId);
				 window.clearInterval(this.getSensorListTimeId);
	    },
	   computed: {
            //    断馈电值数据列表
             feedDataList(){
                 var list = [];
                 if(this.feedData.length){
                     list = this.feedData.map(m => {
                         return {
                             name:m.starttime,
                             value:[m.starttime,m.avalue]
                         }
                     })
                 }
                 this.feedData.length=0
                 return list
             },
            //  X轴 时间范围
             anchor(){
                    let list = [];
                    list = this.timeRange;
                    return list
             },
             //数据处理
             chartData(){
                //  console.time("time")
                  let vm = this;
                  let obj = {
                      allDatalist:[],
                      changing_2:[],
                      changing_3:[],
                      debugDataList:[],
                      debugDataList1:[],
                      debugDataList2:[],
                      level1List:[],
                      level2List:[],
                      level3List:[],
                      level4List:[]
                  }
                    let beforelevel = 0;

                    vm.alldata.forEach((m,index) => {
                        // m.changing = Math.round(Math.random()*4);
                        // m.debug = Math.round(Math.random()*8);
                        let itemData = {
                            name:m.starttime,
                            value:[m.starttime,m.avalue]
                        };
                        let itemLevelData = {
                            name:m.starttime,
                            value:[m.starttime,null]
                        };
                        //实时
                        obj.allDatalist.push({
                            name:m.starttime,
                            value:[m.starttime,m.avalue],
                            label:m
                        });
                        //异常数据
                        if(m.debug>0){
                            if(m.debug==3){
                                //调校
                                obj.debugDataList.push(itemData);
                            }else if(m.debug == 5){
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
                     vm.alldata.length = 0;
                    //  console.timeEnd("time")
                    return obj
             },
             start(){
                let num = this.startNum
                return num
            },
             end(){
                let num = this.endNum
                return num
             }
        },
    };

</script>
