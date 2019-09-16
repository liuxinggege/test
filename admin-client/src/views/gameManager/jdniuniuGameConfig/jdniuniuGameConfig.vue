<template>
  <div class="dashboard-outer">        
        <div>
            <jdniuniu-matchrules></jdniuniu-matchrules>
        </div>
        <div>
            <jdniuniu-matchstages></jdniuniu-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>      
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import jdniuniuMatchRules from "./jdniuniuMatchRules.vue";
import jdniuniuMatchStages from "./jdniuniuMatchStages.vue";
import graph from "./graph.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
     "graph": graph,
    "jdniuniu-matchrules": jdniuniuMatchRules,
    "jdniuniu-matchstages": jdniuniuMatchStages
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
