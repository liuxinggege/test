<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理收入明细">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">代理流水记录</span>
      </el-col>
      <div class="box">
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
          </el-option>
        </el-select>
        <span>代理ID</span>
        <el-input v-model="agentId" style="width:120px; margin:20px 10px"></el-input>
        <span style="font-size:12pt; margin:1px 10px 0px 20px">记录类型</span>
        <el-select v-model="recordType" placeholder="请选择" style="width:120px; margin:0 0px 0px 0px">
          <el-option v-for="item in recordTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <br>
        <span>日志时间</span>
        <el-date-picker v-model="logDate" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
        <span>统计时间</span>
        <el-date-picker v-model="sumDate" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 100px">搜索</el-button>
        <el-button type="primary" @click="downloadExcel">导出</el-button>
      </div>
      <!--列表-->
      <div style="margin-bottom:10px;">
      </div>
      <el-table :data="agencyMoneyChange.agencyMoneyChangeData" border highlight-current-row style="width: 99%;" max-height="700">
        <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat" fixed/>
        <el-table-column prop="agencyId" label="代理ID" min-width="120" align="center"></el-table-column>
        <el-table-column prop="act" label="账号" min-width="120" align="center"></el-table-column>
        <el-table-column prop="logDate" label="日志日期" min-width="150" align="center" :formatter="localeLogDateFormatter"></el-table-column>
        <el-table-column prop="sumDate" label="统计日期" min-width="150" align="center" :formatter="localeSumDateFormatter"></el-table-column>
        <el-table-column prop="recordType" label="记录类型" min-width="80" align="center" :formatter="recordTypeFormatter"></el-table-column>
        <el-table-column prop="changeMoney" label="金币变化" min-width="100" align="center"></el-table-column>
        <el-table-column prop="afterSet" label="结算后金额" min-width="100" align="center"></el-table-column>
        <el-table-column prop="transferFrom" label="转账人" min-width="80" align="center"></el-table-column>
        <el-table-column prop="transferTo" label="接收人" min-width="80" align="center"></el-table-column>
        <el-table-column prop="operator" label="操作人" min-width="80" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="100" align="center"></el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="agencyMoneyChange.totalCount">
        </el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch, getYearMonthDay } from "../../utils/index";
import { downloadExcel } from "../../utils/downloadEXCEL";
interface QueryItem {
  pid: string;
  agencyId?: string;
  page?: number;
  count?: number;
  sumDateStart?: Date;
  sumDateEnd?: Date;
  logDateStart?: Date;
  logDateEnd?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgencyMoneyChange extends Vue {
  agencyMoneyChange: any = this.$store.state.agencyMoneyChange;
  agentId: string = "";
  tmpAgencyId: string = "";
  recordType: string = "";
  recordTypes = [
    { label: "系统结算", value: "system" },
    { label: "其他", value: "其他" },
    { label: "提现", value: "apply" },
    { label: "转账失败", value: "transferFail" },
    { label: "转入", value: "transferIn" },
    { label: "转出", value: "transferOut" },
    { label: "活动", value: "activity" },
    { label: "师徒结算", value: "master" },
    { label: "世界杯", value: "wcg" },
  ];
  page: number = 1;
  count: number = 10;
  sumDate: Date[] = [];
  logDate: Date[] = [];
  pidList: any[] = [];
  pid: string = "A";
  //生命周期钩子函数
  created() {
   this.pidList = [{name:"全部",pid:""},...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }
  //初始化数据
  loadData() {
    let queryItem: any = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetAgencyMoneyChange", queryItem);
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let temp: any = { pid: this.pid };
    if (this.agentId && this.agentId.trim()) {
      temp.agencyId = this.agentId;
    }
    if (this.recordType && this.recordType.trim()) {
      temp.recordType = this.recordType;
    }
    if (this.sumDate && this.sumDate.length === 2) {
      temp.sumDateStart = this.sumDate[0];
      temp.sumDateEnd = this.sumDate[1];
    }
    if (this.logDate && this.logDate.length === 2) {
      temp.logDateStart = this.logDate[0];
      temp.logDateEnd = this.logDate[1];
    }
    return temp;
  }

  localeLogDateFormatter(row, index) {
    if(row.logDate){
      let date = new Date(row.logDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
    return ""
  }
  localeSumDateFormatter(row, index) {
    if(row.sumDate){
      let date = new Date(row.sumDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
    return ""
  }
  recordTypeFormatter(row, index) {
    if(row.recordType){
      switch (row.recordType) {
        case "artificial":
            return "手动添加";
        case "system":
            return "系统结算";
        case "apply":
            return "提现";
        case "refused":
            return "退款";
        case "applyFail":
            return "提现失败";
        case "transferFail":
            return "转账失败";
        case "refund":
            return "退款";
        case "master":
            return "师徒结算";
        case "wcg":
            return "世界杯";
        case "transferIn":
            return "转入";
        case "transferOut":
            return "转出";
        case "activity":
            return "活动";
        case "其他":
            return "其他";
        }
    }
    return ""
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
   downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "代理ID", field: "agencyId", type: "string" },
      { title: "账号", field: "act", type: "string" },
      { title: "日志日期", field: "logDate", type: "Date" },
      { title: "统计日期", field: "sumDate", type: "Date" },
      { title: "记录类型", field: "recordType", type: "recordType" },
      { title: "金币变化", field: "changeMoney", type: "string" },
      { title: "结算后金额", field: "afterSet", type: "string" },
      { title: "转账人", field: "transferFrom", type: "string" },
      { title: "接收人", field: "transferTo", type: "string" },
      { title: "操作人", field: "operator", type: "string" },
      { title: "备注", field: "remarks", type: "string" },
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "ExportAgencyMoneyChange", queryItem).then(ret => {
      downloadExcel(ret,this);
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
