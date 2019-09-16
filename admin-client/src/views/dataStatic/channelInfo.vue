<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道统计"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">渠道统计</span>
            </el-col>
            <span class="content_font"></span>
            <span>项目</span>
            <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
                <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
            <span>渠道扣量</span>
            <el-select v-model="serachType" placeholder="请选择" style="margin:5px 20px 5px 10px;width:120px;">
                <el-option label="扣量前" :value="1"></el-option>
                <el-option label="扣量后" :value="0"></el-option>
            </el-select>
            <span>渠道账号</span>
            <el-input v-model="member" style="width:150px; margin:0 10px"></el-input>
            <el-date-picker v-model="valueTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSelf">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleStat">数据总计</el-button>
            <el-button class="filter-item" type="primary" @click="exportData">导出</el-button>
            <el-table :data="list" border highlight-current-row style="width: 100%;">
                <el-table-column width="200" prop="sumDate" fixed label="统计时间" min-width="80" align="center" :formatter="timeFormat1"/>
                <el-table-column width="130" prop="totalChargeAmt" label="总充值" min-width="80" align="center"/>
                <el-table-column width="130" prop="totalWithdrawAmt" label="总兑换" min-width="100" align="center"/>
                <el-table-column width="130" prop="totalProfit" label="营收金额" min-width="80" align="center"/>
                <el-table-column width="100" prop="profitRate" label="营收比" min-width="80" align="center"/>
                <el-table-column width="130" prop="gameTax" label="游戏税收" min-width="100" align="center"/>
                <el-table-column width="100" prop="newUserCount" label="新增用户" min-width="80" align="center"/>
                <el-table-column width="100" prop="bindUserCount" label="绑定用户" min-width="80" align="center"/>
                <el-table-column width="130" prop="newUserChargeAmt" label="新增充值" min-width="100" align="center"/>
                <el-table-column width="120" prop="androidNewUserCount" label="安卓新增用户" min-width="80" align="center"/>
                <el-table-column width="130" prop="androidNewUserChargeAmt" label="安卓新增充值" min-width="80" align="center"/>
                <el-table-column width="100" prop="iosNewUserCount" label="ios新增用户" min-width="80" align="center"/>
                <el-table-column width="130" prop="iosNewUserChargeAmt" label="ios新增充值" min-width="80" align="center"/>
                <el-table-column width="100" prop="totalChargeUserCount" label="总充值人数" min-width="80" align="center"/>
                <el-table-column width="130" prop="onlineChargeAmt" label="在线充值金额" min-width="80" align="center"/>
                <el-table-column width="130" prop="agentChargeRmbAmt" label="代理充值金额" min-width="80" align="center"/>
                <el-table-column width="130" prop="newUserChargeUserCount" label="新增充值人数" min-width="80" align="center"/>
            </el-table>
            <br>
            <!--工具条-->
            <el-col :span="48" class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50,100]" :page-size="count" :total="totalCount"></el-pagination>
            </el-col>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn, myDispatch } from "../../utils/index";
import { formUtil } from "../../utils/formatUtils";
import { getChannelStat } from "../../api/admin/dataStatic/channelInfo";
import { ChannelInfoState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { channelStatExcel } from "../../api/admin/dataStatic/channelInfo";

interface QueryItem {
    pid?: string;
    channel?: string;
    platform?: string;
    memberAct?: string;
    type?: string;
    page?: number;
    count?: number;
    startTime?: Date;
    endTime?: Date;
    rateType?: number;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ChannelInfo extends Vue {
    //初始化数据
    channelInfo: ChannelInfoState = this.$store.state.channelInfo;
    page: number = 1; //当前页
    count: number = 10;
    totalCount: number = 0;

    logTime: Date[] = [];
    serachType: number = 0;
    // sortFlag: boolean = true;

    //子账号查询
    member: string = "";

    value: string = "全部";
    channels: any = ["全部"];
    valueTime: Date[] = [];
    list: any = [];
    type: string = "today";
    pidList: any[] = [];
    pid: string = "A";
    //函数
    //生命周期钩子函数
    created() {
        this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
        this.handleSelf();
    }
    exportData() {
        let temp: QueryItem = this.getQueryItem();
        channelStatExcel(temp).then(res => {
            if (res.data.code != 200) {
                this.$message.error(res.data.err);
                return;
            }
            this.$message.success("创建任务成功！");
        });
    }
    loadData() {
        this.list = [];
        if (!this.member) {
            this.$message({ message: "必须输入渠道账号", type: "info" });
            return;
        }
        let temp: QueryItem = this.getQueryItem();
        temp.page = this.page;
        temp.count = this.count;
        myDispatch(this.$store, "GetAllChannelsInfo", temp)
            .then(() => {
                if (this.channelInfo.code === 200) {
                    this.list = this.channelInfo.channelInfoData;
                    this.totalCount = this.channelInfo.totalCount;
                } else if (this.channelInfo.code !== 400) {
                    this.$message({ message: this.channelInfo.error, type: "error" });
                }
            })
            .catch(error => {
                this.$message({
                    message: error.message,
                    type: "error",
                    duration: 5 * 1000
                });
                return;
            });
    }

    // sort({ column, prop, order }) {
    //   if (!this.sortFlag) {
    //     return;
    //   }
    //   if (order === null) {
    //     return;
    //   }
    //   this.list.sort((a, b) => {
    //     if (!a.sumDate) {
    //       return -1;
    //     }
    //     if (order === "ascending") {
    //       if (prop === "channel") {
    //         let numA = Number(a[prop] || 0);
    //         let numB = Number(b[prop] || 0);
    //         let diff = numB - numA;
    //         if (diff !== 0) {
    //           return diff;
    //         }
    //       }
    //       if (a.channel !== b.channel) {
    //         return a.channel > b.channel;
    //       }
    //       if (a.platform !== b.platform) {
    //         return a.platform > b.platform;
    //       }
    //       return a.sumDate > b.sumDate;
    //     } else {
    //       if (prop === "channel") {
    //         let numA = Number(a[prop] || 0);
    //         let numB = Number(b[prop] || 0);
    //         let diff = numA - numB;
    //         if (diff !== 0) {
    //           return diff;
    //         }
    //       }
    //       if (a.channel !== b.channel) {
    //         return a.channel < b.channel;
    //       }
    //       if (a.platform !== b.platform) {
    //         return a.platform < b.platform;
    //       }
    //       return a.sumDate < b.sumDate;
    //     }
    //   });
    // }
    handleSelf() {
        this.page = 1;
        this.loadData();
    }
    async handleStat() {
        if (!this.member) {
            this.$message({ message: "必须输入渠道账号", type: "info" });
            return;
        }
        let req: any = {
            pid: this.pid,
            memberAct: this.member
        };
        if (this.valueTime && this.valueTime.length === 2) {
            req.startTime = this.valueTime[0];
            req.endTime = this.valueTime[1];
        }
        req.rateType = this.serachType;
        let ret = await myAsyncFn(getChannelStat, req);
        if (ret.code === 200) {
            this.list = ret.msg.pageData.map(e => {
                e.totalChargeAmt = formUtil.moneyFormat(e.totalChargeAmt);
                e.totalWithdrawAmt = formUtil.moneyFormat(e.totalWithdrawAmt);
                e.totalProfit = formUtil.moneyFormat(e.totalProfit);
                e.gameTax = formUtil.moneyFormat(e.gameTax);
                e.newUserChargeAmt = formUtil.moneyFormat(e.newUserChargeAmt);
                e.androidNewUserChargeAmt = formUtil.moneyFormat(
                    e.androidNewUserChargeAmt
                );
                e.iosNewUserChargeAmt = formUtil.moneyFormat(e.iosNewUserChargeAmt);
                e.onlineChargeAmt = formUtil.moneyFormat(e.onlineChargeAmt);
                e.agentChargeRmbAmt = formUtil.moneyFormat(e.agentChargeRmbAmt);
                e.totalTax = formUtil.moneyFormat(e.totalTax);
                return e;
            });
            this.totalCount = ret.msg.totalCount;
        } else {
            this.$message({
                type: "error",
                message: ret.err
            });
        }
    }
    todaySelf() {
        this.page = 1;
        this.loadData();
    }
    getQueryItem() {
        let temp: QueryItem = {};
        //channel
        if (this.pid) {
            temp.pid = this.pid;
        }
        if (this.value !== "全部") {
            temp.channel = this.value;
        } else {
            temp.channel = undefined;
        }
        temp.rateType = this.serachType;
        temp.type = this.type;
        let now = new Date(Date.now());
        //时间范围
        if (this.valueTime && this.valueTime.length === 2) {
            temp.startTime = this.valueTime[0];
            temp.endTime = this.valueTime[1];
        }
        //子账号
        if (this.member && this.member !== "全部") {
            temp.memberAct = this.member;
        }
        return temp;
    }
    timeFormat1(row, column) {
        if (!row.sumDate) {
            return "总计";
        }
        let date = new Date(row.sumDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }

    handleDownload() {
        const downloadExcelCfg = [
            { title: "统计时间", field: "sumDate", type: "Date" },
            { title: "渠道", field: "channel", type: "string" },
            { title: "平台", field: "platform", type: "string" },
            { title: "营收", field: "totalProfit", type: "string" },
            { title: "充值金额", field: "totalChargeAmt", type: "string" },
            { title: "充值人数", field: "totalChargeUserCount", type: "string" },
            { title: "注册用户", field: "newUserCount", type: "string" },
            { title: "绑定用户", field: "bindUserCount", type: "string" },
            { title: "绑定率", field: "bindRate", type: "string" },
            { title: "代理充值", field: "agentChargeAmt", type: "string" },
            { title: "在线充值", field: "onlineChargeAmt", type: "string" },
            { title: "登录用户", field: "loginUserCount", type: "string" },
            { title: "新增充值金额", field: "newUserChargeAmt", type: "string" },
            {
                title: "新增充值人数",
                field: "newUserChargeUserCount",
                type: "string"
            },
            { title: "总兑换", field: "totalWithdrawAmt", type: "string" },
            { title: "总税收", field: "gameTax", type: "string" },
            { title: "金花税收", field: "jinhuaTax", type: "string" },
            { title: "牛牛税收", field: "niuniuTax", type: "string" },
            { title: "梭哈税收", field: "suohaTax", type: "string" },
            { title: "百人牛牛税收", field: "brniuniuTax", type: "string" },
            { title: "麻将税收", field: "xuezhanTax", type: "string" },
            { title: "红黑税收", field: "hongheiTax", type: "string" },
            { title: "二人麻将税收", field: "ermjTax", type: "string" },
            { title: "斗地主税收", field: "doudizhuTax", type: "string" },
            { title: "德州扑克税收", field: "dezhoupukeTax", type: "string" },
            { title: "抢红包税收", field: "qianghongbaoTax", type: "string" },
            { title: "二八杠税收", field: "erbagangTax", type: "string" },
            { title: "多福多财税收", field: "duofuduocaiTax", type: "string" },
            { title: "捕鱼税收", field: "buyuTax", type: "string" },
            { title: "经典牛牛税收", field: "jdniuniuTax", type: "string" },
            { title: "跑得快税收", field: "paodekuaiTax", type: "string" },
            { title: "次日留存", field: "retentionDay2", type: "string" },
            { title: "三日留存", field: "retentionDay3", type: "string" },
            { title: "七日留存", field: "retentionDay7", type: "string" },
            { title: "十五日留存", field: "retentionDay15", type: "string" },
            { title: "三十日留存", field: "retentionDay30", type: "string" }
        ];
        let temp: QueryItem = this.getQueryItem();
        myDispatch(this.$store, "GetAllChannelsExcel", temp).then(ret => {
            console.log(ret);
            downloadExcel(ret, this);
        });
    }
    //金额转换
    // totalChargeAmtFormat(row){
    //   ret formUtil.moneyFormat(row.totalChargeAmt);
    // }
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
    width: 100%;
    margin: 0px 0px;
}
.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}
</style>
