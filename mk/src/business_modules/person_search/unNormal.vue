<style lang="less">
    @import '../../styles/common.less';
    .redword{
    	color: red
    }
</style>
<template>
    <el-card>
        <p slot="header" >
            <span class="fa fa-file-text"> 工作异常人员查询
            </span>
        </p>
        <Row>
            <el-form ref="formInline" :model="formInline" inline label-width="80px">
                <el-form-item label="时间">
                    <el-date-picker size="small" v-model="time" type="date" placeholder="请选择时间" style="width: 145px"></el-date-picker>
                </el-form-item>
                <el-form-item label="职务">
                    <el-select size="small" v-model="formInline.duty_id" style="width:145px;" clearable>
                        <el-option v-for="item in duty" :value="item.id" :key="item.v" :label="item.v"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工种">
                    <el-select size="small" v-model="formInline.worktype_id" style="width:145px" clearable :disabled="checked">
                        <el-option v-for="item in TypeOfWork" :value="item.id" :key="item.name" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select size="small" v-model="formInline.depart_id" style="width:145px;" clearable>
                        <el-option v-for="item in department" :value="item.id" :key="item.name" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作区域">
                    <el-select clearable v-model="formInline.work_area" style="width:150px" size="small">
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
                <el-form-item label="工作班次">
                    <el-select v-model="formInline.classes_id" style="width:165px" filterable allow-create size="small">
                        <el-option
					      v-for="item in Schedule"
					      :key="item.id"
					      :label="item.week"
					      :value="item.id">
					      <span style="float: left">{{ item.week }}</span>
					      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dayrange }}</span>
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
			         <el-checkbox v-model="checked">特种人员</el-checkbox>
	            </el-form-item>
                <el-button type="primary" @click="onSearch('formInline')" icon="el-icon-search" style="margin-left:10px" size="small">查询</el-button>
                <el-button type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px" size="small">打印表格</el-button>
            </el-form>
        </Row>
        <div id="show" class="mytable">
        	   <h4 v-if="showpage">工作异常人员查询</h4>
        	   <div style="display: flex;flex-direction: row;margin-bottom:10px;">
					     <div>工作异常人员总数：<span class="redword">{{tableData.length}}</span></div>
			       </div>
             <print-info :excelColumns="thead" :tableExcelData="!showpage?state.showlist:tableData" :showLine="false" :showEdit='showEdit' :print="printOb" ref="print"></print-info>
         </div>
         <my-pagination></my-pagination>
    </el-card>
</template>
<script>
     import api from 'src/api'
     import _ from 'lodash'
     import moment from 'moment'
     import store from 'src/store'
     import printInfo from '../../business_bar/print2.vue';

     export default{
     components: {
        printInfo
     },
     watch: {
         '$route': 'fetchData',
         'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.tableData)
		      },
		      deep: true
		}
     },
    mounted() {
          this.fetchData()
    },
    data() {
        return {
          printOb:false,
          showpage:false,
          checked:false,
          synthesize:{
             totalPN:0,
          },
          showEdit:false,
          formInline:{},
          duty:[],
          tableData:[],
          Schedule:[],
          department:[],
          TypeOfWork:[],
          state:store.state,
          action:store.actions,
          time:'',
          areaList:[],
          thead:[
              {title: '卡号',key: 'rfcard_id'},
              {title: '姓名',key: 'name'},
              {title: '职务',key: 'duty'},
              {title: '部门',key: 'departname'},
              {title: '工种',key: 'worktypename'},
              {title: '班次',key: 'week'},
              {title: '异常次数',key: 'counts'},
              {title: '工作区域',key: 'areaname',rowspan:true},
              {title: '当前区域',key: 'responsearea',rowspan:true},
              {title: '异常报警时间',key: 'responsetime',rowspan:true},
              {title: '异常报警类型',key: 'status',rowspan:true},
              {title: '异常结束时间',key: 'endtime',rowspan:true},
              {title: '异常时长',key: 'duration',rowspan:true},
           ]
        }
    },

    methods: {
        exportPrint(){
        	    this.showpage = true
        	    this.$refs.print.getPrintInfo()
	        	setTimeout(() => {
		  			$('#show').jqprint()
		  			this.showEdit = false
		  			this.showpage = false
		  		},50)
        },
        onSearch(){
            if(!this.time) return this.$message({
                        message: '请选择你要查询的日期！',
                        type: 'warning'
               });
              this.formInline.responsetime = this.getTime(this.time)
              if(this.checked){
	        		this.formInline.special = 1
					this.formInline.worktype_id = ""
	         }else{
	        		delete this.formInline.special
	          }
              this.getmonthlyInMine()
        },
        getTime(mo){
            return moment(mo, 'YYYY/MM/DD').format('YYYY-MM-DD')
        },
        getmonthlyInMine(){
           const me = this
           api.searchs.getUnnormal(this.formInline).then((res) => {
                if (res.data.status === 0) {
                    me.tableData = res.data.data
                    me.action.setShowList(me.tableData)
                }else{
                    me.$message.error(res.data.msg)
                }
           })
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
        getSchedule(){
	    		var vm = this
	    		api.routeLine.getSchedule().then(function(res){
	    			if (res.data.status === 0) vm.Schedule = res.data.data
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
             this.formInline.responsetime = this.getTime(new Date())
             this.time = new Date()
             this.onSearch()
             this.getSchedule()
             this.$store.dispatch("getAllArea");
        },
      },


     }
</script>
