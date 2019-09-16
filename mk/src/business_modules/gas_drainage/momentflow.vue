<style type="text/css">
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
  }
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-cog"> 抽采测点管理</span>
        <el-button type="primary" size="mini" @click="addManage"  style="margin-left:150px;">测点配置管理</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSensor"  style="margin-left:10px;">添加模拟量</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSwitch"  style="margin-left:10px;">添加开关量</el-button>
    </p>
    <div  v-if="showdata">           
        <div style="float:left;width:250px;overflow: auto;max-height:800px;">
                <el-tree :data="menuData" :props="defaultProps" @node-click="chooseMenu"  :highlight-current="true" :default-expand-all="true" :render-content="renderContent" :expand-on-click-node="false"></el-tree>
        </div>
        <div style="overflow:hidden;">
            <p class="list-title">{{menutitle}}</p>
            <el-table :data="sensorData" style="width: 100%" border>
                <el-table-column prop="alais" label="设备信息"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="position" label="设备位置"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="scope.row.control==1" size="mini" type="text" @click="delAnalog(scope.row)">删除</el-button>
                        <el-button v-if="scope.row.control==1" size="mini" type="text" @click="updataAnalog(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @click="toCurvesData(scope)">曲线数据</el-button>
                        <el-button size="mini" type="text" @click="lookLog(scope.row)">运行日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 模拟量 -->
        <div v-if="isSensor">
            <el-dialog  :visible.sync="isSensor" :title="analogtitle" width="750px"  :append-to-body="true" :close-on-click-modal="false">
                <add-drainage v-if="showGd5" :formItem="nowGas" :isloding="isloding" :isanalog="isanalog" @saveUpdate="saveUp" @backup="backup"></add-drainage>
                <up-sensor v-if="!showGd5" :formItem="nowGas" :isloding="isloding" :isanalog="isanalog" @saveUpdate="saveUp" @backup="backup"></up-sensor>
            </el-dialog>
        </div>
        <!-- 开关量 -->
        <div v-if="isSwitch">
            <el-dialog  :visible.sync="isSwitch" :title="analogtitle" width="750px"  :append-to-body="true" :close-on-click-modal="false">
                <add-switch :addSwitchForm="swit" :isloding="isloding" @saveUpdate="saveUpdate" @backup="backup"></add-switch>
            </el-dialog>
        </div>
        <!-- 运行日志 -->
        <div v-if="showLog">
            <el-dialog  :visible.sync="showLog" title="运行日志详细内容" width="30%"  :append-to-body="true" :close-on-click-modal="false">
                <el-card>
                    <el-row>
                        <el-col :span="12">
                        内容：<span>{{nowLogObj.content}}</span>
                        </el-col>
                        <el-col :span="12">
                        时间：<span>{{nowLogObj.time}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            操作结果：<span :style="{color:nowLogObj.result==1?'#ed3f14':'#19be6b'}">{{nowLogObj.result==1?'操作失败！':'操作成功！'}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            操作反馈：
                        </el-col>
                    </el-row>
                    <div>
                        <el-input size="small" v-model="nowLogObj.feedback" type="textarea"  :rows="4"></el-input>
                    </div>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="$router.push({name:'looklog',query:{uid:logObj.uid}})">查看更多日志</el-button>
                </el-card>
            </el-dialog>
        </div>
        <!-- 配置管理 -->
        <div v-if="showManage">
              <el-dialog 
              title="抽放分类管理" 
              width="750px"
              :visible.sync="showManage">
               <el-row style="margin:0 0 8px 0">
                    <div>
                        <el-button size="small" type="primary" @click="addParameter()">添加分类</el-button>
                    </div>
                </el-row>
                <el-row>
                    <el-tree
                        :data="choosedepartlist"
                        :props="props"
                        node-key="id"  
                        :default-expanded-keys="choosed"
                        :expand-on-click-node="false"
                        >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                            <el-button size="mini" @click= "()=>edit(data)">编辑</el-button>
                            <el-button :disabled="data.id==20" size="mini" @click="() => remove(data.id)">删除</el-button>
                        </span>
                      </span>
                    </el-tree>
                </el-row>
            </el-dialog>
        </div>
        <!-- 添加分类 -->
        <div v-if="isParameter">
            <el-dialog 
              :title="ptitle" 
              width="750px"
              :visible.sync="isParameter">
                <el-card>
                    <el-form ref="formInline" :model="formInline" :rules="ruleInline" label-width="90px">
                        <el-row>
                            <el-form-item label="分类名称" prop="type">
                                <el-input size="small" style="width: 85%" v-model="formInline.type"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="备注" prop="remark">
                                <el-input size="small" style="width: 85%" v-model="formInline.remark"></el-input>
                            </el-form-item>
                        </el-row>
                            <el-form-item style="text-align:right;">
                                <el-button size="small" @click="cancelAdd">取消</el-button>
                                <el-button size="small" type="primary" @click="handleSubmit('formInline')">确定</el-button>
                            </el-form-item>
                    </el-form>
                </el-card>
                <div slot="footer"></div>
            </el-dialog>
        </div>
        </div>
</el-card> 
</template>
<script>
    import store from 'src/store'
    import api from 'src/api'
    import _ from 'lodash'
    import upSensor from "../../business_bar/upSensor.vue"
    import addSwitch from "../../business_bar/addSwitch.vue"
    import addDrainage from "../../business_bar/addDrainage.vue"

    export default {
        components: {
            upSensor,
            addSwitch,
            addDrainage,
        },
        data() {
            return {
                showdata:false,
                showGd5:false,
                menuData:[],//树菜单
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                props:{
                    children: 'lists',
                    label: 'type'
                },
                sensorData:[],
                isParameter:false,
                isSensor:false,
                isSwitch:false,
                state: store.state,
                action:store.actions,
                formInline: {
                    pid:0,
                    type:"",
                    remark:""
                },
                ruleInline: {
                    type: [
                        { required: true, message: '参数名称不能为空', trigger: 'blur' }
                    ],
                },
                menulist:[],
                nowGas: {},
                swit:{},
                isloding: false,
                nowLogObj:{},
                showLog:false,
                menutitle:"",
                analogtitle:"",
                showManage:false,
                choosedepartlist:[],
                choosed:[],
                menuId:0,
                showP:true,
                index:'',//密码传值
                row:{},
            }   
        },
        methods: {
            fetchData(){
                this.setMenuList()
            },
            setMenuList(row){
                var vm = this
                api.searchs.dataDrain().then((res)=>{
                    if(res.data.status===0){
                        _.forEach(res.data.data,(data)=>{
                            data.sensors = _.concat(data.sensors,data.switches)
                            if(data.list.length){
                                _.forEach(data.list,(obb)=>{
                                    obb.sensors = _.concat(obb.sensors,obb.switches)
                                }) 
                            }
                        })
                        vm.menuData = res.data.data//配置树菜单
                        var arr = []
                        vm.menuData.forEach((ob)=>{
                            if(ob.pid){
                                ob.label = ob.type
                                ob.children = ob.list
                                arr = arr.concat(ob.children)
                                ob.list.forEach((oob)=>{
                                    if(oob.pid){
                                        oob.label = oob.type
                                    }
                                })
                            }
                        })
                        if(!row){
                            vm.chooseMenu(vm.menuData[0])
                            vm.showdata = true
                        }else{
                            vm.menuData.forEach((ob)=>{
                                if(ob.id == row.drainageId){
                                    return vm.chooseMenu(ob)
                                }else{
                                    ob.list.forEach((oob)=>{
                                        if(oob.id == row.drainageId){
                                            return vm.chooseMenu(oob)
                                        }
                                    })  
                                }
                            })
                        }
                    }else{
                        vm.$message.error(res.data.msg)
                    }
                })
            },
            chooseMenu(e) {
                this.convertTable(e)
            },
            convertTable(e) {
                this.sensorData = e.sensors
                this.menutitle=e.type
            },
            // 配置树菜单
            renderContent(h, { node, data, store }){
                return (<span>
                            <span>
                                <span>
                                    {node.label}
                                </span>
                                <span style='margin-left:10px'>
                                    ({data.sensors.length})
                                </span>
                            </span>
                        </span>
               )
            },
            addManage(){
                this.showManage = true
            },
            // 添加抽放分类
            addParameter(){
                this.formInline = {}
                this.ptitle="添加分类"
                this.showP = true
                this.showManage = false
                this.isParameter = true
            },
            // 添加模拟量传感器
            addSensor(){
                this.isloding = false
                this.showGd5 = false
                this.nowGas = {
                    sensorId: 1
                }
                this.analogtitle = "添加传感器"
                this.isSensor = true
            },
            // 添加开关量传感器
            addSwitch(){
                this.isloding = false
                this.swit = {
                    sensorId: 1
                }
                this.analogtitle = "添加传感器"
                this.isSwitch = true
            },
            // 添加树分类
            handleSubmit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var vm = this
                        vm.formInline.pid = 0
                        api.searchs.addup(vm.formInline).then((res)=>{
                            if(res.data.status ==0){
                                vm.isParameter = false
                                vm.showManage = true
                                vm.$message.success("添加成功");
                                vm.getcheck()
                                vm.setMenuList()
                            }else {
                                vm.$message.error(res.data.msg);
                            }
                        })
                    }else{
                        this.$message.error("添加失败")
                    }
                })
            },
            cancelAdd(){
                this.isParameter = false
                this.showManage = true
            },
            // 保存模拟量传感器，GD传感器
            saveUp(obj) {
                delete obj.nowstatus
                delete obj.nowvalue
                let me = this
                me.isloding = true
                api.gas.addGas(obj).then(function(res) {
                    if (res.data.status === 0) {
                        if (res.data.isuse === 1) {
                            me.$message.error(res.data.msg)
                        } else if (res.data.success === 1) {
                            me.$message.error(res.data.msg)
                        } else {
                            me.setMenuList(obj)
                            me.$message.success("添加成功")
                            me.backup()
                        }
                    } else {
                        me.$message.error(res.data.msg)
                    }
                    me.isloding = false
                })                           
            },
            // 保存开关量传感器
            saveUpdate(obj){
                let me = this
                me.isloding = true
                obj.isDrainage = 1  
                    api.searchs.addSwit(obj).then(function(res) {
                        if (res.data.status === 0) {
                            if (res.data.isuse === 1) {
                                me.$message.error(res.data.msg)
                            } else if (res.data.success === 1) {
                                me.$message.error(res.data.msg)
                            } else {
                                me.setMenuList(obj)
                                me.$message.success("添加成功")
                                me.backup()
                            }
                        } else {
                            me.$message.error(res.data.msg)
                        }
                        me.isloding = false
                    })
            },
            backup() {
                this.isSensor = false
                this.isSwitch =false
                this.isanalog = false
                this.isloding = false
            },
            // 删除传感器
            delAnalog(row) {
                let me = this
                me.$confirm('是否删除该传感器', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                if(row.pid == me.state['sensorConfig']['switch']){
                    api.searchs.delDrainSwit(row.id).then(function(res) {
                        if (res.data.status == 0) {
                            me.setMenuList(row)
                            me.$message({
                                type: 'success',
                                message: '操作成功，已经删除!'
                            })
                            delete me.state.AllhashSensor[row.ipaddr+ ':' +row.sensorId+ ':' +row.sensor_type]
                        }else  if(res.data.status === -2){
                            me.$message.error("没有权限")
                        }else{
                            me.$message.error(res.data.msg)
                        }
                    })
                }else{
                   api.gas.delGas(row.id).then(function(res) {
                        if (res.data.status == 0) {
                            me.setMenuList(row)
                            me.$message({
                                type: 'success',
                                message: '操作成功，已经删除!'
                            })
                        }else  if(res.data.status === -2){
                            me.$message.error("没有权限")
                        }else{
                            me.$message.error(res.data.msg)
                        }
                    }) 
                }
                }).catch(() => {
                    me.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });
                });
            },
            // 修改传感器
            updataAnalog(row) {
                this.analogtitle = "修改传感器"
                if(row.sensor_type == 69){
                    this.showGd5 = true
                    this.isSensor = true
                    this.nowGas = row
                }else if(row.pid == this.state['sensorConfig']['switch']){
                    this.isloding = false
                    this.swit = row
                    this.swit.control = row.control + ''
                    this.swit.alarm_status = row.alarm_status + ''
                    this.swit.power_status = row.power_status + ''
                    this.swit.input_type = row.input_type + ''
                    this.isSwitch = true
                }else{
                    this.isloding = false
                    this.nowGas = row
                    this.showGd5 = false
                    this.isanalog = true 
                    this.isSensor = true
                }
            },
            // 跳转曲线数据
            toCurvesData(row) {
                if(row.row.pid==this.state['sensorConfig']['analog']){
                    if(row.row.sensor_type == 69){
                        this.$router.push({
                            name: 'gastime',
                            params:{
                                aname:row.row.uid,
                            }
                        })
                    }else{
                        this.$router.push({
                            name: 'realtime',
                            params:{
                                aname:row.row.uid,
                            }
                        })
                    }
                }else if(row.row.pid==this.state['sensorConfig']['switch']){
                    this.$router.push({
                        name: 'watching-index/switch-data',
                        params:{
                            aname:row.row.uid,
                        }
                    })
                } 
            },
            // 查看日志
            lookLog(row){
                let me = this
                me.logObj = row
                api.gas.getAllLog({uid:me.logObj.uid}).then((res) => { 
                    if(res.data.status===0){
                        me.nowLogObj = res.data.data
                        me.showLog = true
                    }else{
                        me.$message.error(res.data.msg);
                    }
                }) 
            },
            // 获取树分类
            getcheck () {
                let vm = this
                api.searchs.setDrain().then((res) => {
                    if (res.data.status === 0) {
                        vm.choosedepartlist = res.data.data
                    } else {
                      vm.$message.error(res.data.msg)
                    }
                })
            },
            // 修改树分类
            edit(data){
                this.formInline = {
                        id:data.id,
                        type:data.type,
                        typeid:data.typeid,
                        unit:data.unit,
                        remark:data.remark
                }
                this.ptitle="修改分类"
                this.showManage = false
                this.isParameter = true
                this.showP = false
            },
            // 删除树分类
            remove (id) {
                let me = this
                me.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {   
                    api.searchs.deldata({id:id}).then((res) => {
                        if (res.data.status === 0) {
                            me.$message.success("删除成功");
                            me.getcheck()
                            me.setMenuList()
                        } else{
                            me.$message.error(res.data.msg)
                        }
                    })
                }).catch(() => {
                    me.$message({type: 'warning',message: '操作已取消'}); 
                })
            },
        },
        watch:{
            '$route':'fetchData'
        },
        mounted() {
            this.fetchData()
            this.$store.dispatch("getFacilityMsg")
            this.$nextTick(() => {
                this.getcheck()
            })
        },
        computed:{
            AllTypeList() {
                return this.$store.state.AllTypeList;
            },
        }
    };
</script>

