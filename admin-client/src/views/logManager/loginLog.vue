<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="用户登录日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">用户登录日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>用户ID</span>
        <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
        <el-date-picker v-model="loginTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="loginLog.loginLogData" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="date" label="日志创建时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="uid" label="uid" min-width="100" align="center"></el-table-column>
        <el-table-column prop="ip" label="ip" min-width="170" align="center"></el-table-column>
        <el-table-column prop="location" label="位置" width="100" align="center"></el-table-column>
        <el-table-column prop="lng" label="经度" width="150" align="center"></el-table-column>
        <el-table-column prop="lat" label="纬度" width="150" align="center"></el-table-column>
        <el-table-column prop="loginMethod" label="登录方式" width="150" align="center"></el-table-column>
        <el-table-column prop="act" label="账号" width="150" align="center"></el-table-column>
        <el-table-column prop="platform" label="平台" width="150" align="center"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="loginLog.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { LoginLogState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//LoginLog
interface QueryItem {
  uid?: number;
  page: number;
  count: number;
  loginTimeStart?: Date;
  loginTimeEnd?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class LoginLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  loginLog: LoginLogState = this.$store.state.loginLog; //表单数据
  uid: string = "";
  now = new Date(Date.now());
  startTime = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() - 7,
    0,
    0,
    0
  );
  endTime = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() + 1,
    0,
    0,
    0
  );
  loginTime: Date[] = [this.startTime, this.endTime];
  page: number = 1; //当前页
  count: number = 10;
  // totalCount: number = 0;

  /*method*/
  loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.loginTime && this.loginTime.length === 2) {
      queryItem.loginTimeStart = this.loginTime[0];
      queryItem.loginTimeEnd = this.loginTime[1];
    }
    if (this.uid) {
      queryItem.uid = parseInt(this.uid);
    }
    myDispatch(this.$store, "GetLoginLog", queryItem);
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  //日期整形
  timeFormat(row, column) {
    let date = new Date(row.date);
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
