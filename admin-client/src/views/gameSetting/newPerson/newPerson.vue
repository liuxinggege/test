<template>
  <div class="dashboard-outer">        
        <div>
            <newBieBonus></newBieBonus>
             <bindBonus></bindBonus>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import newBieBonus from "./newBieBonus.vue";
import bindBonus from "./bindBonus.vue";
import { myDispatch } from "../../../utils/index.js"
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "newBieBonus": newBieBonus,
    "bindBonus": bindBonus
  }
})
export default class newPerson extends Vue {}
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
