<template>
    <div>
         <el-row :gutter="25" style="padding:0">
           <graph ></graph>
           <tableWin></tableWin>
        </el-row>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../../../utils/index";
// import { Getter, Action } from "vuex-class";

import graph from "./graph.vue";
import tableWin from "./tableWin.vue";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    graph,
    tableWin
  }
})
export default class TodayWinLose extends Vue {}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>