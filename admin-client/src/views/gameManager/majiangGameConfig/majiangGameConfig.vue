<template>
  <div class="dashboard-outer">        
        <div>
            <majiang-matchrules></majiang-matchrules>
        </div>
        <div>
            <majiang-matchstages></majiang-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>      
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import majiangMatchRules from "./majiangMatchRules.vue";
import majiangMatchStages from "./majiangMatchStages.vue";
import graph from "./graph.vue";

// import { Getter, Action } from "vuex-class";
@Component({
  components: {
     "graph": graph,
    "majiang-matchrules": majiangMatchRules,
    "majiang-matchstages": majiangMatchStages
  }
})
// @Component 修饰符注明了此类为一个 Vue 组件

export default class MajingGameConfig extends Vue {}
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
