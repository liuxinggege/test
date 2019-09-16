
<template>
<div class="imgBox"></div>
</template>
 

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";

@Component
export default class ActivityList extends Vue {
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.imgBox{
  img{width: 100vw;height: auto;}
}
</style>
