<template>
    <div class="dashboard-container">
		<adminHome-todaySum class="dashboard-todaySum"></adminHome-todaySum>      
		<adminHome-totalSum class="dashboard-totalSum"></adminHome-totalSum>      
		<adminHome-todayWinLose class="dashboard-gameWinLose"></adminHome-todayWinLose>      
		<adminHome-todayOnline class="dashboard-dayOnline"></adminHome-todayOnline>      
		      
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
// import { Getter, Action } from "vuex-class";

import todaySum from "./todaySum.vue";
import totalSum from "./totalSum.vue";
import todayWinLose from "./todayWinAndLose/todayWinLose.vue";
import todayOnline from "./todayOnline/todayOnline.vue";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "adminHome-todaySum": todaySum, //今日
    "adminHome-totalSum": totalSum, //总计
    "adminHome-todayWinLose": todayWinLose, //今日输赢
    "adminHome-todayOnline": todayOnline //今日实时在线
  }
})
export default class Admin_homes extends Vue {
  
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