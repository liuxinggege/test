<template>
   <div class="content">
   </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../utils/index.js";

@Component
export default class SelfInfo extends Vue {
 sunbetUrl:string;
 loginResult = this.$store.state.user;
  created() {
  }
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.sunbet{
    flex: 1;
}
</style>
