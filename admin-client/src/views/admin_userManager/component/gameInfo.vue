<template>
    <div style="border:2px solid #AFEEEE; z-index:999">
        <el-col class="toolbar1">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="游戏日志"></el-popover>
            <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
            <span class="title">游戏日志({{uid}})</span>
            <el-button type="primary" @click="refrsh" style="margin: 20px;">刷新</el-button>
        </el-col>
        <!--工具条-->
        <el-col class="toolbar1">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count"></el-pagination>
            <!-- :total="0" -->
        </el-col>
        <!--列表-->
        <el-table :data="gameInfo" border highlight-current-row style="width: 100%;">
            <el-table-column prop="gid" label="游戏名字" width="200" :formatter="gid" align="center"></el-table-column>
            <el-table-column prop="gameId" label="游戏局号" width="200" align="center"></el-table-column>
            <el-table-column prop="yid" label="场次号" width="200" align="center"></el-table-column>
            <el-table-column prop="startDate" label="开始时间" width="170" :formatter="timeFormat1" align="center"></el-table-column>
            <el-table-column prop="endDate" label="结束时间" width="170" :formatter="timeFormat2" align="center"></el-table-column>
            <el-table-column prop="totalOrgGold" label="原金币" width="200" align="center"></el-table-column>
            <el-table-column prop="money" label="金币" width="150" align="center"></el-table-column>
            <el-table-column prop="chgMoney" label="变化金币" min-width="150" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { GeneralUser } from "@/store/stateInterface";
import { GameInfo } from "@/store/modules/userManager/generalUser";
import { myDispatch, secToString } from "@/utils/index";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GenUserAttribution extends Vue {
    //初始化数据
    uid = this.$attrs.curUid;
    generalUser: GeneralUser = this.$store.state.generalUser;
    gameInfo: GameInfo[] = this.generalUser.gameInfo;
    page: number = 1; //当前页
    count: number = 10;

    created() {
        this.uid = this.$attrs.curUid;
        this.loadData();
    }
    refrsh() {
        this.loadData();
    }
    loadData() {
        myDispatch(
            this.$store,
            "GetGameLog",
            {
                userId: parseInt(this.uid),
                page: this.page,
                count: this.count
            },
            true
        ).then(() => {
            this.gameInfo = this.generalUser.gameInfo;
        });
    }
    secToString(value) {
        return secToString(value);
    }
    //整形
    timeFormat1(row, column) {
        let date = new Date(row.startDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    timeFormat2(row, column) {
        let date = new Date(row.endDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    gid(row, column) {
        if (row.gid == "JH") {
            return "金花";
        } else if (row.gid == "QZNN") {
            return "牛牛";
        } else if (row.gid == "BRNN") {
            return "百人牛牛";
        } else if (row.gid == "XUEZHAN") {
            return "麻将";
        } else if (row.gid == "SUOHA") {
            return "梭哈";
        } else if (row.gid == "DDZ") {
            return "斗地主";
        } else if (row.gid == "DZPK") {
            return "德州扑克";
        } else if (row.gid == "QHB") {
            return "抢红包";
        } else if (row.gid == "EBG") {
            return "二八杠";
        }else if (row.gid == "DFDC") {
            return "多福多财";
        } else if (row.gid == "HH") {
            return "红黑";
        } else if (row.gid == "ERMJ") {
            return "二人麻将";
        } else if (row.gid == "LH") {
            return "龙虎斗";
        } else if (row.gid == "BY") {
            return "捕鱼";
        } else if (row.gid == "JDNN") {
            return "经典牛牛";
        } else if (row.gid == "PDK") {
            return "跑得快";
        }
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
.toolbar1 {
    padding: 5px;
    background-color: #f9fafc;
    border: 2px;
    margin: 0px 0px;
}

.toolbar2 {
    background: #f2f2f2;
    padding: 20px;
    border: 1px solid #dfe6ec;
    margin: 0px 0px;
}

.toolbar3 {
    background: #f2f2f2;
    padding: 20px;
    border: 1px solid #dfe6ec;
    margin: 10px 0px;
}

.toolbar3 {
    background: #f2f2f2;
    padding: 10px;
    border: 1px solid #dfe6ec;
    margin: 10px 0px;
}

.toolbar4 {
    padding: 30px;
    background-color: #f9fafc;
}

.title {
    margin: 10px 0px 0px 10px;
    font-family: sans-serif;
    color: #a0a0a0;
}

.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}

.content_font {
    font-size: 14px;
    font-weight: 700;
}
</style>
