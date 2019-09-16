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
                minvalue:'',
                avgvalue:'',
                cbvalue:'',
                feedvalue:'',
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
                        let unit = params[0].value[2]
                        vm.tooltipTime = params[0].name
                        list.push(`时间：${vm.tooltipTime}`)
                        // if(!vm.$route.query.type&&vm.model==1){
                        //      params.forEach(item => {
                        //         if(item.seriesName=="断电值"){
                        //             list.push(`<br/>断电值：${item.value[1]==1?'断电':'正常'}`)
                        //         }else if(item.componentSubType=="line" && item.seriesName != "时间范围"){
                        //             list.push(`<br/>${item.seriesName}：${item.value[1]}${unit}`)  
                        //         } 
                        //     })
                        // }else{
                            list.push(`<br/>值：${params[0].value[1]}${unit}`) 
                        // }  
                        if(vm.model==1){
                             list.push(`<br/>可双击查看一小时详细数据`)
                        }
                        return list.join('')
                    },
                    axisPointer: {
                        animation: false
                    },
                    triggerEvent:true,
                    
                },
//                legend: {
//                    data:['最小值调校数据','最大值调校数据','平均值调校数据']
//                },
                xAxis:[{
                    type: 'time',
                    splitLine: {
                        show: false,
                    },
                    triggerEvent:true,
                }],
                grid: {
                    top: '15%',
                    left: '2%',
                    right: '3.2%',
                    containLabel: true,
                    bottom: 60
                },
                yAxis: vm.chartData.yAxis,
                dataZoom: [{
                    textStyle: { color: '#8392A5'},
                    realtime: true,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    start:vm.start||0,
                    end: vm.end||100,
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
                series: [
              //平均值 
                {
                    show:false,
                    name: '平均值',
                    type: 'line',
                    smooth:false,
                    symbol: 'none',
                    showSymbol: true,
                    hoverAnimation: false,
                    zoomOnMouseWheel:true,
                    animation:false,
                    itemStyle: {normal: {color: this.rdata.realvalue|| '#4215c5'}},
                    data: this.chartData.allDatalist,
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
                {
			        name:'时间范围',//时间范围
			        type:'line', 
			        showSymbol:false, 
			        data:this.anchor,
			        itemStyle:{normal:{opacity:0}},
			        lineStyle:{normal:{opacity:0}},
		        }
                 ]			
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
            
            myChart.getZr().on('dblclick',params=>{
                   if(me.tooltipTime){
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
                if(params.componentType == "xAxis"){  
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
          this.getColor()
	      this.getinfo()
          console.log(this.sensor)
	    })
        
      
}
}
</script>