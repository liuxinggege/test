<template>
  <div class="dashboard-outer" style="display:flex">        
        <div>
            <stopServer></stopServer>
        </div>
        <div>
            <allowLoginIP></allowLoginIP>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import allowLoginIP from "./allowLoginIP.vue";
import stopServer from "./stopServer.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "allowLoginIP": allowLoginIP,
    "stopServer": stopServer
  }
})
export default class DownForMaintenance extends Vue {}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
</style>
