<template>
    <div class="dashboard-container">
		<businessHome-details class=""></businessHome-details>      
		<businessHome-transfer class=""></businessHome-transfer>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
// import { Getter, Action } from "vuex-class";


import details from "./details.vue";
import transfer from "../../logManager/transferLog.vue";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "businessHome-details": details, // 详情
    "businessHome-transfer": transfer //转账记录
  }
})
export default class Business extends Vue {
  
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