<template>
  <div style="width:100%">
    <!-- <mu-circular-progress :size="40" v-if="loading"/> -->
    <div class="markDiv" v-html="html"></div>
  </div>
</template>
<style>

</style>
<script lang="ts">
import Vue from "vue";
import axios from 'axios';
import { axiosOther } from "../../utils/request";
import Component from "vue-class-component";
import {  Prop } from 'vue-property-decorator';
@Component
export default class Home extends Vue {
  @Prop(String) url!: string;
  loading:boolean = true;
  html:string = "";
  mounted() {
    this.load(this.url)
  }
  load (url) {
    if (url && url.length > 0) {
      // 加载中
      this.loading = true
      let param = {
        accept: 'text/html, text/plain'
      }
      axiosOther.get(url).then((response) => {
        this.loading = false
        this.html = response.data
      }).catch((error) => { console.log(error);
        this.loading = false
        this.html = '加载失败'
      })
    }
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .markDiv{
    width: 100%!important;
    img{width: 100%!important;}
  }
    #xmyBackground{
   img{width: 100%!important;}
    }
    .xmyeditor{
   img{width: 100%!important;}
    }
</style>
