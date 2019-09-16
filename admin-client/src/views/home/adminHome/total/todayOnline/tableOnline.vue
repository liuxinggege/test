<template>
   <el-col :span="7" style="padding: 0 0 0 25px">
     <el-card class="dashboard-tableOnline" id="dashboard-tableOnline">
        <span>当前在线</span>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="search" style="position:absolute; top:20px; right:10px; z-index:99;">刷新</el-button>
        <!--工具条-->
        <br/>
        <br/>
        <div >
            <el-table :data="gameOnline" border highlight-current-row style="width: 100%">
                <el-table-column prop="game" align="center" label="游戏名" width="100">
                </el-table-column>
                <el-table-column prop="matchNumber" align="center" label="金币房" min-width="60">
                </el-table-column>
                <!-- <el-table-column prop="customNumber" align="center" label="好友房" min-width="60">
                </el-table-column> -->
            </el-table>
            <el-table :data="numOnline" border highlight-current-row style="width: 100%;">
                <el-table-column prop="avgOnline" align="center" label="平均在线" width="100" :formatter="formatAvg">
                </el-table-column>
                <el-table-column prop="maxOnline" align="center" label="最高在线" min-width="60">
                </el-table-column>
                <el-table-column prop="minOnline" align="center" label="最低在线" min-width="60">
                </el-table-column>
            </el-table>
            <el-table :data="lobbyOnline" border highlight-current-row style="width: 100%;">
                <el-table-column prop="realOnline" align="center" label="当前在线" min-width="100">
                </el-table-column>
                <el-table-column prop="lobbyRealOnline" align="center" label="大厅人数" min-width="100">
                </el-table-column>
            </el-table>
        </div>
     </el-card>
    </el-col>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../../../utils/index";
import { AdminHome } from "../../../../../store/stateInterface";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TodayWinLose extends Vue {
  //初始化数据
  adminHome: AdminHome = this.$store.state.adminHome;
  gameOnline: any = this.adminHome.gameOnline;
  numOnline: any = this.adminHome.numOnline;
  lobbyOnline: any = this.adminHome.lobbyOnline;
  timeRun: any;
  mounted() {
    this.loadData();
  }
  //即将离开对应该组件的路由时
  beforeDestroy() {
    clearTimeout(this.timeRun);
  }
  search() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetOnlineInfo", null, true).then(() => {
      this.gameOnline = this.adminHome.gameOnline;
      this.numOnline = this.adminHome.numOnline;
      this.lobbyOnline = this.adminHome.lobbyOnline;
    });
    this.timeRun = setInterval(() => {
      myDispatch(this.$store, "GetOnlineInfo", null, true).then(() => {
        this.gameOnline = this.adminHome.gameOnline;
        this.numOnline = this.adminHome.numOnline;
        this.lobbyOnline = this.adminHome.lobbyOnline;
      });
    }, 300000);
  }
  //整形
  formatAvg(row) {
    return Math.floor(row.avgOnline);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-tableOnline {
    padding: 10px;
    // height: 670px;
  }
}
</style>