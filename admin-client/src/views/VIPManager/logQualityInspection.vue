<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="日志质检"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">日志质检</span>
            </el-col>
            <div class="box">
                <br>
                <span>玩家ID</span>
                <el-input style="width:200px; margin:0 10px" v-model="userId" placeholder="请输入玩家ID"></el-input>
                <span>记录人</span>
                <el-input style="width:200px; margin:0 10px" v-model="recordId" placeholder="请输入记录人"></el-input>
                <span>记录时间</span>
                <el-date-picker v-model="recordTime" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <el-button type="primary" @click="SearchData" style="margin:10px">搜索</el-button>
                <el-button type="success" @click="ExcelData" style="margin:10px">导出excel</el-button>
                <el-table :data="logDataList" v-loading="loading" highlight-current-row border style="width: 100%">
                    <el-table-column prop="uid" align="center" label="玩家ID"></el-table-column>
                    <el-table-column prop="opt" align="center" label="记录人"></el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="logTime" label="记录时间"></el-table-column>
                    <el-table-column prop="logContent" label="日志内容"></el-table-column>
                </el-table>
                <el-pagination layout="total,sizes,prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {
    getVipLogMsg,
    exportVipLogExcel
} from "../../api/admin/VIPManager/VIPManager"
import { DataDef } from 'vue/types/options';

interface QueryItem {
    uid?: number
    act?: string
    opt?: string
    startTime?: any
    endTime?: any
    page?: number
    count?: number
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RegressionList extends Vue {
    loading: boolean = false;

    userId: number = null; //玩家ID
    recordId: string = ""; //记录人
    recordTime: Array<string> = []; //登陆时间
    page: number = 1; //当前页数
    count: number = 10; //当前条数
    totalCount: number = 0; //数据条数

    logDataList: Array<any> = []; //列表数据

    created() {

    }
    GetData() {
        let queryItem: QueryItem = {
            uid: this.userId ? this.userId : null,
            opt: this.recordId,
            startTime: this.recordTime && this.recordTime.length == 2 ? this.recordTime[0] : null,
            endTime: this.recordTime && this.recordTime.length == 2 ? this.recordTime[1] : null,
            page: this.page,
            count: this.count
        }
        return queryItem;
    }
    GetExcelData() {
        let queryItem: QueryItem = {
            uid: this.userId ? this.userId : null,
            opt: this.recordId,
            startTime: this.recordTime && this.recordTime.length == 2 ? this.recordTime[0] : null,
            endTime: this.recordTime && this.recordTime.length == 2 ? this.recordTime[1] : null,
        }
        return queryItem;
    }
    //加载
    loadData() {
        this.loading = true;
        let queryItem = this.GetData()
        getVipLogMsg(queryItem).then(res => {
            if (res.data.code == 200) {
                this.logDataList = res.data.msg.message;
                this.totalCount = res.data.msg.logCount.msg;
                this.$message({
                    type: "success",
                    message: "搜索成功"
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
    //搜索
    SearchData() {
        this.page = 1;
        this.count = 10;
        this.loadData();
    }
    ExcelData() {
        let queryItem = this.GetExcelData()
        exportVipLogExcel(queryItem).then(res => {
            if (res.data.code == 200) {
                this.$message({
                    type: "success",
                    message: "导出成功"
                })
            }
        }).catch(err => {
            this.$message({
                type: "error",
                message: err
            })
        })
    }
    //当前页回调
    handleCurrentChange(val) {
        this.page = val;
        this.loadData()
    }
    //当前条数回调
    handleSizeChange(val) {
        this.count = val;
        this.loadData()
    }
    //时间格式
    localeSumDateFormatter(row, index) {
        let date = new Date(row.logTime);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
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