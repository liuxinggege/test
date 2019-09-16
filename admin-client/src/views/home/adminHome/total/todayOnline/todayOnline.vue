<template>
    <div style="margin-bottom:40px">
         <el-row :gutter="25" style="padding:0">
           <graph ></graph>
           <tableOnline></tableOnline>
        </el-row>
    </div>
</template>

<script lang='ts'>
let colors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae"];
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../../../utils/index";
// import { Getter, Action } from "vuex-class";

import graph from "./graph.vue";
import tableOnline from "./tableOnline.vue";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    graph,
    tableOnline
  }
})
export default class TodayWinLose extends Vue {}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>