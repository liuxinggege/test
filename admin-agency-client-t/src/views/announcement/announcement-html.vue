<template>
  <div class="page-div" >
    <div class="header">
        <div @click="toHome" class="back"></div>
        <div class="text">公告</div>
    </div>
    <div class="items-div" v-if="!disable">
       <v-html-panel :url.asyc="item.url" ></v-html-panel>
    </div>
    <div class="items-content" v-else>
      <h1 >{{item.title}}</h1>
      <p> &nbsp&nbsp&nbsp&nbsp{{item.content}}</p>
      <span> {{item.createTime}}</span>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SelfInfoState } from "../../store/stateInterface";
import { xutil } from "../../utils/xutil";
import { Toast } from "cube-ui";
import { utils } from "cfb/types";
import HtmlPanel from './HtmlPanel.vue';
import {  Prop } from 'vue-property-decorator';
@Component({
  components: {
    "v-html-panel":HtmlPanel
  }
})
export default class Announcement_html extends Vue {
  item: any =  {};
  content: string =  "";
  path: string =  "";
  name: string =  "";
  tab: string =  "";
  disable:boolean = false;
  created(){
    this.item =this.$route.query.item;
    this.path =this.$route.query.path;
    this.name =this.$route.query.name;
    this.tab =this.$route.query.tab;
    if(this.item&&this.item.url!==""){
      this.disable = false;
    }else if(this.item&&this.item.content!==""){
       this.disable = true;
    }
  }
  toHome() {
    this.$router.push({name:this.path, path: this.path ,params:{tab:this.tab}});
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.items-div{
  width: 100%;
  height:1000px;
  overflow: auto;
}
img{
    width: 24px;
    height: 40px;
    content: none;
}
.items-content{
  margin: 10px 0;
   p{
  line-height: 50px;
  font-size: 40px;
  }
  h1{
    font-size: 50px;
    margin: 30px 0 20px 0 ;
    text-align: center;
  }
  span{
    font-size: 30px;
    margin: 100px 0 0 400px ;
    text-align: right;
  }
}

</style>
