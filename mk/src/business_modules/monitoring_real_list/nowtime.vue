<style lang="less">
    @import '../../styles/common.less';
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
        overflow: hidden;
    }
    .navbtn{
        position: fixed;
        top: 350px;
        opacity: .7;
        z-index: 999;
        padding: 8px;
        left:0px;
    }
</style>
<template>
 <el-card>
     <p slot="header">
        <span class="fa fa-list"> 实时数据列表</span>
        <el-radio-group v-model="viweType" @change="viweTypeChange" style="margin-left:200px;" v-show="!isSensor&&realData.length">
            <el-radio :label="0">全部(简化版)</el-radio>
            <el-radio :label="1" :disabled="!rdata.sensorids.length">模拟量详情</el-radio>
            <el-radio :label="2" :disabled="!rdata.switchids.length">开关量详情</el-radio>
        </el-radio-group>
    </p>
    <el-button type="primary" :icon="showTree?'el-icon-caret-left':'el-icon-caret-right'" class="navbtn" size="mini" @click="showTree = !showTree" ></el-button>
    <div>
       <div v-show="showTree" style="box-sizing: border-box;max-height:700px;overflow: auto;width:300px;float:left;">
            <el-tree
                ref="treeBar"
                :data="treeMenu"
                :props="defaultProps"
                @node-click="chooseMenu"
                node-key="nid"
                highlight-current
                :default-expanded-keys="[nowClick.nid]"
                :render-content="renderContent"
                :expand-on-click-node="true">
            </el-tree>
       </div>
       <div style="overflow:hidden;">
         <template v-if="!isSensor">
             <div v-if="realData.length">
                    <div v-if="showType==1">
                        <real-tabel :columns="allColumns.nowtime" :sensorList="realList"></real-tabel>
                    </div>
                    <div v-else>
                        <call-tabel :columns="rdata.mark==1?allColumns.sensorCall:allColumns.switchCall" :callData="callList" :mark="rdata.mark"></call-tabel>
                    </div>
             </div>
             <div v-else>
                  <real-tabel :columns="allColumns.nowtime" :sensorList="[]"></real-tabel>
             </div>
         </template>
         <template v-if="isSensor">
                <call-tabel :columns="allColumns[columnsStr]" :callData="callList"></call-tabel>
         </template>
       </div>
    </div>
 </el-card>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import callTabel from "../../business_bar/callTabel.vue"
    import realTabel from "../../business_bar/realTabel.vue"

    export default {
        components: {
            callTabel,
            realTabel,
        },
        data(){
            return {
                viweType:0,
                nowClick:{nid:'0'},
                showTree:true,
                showPage:false,
                treeMenu:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                state: store.state,
                action:store.actions,
                screenHeight: document.body.clientHeight,
                screenWidth: document.body.clientWidth,
                showType:1,//显示类型
                isSensor:false,// true 电源箱和区域设施   false 传感器
                columnsStr:"powerThead",
                realData: [],//实时简版data
                dataList:[],//详细版data
                showdata: false,
                allColumns:{
                    switchCall:[],
                    sensorCall:[],
                    nowtime:[],
                    powerThead:[
                         {key:'alais',title:'设备编号',width:105},
				         {key:'messages',title:'设备信息'},
				         {key:'statusText',title:'状态',now:true},
				         {key:'currentText',title:'交流/直流'},
				         {key:'rechargeText',title:'充电/未充电'},
				         {key:'dischargingText',title:'放电/未放电'},
				         {key:'balanceText',title:'均衡/未均衡'},
				         {key:'percent',title:'电量百分比'},
				         {key:'battary',title:'电池电量'},
				         {key:'cut1Text',title:'第一路断电'},
				         {key:'cut2Text',title:'第二路断电'},
                    ],
                    areaThead:[
                        {key:'areaname',title:'区域名称',width:140},
                        {key:'area_type_name',title:'区域类型名称',width:160},
                        {key:'statusText',title:'状态',nowAera:true,width:200},
                        {key:'level',title:'报警等级',width:100},
                        {key:'alarmMap',title:'报警内容'}
                    ],
                    substationThead:[
                        {key:'station_name',title:'分站名称'},
                        {key:'ipaddr',title:'IP地址'},
                        {key:'position',title:'位置'},
                        {key:'statusText',title:'状态',now:true}
                    ],
                    interchangerThead:[
                        {key:'name',title:'设备类型'},
                        {key:'sensorname',title:'名称'},
                        {key:'ip',title:'IP地址'},
                        {key:'position',title:'位置'},
                        {key:'statusText',title:'状态',now:true}
                    ]
                },
                rdata:{
                    mark:1,
                    sensorids:[],
                    switchids:[],
                }
            }
        },
        watch: {
            '$route': 'fetchData',
            'state.connecTotal':{
            	handler: function(val) {
            		this.setMenuList(-1)
            	},
            	deep: true
            },
            'state.updateall':{
            	handler: function(val) {
            		this.setMenuList(-1)
            	},
            	deep: true
            }
        },
        computed: {
            realList(){
                let list = []
                list =  this.realData
                return list
            },
            callList(){
                let list = []
                list =  this.dataList
                return list
            }
        },
        mounted() {
            this.state.isOpenReal = true;
            this.state.listinfo.numperPage = 10;
            this.getInfo();
            this.fetchData();
        },
        methods: {
            viweTypeChange(val){
                switch(val){
                    case 0:
                        this.showSimplify();
                    break;
                    case 1:
                        this.rdata.mark = 1;
                        this.showDetail();
                    break;
                    case 2:
                        this.rdata.mark = 2;
                        this.showDetail();
                    break;
                }
            },
        	getInfo(){
        		var vm = this
        		api.user.editorGetAll().then((res) => {
                    res.data.data.forEach(item => {
                        if(vm.allColumns[item.type]){
                           vm.allColumns[item.type] = item.list
                        }
                    })
        		})
            },
            fetchData() {
                if(this.$route.query.row){
                    this.nowClick.nid = this.$route.query.row || '0';
                    this.setMenuList(-1)
                }else{
                    this.setMenuList()
                }
            },
//           设置树菜单 实时数据列表  所有设备
            setMenuList(row) {
                let me = this;
                api.gas.getAllList().then((res) => {
                    if (res.data.status == 0) {
                        me.treeMenu = res.data.data;
                        let ol = {};
                        me.treeMenu.forEach((item,index1) => {
                                item.nid = '' + index1;
                                if(item.label === "区域/设施"){
                                    item.nid = 'area';
                                    item.isSensor = true;
                                    item.columns='areaThead';
                                }else if(item.label === "分站"){
                                    item.isSensor = true;
                                    item.columns='substationThead';
                                }else if(item.label === "交换机"){
                                    item.isSensor = true;
                                    item.columns='interchangerThead';
                                }else if(item.label === "电源"){
                                    item.isSensor = true;
                                    item.columns="powerThead";
                                }
                                if(item.nid === this.nowClick.nid){
                                     ol = item;
                                }
                                if(item.children&&item.children.length){
                                    item.children.forEach((m,index) => {
                                            m.nid =  item.nid + '-' + index;
                                            if(item.label === "联动控制"){
                                                m.nid ='action_' + m.id;
                                            }
                                            if(m.nid === this.nowClick.nid){
                                                    ol = m;
                                            }
                                    })
                                }
                        })
                        ol = ol.nid?ol:this.nowClick;
                        if(!row){
                              me.chooseMenu(me.treeMenu[0]);
                        }else if(row === -1){
                              me.chooseMenu(ol,-1);
                        }
                        me.showPage = true;
                    }else{
                        me.$message.error(res.data.msg)
                        me.showdata = true;
                    }
                })
            },
            chooseMenu(e,bool){
                 setTimeout(() => {
                        this.$refs.treeBar.setCurrentKey(e.nid);
                },10)
                this.nowClick = e
                this.nowClick.expanded = !this.nowClick.expanded
                if(bool != -1&&bool != undefined){
                         setTimeout(() => {
                           this.$refs.treeBar.store.nodesMap[e.nid].expanded = this.nowClick.expanded;
                         },50)
                }

                if(!e.isSensor){
                    this.isSensor = false
                    this.cmos(e.lists)
                }else if(e.isSensor){
                   this.isSensor = true
                   this.columnsStr = e.columns
                   setTimeout(() => {
                        this.dataList = e.lists
                   },50)
                }

            },
            cmos(list){
                this.rdata.sensorids = [];
                this.rdata.switchids = [];
                this.realData = list.map((item) => {
                    // if(!item.k){
                    //     item.k = item.ipaddr + ':' + item.sensorId + ':' + item.sensor_type;
                    // }
                    item = this.state.AllhashSensor[item];
                    if(item.pid==this.state['sensorConfig']['analog']) this.rdata.sensorids.push(item.id);
                    if(item.pid==this.state['sensorConfig']['switch'])  this.rdata.switchids.push(item.id);
                    return item
                })
                if(!list.length){
                    this.realData.length = [];
                    return
                }
                if(this.viweType > 0){
                    if(this.rdata.switchids.length&&!this.rdata.sensorids.length){
                        this.rdata.mark = 2;
                        this.viweType = 2;
                    }else if(!this.rdata.switchids.length&&this.rdata.sensorids.length){
                        this.rdata.mark = 1;
                        this.viweType = 1;
                    }
                }
                this.getCallData()
            },
            showDetail(){
               this.getCallData()
               this.showType = 2
            },
            showSimplify(){
                this.showType=1
            },
            getCallData(){
                let me = this
                api.gas.getAnalogCall(me.rdata).then(function(res){
                    if(me.isSensor){
                       return
                    }
                    me.dataList = res.data.data
                })
            },
            renderContent(h, { node, data, store }){
                return (<span>
                            <span>
                                <span>
                                    {node.label}
                                </span>
                                {
                                  (() => {
                                      if(node.label == '区域/传感器' ||node.label == '联动控制' ){
                                           return (<span style='margin-left:10px'>（{data.children.length}）</span>)
                                      }else if(data.children && data.children.length && data.lists){
                                          return (<span style='margin-left:10px'>（{data.children.length + '/' + data.lists.length}）</span>)
                                      }else{
                                           return (<span style='margin-left:10px'>（{data.lists.length}）</span>)
                                      }
                                  })()
                                }
                            </span>
                       </span>
                       )
            },
        },
    };

</script>
