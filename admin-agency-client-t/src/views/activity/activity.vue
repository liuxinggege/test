<template>
  <div class="content tab4">
    <div class="header">
      <div @click="toHome" class="back"></div>
      <div class="text">新手活动</div>
    </div>

    <ActivityList></ActivityList>
    <NewWelfare></NewWelfare>
    <tabbar></tabbar>
  </div>
</template>


<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
import NewPeople from "./newPeople.vue";
import ActivityList from "./activityList.vue";
import NewWelfare from "./newWelfare.vue";
import tabbar from "../../components/tabbar.vue";
@Component({
  components: {
    ActivityList,
    NewWelfare,
    tabbar
  }
})
export default class Activity extends Vue {
  //生命周期钩子函数
  created() {}
  //初始化数据
  async loadData() {}
  toHome() {
    this.$router.push({ path: "/home" });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  background: url(#{$imgUrl}fuli.jpg) no-repeat center 8vh;
  background-size: 100% auto;
}
</style>
