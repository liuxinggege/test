<style>
    .action_button{
        color:rgb(32,160,255);
        cursor: pointer;
        margin-right: 5px;
    }
</style>
<template>
    <el-card>  
        <p slot="header">
            <span class="fa fa-database"> 数据字典</span>
            <el-button size="mini" type="primary" @click="addtype" icon="el-icon-plus" style="margin-left:30px;">新增类型</el-button>
        </p>  
		<el-tabs @tab-click="tabsClick" v-model='TabPaneIndex'>
            <el-tab-pane  v-for="(item,index) in tabline" :name="item.name" :label="item.label">
                <el-table :data="item.lists" border max-height="600" height="600">
                     <el-table-column v-for="(m,index) in item.columns" :label="m.title" :prop="m.key">
                          <template scope="scope">
                                <div v-if="m.key === 'actionbutton'" @click="actionbuttonClick($event,scope.row)">
                                    <span class="action_button">删除</span>
                                    <span class="action_button">修改</span>
                                </div>
                                <span v-else>{{scope.row[m.key]}}</span>
                          </template>
                     </el-table-column>    
                </el-table>
            </el-tab-pane>  
        </el-tabs>
        <el-dialog 
            :visible.sync="addModal"
            :append-to-body="true" 
            :close-on-click-modal="false"
            width="30%"
            :title="add_title">
            <el-form :model="formItem" ref="formItem" :rules="ruleInline" label-width="100px">
                <el-form-item label="类型" prop="pid" >
                    <el-select size="small" v-model="formItem.pid" @change="pidchange">
                        <el-option :value="state.sensorConfig.analog" :key="state.sensorConfig.analog + ''" label="模拟量"></el-option>
                        <el-option :value="state.sensorConfig.switch"  :key="state.sensorConfig.switch + ''" label="开关量"></el-option>
                        <el-option :value="300" key="300" label="安装位置"></el-option>
                        <el-option :value="600" key="600" label="职务"></el-option>
                        <el-option :value="700" key="700" label="语音播报"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="formItem.pid==700?'语音内容':'类型名称'" prop="v">
                    <el-input size="small" v-model="formItem.v"></el-input>
                </el-form-item>
                <template v-if="formItem.pid==state.sensorConfig.analog">
                    <el-form-item label="单位" prop="k">
                        <el-input size="small" v-model="formItem.k"></el-input>
                    </el-form-item>
                    <el-form-item label="最大上限" prop="max_value">
                        <el-input size="small" v-model="formItem.max_value"></el-input>
                    </el-form-item>
                    <el-form-item label="最小下限"  prop="min_value">
                        <el-input size="small" v-model="formItem.min_value"></el-input>
                    </el-form-item>
                    <el-form-item label="倍率"  prop="formItem.ratio">
                        <el-input size="small" v-model="formItem.ratio"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="播放编号" v-if="formItem.pid==700" prop="k">
                    <el-input size="small" v-model="formItem.k"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right;">
                    <el-button size="small" @click="handleReset('formItem')">取消</el-button>
                    <el-button size="small" type="primary" @click="handleSubmit('formItem')" style="margin-left: 8px">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-card> 
</template>

<script>
    import store from 'src/store'
    import api from 'src/api'


    export default {
        components: {},
        data() {
            return {
                isEdit:'',
                currentPage: 1,
                pageSize: 20,
                totalcount: 0,
                tableListPage:[],
                tableList:[],
                theadColumns:[],
                state: store.state,
                action: store.actions,
                screenHeight: document.body.clientHeight,
                screenWidth: document.body.clientWidth,
                add_title: '',
                addModal: false,
                formItem: {},
                ruleInline: {
                    k: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, ],
                    v: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }]
                },
                TabPaneIndex:'1',
                tabline: [{
                            label: "模拟量",
                            name: "1",
                            pid: store.state.sensorConfig.analog,
                            lists: [],
                            columns:[
                                    {title: '类型', key:'v'},
                                    {title: '单位', key:'k'},    
                                    {title: '最大上限取值范围', key:'max_value'},
                                    {title: '最小下限取值范围', key:'min_value'},
                                    {title: '倍率', key:'ratio'},
                                    {title: '操作', key:'actionbutton'}
                                ]
                         },
                         {
                            label: "开关量",
                            name: "2",
                            pid: store.state.sensorConfig.switch,
                            lists: [],
                            columns:[
                                    {title: '类型',key: 'v'},
                                    {title: '操作',key: 'actionbutton'}
                                ]
                        },{
                            label: "安装位置",
                            name: "3",
                            pid: 300,
                            lists: [],
                            columns:[
                                   {title: '位置', key: 'v'},
                                   {title: '操作',key: 'actionbutton'}
                                ]
                          },
                          {
                            label: "职务",
                            name: "5",
                            pid: 600,
                            lists: [],
                            columns:[
                                   {title: '职务',key: 'v'},
                                   { title: '操作',key: 'actionbutton'}
                                ]
                          },{
                            label: "语音播报",
                            name: "6",
                            pid: 700,
                            lists: [],
                            columns:[
                                    {title: '播放编号',key: 'k'},
                                    {title: '语音内容',key: 'v'},
                                    {title: '操作',key: 'actionbutton'}
                                ]
                        }],
            }
        },
        watch: {
            '$route': 'fetchData'
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            fetchData(){
               this.getAll()
            },
            //刷新 init
            getAll() {
                api.searchs.getallData().then((res) => {
                    if(res.data.status == 0){
                        this.tabline[0].lists = res.data.sensor  //模拟量类型
                        this.tabline[1].lists = res.data.switchsensor  //开关量类型
                        this.tabline[2].lists = res.data.sensorposition  //安装位置
                        this.tabline[3].lists = res.data.duty//职务
                        this.tabline[4].lists = res.data.radio//语音播放
                    }else{
                        this.$message.error(res.data.msg);
                    }       
                })
            },
            tabsClick(){},
            actionbuttonClick(e,params){
                switch(e.target.innerText){
                    case '修改':
                    this.edit(params)
                    break;
                    case '删除':
                    this.delete(params)
                    break;
                }
            },
            //删除
            delete(row){
                let me = this
                    this.$confirm('是否永久删除?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                            api.gas.delDataText(row.id).then((res) => {
                                    if(res.data.status===0){
                                         me.getAll()
                                         this.$message({
                                            type: 'success',
                                            message: '操作成功'
                                         });
                                    }else{
                                         me.$message.error(res.data.msg);
                                    }
                                })
                        }).catch(() => {
                          this.$message({
                            type: 'info',
                            message: '已取消删除'
                          });          
                        });
                
            }, 
            //添加 
            addtype() {
                this.isEdit = true
                this.add_title = "添加"
                this.addModal = true
                this.formItem = {}
            },
            //修改
            edit(row){
                this.isEdit = false
                this.formItem =JSON.parse(JSON.stringify(row))
                this.add_title = "修改"
                this.addModal = true
            },
            //选择类型
            pidchange(val) {
                this.formItem.pid = val;
            },
            //提交
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let me = this
                        delete me.formItem._index
                        delete me.formItem._rowKey
                        if(me.formItem.pid == me.state.sensorConfig.analog){
                            api.searchs.deviceTypeUpdate(me.formItem).then((res) => {
                                if (res.data.status === 0) {
                                    me.$message.success('操作成功！');
                                    var m = me.tabline.find(item => item.pid === me.formItem.pid);
                                    me.TabPaneIndex = !m? me.TabPaneIndex : m.name;
                                    me.getAll()
                                } else {
                                    me.$message.error(res.data.msg);
                                }
                                this.addModal = false
                            })
                        }else{
                            api.searchs.addupData(me.formItem).then((res) => {
                                if (res.data.status === 0) {
                                    me.$message.success('操作成功！');
                                    var m = me.tabline.find(item => item.pid === me.formItem.pid);
                                    me.TabPaneIndex = !m? me.TabPaneIndex : m.name;
                                    me.getAll()
                                } else {
                                    me.$message.error(res.data.msg);
                                }
                                this.addModal = false
                            })
                        } 
                    } else {
                        this.$message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.addModal = false
                this.$refs[name].resetFields();
            },
        }
    };

</script>
