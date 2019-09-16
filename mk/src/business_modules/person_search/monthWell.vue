<style lang="less">
    @import '../../styles/common.less';
    .redword{
    	color: red
    }
</style>
<template>
    <el-card>
        <p slot="header" >
        <span class="fa fa-file-text">  每月下井人员总数及查询
            </span>
        </p>
        <el-row>
            <el-form ref="formInline" :model="formInline" inline label-width="80px">
                <el-form-item label="时间">
                       <el-date-picker size="small" v-model="time" type="month" placeholder="请选择时间" style="width: 150px"></el-date-picker>
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
                <el-form-item label="工作区域">
                    <el-select clearable v-model="formInline.workerPlaceId" style="width:150px" size="small">
				    	<el-option
							v-for="item in areaList"
							:key="item.id"
							:label="item.areaname"
							:value="item.id">
							<span style="float: left">{{ item.areaname }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.emphasis ==1?'':'重点区域'}}{{item.default_allow ==1?'':'限制区域'}}</span>
						</el-option>
				    </el-select>
                </el-form-item>
                    <el-button type="primary" size="small" @click="onSearch('formInline')" icon="el-icon-search" style="margin-left:10px">查询</el-button>
                    <el-button type="primary" size="small" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
            </el-form>
        </el-row>
        <div id="show" class="mytable">
        	    <h4  v-if="showpage">每月下井人员总数及查询</h4>
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
              tbody:'下井详情',
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
          formInline:{},
          areaList:[],
          duty:[],
          department:[],
          TypeOfWork:[],
          state:store.state,
          time:'',
          thead:[
              {title: '日期',key: 'day'},
              {title: '进入总人数',key: 'totalPN',flag:true},
              {title: '超员总人数',key: 'totalOM',flag:true},
              {title: '超时总人数',key: 'totalOT',flag:true,label:'超时'},
              {title: '限制总人数',key: 'totalAL',flag:true,label:'进入限制区域'},
              {title: '失联总人数',key: 'totalUN',flag:true,label:'失联'},
           ]
        }
    },

    methods: {
        clickLine(){},
        exportPrint(){
        	    this.showpage = true
        	    this.$refs.print.getPrintInfo()
	        	setTimeout(() => {
	        		this.showpage = false
	        		this.printOb.showEdit = false
		  			$('#show').jqprint()
		  		},50)
        },
        onSearch(){
            if(!this.time) return this.$message({
                                      message: '请选择你要查询的月份！',
                                      type: 'warning'
                                 });
              this.formInline.starttime = this.getTime(this.time)
              this.getmonthlyInMine()
        },
        getTime(mo){
            return moment(mo, 'YYYY/MM').format('YYYY-MM')
        },
        getAllarea(){
				let me = this
                api.routeLine.getAllarea().then(function(res) {
                    if (res.data.status === 0) {
                        me.areaList = res.data.data
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
			},
        getmonthlyInMine(){
           const me = this
           api.searchs.getmonthlyInMine(this.formInline).then((res) => {
                me.list = res.data.data
                me.nowAreas = me.nowArea
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
                    me.duty= res.data.duty//职务
                })
                api.routeLine.getDepartList().then(function(res) {
                    if (res.data.status === 0) me.department = res.data.data
                })
        },
        fetchData(){
        	 this.getAllarea()
             this.getAllData()
             this.formInline.starttime = this.getTime(new Date())
             this.time = new Date()
             this.getmonthlyInMine()
             this.$store.dispatch("getAllArea");
        },
      },


     }
</script>
