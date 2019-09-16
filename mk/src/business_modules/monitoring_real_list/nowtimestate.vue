<style>

</style>
<template>
    <el-card>
       <p slot="header">
            <span class="fa fa-info-circle"> {{headtitle}}</span>
            <el-radio-group v-if="aname!='4'" v-model="mark" @change="changeType" style="margin-left:50px;">
                <el-radio :label="1">模拟量</el-radio>
                <el-radio :label="2">开关量</el-radio>
            </el-radio-group>
        </p>
        <div style="padding-bottom:10px;background-color: white;" class="formcss">
            <call-tabel :columns="columns" :mark="mark" :callData="dataList" @refresh="getData"></call-tabel>
        </div>
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
            headtitle:'',
            columns:[],
            headData:{
                '1':{
                    title:'实时报警列表',
                    name:'getalarm',
                    sensorColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'报警门限',key:'limit_alarm',width:85,sortable:true},
                         {title:'断电门限',key:'limit_power',width:85,sortable:true},
                         {title:'复电门限',key:'limit_repower',width:85,sortable:true},
                         {title:'实时值',key:'now_value',width:85,value:100,sortable:true},
                         {title:'状态',key:'statusText',now:true},
                         {title:'最大值',key:'maxvalue',width:85,sortable:true},
                         {title:'最小值',key:'minvalue',width:85,sortable:true},
                         {title:'平均值',key:'avgvalue',width:85,sortable:true},
                         {title:'报警及时刻',key:'alarmStarttime',},
                         {title:'最后一次断电/复电及时刻',key:'powerStarttime'},
                         {title:'断电区域-馈电状态',key:'feedstastus'},
                         {title:'措施/时刻',key:'measuretime',sortable:true},
                    ],
                    switchColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'报警/断电状态',key:'alarmstatus'},
                         {title:'实时状态',key:'now_value',value:25},
                         {title:'最近一次状态变动及时刻',key:'statusChange'},
                         {title:'报警/断电及时刻',key:'alarmStarttime'},
                        //  {title:'断电/复电及时刻',key:'feedtime'},
                         {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                         {title:'措施/时刻',key:'measuretime',sortable:true},
                    ],
                },
                '2':{
                   title:'实时断电控制列表',
                    name:'getpower',
                     sensorColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'报警门限',key:'limit_alarm',width:85,sortable:true},
                         {title:'断电门限',key:'limit_power',width:85,sortable:true},
                         {title:'复电门限',key:'limit_repower',width:85,sortable:true},
                         {title:'实时值',key:'now_value',width:85,value:100,sortable:true},
                         {title:'状态',key:'statusText',now:true},
                         {title:'报警及时刻',key:'alarmStarttime',},
                         {title:'断电及时刻',key:'powerStarttime'},
                         {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                         {title:'措施/时刻',key:'measuretime',sortable:true},
                    ],
                    switchColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'报警/断电状态',key:'alarmstatus'},
                         {title:'实时状态',key:'now_value',value:25},
                        //  {title:'状态',key:'statusText',now:true},
                         {title:'最近一次状态变动及时刻',key:'statusChange'},
                         {title:'报警/断电及时刻',key:'alarmStarttime'},
                        //  {title:'断电/复电及时刻',key:'feedtime'},
                         {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                         {title:'措施/时刻',key:'measuretime',sortable:true},
                    ],
                },
                '3':{
                   title:'实时馈电异常列表',
                   name:'getrepower',
                   sensorColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'报警门限',key:'limit_alarm',width:85,sortable:true},
                         {title:'断电门限',key:'limit_power',width:85,sortable:true},
                         {title:'复电门限',key:'limit_repower',width:85,sortable:true},
                         {title:'实时值',key:'now_value',width:85,value:100,sortable:true},
                         {title:'状态',key:'statusText',now:true},
                         {title:'报警及时刻',key:'alarmStarttime',},
                         {title:'断电及时刻',key:'powerStarttime'},
                         {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                         {title:'措施/时刻',key:'measuretime',sortable:true},
                    ],
                    switchColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'报警/断电状态',key:'alarmstatus'},
                         {title:'实施状态',key:'now_value',value:25},
                        //  {title:'状态',key:'statusText',now:true},
                         {title:'最近一次状态变动及时刻',key:'statusChange'},
                         {title:'报警/断电及时刻',key:'alarmStarttime'},
                        //  {title:'断电/复电及时刻',key:'feedtime'},
                         {title:'断电区域-馈电状态及时刻',key:'feedstastus'},
                         {title:'措施/时刻',key:'measuretime',sortable:true},
                    ],
                },
                '4':{
                    title:'实时设备故障列表',
                    name:'getfailure',
                    sensorColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'状态',key:'statusText',now:true},
                         {title:'故障开始时间',key:'alarmStarttime'},
                         {title:'措施/时刻',key:'measuretime'},
                    ],
                    switchColumn:[
                         {title:'地点/名称/类型',key:'position'},
                         {title:'状态',key:'statusText',now:true},
                         {title:'故障开始时间',key:'alarmStarttime'},
                         {title:'措施/时刻',key:'measuretime'},
                    ],
//                   sensorColumn:[
//                         {title:'地点/名称/类型',key:'position'},
//                         {title:'报警值',key:'limit_alarm',width:85,sortable:true},
//                         {title:'断电值',key:'limit_power',width:85,sortable:true},
//                         {title:'复电值',key:'limit_repower',width:85,sortable:true},
//                         {title:'实时值',key:'now_value',width:85,value:100,sortable:true},
//                         {title:'状态',key:'statusText',now:true},
//                         {title:'最大值',key:'maxvalue',width:85,sortable:true},
//                         {title:'最小值',key:'minvalue',width:85,sortable:true},
//                         {title:'平均值',key:'avgvalue',width:85,sortable:true},
//                         {title:'超限报警时刻-报警/解除',key:'alarmStarttime',},
//                         {title:'断电报警时刻-断电区域-断电/复电',key:'powerStarttime'},
//                         {title:'馈电状态',key:'feedstastus',width:95,},
//                         {title:'措施时刻-措施',key:'measuretime',sortable:true},
//                    ],
//                    switchColumn:[
//                         {title:'地点/名称/类型',key:'position'},
//                         {title:'当前值',key:'now_value',value:25},
//                         {title:'状态',key:'statusText',now:true},
//                         {title:'报警时刻-报警/解除',key:'alarmStarttime'},
//                         {title:'断电时刻-断点区域-断电/复电',key:'feedtime'},
//                         {title:'馈电状态',key:'feedstastus',width:95,},
//                         {title:'措施时刻-措施',key:'measuretime',sortable:true},
//                    ],
                },
            },
            rdata:{},
            state:store.state,
            action: store.actions,
            mark:1,
            dataList:[],
            showData:false,
            intervalId:'',
            thead:{
            '1':[],
            '2':[]
            },
            path:''
        }
    },
    watch: {
        '$route': 'fetchData',
     },
    created() {},
    mounted() {
        this.fetchData();
        window.clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.getData();
        },5000)
    },
    beforeDestroy: function (){
		window.clearInterval(this.intervalId);
	},
    methods: {
        fetchData(){
            this.mark = 1
            this.aname = this.$route.params.aname
            this.init()
        },
        changeType(val){
            this.init()
        },
        init(){
              this.headtitle = this.headData[this.aname].title
              this.path = this.headData[this.aname].name
              if(this.mark == 1){
                  this.columns = this.headData[this.aname].sensorColumn
              }else if(this.mark == 2){
                  this.columns = this.headData[this.aname].switchColumn
              }
            this.getData();
        },
        getData(){
            let me = 
            this.rdata = {mark:this.mark};
            api.gas.getSensorCall(this.path,this.rdata).then(res =>{
                // console.log(res,'result')         
                if(res.data.status == 0){
                    this.dataList = res.data.data;
                    this.showData = true;
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
    },
};

</script>
