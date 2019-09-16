<style type="text/css">
    @import '../../styles/common.less';
    .row_style>label{
        display: inline-block;
        width:80px;
        text-align: right;
        font-weight: 600;
    }
    .row_style{
        flex-grow: 1;
        font-size: 14px;
    }
</style>
<template>
    <div>
        <el-card>
                <p slot="header">
                    <span class="fa fa-bar-chart"> 开关量开机效率柱状图</span>
                </p>
                <div>
                    <el-form ref="form" :inline="true" label-position="right">
                        <el-form-item label="选择传感器">
                            <el-select v-model="nowSensor" style="width:350px;"  value-key="id" filterable  @change="chooseSensor" size="small">
                                <el-option v-for="item in analog" :value="item" :key="item.id" :label="item.alais + '/'+item.type+'/'+(item.position?item.position:'未配置位置')"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer">打印图表</el-button>
                            <el-button size="small" type="primary" @click="back" v-if="params.id" icon="el-icon-back">返回</el-button>
                        </el-form-item>
                        <el-form-item label="" v-if="showdata" style="margin-left: 50px;">
                             <el-date-picker
                            v-model="day"
                            align="right"
                            type="date"
                            :clearable="false"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd 00:00:00"
                            placeholder="选择日期"
                            :picker-options="pickerOptions1"
                            size="small"
                            style="width:150px;"
                            @change="alldaylong">
                        </el-date-picker>
                            <el-button-group>
                                <el-button icon="el-icon-arrow-left" size="small" @click="beforeday">前一天</el-button>
                                <el-button size="small"  @click="afterday" :disabled="showop">后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                            </el-button-group>
                        </el-form-item>
                    </el-form>
                </div>
        </el-card>
        <div style="padding:20px; " id="showprint" v-if="showdata">
            <div>
                <div v-if="showimg">打印时间：{{printTime()}}</div>
                <div style="position: relative;">
                    <div  style="display: flex;flex-direction: column;position: absolute;top:0;left:20px;">
                         <span class="row_style"><label>分站：</label><span>{{nowSensor.ipaddr}}</span></span>
                          <span class="row_style"><label>编号：</label><span>{{nowSensor.alais}}</span></span>
                          <span class="row_style"><label>类型：</label><span>{{nowSensor.type}}</span></span>
                          <span class="row_style"><label>位置：</label><span>{{nowSensor.position}}</span></span>
                          <span class="row_style">
                                      <label>报警值：</label>
                                      <span v-if="nowSensor.alarm_status==-1">未设置</span>
                                      <span v-else>{{nowSensor.valueText[nowSensor.alarm_status]}}</span>
                         </span>
                    </div>
                    <h4 style="font-size: 18px;text-align: center;margin-bottom:80px">{{nowSensor.alais}}&nbsp;{{day?day.split(' ')[0]:''}}<br>开机效率柱状图</h4>
                </div>
                <img :src="imgsrc" v-if="showimg"  style="width: 100%;">
                <workpiecebar :tabData = 'alldata'  v-show="!showimg" ref="echartBar"  :bardata="bardata" style="width: 100%;height: 320px;margin-top:-35px" :legenddata="legenddata"  id="power" :xname="xname" :charttitle="charttitle"></workpiecebar>
            </div>
            <div id="show" class="show-image mytable"  v-if="!showimg">
                <h4 style="margin-bottom: 10px;">{{charttitle}}</h4>
                <el-table :data='alldata' border>
                    <el-table-column  :prop="item.key" v-for="item in thead" :label="item.title">
                        <template scope="scope">
                            <div v-if="item.key=='remark'">
                                <el-tag :type="scope.row.remark=='正常'?'success':'danger'">{{scope.row.remark}}</el-tag>
                            </div>
                            <div v-else>{{scope.row[item.key]}}</div>
                        </template>
                    </el-table-column>
                </el-table>
          </div>
        </div>
    </div>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'
import workpiecebar from "./workpiecebar.vue"

export default {
    components: {
    	workpiecebar
    },
    data () {
    	return {
            day:moment().format('YYYY-MM-DD 00:00:00'),
            imgsrc:'',
            showimg:false,
            nowSensor:{},
            starttime:'',
            endtime:'',
            showlist:[],
            showop:false,
            analog:[],
            params:{},
            thead:[
            	 {title: '地点',key: 'position'},
            	 {title: '名称',key: 'sensortype'},
            	 {title: '报警及断电状态',key: 'powers'},
            	 {title: '读值时刻',key: 'statistictime'},
            	 {title: '开机效率(%)',key: 'switcheff'},
            	 {title: '备注',key: 'remark'},
            	 {title: '开机时间',key: 'switchtime'},
            	 {title: '开停次数',key: 'powercnt'},
            ],
            state: store.state,
            action: store.actions,
            isloading:false,
            showdata:false,
            alldata:[],
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
    computed: {
    	charttitle(){
    		return ''
    	},
	 	bardata(){
            var list =[]
            var datalist = []
            if(this.alldata.length){
	            for(var i = 0;  i < this.alldata.length; i++){
	            	datalist.push(this.alldata[i].switcheff)
	            }
	            //console.log(datalist)
	            list.push({
	            		name:this.alldata[0].sensortype,
	            		type:'bar',
	            		data:datalist
	            })
            }
            return list
       },
       legenddata(){
            var list = []
            for(var i = 0;  i < this.alldata.length; i++){
            	list.push(this.alldata[0].sensortype)
            }
            return list
       },
       xname(){
            var list =[]
            for(var i = 0;  i < this.alldata.length; i++){
            	list.push(this.alldata[i].statistictime.split(' ')[0].split('-')[2]+'日'+this.alldata[i].statistictime.split(' ')[1].split(':')[0]+'时')
            }
            return list
       },
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
                setTimeout(() => {
                    this.showimg = false
                },10)
            },10)
        },
        chooseSensor(){
        	this.getAll()
        	console.log(this.nowSensor)
        },
        back(){
        	this.$router.go(-1);
        },
	    getSensor(){
                this.analog = Object.values(this.state.AllhashSensor).filter(m => m.pid==this.state['sensorConfig']['switch'] && m.sensor_type != 71)
                if(!this.analog.length){
                    return this.$message.error('系统没有开关量传感器！');
                }
                if(this.params.id){
                    for(let item of this.analog){
                        if(item.id == this.params.id){
                            this.nowSensor = item
                            this.day = this.params.startTime
                            break;
                        }
                    }
                }else{
                    this.nowSensor = this.analog[0]
                    this.day = moment().format('YYYY-MM-DD 00:00:00')
                }
                this.getAll()
	    },
	    beforeday(){
            this.day = moment(this.day).add(-1,'day').format('YYYY-MM-DD 00:00:00')
            this.showdata = false
            this.getAll()
        },
        afterday(){
            this.day = moment(this.day).add(1,'day').format('YYYY-MM-DD 00:00:00')
            this.showdata = false
            this.getAll()
        },
        alldaylong(){
            this.getAll()
        },
        getAll(){
            var rdata = {}
            var vm = this
            rdata.id  = vm.nowSensor.id
            rdata.starttime = vm.day
            console.log(rdata)
             vm.alldata = []
            api.switchs.switchEfficiency(rdata).then(function(res){
            	console.log(res)
                if(res.data.status==0){
                	if(res.data.data.length){
	                    vm.alldata = res.data.data
	                    vm.showdata = true
	                    vm.isloading = false
                    }else{
                    	vm.alldata = []
                    	vm.showdata = true
                    	vm.$message.error('没有数据!');
                    }
                }else{
                    vm.isloading = false
                    vm.$message.error(res.data.msg);
                }
            })
        }
    },
    watch: {
       '$route': 'fetchData'
    },
    mounted () {
        this.params = this.$route.query
        this.getSensor()
    },
    created(){
    }
};
</script>
