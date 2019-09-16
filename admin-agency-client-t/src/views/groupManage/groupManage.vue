
<template>
	<div class="content tab3" >
      <ul class="tabNav">
          <li v-for="(tab ,index) in tabs" :key="index" :class="iscur==index?'cur':''" @click="iscur=index,tabChange(tab.tab)">{{tab.name}}</li>
      </ul>
      <keep-alive> 
        <component v-bind:is="tabView"></component>
      </keep-alive> 
      <tabbar></tabbar>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
import UserList from './userList.vue';
import AgencyList from './agencyList.vue';
import tabbar from '../../components/tabbar.vue'

@Component({
  components: {
    "userList":UserList,
    "agencyList":AgencyList,
    tabbar
  }
})
export default class SpreadStatic extends Vue {
  //
  tabView:string =  'userList';
  tabs:any[]= [{name: "玩家列表",tab:"userList"}, {name: "代理列表",tab:"agencyList"}];
  iscur:number =  0;
  page: number = 1;
  count: number = 10;
  created() {
    this.tabView = this.$route.params.tab;
    if(this.tabView===undefined){
      this.tabView='userList';
      this.iscur=0;
    }else{
      this.iscur=1;
    }
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
.tabNav{
    height: 8vh;display: flex;align-items: center;
    li{flex: 1;font-size: $size-l;text-align: center;}
    li.cur{color: $blue;}
}
.content{min-height: 0;}
</style>