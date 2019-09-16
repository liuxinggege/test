<template>
  <div class="page-div" >
      <div class="header">
          <div class="back" @click="toHome"></div>
          <div v-for="(tab ,index) in tabs" :key="index" :class="iscur==index?'text cur':'text'" @click="iscur=index,tabChange(tab.tab)">
            {{tab.name}}
            <em v-if="tab.tab==='gonggao'&&gonggaoNotRead>0">{{gonggaoNotRead}}</em>
            <em v-if="tab.tab==='gonglue'&&gonglueNotRead>0">{{gonglueNotRead}}</em>
          </div>
      </div>
      <keep-alive> 
        <component v-bind:is="tabView"></component>
      </keep-alive> 
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SelfInfoState } from "../../store/stateInterface";
import { xutil } from "../../utils/xutil";
import { Toast } from "cube-ui";
import { utils } from "cfb/types";
import { Watch } from 'vue-property-decorator'
import Gonggao from './gonggao.vue';
import Gonglue from './gonglue.vue';
@Component({
  components: {
    "gonggao":Gonggao,
    "gonglue":Gonglue
  }
})
export default class Announcement extends Vue {

  tabView:string =  'gonggao';
  tabs:any[]= [{name: "公告",tab:"gonggao"}, {name: "攻略",tab:"gonglue"}];
  iscur:number =  0;
  gonggaoNotRead:number  = this.$store.state.home.gonggaoNotRead;
  gonglueNotRead:number = this.$store.state.home.gonglueNotRead;
  info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
  async  created() {
    this.tabView = this.$route.params.tab;
    if(this.tabView==="gonggao"){
      this.iscur=0;
    }else if(this.tabView==="gonglue"){
      this.iscur=1;
    }else{
      this.tabView='gonggao';
      this.iscur=0;
    }
    await xutil.myDispatch(this.$store, "GetAnnouncementNotRead", {}).then(()=>{
      this.gonggaoNotRead = this.$store.state.home.gonggaoNotRead;
      this.gonglueNotRead = this.$store.state.home.gonglueNotRead;
    });
  }
  tabChange(tab){
    this.tabView = tab;
  }
  toHome() {
    this.$router.push({ path: "/home" });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header{
    background: #fff; margin-bottom: 3vh;
    .text{
        height: 100%;@include middle;position: relative;
        em{@include middle;width: 5vw;height: 5vw;background: $red;border-radius: 50%;position: absolute;top: 10%;font-size: $size-w;text-indent: 0;color: #fff;margin-left: 2vw;}
        &.cur{color: $blue;}
    }
}
</style>
