<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="统计总汇">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">统计总汇</span>
			</el-col>
			<!--工具条-->
			<span class="content_font"></span>
			<span>时间范围</span>
			<el-date-picker v-model="logTime" value-format='yyyy-MM-dd HH:mm:ss' style="margin:5px 20px 5px 10px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
			<el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
			<!--列表-->
			<el-table :data="totalStatic.transferData" border highlight-current-row style="width: 100%;" max-height="600">
				<el-table-column prop="sumDate" label="统计时间" width="150" :formatter="sumDateFunc" align="center"></el-table-column>
				<el-table-column prop="logDate" label="日志时间" width="150" :formatter="logDateFunc" align="center"></el-table-column>
				<el-table-column prop="totalChargeAmt" label="总充值金额" min-width="100" align="center"></el-table-column>
				<el-table-column prop="onlineChargeAmt" label="在线充值金额" width="120" align="center"></el-table-column>
				<el-table-column prop="agentChargeAmt" label="代理充值金额" min-width="100" align="center"></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalStatic.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { TotalStaticState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//TotalStatic
interface QueryItem {
  // pid: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TotalStatic extends Vue {
  // lifecycle hook
  created() {
    // this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  totalStatic: TotalStaticState = this.$store.state.totalStatic; //表单数据

  // pidList: any[] = [];
  // pid: string = "A";

  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetTotalStatic", queryItem);
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {  };
    if (this.logTime && this.logTime.length === 2) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }

  getExportQueryItem() {
    let temp: QueryItem = {  };
    if (this.logTime && this.logTime.length === 2) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }

  sumDateFunc(row, column) {
    let date = new Date(row.sumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  logDateFunc(row, column) {
    let date = new Date(row.logDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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
