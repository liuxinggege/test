<template>
    <div >
		<div style="height:100px">
			<el-col class="toolbar1" style="padding:-20px 20px;">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="普通用户信息"></el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">属性详情({{uid}})</span>  
				<el-button type="primary" @click="refrsh" style="margin: 20px;">刷新</el-button>
			</el-col>
		</div> 		
		<div>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 30px">当前剩余金币</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.gold||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">当日充值</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px' >{{userAttribution.todayCharge||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 92px">当日输赢</span>
				<span type='text' style='width:100px; margin:10px 10px 10px 0px'>{{userAttribution.todayWinAndLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">当日累积提现</span>
				<span type='text' style='width:100px; margin:10px 10px 10px 0px'>{{userAttribution.todayWithdraw||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">当日游戏时长</span>
				<span type='text' style='width:100px; margin:10px 0px 10px 0px'>{{secToString(userAttribution.todayGameTime) ||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 75px">总充值</span>
				<span type='text' style='width:100px; margin:10px 5px 10px 0px'>{{userAttribution.totalCharge||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 108px">总输赢</span>
				<span type='text' style='width:100px; margin:10px 10px 10px 0px'>{{userAttribution.totalWinAndLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">累积提现金额</span>
				<span type='text' style='width:100px; margin:10px 0px 10px 0px'>{{userAttribution.totalWithdrawMoney||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">金花</span>
				<span type='text' style='width:100px; margin:10px 10px 10px 0px'>{{userAttribution.jinhuaWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积金花次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.jinhuaRound||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 92px">今日税收</span>
				<span type='text' style='width:100px; margin:10px 10px 10px 0px'>{{Math.floor(userAttribution.todayTax*100)/100}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 110px">总税收</span>
				<span type='text' style='width:100px; margin:10px 0px 10px 0px'>{{Math.floor(userAttribution.totalTax*100)/100}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">抢庄牛牛</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.niuniuWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 30px">累积抢庄牛牛次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.niuniuRound||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 45px">总徒弟赚钱金币</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.masterGet||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">百人牛牛</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.brniuniuWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 30px">累积百人牛牛次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.brniuniuRound||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 100px">IP</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.ip}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 80px">IP详细地址</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.location||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 60px">血战到底</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.xuezhanWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 30px">累积血战到底次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.xuezhanRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">梭哈</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.suohaWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积梭哈次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.suohaRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">红黑</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.hongheiWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积红黑次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.hongheiRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">龙虎斗</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.longhuWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积龙虎斗次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.longhuRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">斗地主</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.doudizhuWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积斗地主次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.doudizhuRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">捕鱼</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.buyuWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积捕鱼次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.buyuRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">经典牛牛</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.jdniuniuWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积经典牛牛次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.jdniuniuRound||0}}</span>
			</el-col>
			</el-row>
			<el-row :gutter="20">
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 90px">跑得快</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.paodekuaiWinLose||0}}</span>
			</el-col>
			<el-col :span="6">
				<span style="font-size:12pt; margin:10px 10px 10px 62px">累积跑得快次数</span>
				<span type='text' style='width:100px; margin:10px 30px 10px 0px'>{{userAttribution.paodekuaiRound||0}}</span>
			</el-col>
			</el-row>
     	</div> 
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { Attribution } from "../store/stateInterface";
import { UserAttribution } from "../store/modules/userManager/userAttribution";
import { myDispatch, secToString } from "../utils/index.js";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GenUserAttribution extends Vue {
  //初始化数据
  uid = this.$attrs.curUid;
  attribution: Attribution = this.$store.state.attribution;
  userAttribution: UserAttribution = this.attribution.userAttribution;

  created() {
    this.uid = this.$attrs.curUid;
    this.loadData();
  }
  refrsh() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetAttribution", this.uid).then(() => {
      this.userAttribution = this.attribution.userAttribution;
    });
  }
  secToString(value) {
    return secToString(value);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 0px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 10px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: sans-serif;
  color: #a0a0a0;
}

.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}

.content_font {
  font-size: 14px;
  font-weight: 700;
}
</style>
