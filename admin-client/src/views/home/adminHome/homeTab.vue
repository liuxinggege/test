<template>
<div>
<el-card style="margin:0 ;padding:0 !important;">
      <br>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="总" name="first">
          <total v-if="activeName=='first'"></total>
        </el-tab-pane>
        <el-tab-pane v-for="pid in pids" :label="pid.name" :name="pid.pid" :key ="pid.pid">
          <project v-if="activeName==pid.pid" :pid="pid.pid"></project>
        </el-tab-pane>
      </el-tabs>
      <withdrawMonitor></withdrawMonitor>
    </el-card>
    
</div>
    
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import total from "./total/home.vue";
import project from "./project/home.vue";
import withdrawMonitor from "../../dataStatic/withdrawMonitor.vue"
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    withdrawMonitor,
    total:total,
    project: project,
  }
})
export default class OnlineStatic extends Vue {
  activeName: string = "first";
  pids = JSON.parse(<string>sessionStorage.getItem("pid"));
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
  .el-tabs__content{
	  padding:0;
	  margin:0;
  }
</style>