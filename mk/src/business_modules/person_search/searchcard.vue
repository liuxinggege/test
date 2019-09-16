<style lang="less">
</style>
<template>
    <el-card v-if="showdata">
        <p class="card_header" >
             <span class="fa fa-file-text"></span>
            <span>分类查询</span>
        </p>
        <el-row class="formcss">
          <el-form :inline="true" ref="searchform" :model="searchform">
                <el-form-item label="时间">
                    <el-date-picker
                      v-model="days"
                      size="small"
                      @change = "selectDay"
                      align="right"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="读卡器">
                    <el-select size="small" style="width:130px" clearable v-model="searchform.devid">
                        <el-option key="" label="所有读卡器" value=""></el-option>
                        <el-option
                            v-for="item in routeCardList"
                            :value="item.cid"
                            :label="item.addr"
                            :key="item.cid">
                            <span style="float: left">{{item.addr}}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{item.position}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分站">
                    <el-select size="small" style="width:130px" clearable v-model="searchform.substation">
                        <el-option key="" label="所有分站" value=""></el-option>
                        <el-option
                            v-for="item in stationList"
                            :value="item.id"
                            :label="item.ipaddr"
                            :key="item.ipaddr">
                            {{item.station_name}}：{{item.ipaddr}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作区域">
                    <el-cascader
                    size="small"
                    :options="areaData"
                    change-on-select
                    v-model="selectArea"
                    @change="checkArea"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select size="small" style="width:130px" clearable v-model="searchform.depart_id">
                        <el-option key="" label="所有部门" value=""></el-option>
                        <el-option
                            v-for="item in deplist"
                            :value="item.id"
                            :label="item.name"
                            :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工种" >
                    <el-select size="small" :disabled="workDisabled" clearable v-model="searchform.worktype_id" style="width:130px">
                        <el-option key="" label="所有工种" value=""></el-option>
                        <el-option
                            v-for="item in typeList"
                            :value="item.id"
                            :label="item.name"
                            :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职务">
                    <el-select size="small" clearable v-model="searchform.dutyId" style="width:130px">
                        <el-option key="" label="所有职务" value=""></el-option>
                        <el-option
                            v-for="item in dutyList"
                            :value="item.id"
                            :label="item.v"
                            :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary"  @click="onSearch(1,state.listinfo.numperPage)" icon="el-icon-search">查询</el-button>
                    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                    <el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
                </el-form-item>
            </el-form>
            <div id="show" class="show-image mytable">
                <h4 v-if="showpage">读卡器经过查询</h4>
                <print-page :excelColumns="columnList" :tableExcelData="!showpage?state.showlist:tableData" :printOb="printOb" ref="print"></print-page>
            </div>
        </el-row>
        <my-pagination></my-pagination>
    </el-card>
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import Cookies from 'js-cookie';
import printPage from '../../business_bar/print.vue';
export default {
    components: {
        printPage
    },
    data(){
    	return {
            printOb:{
                showLine:false,
                thead:'',
                tbody:'',
                showEdit:false
            },
            state: store.state,
            action: store.actions,
            showdata:false,
            showpage:false,
            searchform:{},
            days:'',
            checkday:'',
            dutyList:[],//职务
            routeCardList:[],//读卡器
            deplist:[],//部门
            typeList:[],//工种
            tableData:[],
            selectArea:[1],
            areaData:[{
                    label:'所有区域',
                    value:1,
                    children:[]
                },{
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
            columnList:[
               {
                    key:'cardId',
                    title:'卡号'
                },
               {
                    key:'name',
                    title:'姓名'
                },
                {
                    key:'workTypeName',
                    title:'工种'
                },
                {
                    key:'departName',
                    title:'部门'
                },
                {
                    key:'duty',
                    title:'职务'
                },
               {
                    key:'areaname',
                    title:'工作区域'
                },
                {
                    key:'dayrange',
                    title:'工作班次'
                },
                {
                    key:'addr',
                    title:'来源地'
                },{
                    key:'responsetime',
                    title:'进入分站识别区域时刻'
                }
            ]
    	 }
     },
     watch:{
        '$route': 'fetchData',
        // 'state.listinfo' : {
        //   handler: function (newValue, oldValue) {
        //     this.action.setShowList(this.tableData)
        //   },
        //   deep: true
        // },
        'state.listinfo.currentPage' : {
            handler: function (newValue, oldValue) {
                this.onSearch(newValue,this.state.listinfo.numperPage)
            },
            deep: true
        },
        'state.listinfo.numperPage' : {
            handler: function (newValue, oldValue) {
                this.onSearch(this.state.listinfo.currentPage,newValue)
            },
            deep: true
        }
    },
    methods: {
        fetchData(){
            this.onSearch()
        },
        onSearch(page,rows){
            var vm = this
            vm.searchform.starttime = vm.dayTime(vm.checkday)
            vm.searchform.cur_page = page || (vm.state.listinfo.currentPage)
            vm.searchform.page_rows = rows || (vm.state.listinfo.numperPage)

            api.searchs.getRecs(vm.searchform).then((res)=>{
                console.log(res)
                if(res.data.status===0){
                    vm.showdata = true
                    vm.tableData = res.data.data
                    vm.action.setCutList(vm.tableData,res.data.searchform.total_record,res.data.searchform.cur_page)

                }else{
                    vm.$message.error(res.data.msg)
                }
            })

        },
        // 选择区域
        checkArea(arr){
            if(arr.length === 2){
                    this.searchform.area_ids = [_.last(arr)]
            }else if(arr.length === 1){
                this.areaData.forEach((ob)=>{
                    if(ob.value == arr[0]){
                        this.searchform.area_ids = ob.children.map((oob)=>{
                            return oob.id
                        })
                    }
                })
                if(!this.searchform.area_ids.length) delete this.searchform.area_ids
            }
        },
        exportPrint(){
            this.showpage = true
            this.$refs.print.getPrintInfo()
            setTimeout(() => {
                $('#show').jqprint()
                this.showpage = false
                this.printOb.showEdit = false
                // setTimeout(() => {
                //     this.printOb.showLine = true
                // },1)
            },50)
        },
        dayTime(time){
            return moment(time, 'YYYY/MM/DD').format('YYYY-MM-DD')
        },
        selectDay(val){
            this.checkday = val
        },
        //获取区域
        getArea(){
            let me = this
            api.routeLine.getAllarea().then(function(res) {
                if(res.data.status === 0){
                    res.data.data.forEach((ob)=>{
                        ob.label = ob.areaname
                        ob.value = ob.id
                        me.areaData[0].children.push(ob)
                        if(ob.emphasis != 2 && ob.default_allow != 2) {
                            me.areaData[1].children.push(ob)
                        }
                        if(ob.emphasis == 2){
                            me.areaData[2].children.push(ob)
                        }
                        if(ob.default_allow == 2){
                            me.areaData[3].children.push(ob)
                        }
                    })
                }else{
                    me.$message.error(res.data.msg)
                }
            })
        },
        // 获取部门
        getDepartlist(){
            var vm = this
            api.routeLine.getDepartList().then((res)=>{
                if (res.data.status === 0) {
                    vm.deplist = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        // 获取读卡器列表
        getCard() {
            var vm = this
            api.routeLine.getCard({}).then(function(res) {
                if(res.data.status==0){
                    vm.routeCardList = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        // 获取工种  
        getWorktype(){
            var vm = this
            api.routeLine.getWorkType().then(function(res){
                if (res.data.status === 0) {
                    vm.typeList = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        // 获取职务
        getAll(){
            var vm = this
            api.searchs.getallData().then((res)=>{
                if(res.data.status === 0){
                    vm.dutyList = res.data.duty
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
    },
    mounted(){
        this.fetchData()
        this.state.Kindex = window.localStorage.getItem('storeIndex')
        document.title = '煤矿人员管理系统'
        this.checkday = this.dayTime(this.days)
        this.getDepartlist()
        this.getWorktype()
        this.getCard()
        this.getArea()
        this.getAll()
    },
    created(){
        this.days = new Date()
    },
    computed:{
        stationList(){
                return this.$store.state.AllStation;
            },
    }
};
</script>
