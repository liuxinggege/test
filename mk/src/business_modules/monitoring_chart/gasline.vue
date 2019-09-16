<template>
  <div style="width:100%;height:450px;margin-top:-5px;padding: 0 10px;" id="time"></div>
</template>
<script>
import api from 'src/api'
const echarts = require('echarts');
var myChart;
export default {
    props:{
        chartData:Object,
        anchor:Array,
        sensor:Object,
        start:Number,
        end:Number,
        model:String,
        feedDataList:Array
    },
    data () {
        return {
              msg: 'hello word',
              tooltipTime:'',
              rdata:{
                realvalue:'',
                maxvalues:'',
                minvalue:''
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
                        params = params[0];
                        vm.tooltipTime = params.data.name
                        return '时间：' + params.name +
                               '<br/>值：' + params.value[1] + params.value[2]
                    },
                    axisPointer: {
                        animation: true
                    },
                    triggerEvent:true,
                    
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false,
                    },
                    triggerEvent:true,
                },
                grid: {
                    top: '15%',
                    left: '2%',
                    right: '3.2%',
                    containLabel: true,
                    bottom: 60
                },
                yAxis: vm.chartData.yAxis,
                dataZoom: [{
                    textStyle: {
                        color: '#8392A5'
                    },
                    realtime: true,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    start:vm.start||0,
                    end: vm.end||100,
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
                    name: '模拟数据',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    data: this.chartData.allDatalist,
                    itemStyle: {
                        normal: {
                            color: this.rdata.realvalue|| '#4215c5'
                        }
                    },
                    markPoint: {
                        data: [
                            {  
                                type: 'max',
                                name: '最大值',
                                itemStyle: {
                                normal: {color: this.rdata.maxvalues||'#6d4975'}
                                }
                            },
                            {
                                type: 'min', 
                                name: '最小值',
                                itemStyle: {
                                    normal: {color: this.rdata.minvalue||'rgb(41,60,85)'}
                                }                          
                            },
                        ]
                    },
                    animation:true,
                },
                // {
                //     yAxisIndex: 1,
                //     name: '断电值',
                //     step: 'start',
                //     type: 'line',
                //     smooth:false,
                //     symbol: 'none',
                //     showSymbol: true,
                //     hoverAnimation: false,
                //     zoomOnMouseWheel:true,
                //     data: this.feedDataList,
                //     animation:false,
                //     itemStyle: {normal: {color: '#4215c5'}},   
                // },
                {
                    name:'.anchor',
                    type:'line', 
                    showSymbol:false, 
                    data:this.anchor,
                    itemStyle:{normal:{opacity:0}},
                    lineStyle:{normal:{opacity:0}},
               }]           
          }
        }
    },
    watch: {
     'chartData' : 'getinfo',
     'feedDataList' : 'getinfo',
     'sensor':'getinfo',
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
             });
        }
    },
    beforeCreate () {
        this.$nextTick(() => {
          // 代码保证 this.$el 在 document 中
          this.getinfo()
          this.getColor()
          console.log(this.sensor)
        })
        
      
}
}
</script>
