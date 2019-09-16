<template>
  <div class="dashboard-outer">        
        <div>
            <doudizhu-matchrules></doudizhu-matchrules>
        </div>
        <div>
            <doudizhu-matchstages></doudizhu-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>      
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import doudizhuMatchRules from "./doudizhuMatchRules.vue";
import doudizhuMatchStages from "./doudizhuMatchStages.vue";
import graph from "./graph.vue";

// import { Getter, Action } from "vuex-class";
@Component({
  components: {
     "graph": graph,
    "doudizhu-matchrules": doudizhuMatchRules,
    "doudizhu-matchstages": doudizhuMatchStages
  }
})
// @Component 修饰符注明了此类为一个 Vue 组件

export default class DoudizhuGameConfig extends Vue {}
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
