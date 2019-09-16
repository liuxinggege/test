<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="用户输赢排名"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">用户输赢排名</span>
            </el-col>
            <span class="content_font"></span>

            <span>统计时间</span>
            <el-date-picker v-model="logTime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:5px 20px 5px 10px" type="date" placeholder="选择日期"></el-date-picker>
            <span>用户id</span>
            <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
            <span>渠道id</span>
            <el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>
            <span>平台</span>
            <el-select v-model="platform" placeholder="请选择" style="margin:0px 0px 0px 10px">
                <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span>游戏</span>
            <el-select v-model="gameType" placeholder="请选择" style="margin:0px 0px 0px 10px">
                <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span>升序降序</span>
            <el-select v-model="rank" placeholder="请选择" style="width:110px; margin:0px 0px 0px 0px">
                <el-option v-for="item in winLoseOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
            <!--列表-->
            <el-table :data="userWinLose.transferData" border highlight-current-row style="width: 100%;" max-height="600">
                <el-table-column prop="uid" label="用户ID" width="100" fixed align="center"></el-table-column>
                <el-table-column prop="sumDate" label="统计时间" width="150" fixed align="center" :formatter="sumDateFormat"></el-table-column>
                <el-table-column prop="channel" label="注册渠道" width="100" align="center" :formatter="channelFormat"></el-table-column>
                <el-table-column prop="platform" label="平台" width="100" align="center"></el-table-column>
                <el-table-column prop="totalChargeMoney" label="总充值" width="100" align="center"></el-table-column>
                <el-table-column prop="totalWithdrawMoney" label="总提现" width="100" align="center"></el-table-column>
                <el-table-column prop="totalBets" label="总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="totalWinLose" label="总输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="jinhuaTotalBets" label="金花总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="jinhuaWinLose" label="金花输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="niuniuTotalBets" label="牛牛总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="niuniuWinLose" label="牛牛输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="brniuniuTotalBets" label="百人牛牛总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="brniuniuWinLose" label="百人牛牛输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="buyuTotalBets" label="捕鱼总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="buyuWinLose" label="捕鱼输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="hongheiTotalBets" label="红黑总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="hongheiWinLose" label="红黑输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="ermjTotalBets" label="二人麻将总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="ermjWinLose" label="二人麻将输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="longhuTotalBets" label="龙虎斗总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="longhuWinLose" label="龙虎斗输赢" width="100" align="center"></el-table-column>

                <el-table-column prop="jdniuniuTotalBets" label="经典牛牛总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="jdniuniuWinLose" label="经典牛牛输赢" width="100" align="center"></el-table-column>

                <el-table-column prop="paodekuaiTotalBets" label="跑得快总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="paodekuaiWinLose" label="跑得快输赢" width="100" align="center"></el-table-column>

                <el-table-column prop="xuezhanTotalBets" label="血战总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="xuezhanWinLose" label="血战输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="doudizhuTotalBets" label="斗地主总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="doudizhuWinLose" label="斗地主输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeTotalBets" label="德州扑克总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeWinLose" label="德州扑克输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoTotalBets" label="抢红包总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoWinLose" label="抢红包输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="erbagangTotalBets" label="二八杠总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="erbagangWinLose" label="二八杠输赢" width="100" align="center"></el-table-column>
                 <el-table-column prop="duofuduocaiTotalBets" label="多福多财杠总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiWinLose" label="多福多财杠输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="suohaTotalBets" label="梭哈总下注" width="100" align="center"></el-table-column>
                <el-table-column prop="suohaWinLose" label="梭哈输赢" width="100" align="center"></el-table-column>
                <el-table-column prop="ip" label="注册IP" width="160" align="center"></el-table-column>
                <el-table-column prop="ipLocation" label="注册地址" width="100" align="center"></el-table-column>
            </el-table>
            <!--工具条-->
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="userWinLose.totalCount"></el-pagination>
            </el-col>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { UserWinLoseState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//UserWinLose
interface QueryItem {
    uid?: string;
    channel?: string;
    platform?: string;
    gid?: string;
    startTime?: any;
    sort?: string;
    page?: number;
    count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class UserWinLose extends Vue {
    // lifecycle hook
    created() {
        // this.loadData(); //初始化-->加载数据
    }
    /*inital data*/
    userWinLose: UserWinLoseState = this.$store.state.userWinLose; //表单数据
    logTime: string = "";
    page: number = 1; //当前页
    count: number = 10;
    type: string = "1";
    fromUid: string = "";
    platform: string = "";
    toUid: string = "";
    // totalCount: number = 0;
    stateOptions = [
        { value: "", label: "全部" },
        { value: "JH", label: "金花" },
        { value: "BRNN", label: "百人牛牛" },
        { value: "SUOHA", label: "梭哈" },
        { value: "QZNN", label: "牛牛" },
        { value: "XUEZHAN", label: "血战" },
        { value: "DDZ", label: "斗地主" },
        { value: "DZPK", label: "德州扑克" },
        { value: "QHB", label: "抢红包" },
        { value: "EBG", label: "二八杠" },
        { value: "DFDC", label: "多福多财" },
        { value: "HH", label: "红黑" },
        { value: "ERMJ", label: "二人麻将" },
        { value: "LH", label: "龙虎斗" },
        { value: "BY", label: "捕鱼" },
        { value: "JDNN", label: "经典牛牛" },
        { value: "PDK", label: "跑得快" }
    ];

    platformOptions = [
        { value: "", label: "全部" },
        { value: "android", label: "android" },
        { value: "ios", label: "ios" }
    ];

    winLoseOptions = [
        { value: "ASC", label: "升序" },
        { value: "DESC", label: "降序" }
    ];

    gameType = "";
    rank = "";
    uid = "";
    channel = "";

    loadData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        // let now = new Date(Date.now());
        // queryItem.startTime = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 0, 0,  0 );
        myDispatch(this.$store, "GetUserWinLose", queryItem).then(() => { });
    }
    //获取查询条件
    getQueryItem() {
        let temp: QueryItem = {};

        if (this.uid) {
            temp.uid = this.uid;
        }

        if (this.channel) {
            if (this.channel == "官方") {
                temp.channel = "";
            } else {
                temp.channel = this.channel;
            }
        }

        if (this.gameType) {
            temp.gid = this.gameType;
        }

        if (this.platform) {
            temp.platform = this.platform;
        }
        if (this.rank) {
            temp.sort = this.rank;
        }

        temp.page = this.page;
        temp.count = this.count;

        if (this.logTime) {
            temp.startTime = this.logTime;
        }
        return temp;
    }

    //整形
    channelFormat(row, index) {
        return row.channel ? row.channel : "官方";
    }

    sumDateFormat(row, index) {
        let date = new Date(row.sumDate);
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
