<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="VIP配置"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">VIP配置</span>
            </el-col>
            <div class="box">
                <br>
                <el-button type="primary" @click="add" style="margin:10px">添加</el-button>
                <el-button type="primary" @click="refresh" style="margin:10px">刷新</el-button>
                <el-table :data="vipConfigData" v-loading="loading" border style="width: 100%">
                    <el-table-column :formatter="pidFormatter" align="center" prop="pid" label="平台"></el-table-column>
                    <el-table-column align="center" prop="condition" label="总充值 Or 单日充值">
                        <template slot-scope="scope">
                            <span>{{scope.row.condition.totalRcg || 0}}</span>
                            <span>Or</span>
                            <span>{{scope.row.condition.oneDayRcg || 0}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="state" label="状态">
                        <template slot-scope="scope">
                            <el-checkbox :disabled="true" v-model="scope.row.state"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="handleRemove(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog class="dilogTitle" title="添加配置" :visible.sync="centerDialogVisible" width="30%" center>
                    <div class="dialog_content">
                        <span>平台 ：</span>
                        <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
                            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                        </el-select>
                    </div>
                    <div class="dialog_content">
                        <el-row>
                            <el-col :span="9">
                                <span>达成条件 ：</span>
                            </el-col>
                            <el-col :span="15">
                                <span>总充值 ：</span>
                                <el-input style="width:160px; margin:0 10px" v-model="totalRecharge"></el-input>
                                <dir>or</dir>
                                <span>单日充值 ：</span>
                                <el-input style="width:160px; margin:0 10px" v-model="oneRecharge"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="margin:10px 0 0 90px">
                        <span>状态 ：</span>
                        <el-checkbox v-model="VipCode"></el-checkbox>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="back">取 消</el-button>
                        <el-button type="primary" @click="addSure">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog class="dilogTitle" title="编辑配置" :visible.sync="editDialogVisible" width="30%" center>
                    <div class="dialog_content">
                        <span>平台 ：</span>
                        <el-select :disabled="true" v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
                            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                        </el-select>
                    </div>
                    <div class="dialog_content">
                        <el-row>
                            <el-col :span="9">
                                <span>达成条件 ：</span>
                            </el-col>
                            <el-col :span="15">
                                <span>总充值 ：</span>
                                <el-input style="width:160px; margin:0 10px" v-model="totalRecharge"></el-input>
                                <dir>or</dir>
                                <span>单日充值 ：</span>
                                <el-input style="width:160px; margin:0 10px" v-model="oneRecharge"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="margin:10px 0 0 90px">
                        <span>状态 ：</span>
                        <el-checkbox v-model="VipCode"></el-checkbox>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="back">取 消</el-button>
                        <el-button type="primary" @click="editSure">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from "vue-class-component";
import { ArrayPropsDefinition } from 'vue/types/options';
import {
    getVipCfg,
    addOneVipCfg,
    updateVipCfg,
    deleteVipCfgByid
} from '../../api/admin/VIPManager/VIPManager';

interface QueryItem {
    pid?: string
    state?: Boolean
    condition: {
        totalRcg?: number
        oneDayRcg?: number
    }
    vipLevel?: number
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class VIPConfig extends Vue {
    loading: boolean = true;
    centerDialogVisible: boolean = false; //弹框状态
    editDialogVisible: boolean = false; //编辑弹窗状态
    VipCode: boolean = false; // vip配置状态

    totalRecharge: number = null; //总充值
    oneRecharge: number = null; //单日充值
    pid: string = "A"; //平台
    pidList: { pid: string, name: string }[]; //平台数组
    queryItem: any = "";

    vipConfigData: Array<string> = []; //vip列表数据
    created() {
        this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
        this.loadData();
    }
    loadData() {
        this.loading = true;
        getVipCfg().then(res => {
            if (res.data.code == 200) {
                this.vipConfigData = res.data.msg
                this.$message({
                    type: "success",
                    message: "加载成功"
                })
                this.loading = false;
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
            this.loading = false;
        })
    }
    initInput(pid, state, totalRcg, oneDayRcg) {
        this.pid = pid;
        this.VipCode = state;
        this.totalRecharge = totalRcg;
        this.oneRecharge = oneDayRcg;
    }
    initQueryItem() {
        let data: QueryItem = {
            pid: this.pid,
            state: this.VipCode,
            condition: {
                totalRcg: this.totalRecharge ? this.totalRecharge : null,
                oneDayRcg: this.oneRecharge ? this.oneRecharge : null
            }
        }
        this.queryItem = data;
    }
    //添加
    add() {
        this.initInput("A", false, null, null);
        this.centerDialogVisible = true;
    }
    //刷新
    refresh() {
        this.loadData();
    }
    //编辑
    handleEdit(row) {
        this.initInput(row.pid, row.state, row.condition.totalRcg, row.condition.oneDayRcg);
        this.editDialogVisible = true;
    }
    //编辑添加VIP配置
    addSure() {
        this.initQueryItem();
        this.$confirm('此操作将增添Vip配置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            addOneVipCfg(this.queryItem).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.loadData();

                }
                this.centerDialogVisible = false;
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消添加'
            });
        });
    }
    editSure() {
        this.initQueryItem();
        this.$confirm('此操作将更改Vip配置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            updateVipCfg(this.queryItem).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '编辑成功!'
                    });
                    this.loadData();

                }
                this.editDialogVisible = false;
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消编辑'
            });
        });
    }
    pidFormatter(row) {
        let name;
        this.pidList.forEach(el => {
            if (el.pid == row.pid) {
                name = el.name
            }
        })
        return name
    }
    back() {
        this.centerDialogVisible = false;
        this.editDialogVisible = false;
    }
    //删除
    handleRemove(row) {
        this.$confirm('此操作将删除这一配置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteVipCfgByid({
                id: row._id
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.loadData();

                }
                this.editDialogVisible = false;
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }
}
</script>


<style rel="stylesheet/scss" lang="scss">
.dashboard {
    &-outer {
        margin: 30px;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 25px;
        // margin-top: 80px;
    }
    &-second {
        margin-top: 25px;
        position: relative;
    }
}
.title {
    margin: 10px 0 0 10px;
    font-family: Fantasy;
    color: #a0a0a0;
}
.dilogTitle .el-dialog__header {
    background-color: #ccc;
    border-bottom: 1px solid black;
}
.dialog_content {
    text-align: center;
    margin: 10px 0;
}
</style>