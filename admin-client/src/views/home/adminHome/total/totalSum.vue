<template>
    <el-card class="totalSum">
        <el-row>
            <span>总概况</span>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh" style="position:absolute; top:0; right:0; z-index:99;">刷新</el-button>
        </el-row>
        <el-row style="margin: 15px 0">
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.totalChargeAmt}}
                <br>
                <span class="gray">总充值</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.agentChargeAmt}}
                <br>
                <span class="gray">代理充值</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.totalWithdrawAmt}}
                <br>
                <span class="gray">总兑换(游戏)</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.agencySettleAmt}}
                <br>
                <span class="gray">总兑换(全民代理)</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.totalProfit}}
                <br>
                <span class="gray">总营收</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                {{totalSum.newUserCount}}
                <br>
                <span class="gray">新增用户</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.gameTax}}
                <br>
                <span class="gray">游戏税收</span>
            </el-col>
            <el-col :span="3" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon"/>
                {{totalSum.systemWinAndLose}}
                <br>
                <span class="gray">游戏输赢</span>
                <el-button type="text" class="detail" @click="gameWinAndLoseDetail">(详情)</el-button>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogGameWinAndLoseVisible" width="550px">
            <winAndLoseTable v-bind:table="value"></winAndLoseTable>
        </el-dialog>
    </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../../utils/index";
// import { Getter, Action } from "vuex-class";

import { AdminHome } from "../../../../store/stateInterface";
import { TotalSum } from "../../../../store/modules/home/adminHome";
import winAndLoseTable from "./component/winAndLoseTable.vue";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
    components: {
        winAndLoseTable
    }
})
export default class Login extends Vue {
    //生命周期钩子函数
    created() {
        this.loadData();
    }
    //初始化数据
    adminHome: AdminHome = this.$store.state.adminHome;
    totalSum: TotalSum = this.adminHome.totalSum;
    value: any = {};
    dialogGameWinAndLoseVisible = false;
    //函数
    refresh() {
        this.loadData();
    }
    loadData() {
        myDispatch(this.$store, "GetTotalSum", null, true).then(() => {
            this.totalSum = this.adminHome.totalSum;
            this.value.xuezhanWinAndLose = this.totalSum.xuezhanWinAndLose;
            this.value.brniuniuWinAndLose = this.totalSum.brniuniuWinAndLose;
            this.value.buyuWinAndLose = this.totalSum.buyuWinAndLose;
            this.value.doudizhuWinAndLose = this.totalSum.doudizhuWinAndLose;
            this.value.dezhoupukeWinAndLose = this.totalSum.dezhoupukeWinAndLose;
            this.value.qianghongbaoWinAndLose = this.totalSum.qianghongbaoWinAndLose;
            this.value.erbagangWinAndLose = this.totalSum.erbagangWinAndLose;
            this.value.duofuduocaiWinAndLose = this.totalSum.duofuduocaiWinAndLose;
            this.value.hongheiWinAndLose = this.totalSum.hongheiWinAndLose;
            this.value.ermjWinAndLose = this.totalSum.ermjWinAndLose;
            this.value.longhuWinAndLose = this.totalSum.longhuWinAndLose;
            this.value.jinhuaWinAndLose = this.totalSum.jinhuaWinAndLose;
            this.value.niuniuWinAndLose = this.totalSum.niuniuWinAndLose;
            this.value.suohaWinAndLose = this.totalSum.suohaWinAndLose;

            this.value.jdniuniuWinAndLose = this.totalSum.jdniuniuWinAndLose;
            this.value.paodekuaiWinAndLose = this.totalSum.paodekuaiWinAndLose;
        });
    }
    gameWinAndLoseDetail() {
        this.dialogGameWinAndLoseVisible = true;
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
div .el-row {
    margin: 8px 0 !important;
}
// .el-card__body {
//   padding: 0;
// }
.todayBar:hover {
    color: cadetblue;
    transform: scale(1.4);
}
.todayBar {
    margin-top: 10px;
}
.totalSum {
    padding: 10px 10px 0 10px;
}
.gray {
    color: gray;
    font-size: 10px;
}
.detail {
    font-size: 10px;
    line-height: 5px;
}
.dashboard {
    &-winAndLose {
        position: relative;
    }
    &-winLoseButton {
        position: absolute;
        top: 20px;
        right: 25px;
        z-index: 99;
    }
    &-winChart {
        width: 100%;
        height: 425px;
        padding: 10px 10px 10px 10px;
    }
}
</style>