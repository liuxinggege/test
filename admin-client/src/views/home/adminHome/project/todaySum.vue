<template>
    <el-card class="todaySum">
        <el-row>
            <span>今日概况</span>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh" style="position:absolute; top:0; right:0; z-index:99;">刷新</el-button>
        </el-row>
        <el-row style="margin: 15px 0">
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.totalChargeAmt}}
                <br>
                <span class="gray">总充值</span>
            </el-col>
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.agentChargeAmt}}
                <br>
                <span class="gray">代理充值</span>
            </el-col>
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.newUserChargeAmt}}
                <br>
                <span class="gray">新增充值</span>
            </el-col>
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />{{todaySum.totalChargeUserCount}}
                <br>
                <span class="gray">充值人数</span>
            </el-col>
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.totalWithdrawTax}}
                <br>
                <span class="gray">兑换税收</span>
            </el-col>           
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.gameTax}}
                <br>
                <span class="gray">游戏税收</span>
            </el-col>
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.totalWithdrawAmt}}
                <br>
                <span class="gray">兑换金额</span>
            </el-col>            
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.agencySettleAmt}}
                <br>
                <span class="gray">代理兑换</span>
            </el-col>            
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{todaySum.totalProfit}}
                <br>
                <span class="gray">营收</span>
            </el-col>     
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />{{todaySum.newUserCount}}
                <br>
                <span class="gray">新增用户</span>
            </el-col>      
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />{{todaySum.loginUserCount}}
                <br>
                <span class="gray">登录用户</span>
            </el-col>   
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{Math.floor(todaySum.payRate * 100)/100}}
                <br>
                <span class="gray">付费率</span>
            </el-col>
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{Math.floor(todaySum.newUserPayRate * 100)/100}}
                <br>
                <span class="gray">新增付费率</span>
            </el-col>           
            <el-col :span="2" align="center" class="todayBar">
                <svg-icon icon-class="money" class-name="card-panel-icon" />{{Math.floor(todaySum.profitRate * 100)/100}}
                <br>
                <span class="gray">营收比</span>
            </el-col>
        </el-row>
    </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../../../utils/index";
// import { Getter, Action } from "vuex-class";
import { formUtil } from "../../../../utils/formatUtils";
import { AdminHome } from "../../../../store/stateInterface";
import { TodaySum } from "../../../../store/modules/home/adminHome";
import {  Prop } from 'vue-property-decorator'
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Login extends Vue {
  //生命周期钩子函数
  @Prop(String) pid!: string;
  created() {
    this.loadData();
  }
  //初始化数据
  adminHome: AdminHome = this.$store.state.adminHome;
  todaySum: TodaySum = this.adminHome.todaySum;
  //函数
  refresh() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetPTodaySum", {pid:this.pid}, true).then(() => {
      this.todaySum = this.adminHome.todaySum;
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
div .el-row {
  margin: 8px 0 !important;
}
// .el-card__body {
//   padding: 0;
// }
.todayBar:hover {
  color: cadetblue;
  transform: scale(1.4);
}
.todayBar {
  margin-top: 10px;
}
.todaySum {
  padding: 10px;
}
.gray {
  color: gray;
  font-size: 10px;
}
</style>