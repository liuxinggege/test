<style lang="less">
    @import '../../styles/common.less';
    .redword{
    	color: red
    }
</style>
<template>
    <el-card>
        <p slot="header" >
        <span class="fa fa-file-text">  每月区域出入人员总数及查询
            </span>
        </p>
        <el-row>
            <el-form ref="formInline" :model="formInline" inline label-width="70px">
                <el-form-item label="时间">
                        <el-date-picker size="small" v-model="time" type="month" placeholder="请选择时间" style="width: 150px"></el-date-picker>
                </el-form-item>
                <el-form-item label="工作区域">
                    <el-cascader
                        size="small"
                        :options="areaData"
                        change-on-select
                        @change="checkArea"
                        v-model="checked"
                        ></el-cascader>
                </el-form-item>
                <el-form-item label="职务">
                    <el-select size="small" v-model="formInline.dutyId" style="width:150px;" clearable>
                        <el-option v-for="item in duty" :value="item.id" :key="item.id" :label="item.v"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工种">
                    <el-select size="small" v-model="formInline.worktype_id" style="width:150px" clearable>
                        <el-option v-for="item in TypeOfWork" :value="item.id" :key="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select size="small" v-model="formInline.depart_id" style="width:150px;" clearable>
                        <el-option v-for="item in department" :value="item.id" :key="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                    <el-button type="primary" size="small" @click="onSearch('formInline')" icon="el-icon-search" style="margin-left:10px">查询</el-button>
                    <el-button type="primary" size="small" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
            </el-form>
        </el-row>
         <div id="show" class="mytable">
         	<h4 v-if="showpage">每月区域出入人员总数及查询</h4>
             <div style="display: flex;flex-direction: row;margin-bottom:10px;">
                    <div style="margin-left: 30px">进入总人数：<span>{{synthesize.totalPN}}</span></div>
                    <div style="margin-left: 80px">超员总人数：<span class="redword">{{synthesize.totalOM}}</span></div>
                    <div style="margin-left: 80px">超时总人数：<span class="redword">{{synthesize.totalOT}}</span></div>
                    <div style="margin-left: 80px">限制总人数：<span class="redword">{{synthesize.totalAL}}</span></div>
                    <div style="margin-left: 80px">失联总人数：<span class="redword">{{synthesize.totalUN}}</span></div>
            </div>
            <print-info @clickLine="clickLine" :excelColumns="thead" :tableExcelData="list" :printOb="printOb" ref="print"></print-info>
         </div>
    </el-card>
</template>
<script>
     import api from 'src/api'
     import _ from 'lodash'
     import moment from 'moment'
     import store from 'src/store'
     import printInfo from '../../business_bar/print.vue';
     export default{
     components: {
        printInfo
     },
     watch: {
         '$route': 'fetchData',
     },
     mounted() {
          this.fetchData()
     },
     data() {
        return {
         printOb:{
              showLine:false,
              thead:'',
              tbody:'',
              showEdit:false
          },
          showpage:false,
          synthesize:{
             totalPN:0,
             quit_total:0,
             totalOM:0,
             totalOT:0,
             totalAL:0,
             totalUN:0,
          },
          list:[],
          listPage:[],
          formInline:{},
          duty:[],
          department:[],
          TypeOfWork:[],
          state:store.state,
          time:'',
          nowArea:'所有区域',
          checked:[1],
          areaData:[
               {
                    label:'所有区域',
                    value:1,
                    children:[]
                },
                {
                    label:'普通区域',
                    value:2,
                    children:[]
                },
                {
                    label:'重点区域',
                    value:3,
                    children:[]
                },
                {
                    label:'限制区域',
                    value:4,
                    children:[]

                }],
          thead:[
              {title: '日期',key: 'day'},
              {title: '工作区域',key: 'areaname',areaRange:true},
              {title: '进入总人数',key: 'totalPN',flag:true},
              {title: '超员总人数',key: 'totalOM',flag:true},
              {title: '超时总人数',key: 'totalOT',flag:true,label:'超时'},
              {title: '限制总人数',key: 'totalAL',flag:true,label:'进入限制区域'},
              {title: '失联总人数',key: 'totalUN',flag:true,label:'失联'},
           ]
        }
    },

    methods: {
        exportPrint(){
        	    this.showpage = true
                this.$refs.print.getPrintInfo()
	        	setTimeout(() => {
	        		this.showpage = false
	        		this.printOb.showEdit = false
		  			$('#show').jqprint()
		  		},50)
        },
         clickLine(ob,item){
            let val = {day:ob.day}
            if(this.formInline.area_ids&&this.formInline.area_ids.length) val.area_ids = this.formInline.area_ids
            if(item.label) val.label = item.label
            this.$router.push({name:'/route-index/searchsdayAreaAccess',query:val})
         },
        checkArea(arr,label){
            if(arr.length == 2){
                this.areaData.forEach((item)=>{
                    if(item.value==arr[0]){
                        item.children.forEach((val)=>{
                            if(val.value==arr[1]){
                                this.nowArea = val.areaname
                            }
                        })
                    }
                })
                this.formInline.area_ids = [_.last(arr)]
            }else if(arr.length == 1){
                 this.areaData.forEach((ob)=>{
                    if(ob.value == arr[0]){
                        this.formInline.area_ids = ob.children.map((oob) => {
                             return oob.id
                        })
                        this.nowArea = ob.label
                    }
                 })
                if(!this.formInline.area_ids.length) delete this.formInline.area_ids
            }
        },
        onSearch(){
             if(!this.time) return this.$message({
                                      message: '请选择你要查询的月份！',
                                      type: 'warning'
                                    });
              this.formInline.starttime = this.getTime(this.time)
              this.getmonthlyArea()

        },
        getTime(mo){
            return moment(mo, 'YYYY/MM').format('YYYY-MM')
        },

        getmonthlyArea(){
            const me = this
            api.searchs.getmonthlyArea(this.formInline).then(function(res) {
                me.list = res.data.data
                me.printOb.tbody = me.nowArea
                me.synthesize.totalPN =   res.data.totalPN
                me.synthesize.totalOM =  res.data.totalOM
                me.synthesize.totalOT = res.data.totalOT
                me.synthesize.totalAL = res.data.totalAL
                me.synthesize.totalUN = res.data.totalUN
            })
        },
        getAllData(){
                let me = this
                api.routeLine.getWorkType().then(function(res){
                    if (res.data.status === 0) me.TypeOfWork = res.data.data
                })
                api.searchs.getallData().then((res) => {
                    if (res.data.status === 0) me.duty= res.data.duty//职务
                })
                api.routeLine.getDepartList().then(function(res) {
                    if (res.data.status === 0) me.department = res.data.data
                })
                api.routeLine.getAllarea().then(function(res) {
                    if (res.data.status === 0) {
                        res.data.data.forEach((ob)=>{
                            ob.label = ob.areaname
                            ob.value = ob.id
                            me.areaData[0].children.push(ob)
                            if(ob.emphasis != 2 && ob.default_allow != 2) me.areaData[1].children.push(ob)
                            if(ob.emphasis == 2) me.areaData[2].children.push(ob)
                            if(ob.default_allow == 2) me.areaData[3].children.push(ob)
                        })
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
        },
        fetchData(){
             this.getAllData()
             this.time = new Date()
             this.formInline.starttime = this.getTime(new Date())
             this.getmonthlyArea()
             this.$store.dispatch("getAllArea");
        },
      },


     }
</script>
