<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="操作日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">操作日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <el-date-picker v-model="loginTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 0" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="getExcle">导出</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="logList" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column type="expand" label="查看" fixed="left" width="60">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item v-show="props.row.beforeLog" label="原数据：">
                <div>{{ dataToStr(props.row.beforeLog) }}</div>
              </el-form-item>
              <el-form-item v-show="props.row.afterLog" label="新数据：">
                <div>{{ dataToStr(props.row.afterLog) }}</div>
              </el-form-item>
              <el-form-item v-show="props.row.changeLog" label="改动：">
                <div>{{ dataToStr(props.row.changeLog) }}</div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日志创建时间" min-width="100" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="clientRoute" label="操作模块" min-width="100" :formatter="logModularFormat" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作类型" min-width="100" align="center"></el-table-column>
        <el-table-column prop="operator" label="操作人" min-width="100" align="center"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { LoginLogState } from "../../store/stateInterface";
import {
  getNewLog,
  getAdminNewLogLogExcel
} from "../../api/admin/logManage/log";
import { myAsyncFn } from "../../utils/index.js";
//newLog
interface QueryItem {
  page: number;
  count: number;
  startTime?: Date;
  endTime?: Date;
}
interface ExcleItem {
  startTime?: Date;
  endTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class newLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  logList: object[] = []; // 表单数据
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
  totalCount: number = 0;

  /*method*/
  search() {
    this.page = 1;
    this.loadData();
  }
  async loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.loginTime && this.loginTime.length === 2) {
      queryItem.startTime = this.loginTime[0];
      queryItem.endTime = this.loginTime[1];
    }
    let ret = await myAsyncFn(getNewLog, queryItem);
    if (ret.code === 200) {
      this.logList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  //导出
  async getExcle() {
    let queryItem: ExcleItem = {};
    if (this.loginTime && this.loginTime.length === 2) {
      queryItem.startTime = this.loginTime[0];
      queryItem.endTime = this.loginTime[1];
      let ret = await myAsyncFn(getAdminNewLogLogExcel, queryItem);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "导出任务创建成功！"
        });
      } else {
        this.$message({
          type: "error",
          message: ret.err
        });
      }
    }
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
  //操作模块整形
  logModularFormat(row) {
    return row.logSmsBean.logModular;
  }
  // 数据整形
  dataToStr(data) {
    let logStr = "";
    for (let key in data) {
      logStr += key + ":" + data[key] + "，";
    }

    return logStr.slice(0, logStr.length - 1);
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
