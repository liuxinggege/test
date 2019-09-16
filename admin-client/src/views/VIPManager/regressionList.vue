<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="回归列表"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">回归列表</span>
            </el-col>
            <div class="box">
                <br>
                <span>客服微信</span>
                <el-input style="width:200px; margin:0 10px" v-model="severWeiXin" placeholder="请输入客服微信"></el-input>
                <span>微信号</span>
                <el-input style="width:200px; margin:0 10px" v-model="userWeiXin" placeholder="请输入微信号"></el-input>
                <span>登陆时间</span>
                <el-date-picker v-model="loginTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <span>回归时间</span>
                <el-date-picker v-model="backTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <span>结束时间</span>
                <el-date-picker v-model="overTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                <el-button type="primary" @click="SearchData" style="margin:10px">搜索</el-button>
                <el-table :data="vipReturnModel" v-loading="loading" highlight-current-row border style="width: 100%">
                    <el-table-column :formatter="pidFormatter" align="center" prop="pid" label="平台"></el-table-column>
                    <el-table-column align="center" style="color: blue" prop="serviceWx" label="客服微信"></el-table-column>
                    <el-table-column align="center" prop="uid" label="玩家ID"></el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="lastLoginTime" label="最后登录时间"></el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="vipReturnTime" label="回归时间"></el-table-column>
                    <el-table-column :formatter="localeSumDateFormatter" align="center" prop="statEndTime" label="统计结束时间(30天)"></el-table-column>
                    <el-table-column align="center" prop="recharge" label="统计周期内充值"></el-table-column>
                    <el-table-column align="center" prop="tax" label="统计周期内税收"></el-table-column>
                    <el-table-column align="center" prop="winLose" label="统计周期内输赢">
                        <template slot-scope="scope">
                            <span v-if="scope.row.winLose >= 0">{{scope.row.winLose}}</span>
                            <span v-else class="red">{{scope.row.winLose}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="total,sizes,prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import { vipReturnList } from "../../api/admin/VIPManager/VIPManager"

interface QueryItem {
    serviceWx?: string
    wx?: string
    lastLoginTimeStart?: any
    lastLoginTimeEnd?: any
    vipReturnTimeStart?: any
    vipReturnTimeEnd?: any
    statTimeStart?: any
    statTimeEnd?: any
    page?: number
    count?: number
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RegressionList extends Vue {
    loading: boolean = true;

    severWeiXin: string = ""; //客服微信
    userWeiXin: string = ""; //微信号
    page: number = 1; //当前页数
    count: number = 10; //当前条数
    totalCount: number = 0; //数据条数
    loginTime: Array<string> = []; //登陆时间
    backTime: Array<string> = []; //回归时间
    overTime: Array<string> = []; //结束时间

    pidList: { pid: string, name: string }[]; //平台数组

    queryItem: QueryItem = {
        serviceWx: this.severWeiXin,
        wx: this.userWeiXin,
        lastLoginTimeStart: this.loginTime && this.loginTime.length == 2 ? this.loginTime[0] : null,
        lastLoginTimeEnd: this.loginTime && this.loginTime.length == 2 ? this.loginTime[1] : null,
        vipReturnTimeStart: this.backTime && this.backTime.length == 2 ? this.backTime[0] : null,
        vipReturnTimeEnd: this.backTime && this.backTime.length == 2 ? this.backTime[1] : null,
        statTimeStart: this.overTime && this.overTime.length == 2 ? this.overTime[0] : null,
        statTimeEnd: this.overTime && this.overTime.length == 2 ? this.overTime[1] : null,
        page: this.page,
        count: this.count
    }
    vipReturnModel: Array<any> = [];

    created() {
        this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
        this.loadData();
    }
    loadData() {
        this.loading = true;
        vipReturnList(this.queryItem).then(res => {
            if (res.data.code == 200) {
                this.vipReturnModel = res.data.msg.data;
                this.totalCount = res.data.msg.totalCount;
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
    SearchData() {
        this.page = 1;
        this.count = 10;
        this.loadData();
    }
    //当前页回调
    handleCurrentChange(val) {
        this.page = val;
        this.loadData();
    }
    //当前条数回调
    handleSizeChange(val) {
        this.count = val;
        this.loadData();
    }
    //时间格式
    initData(row) {
        if (row) {
            let date = new Date(row);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate
        }
    }
    localeSumDateFormatter(row, column, index) {
        let sdate;
        switch (column.label) {
            case "最后登录时间": sdate = this.initData(row.lastLoginTime); break;
            case "回归时间": sdate = this.initData(row.vipReturnTime); break;
            case "统计结束时间(30天)": sdate = this.initData(row.statEndTime); break;
        }
        return sdate;
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
.red {
    color: red;
}
</style>