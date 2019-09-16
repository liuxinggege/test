<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="结算审核"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">渠道结算管理</span>
            </el-col>
            <div class="box">
                <span>月份</span>
                <el-date-picker @change="changeMonth" v-model="month" type="month" placeholder="选择月"></el-date-picker>
                <span>渠道</span>
                <el-select v-model="channel" placeholder="请选择" style="margin:0 10px;">
                    <el-option v-for="item in balanceMgr.channelList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <el-button type="primary" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
            </div>
            <!--列表-->
            <el-table :data="balanceMgr.balanceMgrData" border highlight-current-row style="width: 99%;" max-height="600">
                <el-table-column prop="localSumDate" label="时间" min-width="220" align="center" :formatter="submitTimeFunc"/>
                <el-table-column prop="channel" label="渠道" min-width="175" align="center"/>
                <el-table-column prop="gameTax" label="总游戏税收" min-width="175" align="center"/>
                <el-table-column prop="discountGameTax" label="扣后税收" width="100" align="center"/>
                <el-table-column prop="payableAmt" label="可结算金额" width="150" align="center"/>
                <el-table-column prop="rate" label="扣量比例" width="200" align="center"/>
                <el-table-column prop="jinhuaTax" label="金花税收" width="170" align="center"/>
                <el-table-column prop="niuniuTax" label="牛牛税收" width="150" align="center"/>
                <el-table-column prop="suohaTax" label="梭哈税收" min-width="150" align="center"/>
                <el-table-column prop="brniuniuTax" label="百人牛牛税收" min-width="150" align="center"/>
                <el-table-column prop="xuezhanTax" label="麻将税收" min-width="150" align="center"/>
                <el-table-column prop="hongheiTax" label="红黑税收" min-width="150" align="center"/>
                <el-table-column prop="longhuTax" label="龙虎斗税收" min-width="150" align="center"/>
                <el-table-column prop="doudizhuTax" label="斗地主税收" min-width="150" align="center"/>
                <el-table-column prop="dezhoupukeTax" label="德州扑克税收" min-width="150" align="center"/>
                <el-table-column prop="qianghongbaoTax" label="抢红包税收" min-width="150" align="center"/>
                <el-table-column prop="erbagangTax" label="二八杠税收" min-width="150" align="center"/>
                <el-table-column prop="duofuduocaiTax" label="多福多财税收" min-width="150" align="center"/>
                <el-table-column prop="buyuTax" label="捕鱼税收" min-width="150" align="center"/>
                <el-table-column prop="jdniuniuTax" label="经典牛牛税收" min-width="150" align="center"/>
                <el-table-column prop="paodekuaiTax" label="跑得快税收" min-width="150" align="center"/>
                <el-table-column prop="ermjTax" label="二人麻将税收" min-width="150" align="center"/>
                <el-table-column v-if="month.getFullYear()===2018&&month.getMonth()===6" prop="wcgTax" label="世界杯税收" min-width="150" align="center"/>
                <el-table-column prop="newUserCount" label="注册" min-width="150" align="center"/>
                <el-table-column prop="regAndBindUserCount" label="注册绑定" min-width="150" align="center"/>
                <el-table-column prop="newUserChargeUserCount" label="新充值人数" min-width="150" align="center"/>
                <el-table-column prop="newUserChargeAmt" label="新充值金额" min-width="150" align="center"/>
                <el-table-column prop="totalProfit" label="营收" min-width="150" align="center"/>
                <el-table-column prop="totalWithdrawAmt" label="提现" min-width="150" align="center"/>
                <el-table-column prop="totalChargeAmt" label="总充值" min-width="150" align="center"/>
            </el-table>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch, getYearMonthDay } from "../../utils/index";
import { BalanceMgrState } from "../../store/stateInterface";

interface QueryItem {
    channel: string;
    month: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class BalanceMgr extends Vue {
    now = new Date();
    month: Date = new Date(this.now.getFullYear(), this.now.getMonth() - 1);
    channel: string = "";
    balanceMgr: BalanceMgrState = this.$store.state.balanceMgr;
    //生命周期钩子函数
    created() {
        this.loadChannelList();
    }

    //初始化数据
    loadData() {
        let queryItem: QueryItem = this.getQueryItem();
        if (!this.channel) {
            this.$message({
                type: "warning",
                message: `此条件该月暂无渠道`
            });
            return;
        }
        myDispatch(this.$store, "GetBalanceDeatile", queryItem).then(
            () => { }
        );
    }

    changeMonth() {
        this.loadChannelList();
    }
    changePid() {
        this.loadChannelList();
    }
    loadChannelList() {
        myDispatch(
            this.$store,
            "GetChannelList",
            { month: this.month }
        ).then(() => {
            if (this.balanceMgr.getCode === 200) {
                if (!this.balanceMgr.channelList.length) {
                    this.$message({
                        type: "warning",
                        message: `此条件该月暂无渠道`
                    });
                    return;
                }
                this.channel = this.balanceMgr.channelList[0];
                this.loadData();
            }
        });
    }

    getQueryItem() {
        let tmp: QueryItem = {
            channel: this.channel,
            month: this.month
        };
        return tmp;
    }

    submitTimeFunc(row, column) {
        if (row.localSumDate) {
            let date = new Date(row.localSumDate);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return getYearMonthDay(sdate);
        } else {
            return "总计";
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
    font-size: 12pt;
    margin: 0 10px;
}
.input {
    width: 100px;
    margin: 20px 50px 20px 0;
}
.checkbox {
    margin: 20px 50px 10px 0;
}
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
.toolbar1 {
    padding: 5px;
    background-color: #f9fafc;
    border: 2px;
    display: block;
    margin: 0;
}
.toolbar2 {
    padding: 30px;
    background-color: #f9fafc;
    border: 2px;
    margin: 0;
}
.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}
</style>
