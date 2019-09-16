<template>
  <div class="dashboard-outer">        
        <div>
            <niuniu-matchrules></niuniu-matchrules>
        </div>
        <div>
            <niuniu-matchstages></niuniu-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>      
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import niuniuMatchRules from "./niuniuMatchRules.vue";
import niuniuMatchStages from "./niuniuMatchStages.vue";
import graph from "./graph.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
     "graph": graph,
    "niuniu-matchrules": niuniuMatchRules,
    "niuniu-matchstages": niuniuMatchStages
  }
})
export default class NiuniuGameConfig extends Vue {}
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
