<style lang="less">
</style>
<template>
<div>
 <el-card>
     <p slot="header">
        <span class="fa fa-line-chart"> 历史曲线显示</span>
     </p>
     <el-form ref="form" :model="form" inline label-position="right" class="formcss">
          <el-form-item label="选择设备">
                <el-select v-model="nowSensor" style="width:350px;" value-key="id" @change="chooseSensor" size="small" :disabled="isloading">
                    <el-option v-for="item in analog" :value="item" :key="item.id" :label="item.alais + '('+item.position+ '-' +item.type+')'"></el-option>
                </el-select>
             </el-form-item>
          <el-form-item label="选择参数">
              <el-select v-model="nowParameter" style="width:350px;" @change="chooseParameter" size="small" :disabled="isloading">
                    <el-option v-for="item in parameterList" :value="item.value" :key="item.value" :label="item.label"></el-option>
              </el-select>
          </el-form-item>
       <el-form-item label="">
                 <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" :disabled="isloading">打印图表</el-button>
                 <el-button size="small" type="primary" @click="$router.go(-1)" icon="el-icon-back" :disabled="isloading">返回</el-button>
       </el-form-item>
       <el-form-item label="" v-if="showdata" style="margin-left: 50px;">
                 <el-date-picker v-model="day" align="right" type="date" v-show="model==1" :clearable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1" size="small" style="width:150px;" @change="alldaylong"></el-date-picker>
                <el-button-group v-if="model==2">
                      <el-button size="small" @click="alldaylong" style="margin-right: 10px;">查看全天数据</el-button>
                      <el-button icon="el-icon-arrow-left" size="small" @click="sethour(-1)">前一小时</el-button>
                      <el-button size="small" @click="sethour(1)">后一小时<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
                <el-button-group v-else-if="model==1">
                      <el-button icon="el-icon-arrow-left" size="small" @click="setday(-1)">前一天</el-button>
                      <el-button size="small"  @click="setday(1)">后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
       </el-form-item>
    </el-form>
 </el-card>
 <div style="padding:20px;" v-loading.body="isloading" element-loading-text="拼命加载中">
        <div v-if="showdata" style="position: relative;">
                <div id="showprint">
                    <div :style="{display:'flex',flexDirection:'row',position:'absolute',top:0,left:'20px',backgroundColor:'white',fontSize:showimg?'12px':'14px'}">
                             <div style="flex-direction: column;">
                                      <label>分站：</label><span>{{nowSensor.ipaddr}}</span><br>
                                      <label>编号：</label><span>{{nowSensor.alais}}</span><br>
                                      <label>类型：</label><span>{{nowSensor.type}}</span><br>
                                      <label>位置：</label><span>{{nowSensor.position}}</span><br>
                             </div>
                    </div>
                    <h4 style="font-size: 18px;text-align: center;margin-bottom:60px">{{nowSensor.alais}}&nbsp;{{day}}&nbsp;{{startTime}}~{{endTime}}<br>{{nowtitle}}{{lineTitle}}曲线数据</h4>
                    <img :src="imgsrc" v-if="showimg" style="width: 100%;">
                    <gas-line v-show="!showimg" ref="echartBar" @datazooms='datazooms' :chartData="chartData" @dblclicks="dblclicks" :anchor="anchor" :model="model" :sensor="propsSensor"></gas-line>
                </div>
                <el-table :data="state.showlist" stripe v-if="showdata" border>
                        <el-table-column label="地点/名称" show-overflow-tooltip>
                          <template scope="scope">
                            <div>{{nowSensor.alais}}/{{nowSensor.position}}</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="temperature" label="温度"></el-table-column>
                        <el-table-column prop="pressure" label="压力"></el-table-column>
                        <el-table-column prop="wasi" label="瓦斯浓度"></el-table-column>
                        <el-table-column prop="co" label="一氧化碳浓度"></el-table-column>
                        <el-table-column prop="flow_work" label="工况混合流量"></el-table-column>
                        <el-table-column prop="responsetime" label="读值时刻" show-overflow-tooltip></el-table-column>

                </el-table>
                <my-pagination ></my-pagination>
        </div>
 </div>
</div>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import gasLine from "./gasHistoryLine.vue"

    export default {
        components: {
            gasLine
        },
        data() {
            return {
                imgsrc:'',
                showimg:false,
                nowtitle:'',
                lineTitle:'历史',
                paramsId:'',
                model:'1',
                day:'',
                analog:[],
                feedSensorUid:'',
                feedSensorList:[],
                state: store.state,
                action: store.actions,
                isloading:false,
                rdata:{
                  detailHourType:0,
                  type:0
                },
                alldata:[],
                feedData:[],
                timeRange:[],
                showdata:false,
                startTime:'',
                endTime:'',
                nowSensor: {},
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
                }],
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
                 return list
             },
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
                    var allDatalist =[]
                _.forEach(vm.alldata, (m,index) => {
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
            }
        },
        mounted() {
            this.state.listinfo.numperPage = 10
            this.paramsId = this.$route.query.aname || 0
            this.getAll()
            this.fetchData()
            this.chooseTitle()
        },
        methods: {
            exportPrint(){
                this.imgsrc = this.$refs.echartBar.getImg()
                this.showimg = true
	        	setTimeout(() => {
                    $('#showprint').jqprint()
                        this.showimg = false
                    },10)
            },
            fetchData(){
                // this.state.listinfo.numperPage = 10
                if(this.nowSensor.id){
                    this.chooseSensor(this.nowSensor)
                }else{
                    this.startTime = this.startTime?this.startTime:'00:00'
                    this.endTime = this.endTime?this.endTime:'23:59'
                }
            },
            datazooms(val){},
            dblclicks(day,startTime,endTime){
                this.model = '2'
                this.day = day
                this.startTime = startTime
                this.endTime = endTime
                this.rdata.type = 1
                this.inquire(1)
            },
            getAll(){
                this.analog = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['analog']&&m.sensor_type==69)

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
                this.day = moment().format('YYYY-MM-DD')
                this.alldaylong()
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
            chooseSensor(row){
                    this.showdata = false
                    this.isloading = true
                    this.setRdata()
                    this.getData()
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
            sethour(val){
                let startnowTime = this.day + ' ' + this.startTime + ':00'
                let endnowTime = this.day + ' ' + this.endTime + ':00'
                this.day = moment(startnowTime).add(val,'hour').format('YYYY-MM-DD')
                this.startTime = moment(startnowTime).add(val,'hour').format('HH:mm')
                this.endTime = moment(endnowTime).add(val,'hour').format('HH:mm')
                this.model = '2'
                this.inquire(1)

            },
            inquire(num){
                if(this.nowSensor.id){
                    this.showdata = false
                    this.isloading = true
                    this.rdata.detailHourType = num
                    this.rdata.type = num
                    this.setRdata()
                    this.getData()
                }else{
                   this.$message.error('请选择查寻的设备！');
                }
            },
            getData(){
            	 var vm = this
                 api.analyze.realtime(vm.rdata).then(function(res){
            	 	if(res.data.result.status==0){
                         vm.alldata = []
                         vm.alldata = res.data.result.data
                         vm.isloading = false
                         vm.showdata = true
                         vm.action.setShowList(vm.alldata)

            	 	 }else{
                         vm.isloading = false
                         vm.$message.error(res.data.result.msg);
                    }
            	 })
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
                this.rdata.typeName = 'GD5Curve'
                // this.rdata.type = 0
                this.rdata.day = this.day
                this.rdata.model = this.model
                this.rdata.ip = this.nowSensor.ipaddr
                this.rdata.devid = this.nowSensor.sensorId
            },

        },
    };

</script>
