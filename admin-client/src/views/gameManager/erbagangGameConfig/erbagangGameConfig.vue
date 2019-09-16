<template>
    <div class="dashboard-outer">
        <div>
            <erbagang-matchrules></erbagang-matchrules>
        </div>
        <div>
            <erbagang-matchstages></erbagang-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import erbagangMatchRules from "./erbagangMatchRules.vue";
import erbagangMatchStages from "./erbagangMatchStages.vue";
import graph from "./graph.vue";

// import { Getter, Action } from "vuex-class";
@Component({
    components: {
        "graph": graph,
        "erbagang-matchrules": erbagangMatchRules,
        "erbagang-matchstages": erbagangMatchStages
    }
})
// @Component 修饰符注明了此类为一个 Vue 组件

export default class ErbagangGameConfig extends Vue { }
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
