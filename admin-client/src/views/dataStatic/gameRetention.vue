<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="游戏留存"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">游戏留存</span>
            </el-col>
            <!--工具条-->
            <span class="content_font"></span>

            <span>时间范围</span>
            <el-date-picker v-model="logTime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:5px 20px 5px 10px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
            <el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
            <!--列表-->
            <el-table :data="gameRetention.transferData" border highlight-current-row style="width: 100%;" max-height="600">
                <el-table-column prop="sumDate" label="统计时间" width="150" :formatter="sumDateFunc" align="center"></el-table-column>
                <el-table-column prop="localeSumDate" label="本地统计时间" width="150" :formatter="logDateFunc" align="center"></el-table-column>
                <el-table-column prop="jinhuaGameUserCount" label="金花用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaGameUserCount" label="梭哈用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuGameUserCount" label="牛牛用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuGameUserCount" label="百人牛牛用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanGameUserCount" label="血战麻将用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuGameUserCount" label="斗地主用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeGameUserCount" label="德州扑克用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoGameUserCount" label="抢红包用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangGameUserCount" label="二八杠用户数量" width="200" align="center"></el-table-column>
                 <el-table-column prop="duofuduocaiGameUserCount" label="多福多财用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiGameUserCount" label="红黑用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjGameUserCount" label="二人麻将用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuGameUserCount" label="龙虎斗用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuGameUserCount" label="捕鱼用户数量" width="200" align="center"></el-table-column>

                <el-table-column prop="jdniuniuGameUserCount" label="经典牛牛用户数量" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiGameUserCount" label="跑得快用户数量" width="200" align="center"></el-table-column>

                <el-table-column prop="jinhuaRetentionDay2" label="金花2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jinhuaRetentionDay3" label="金花3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jinhuaRetentionDay5" label="金花5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jinhuaRetentionDay7" label="金花7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jinhuaRetentionDay15" label="金花15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jinhuaRetentionDay30" label="金花30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaRetentionDay2" label="梭哈2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaRetentionDay3" label="梭哈3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaRetentionDay5" label="梭哈5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaRetentionDay7" label="梭哈7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaRetentionDay15" label="梭哈15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="suohaRetentionDay30" label="梭哈30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuRetentionDay2" label="牛牛2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuRetentionDay3" label="牛牛3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuRetentionDay5" label="牛牛5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuRetentionDay7" label="牛牛7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuRetentionDay15" label="牛牛15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="niuniuRetentionDay30" label="牛牛30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuRetentionDay2" label="百人牛牛2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuRetentionDay3" label="百人牛牛3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuRetentionDay5" label="百人牛牛5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuRetentionDay7" label="百人牛牛7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuRetentionDay15" label="百人牛牛15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="brniuniuRetentionDay30" label="百人牛牛30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanRetentionDay2" label="血战麻将2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanRetentionDay3" label="血战麻将3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanRetentionDay5" label="血战麻将5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanRetentionDay7" label="血战麻将7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanRetentionDay15" label="血战麻将15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="xuezhanRetentionDay30" label="血战麻将30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuRetentionDay2" label="斗地主2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuRetentionDay3" label="斗地主3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuRetentionDay5" label="斗地主5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuRetentionDay7" label="斗地主7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuRetentionDay15" label="斗地主15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="doudizhuRetentionDay30" label="斗地主30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeRetentionDay2" label="德州扑克2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeRetentionDay3" label="德州扑克3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeRetentionDay5" label="德州扑克5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeRetentionDay7" label="德州扑克7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeRetentionDay15" label="德州扑克15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeRetentionDay30" label="德州扑克30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoRetentionDay2" label="抢红包2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoRetentionDay3" label="抢红包3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoRetentionDay5" label="抢红包5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoRetentionDay7" label="抢红包7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoRetentionDay15" label="抢红包15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoRetentionDay30" label="抢红包30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangRetentionDay2" label="二八杠2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangRetentionDay3" label="二八杠3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangRetentionDay5" label="二八杠5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangRetentionDay7" label="二八杠7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangRetentionDay15" label="二八杠15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="erbagangRetentionDay30" label="二八杠30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiRetentionDay2" label="多福多财2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiRetentionDay3" label="多福多财3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiRetentionDay5" label="多福多财5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiRetentionDay7" label="多福多财7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiRetentionDay15" label="多福多财15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiRetentionDay30" label="多福多财30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiRetentionDay2" label="红黑2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiRetentionDay3" label="红黑3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiRetentionDay5" label="红黑5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiRetentionDay7" label="红黑7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiRetentionDay15" label="红黑15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="hongheiRetentionDay30" label="红黑30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjRetentionDay2" label="二人麻将2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjRetentionDay3" label="二人麻将3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjRetentionDay5" label="二人麻将5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjRetentionDay7" label="二人麻将7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjRetentionDay15" label="二人麻将15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="ermjRetentionDay30" label="二人麻将30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuRetentionDay2" label="龙虎斗2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuRetentionDay3" label="龙虎斗3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuRetentionDay5" label="龙虎斗5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuRetentionDay7" label="龙虎斗7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuRetentionDay15" label="龙虎斗15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="longhuRetentionDay30" label="龙虎斗30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuRetentionDay2" label="捕鱼2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuRetentionDay3" label="捕鱼3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuRetentionDay5" label="捕鱼5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuRetentionDay7" label="捕鱼7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuRetentionDay15" label="捕鱼15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="buyuRetentionDay30" label="捕鱼30日留存" width="200" align="center"></el-table-column>

                <el-table-column prop="jdniuniuRetentionDay2" label="经典牛牛2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jdniuniuRetentionDay3" label="经典牛牛3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jdniuniuRetentionDay5" label="经典牛牛5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jdniuniuRetentionDay7" label="经典牛牛7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jdniuniuRetentionDay15" label="经典牛牛15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="jdniuniuRetentionDay30" label="经典牛牛30日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiRetentionDay2" label="跑得快2日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiRetentionDay3" label="跑得快3日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiRetentionDay5" label="跑得快5日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiRetentionDay7" label="跑得快7日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiRetentionDay15" label="跑得快15日留存" width="200" align="center"></el-table-column>
                <el-table-column prop="paodekuaiRetentionDay30" label="跑得快30日留存" width="200" align="center"></el-table-column>
            </el-table>
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="gameRetention.totalCount"></el-pagination>
            </el-col>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { GameRetentionState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//GameRetention
interface QueryItem {
    startTime?: Date;
    endTime?: Date;
    page?: number;
    count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GameRetention extends Vue {
    // lifecycle hook
    created() {
        this.loadData(); //初始化-->加载数据
    }
    /*inital data*/
    gameRetention: GameRetentionState = this.$store.state.gameRetention; //表单数据
    logTime: Date[] = [];
    page: number = 1; //当前页
    count: number = 10;

    loadData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        myDispatch(this.$store, "GetGameRetention", queryItem).then(() => { });
    }
    //获取查询条件
    getQueryItem() {
        let temp: QueryItem = {};

        temp.page = this.page;
        temp.count = this.count;
        if (this.logTime && this.logTime[0]) {
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
        return sdate;
    }
    logDateFunc(row, column) {
        let date = new Date(row.localeSumDate);
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
