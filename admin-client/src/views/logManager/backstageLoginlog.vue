<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="后台登陆日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">后台登陆日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>账号</span>
        <el-input v-model="act" style="width:120px; margin:20px 10px"></el-input>
        <span>类型</span>
        <el-select v-model="serverType" placeholder="请选择" style="margin:0px 0px 0px 10px;width:120px;">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker v-model="loginTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="downloadExcel">导出</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="backstageLoginlog.backstageLoginlogData" border highlight-current-row style="width: 100%;" max-height="500">
        <el-table-column prop="createDate" label="登录时间" min-width="200px" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="ip" label="IP" min-width="200px" align="center"></el-table-column>
        <el-table-column prop="ipLocation" label="IP地址" min-width="200px" align="center"></el-table-column>
        <el-table-column prop="serverType" label="后台" min-width="200px" :formatter="typeFormat" align="center"></el-table-column>
        <el-table-column prop="act" label="登录者" min-width="200px" align="center"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="backstageLoginlog.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BackstageLoginlog } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
import { downloadExcel } from "../../utils/downloadEXCEL";
//AdminLogLog
interface QueryItem {
  serverType?: string;
  act?: string;
  page?: number;
  count?: number;
  startTime?: Date;
  endTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AdminLogLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  backstageLoginlog: BackstageLoginlog = this.$store.state.backstageLoginlog; //表单数据
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
  act: string = "";
  page: number = 1; //当前页
  count: number = 10;
  serverType: string = "";
  types = [
    {
      label: "全部",
      value: ""
    },
    {
      label: "主后台",
      value: "admin"
    },
    {
      label: "渠道后台",
      value: "channel"
    },
    {
      label: "商人",
      value: "agent"
    },
    {
      label: "代理",
      value: "agency"
    },
    {
      label: "代理数据后台",
      value: "agencyData"
    }
  ];
  /*method*/
  loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.serverType) {
      queryItem.serverType = this.serverType;
    }
    if (this.act) {
      queryItem.act = this.act;
    }
    if (this.loginTime && this.loginTime.length === 2) {
      queryItem.startTime = this.loginTime[0];
      queryItem.endTime = this.loginTime[1];
    }
    myDispatch(this.$store, "GetbackstageLoginlog", queryItem);
  }
  search(){
    this.page = 1;
    this.loadData();
  }
  //日期整形
  timeFormat(row, column) {
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  typeFormat(row, column) {
    switch (row.serverType) {
      case "admin":
        return "主后台";
      case "channel":
        return "渠道后台";
      case "agent":
        return "商人后台";
      case "agency":
        return "代理后台";
      case "agencyData":
        return "代理数据后台";
    }
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
      { title: "登录时间", field: "createDate", type: "Date" },
      { title: "IP", field: "ip", type: "string" },
      { title: "IP地址", field: "ipLocation", type: "string" },
      { title: "后台", field: "serverType", type: "serverType" },
      { title: "登录者", field: "act", type: "string" }
    ];
    let queryItem: QueryItem = {};
    if (this.serverType) {
      queryItem.serverType = this.serverType;
    }
    if (this.act) {
      queryItem.act = this.act;
    }
    if (this.loginTime && this.loginTime.length === 2) {
      queryItem.startTime = this.loginTime[0];
      queryItem.endTime = this.loginTime[1];
    }
    myDispatch(this.$store, "GetbackstageLoginlogExcel", queryItem).then(
      ret => {
        downloadExcel(ret, this);
      }
    );
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
