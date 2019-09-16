<style>
.list-title {
    background-color: #e9eaec;
    padding: 10px 0;
    font-weight: 600;
    text-indent: 15px;
    overflow: hidden;
}
.action_button{
    color:rgb(32,160,255);
    cursor: pointer;
    margin-right: 5px;
}
</style>
<template>
    <el-card>
        <p slot="header">
            <span class="fa fa-cog"> 区域配置</span>
             <el-button type="primary" size="mini" style="margin-left:30px;" icon="el-icon-plus" @click="addupArea(-1)">添加区域</el-button>
             <el-button type="primary" size="mini" style="margin-left:10px;" icon="el-icon-setting"  @click="setmaxAllow">设置上限</el-button>
             <label style="margin-left: 10px;">最大允许下井人数：{{allArea.max_allow}}(人)</label>
             <label style="margin-left: 10px;">最大允许下井时长：{{allArea.max_time}}(分钟)</label>
             <label style="margin-left: 10px;">井下人员失联时长：{{allArea.worker_timeout}}(分钟)</label>
        </p>
        <el-table :data="dataList"   @row-click="clickRow"  height="400" stripe  border>
            <el-table-column prop="areaname" label="区域名称"></el-table-column>
            <el-table-column prop="max_allow" label="最大允许人数(人)"></el-table-column>
            <el-table-column prop="max_time" label="最大允许时长(分钟)"></el-table-column>
            <el-table-column label="出入口">
                <template scope="scope">
                    <el-tag size="mini" :type="scope.row.is_exit ==1 ? 'danger' : 'success'" close-transition>{{scope.row.is_exit ==1?'是':'否'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="区域属性">
                    <template scope="scope">
                        {{scope.row.default_allow ==1?'非限制区域':'限制区域'}}/{{scope.row.emphasis ==1?'非重点区域':'重点区域'}}
                    </template>
            </el-table-column>
            <el-table-column prop="remark" label="区域说明"></el-table-column>
            <el-table-column label="读卡器">
                    <template scope="scope">
                        {{check(scope.row.cardreders)}}
                    </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                    <template scope="scope">
                        <span class="action_button" @click.stop="delArea(scope.row.id)" type="text" size="small">删除</span>
                        <span class="action_button" @click.stop="addupArea(scope.row)" type="text" size="small">修改</span>
                    </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="space-between" class="code-row-bg" v-show="isCompose">
            <el-col :span="9">
                <p class="list-title">区域组成</p>
                <el-table :data="showcardreders"  height="250" border stripe>
                    <el-table-column prop="addr" label="读卡器地址"></el-table-column>
                    <el-table-column prop="subname" label="网关IP"></el-table-column>
                    <el-table-column prop="position" label="读卡器名称"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="6">
                <p class="list-title">{{roll}}</p>
                <el-table :data="showworkers"  height="250" border stripe>
                    <el-table-column prop="rfcard_id" label="卡号"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="9"></el-col>
        </el-row>
        <div v-if="dialog1">
            <el-dialog :visible.sync="dialog1" title="添加/修改区域配置" width="600px" :append-to-body="true" :close-on-click-modal="false">
                <add-person-area :formInline="formInline" @backup="backup"></add-person-area>
            </el-dialog>
        </div>
        <div v-if="dialog2">
            <el-dialog :visible.sync="dialog2" title="设置下井最大人数" width="400px" :append-to-body="true" :close-on-click-modal="false">
                <el-form ref="limitForm" :model="limitForm" >
                    <el-form-item label="最大允许下井人数(人数)">
                        <el-input-number size="mini" :min="0" v-model="limitForm.max_allow" style="width:150px"></el-input-number>
                    </el-form-item>
                    <el-form-item label="最大允许下井时长(分钟)">
                        <el-input-number size="mini" :min="0" v-model="limitForm.max_time" style="width:150px"></el-input-number>
                    </el-form-item>
                    <el-form-item label="井下人员失联时长(分钟)">
                        <el-input-number size="mini" :min="0" v-model="limitForm.worker_timeout" style="width:150px"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button  size="mini" @click="dialog2 = false">关闭</el-button>
                    <el-button type="primary" size="mini" @click="oksubmit">确定</el-button>
                </div>
            </el-dialog>
        </div>
</el-card>
</template>

<script>
    import api from 'src/api';
    import addPersonArea from "./../../business_bar/addPersonArea.vue";
    export default {
        components: {
            addPersonArea
        },
        mounted() {},
        data() {
            return {
                dialog1: false,
                dialog2:false,
                isCompose:false,
                allArea:{},
                limitForm:{},
                formInline: {},
                roll:'白名单',
                showcardreders:[],
                showworkers:[],
                dataList: []
            }
        },
        created() {
            this.getAreaMaxPeopleNum();
            this.initArea();
        },
        methods: {
            addupArea(row){
                if(row==-1){
                    this.formInline = {
                        max_time:0,
                        max_allow:0,
                        workers:[]
                    }
                }else{
                    this.formInline = row
                }
                this.dialog1 = true
            },
            changeAstrict(val){
                if(val==1) this.roll = '黑名单'
                if(val==2) this.roll = '白名单'
            },
            setmaxAllow(){
                this.dialog2 = true
                this.limitForm= {}
                this.limitForm.id = this.allArea.id
                this.limitForm.max_allow = this.allArea.max_allow
                this.limitForm.max_time = this.allArea.max_time
                this.limitForm.worker_timeout = this.allArea.worker_timeout
            },
            oksubmit(){
                api.routeLine.updateDefaultArea(this.limitForm).then(res => {
                        if(res.data.status==0){
                           this.getAreaMaxPeopleNum()
                           this.$message({type: 'success',message: '操作成功!'});
                       }
                })
            },
            check(arr){
                return arr.map((item) => {
                    return item.addr
                }).join(",")
            },

            //删除区域
            delArea(id){
                let me = this
                   me.$confirm('是否删除该区域', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      me.$message({
                        type: 'success',
                        message: '操作成功，已经删除!'
                      });
                       api.routeLine.delArea(id).then(function(res) {
                            if(res.data.status === 0){
                                  me.initArea()
                              }

                    })
                    }).catch(() => {
                      me.$message({
                        type: 'warning',
                        message: '操作已取消'
                      });
                    });
            },
            backup(){
                this.initArea();
                this.dialog1 = false;
            },
            clickRow(row) {
                this.isCompose = true
                this.formInline = row;
                this.showcardreders = row.cardreders;
                this.showworkers = row.workers;
                this.changeAstrict(row.default_allow);
            },
            initArea(){
                api.routeLine.getAllarea().then(res => {
                    console.log(res)
                    if (res.data.status === 0) {
                        this.dataList = res.data.data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            getAreaMaxPeopleNum(){
                api.routeLine.getDefaultArea().then(res => {
                    this.allArea = res.data.data
                    this.dialog2 = false;
                })
            }
        }
    }

</script>
