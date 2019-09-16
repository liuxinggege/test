<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="后台导出日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">后台导出日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>状态</span>
        <el-select v-model="state" placeholder="请选择" style="margin:0px 0px 0px 10px;width:120px;">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="exportInfo.pageData" border highlight-current-row style="width: 100%;" max-height="500">
        <el-table-column prop="startDate" label="登录时间" min-width="200px" :formatter="startFormat" align="center"></el-table-column>
        <el-table-column prop="path" label="内容" min-width="200px" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="200px" align="center" :formatter="typeFormat"></el-table-column>
        <el-table-column prop="finishDate" label="完成时间" min-width="200px" :formatter="finishFormat" align="center"></el-table-column>
        <el-table-column label="下载" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.state==='success'" @click="download(scope.$index, scope.row)">下载</el-button>
            <el-button type="text" v-if="timeOut(scope.row.startDate)" @click="deleteLine(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="exportInfo.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BackstageLoginlog } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
import { deleteTask } from "../../api/admin/logManage/log";
//AdminLogLog
interface QueryItem {
  state?: string;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AdminLogLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  exportInfo = this.$store.state.exportInfo; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  state: string = "";
  types = [
    { label: "全部", value: "" },
    { label: "创建", value: "init" },
    { label: "导出中", value: "exporting" },
    { label: "失败", value: "fail" },
    { label: "完成", value: "success" }
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
    myDispatch(this.$store, "GetExportInfo", queryItem).then(e => {
      this.exportInfo = this.$store.state.exportInfo; //表单数据
      console.log(this.exportInfo);
    });
  }
  download(index, row) {
    myDispatch(this.$store, "DownloadExcel", { id: row._id }).then(e => {
      //   if(this.$store.state.export.code!==200&&this.$store.state.export.code!==400){
      //     this.$message({  message: '下载失败!'+this.$store.state.export.err,  type: 'error'})
      //   }else{
      //     this.$message({  message: '下载成功!',  type: 'error'})
      //   }
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
  typeFormat(row, column) {
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
  timeOut(date) {
    let now: any = new Date();
    date = new Date(date);
    console.log(date, now);
    let loginTime: any = new Date(date);
    let cha = 1000 * 60 * 60 * 2;
    if (now - loginTime > cha) {
      return true;
    } else {
      return false;
    }
  }
  deleteLine(row) {
    this.$confirm("此操作将删除该导出日志, 是否继续?", "提示", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteTask({ id: row._id }).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.loadData();
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
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
