<template>
  <div class="dashboard-container">
    
    <customerService-todayWinLose class="dashboard-gameWinLose"></customerService-todayWinLose>

    <el-tabs v-model="activeName"
             type="border-card"
             class="dashboard-dayOnline">
      <el-tab-pane label="总"
                   name="first">
        <customerService-todayOnline v-if="activeName=='first'"></customerService-todayOnline>
      </el-tab-pane>
      <el-tab-pane v-for="pid in pids"
                   :label="pid.name"
                   :name="pid.pid"
                   :key="pid.pid">
        <customerService-projectTodayOnline :pid="pid.pid"
                                            v-if="activeName==pid.pid"></customerService-projectTodayOnline>
      </el-tab-pane>
    </el-tabs>
    <customerService-withdrawMonitor class="dashboard-totalSum"></customerService-withdrawMonitor>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
// import { Getter, Action } from "vuex-class";
import withdrawMonitor from "../../dataStatic/withdrawMonitor.vue";
import todayWinLose from "../../home/adminHome/total/todayWinAndLose/todayWinLose.vue";
import todayOnline from "../../home/adminHome/total/todayOnline/todayOnline.vue";
import projectTodayOnline from "../../home/adminHome/project/todayOnline/todayOnline.vue";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "customerService-withdrawMonitor": withdrawMonitor, //兑换监控
    "customerService-todayWinLose": todayWinLose, //今日输赢
    "customerService-todayOnline": todayOnline, //今日实时在线
    "customerService-projectTodayOnline": projectTodayOnline //友趣今日实时在线
  }
})
export default class Admin_homes extends Vue {
  activeName = "first";
  pids = JSON.parse(<string>sessionStorage.getItem("pid"));
}
</script>


<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-container {
    margin-left: 15px;
    margin-right: 15px;
    // margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-todaySum {
    margin-top: 25px;
  }
  &-totalSum {
    margin-top: 25px;
  }
  &-gameWinLose {
    margin-top: 25px;
  }
  &-dayOnline {
    margin-top: 25px;
  }
}
</style>