<template>
  <div class="dashboard-outer">
    <subGamesLobbyMarquee></subGamesLobbyMarquee>
    <subFullServiceMarquee></subFullServiceMarquee>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import subFullServiceMarquee from "./subFullServiceMarquee.vue";
import subGamesLobbyMarquee from "./subGamesLobbyMarquee.vue";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    subFullServiceMarquee: subFullServiceMarquee, //全服公告
    subGamesLobbyMarquee: subGamesLobbyMarquee //游戏大厅公告
  }
})
export default class Marquees extends Vue {}
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
  &-marquee {
    margin-top: 25px;
    position: relative;
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
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
th {
  text-align: center !important;
}
</style>
