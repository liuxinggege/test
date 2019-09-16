<template>
   <div class="dashboard-outer">
    <el-card class="dashboard-second">
    <el-col :span="48" class="toolbar1">
      <span class="title">在线统计</span>
    </el-col>
    <br>
    <br>
    <el-tabs v-model="activeName" style="margin:10px 0px 10px 15px">
      <el-tab-pane label="在线曲线" name="first"><online-graph v-if="activeName=='first'"></online-graph></el-tab-pane>
      <el-tab-pane label="在线表格" name="second"><online-table v-if="activeName=='second'"></online-table></el-tab-pane>
    </el-tabs>
 
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import onlineGraph from "./onlineGraph.vue";
import onlineTable from "./onlineTable.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "online-graph": onlineGraph,
    "online-table": onlineTable
  }
})
export default class OnlineStatic extends Vue {
  activeName:string = "first";
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
</style>