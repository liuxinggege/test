<style>
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-newspaper-o"> 班次配置</span>
    </p>
    <div v-if="!model">
        <el-button size="small" type="primary" @click="model = true" icon="el-icon-plus" >新增班次</el-button>
        <el-button size="small" type="primary" @click="sureDelete" icon="el-icon-delete" style="margin-bottom: 10px;">清除班次</el-button>
        <el-table :data="classList" border tooltip-effect="dark" style="width: 100%" :highlight-current-row="true">
            <el-table-column prop="name" label="班次名称"></el-table-column>
            <el-table-column prop="start" label="班次开始时间"></el-table-column>
            <el-table-column prop="end" label="班次结束时间"></el-table-column>
        </el-table> 
    </div>
    <div v-else>
        <el-button v-if="model" size="small" type="primary" icon="el-icon-back" style="margin-bottom: 30px;" @click="backup">返回</el-button> 
        <fieldset class="ipparse">
            <legend style="font-weight: 700;font-size: 14px;color: #0082e6;">配置班次</legend>
                <el-table :data="dataList" border tooltip-effect="dark" style="width: 100%" :highlight-current-row="true">
                    <el-table-column prop="name" label="班次名称"></el-table-column>
                    <el-table-column prop="start" label="班次开始时间"></el-table-column>
                    <el-table-column prop="end" label="班次结束时间"></el-table-column>
                </el-table>
                <el-button size="small" type="primary" icon="el-icon-plus" @click="addTime" style="margin-top: 10px">添加</el-button>
        </fieldset>
        <el-row :gutter="20">
            <el-col :span="12" :offset="10">
                <el-button size="small" type="primary" @click="handleSubmit" icon="el-icon-message">保存</el-button>
                <el-button size="small" @click="backup" style="margin-left: 8px">取消</el-button>
            </el-col>
        </el-row>
    </div>
    <div v-if="isTime">
        <el-dialog 
            :close-on-click-modal='false'
            :visible.sync="isTime"
            title="班次设置">   
            <el-form ref="classform" :model="classform" :rules="rules" label-width="80px">
                <el-form-item label="班次名称" prop="name">
                    <el-input v-model="classform.name"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-time-picker v-model="starttime" :disabled="isdisabled" value-format="HH:mm" format="HH:mm" placeholder="开始时间"></el-time-picker>

                </el-form-item>
                <el-form-item label="结束时间">
                    <el-time-picker v-model="endtime" value-format="HH:mm" format="HH:mm" placeholder="结束时间"></el-time-picker>
                </el-form-item> 
            </el-form>
            <div slot="footer">
                <el-button size="small" type="text"  @click="isTime = false">取消</el-button> 
                <el-button size="small" type="primary"  @click="saveRule('classform')">确定</el-button>                        
            </div> 
        </el-dialog> 
    </div>
</el-card>   
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import store from 'src/store'
    
    export default {
        data() {
            return {
                classform:{},
                isTime:false,
                isdisabled:false,
                model:false,
                starttime:"",
                endtime:"",
                dataList:[],
                classList:[],
                rules:{
                    name:[{ required: true, message: '请输入班次名称', trigger: 'blur' }],
                }
            }
        },
        methods: {
            addTime(){
                this.isTime = true
                this.classform.name = ""
                if(this.dataList.length){
                  this.isdisabled = true
                  this.starttime = this.dataList[this.dataList.length-1].end
                }else{
                  this.starttime = ""
                  this.isdisabled = false
                }
                this.endtime = ""
            },
            saveRule(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let me = this,
                        rdata = {};
                        if(me.starttime&&me.endtime){
                            me.classform.start = me.starttime
                            me.classform.end = me.endtime
                            rdata.name = me.classform.name;
                            rdata.start = me.classform.start;
                            rdata.end = me.classform.end;
                            me.dataList.push(rdata)
                            me.isTime = false    
                        }else{
                            me.$message.error('请选择时间！')
                        }
                    } else {
                        this.$message.error('保存失败！')
                    }
                });
            },
            handleSubmit(){
                let me = this
                if(me.dataList.length){
                    api.logs.addClass(JSON.stringify(me.dataList)).then((res)=>{
                        if(res.data.status==0){
                            me.$message.success('添加成功')
                            me.getclassList()
                            me.backup()
                        }else{
                            me.$message.error(res.data.msg)
                        }
                    }) 
                }else{
                    me.$message.error('请添加班次后再保存！')
                }
            },
            backup(){
                this.model = false
                this.dataList = []
            },
            sureDelete(row){
                let me = this
                me.$confirm('此操作将会清除所有班次，是否全部删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.logs.delClass().then(function(res) {
                        if(res.data.status === 0){
                            me.$message.success('删除成功')
                            me.getclassList()
                        }else{
                            me.$message.error(res.data.msg)
                        }
                    })
                }).catch(() => {
                    me.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });          
                });
            },
            getclassList(){
                let me = this
                api.logs.getClass().then((res)=>{
                    if(res.data.status == 0){
                        me.classList = res.data.data
                    }else{
                        me.$message.error(res.data.msg)
                    }
                })
            }
        },
        mounted() {
            this.getclassList()
        },
        created() {
        },
        watch: {
            '$route': 'fetchData',
        }        
    }

</script>
