<style lang="less">
    @import '../../styles/common.less';

</style>
<template>
    <el-card>
        <p slot="header" >
            <span class="fa fa-newspaper-o"> 携卡人员查询</span>
        </p>
        <div>
            <el-form ref="formInline" :model="formInline" inline label-width="70px">
                <el-form-item label="时间">
                    <el-date-picker size="small" v-model="time" type="month" value-format="yyyy-MM" style="width: 150px"></el-date-picker>
                </el-form-item>
                <el-form-item label="卡号" prop="rfcard_id">
                     <el-input size="small" type="text" v-model="formInline.rfcard_id" style="width:120px" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                     <el-input size="small" type="text" v-model="formInline.name" style="width:120px" clearable></el-input>
                </el-form-item>
                <el-form-item label="职务">
                    <el-select size="small" multiple v-model="duty_id" style="width:120px;" clearable>
                        <el-option v-for="item in duty" :value="item.id" :key="item.id" :label="item.v"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工种">
                    <el-select size="small" v-model="formInline.worktype_id" style="width:120px" clearable :disabled="checked">
                        <el-option v-for="item in TypeOfWork" :value="item.id" :key="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门">
                     <el-select size="small" v-model="formInline.department_id" style="width:120px;" clearable>
                        <el-option v-for="item in department" :value="item.id" :key="item.id" :label="item.name"></el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label="工作区域">
                    <el-select clearable v-model="formInline.workplace_id" style="width:150px" size="small">
				    	<el-option
							v-for="item in areaList"
							:key="item.id"
							:label="item.areaname"
							:value="item.id">
							<span style="float: left">{{ item.areaname }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.emphasis ==1?'':'重点区域'}}{{item.default_allow ==1?'':'限制区域'}}</span>
						</el-option>
				    </el-select>
                    <el-checkbox v-model="checked" style="margin-left: 10px;">特种人员</el-checkbox>
                </el-form-item>
		        <el-button size="small" type="primary" @click="onSearch('formInline')" icon="el-icon-search" style="margin-left:10px">查询</el-button>
	            <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
            </el-form>
        </div>
        <div id="show" class="show-image mytable" v-if="true">
            <h4 v-if="showpage">携卡人员查询结果</h4>
            <print-info @clickLine="clickLine" :excelColumns="thead" :tableExcelData="!showpage?listPage:list" :printOb="printOb" ref="print"></print-info>
        </div>
        <el-pagination
          v-if = "total > maxPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="maxPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import moment from 'moment'
    import store from 'src/store'
    import printInfo from '../../business_bar/print.vue';
    export default {
    components: {
        printInfo
    },
    watch: {
         '$route': 'fetchData'
    },
    created() {
    },
    mounted() {
        this.showpage = false
        this.month = this.getTime(new Date())
        this.time = new Date()
        this.getWithCard({month:this.month})
        this.fetchData()
    },
    name:"withCard",
    data() {
        return {
          printOb:{
              showLine:true,
              thead:'当月下井详情',
              tbody:'下井详情',
              showEdit:false
          },
          showpage:false,
          checked:false,
          total:0,
          currentPage:1,
          maxPage:15,
          time:'',
          list:[],
          listPage:[],
          formInline:{},
          duty:[],
          duty_id:[],
          department:[],
          TypeOfWork:[],
          workplace:[],
          state:store.state,
          action:store.actions,
          month:'',
          areaList:[],
          thead:[
              {title: '卡号',key: 'rfcard_id'},
              {title: '姓名',key: 'name'},
              {title: '身份证',key: 'idnumber'},
              {title: '年龄',key: 'age'},
              {title: '职务',key: 'duty'},
              {title: '工种',key: 'worktype'},
              {title: '部门',key: 'department'},
              {title: '工作区域',key: 'workplace'},
              {title: '当月下井次数',key: 'num_month'},
              {title: '入井时长',key: 'welltime'},
           ]
        }
    },
    methods: {
        clickLine(ev){
            this.$router.push({name:'wellDetails',params:{aname:ev.name + '/' + ev.rfcard_id + '/' + this.month + '/' + ev.worker_id}})
        },
        exportPrint(){
            this.printOb.showLine = false
        	this.showpage = true
            this.$refs.print.getPrintInfo()
        	setTimeout(() => {
	  			$('#show').jqprint()
	  			this.printOb.showEdit = false
	  			this.showpage = false
                setTimeout(() => {
                    this.printOb.showLine = true
                },1)
	  		},50)
        },
        onSearch(){
            if(!this.time){
                this.$message({
                    message: '请选择你要查询的月份！',
                    type: 'warning'
                });
                return
            }
            if(this.checked){
                this.formInline.special = 1
            }else{
                delete this.formInline.special
            }
            this.month = this.getTime(this.time)
            this.formInline.month = this.getTime(this.time)
            this.formInline.duty_id = this.duty_id
            this.getWithCard(this.formInline)
        },
        //若初始需要查询  改变参数
        getWithCard(obj){
            let row = JSON.parse(JSON.stringify(obj))
            let me = this
            if(row.special&&row.special == 1){
                delete row.worktype_id
            }
            api.searchs.getWithCard(row).then((res) => {
                me.setList(res.data.data)
            })
        },
        setList(list){
            if(!list) return
            this.list =list
            this.total = list.length
            this.currentPage = 1
            this.switchover()
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
        getTime(mo){
            return moment(mo, 'YYYY/MM').format('YYYY-MM')
        },
        handleSizeChange(val) {
            this.maxPage = val
            this.switchover()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.switchover()
        },
        switchover(){
            this.listPage = this.list.slice(((this.currentPage -1) * this.maxPage), (this.currentPage * this.maxPage))
        },
        fetchData(){
            this.getAllarea()
 	        this.$store.dispatch("getAllArea");
            let me = this
            api.routeLine.getWorkType().then(function(res){
                if (res.data.status === 0) me.TypeOfWork = res.data.data
            })
            api.searchs.getallData().then((res) => {
                me.workplace = res.data.workplace //工作位置
                me.duty= res.data.duty//职务
            })
            api.routeLine.getDepartList().then(function(res) {
                if (res.data.status === 0) me.department = res.data.data
            })
        },
    },
   };
</script>
