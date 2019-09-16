<style lang="less">
    @import '../../styles/common.less';
    .el-picker-panel [slot=sidebar], .el-picker-panel__sidebar{
    	width: 80px;
    }
    .select_box {
        padding: 5px;
        position: absolute;
        top: 32px;
        left: 0;
        z-index: 9999;
        background-color: white;
        border: 5px solid #D3DCE6;
    }
    .ivu-table-row {
        cursor: pointer;
    }
</style>
<template>
    <div>
        <el-card>
			<div style="margin:5px 0">
				<el-button size="small" type="primary"  @click="back" icon="el-icon-back"  v-if="!showmap">返回上一页</el-button>
				<el-button size="small" type="primary"  @click="back" icon="el-icon-back" style="position: absolute;z-index: 1000;right:100px;top:100px" v-if="showmap">返回上一页</el-button>
				<span v-if="!showmap">
					<el-button size="small" type="primary"  @click="exportPrint" icon="el-icon-printer">打印表格</el-button>
					<el-button size="small" type="primary"  @click="change" icon="el-icon-news">轨迹回放</el-button>
				</span>
			</div>
			<div v-if="!showmap">
				<div id="show" class="show-image mytable">
	                <span style="color: #0082E6;margin-bottom:5px;"><span>{{tablename}}</span><span style="margin-left:25px">{{ranges}}</span></span>
	                <print-info v-loading="loading" element-loading-text="拼命加载中" :excelColumns="thead" :tableExcelData="!showpage?state.showlist:detailList" :printOb="printOb" ref="print"></print-info>
	           </div>
			  <my-pagination></my-pagination>
			</div>
			<div v-if="showmap" id="mapInfo">
				<span style="font-size: 14px;color: #0082E6;right:15px;position: absolute;top:80px"><span>{{tablename}}</span><span style="margin-left:25px">{{ranges}}</span></span>
				 <div class="block" v-if="!showPrint" style="position: absolute;z-index: 1000;margin-top:75px;margin-left:115px">
				    <span class="demonstration">轨迹频率(数字越大频率越快)</span>
				    <span><el-button size="small" type="primary" round plain @click="sure">确定</el-button></span>
				    <el-slider v-model="value4"  style="width:500px" :max='10' :min="1"></el-slider>
				 </div>
				<gis-map ref="GisMap" v-if="$store.state.center.length"  :addDeviceList="routeData" @checkArea="checkArea"></gis-map>
			</div>
	    </el-card>
    </div>
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'
import moment from 'moment'
import printInfo from '../../business_bar/print.vue';
import GisMap from "./topobar.vue"

export default {
    name: 'route-index',
    components: {
    	printInfo,
    	GisMap
    },
    data () {
    	return {
    		loading:true,
    		tablename:'',
    		showmap:false,
    		value4:1,
    		showpage:false,
    		detailList:[],
    		showPrint:false,
    		state:store.state,
    		action:store.actions,
    		ranges:'',
    		printOb:{
              showLine:false,
              thead:'',
              tbody:'',
              showEdit:false
            },
            pointList:[],
    		thead: [
              {
                 title: '卡号',
                 key: 'card_id'
              },
              {
                 title: '姓名',
                 key: 'workername'
              },
              {
                 title: '工作区域',
                 key: 'areaname'
              },
    		  {
                 title: '读卡器',
                 key: 'alais'
              },
              {
                 title: '位置',
                 key: 'position'
              },
              {
                 title: '时间',
                 key: 'startTime'
              }, 
              {
                 title: '异常情况',
                 key: 'alarm'
             }],
    	}
    },
    watch: {
    	// '$route'(to) {
    	// 	console.log(to)
    	// },
    	'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.detailList)
		      },
		      deep: true
		}
    },
    computed: {
        routeData(){
        	let arr = []
        	_.forEach(this.$store.state.areaList, (ob) => {
        		arr.push({
	    			ob:ob,
	    			desc:ob.areaname
	    		})
        	})
        	return arr;
        }
    },
    methods: {
	    checkArea(data){
	        this.state.addArea = true
	         _.assign(this.state.areadata,data.ob)
	    },
    	back(){
	        if(this.$route.query.special&&!this.showmap){
    	        this.$router.push({
	    	  	    name:'line',
	    	  	    query:{
    	  		       id:this.$route.query.card_id
	    	  	    }
    	        })
	        }else if(this.$route.query.time){
    	  	    this.$router.push({
	    	  	    path:'/search/dayQueryWell',
	    	  	    query:{
	    	  		   day:this.$route.query.time
	    	  	    }
	    	  })
    	    }else if(this.$route.query.type){
    	  	    this.$router.push({
	    	  	   path:'/searchs/dayAreaAccess',
	    	  	   query:{
	    	  		  day:this.$route.query.type
	    	  	   }
    	        })
	        }else if(this.showmap){
    	  	    this.showmap = false
    	    }else{
    	  	    this.$router.go(-1)
    	    }
    	},
    	change(){
    		this.showmap = true
    		setTimeout(() => {
				this.$refs.GisMap.replay(this.detailList,this.pointList)
			},1000)
    	},
    	sure(){
    		this.state.frequency = this.value4
    	},
        exportPrint(){
        	this.showpage = true
        	this.$refs.print.getPrintInfo()
        	setTimeout(() => {
	  			$('#show').jqprint()
	  			this.showpage = false
	  			this.printOb.showEdit = false
	  		},100)
        },
        getRouteLine(data){
            let me = this
            delete data.name
    		api.routeLine.getTrack(me.$route.query.intoTime,data).then(function(res){
    			if(res.data.status==0&&((res.data.data&&!res.data.data.length)||!res.data.data)){
        	        me.$message.error('没有数据!')
	        	    me.loading = false
		        }else if(res.data.status==0&&res.data.data.length){
    			 	var list = []
    			 	me.loading = false
    			 	me.ranges = res.data.starttime + '~~' + res.data.endtime
    			 	me.detailList = res.data.data
    			 	me.pointList = []
    			 	_.forEach(me.detailList, (m) => {
    			 		me.pointList.push({
    			 			x:m.x_point,
    			 			y:m.y_point
    			 		})
    			 	})
    			 	me.action.setShowList(me.detailList)
		        }
	        })
	   	}
    },
    mounted () {
    	this.$store.dispatch("getAllArea");
    	if(window.localStorage.getItem('user')&&!this.$route.query.name){
    	  this.state.lineUser = window.localStorage.getItem('user')
    	  this.tablename = window.localStorage.getItem('user') + '轨迹再现'
    	}
    	if(this.$route.query.name){
    		this.state.lineUser = this.$route.query.name
    		this.tablename = this.$route.query.name + '轨迹再现'
    	}
    	this.getRouteLine(this.$route.query)
    }
};
</script>
