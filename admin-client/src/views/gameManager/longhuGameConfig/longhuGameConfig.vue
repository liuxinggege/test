<template>
  <div class="dashboard-outer">        
        <div>
            <longhu-matchrules></longhu-matchrules>
        </div>
        <div>
            <longhu-matchstages></longhu-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>      
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import longhuMatchRules from "./longhuMatchRules.vue";
import longhuMatchStages from "./longhuMatchStages.vue";
import graph from "./graph.vue";

// import { Getter, Action } from "vuex-class";
@Component({
  components: {
     "graph": graph,
    "longhu-matchrules": longhuMatchRules,
    "longhu-matchstages": longhuMatchStages
  }
})
// @Component 修饰符注明了此类为一个 Vue 组件

export default class LonghuGameConfig extends Vue {}
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
