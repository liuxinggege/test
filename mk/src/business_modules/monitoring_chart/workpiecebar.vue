<template>
        <!-- <div id="bar"> -->
            <div :id="id" style="height:320px;width:120%;margin-left:0">   
            </div>
        <!-- </div> -->
</template>

<script>
const echarts = require('echarts');
var myChart;
export default {
	props:{
		id:null,
		bardata:Array,
		xname:Array,
		legenddata:Array,
		charttitle:null,
		tabData:Array
	},
	data () {
		return {
			msg: 'hello word'
		}
	},
	computed: {
		options: function() {
			let vm = this
			return {	
			    title : {
			        //text: this.charttitle
			    },
			    color: ['rgb(25, 183, 207)'],
			    tooltip : {
			        trigger: 'axis',
			        formatter: function(params) {
			        	var list = []
			        	//console.log(params[0].dataIndex)
			        	var rdata = vm.tabData[params[0].dataIndex]
			        	list.push(`名称:${rdata.sensortype+'('+rdata.alais+')'}`)
			        	list.push(`<br/>时间:${rdata.statistictime}`)
                        list.push(`<br/>开机效率：${rdata.switcheff+'%'}`)
                        list.push(`<br/>开机时间：${rdata.switchtime}`)
                        list.push(`<br/>开停次数：${rdata.powercnt}`)
                        return list.join('')
			        }
			    },
//			    legend: {
//			        data:this.legenddata
//			    },
			    toolbox: {
			          color: '#404a59',
					    show : true, 
					     x:'right',
               			 y:'top',
               			 padding:10,
			             feature : {
				            mark : {show: true},
				            //dataView : {show: true, readOnly: false},
				            magicType : {show: true, type: ['line', 'bar']},
				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
			    },
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : this.xname,
			            axisLabel :{  
   							interval:0,
   							//rotate:15,
   							margin:5
					    }
			        }
			    ],
			    yAxis : [
			        {
			             type : 'value',
			             axisLabel: {
			                  show: true,
			                  interval: 'auto',
			                  formatter: '{value} %'
			          	}
			        }
			    ],
			    grid: {
	                top: '14.5%',
	                left: '2%',
	                right: '5%',
	                bottom: '1%',
	                containLabel: true
	            },
			    series : this.bardata			
  		  }
		}
	},
	watch: {
     'bardata' : 'getinfo',
     'options' : {
	      handler: 'getinfo',
	      deep: true
	    }
	},
	methods: {
        getImg(){
            return myChart.getDataURL()
        },
		getinfo() {
			  myChart = echarts.init(document.getElementById(this.id));
              if (myChart === undefined) {  
                myChart = echarts.init(document.getElementById(this.id));
              }
			 myChart.setOption(this.options)
			  window.addEventListener('resize', function () {
	            myChart.resize();
	        });
		}
	},
	mounted () {
		this.$nextTick(() => {
	      // 代码保证 this.$el 在 document 中
	      this.getinfo()
	    })
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ivu-icon{
	margin-right: 10px;
	color: #20A0FF;
}
</style>
