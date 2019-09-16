<template>
      <div style="width:100%;height:500px;margin-top:-5px;padding: 0 10px;" id="time"></div>
</template>
<script>
import api from 'src/api'
import store from 'src/store';
const echarts = require('echarts');
var myChart; 
export default {
	props:{
		chartData:Object,
		anchor:Array,
        model:String,
        sensor:Object,
        valueText:Object,
	},
	data () {
		return {
            msg: 'hello word',
            state:store.state,
            tooltipTime:'',
            rdata:{
                avgvalue:"#6FB8D7",
                cbvalue:"#EE0909",
                feedvalue:"#479811",
                level1:"red",
                level2:"#FF6100",
                level3:"#F7BA2A",
                level4:"#1D8CE0",
                maxvalues:"#E484DC",
                minvalue:"#93F2C2",
                realvalue:"#8485D9",
                supplyvalue:'#E80B0B',
                initialColor:'#E77D7D',
                calibratevalue:'red',     
                unusualvalue:'red'
            }
		}
	},
	computed: {
		options: function() {
			let vm = this
			return {	
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {  
                        let list = []
                        vm.tooltipTime = params[0].name;
                        list.push(`
                                名称/地点：${vm.sensor.alais + '/' +vm.sensor.position}<br/>
                                时间：${vm.tooltipTime}<br/>
                        `)
                        params.forEach((item,index) => {
                                    if(item.seriesName === "状态值"){
                                        let label = item.data.label;
                                        list.push(`
                                                状态：${label.status?label.status:'-'}<br/>
                                                数据状态：${vm.state.debugMap[label.debug]?vm.state.debugMap[label.debug]:'-'}<br/>
                                                起止时刻(读值时区)：${label.startEndTime}<br/>
                                                报警/解除及时刻：${label.alarmStatus?label.alarmStatus:'-'}<br/>
                                                断电/复电：${label.powerStatusList&&label.powerStatusList.length>0?label.powerStatusList.join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'):'-'}<br/>
                                                馈电状态：${label.feedStatusList&&label.feedStatusList.length>0?label.feedStatusList.join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'):'-'}<br/>
                                                措施及时刻：${label.measure?label.measure:'-'}<br/>
                                            `)  
                                    }
                                        
                        })
                      list.push(`${vm.model==1?'可双击查看一小时详细数据':''}`)
                      return list.join('')    
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    // data:['状态值','馈电状态'],
                    data:vm.sensor.sensor_type===56?['状态值','馈电状态']:['状态值'],
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    triggerEvent:true,
                },
//                 toolbox: {
//		            feature: {
//		                dataZoom: {
//		                    yAxisIndex: false
//		                },
//		                brush: {
//		                    type: ['lineX', 'clear']
//		                }
//		            }
//		        },
                grid: {
                    top: 150,
                    left: '2%',
                    right: '3.2%',
                    containLabel: true,
                    bottom: 50
                },
                yAxis: vm.chartData.yAxis,
                dataZoom: [{
                    textStyle: {
                        color: '#8392A5'
                    },
                    realtime: true,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    //handleSize: '80%',
//                    start: 90,
//                    end: 100,
                    show:true,  
                    zoomOnMouseWheel:true,
                    zoomLock:false,
                    dataBackground: {
                        areaStyle: {
                            color: '#000'
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: '#000'
                        }
                    },
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }, {
                    type: 'inside'
                }],
                series: [
                {
                    name: '状态值',
                    step: 'end',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    data: this.chartData.list,
                    itemStyle: {
                        normal: {
                            color:this.rdata.feedvalue||'#4215c5'
                        }
                    }
                },
                 //馈电状态                
                {
                    yAxisIndex: 1,
                    name: '馈电状态',
                    step: 'start',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    data: vm.chartData.feedList,
                    animation:false,
                    itemStyle: {normal: {color:this.rdata.supplyvalue||'red'}},   
                },
                                //异常数据
                // {
                //     name: '调校数据',
                //     type: 'scatter',
                //     symbolSize:3,
                //     animation:false,
                //     itemStyle: { 
                //             normal: {
                //                 color:this.rdata.cbvalue||'red',
                //                 opacity: 0.8
                //             }
                //     },
                //     data: this.chartData.debugDataList
                // },
                // {
                //     name: '标校数据',
                //     type: 'scatter',
                //     symbolSize:3,
                //     animation:false,
                //     itemStyle: { 
                //             normal: {
                //                 color:this.rdata.calibratevalue||'red',
                //                 opacity: 0.8
                //             }
                //     },
                //     data: this.chartData.debugDataList1
                // },
                // {
                //     name: '设备异常数据',
                //     type: 'scatter',
                //     symbolSize:3,
                //     animation:false,
                //     itemStyle: { 
                //             normal: {
                //                 color:this.rdata.unusualvalue||'red',
                //                 opacity: 0.8
                //             }
                //     },
                //     data: this.chartData.debugDataList2
                // },
                {
			        name:'时间范围',
			        type:'line', 
			        showSymbol:false, 
			        data:this.anchor,
			        itemStyle:{normal:{opacity:0}},
			        lineStyle:{normal:{opacity:0}}
		       }]			
  		  }
		}
	},
	watch: {
     'chartData' : 'getinfo',
     'options' : {
	      handler: 'getinfo',
	      deep: true
	    }
	},
	methods: {
        getImg(){
              return myChart.getDataURL()
        },
        getColor(){
            var vm = this
            api.user.getColor().then(function(res) { 
                if(res.data.status == 0){
                    _.assign(vm.rdata,res.data.data)
                }else{
                    vm.$message.error(res.data.msg);
                }
            })
        },
		getinfo() {
             var me = this
			 //var myChart = echarts.init(document.getElementById('time'));
              myChart = echarts.getInstanceByDom(document.getElementById('time'));
              if (myChart === undefined) {  
                myChart = echarts.init(document.getElementById('time'));
              }
			  myChart.setOption(this.options)
			  window.addEventListener('resize', function () {
	            myChart.resize();
	         });
             myChart.on('datazoom', function (params) {
                 me.$emit('datazooms',params)
//                 alert(params.start + "||" + params.end + "||" + params.startValue + "||" + params.endValue);
             });
            myChart.getZr().on('dblclick',params=>{
                   if(me.tooltipTime && me.$route.name != 'watching-index/switch-data'){
                        let day = me.tooltipTime.substring(0,10) 
                        let str = ~~me.tooltipTime.substring(11,13)
                        let startTime = str<10?'0' + str + ':00':str + ':00'
                        str++
                        let endTime = str<10?'0' + str + ':00':str + ':00' 
                        me.$emit('dblclicks',day,startTime,endTime)
                        me.tooltipTime = ''
                   }else{
                       return
                   }     
            });
            myChart.on('dblclick', function (params,dd) {
                if(params.componentType == "xAxis" && me.$route.name != 'watching-index/switch-data'){  
                    let day = new Date().getFullYear() + '-' + params.value.substring(6,11)
                    let str = ~~params.value.substring(0,2)
                    let startTime = str<10?'0' + str + ':00':str + ':00'
                    str++
                    let endTime = str<10?'0' + str + ':00':str + ':00' 
                    me.$emit('dblclicks',day,startTime,endTime)
                }
            });
		}
	},
	beforeCreate () {
		this.$nextTick(() => {
	      // 代码保证 this.$el 在 document 中
	      this.getinfo()
          this.getColor()
	    })
        
      
}
}
</script>
