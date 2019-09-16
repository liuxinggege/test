<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="上下分日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">
          <b>上下分日志</b>
        </span>
      </el-col>
      <div>&nbsp;&nbsp;</div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="上下分日志" name="first">
          <up-point v-if="activeName=='first'"></up-point>
        </el-tab-pane>
        <el-tab-pane label="追分日志" name="second">
          <recover-section v-if="activeName=='second'"></recover-section>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import upPoint from "./upPoint.vue";
import recoverSection from "./recoverSection.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "up-point": upPoint,
    "recover-section": recoverSection
  }
})
export default class RiskControlLog extends Vue {
  activeName: string = "first";
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
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
</style>