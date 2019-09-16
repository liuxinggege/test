<template>
    <el-col :span="7" style="padding: 0 0 0 25px">
        <el-card class="dashboard-tableWin"> 
            <span>游戏今日输赢</span>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="search" style="position:absolute; top:20px; right:10px; z-index:99;">刷新</el-button>
            <!--工具条-->
            <br/>
            <br/>
            <br/>
            <el-table :data="todayWinAndLose" border highlight-current-row  style="width:100%"  height="550">
                <el-table-column prop="game" label="游戏名"  align="center">
                </el-table-column>
                <el-table-column prop="winAndLose" label="今日输赢"  align="center">
                </el-table-column>
                <el-table-column prop="tax" label="税收"  align="center">
                </el-table-column>
            </el-table>
        </el-card>
    </el-col>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AdminHome } from "../../../../../store/stateInterface";
import { TodayWinAndLose } from "../../../../../store/modules/home/adminHome";
import { myDispatch } from "../../../../../utils/index";
@Component
export default class Login extends Vue {
  //生命周期钩子函数
  created() {
    this.loadData();
  }
  //初始化数据
  adminHome: AdminHome = this.$store.state.adminHome;
  todayWinAndLose: TodayWinAndLose[] = this.adminHome.todayWinAndLose;

  //函数
  refresh() {
    this.loadData();
  }
  search() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetTodaySum", {}, true).then(() => {
      this.todayWinAndLose = this.adminHome.todayWinAndLose;
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-winAndLose {
    padding: 10px;
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
    // height: 425px;
    padding: 30px;
  }
  &-tableWin {
    // width: 100%;
    height: 650px;
    // padding: 30px;
  }
}
.dashboard {
  &-tableWin {
    padding: 10px;
    // max-height: 520px;
  }
}
</style>