<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="导出日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">导出日志</span>
      </el-col>
      <!--工具条-->
      <div>

        <span>状态</span>
        <el-select v-model="state" placeholder="请选择" style="margin:0px 20px 0px 10px;width:120px;">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <span>导出内容</span>
        <el-input v-model="path" clearable style="width:200px; margin:0 20px"></el-input>

        <span>后台类型</span>
        <el-select v-model="type" placeholder="请选择" style="margin:0px 20px 0px 10px;width:120px;">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <span>操作人</span>
        <el-input v-model="opt" clearable style="width:200px; margin:0 20px"></el-input>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="exportLog.pageData" border highlight-current-row style="width: 100%;margin-top:20px;" max-height="500">
        <el-table-column prop="startDate" label="创建时间"  :formatter="startFormat" align="center"></el-table-column>
        <el-table-column prop="finishDate" label="完成时间"  :formatter="finishFormat" align="center"></el-table-column>
        <el-table-column prop="path" label="导出内容"   align="center"></el-table-column>
        <el-table-column prop="opType" label="后台类型"   align="center"   :formatter="opTypeFormat"></el-table-column>
        <el-table-column prop="state" label="状态"  align="center" :formatter="stateFormat"></el-table-column>
        <el-table-column prop="opt" label="操作人"   align="center"></el-table-column>
        <el-table-column prop="args" label="参数"  width="400" align="center"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="exportLog.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";
//ExportLog
interface QueryItem {
  state?: string;
  path?: string;
  type?: string;
  opt?: string;
  page:number;
  count:number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ExportLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  exportLog = this.$store.state.exportLog; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  state: string = "";
  path: string = "";
  type: string = "";
  opt: string = "";
  stateList = [
    { label: "全部", value: "" },
    { label: "创建", value: "init" },
    { label: "导出中", value: "exporting" },
    { label: "失败", value: "fail" },
    { label: "完成", value: "success" }
  ];
  typeList = [
    { label: "全部", value: "" },
    { label: "主后台", value: "admin" },
    { label: "渠道后台", value: "cps" },
    { label: "代理数据后台", value: "agencyData" },
  ];
   /*method*/
  searchData() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let queryItem: QueryItem = {
      page: this.page,
      count: this.count
    };
    if (this.state) {
      queryItem.state = this.state;
    }
    if (this.path) {
      queryItem.path = this.path;
    }
    if (this.type) {
      queryItem.type = this.type;
    }
    if (this.opt) {
      queryItem.opt = this.opt;
    }
    myDispatch(this.$store, "GetExportLog", queryItem)
    .then(e => {
      this.exportLog = this.$store.state.exportLog; //表单数据
    });
  }
  //日期整形
  startFormat(row, column) {
    if (row.startDate) {
      let date = new Date(row.startDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
    return row.startDate;
  }
  finishFormat(row, column) {
    if (row.finishDate) {
      let date = new Date(row.finishDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
    return row.finishDate;
  }
  stateFormat(row, column) {
    switch (row.state) {
      case "init":
        return "创建任务";
      case "exporting":
        return "导出中";
      case "fail":
        return "失败";
      case "success":
        return "成功";
    }
  }
  opTypeFormat(row, column) {
    switch (row.opType) {
      case "admin":
        return "主后台";
      case "cps":
        return "渠道后台";
      case "agencyData":
        return "代理数据后台";
      default :
      return row.optType
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
