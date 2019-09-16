<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="官方兑换">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">官方兑换</span>
      </el-col>
      <!--工具条-->
      <span class="content_font" ></span>
      <span>账号uid</span>
      <el-input v-model="uid" style="width:120px; margin:0px 20px 5px 10px"></el-input>
      <span>用户昵称</span>
      <el-input v-model="userName" style="width:120px; margin:0px 20px 5px 10px"></el-input>
      <span>账号</span>
      <el-input v-model="userAct" style="width:120px; margin:0px 20px 0px 10px"></el-input>
      <span>订单</span>
      <el-input v-model="id" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <br>
      <span>渠道</span>
      <el-input v-model="channel"  style="width:120px; margin:5px 20px 0px 0px"></el-input>
      <span>类型</span>
      <el-select v-model="orderState" placeholder="请选择" style="margin:0px 0px 0px 10px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span>完成时间</span>
      <el-date-picker v-model="logTime" type="datetimerange"
        value-format='yyyy-MM-dd HH:mm:ss' 
        style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
      </el-date-picker>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
     
     <!--列表-->
      <el-table :data="officialWithdraw.transferData" max-height="460" border highlight-current-row style="width: 100%;">
        <el-table-column prop="createTime" label="提交时间" width="200" :formatter="submitTimeFunc" align="center"></el-table-column>
        <el-table-column prop="finishTime" label="完成时间" width="200" :formatter="billRecordsTime" align="center"></el-table-column>        
        <el-table-column prop="uid" label="玩家ID" width="120" align="center"></el-table-column>
        <el-table-column prop="id" label="订单ID" width="250" align="center"></el-table-column>
        <el-table-column prop="name" label="用户昵称" width="100" align="center"></el-table-column>
        <el-table-column prop="account" label="用户账号" width="200" align="center"></el-table-column>
        <el-table-column prop="channel" label="渠道" width="120" align="center"></el-table-column>
        <el-table-column prop="money" label="提现额度" min-width="100" align="center"></el-table-column>
        <el-table-column prop="tax" label="手续费" width="130" align="center"></el-table-column>
        <el-table-column prop="userMoneyPre" label="提现前金额(保险箱)" width="120" align="center"></el-table-column>
        <el-table-column prop="userMoneyAfter" label="提现后金额(保险箱)" width="120" align="center"></el-table-column>        
        <el-table-column prop="totalRecharge" label="玩家总充值" min-width="100" align="center"></el-table-column>
        <el-table-column prop="unfinishedWithdrawAmount" label="累计申请中兑换" min-width="100" align="center"></el-table-column>
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
          :total="officialWithdraw.totalCount">
        </el-pagination>
      </el-col>
	  </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { OfficialWithdrawState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//OfficialWithdraw
interface QueryItem {
  type?: number;
  uid?: string;
  name?: string;
  act?: string;
  id?: string;
  channel?: string;
  fields?: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class OfficialWithdraw extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  officialWithdraw: OfficialWithdrawState = this.$store.state.officialWithdraw; //表单数据
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  logTime: Date[] = [this.startTime,this.endTime];
  page: number = 1; //当前页
  count: number = 10;
  // totalCount: number = 0;
  stateOptions = [
    { value: "", label: "全部" },
    { value: 1, label: "支付宝兑换" },
    { value: 2, label: "银行卡兑换" }
  ];

  uid = "";
  userName = ""; // 用户姓名
  userAct = ""; // 用户账号
  time = ""; // 结束时间
  id = ""; // 订单
  channel = ""; // 渠道
  fields = "finishTime,createTime,uid,id,channel,account,name,money,tax,stateName,owner,userMoneyPre,userMoneyAfter,ip,totalRecharge,unfinishedWithdrawAmount,state";
  orderState = "";

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetOfficialWithdraw", queryItem).then(() => {});
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.uid) {
      temp.uid = this.uid;
    }
    if (this.userName) {
      temp.name = this.userName;
    }
    if (this.userAct) {
      temp.act = this.userAct;
    }
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.id) {
      temp.id = this.id;
    }
    temp.type = 1;
    temp.page = this.page;
    temp.count = this.count;
    temp.fields = this.fields;
    if (this.logTime && this.logTime[0]) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
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

  billRecordsTime(row, column) {
    if (row.time) {
      let date = new Date(row.time);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
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
