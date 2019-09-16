<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理兑换审核">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">代理兑换审核</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>玩家ID</span>
      <el-input v-model="userId" style="width:120px; margin:5px 20px 5px 25px"></el-input>
      <span>订单码</span>
      <el-input v-model="orderId" style="width:120px; margin:5px 20px 5px 10px"></el-input>
      <span>提现金额</span>
      <el-input v-model="withdrawMoney" style="width:120px; margin:5px 20px 5px 10px"></el-input>
      <span>状态</span>
      <el-select v-model="orderState" style="margin:5px 20px 5px 10px" placeholder="请选择">
          <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <br/>
      <span>提交时间</span>
      <el-date-picker v-model="logTime" style="margin:5px 20px 5px 10px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
      <el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
      
        <!--列表-->
      <el-table :data="agentException.transferData" border highlight-current-row style="width: 100%;" max-height="300" >
          <el-table-column prop="createTime" label="提交时间" width="170" :formatter="submitTimeFunc" align="center"></el-table-column>
          <el-table-column prop="uid" label="玩家ID" width="150" align="center"></el-table-column>
          <el-table-column prop="id" label="订单ID" width="150" align="center"></el-table-column>
          <el-table-column prop="money" label="提现额度" min-width="120" align="center"></el-table-column>
          <el-table-column prop="userMoneyPre" label="提现前金额(保险箱)" width="120" align="center"></el-table-column>
          <el-table-column prop="userMoneyAfter" label="提现后金额(保险箱)" width="120" align="center"></el-table-column>
          <el-table-column prop="ip" label="IP" width="120" align="center"></el-table-column>
          <el-table-column prop="unfinishedWithdrawAmount" label="累计申请中兑换" min-width="100" align="center"></el-table-column>
          <el-table-column prop="id" label="生成订单码" min-width="200" align="center"></el-table-column>
          <el-table-column prop="stateName" label="订单状态" min-width="100" align="center"></el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
              <template slot-scope="scope">
                  <el-button v-if="scope.row.state==2" type="text" @click="pass(scope.$index, scope.row)">通过</el-button>
                  <el-button v-if="scope.row.state==2" type="text" @click="refuse(scope.$index, scope.row)">拒绝</el-button>
              </template>
          </el-table-column>
      </el-table>
       <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
          :current-page="page" 
          :page-sizes="[10,20,30,50]" 
          :page-size="count" 
          :total="agentException.totalCount">
        </el-pagination>
      </el-col>
      <el-dialog :visible.sync="dialogOperVisible">
            <div style="margin:0px 0px 40px 50px;font-size:20px">
                <span>{{ok?"通过":"拒绝"}}订单ID:</span>
                <span>{{curId}}</span>
            </div>
            <div style="margin:0px 0px 10px 50px;font-size:20px">
                <span>描述:</span>
            </div>
            <div style="margin:0px 0px 0px 50px;font-size:20px">
                <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="descInfo">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
	  </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AgentExceptionState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//AgentException
interface QueryItem {
  zone?: number;
  type?: number;
  uid?: string;
  money?: string;
  state?: string;
  id?: string;
  channel?: string;
  fields?: string;
  createTimeBegin?: Date;
  createTimeEnd?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgentException extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  agentException: AgentExceptionState = this.$store.state.agentException; //表单数据
  userId: string = "";
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  type: string = "1";
  fromUid: string = "";
  toUid: string = "";
  // totalCount: number = 0;
  stateOptions = [
    { value: "", label: "无" },
    { value: 2, label: "人工审核" },
    { value: 1, label: "自动审核" },
    { value: 3, label: "代理接单" },
    { value: 4, label: "用户接单" },
    { value: 5, label: "转账中" },
    { value: 6, label: "完成" }
  ];
  platformOptions = [
    { value: "", label: "所有" },
    { value: "web", label: "web" },
    { value: "android", label: "android" },
    { value: "ios", label: "ios" }
  ];

  registerPlatform = ""; // 注册平台
  userChannel = ""; // 注册渠道
  payState = ""; // 支付状态

  userAct = ""; // 用户账号
  createTime = ""; // 开始时间
  time = ""; // 结束时间
  id = ""; // 订单
  channel = ""; // 充值渠道
  fields = "finishTime,createTime,uid,id,channel,account,name,money,tax,stateName,owner,userMoneyPre,userMoneyAfter,ip,totalRecharge,unfinishedWithdrawAmount,state";
  orderState = "";

  orderId = ""; // 订单码
  withdrawMoney = ""; // 提现金额
  dialogOperVisible: boolean = false;
  ok: boolean = false;
  descInfo = "";
  curId = "";

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetAgentException", queryItem).then(() => {});
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};

    if (this.userId) {
      temp.uid = this.userId;
    }

    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.id) {
      temp.id = this.id;
    }
    temp.zone = -7;
    temp.type = 1;
    temp.page = this.page;
    temp.count = this.count;
    temp.fields = this.fields;
    if (this.logTime && this.logTime.length === 2) {
      temp.createTimeBegin = this.logTime[0];
      temp.createTimeEnd = this.logTime[1];
    }
    return temp;
  }
  //日期整形
  timeFormat1(row, column) {
    let date = new Date(row.transferTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  timeFormat2(row, column) {
    let date = new Date(row.logTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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

  cancelEdit() {
    this.dialogOperVisible = false;
  }

  pass(index, row) {
    this.dialogOperVisible = true;
    this.ok = true;
    this.curId = row.id;
    this.update();
  }
  refuse(index, row) {
    this.dialogOperVisible = true;
    this.ok = false;
    this.curId = row.id;
  }
  update() {}

  userChannelFunc(row, column) {
    if (row.userChannel === "") {
      return "官方";
    } else {
      return row.userChannel;
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
