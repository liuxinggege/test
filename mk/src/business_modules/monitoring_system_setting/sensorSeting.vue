<style lang="less">
    @import '../../styles/common.less';
    .toolBar>span{
        margin-left: 50px;
        font-size: 14px;
        font-weight: bold;
        width: 150px;
    }
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
        font-size: 14px;
        overflow: hidden;
    }
</style>
<template>
 <el-card v-if="showdata">
    <p slot="header">
        <span class="fa fa-tasks" v-if="$route.query.type==0">&nbsp;传感器配置</span>
        <span class="fa fa-tasks" v-else-if="$route.query.type==1">&nbsp;模拟量配置</span>
        <span class="fa fa-tasks" v-else-if="$route.query.type==2">&nbsp;开关量配置</span>
        <span  style="margin-left:150px;">
            <el-button 
                size="mini" 
                type="primary" 
                style="margin-left:5px;" 
                icon="el-icon-plus" 
                @click="addAnalogFn"  
                v-if="$route.query.type==1||$route.query.type==0">
            添加模拟量</el-button>
            <el-button 
                size="mini" 
                type="primary" 
                icon="el-icon-plus" 
                @click="addSwitchFn"  
                style="margin-left:5px;" 
                v-if="$route.query.type==2||$route.query.type==0">
            添加开关量</el-button>
        </span>
    </p>
    <div>
        <div style="float:left;width:250px;max-height:650px;overflow:auto;">
            <div>
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
        </div>
        <div style="overflow: hidden;">
            <el-table :data="showTableListPage"  border>
                    <el-table-column v-for="item in columns"  :label="item.title" :prop="item.key" :sortable="item.sortable==1" :width="item.width">
                        <template scope="scope">
                               <div  v-if="item.key=='action'" @click="handleAction(scope.row,$event)">
                                  <el-button type="text" size="mini">删除</el-button>
                                  <el-button type="text" size="mini">编辑</el-button>
                                  <el-button type="text" size="mini">{{scope.row.pid==state.sensorConfig['analog']?'实时曲线图':'实时状态图'}}</el-button>
                                  <el-button type="text" size="mini">运行日志</el-button>
                                  <el-button type="text" size="mini" v-if="scope.row.pid==state.sensorConfig['analog']">配置区域断电</el-button>
                              </div>
                              <div v-else-if="item.key=='devname'">
                                  <span v-if="!scope.row[item.key].length">未配置</span>
                                  <span v-else v-for="ob in scope.row[item.key]">{{ob}}<br></span>
                              </div>
                              <div v-else-if="item.key=='areapowername'">
                                  <span v-if="scope.row.pid==state.sensorConfig['switch']">-</span>
                                  <span v-else-if="!scope.row[item.key].length">未配置</span>
                                  <span v-else v-for="ob in scope.row[item.key]">{{ob}}<br></span>
                              </div>
                              <div v-else-if="item.key=='position'">{{scope.row.type}}/{{scope.row.position}}</div>
                              <div v-else>{{scope.row[item.key]}}</div>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination
                v-show="totalnum"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[5,10, 15, 20]"
                :page-size="maxPage" layout="total, sizes, prev, pager, next, jumper"
                :total="totalnum"
                style="margin:20px;">
             </el-pagination>
        </div>
    </div>

    <!--运行日志-->
    <div v-if="showLog">
       <el-dialog  :visible.sync="showLog" title="运行日志详细内容" :modal-append-to-body="false" :close-on-click-modal="false">
            <el-row>
                <el-col :span="12">内容：<span>{{nowLogObj.content}}</span></el-col>
                <el-col :span="12">时间：<span>{{nowLogObj.time}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    操作结果：<span :style="{color:nowLogObj.result==1?'#ed3f14':'#19be6b'}">{{nowLogObj.result==1?'操作失败！':'操作成功！'}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">操作反馈： </el-col>
            </el-row>
            <div>
                <el-input v-model="nowLogObj.feedback" type="textarea"  :rows="4"></el-input>
            </div>
            <el-button size="small" type="primary" style="margin-top:10px;" @click="$router.push({name:'looklog',query:{uid:logObj.uid}})">查看更多日志</el-button>
       </el-dialog>
    </div>

    <!-- 区域断电-->
    <div v-if="areaPowerModel">
        <el-dialog :visible.sync="areaPowerModel" title="区域断电" width="800px" :modal-append-to-body="false" :close-on-click-modal="false">
            <p class="list-title">请勾区域断电设备</p>
            <el-table ref="multipleTables" :data="powerList"   @selection-change="handleSelectionChange" height="450" style="width:100%;">
                <el-table-column label="设备编号" prop="alais" width="90"></el-table-column>
                <el-table-column label="设备类型" prop="type" width="170"></el-table-column>
                <el-table-column label="位置/区域">
                    <template scope="scope">
                        {{scope.row.position}}/{{scope.row.areaname||'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="执行动作" width="150">
                    <template scope="scope">
                        <div>
                            <span @click="changeAction(scope.row.uid,scope.$index)" style="float: left;">{{scope.row.action!=1?'恢复控制':'控制'}}</span>
                            <el-button size="mini" type="text" style="float: right;" @click="changeAction(scope.row.uid,scope.$index)" icon="el-icon-refresh"></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="选择" type="selection" width="55"></el-table-column>
            </el-table>
            <div slot="footer">
                <el-button size="small" @click="areaPowerModel = false">取消</el-button>
                <el-button size="small" type="primary" icon="el-icon-message" @click="handleSaveAreaPower">保存</el-button>
            </div>
        </el-dialog>
    </div>

    <!--模拟量  添加与修改-->
    <div v-if="showEdit">
        <el-dialog :visible.sync="showEdit" :title="modalTitle" width="800px" :modal-append-to-body="false" :close-on-click-modal="false">
            <up-sensor 
                :formItem="nowGas"
                :isanalog="isanalog"
                :isloding="isloding"
                @saveUpdate="saveUpdate"
                @backup="backup">
            </up-sensor>
        </el-dialog>
    </div>

   <!-- 开关量   添加与修改-->
    <div v-if="showSwitchAddup">
        <el-dialog :visible.sync="showSwitchAddup" :title="modalTitle" width="750px" :modal-append-to-body="false" :close-on-click-modal="false">
            <add-switch
                :addSwitchForm="swit"
                :isloding="isloding"
                @saveUpdate="saveUpdate"
                @backup="backup">
            </add-switch>
        </el-dialog>
    </div>
    
</el-card>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import upSensor from "../../business_bar/upSensor.vue"
    import addSwitch from "../../business_bar/addSwitch.vue"

    export default {
        components: {
            upSensor,
            addSwitch,
        },
        beforeDestroy: function (){
            this.treeMenu = null;
            this.showTableList = null;
            this.showTableListPage = null;
            console.log('beforeDestroy')
        },
        data() {
            return {
                modalTitle:'',
                nowLogObj:{},//操作日志返回的对象
                logObj:{},//操作日志的传感器
                showLog:false,
                treeMenu: [], //菜单tree
                columns: [  {title: '编号',key: 'alais',sortable:1,width:90},
                            {title: '设备信息',key: 'position'},
                            {title: '联动设备',key: 'devname'},
                            {title: '区域断电',key: 'areapowername'},
                            {title: '操作',key: 'action',width:400}],
                showTableList: [],
                showTableListPage: [], //当前页
                nowClick:{nid:'0'},
                currentPage: 1,
                maxPage: 10,
                totalnum: 100,
                state: store.state,
                action:store.actions,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                showdata: false,
                isloding: false,
                showEdit: false,
                showSwitchAddup: false,
                nowGas: {},
                swit: {},
                isanalog: false,
                areaPowerModel:false,
                powerList:[],
                multipleSelection:[],
                areaObj:{}
            }
        },
        watch: {
            '$route': 'fetchData',
             'state.updateall':{
            	handler: function(val) {
            		this.setMenuList(-1)
            	},
            	deep: true
            }
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            handleAction(row,event){
                let str = event.target.innerHTML.trim();
                switch(str){
                    case '删除': this.delsensor(row); break;
                    case '编辑': this.uplsensor(row); break;
                    case '实时曲线图': this.toCurvesData(row); break;
                    case '实时状态图': this.toCurvesData(row); break;
                    case '运行日志': this.lookLog(row); break;
                    case '配置区域断电': this.addUpareaPower(row); break;
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeAction(uid,index){
                  let list = []
                  this.powerList[index].action = this.powerList[index].action==1?0:1;
                  if(this.multipleSelection.length){
                      for(let item of this.multipleSelection){
                          if(uid===item.uid){
                              item = this.powerList[index]
                              break;
                          }
                      }
                      list = this.multipleSelection
                  }
                  this.powerList=[...this.powerList]
                  if(list.length){
                     setTimeout(()=>{ this.toggles(list,2) },0)
                  }
            },
            //表格控件  多选框赋值
            toggles(rows,type){
                   this.powerList.forEach(row => {
                       for(let i=0;i<rows.length;i++){
                           if(rows[i].uid===row.uid){
                               if(type==1){
                                    row.action = rows[i].action
                               }else if(type==2){
                                    row.action = rows[i].action
                               }
                               this.$refs.multipleTables.toggleRowSelection(row);
                           }
                       }
                   })
            },
            //区域断电.
            addUpareaPower(row){
                this.areaObj = row;
                this.areaPowerModel = true;
                var list = [];
                if(row.sensorList && row.sensorList.length){
                    for(let key in this.state.AllhashSensor){
                         let item = this.state.AllhashSensor[key];
                         if(item.sensor_type == 53||item.sensor_type == 56){
                              let ob = row.sensorList.find(m => m.uid == item.uid);
                              !ob && list.push(item);
                         }
                    }
                }else{
                    list = Object.values(this.state.AllhashSensor).filter(m => m.sensor_type == 53 ||m.sensor_type == 56)

                }
                 this.powerList = JSON.parse(JSON.stringify(list));
                console.log( this.powerList )
                if(row.areasensorList && row.areasensorList.length){
                    setTimeout(()=>{ this.toggles(row.areasensorList,1) },0)
                }
            },
            handleSaveAreaPower(){
                this.areaPowerModel = false;
                let rdata = {
                    ipaddr:this.areaObj.ipaddr,
                    uid:this.areaObj.uid,
                    sensor_type:this.areaObj.sensor_type,
                    sensorId:this.areaObj.sensorId,
                    areasensorList:this.multipleSelection.map(item => {
                        return {
                            uid:item.uid,
                            sensor_type:item.sensor_type,
                            action:item.action || 0,
                            ip:item.ipaddr,
                            sensorId:item.sensorId,
                            dsp:'S'
                        }
                    })
                };
                // console.log(rdata,'rdata')
                api.station.addupAreapower(rdata).then(res => {
                    console.log(res)
                    if(res.data.status == 0){
                        this.setMenuList(-1);
                        this.$message.success("操作成功");
                    }else{
                        this.$message.error("操作成功");
                    }
                })

            },
            fetchData() {
                this.currentPage = 1
                this.setMenuList()
            },
            //设置树菜单
            setMenuList(row,k) {
                let me = this
                api.gas.getAllList({id:parseInt(me.$route.query.type)}).then((res) => {
                    // console.time("time");
                     if (res.data.status == 0) {
                        me.treeMenu =  res.data.data;
                        let ol = {};
                        me.treeMenu.forEach((item,i) => {
                                item.nid = i + ''
                                if(item.nid === this.nowClick.nid){
                                    ol = item;
                                }
                                if(item.children&&item.children.length){
                                    item.children.forEach((m,index) => {
                                        m.nid = item.nid + '-' + index
                                        if(m.nid === this.nowClick.nid){
                                                ol = m;
                                        }
                                    })
                                }
                        })
                        ol = ol.nid?ol:this.nowClick;
                        if(!row){
                            // 初始化
                            me.chooseMenu(me.treeMenu[0])
                        }else if(row === -1){
                            //设备修改
                            me.chooseMenu(ol,-1);
                        }
                        if(k){
                            delete me.state.AllhashSensor[k];
                        }
                        me.showdata = true
                    }else{
                        me.$message.error(res.data.msg)
                        me.showdata = true;
                    }
                    // console.timeEnd("time");
               })
            },
            chooseMenu(e,bool) {
                setTimeout(() => {
                    this.$refs.treeBar.setCurrentKey(e.nid);
                },10)
                this.nowClick = e
                this.nowClick.expanded = !this.nowClick.expanded;
                this.showTableList = [];
                this.showTableList = e.lists.map(k => this.state.AllhashSensor[k]);
                this.totalnum = e.lists.length;
                if(bool != -1&&bool != undefined){
                    this.currentPage = 1
                    setTimeout(() => {
                    this.$refs.treeBar.store.nodesMap[e.nid].expanded = this.nowClick.expanded;
                    },10)
                }else{
                    let num = this.totalnum/this.maxPage;
                    if(Number.isInteger(num) &&num < this.currentPage&& this.currentPage > 1 ){
                            this.currentPage--
                    }
                }
                this.switchover();
            },
            switchover() {
                this.showTableListPag = [];
                this.showTableListPage = this.showTableList.slice(((this.currentPage - 1) * this.maxPage), (this.currentPage * this.maxPage));
            },
            handleSizeChange(val) {
                this.maxPage = val
                this.switchover()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.switchover()
            },

            lookLog(row){
                let me = this
                me.logObj = row
                api.gas.getAllLog({uid:me.logObj.uid}).then((res) => {
                    console.log(res)
                    if(res.data.status===0){
                        me.nowLogObj = res.data.data
                        me.showLog = true
                    }else{
                        me.$message.error(res.data.msg);
                    }
                })
            },

            //跳转曲线数据
            toCurvesData(row) {
                console.log(row)
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
                            name: 'analogCurve',
                            params:{
                                aname:row.uid,
                            },
                            query:{type:'call'}
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
            },
            delsensor(row) {
                if (row.pid==this.state['sensorConfig']['analog']) {
                    this.delAnalog(row)
                }else if(row.pid==this.state['sensorConfig']['switch']){
                    this.delSwitch(row)
                }
            },
            uplsensor(row) {
                console.log(row)
                if(row.pid==this.state['sensorConfig']['analog']) {
                    this.updataAnalog(row)
                }else if(row.pid==this.state['sensorConfig']['switch']) {
                    this.updataSwitch(row)
                }
            },
            //添加模拟量传感器
            addAnalogFn() {
                this.modalTitle = '添加';
                this.isloding = false;
                this.nowGas = {sensorId: 1};
                this.isanalog = true;
                this.showEdit = true;
            },
            //修改模拟量传感器
            updataAnalog(row) {
                this.modalTitle = '修改';
                this.isloding = false;
                this.nowGas = row;
                this.isanalog = true;
                this.showEdit = true;
            },
            //删除模拟量传感器
            delAnalog(row) {
                let me = this;
                me.$confirm('是否删除该传感器', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'info'})
                  .then(() => {
                        api.gas.delGas(row.id).then(function(res) {
                            console.log(res,"删除")
                            if (res.data.status == 0) {
                                let k = row.ipaddr+ ':' +row.sensorId+ ':' +row.sensor_type;
                                me.setMenuList(-1,k);
                                me.action.generate();
                                me.$message({type: 'success',message: '操作成功，已经删除!'})
                            }else{
                                me.$message.error(res.data.msg);
                            }
                        })
                }).catch(() => {
                         me.$message({type: 'warning',message: '操作已取消'});
                });
            },
            //添加开关量
            addSwitchFn() {
                this.modalTitle = '添加';
                this.swit = {
                    sensorId: 1
                };
                this.showSwitchAddup = true;
                this.isloding = false;
            },
            //修改开关量
            updataSwitch(row) {
            	console.log(row)
                this.modalTitle = '修改';
                this.swit = row;
                this.swit.control = row.control + '';
                // this.swit.alarm_status = row.alarm_status + '';
                 this.showSwitchAddup = true;
                this.isloding = false;
            },
            //删除开关量
            delSwitch(row) {
                 console.log(row)
                 let me = this
                 me.$confirm('是否删除该传感器', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'info'
                 }).then(() => {
                     api.switchs.delSwitch(row.id).then((res) => {
                         if (res.data.status === 0) {
                             let k = row.ipaddr+ ':' +row.sensorId+ ':' +row.sensor_type;
                             me.setMenuList(-1,k);
                             me.action.generate();
                             me.$message({type: 'success',message: '操作成功，已经删除!'});
                         }else{
                              me.$message.error(res.data.msg);
                         }
                     })
                 }).catch(() => {
                       me.$message({type: 'warning',message: '操作已取消'});
                 });
            },
            //模拟量和开关量      保存修改
            saveUpdate(obj, isanalog) {
                delete obj.nowstatus
                delete obj.nowvalue
                obj.menu = _.last(obj.menuId)
                delete obj.menuId
                let me = this
                me.isloding = true
                if (isanalog) {
                        if(obj.isDrainage===1){
                            api.searchs.addSen(obj).then(function(res) {
                                if (res.data.status === 0) {
                                    if (res.data.isuse === 1) {
                                        me.$message.error(res.data.msg)
                                    } else if (res.data.success === 1) {
                                        me.$message.error(res.data.msg)
                                    } else {
                                        me.backup(-1)
                                    }
                                } else {
                                    me.$message.error(res.data.msg)
                                }
                                me.isloding = false
                            })
                        }else{
                            api.gas.addGas(obj).then(function(res) {
                                if (res.data.status === 0) {
                                    if (res.data.isuse === 1) {
                                        me.$message.error(res.data.msg)
                                    } else if (res.data.success === 1) {
                                        me.$message.error(res.data.msg)
                                    } else {
                                        me.backup(-1)
                                    }
                                } else {
                                    me.$message.error(res.data.msg)
                                }
                                me.isloding = false
                            })
                        }
                } else {
                    api.switchs.addSwitch(obj).then((res) => {
                        console.log(res,'添加修改开关量')
                        if (res.data.status === 0) {
                            if (res.data.isuse === 1) {
                                me.$message.error(res.data.msg)
                            } else if (res.data.success === 1) {
                                me.$message.error(res.data.msg)
                            } else {
                                me.backup(-1)
                            }
                        } else {
                            me.$message.error(res.data.msg)
                        }
                        me.isloding = false
                    })
                }
            },
            backup(row) {
                this.showEdit = false
                this.showSwitchAddup = false
                this.isanalog = false
                this.isloding = false
                if(row===-1){
                      this.setMenuList(-1);
                      this.$message({message: '操作成功！',type: 'success'});
                      this.action.getOwnList();
                      this.action.generate();
                }

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
            }
        },
        computed: {}
    };

</script>
