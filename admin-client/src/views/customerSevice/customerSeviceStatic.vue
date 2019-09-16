<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="客服统计"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">客服统计</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>客服账号</span>
        <el-input v-model="name" style="width:120px; margin:20px 10px"></el-input>
        <span>时间</span>
        <el-date-picker v-model="time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="downloadExcel">导出Excel</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="listData" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="name" label="客服账号" min-width="100" align="center" :formatter="nameFormat"></el-table-column>
        <el-table-column prop="totalNum" label="服务总计(次)" min-width="100" align="center"></el-table-column>
        <el-table-column prop="evalNum" label="评价次数" min-width="100" align="center"></el-table-column>
        <el-table-column prop="evalRate" label="评价率" min-width="100" align="center" :formatter="evalRateFormat"></el-table-column>
        <el-table-column prop="goodNum" label="好评数" min-width="100" align="center"></el-table-column>
        <el-table-column prop="goodRate" label="好评率" min-width="100" align="center" :formatter="goodRateFormat"></el-table-column>
        <el-table-column prop="avgMaxResp" label="平均最长响应时间" min-width="100" align="center"></el-table-column>
        <el-table-column prop="avgMinResp" label="平均最短响应时间" min-width="100" align="center"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
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
import { myAsyncFn, myDispatch } from "../../utils/index.js";
import {
  getStatisticst,
  chatAggregate
} from "../../api/admin/customerService/customerService";
import { downloadExcel } from "../../utils/downloadEXCEL";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class customerSeviceStatic extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  listData: any = []; //表单数据
  name: string = "";
  time: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  /*method*/
  async loadData() {
    let queryItem: any = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getStatisticst, queryItem);
    if (ret.code === 200) {
      this.listData = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    }
  }
  search() {
    this.page = 1;
    this.loadData();
  }
  detail(row) {
    this.$router.replace({
      path: "/customerSevice/customerSevice_chatHistory",
      query: { name: row.name }
    });
  }
  getQueryItem() {
    let tmp: any = {};
    if (this.name) {
      tmp.name = this.name;
    }
    if (this.time && this.time.length === 2) {
      tmp.startDate = this.time[0];
      tmp.endDate = this.time[1];
    }
    return tmp;
  }
  async downloadExcel() {
    let queryItem: any = this.getQueryItem();
    let ret = await myAsyncFn(chatAggregate, queryItem);
    if (ret.code === 200) {
      downloadExcel(ret, this);
    }
  }
  nameFormat(row) {
    return row.name ? row.name : "未匹配客服";
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
  evalRateFormat(row) {
    let num = (row.evalRate * 100).toFixed(2) + "%";
    return num;
  }
  goodRateFormat(row) {
    let num = (row.goodRate * 100).toFixed(2) + "%";
    return num;
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
