<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理充值"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代理充值</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>转账账号uid</span>
        <el-input v-model="fromUid" style="width:120px; margin:20px 10px"></el-input>
        <span>接受账号uid</span>
        <el-input v-model="toUid" style="width:120px; margin:20px 10px"></el-input>
        <span>创建时间</span>
        <el-date-picker v-model="logTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
        <el-button v-show="isShowExcel" type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="transferLog.transferLogData" border highlight-current-row style="width: 98%;">
        <el-table-column prop="from" label="转账人ID" min-width="120" align="center"/>
        <el-table-column prop="to" label="接受人ID" width="120" align="center"/>
        <el-table-column prop="pid" label="接受人项目" width="120" align="center" :formatter="pidFormat"/>
        <el-table-column prop="channel" label="接受人渠道" width="120" align="center" :formatter="channelFormat"/>
        <el-table-column prop="fromMoneyBefore" label="转账人原金币" width="120" align="center"/>
        <el-table-column prop="fromBankMoneyBefore" label="转账人原银行金币" width="120" align="center"/>
        <el-table-column prop="toMoneyBefore" label="接受人原金币" width="120" align="center"/>
        <el-table-column prop="toBankMoneyBefore" label="接受人原银行金币" width="120" align="center"/>
        <el-table-column prop="fromMoneyAfter" label="转账人现金币" width="120" align="center"/>
        <el-table-column prop="fromBankMoneyAfter" label="转账人现银行金币" width="120" align="center"/>
        <el-table-column prop="toMoneyAfter" label="接受人现金币" min-width="120" align="center"/>
        <el-table-column prop="toBankMoneyAfter" label="接受人现银行金币" width="120" align="center"/>
        <el-table-column prop="transferMoney" label="交易金币" min-width="120" align="center"/>
        <el-table-column prop="transferTime" label="交易时间" width="200" :formatter="timeFormat1" align="center"/>
        <el-table-column prop="logDate" label="日志时间" min-width="200" :formatter="timeFormat2" align="center"/>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="transferLog.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { TransferLogState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
//TransferLog
interface QueryItem {
  fromUid?: number;
  toUid?: number;
  type?: number;
  page?: number;
  count?: number;
  startTime?: Date;
  endTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  computed: {
    isShowExcel(): boolean {
      if (this.$route.name === "agentCharge") {
        return true;
      }
      return false;
    }
  }
})
export default class TransferLog extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  // isShowExcel: boolean = this.$route.name === "agentCharge" ? true : false;
  transferLog: TransferLogState = this.$store.state.agentCharge; //表单数据
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
  logTime: Date[] = [this.startTime, this.endTime];
  page: number = 1; //当前页
  count: number = 10;
  fromUid: string = "";
  toUid: string = "";
  pidList: any[] = [];
  /*method*/
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetAgentCharge", queryItem, true);
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {
      type: 1
    };
    if (this.fromUid && this.fromUid != "") {
      temp.fromUid = parseInt(this.fromUid);
    }
    if (this.toUid && this.toUid != "") {
      temp.toUid = parseInt(this.toUid)!;
    }
    if (this.logTime && this.logTime[0]) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }
  //日期整形
  timeFormat1(row, column) {
    let date = new Date(row.transferTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  timeFormat2(row, column) {
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
  pidFormat(row, column) {
    let name = "";
    if (row.pid) {
      this.pidList.forEach(element => {
        if (element.pid === row.pid) {
          name = element.name;
        }
      });
    }
    return name;
  }
  channelFormat(row, column) {
    if (row.channel === "") {
      return "官方";
    } else if (row.channel) {
      return row.channel;
    } else {
      return "";
    }
  }
  //导出excle
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "转账人ID", field: "from", type: "number" },
      { title: "接受人ID", field: "to", type: "number" },
      { title: "接受人项目", field: "pid", type: "pidType" },
      { title: "接受人渠道", field: "channel", type: "channelType" },
      { title: "转账人原金币", field: "fromGoldBefore", type: "string" },
      {
        title: "转账人原银行金币",
        field: "fromBankGoldBefore",
        type: "string"
      },
      { title: "接受人原金币", field: "toGoldBefore", type: "string" },
      { title: "接受人原银行金币", field: "toBankGoldBefore", type: "string" },
      { title: "转账人现金币", field: "fromGoldAfter", type: "string" },
      { title: "转账人现银行金币", field: "fromBankGoldAfter", type: "string" },
      { title: "接受人现金币", field: "toGoldAfter", type: "string" },
      { title: "接受人现银行金币", field: "toBankGoldAfter", type: "string" },
      { title: "交易金币", field: "transferMoney", type: "string" },
      { title: "交易时间", field: "transferTime", type: "Date" },
      { title: "日志时间", field: "logDate", type: "Date" }
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    if (!Object.keys(queryItem).length) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    myDispatch(this.$store, "GetAgentChargeExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
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
