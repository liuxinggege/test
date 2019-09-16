<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="回归列表"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">VIP系统配置</span>
            </el-col>
            <div class="box">
                <el-button type="primary" @click="f5" style="margin:10px">刷新</el-button>
                <br>
                <span>税收线</span>
                <el-input style="width:200px; margin:0 10px" v-model="taxLine" placeholder="请输入税收线"></el-input>
                <el-button type="primary" @click="changeTaxLine" style="margin:10px">修改税收线</el-button>
                <br>
                <span>微信客服数量警报线</span>
                <el-input style="width:200px; margin:0 10px" v-model="minServiceWxCount" placeholder="请输入微信客服数量警报线"></el-input>
                <el-button type="primary" @click="changeServiceWxCount" style="margin:10px">修改微信客服数量警报线</el-button>
                <br>
                <span>微信客服分配玩家数量</span>
                <el-input style="width:200px; margin:0 10px" v-model="vipCountPerService" placeholder="请输入微信客服分配玩家数量"></el-input>
                <el-button type="primary" @click="changeVipCountPerService" style="margin:10px">修改客服分配玩家数量</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {    getTaxLine,
    updateTaxLine,
    getServiceWxLine,
    updateServiceWxLine,
    updateVipCountPerService,
    getVipCountPerService} from "../../api/admin/VIPManager/VIPManager"
import { reject } from 'q';
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RegressionList extends Vue {
    taxLine: number = null;
    minServiceWxCount: number = null;
    vipCountPerService: number = null;
    created() {
        this.loadData();
    }
    f5() {
        this.loadData();
    }
    loadData() {
        //税收线
        getTaxLine().then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "加载成功，谢谢光临"
                })
                this.taxLine = res.data.msg.taxLine;
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
        //微信客服数量警报线
        getServiceWxLine().then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "加载成功，谢谢光临"
                })
                this.minServiceWxCount = res.data.msg.minServiceWxCount;
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
        //微信客服分配玩家数量
        getVipCountPerService().then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "加载成功，谢谢光临"
                })
                this.vipCountPerService = res.data.msg.vipCountPerService;
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
    }
    //税收线
    changeTaxLine() {
        this.$confirm('是否继续修改税收线?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            updateTaxLine({ taxLine: this.taxLine }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: "修改成功,请刷新一遍确认哦，亲"
                    })
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });
        });
    }
    //微信客服数量警报线
    //判断数字
    ifNmuber(num) {
        if (!(Math.floor(num) == num && num >= 0)) {
            this.$message({
                type: "error",
                message: "你输入的客服微信数量有误"
            })
            return true
        } else {
            return false
        }
    }
    changeServiceWxCount() {
        this.$confirm('是否继续修改微信客服数量警报线?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (this.ifNmuber(this.minServiceWxCount)) {
                return
            }
            updateServiceWxLine({ minServiceWxCount: this.minServiceWxCount }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: "修改成功,请刷新一遍确认哦，亲"
                    })
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });
        });
    }
    //微信客服分配玩家数量
    changeVipCountPerService() {
        this.$confirm('是否继续修改微信客服分配数量?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (this.ifNmuber(this.vipCountPerService)) {
                return
            }
            updateVipCountPerService({ vipCountPerService: this.vipCountPerService }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: "修改成功,请刷新一遍确认哦，亲"
                    })
                }
            }).catch(err => {
                this.$message({
                    type: "error",
                    message: err
                })
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
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
</style>