<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-list-ul"> 瓦斯抽放实时列表</span>
    </p>
    <div v-if="showdata">          
        <div style="float:left;width:250px;overflow: auto;max-height:800px;">
            <el-tree :data="menuData" :props="defaultProps" @node-click="chooseMenu" :default-expand-all="true" :highlight-current="true" :render-content="renderContent" :expand-on-click-node="false"></el-tree>
        </div>
        <div style="overflow:hidden;">
<!--             gd5 5个参数-->
             <div v-if="tableType==5">
                    <el-table :data="lists" stripe border v-if="lists.length" border @row-click='toLine' style="width: 100%">
                        <el-table-column v-for="item in columns" :prop="item.key" :label="item.title" >
                            <template scope="scope">
                                <div v-if="item.key=='statusText'" :style="{color:scope.row.showColor}">
                                    <label>{{scope.row.statusText}}</label>
                                </div>
                                <div v-else-if="item.key=='positionType'">{{scope.row.position}}</div>
                                <div v-else-if="item.key=='type'">
                                    <label v-if="scope.row.type==69||scope.row.type.indexOf('多参')!=-1">GD3矿用瓦斯抽放多参数传感器</label>
                                </div>
                                <div v-else>{{scope.row[item.key]}}</div>
                            </template>  
                        </el-table-column>
                 </el-table>
                 <el-pagination 
                    v-show="totalnum>maxPage" 
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange" 
                    :current-page="currentPage" 
                    :page-sizes="[30,40,50]" 
                    :page-size="maxPage" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="totalnum"
                    style="margin-bottom: 32px">
                 </el-pagination>
            </div>
            <div v-else-if="tableType==1">
                 <real-tabel :columns="columns" :sensorList="showTableList" :texts="label"></real-tabel>
            </div>
        </div>
      </div> 
</el-card>
</template>
<script>
    import store from 'src/store'
    import api from 'src/api'
    import realTabel from "../../business_bar/realTabel.vue"
    export default {
        components: {
             realTabel,
        },
        data() {
            return {
                scolumns:[
                    {key:'alais',title:'设备编号'},
                    {key:'positionType',title:'地址'},
                    {key:'statusText',title:'状态'},
                ],
                columns:[],
                tableType:5,
                label:'',
                state: store.state,
                action:store.actions,
                        showdata:false,
                menuData:[],
                currentPage: 1,
                maxPage: 60,
                totalnum: 0,
                showTableList:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                lists:[]
            }   
        },
        computed:{},
        watch:{
            '$route':'fetchData',
            'state.skIndex': {
                handler: function(val) { 
                    if(this.tableType==5){
                        this.setRealTimeValue()
                    }       
                },
                deep: true
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.state.isOpenReal = true
                this.fetchData()
            })
        },
        methods: {
            // 生成菜单列
            renderContent(h, { node, data, store }){
                return (<span>
                            <span>
                                <span>
                                    {node.label}
                                </span>
                                <span style='margin-left:10px'>
                                          （{data.sensors.length}）
                                </span>
                            </span>
                        </span>
               )
            },
            fetchData(){
                this.setMenuList()
            },
            setMenuList(row){
                var vm = this
                vm.menuData = []
                api.searchs.dataDrain().then((res)=>{
                    if(res.data.status===0){
                        _.forEach(res.data.data,(data)=>{
                            data.sensors = _.concat(data.sensors,data.switches)
                            _.forEach(data.list,(obb)=>{
                                obb.sensors = _.concat(obb.sensors,obb.switches)
                            })
                        })
                        res.data.data.forEach((item) => { 
                            item.children = item.list
                            item.label = item.type

                            //暂时修改
                            if(item.titles&&item.titles.length>1){
                                item.titles = [
                                    {title:"类型",key:"type"},
                                    {title:"温度(℃)",key:"temperature"},
                                    {title:"压力(kPa)",key:"pressure"},
                                    {title:"瓦斯浓度(%)",key:"wasi"},
                                    {title:"一氧化碳浓度(ppm)",key:"co"},
                                    {title:"工况瞬时混合流量(m³/min)",key:"flow_work"},
                                    {title:"标况瞬时混合流量(m³/min)",key:"flow_standard"},
                                    {title:"标况瞬时纯流量(m³/min)",key:"flow_pure"},
                                ];
                            }

                            if(item.list.length){
                                item.list.forEach((ob) => {
                                    ob.label = ob.type;

                                    //暂时修改
                                    if(ob.titles[0].key == 'co' || ob.titles[0].key == 'wasi' ){
                                            ob.titles[0].key = 'now_value';
                                    }
                                    
                                })
                            }
                        })
                        vm.menuData = res.data.data
                        vm.chooseMenu(vm.menuData[0])
                        vm.showdata = true
                    }else{
                        vm.$message.error(res.data.msg)
                    }
                })
            },
            chooseMenu(e) { 
                if(!e.titles) { 
                      return
                }
                if(e.titles.length){
                    this.columns = this.scolumns.concat(e.titles)
                }
                this.showTableList = e.sensors.map((item) => {
                    if(!item.k){
                        item.k = item.ipaddr + ':' + item.sensorId + ':' + item.sensor_type
                    }
                    return this.state.AllhashSensor[item.k]
                })
                if(e.titles.length == 1){
                    this.tableType = 1
                    if(!e.children){ 
                        this.label = e.label
                    }
                }else if(e.titles.length >= 6){
                        this.tableType = 5
                        this.currentPage = 1
                        this.totalnum = e.sensors.length
                        this.switchover()
                }
            },
            handleSizeChange(val) {
                this.maxPage = val
                this.switchover()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.switchover()
            },
            switchover() {
                this.lists  = this.showTableList.slice(((this.currentPage -1) * this.maxPage), (this.currentPage * this.maxPage))
                console.log(this.lists)

                this.setRealTimeValue()  
            },
            setRealTimeValue(){
               if(this.lists.length){
                 this.lists.forEach(item => {
                       item = this.state.AllhashSensor[item.k]
                   })
               }  
            },
            toLine(row){
                if(row.pid==this.state['sensorConfig']['analog']){
                    if(row.sensor_type == 69){
                        this.$router.push({
                            name: 'gastime',
                            params:{
                                aname:row.uid,
                            }
                        })
                    }else{
                        this.$router.push({
                            name: 'realtime',
                            params:{
                                aname:row.uid,
                            }
                        })
                    }
                }else if(row.pid==this.state['sensorConfig']['switch']){
                    this.$router.push({
                        name: 'watching-index/switch-data',
                        params:{
                            aname:row.uid,
                        }
                    })
                }
            }
        }, 
    };
</script>