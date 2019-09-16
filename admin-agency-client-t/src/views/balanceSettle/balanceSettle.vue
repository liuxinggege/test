<template>
  <div class="content tab5">
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
import { BalanceRecordState } from "../../store/stateInterface";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
import ApplySettle from './applySettle.vue';
import SettleRecord from './settleRecord.vue';
import tabbar from '../../components/tabbar.vue'

@Component({
  components: {
    "applySettle":ApplySettle,
    "settleRecord":SettleRecord,
    tabbar
  }
})
export default class BalanceRecord extends Vue {
  tabView:string =  'applySettle';
  tabs:any[]= [{name: "申请结算",tab:"applySettle"}, {name: "订单记录",tab:"settleRecord"}];
  iscur:number =  0;
  showContent: boolean = false;
  created() {
    if(this.tabView===undefined||this.tabView==='applySettle'){
      this.tabView='applySettle';
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
.content{height: 90vh;min-height: 0;}
.tabNav{
    height: 8vh;display: flex;align-items: center;
    li{flex: 1;font-size: $size-l; text-align: center;color:$titleColor;}
    li.cur{color: $blue;}
}
</style>
