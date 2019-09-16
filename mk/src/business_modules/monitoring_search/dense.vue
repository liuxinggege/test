<style scoped="scoped">
  /* .el-table__header{
    table-layout: auto !important;
  } */
</style>
<template>
    <el-card v-if="showData">
       <p slot="header" >
            <span class="fa fa-search"> 模拟量密采记录查询</span>
        </p>
        <el-form  :inline="true" ref="searchform" label-width="70px">
                <el-form-item label="测点">
                    <el-cascader style="width:225px"
                        :clearable = 'true'
                        :options="MSensor"
                        v-model="selectedMSensor"
                        :props="casMSensor"
                        placeholder="所有测点"
                        size="mini"
                        filterable
                        change-on-select
                        :show-all-levels = 'false'
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="位置">
                    <el-select size="mini" v-model="search.sensor_position" placeholder="所有位置" filterable clearable style="width:100%;">
                        <el-option key="" label="所有位置" :value="0"></el-option>
                        <el-option
                            v-for="item in AllPositionList"
                            :key="item.id"
                            :label="item.v"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker  size="mini"
                      v-model="day"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间">
                   <el-time-picker
                    v-model="starttime"
                    :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                    size="mini"
                    :clearable="false">
                </el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                   <el-time-picker
                    v-model="endtime"
                    :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                    size="mini"
                    :clearable="false">
                </el-time-picker>
                </el-form-item>
                <el-form-item label="数据状态">
                        <el-select size="mini" v-model="search.debug" placeholder="所有位置" filterable clearable style="width:100%;">
                            <el-option key="" label="所有状态" :value="-1"></el-option>
                            <el-option
                                v-for="item in debugList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getData(1,state.listinfo.numperPage)" icon="el-icon-search" size="mini">查询</el-button>
                </el-form-item>
        </el-form>
        <el-radio-group v-model="mark" @change="changeType" style="margin:0 0 10px 20px;">
            <el-radio :label="1">详细数据</el-radio>
            <el-radio :label="2">统计数据</el-radio>
        </el-radio-group>
        <el-table :data="state.showlist" border stripe>
                <el-table-column v-for="item in columns" :prop="item.key" :label="item.title">
                    <template scope="scope">
                        <p v-if="item.key =='position'">
                           <span v-if="scope.row.position">{{scope.row.position}}</span>
                           <span v-else>未配置</span>
                        </p>
                        <span v-else-if="item.key =='debug'">
                            <label v-if="scope.row.debug == 0" style="color:#19be6b;">正常</label>
                            <label v-else-if="scope.row.debug == 1" style="color: blue;">欠压</label>
                            <label v-else-if="scope.row.debug == 2" style="color: red;">故障</label>
                            <label v-else-if="scope.row.debug == 3" style="color: blue;">调校</label>
                            <label v-else-if="scope.row.debug == 4" style="color: #FF4949;">开机</label>
                            <label v-else-if="scope.row.debug == 5" style="color: red;">标校</label>
                            <label v-else-if="scope.row.debug == 6" style="color: blue;">未知</label>
                            <label v-else-if="scope.row.debug == 7" style="color: #FF4949;">离线</label>
                        </span>
                        <span v-else-if="item.key =='status'">
                            <label v-if="scope.row.status == -4" style="color:red;">下限复电报警</label>
                            <label v-else-if="scope.row.status == -3" style="color: red;">下限断电报警</label>
                            <label v-else-if="scope.row.status == -2" style="color: red;">下限报警</label>
                            <label v-else-if="scope.row.status == 0" style="color: #4E9837;">正常上报</label>
                            <label v-else-if="scope.row.status == 2" style="color:red;">超限报警</label>
                            <label v-if="scope.row.status == 3" style="color:red;">断电报警</label>
                            <label v-else-if="scope.row.status == 4" style="color: red;">复电报警</label>
                            <label v-else-if="scope.row.status == 5" style="color: red;">通讯中断</label>
                            <label v-else-if="scope.row.status == 6" style="color: #4E9837;">通讯恢复</label>
                            <label v-else-if="scope.row.status == 7" style="color: red">解除报警</label>
                        </span>
                        <span v-else-if="item.key == 'changing'">{{changeMap[scope.row.changing]}}</span>
                        <p v-else>{{scope.row[item.key]}}</p>
                    </template>
                </el-table-column>
        </el-table>
        <my-pagination></my-pagination>
    </el-card>
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import moment from 'moment'
    import store from 'src/store'
    import callTabel from "../../business_bar/callTabel.vue"

    export default {
     components: {
        callTabel,
     },
     data() {
        return {
            aname:'1',
            columns:[],
            search:{
                id:0,
                debug:-1,
                sensor_position:0,
                ip:''
            },
            state:store.state,
            action: store.actions,
            mark:1,
            dataList:[],
            showData:false,
            day:'',
            starttime:"",
            endtime:'',
            cur_page:'',
            page_rows:'',
            AllPositionList:[],
            MSensor:[],
            selectedMSensor:[],
            casMSensor:{
                label: 'name',
                value: 'id',
                children: 'list'
            },
            debugList:[{
                  value: 0,
                  label: '正常'
                }, {
                  value: 1,
                  label: '欠压'
                },{
                  value: 2,
                  label: '故障'
                }, {
                  value: 3,
                  label: '调校'
                }, {
                  value: 4,
                  label: '开机'
                },{
                  value:5,
                  label: '标校'
                }, {
                  value: 6,
                  label: '标校成功'
                }, {
                  value: 7,
                  label: '离线'
                }],
            changeMap:{
                '0':'未变化',
                '1':'变化',
                '2':'数据突变',
                '3':'持续升高',
            },
            pagColumns:[
                {
                    key:'alais',
                    title:'测点号'
                },
                {
                    key:'position',
                    title:'地址'
                },
                {
                    key:'sensortype',
                    title:'类型'
                },
                {
                    key:'unit',
                    title:'单位'
                },
                {
                    key:'limit_alarm',
                    title:'报警门限'
                },
                {
                    key:'value',
                    title:'值'
                },
                {
                    key:'status',
                    title:'状态'
                },
                {
                    key:'responsetime',
                    title:'时间'
                },
                {
                    key:'debug',
                    title:'数据状态'
                },
                {
                    key:'changing',
                    title:'数据变化'
                },
            ],
            countColumns:[{
                    key:'alais',
                    title:'测点号'
                },
                {
                    key:'position',
                    title:'地址'
                },
                {
                    key:'sensortype',
                    title:'类型'
                },
                {
                    key:'unit',
                    title:'单位'
                },
                {
                    key:'limit_alarm',
                    title:'报警门限'
                },
                {
                    key:'count',
                    title:'数据统计值'
                }]
        }
    },
    watch: {
        '$route': 'fetchData',
        'state.listinfo.currentPage' : {
            handler: function (newValue, oldValue) {
                this.getData(newValue,this.state.listinfo.numperPage)
            },
              deep: true
        },
        'state.listinfo.numperPage' : {
            handler: function (newValue, oldValue) {
                this.getData(this.state.listinfo.currentPage,newValue)
            },
              deep: true
        },
     },
    methods: {
        fetchData(){
            this.init()
        },
        changeType(val){
            this.init()
        },
        init(){
            this.columns = this.mark == 1?this.pagColumns:this.countColumns
            this.getData(1,this.state.listinfo.numperPage)
        },
        getData(page,rows){
            let me = this;
            me.search.cur_page = page || (me.state.listinfo.currentPage)
            me.search.page_rows = rows || (me.state.listinfo.numperPage)
            me.search.starttime = me.beginTime()
            me.search.endtime = me.endTime()
            me.search.day = me.dayTime()
            if(me.mark == 2){//统计数据
                api.analyze.getAllcount(me.search).then(function(res){
                    console.log(res,'result')
                    if(res.data.status == 0&&res.data.data.length){
                        me.dataList = res.data.data
                        me.showData = true
                        me.action.setCutList(me.dataList,res.data.nametime.total_rows)//分页展示
                    }else if(res.data.status == 0){
                        me.dataList = []
                        me.showData = true
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
            }else{//详细数据
                api.analyze.getBypag(me.search).then(function(res){
                    if(res.data.status == 0&&res.data.data.length){
                        me.dataList = res.data.data
                        me.showData = true
                        me.action.setCutList(me.dataList,res.data.nametime.total_rows)
                    }else if(res.data.status == 0){
                        me.dataList = []
                        me.showData = true
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
            }
        },
        beginTime () {
            return moment(this.starttime, 'YYYY/MM/DD').format('HH:mm:ss')
        },
        endTime () {
          return moment(this.endtime, 'YYYY/MM/DD').format('HH:mm:ss')
        },
        dayTime(){
            return moment(this.day, 'YYYY/MM/DD').format('YYYY-MM-DD')
        },
        handleChange(value) {
            if(value.length){
                var str = _.last(value)+''
                var arr = str.split('-')
                if(!arr[1]){
                    this.search.ip = arr[0]
                    this.search.id = 0
                    this.search.sensor_type = 0
                }else{
                    this.search.id = arr[0]
                    this.search.sensor_type = arr[1]
                }
            }else{
                this.search.id = 0
                this.search.ip = ''
                this.search.sensor_type = 0
            }
        },
        // 位置
        getPosition(){
            var vm = this
            api.gas.getAllPosition().then(function (res) {
                if(res.data.status ==0){
                    vm.AllPositionList = res.data.data
                }else{
                    vm.$message.error(res.data.msg)
                }
            })
        },
        //测点
        getMensor(){
            var vm = this
            api.station.getEquipAll().then((res)=> {
                if(res.data.status==0){
                    vm.MSensor = []
                    _.forEach(res.data.data,function(ob) {
                        let slist = []
                        if(ob.lists.length){
                            _.forEach(ob.lists,function(oob) {
                                    slist.push({
                                        name: oob.alais+'('+oob.position + '--' + oob.type+')',
                                        id: oob.id+'-'+oob.sensor_type
                                  })
                            })
                        }
                        slist.unshift({
                            name:'所有传感器('+slist.length+')',
                            id:ob.ipaddr
                        })
                        vm.MSensor.push({
                            name: ob.ipaddr,
                            id: ob.ipaddr,
                            list: slist
                        })
                    })
                }
            })
        },
    },
    mounted (){
        this.state.Kindex = window.localStorage.getItem('storeIndex')
        this.starttime =new Date();
        this.starttime.setTime(this.starttime.getTime()- 60 * 1000 *1);
        this.endtime = new Date();
        this.fetchData()
        this.getPosition()
    },
    beforeMount(){
        this.day = new Date()
        this.getMensor()
    },
};

</script>
