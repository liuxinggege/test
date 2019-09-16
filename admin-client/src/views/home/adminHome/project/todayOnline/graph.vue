<template>
    <el-col :span="17" style="padding: 0">
        <el-card class="dashboard-winAndLose">
            <span>今日实时在线</span>
            <el-button class="dashboard-winLoseButton" type="primary" size="mini" icon="el-icon-refresh" @click="search">刷新</el-button>
            <el-tabs v-model="activeName" style="margin: 10px">
                <el-tab-pane label="总计" name="first">
                    <totalSum :pid="pid" v-if="activeName=='first'"></totalSum>
                </el-tab-pane>
                <el-tab-pane label="大厅" name="second">
                    <lobbyTotal :pid="pid" v-if="activeName=='second'"></lobbyTotal>
                </el-tab-pane>
                <el-tab-pane label="金花" name="third">
                    <jinhua :pid="pid" v-if="activeName=='third'"></jinhua>
                </el-tab-pane>
                <el-tab-pane label="牛牛" name="fourth">
                    <niuNiu :pid="pid" v-if="activeName=='fourth'"></niuNiu>
                </el-tab-pane>
                <el-tab-pane label="百人牛牛" name="fifth">
                    <brNiuniu :pid="pid" v-if="activeName=='fifth'"></brNiuniu>
                </el-tab-pane>
                <el-tab-pane label="血战" name="sixth">
                    <xueZhan :pid="pid" v-if="activeName=='sixth'"></xueZhan>
                </el-tab-pane>
                <el-tab-pane label="梭哈" name="seventh">
                    <suoHa :pid="pid" v-if="activeName=='seventh'"></suoHa>
                </el-tab-pane>
                <el-tab-pane label="斗地主" name="eighth">
                    <doudizhu :pid="pid" v-if="activeName=='eighth'"></doudizhu>
                </el-tab-pane>
                <el-tab-pane label="德州扑克" name="ten5">
                    <dezhoupuke :pid="pid" v-if="activeName=='ten5'"></dezhoupuke>
                </el-tab-pane>
                <el-tab-pane label="抢红包" name="ten6">
                    <qianghongbao :pid="pid" v-if="activeName=='ten6'"></qianghongbao>
                </el-tab-pane>
                <el-tab-pane label="二八杠" name="ten7">
                    <erbagang :pid="pid" v-if="activeName=='ten7'"></erbagang>
                </el-tab-pane>
                <el-tab-pane label="多福多财" name="ten8">
                    <duofuduocai :pid="pid" v-if="activeName=='ten8'"></duofuduocai>
                </el-tab-pane>
                <el-tab-pane label="红黑" name="ninth">
                    <honghei :pid="pid" v-if="activeName=='ninth'"></honghei>
                </el-tab-pane>
                <el-tab-pane label="龙虎斗" name="ten3">
                    <longhu :pid="pid" v-if="activeName=='ten3'"></longhu>
                </el-tab-pane>
                <el-tab-pane label="捕鱼" name="ten">
                    <buyu :pid="pid" v-if="activeName=='ten'"></buyu>
                </el-tab-pane>
                <el-tab-pane label="经典牛牛" name="ten1">
                    <jdniuniu :pid="pid" v-if="activeName=='ten1'"></jdniuniu>
                </el-tab-pane>
                <el-tab-pane label="跑得快" name="ten2">
                    <paodekuai :pid="pid" v-if="activeName=='ten2'"></paodekuai>
                </el-tab-pane>
                <el-tab-pane label="二人麻将" name="ten4">
                    <ermj :pid="pid" v-if="activeName=='ten4'"></ermj>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </el-col>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../../../utils/index";

import echarts from "echarts";
import { AdminHome } from "../../../../../store/stateInterface";
import { TodayAndYestRealOnline } from "../../../../../store/modules/home/adminHome";

// import { Getter, Action } from "vuex-class";

import totalSum from "./component/total.vue";
import lobbyTotal from "./component/lobby.vue";
import jinhua from "./component/jinhua.vue";
import niuNiu from "./component/niuniu.vue";
import brNiuniu from "./component/brniuniu.vue";
import xueZhan from "./component/xuezhan.vue";
import suoHa from "./component/suoha.vue";
import doudizhu from "./component/doudizhu.vue";
import duofuduocai from "./component/duofuduocai.vue";
import dezhoupuke from "./component/dezhoupuke.vue";
import qianghongbao from "./component/qianghongbao.vue";
import erbagang from "./component/erbagang.vue";
import honghei from "./component/honghei.vue";
import longhu from "./component/longhu.vue";
import buyu from "./component/buyu.vue";
import jdniuniu from "./component/jdniuniu.vue";
import paodekuai from "./component/paodekuai.vue";
import ermj from "./component/ermj.vue";
import { Prop } from "vue-property-decorator";
var colors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae"];
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
    components: {
        totalSum,
        lobbyTotal,
        jinhua,
        niuNiu,
        brNiuniu,
        xueZhan,
        suoHa,
        doudizhu,
        dezhoupuke,
        qianghongbao,
        erbagang,
        duofuduocai,
        honghei,
        ermj,
        buyu,
        jdniuniu,
        paodekuai,
        longhu
    }
})
export default class TodayWinLose extends Vue {
    activeName = "first";
    @Prop(String) pid!: string;
    //初始化数据
    adminHome: AdminHome = this.$store.state.adminHome;
    todayOnline: TodayAndYestRealOnline[] = this.adminHome.todayOnline;
    yesterdayOnline: TodayAndYestRealOnline[] = this.adminHome.yesterdayOnline;
    chartLine1: any;
    chartLine2: any;
    chartLine3: any;
    chartLine4: any;
    chartLine5: any;
    chartLine6: any;
    chartLine7: any;
    chartLine8: any;
    chartLine9: any;
    chartLine10: any;
    chartLine11: any;
    chartLine12: any;
    chartLine13: any;
    chartLine14: any;
    chartLine15: any;
    chartLine16: any;
    chartLine17: any;
    chartLine18: any;
    mounted() {
        // this.loadData();
    }
    search() {
        this.loadData();
    }
    async loadData() {
        await myDispatch(
            this.$store,
            "GetPTodayAndYestRealOnline",
            { pid: this.pid },
            true
        ).then(() => { });
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>