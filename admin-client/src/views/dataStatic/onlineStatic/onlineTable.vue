<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="在线表格">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">在线表格</span>
			</el-col>
			<span class="content_font"></span>
			<!-- <span>项目</span>
			<el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
				<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select> -->
			<span>统计时间</span>
			<el-date-picker v-model="logTime" value-format='yyyy-MM-dd' style="margin:5px 20px 5px 10px" type="daterange" placeholder="选择日期"></el-date-picker>
			<span>渠道id</span>
			<el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>

			<el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
			<!--列表-->
			<el-table :data="onlineTable.transferData" border highlight-current-row style="width: 100%;" max-height="600">

				<el-table-column prop="sumDate" label="统计时间" win-width="100" :formatter="sumDateFunc" align="center"></el-table-column>
				<el-table-column prop="minOnline" label="最低在线" win-width="100" align="center"></el-table-column>
				<el-table-column prop="maxOnline" label="最高在线" win-width="100" align="center"></el-table-column>
				<el-table-column prop="avgOnline" label="平均在线" win-width="100" align="center"></el-table-column>

			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="onlineTable.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { OnlineTableState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index";
//OnlineTable
interface QueryItem {
  // pid: string;
  startTime?: Date;
  channel?: string;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class OnlineTable extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
    // this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  /*inital data*/
  onlineTable: OnlineTableState = this.$store.state.onlineTable; //表单数据
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  channel = "";

  // pidList: any[] = [];
  // pid: string = "A";

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetOnlineTable", queryItem).then(() => {});
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = { };
    if (this.channel) {
      temp.channel = this.channel;
    }

    temp.page = this.page;
    temp.count = this.count;

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
    let date = new Date(row.localeSumDate);
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
