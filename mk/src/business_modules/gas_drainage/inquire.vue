<style lang="less">
@import '../../styles/common.less';

</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-newspaper-o"> 瓦斯抽放报表</span>
    </p>
    <el-form ref="formInline" :model="formInline" :rules="ruleInline" :inline="true" label-width="80px">
        <el-form-item label="报表类型">
            <el-select size="small" v-model="reporttype" @change="changeType">
                <el-option 
                    v-for="item in typeList" 
                    :value="item.id" 
                    :label="item.name" 
                    :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="测点">
            <el-select size="small" v-model="oneGD" value-key="uid" filterable clearable @change="changeGd">
                <el-option 
                    v-for="item in gdList" 
                    :value="item" 
                    :key="item.uid" 
                    :label="item.alais + '/' +item.type+ '/' +item.position">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="starttime" v-if="headlist[reporttype].start">
                <el-date-picker 
                    size="small"
                    v-model="starttime"
                    align="right"
                    :type="headlist[reporttype].type"
                    :value-format="headlist[reporttype].valueFormat"
                    :format='headlist[reporttype].modelFormat'
                    placeholder="选择开始时间">
                </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime" v-if="headlist[reporttype].end">
                <el-date-picker 
                    size="small"
                    v-model="endtime"
                    align="right"
                    :type="headlist[reporttype].type"
                    :value-format="headlist[reporttype].valueFormat"
                    :format='headlist[reporttype].modelFormat'
                    placeholder="选择结束时间"
                    >
                </el-date-picker>
        </el-form-item>
        <el-form-item label="班次" v-if="reporttype==7" >
                <el-select size="small" v-model="classtime" placeholder="选择班次" @change="chooseClass" filterable clearable style="width:100%;">
                    <el-option
                        v-for="item in classOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label="选择旬" v-if="reporttype==3" >
                <el-select size="small" v-model="tendays" placeholder="所有旬"  style="width:100%;">
                    <el-option
                        v-for="item in tenDaysList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label="季度" v-if="reporttype==5" >
                <el-select size="small" v-model="quarter" placeholder="所有季度"  style="width:100%;">
                    <el-option
                        v-for="item in quarterList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
        </el-form-item>
        <el-form-item>
            <el-button size="small" type="primary" @click="onSearch('formInline')" icon="el-icon-search">查询</el-button>
            <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
        </el-form-item>
    </el-form>
    <div id="show" class="show-image mytable" v-loading.body="isloading" element-loading-text="拼命加载中"> 
        <h2 style="text-align: center;" v-if="showpage">瓦斯抽放报表<span>(<span>{{formInline.starttime}}</span><span v-if="formInline.endtime">~{{formInline.endtime}}</span>)</span><span>{{headlist[reporttype].rename}}</span></h2>
        <div style="text-align:right" v-if="showpage">打印时间：{{nowtime}}</div>
        <print-page :excelColumns="allcolumns" :tableExcelData="!showpage?state.showlist:tableData" :printOb="printOb" ref="print"></print-page>  
    </div>
    <my-pagination></my-pagination>
</el-card>
</template>

<script>
  import api from 'src/api'
  import store from 'src/store'
  import _ from 'lodash'
  import printPage from '../../business_bar/print.vue';
  export default {
    components: {
        printPage
      },
		data() {
			return {
            printOb:{
            showLine:false,
            thead:'',
            tbody:'',
            showEdit:false
          },
          showhead:false,
          showdata:false,
          showpage:false,
          isloading:false,
          formInline:{
            classend:'',
            classname:'',
            classstart:'',
            endtime:'',
            reporttype:1,
            starttime:'',
            ip:'',
            devid:''
          },
          ip:'',
          devid:'',
          starttime:'',
          endtime:'',
          state:store.state,
          action: store.actions,
          Kindex:'',
          nowtime:'',//打印时间
          classOptions:[],//班次
          classtime:'',
          classname:"",
          classstart:"",
          classend:"",
          tendays:1,
          quarter:1,
          oneGD:{},//查询的GD5传感器
          gdList:[],
          allcolumns:[],
          columns1:[{
            title:'统计时间段',
            key:'responsetime',
            width:130,
          },{
            title:'设备位置',
            key:'position',
            gdsensormsg:true             
          },{
            title:'工况混合流量累计（m³）',
            key:'flow_work_sum'
          },{
            title:'标况混合流量累计（m³）',
            key:'flow_standard_sum'
          },{
            title:'标况纯流量累计（m³）',
            key:'flow_pure_sum'
          },{
            title:'瓦斯平均浓度（％）',
            key:'wasi',
            width:100,
          },{
            title:'一氧化碳平均浓度（ppm）',
            key:'co',
            width:100,
          },{
            title:'平均温度（℃）',
            key:'temperature',
            width:100,

          },{
            title:'平均负压（KPa）',
            key:'pressure',
            width:110,

          }],
          //总报表
          columns2:[{
            title:'设备位置',
            key:'position',
            gdsensormsg:true             
          },{
            title:'工况混合流量累计（m³）',
            key:'flow_work_sum'
          },{
            title:'标况混合流量累计（m³）',
            key:'flow_standard_sum'
          },{
            title:'标况纯流量累计（m³）',
            key:'flow_pure_sum'
          },{
            title:'瓦斯平均浓度（％）',
            key:'wasi',
            width:100,
          },{
            title:'一氧化碳平均浓度（ppm）',
            key:'co',
            width:100,
          },{
            title:'平均温度（℃）',
            key:'temperature',
            width:100,

          },{
            title:'平均负压（KPa）',
            key:'pressure',
            width:110,

          }],
          tableData:[],
          reporttype:1,//报表类型
          typeList:[
            {
              id:1,
              name:"时报表"
            },
            {
              id:2,
              name:"日报表"
            },
            {
              id:3,
              name:"旬报表"
            },
            {
              id:4,
              name:"月报表"
            },
            {
              id:5,
              name:"季报表"
            },
            {
              id:6,
              name:"年报表"
            },
            {
              id:7,
              name:"班次表"
            },{
              id:8,
              name:"总报表"
            },],
            headlist:{
                //时
                "1":{
                    type:'datetime',
                    valueFormat:"yyyy-MM-dd HH:mm:ss",
                    modelFormat:'yyyy-MM-dd HH:mm:ss',
                    start:true,
                    end:true,
                    rename:'时报表'
                },
                //日
                "2":{
                    type:'date',
                    valueFormat:"yyyy-MM-dd",
                    modelFormat:'yyyy-MM-dd',
                    start:true,
                    end:true,
                    rename:'日报表'
                },
                //旬
                "3":{
                    type:'month',
                    valueFormat:"yyyy-MM",
                    modelFormat:'yyyy-MM',
                    start:true,
                    end:false,
                    rename:'旬报表'
                },
                //月
                "4":{
                    type:'month',
                    valueFormat:"yyyy-MM",
                    modelFormat:'yyyy-MM',
                    start:true,
                    end:true,
                    rename:'月报表'
                },
                //季
                "5":{
                    type:'year',
                    valueFormat:"yyyy",
                    modelFormat:'yyyy',
                    start:true,
                    end:false,
                    rename:'季报表'
                },
                //年
                "6":{
                    type:'year',
                    valueFormat:"yyyy",
                    modelFormat:'yyyy',
                    start:true,
                    end:true,
                    rename:'年报表'
                },
                //班次
                "7":{
                    type:'date',
                    valueFormat:"yyyy-MM-dd",
                    modelFormat:'yyyy-MM-dd',
                    start:true,
                    end:true,
                    rename:'班次报表'
                },
                "8":{
                    type:'date',
                    valueFormat:"yyyy-MM-dd",
                    modelFormat:'yyyy-MM-dd',
                    start:false,
                    end:false,
                    rename:'总报表'
                }
            },
            quarterList:[{
                name:'第一季度',
                id:1
            },{
                name:'第二季度',
                id:2
            },{
                name:'第三季度',
                id:3
            },{
                name:'第四季度',
                id:4
            }],
            tenDaysList:[{

                name:'上旬',
                id:1
            },{
                name:'中旬',
                id:2
            },{
                name:'下旬',
                id:3
            }]
          }
		},
    computed:{
      
   
    },
    watch:{
      '$route': 'fecthdata',
      'state.listinfo':{
        handler:function(newValue,oldValue){
          this.action.setShowList(this.tableData)
      },
      deep:true
    }
    },
	methods: {
        fecthdata(){
            this.showhead = true
            this.onSearch()
        },
        // 打印
        exportPrint(){
            this.showpage = true
            setTimeout(() => {
                $('#show').jqprint()
                this.showpage = false           
            },50)
        },
        onSearch(){
            var vm = this
            //总报表
            if(vm.reporttype==8){
              vm.allcolumns = vm.columns2
            }else{
              vm.allcolumns = vm.columns1
            }
            if(vm.starttime != ""||vm.reporttype==8){
                if(vm.reporttype == 3){
                    // 旬
                    if(vm.tendays==1){
                        vm.formInline.starttime = vm.starttime + '-01'
                        vm.formInline.endtime = vm.starttime + '-10'
                    }else if(vm.tendays==2){
                        vm.formInline.starttime = vm.starttime + '-11'
                        vm.formInline.endtime = vm.starttime + '-20'
                    }else{
                        vm.formInline.starttime = vm.starttime + '-21'
                        vm.formInline.endtime = ""
                    }
                }else if(vm.reporttype == 5){
                    // 季度
                    if(vm.quarter == 1){
                        vm.formInline.starttime = vm.starttime + '-01-01'
                        vm.formInline.endtime = vm.starttime + '-03-31'
                    }else if(vm.quarter == 2){
                        vm.formInline.starttime = vm.starttime + '-04-01'
                        vm.formInline.endtime = vm.starttime + '-06-30'
                    }else if(vm.quarter == 3){
                        vm.formInline.starttime = vm.starttime + '-07-01'
                        vm.formInline.endtime = vm.starttime + '-09-30'
                    }else{
                        vm.formInline.starttime = vm.starttime + '-10-01'
                        vm.formInline.endtime = vm.starttime + '-12-31'
                    }
                }else{
                    vm.formInline.starttime = vm.starttime
                    vm.formInline.endtime = vm.endtime
                }
                vm.formInline.reporttype = vm.reporttype
                vm.formInline.classname = vm.classname
                vm.formInline.classstart = vm.classstart
                vm.formInline.classend = vm.classend
                vm.formInline.ip = vm.ip
                vm.formInline.devid = vm.devid
                vm.isloading = true
                api.logs.getReport(vm.formInline).then((res)=>{
                    if(res.data.status == 0){
                        vm.tableData = []
                        vm.tableData = res.data.data
                        vm.showdata = true
                        vm.isloading = false
                        vm.action.setShowList(vm.tableData)
                    }else{
                        vm.$message.error(res.data.msg)
                        vm.isloading = false
                    }
                })
            }else{
              vm.$message.error('请选择时间！')
            }
        },
        changeType(){
            this.starttime = ""
            this.endtime = ""
        },
        changeGd(){
          this.ip = this.oneGD.ipaddr
          this.devid = this.oneGD.sensorId
        },
        // 班次
        getclassList(){
            let me = this
            api.logs.getClass().then((res)=>{
                if(res.data.status == 0){
                    me.classOptions = res.data.data
                    if(res.data.data.length){
                      me.classtime = res.data.data[0].id
                      me.classname = res.data.data[0].name
                      me.classstart = res.data.data[0].start
                      me.classend = res.data.data[0].end
                    }
                }else{
                    me.$message.error(res.data.msg)
                }
            })
        },
        chooseClass(){
            _.forEach(this.classOptions,(ob)=>{
                if(ob.id === this.classtime){
                    this.classname = ob.name
                    this.classstart = ob.start
                    this.classend = ob.end
                }
            })
        },
        getGD(){
          let vm = this
          api.gas.getGasList(69).then((res)=>{
            if(res.data.status == 0){
              vm.gdList = res.data.data
            }else{
              vm.$message.error(res.data.msg)
            }
          })
        },
        //初始化时间
        initFindTime(){
            this.starttime = moment().add(-1,'day').format('YYYY-MM-DD HH:mm:ss');
            this.endtime = moment().format('YYYY-MM-DD HH:mm:ss');
            this.nowtime = moment().format('YYYY-MM-DD')//打印时间
        },
    },
	mounted() {
        var vm = this
        this.$nextTick(() => {
        // 代码保证 this.$el 在 document 中
            this.initFindTime()
            this.allcolumns = this.columns1
            this.getclassList()
            this.getGD()
            this.fecthdata()
        })
	},
    created(){
        },
	};
</script>