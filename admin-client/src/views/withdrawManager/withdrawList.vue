<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col  class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="兑换列表">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">兑换列表</span>
			</el-col>
			<span class="content_font"></span>
			<span>状态</span>
			<el-select v-model="state" style="margin:5px 30px 5px 25px" placeholder="请选择">
				<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<span>异常</span>
			<el-select v-model="value" style="margin:5px 30px 5px 10px" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<span>订单ID(game)</span>
			<el-input v-model="orderId" style="width:120px; margin:5px 0px 5px 10px"></el-input><br>
			<span>用户ID</span>
			<el-input v-model="userUid" style="width:120px; margin:5px 0px 5px 10px"></el-input>
			<span>提现IP</span>
			<el-input v-model="withdrawIp" style="width:120px; margin:5px 100px 5px 10px"></el-input>
			<span>渠道包</span>
			<el-input v-model="channel" placeholder="官方请输入'－'" style="width:120px; margin:5px 90px 5px 10px"></el-input>
			<span>支付宝</span>
			<el-input v-model="alipayAccount" style="width:120px; margin:5px 0px 5px 10px"></el-input><br>
			<span>处理时间</span>
			<el-date-picker v-model="dealTime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:5px 0px 5px 0px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
			<span>创建时间</span>
			<el-date-picker v-model="submitTime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:5px 0px 5px 0px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
			<el-button-group>
				<el-button type="success" @click="reset" style="margin:0px 0px 0px 50px">重置</el-button>
				<el-button type="success" @click="loadData" style="margin:0px 0px 0px 0px">搜索</el-button>
			</el-button-group>
		
			<!--列表-->
			<el-table :data="withdrawList.withdrawList" border highlight-current-row style="width: 99%;margin-top:20px" max-height="500">
				<el-table-column prop="createTime" label="提交时间" width="170" :formatter="submitTimeFunc" align="center"></el-table-column>
				<el-table-column prop="finishTime" label="处理时间" width="170" :formatter="finishTimeFunc" align="center"></el-table-column>
				<el-table-column prop="uid" label="用户ID" width="170"  align="center"></el-table-column>
				<el-table-column prop="id" label="订单号(game)" width="230" align="center"></el-table-column>
				<el-table-column prop="orderId" label="订单号(bill)" width="230" align="center"></el-table-column>
				<el-table-column prop="typeName" label="订单类型" width="100" align="center"></el-table-column>
				<el-table-column prop="totalRecharge" label="总充值" min-width="100" align="center"></el-table-column>
				<el-table-column prop="totalAgentRecharge" label="代理充值" min-width="100" align="center"></el-table-column>
				<el-table-column prop="finishedWithdrawAmount" label="总兑换" min-width="100" align="center"></el-table-column>
				<el-table-column prop="alipayAccount" label="支付宝账号" min-width="200" align="center"></el-table-column>
				<el-table-column prop="alipayRealName" label="支付宝名字" min-width="100" align="center"></el-table-column>
				<el-table-column prop="bankCardNumber" label="银行卡账号" min-width="200" align="center"></el-table-column>
				<el-table-column prop="bankOfCreditCard" label="银行名" min-width="100" align="center"></el-table-column>
				<el-table-column prop="bankCardRealName" label="银行用户名" min-width="100" align="center"></el-table-column>
				<el-table-column prop="userMoneyPre" label="兑换前金币" width="120" align="center"></el-table-column>
				<el-table-column prop="money" label="兑换金额" width="100" align="center"></el-table-column>
				<el-table-column prop="userMoneyAfter" label="提现后金额" width="120" align="center"></el-table-column>
				<el-table-column prop="tax" label="税收" width="120" align="center"></el-table-column>
				<el-table-column prop="unfinishedWithdrawAmount" label="累计申请中兑换" width="120" align="center"></el-table-column>
				<el-table-column prop="ip" label="登录ip" width="150" align="center"></el-table-column>
				<el-table-column prop="checkDesc" label="审核" width="120" align="center"></el-table-column>
				<el-table-column prop="channel" label="渠道" width="120" align="center"></el-table-column>
				<el-table-column prop="stateName" label="订单状态" min-width="200" align="center"></el-table-column>				
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
				@current-change="handleCurrentChange" 
				@size-change="handleSizeChange" 
				:current-page="page" 
				:page-sizes="[10,20,30,50]" 
				:page-size="count" 
				:total="withdrawList.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { WithdrawList } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//BankCardExceotion
interface QueryItem {
  state?: string;
  uid?: string;
  autoCheckFailReason?: string;
  ip?: string;
  id?: string;
  channel?: string;
  alipayAccount?: string;
  fields?: string;
  createTimeBegin?: Date;
  createTimeEnd?: Date;
  finishTimeBegin?: Date;
  finishTimeEnd?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class BankCardExceotion extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  withdrawList: WithdrawList = this.$store.state.withdrawList; //表单数据

  page: number = 1; //当前页
  count: number = 10;
  stateOptions = [
    { value: "", label: "无" },
    { value: 2, label: "人工审核" },
    { value: 1, label: "自动审核" },
    { value: 3, label: "代理接单" },
    { value: 4, label: "用户接单" },
    { value: 5, label: "转账中" },
    { value: 6, label: "完成" }
  ];
  options = [
    { value: "", label: "无" },
    { value: 7, label: "全部异常类型" },
    { value: 1, label: "游戏时长不足" },
    { value: 2, label: "今日总兑换金额超限" },
    { value: 3, label: "今日总兑换次数超限" },
    { value: 4, label: "总充值不足" },
    { value: 5, label: "提现次数不足" },
    { value: 6, label: "抽查" }
  ];
  fields = "createTime,finishTime,uid,id,type,orderId,totalRecharge,totalAgentRecharge,finishedWithdrawAmount,alipayAccount,status,autoCheckFailReason,alipayRealName,bankCardRealName,bankCardNumber,bankOfCreditCard,userMoneyPre,money,userMoneyAfter,tax,unfinishedWithdrawAmount,typeName,ip,stateName,unfinishedWithdrawAmount,state,channel,checkDesc";
  state: string = "";
  value: string = "";
  orderId: string = "";
  userUid: string = "";
  withdrawIp: string = "";
  channel: string = "";
  alipayAccount: string = "";
  dealTime: Date[] = [];
  submitTime: Date[] = [];

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetWithdrawList", queryItem).then(() => {});
  }
  reset() {
    this.userUid = "";
    this.state = "";
    this.value = "";
    this.orderId = "";
    this.userUid = "";
    this.withdrawIp = "";
    this.channel = "";
    this.alipayAccount = "";
    this.dealTime = [];
    this.submitTime = [];
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.userUid) {
      temp.uid = this.userUid;
    }
    if (this.state) {
      temp.state = this.state;
    }
    if (this.value) {
      temp.autoCheckFailReason = this.value;
    }
    if (this.orderId) {
      temp.id = this.orderId;
    }
    if (this.userUid) {
      temp.uid = this.userUid;
    }
    if (this.withdrawIp) {
      temp.ip = this.withdrawIp;
    }
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.alipayAccount) {
      temp.alipayAccount = this.alipayAccount;
    }
    temp.page = this.page;
    temp.count = this.count;
    temp.fields = this.fields;
    if (this.submitTime && this.submitTime[0]) {
      temp.createTimeBegin = this.submitTime[0];
      temp.createTimeEnd = this.submitTime[1];
    }
    if (this.dealTime && this.dealTime[0]) {
      temp.finishTimeBegin = this.dealTime[0];
      temp.finishTimeEnd = this.dealTime[1];
    }
    return temp;
  }

  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
  submitTimeFunc(row, column) {
    if (row.createTime) {
      let date = new Date(row.createTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  finishTimeFunc(row, column) {
    if (row.finishTime) {
      let date = new Date(row.finishTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
