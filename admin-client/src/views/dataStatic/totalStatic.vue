<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="统计总汇"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">统计总汇</span>
            </el-col>
            <!--工具条-->
            <span class="content_font"></span>
            <span>时间范围</span>
            <el-date-picker v-model="logTime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:5px 20px 5px 10px" type="daterange" placeholder="选择时间范围"></el-date-picker>
            <el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">按日统计</el-button>
            <el-button type="success" @click="downloadExcel" style="margin:0px 0px 10px 50px">导出excel</el-button>
            <!--列表-->
            <el-table :data="totalStatic.transferData" border highlight-current-row style="width: 100%;" max-height="600">
                <el-table-column prop="localeSumDate" label="统计时间" fixed width="150" :formatter="sumDateFunc" align="center"></el-table-column>
                <el-table-column prop="logDate" label="日志时间" width="150" :formatter="logDateFunc" align="center"></el-table-column>
                <el-table-column prop="totalProfit" label="总营收" width="100" align="center"></el-table-column>
                <el-table-column prop="totalChargeAmt" label="总充值金额" min-width="150" align="center"></el-table-column>
                <el-table-column prop="totalWithdrawAmt" label="总兑换金额" width="120" align="center"></el-table-column>
                <el-table-column prop="totalTax" label="总税收" width="120" align="center"></el-table-column>
                <el-table-column prop="totalWithdrawTax" label="兑换税收" width="120" align="center"></el-table-column>
                <el-table-column prop="totalWithdrawUserCount" label="(游戏)兑换人数" width="120" align="center"></el-table-column>
                <el-table-column prop="agencySettleAmt" label="(全民代理)兑换金额" width="90" align="center"></el-table-column>
                <el-table-column prop="agencySettleActCount" label="(全民代理)兑换人数" width="90" align="center"></el-table-column>
                <el-table-column prop="onlineChargeAmt" label="在线充值金额" width="120" align="center"></el-table-column>
                <el-table-column prop="agentChargeAmt" label="代理充值金额" min-width="120" align="center"></el-table-column>
                <el-table-column prop="gameTax" label="游戏税收" min-width="100" align="center"></el-table-column>
                <el-table-column prop="loginUserCount" label="登陆用户" width="120" align="center"></el-table-column>
                <el-table-column prop="newUserCount" label="新用户数" width="120" align="center"></el-table-column>
                <el-table-column prop="oldUserLoginUserCount" label="老用户登陆数" width="120" align="center"></el-table-column>
                <el-table-column prop="bindUserCount" label="绑定用户数" width="120" align="center"></el-table-column>
                <el-table-column prop="bindRate" label="绑定率" width="120" align="center"></el-table-column>
                <el-table-column prop="totalChargeUserCount" label="总充值人数" width="120" align="center"></el-table-column>
                <el-table-column prop="payRate" label="付费率" width="120" align="center"></el-table-column>
                <el-table-column prop="newUserPayRate" label="新增用户付费率" width="120" align="center"></el-table-column>
                <el-table-column prop="newUserChargeAmt" label="新增充值金额" width="120" align="center"></el-table-column>
                <el-table-column prop="newUserChargeUserCount" label="新增充值人数" width="120" align="center"></el-table-column>
                <el-table-column prop="oldUserChargeAmt" label="老用户充值金额" width="120" align="center"></el-table-column>
                <el-table-column prop="oldUserAvgChargeAmt" label="老用户平均充值" width="120" align="center"></el-table-column>
                <el-table-column prop="touristPresent" label="游客赠送" width="120" align="center"></el-table-column>
                <el-table-column prop="avgProfit" label="人均营收" width="120" align="center"></el-table-column>
                <el-table-column prop="avgChargeAmt" label="平均充值" width="120" align="center"></el-table-column>
                <el-table-column prop="newUserAvgChargeAmt" label="新增用户平均充值" width="150" align="center"></el-table-column>
                <el-table-column prop="systemEachDayWinAndLose" label="系统今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="suohaEachDayWinAndLose" label="梭哈今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="suohaTax" label="梭哈今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="jinhuaEachDayWinAndLose" label="金花今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="jinhuaTax" label="金花今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="niuniuEachDayWinAndLose" label="牛牛今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="niuniuTax" label="牛牛今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="brniuniuEachDayWinAndLose" label="百人牛牛今天输赢" width="160" align="center"></el-table-column>
                <el-table-column prop="brniuniuTax" label="百人牛牛今天税收" width="160" align="center"></el-table-column>
                <el-table-column prop="xuezhanEachDayWinAndLose" label="麻将今天输赢" width="160" align="center"></el-table-column>
                <el-table-column prop="xuezhanTax" label="麻将今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="doudizhuEachDayWinAndLose" label="斗地主今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="doudizhuTax" label="斗地主今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeEachDayWinAndLose" label="德州扑克今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeTax" label="德州扑克今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoEachDayWinAndLose" label="抢红包今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoTax" label="抢红包今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="erbagangEachDayWinAndLose" label="二八杠今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="erbagangTax" label="二八杠今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiEachDayWinAndLose" label="多福多财今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiTax" label="多福多财今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="hongheiEachDayWinAndLose" label="红黑今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="hongheiTax" label="红黑今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="ermjEachDayWinAndLose" label="二人麻将今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="ermjTax" label="二人麻将今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="longhuEachDayWinAndLose" label="龙虎斗今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="longhuTax" label="龙虎斗今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="buyuEachDayWinAndLose" label="捕鱼今天输赢" width="120" align="center"></el-table-column>
                <el-table-column prop="buyuTax" label="捕鱼今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="jdniuniuEachDayWinAndLose" label="经典牛牛今天输赢" width="160" align="center"></el-table-column>
                <el-table-column prop="jdniuniuTax" label="经典牛牛今天税收" width="160" align="center"></el-table-column>
                <el-table-column prop="paodekuaiEachDayWinAndLose" label="跑得快今天输赢" width="160" align="center"></el-table-column>
                <el-table-column prop="paodekuaiTax" label="跑得快今天税收" width="120" align="center"></el-table-column>
                <el-table-column prop="ltv7" label="ltv7" width="120" align="center"></el-table-column>
                <el-table-column prop="ltv14" label="ltv14" width="120" align="center"></el-table-column>
                <el-table-column prop="ltv30" label="ltv30" width="120" align="center"></el-table-column>
                <el-table-column prop="ltv60" label="ltv60" width="120" align="center"></el-table-column>
                <el-table-column prop="retentionDay2" label="2日留存" width="120" align="center"></el-table-column>
                <el-table-column prop="retentionDay3" label="3日留存" width="120" align="center"></el-table-column>
                <el-table-column prop="retentionDay7" label="7日留存" width="120" align="center"></el-table-column>
                <el-table-column prop="agencyTotalCharge" label="全民代理总充值" width="120" align="center"></el-table-column>
            </el-table>
            <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalStatic.totalCount"></el-pagination>
            </el-col>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { TotalStaticState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch, getYearMonthDay } from "../../utils/index.js";
//TotalStatic
interface QueryItem {
    // pid: string;
    startTime?: Date;
    endTime?: Date;
    page?: number;
    count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TotalStatic extends Vue {
    // lifecycle hook
    created() {
        // this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
        this.loadData(); //初始化-->加载数据
    }
    /*inital data*/
    totalStatic: TotalStaticState = this.$store.state.totalStatic; //表单数据

    // pidList: any[] = [];
    // pid: string = "A";

    logTime: Date[] = [];
    page: number = 1; //当前页
    count: number = 10;

    loadData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        myDispatch(this.$store, "GetTotalStatic", queryItem, true).then(() => { });
    }
    //获取查询条件
    getQueryItem() {
        let temp: QueryItem = {};
        if (this.logTime && this.logTime.length === 2) {
            temp.startTime = this.logTime[0];
            temp.endTime = this.logTime[1];
        }
        return temp;
    }

    getExportQueryItem() {
        let temp: QueryItem = {};
        if (this.logTime && this.logTime.length === 2) {
            temp.startTime = this.logTime[0];
            temp.endTime = this.logTime[1];
        }
        return temp;
    }

    sumDateFunc(row, column) {
        let date = new Date(row.sumDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });

        return getYearMonthDay(sdate);
    }
    logDateFunc(row, column) {
        let date = new Date(row.logDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }

    //页码变更
    handleCurrentChange(val) {
        this.page = val;
        this.loadData();
    }
    //每页显示数据量变更
    handleSizeChange(val) {
        this.count = val;
        this.loadData();
    }

    //导出excle
    downloadExcel() {
        const downloadExcelCfg = [
            { title: "统计时间", field: "localeSumDate", type: "Date" },
            { title: "日志时间", field: "logDate", type: "Date" },
            { title: "总营收", field: "totalProfit", type: "money" },
            { title: "总充值金额", field: "totalChargeAmt", type: "money" },
            { title: "总兑换金额", field: "totalWithdrawAmt", type: "money" },
            { title: "总税收", field: "totalTax", type: "money" },
            { title: "兑换税收", field: "totalWithdrawTax", type: "money" },
            { title: "代理兑换金额", field: "agencySettleAmt", type: "money" },
            {
                title: "(代理)兑换人数",
                field: "agencySettleActCount",
                type: "string"
            },
            {
                title: "(游戏)兑换人数",
                field: "totalWithdrawUserCount",
                type: "string"
            },
            { title: "在线充值金额", field: "onlineChargeAmt", type: "money" },
            { title: "代理充值金额", field: "agentChargeAmt", type: "money" },
            { title: "总游戏税收", field: "gameTax", type: "money" },
            { title: "老用户登陆统计", field: "loginUserCount", type: "string" },
            { title: "新用户数", field: "newUserCount", type: "string" },
            { title: "老用户登陆数", field: "oldUserLoginUserCount", type: "string" },
            { title: "绑定用户数", field: "bindUserCount", type: "string" },
            { title: "绑定率", field: "bindRate", type: "string" },
            { title: "总充值人数", field: "totalChargeUserCount", type: "string" },
            { title: "付费率", field: "payRate", type: "string" },
            { title: "新增用户付费率", field: "newUserPayRate", type: "string" },
            { title: "新增充值金额", field: "newUserChargeAmt", type: "money" },
            { title: "老用户充值金额", field: "oldUserChargeAmt", type: "money" },
            {
                title: "新增充值人数",
                field: "newUserChargeUserCount",
                type: "string"
            },
            { title: "游客赠送", field: "touristPresent", type: "money" },
            { title: "人均营收", field: "avgProfit", type: "money" },
            { title: "平均充值", field: "avgChargeAmt", type: "money" },
            {
                title: "新增用户平均充值",
                field: "newUserAvgChargeAmt",
                type: "money"
            },
            {
                title: "系统今天输赢",
                field: "systemEachDayWinAndLose",
                type: "money"
            },
            {
                title: "金花今天输赢",
                field: "jinhuaEachDayWinAndLose",
                type: "money"
            },
            {
                title: "金花今天税收",
                field: "jinhuaTax",
                type: "money"
            },
            {
                title: "梭哈今天输赢",
                field: "suohaEachDayWinAndLose",
                type: "money"
            },
            {
                title: "梭哈今天税收",
                field: "suohaTax",
                type: "money"
            },
            {
                title: "牛牛今天输赢",
                field: "niuniuEachDayWinAndLose",
                type: "money"
            },
            {
                title: "牛牛今天税收",
                field: "niuniuTax",
                type: "money"
            },
            {
                title: "百人牛牛今天输赢",
                field: "brniuniuEachDayWinAndLose",
                type: "money"
            },
            {
                title: "百人牛牛今天税收",
                field: "brniuniuTax",
                type: "money"
            },
            {
                title: "麻将今天输赢",
                field: "xuezhanEachDayWinAndLose",
                type: "money"
            },
            {
                title: "麻将今天税收",
                field: "xuezhanTax",
                type: "money"
            },
            {
                title: "斗地主今天输赢",
                field: "doudizhuEachDayWinAndLose",
                type: "money"
            },
            {
                title: "斗地主今天税收",
                field: "doudizhuTax",
                type: "money"
            },
            {
                title: "德州扑克今天输赢",
                field: "dezhoupukeEachDayWinAndLose",
                type: "money"
            },
            {
                title: "德州扑克今天税收",
                field: "dezhoupukeTax",
                type: "money"
            },
            {
                title: "抢红包今天输赢",
                field: "qianghongbaoEachDayWinAndLose",
                type: "money"
            },
            {
                title: "抢红包今天税收",
                field: "qianghongbaoTax",
                type: "money"
            },
            {
                title: "二八杠今天输赢",
                field: "erbagangEachDayWinAndLose",
                type: "money"
            },
            {
                title: "二八杠今天税收",
                field: "erbagangTax",
                type: "money"
            },
            {
                title: "多福多财今天输赢",
                field: "duofuduocaiEachDayWinAndLose",
                type: "money"
            },
            {
                title: "多福多财今天税收",
                field: "duofuduocaiTax",
                type: "money"
            },
            {
                title: "红黑今天输赢",
                field: "hongheiEachDayWinAndLose",
                type: "money"
            },
            {
                title: "红黑今天税收",
                field: "hongheiTax",
                type: "money"
            },
            {
                title: "二人麻将今天输赢",
                field: "ermjEachDayWinAndLose",
                type: "money"
            },
            {
                title: "二人麻将今天税收",
                field: "ermjTax",
                type: "money"
            },
            {
                title: "龙虎斗今天输赢",
                field: "longhuEachDayWinAndLose",
                type: "money"
            },
            {
                title: "龙虎斗今天税收",
                field: "longhuTax",
                type: "money"
            },
            { title: "捕鱼今天输赢", field: "buyuEachDayWinAndLose", type: "money" },
            { title: "捕鱼今天税收", field: "buyuTax", type: "money" },

            {
                title: "经典牛牛今天输赢",
                field: "jdniuniuEachDayWinAndLose",
                type: "money"
            },
            {
                title: "经典牛牛今天税收",
                field: "jdniuniuTax",
                type: "money"
            },

            {
                title: "跑得快今天输赢",
                field: "paodekuaiEachDayWinAndLose",
                type: "money"
            },
            {
                title: "跑得快今天税收",
                field: "paodekuaiTax",
                type: "money"
            },
            { title: "ltv7", field: "ltv7", type: "money" },
            { title: "ltv14", field: "ltv14", type: "money" },
            { title: "ltv30", field: "ltv30", type: "money" },
            { title: "ltv60", field: "ltv60", type: "money" },
            { title: "2日留存", field: "retentionDay2", type: "string" },
            { title: "3日留存", field: "retentionDay3", type: "string" },
            { title: "7日留存", field: "retentionDay7", type: "string" },
            { title: "全民代理总充值", field: "agencyTotalCharge", type: "money" }
        ];
        let queryItem: QueryItem | undefined = this.getExportQueryItem();
        myDispatch(this.$store, "GetTotalStaticExcel", queryItem).then(ret => {
            downloadExcel(ret, this);
        });
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
    margin: 0px 0px;
}
.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}
</style>
