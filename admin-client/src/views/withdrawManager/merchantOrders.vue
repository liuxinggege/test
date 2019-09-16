<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col  class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商户订单">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">商户订单</span>
			</el-col>
			<!--搜索条件-->
			<span class="content_font" ></span>
			<span>账号uid</span>
			<el-input v-model="userId" style="width:120px; margin:0px 20px 5px 10px"></el-input>
			<span>订单号(Bill)</span>
			<el-input v-model="orderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>      
			<span>到账时间</span>
			<el-date-picker v-model="logTime" type="datetimerange"
				value-format='yyyy-MM-dd HH:mm:ss' 
				style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
			</el-date-picker>
			<el-button type="success" @click="reset" style="margin:8px 0px 10px 50px">重置</el-button>
			<el-button  class="filter-item" type="primary" icon="el-icon-search" @click="loadData">搜索</el-button>
			<!--列表-->
			<el-table :data="merchantOrders.merWithdrawData" border highlight-current-row style="width: 100%;" max-height="500">
				<el-table-column prop="_id" label="订单号" width="250" align="center"></el-table-column>
				<el-table-column prop="uid" label="用户ID" min-width="200" align="center"></el-table-column>
				<el-table-column prop="price" label="金额" min-width="200" align="center"></el-table-column>
				<el-table-column prop="withdrawType" label="兑换类型" width="250" :show-overflow-tooltip="true"  align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="200" :formatter="createTimeFunc" align="center">·</el-table-column>
				<el-table-column prop="paidTime" label="到账时间" width="180" :formatter="finishTimeFunc" align="center"></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
				@current-change="handleCurrentChange" 
				@size-change="handleSizeChange" 
				:current-page="page" 
				:page-sizes="[10,20,30,50]" 
				:page-size="count" 
				:total="merchantOrders.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { MerchantOrders } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//MerWithdraw
interface QueryItem {
  uid?: string;
  _id?: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class MerWithdraw extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  merchantOrders: MerchantOrders = this.$store.state.merchantOrders; //表单数据
  userId: string = "";
  orderId: string = "";
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  logTime: Date[] = [this.startTime,this.endTime];
  page: number = 1; //当前页
  count: number = 10;
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetMerWithdraw", queryItem).then(() => {});
  }

  reset() {
    this.userId = "";
    this.orderId = "";
    this.logTime = [];
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.userId) {
      temp.uid = this.userId;
    }
    if (this.orderId) {
      temp._id = this.orderId;
    }
    temp.page = this.page;
    temp.count = this.count;
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

  createTimeFunc(row, column) {
    let date = new Date(row.createTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  finishTimeFunc(row, column) {
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
