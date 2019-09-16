<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="回归列表"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">防掉签引导数据统计</span>
      </el-col>
      <div class="box">
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>统计时间</span>
        <el-date-picker v-model="staticTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button type="primary" @click="SearchData" style="margin:10px">搜索</el-button>
        <dir>
          <span>符合条件玩家总数：</span>
          <span>{{this.nonstorePkgUidCount}}</span>
          <span>商店包登录人数：</span>
          <span>{{this.storePkgUidCount}}</span>
        </dir>
        <el-table :data="antiDropData" v-loading="loading" highlight-current-row border style="width: 100%">
          <el-table-column :formatter="localeSumDateFormatter" align="center" prop="sumDate" label="统计时间"></el-table-column>
          <el-table-column :formatter="pidFormatter" prop="pid" align="center" label="平台"></el-table-column>
          <el-table-column align="center" prop="nonstorePkgUidCount" label="玩家总数"></el-table-column>
          <el-table-column align="center" prop="storePkgUidCount" label="商店包升级人数"></el-table-column>
          <el-table-column align="center" prop="downloadCount" label="下载次数"></el-table-column>
          <el-table-column align="center" :formatter="rateFormatter" prop="rate" label="成功率"></el-table-column>
        </el-table>
        <el-pagination layout="total,sizes,prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { statPreventSignOff } from "../../api/admin/dataStatic/dataStatic";

interface QueryItem {
  pid: string;
  sumDateStart: string;
  sumDateEnd: string;
  page: number;
  count: number;
}

@Component
export default class preventSignOffGuide extends Vue {
  loading: boolean = false; //加载状态
  pid: string = ""; //项目
  page: number = 1; //页数
  count: number = 10; //当前查询条数
  totalCount: number = 0; //总条数
  nonstorePkgUidCount: number = 0; //总人数
  storePkgUidCount: number = 0; //商店包登录人数

  antiDropData: Array<any> = []; //列表数据
  staticTime: Array<string> = []; //统计时间
  pidList: { pid: string; name: string }[]; //项目数据

  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.loadData();
  }
  loadData() {
    let queryItem: QueryItem = {
      pid: this.pid,
      sumDateStart:
        this.staticTime && this.staticTime.length == 2
          ? this.staticTime[0]
          : null,
      sumDateEnd:
        this.staticTime && this.staticTime.length == 2
          ? this.staticTime[1]
          : null,
      page: this.page,
      count: this.count
    };
    this.loading = true;
    statPreventSignOff(queryItem)
      .then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "搜索成功"
          });
          this.nonstorePkgUidCount = res.data.msg.totalStat.nonstorePkgUidCount;
          this.storePkgUidCount = res.data.msg.totalStat.storePkgUidCount;
          this.antiDropData = res.data.msg.data;
          this.totalCount = res.data.msg.totalCount;
          this.loading = false;
        }
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: err
        });
        this.loading = false;
      });
  }
  SearchData() {
    this.page = 1;
    this.count = 10;
    this.loadData();
  }
  //时间格式
  initData(row) {
    if (row) {
      let date = new Date(row);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  }
  localeSumDateFormatter(row, column, index) {
    let sdate;
    if ((column.label = "统计时间")) {
      sdate = this.initData(row.sumDate);
    }
    return sdate;
  }
  //项目格式
  pidFormatter(row) {
    let pid;
    this.pidList.forEach(item => {
      if (item.pid == row.pid) {
        pid = item.name;
      }
    });
    return pid;
  }
  //百分格式
  rateFormatter(row) {
    let num = Number(row.rate * 100).toFixed(2);
    if (num !== "NaN") {
      return num + "%";
    } else {
      return "0%";
    }
  }
  //当前页回调
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //当前条数回调
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
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
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
</style>