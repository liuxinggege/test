<template>
  <el-card>
    <el-col class="toolbar1">
      <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理收入明细">
      </el-popover>
      <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
      <span class="title">代理收入明细</span>
    </el-col>
    <div class="box">
      <span>时间</span>
      <el-date-picker v-model="sumDate" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
      </el-date-picker>
      <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 100px">搜索</el-button>
    </div>
    <!--列表-->
    <div style="margin-bottom:10px;">
    </div>
    <el-table :data="agencyIncomeDetail.grandsonIncomeDetailData" border highlight-current-row style="width: 99%;" max-height="700">
      <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat" fixed/>
      <el-table-column prop="sumDate" label="日期" min-width="120" align="center" :formatter="localeSumDateFormatter"></el-table-column>
      <el-table-column prop="agencyId" label="代理ID" min-width="120" align="center"></el-table-column>
      <el-table-column prop="childAgencyId" label="下级代理ID" min-width="120" align="center"></el-table-column>
      <el-table-column prop="profit" label="下级代理利润" min-width="200" align="center"></el-table-column>
      <el-table-column prop="childTaxRate" label="下级代理比例" min-width="120" align="center"></el-table-column>
      <el-table-column prop="gameTax" label="下级代理直推税收" min-width="150" align="center"></el-table-column>
    </el-table>
    <el-col class="toolbar2">
      <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="agencyIncomeDetail.grandsonTotalCount">
      </el-pagination>
    </el-col>

  </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch, getYearMonthDay } from "../../utils/index";
import { IncomeDetail } from "../../store/stateInterface";

interface QueryItem {
  pid: string;
  agencyId?: string;
  page?: number;
  count?: number;
  sumDateStart?: Date;
  sumDateEnd?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgencyIncomeDetail extends Vue {
  agencyIncomeDetail: IncomeDetail = this.$store.state.agencyIncomeDetail;
  page: number = 1;
  count: number = 10;
  sumDate: Date[] = [];
  agencyId = this.$attrs.agencyId;
  pid = this.$attrs.pid;
  pidList: any[] = [];
  //生命周期钩子函数
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.agencyId = this.$attrs.agencyId;
    this.pid = this.$attrs.pid;
    this.loadData();
  }
  //初始化数据
  loadData() {
    let queryItem: any = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetGrandsonDetail", queryItem);
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let temp: any = { pid: this.pid, agencyId: this.agencyId };
    if (this.sumDate && this.sumDate.length === 2) {
      temp.sumDateStart = this.sumDate[0];
      temp.sumDateEnd = this.sumDate[1];
    }
    return temp;
  }

  localeSumDateFormatter(row, index) {
    let date = new Date(row.sumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return getYearMonthDay(sdate);
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
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
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

.el-table .warning-row {
  background: #ccc;
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
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
