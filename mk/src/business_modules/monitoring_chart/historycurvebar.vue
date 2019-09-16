<template>
    <div style="width:100%;height:500px;margin-top:-5px;padding: 0 10px;" id="time"></div>
</template>
<script>
import api from 'src/api';
import store from 'src/store';
export default {
	props:{
		chartData:Object,
		anchor:Array,
        sensor:Object,
        feedDataList:Array
	},
	data () {
		return {
			echarts:require('echarts'),
            tooltipTime:'',
            state:store.state,
            myChart:null,
            maxValue:'',
            minValue:'',
            avgValue:'',
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
                calibratevalue:'blue',     
                unusualvalue:'blue',
                changing2value:'blue',
                changing3value:'blue',
            },
		}
	},
	computed: {
		options: function() {
			let vm = this
			return {	
                grid: {
                    top: 150,
                    left: '2.5%',
                    right: '3.5%',
                    containLabel: true,
                    bottom: 50
                },
                xAxis:[{
                    type: 'time',
                    splitLine: {
                        show: false,
                    },
                    triggerEvent:true,
                }],
                dataZoom: [{
                    textStyle: { color: '#8392A5'},
                    realtime: true,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    start:0,
                    end:100,
                    show:true,  
                    zoomOnMouseWheel:true,
                    zoomLock:false,
                    dataBackground: {areaStyle: {color: '#000'},lineStyle: {opacity: 0.8,color: '#000'}},
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
                yAxis: vm.chartData.yAxis,
                legend: [
                    {
                     data:['实时值','断电值','一级报警','二级报警','三级报警','四级报警'],
                    //  selected: {					
                    //         '实时值': true,					
                    //         '断电值': false,					
                    //         '一级报警': false,					
                    //         '二级报警': false,					
                    //         '三级报警': false,					
                    //         '四级报警': false		
                    //     }
                    },
                    {
                     top:'25',
                     data:['最大值','最小值','平均值']
                    },
                    {
                     top:'50',
                     data:['调校值','标校值','设备异常数据','突变数据','持续升高数据']
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) { 
                        vm.tooltipTime = params[0].name;
                        let unit = vm.sensor.sensorUnit;
                        let list = [];
                        let label= {};
                        let ischange2 = false;
                        let ischange3 = false;
                        list.push(
                            `
                           名称/地点：${vm.sensor.alais + '/' +vm.sensor.position }<br/>
                                时间：${vm.tooltipTime}<br/>
                            `
                        );
                        params.forEach(item => {
                                switch(item.seriesName){
                                    case '实时值':
                                        list.push(`实时值：${item.value[1] != null?item.value[1] + unit:"-"}<br/>`);
                                        label = item.data.label || {};
                                    break;
                                    case '断电值':
                                         if(item.value[1]==0){
                                             list.push(`断电值：接通<br/>`);
                                         }else if(item.value[1]==1){
                                             list.push(`断电值：断开<br/>`);
                                         }else{
                                             list.push(`断电值：-<br/>`);
                                         }     
                                    break;   
                                    case '突变数据':
                                        ischange2 = true;
                                    break;
                                    case '持续升高数据':
                                        ischange3 = true;
                                    break;  
                                }
                        })
                        // avgValue maxValue minValue
                        list.push(
                            `
                                最大值：${label.maxValue != null?label.maxValue+unit:'-'}<br/>
                                最小值：${label.minValue != null?label.minValue+unit:'-'}<br/>
                                平均值：${label.avgValue != null?label.avgValue+unit:'-'}<br/>
                              数据状态：${vm.state.debugMap[label.debug]||'-'}${ischange2?'(突变数据)':''}${ischange3?'(持续升高数据)':''}<br/>
                              断电范围：${vm.sensor.areaname2||'-'}<br/>
                          统计起止时刻：${label.fivcounttime||"-"}<br/>
                        报警及起止时刻：${label.alarmStatus||'-'}<br/>
                        断电及起止时刻：${label.powerStatusList&&label.powerStatusList.length>0?label.powerStatusList.join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'):''}<br/>
                    馈电状态及起止时刻：${label.feedStatusList&&label.feedStatusList.length>0?label.feedStatusList.join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'):''}<br/>
                            措施及时刻：${label.measure||'-'}<br/>
                            `
                        );    
                        return `<div style="font-size:10px;">${list.join('')}</div>`;
                    },
                    axisPointer: {
                        animation: false
                    },
                    triggerEvent:true,
                    
                },
                series: [
              //实时值 
                {
                    name: '实时值',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.realvalue|| '#4215c5'}},
                    data: vm.chartData.avalueList,
                    markPoint: {
                        data: [
                            {
                                type: 'min',
                                name: '最小值',
                                itemStyle : {
                                   normal:{
                                       color: this.rdata.minvalue||'rgb(41,60,85)',
                                       label: {
                                           show: true, 
                                           formatter: function (params) {
                                                 vm.minValue = params.value;

                                           }  
                                       }
                                   }
                                }
                            },
                            {
                                type: 'max',
                                name: '最大值',
                                itemStyle : {
                                   normal:{
                                       color: this.rdata.maxvalues||'#6d4975',
                                       label: {
                                           show: true, 
                                           formatter: function (params) {
                                                 vm.maxValue = params.value;
                                           }  
                                       }
                                   }
                                }
                            },
                            
                        ]
                    },
                    markLine: {
                        data: [
                              {
                                  type: 'average',
                                  name: '平均值',
                                  itemStyle: {normal: {color: vm.rdata.avgvalue||'#409eff'}},
                                  label:{normal:{position:'end',formatter: function (params) {
                                      vm.avgValue = params.value;           
                                      return '平均值'
                                  }}},
                                  lineStyle:{normal:{opacity:0.8}},
                              }
		                ]
		             },

                },          
                //三量曲线 
                {
                    name: '平均值',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.avgvalue||'#409eff'}},
                    data:vm.chartData.avgValueList,
                },
                {
                    name: '最大值',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    data: vm.chartData.maxList,
                    itemStyle: {normal: {color: vm.rdata.maxvalues||'#6d4975'}},
                },
                {
                    name: '最小值',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color:vm.rdata.minvalue||'rgb(41,60,85)'}},
                    data: vm.chartData.minList,
                },     
                //分级报警
                {
                    name: '一级报警',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.level1||'red'}},
                    data: vm.chartData.level1List,
                },
                {
                    name: '二级报警',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.level2|| '#FF6100'}},
                    data: vm.chartData.level2List,
                },
                {
                    name: '三级报警',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.level3|| '#F7BA2A'}},
                    data: vm.chartData.level3List,
                },
                {
                    name: '四级报警',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.level4|| '#1D8CE0'}},
                    data: vm.chartData.level4List,
                },
                    
                //标校数据   
                {
                    name: '调校值',
                    type: 'scatter',
                    symbolSize:6,
                    animation:false,
                    itemStyle: { 
                            normal: {
                                color:this.rdata.cbvalue||'red',
                            }
                    },
                    data: this.chartData.debugDataList
                },
                {
                    name: '标校值',
                    type: 'scatter',
                    symbolSize:6,
                    animation:false,
                    itemStyle: { 
                            normal: {
                                color:this.rdata.calibratevalue||'red',
                            }
                    },
                    data: this.chartData.debugDataList1
                },
                {
                    name: '设备异常数据',
                    type: 'scatter',
                    symbolSize:6,
                    animation:false,
                    itemStyle: { 
                            normal: {
                                color:this.rdata.unusualvalue||'red',
                            }
                    },
                    data: this.chartData.debugDataList2
                },  
                {
                    name: '突变数据',
                    type: 'scatter',
                    symbolSize:6,
                    animation:false,
                    itemStyle: { 
                            normal: {
                                color:this.rdata.changing2value||'red',
                                // opacity: 0.8
                            }
                    },
                    data:this.chartData.changing_2
                }, 
                {
                    name: '持续升高数据',
                    type: 'scatter',
                    symbolSize:6,
                    animation:false,
                    itemStyle: { 
                            normal: {
                                color:this.rdata.changing3value||'red',
                                // opacity: 0.8
                            }
                    },
                    data:this.chartData.changing_3
                },                 
                //断电值                   
                {
                    yAxisIndex: 1,
                    name: '断电值',
                    step: 'start',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    data: vm.feedDataList,
                    animation:false,
                    itemStyle: {normal: {color: vm.rdata.feedvalue||'#4215c5'}},   
                },    
                //时间范围
                {
			        name:'时间范围',
			        type:'line', 
			        showSymbol:false, 
                    animation:false,
			        itemStyle:{normal:{opacity:0}},
			        lineStyle:{normal:{opacity:0}},
                    data:vm.anchor,
                    markLine: {
                        data: [
                              {
                                  name : '报警门限(上)',
                                  yAxis: vm.sensor.upper_level1,
                                  itemStyle:{normal:{color:'rgb(229, 173, 16)'}},
                                  label: {normal: {position: 'end',formatter:vm.sensor.upper_level1 && vm.sensor.hasfloor !=2 ?'报警(上)':''}},
                                  lineStyle:{normal:{opacity:vm.sensor.upper_level1 && vm.sensor.hasfloor !=2 ?0.8:0}},
                              },
                              {
                                  name : '断电门限(上)', 
                                  yAxis: vm.sensor.limit_power,
                                  itemStyle:{normal:{color:'rgb(255, 64, 64)'}},
                                  label: {normal: {position: 'end',formatter:vm.sensor.limit_power && vm.sensor.hasfloor !=2 ?'断电(上)':''}},
                                  lineStyle:{normal:{opacity:vm.sensor.limit_power && vm.sensor.hasfloor !=2 ?0.8:0}},
                              },
                              {
                                  name : '复电门限(上)', 
                                  yAxis: vm.sensor.limit_repower,
                                  itemStyle:{normal:{color:'rgb(18, 124, 232)'}},
                                  label: {normal: {position: 'end',formatter:vm.sensor.limit_repower && vm.sensor.hasfloor !=2 ?'复电(上)':''}},
                                  lineStyle:{normal:{opacity:vm.sensor.limit_repower && vm.sensor.hasfloor !=2 ?0.8:0}},
                              },
                              {
                                  name : '报警门限(下)',
                                  yAxis: vm.sensor.floor_level1,
                                  itemStyle:{normal:{color:'rgb(229, 173, 16)'}},
                                  label: {normal: {position: 'end',formatter:vm.sensor.floor_level1 && vm.sensor.hasfloor?'报警(下)':''}},
                                  lineStyle:{normal:{opacity:vm.sensor.floor_level1 && vm.sensor.hasfloor?0.8:0}},
                              },
                              {
                                  name : '断电门限(下)', 
                                  yAxis: vm.sensor.floor_power,
                                  itemStyle:{normal:{color:'rgb(255, 64, 64)'}},
                                  label: {normal: {position: 'end',formatter:vm.sensor.floor_power && vm.sensor.hasfloor?'断电(下)':''}},
                                  lineStyle:{normal:{opacity:vm.sensor.floor_power && vm.sensor.hasfloor?0.8:0}},
                              },
                              {
                                  name : '复电门限(下)', 
                                  yAxis: vm.sensor.floor_repower,
                                  itemStyle:{normal:{color:'rgb(18, 124, 232)'}},
                                  label: {normal: {position: 'end',formatter:vm.sensor.floor_repower && vm.sensor.hasfloor?'复电(下)':''}},
                                  lineStyle:{normal:{opacity:vm.sensor.floor_repower && vm.sensor.hasfloor?0.8:0}},
                              }
		                ]
		             },
		        }
             ]			
  		  }
		}
	},
	watch: {
     'chartData' : 'getinfo',
     'feedDataList' : 'getinfo',
     'sensor':'getinfo',
     'maxValue':'changevalue',
     'minValue':'changevalue',
     'avgValue':'changevalue',
    //  'options' : {
	//       handler: 'getinfo',
	//       deep: true
	//     }
	},
	methods: {
         changevalue(){
            this.$emit('changevalue',{
                max:this.maxValue,
                min:this.minValue,
                avg:this.avgValue,
            })
         },
         getImg(){
              return this.myChart.getDataURL()
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
        meResize(){
            this.myChart.resize();
        },
		getinfo() {
            var me = this
            me.myChart = me.echarts.getInstanceByDom(document.getElementById('time'));
            if (me.myChart == undefined) {  
                me.myChart = me.echarts.init(document.getElementById('time'));
            }
			me.myChart.setOption(this.options)
		  	window.addEventListener('resize',this.meResize,false);
            me.myChart.on('datazoom', function (params) {
                  me.$emit('datazooms',params)
            });
            me.myChart.getZr().on('dblclick',params=>{
                   if(me.tooltipTime){
                        let day = me.tooltipTime.substring(0,10) 
                        let str = ~~me.tooltipTime.substring(11,13)
                        let startTime = str<10?'0' + str + ':00':str + ':00:00'
                        str++
                        let endTime = str<10?'0' + str + ':00':str + ':00:00' 
                        me.$emit('dblclicks',day,startTime,endTime)
                        me.tooltipTime = ''
                   }else{
                       return
                   }     
            });
            me.myChart.on('dblclick', function (params,dd) {
                if(params.componentType == "xAxis"){  
                    let day = new Date().getFullYear() + '-' + params.value.substring(6,11)
                    let str = ~~params.value.substring(0,2)
                    let startTime = str<10?'0' + str + ':00':str + ':00:00'
                    str++
                    let endTime = str<10?'0' + str + ':00':str + ':00:00' 
                    me.$emit('dblclicks',day,startTime,endTime)
                }
            });
		}
    },
     beforeDestroy:function(){
         window.removeEventListener('resize',this.meResize,false);
        if (this.myChart) {
            // this.myChart.dispose(); 
            this.myChart.clear();
            this.myChart = null;
            console.log("this.myChart",this.myChart)
        }  
        if(this.echarts){
           this.echarts = null ;
        }
    },
	beforeCreate () {
		 this.$nextTick(() => {
              // 代码保证 this.$el 在 document 中
              this.getColor()
              this.getinfo()
	    })
    }
}
</script>