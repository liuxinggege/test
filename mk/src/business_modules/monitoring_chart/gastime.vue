<style lang="less">
    @import '../../styles/common.less';
    .sensorMsg{
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
    }
</style>
<template>
  <div>
       <el-card>
            <p slot="header">
                <span class="fa fa-line-chart"> 瓦斯抽放实时曲线</span>
            </p>
             <el-form ref="form" :model="form" inline label-position="right" class="formcss">
                  <el-form-item label="选择设备">
                      <el-select v-model="nowSensor" style="width:350px;" filterable value-key="id" @change="chooseSensor" size="small" :disabled="isloading">
                          <el-option v-for="item in analog" :value="item" :key="item.id" :label="item.alais + '/'+item.position+ '/' +item.type"></el-option>
                      </el-select>
                   </el-form-item>
                   <el-form-item label="选择参数">
                          <el-select v-model="nowParameter" style="width:350px;" @change="chooseParameter" size="small" :disabled="isloading">
                              <el-option v-for="item in parameterList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                    </el-select>
                 </el-form-item>
                 <el-form-item label="">
                         <el-button size="small" type="primary" @click="toHistoryLine" :disabled="isloading">历史曲线</el-button>
                         <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" :disabled="isloading">打印图表</el-button>
                         <el-button size="small" type="primary" @click="$router.go(-1)" :disabled="isloading" icon="el-icon-back">返回</el-button>
                 </el-form-item>
             </el-form>
         </el-card>
     <div style="padding:20px;position: relative;" v-loading.body="isloading" element-loading-text="加载中..." id="showprint">
                <div :style="{display:'flex',flexDirection:'row',position:'absolute',top:'20',left:'20px',backgroundColor:'white',fontSize:showimg?'12px':'14px'}" v-if="showdata">
                            <div style="flex-direction: column;">
                                      <label>分站：</label><span>{{nowSensor.ipaddr}}</span><br>
                                      <label>编号：</label><span>{{nowSensor.alais}}</span><br>
                                      <label>类型：</label><span>{{nowSensor.type}}</span><br>
                                      <label>位置：</label><span>{{nowSensor.position}}</span><br>
                             </div>
                </div>
              <h4 v-if="showdata" style="font-size: 18px;text-align: center;margin-bottom: 60px">{{nowSensor.alais}}&nbsp;十分钟内<br>瓦斯抽放{{nowtitle}}实时曲线数据</h4>
              <img :src="imgsrc" v-if="showimg"  style="width: 100%;">
              <gasline v-show="!showimg" v-if="showdata" ref="echartBar" @datazooms='datazooms' :chartData="chartData" :anchor="anchor" :feedDataList="feedDataList" :lineTitle="lineTitle"  :sensor="propsSensor" :start="start" :end="end"></gasline>
       </div>
  </div>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import gasline from "./gasline.vue"
    export default {
        components: {
            gasline
        },
        data() {
            return {
                feedSensorUid:'',
                feedSensorList:[],
                feedData:[],
                imgsrc:'',
                showimg:false,
                paramsId:"0",
                startNum:0,
                endNum:100,
                analog:[],
                nowtitle:'',
                lineTitle:"模拟量",
                state: store.state,
                action: store.actions,
                nowSensor: {},
                rdata:{},
                alldata:[],
                showdata:false,
                isloading:false,
                timeRange:[],
                startTime:'',
                endTime:'',
                timeId:'',
                day:'',
                gasUnit:'℃',
                nowParameter:'1',
                parameterList:[{
                  value: '1',
                  label: '温度'
                }, {
                  value: '2',
                  label: '压力'
                }, {
                  value: '3',
                  label: '瓦斯浓度'
                }, {
                  value: '4',
                  label: '一氧化碳浓度'
                }, {
                  value: '5',
                  label: '工况混合流量'
                }]

           }
        },
        watch: {
//         '$route': 'fetchData',
     },
     computed: {
             chartData(){
                    var vm = this
                    var yAxis = [{
                            type: 'value',
                            name:vm.propsSensor.type!=69?vm.propsSensor.type:vm.propsSensor.name,
                            max:50,
                            axisLabel:{formatter:'{value}' + vm.gasUnit,},
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
                            nameGap:50,
                            offset:60,
                            show:vm.feedSensorList.length>0?true:false,
                            position: 'right',
                            splitLine: {show: false},
                            nameTextStyle:{fontWeight:'bold',fontSize:14},
                            axisLabel:{
                                formatter: function (value) {
                                    return [value==1?'断开(1)':'接通(0)']
                                }
                            },
                    }]
                    var allDatalist =[]
                    _.forEach(vm.alldata, (m) => {
                            switch (vm.nowParameter){
                                  case '1':
                                      allDatalist.push({
                                          name:m.responsetime,
                                          value:[m.responsetime,m.temperature,vm.gasUnit]
                                      })
                                  break;
                                  case '2':
                                      allDatalist.push({
                                    name:m.responsetime,
                                    value:[m.responsetime,m.pressure,vm.gasUnit]
                                })
                                  break;
                                  case '3':
                                     allDatalist.push({
                                    name:m.responsetime,
                                    value:[m.responsetime,m.wasi,vm.gasUnit]
                                })
                                  break;
                                  case '4':
                                      allDatalist.push({
                                    name:m.responsetime,
                                    value:[m.responsetime,m.co,vm.gasUnit]
                                })
                                  break;
                                  default:
                                      allDatalist.push({
                                    name:m.responsetime,
                                    value:[m.responsetime,m.flow_work,vm.gasUnit]
                                })
                            }
                    })
                    return {allDatalist,yAxis}
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
            start(){
                let num = this.startNum
                return num
            },
            end(){
                let num = this.endNum
                return num
           }
        },
        mounted() {
            this.paramsId = this.$route.params.aname || '0'
            this.getAll()
            this.chooseTitle()
        },
        methods: {
            changefeed(val){
                this.rdata.uid = val
                this.sure()
            },
            exportPrint(){
                this.imgsrc = this.$refs.echartBar.getImg()
                this.showimg = true
            setTimeout(() => {
                    $('#showprint').jqprint()
                    this.showimg = false
          },10)
            },
            chooseSensor(){
                this.sure()
            },
            chooseParameter(value){
              switch (value){
                case '1':
                    this.gasUnit = '℃'
                break;
                case '2':
                    this.gasUnit = 'kPa'
                break;
                case '3':
                    this.gasUnit = '%'
                break;
                case '4':
                    this.gasUnit = '%'
                break;
                default:
                    this.gasUnit = 'm³/min'
              }
              this.chooseTitle()
            },
            chooseTitle(){
              switch (this.nowParameter){
                  case '1':
                    this.nowtitle = '温度'
                  break;
                  case '2':
                    this.nowtitle = '压力'
                  break;
                  case '3':
                    this.nowtitle = '瓦斯浓度'
                  break;
                  case '4':
                    this.nowtitle = '一氧化碳浓度'
                  break;
                  default:
                    this.nowtitle = '工况混合流量'
              }
            },
            datazooms(val){
                if(val.batch){
                    this.startNum = ~~val.batch[0].start
                    this.endNum = ~~val.batch[0].end
                }else{
                    this.startNum = ~~val.start
                    this.endNum = ~~val.end
                }
            },
            toHome(){
                this.$router.go(-1)
            },
            toHistoryLine(){
                this.$router.push({name:'gashistory',query:{aname:this.nowSensor.uid||'0'}})
            },
            getAll(){
                 this.analog = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['analog']&&m.sensor_type == 69)
                 if(this.analog.length){
                    if(this.paramsId !='0'){
                        for(let item of this.analog){
                            if(item.uid == this.paramsId){
                                this.nowSensor = item
                                break;
                            }
                        }
                    }else{
                       this.nowSensor = this.analog[0]
                    }
                    this.sure()
                 }
            },
            sure(){
                   if(this.nowSensor.id){
                        window.clearInterval(this.timeId)
                        this.showdata = false
                        this.isloading = true
                        this.rdata.type = 1
                        this.rdata.ip = this.nowSensor.ipaddr
                        this.rdata.devid = this.nowSensor.sensorId
                        this.rdata.model = 2
                        this.rdata.typeName = 'GD5Curve'
                        this.getData()
                        this.timeId = setInterval(() => {
                                if(this.$route.name!='gastime')return clearInterval(this.timeId)
                                this.getData()
                        },2000)
                   }else{
                       this.$message.error("请选择测点！")
                   }
            },
            getTime(){
                this.startTime = moment().add(-1,'hour').format('YYYY-MM-DD HH:mm:ss');
                this.endtime = moment().format('YYYY-MM-DD HH:mm:ss');
                this.timeRange = [{name:this.endtime,value:[this.endtime,0]},
                                  {name:this.startTime,value:[this.startTime,0]}]
                this.rdata.startTime = moment().add(-1,'hour').format('HH:mm')
                this.rdata.day = moment().format('YYYY-MM-DD');
            },
            getData(){
               var vm = this
                 vm.getTime()
                 api.analyze.realtime(vm.rdata).then(function(res){
                if(res.data.result.status==0){
                         vm.alldata = []
                         vm.alldata = res.data.result.data
                         vm.isloading = false
                         vm.showdata = true
                 }else{
                        vm.isloading = false
                        vm.$message.error(res.data.result.msg);
                    }
               })
            },
        },
    };

</script>
