<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "APP"
});   

</script>

<style rel="stylesheet/scss" lang="scss" >
// @font-face {
//   font-family: "fang";
//   src: url("./assets/fonts/fang.ttf");
// }

// #app {
//   -moz-osx-font-smoothing: grayscale;
//   -webkit-font-smoothing: antialiased;
//   text-rendering: optimizeLegibility;
//   font-family: "fang";
// }

//aaa
</style>
