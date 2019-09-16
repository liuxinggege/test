<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="在线充值">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">在线充值</span>
			</el-col>
			<!--工具条-->
			<span class="content_font"></span>
			<span>账号uid</span>
			<el-input v-model="uid" style="width:120px; margin:0px 20px 5px 10px"></el-input>
			<span>用户昵称</span>
			<el-input v-model="userName" style="width:120px; margin:0px 20px 5px 10px"></el-input>
			<span>账号</span>
			<el-input v-model="userAct" style="width:120px; margin:0px 20px 0px 10px"></el-input>
			<span>充值渠道</span>
			<el-input v-model="channel" style="width:120px; margin:5px 20px 0px 0px"></el-input>
			<span>注册渠道</span>
			<el-input v-model="userChannel" style="width:120px; margin:5px 20px 0px 10px"></el-input>
			<span>注册平台</span>
			<el-select v-model="registerPlatform" placeholder="请选择" style="width:110px; margin:0px 0px 0px 0px">
				<el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<br />
			<span>订单</span>
			<el-input v-model="id" style="width:200px; margin:5px 20px 0px 32px "></el-input>
			<span>三方订单</span>
			<el-input v-model="thirdOrderId" style="width:200px; margin:5px 20px 0px 32px "></el-input>
			<span>状态</span>
			<el-select v-model="payState" placeholder="请选择" style="margin:0px 0px 0px 10px">
				<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<br>
			<span>创建时间</span>
			<el-date-picker v-model="logTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
			</el-date-picker>
			<span>金币到账时间</span>
			<el-date-picker v-model="finishTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
			</el-date-picker>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
			<el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
			<!--列表-->
			<el-table :data="onlineCharge.transferData" max-height="460" border highlight-current-row style="width: 98%;">
				<el-table-column prop="createTime" label="订单创建时间" width="200" :formatter="submitTimeFunc" align="center"></el-table-column>
				<el-table-column prop="deliveredTime" label="金币到账时间" width="200" :formatter="deliveredTime" align="center"></el-table-column>
				<el-table-column prop="name" label="用户昵称" width="100" align="center"></el-table-column>
				<el-table-column prop="uid" label="用户id" width="120" align="center"></el-table-column>
        <el-table-column prop="pid" label="项目" width="100" align="center"  :formatter="pidFormat"></el-table-column>
				<el-table-column prop="act" label="账号" width="200" align="center"></el-table-column>
				<el-table-column prop="price" label="充值金额" width="100" align="center"></el-table-column>
        <el-table-column prop="goodsPrice" label="实际订单金额" width="100" align="center"></el-table-column>
				<el-table-column prop="payType" label="支付通道" width="120" align="center"></el-table-column>
				<el-table-column prop="channel" label="充值渠道" width="120" align="center" :formatter="channelFormat"></el-table-column>
				<el-table-column prop="userChannel" label="注册渠道" width="120" :formatter="userChannelFunc" align="center"></el-table-column>
				<el-table-column prop="deviceType" label="注册平台" width="120" align="center"></el-table-column>
				<el-table-column prop="_id" label="订单ID" width="250" align="center"></el-table-column>
				<el-table-column prop="thirdOrderId" label="三方订单号" width="250" align="center"></el-table-column>
				<el-table-column prop="paidTime" label="玩家支付时间" width="200" :formatter="paidTime" align="center"></el-table-column>
				<el-table-column prop="state" label="订单状态" min-width="200" align="center">
					<template slot-scope="scope">
						<el-tag :type="filterTag(scope.row.state)" close-transition>{{stateFunc(scope.row.state)}}</el-tag>
						<!-- <el-button type="warning" plain size="small" 
						@click="callback(scope.row)"
						v-if="scope.row.state === 'paid'">
						回调
					</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="onlineCharge.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { OnlineChargeState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
//OnlineCharge
interface QueryItem {
  zone?: number;
  type?: string;
  uid?: string;
  name?: string;
  act?: string;
  orderId?: string;
  thirdOrderId?: string;
  channel?: string;
  userChannel?: string;
  registerPlatform?: string;
  startTime?: Date;
  endTime?: Date;
  finishStartTime?: Date;
  finishEndTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class OnlineCharge extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  onlineCharge: OnlineChargeState = this.$store.state.onlineCharge; //表单数据
  userId: string = "";
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  logTime: Date[] = [this.startTime,this.endTime];
  finishTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  type: string = "1";
  fromUid: string = "";
  toUid: string = "";
  pidList: any[] = [];
  // totalCount: number = 0;
  stateOptions = [
    { value: "", label: "全部" },
    { value: "ordering", label: "开始下订单" },
    { value: "ordered", label: "下订单成功" },
    { value: "paid", label: "支付成功" },
    { value: "delivered", label: "金币到账" }
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
  uid = "";
  userName = ""; // 用户姓名
  userAct = ""; // 用户账号
  createTime = ""; // 开始时间
  time = ""; // 结束时间
  id = ""; // 订单
  thirdOrderId = ""; // 三方订单
  channel = ""; // 充值渠道

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetOnlineCharge", queryItem).then(() => {});
  }
  searchData(){
    this.page=1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.payState) {
      temp.type = this.payState;
    }
    if (this.uid) {
      temp.uid = this.uid;
    }
    if (this.userName) {
      temp.name = this.userName;
    }
    if (this.userAct) {
      temp.act = this.userAct;
    }
    if (this.id) {
      temp.orderId = this.id;
    }
    if (this.thirdOrderId) {
      temp.thirdOrderId = this.thirdOrderId;
    }
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.userChannel) {
      temp.userChannel = this.userChannel;
    }
    if (this.registerPlatform) {
      temp.registerPlatform = this.registerPlatform;
    }
    if (this.logTime && this.logTime[0]) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    if (this.finishTime && this.finishTime[0]) {
      temp.finishStartTime = this.finishTime[0];
      temp.finishEndTime = this.finishTime[1];
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
  //整形
  channelFormat(row, column) {
    return row.channel === "" ? "官方" : row.channel;
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
  filterTag(state) {
    if (state === "ordering") {
      return "primary";
    }
    if (state === "ordered") {
      return "success";
    }
    if (state === "paid") {
      return "success";
    }
    if (state === "delivered") {
      return "success";
    }
  }

  stateFunc(state) {
    if (state === "ordered") {
      return "下订单成功";
    }
    if (state === "ordering") {
      return "开始下订单";
    }
    if (state === "paid") {
      return "支付成功";
    }
    if (state === "delivered") {
      return "金币到账";
    }
  }

  userChannelFunc(row, column) {
    if (row.userChannel === "") {
      return "官方";
    } else {
      return row.userChannel;
    }
  }

  deliveredTime(row, column) {
    if (row.deliveredTime) {
      let date = new Date(row.deliveredTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  paidTime(row, column) {
    if (row.paidTime) {
      let date = new Date(row.paidTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  //导出excle
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "订单创建时间", field: "createTime", type: "Date" },
      { title: "金币到账时间", field: "deliveredTime", type: "Date" },
      { title: "用户昵称", field: "name", type: "string" },
      { title: "用户id", field: "uid", type: "string" },
      { title: "账号", field: "act", type: "string" },
      { title: "充值金额", field: "price", type: "string" },
      { title: "实际订单金额", field: "goodsPrice", type: "string" },
      { title: "支付通道", field: "payType", type: "string" },
      { title: "充值渠道", field: "channel", type: "string" },
      { title: "注册渠道", field: "userChannel", type: "string" },
      { title: "注册平台", field: "deviceType", type: "string" },
      { title: "订单ID", field: "_id", type: "string" },
      { title: "三方订单号", field: "thirdOrderId", type: "string" },
      { title: "订单状态", field: "state", type: "onlineCharge_state" }
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    if (!Object.keys(queryItem).length) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    myDispatch(this.$store, "GetOnlineChargeExcel", queryItem).then(ret => {
      downloadExcel(ret,this);
    });
  }
  //金币未到账号手动回调
  callback(row) {
    console.log(row);
    let parameter = {};
    myDispatch(this.$store, "OnlineRechargeCb", parameter); //通知后台发送http请求
  }
  pidFormat(row, column){
    let name = "";
    this.pidList.forEach(element => {
        if(element.pid === row.pid){
          name =  element.name ;
        }
    });
    return name ;
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
