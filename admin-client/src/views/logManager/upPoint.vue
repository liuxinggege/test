<template>
  <div>
    <span class="content_font"></span>
    <span class="demonstration"></span>
    <span>玩家ID</span>
    <el-input v-model="userId" style="width:120px; margin:20px 10px"></el-input>
    <el-date-picker v-model="logTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
    <el-button class="filter-item" type="primary" @click="downloadExcel">导出</el-button>
    <!--列表-->
    <el-table :data="uppointLog.uppointData" border highlight-current-row style="width: 100%;" max-height="460">
      <el-table-column prop="uid" label="用户Id" min-width="175" align="center"/>
      <el-table-column prop="rmb" label="人民币" min-width="100" align="center"/>
      <el-table-column prop="money" label="金币" min-width="100" align="center"/>
      <el-table-column prop="type" label="类型" min-width="100" align="center"/>
      <el-table-column prop="logDate" label="时间" min-width="175" align="center" :formatter="timeFormat"/>
      <el-table-column prop="optUser" label="操作人" min-width="120" align="center"/>
      <el-table-column prop="optDiscription" label="操作详情" min-width="120" align="center"/>
    </el-table>
    <!--工具条-->
    <el-col class="toolbar4">
      <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="uppointLog.totalCount"></el-pagination>
    </el-col>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { UpPointLogState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
import { downloadExcel } from "../../utils/downloadEXCEL";
//LoginLog
interface QueryItem {
  userId?: number;
  page?: number;
  count?: number;
  startTime?: Date;
  endTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class LoginLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  uppointLog: UpPointLogState = this.$store.state.upPoint; //表单数据
  userId: string = "";
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  // totalCount: number = 0;

  /*method*/
  loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.logTime && this.logTime.length === 2) {
      queryItem.startTime = this.logTime[0];
      queryItem.endTime = this.logTime[1];
    }
    if (this.userId) {
      queryItem.userId = parseInt(this.userId);
    }
    myDispatch(this.$store, "GetUppointLog", queryItem);
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  //日期整形
  timeFormat(row, column) {
    let date = new Date(row.logDate);
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
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "用户Id", field: "uid", type: "string" },
      { title: "人民币", field: "rmb", type: "string" },
      { title: "金币", field: "money", type: "string" },
      { title: "类型", field: "type", type: "string" },
      { title: "时间", field: "logDate", type: "Date" },
      { title: "操作人", field: "optUser", type: "string" },
      { title: "操作详情", field: "optDiscription", type: "string" }
    ];
    let queryItem: QueryItem = {};
    if (this.logTime && this.logTime.length === 2) {
      queryItem.startTime = this.logTime[0];
      queryItem.endTime = this.logTime[1];
    }
    if (this.userId) {
      queryItem.userId = parseInt(this.userId);
    }
    myDispatch(this.$store, "GetUppointLogExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: Fantasy;
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