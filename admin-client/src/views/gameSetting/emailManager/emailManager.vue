<template>
  <div class="dashboard-outer">        
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="邮件管理">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">
          <b>邮件管理</b>
        </span>
      </el-col>
      <div>&nbsp;&nbsp;</div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="发送邮件" name="first">
            <sendMail v-if="activeName=='first'"></sendMail>
        </el-tab-pane>
        <el-tab-pane label="玩家反馈" name="second">
            <notProcess v-if="activeName=='second'"></notProcess>
        </el-tab-pane>
        <!-- <el-tab-pane label="已处理" name="third">
            <completed v-if="activeName=='third'"></completed>
        </el-tab-pane>
        <el-tab-pane label="忽略" name="fourth">
            <ignore v-if="activeName=='fourth'"></ignore>
        </el-tab-pane>  -->
        <el-tab-pane label="推送记录" name="third">
            <beenSent v-if="activeName=='third'"></beenSent>
        </el-tab-pane>     
      </el-tabs>
    </el-card>		
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import sendMail from "./sendMail.vue";
import notProcess from "./notProcess.vue";
import completed from "./completed.vue";
import ignore from "./ignore.vue";
import beenSent from "./beenSent.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    sendMail: sendMail,
    notProcess: notProcess,
    // completed: completed,
    // ignore: ignore,
    beenSent: beenSent
  }
})
export default class MailManager extends Vue {
  activeName: string = "second";
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 10px;
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