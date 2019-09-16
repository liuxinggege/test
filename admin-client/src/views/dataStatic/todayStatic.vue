<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="每日统计总汇">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">每日统计总汇</span>
			</el-col>
			<!--工具条-->
			<span class="content_font"></span>
			<span>项目</span>
			<el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
				<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select>
			<span>渠道id</span>
			<el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>
			<span>统计时间</span>
			<el-date-picker value-format='yyyy-MM-dd HH:mm:ss' v-model="logTime" style="margin:5px 20px 5px 10px" type="datetimerange" placeholder="选择日期"></el-date-picker>

			<el-button type="success" @click="searchData" style="margin:0px 0px 10px 50px">查询</el-button>
      <el-button type="success" @click="downloadExcel" style="margin:0px 0px 10px 50px">导出excel</el-button>
			<!--列表-->
			<el-table :data="todayStatic.transferData" border highlight-current-row style="width: 100%;" max-height="600">
				<el-table-column prop="sumDate" label="统计时间" fixed width="150" align="center" :formatter="sumDateFunc"></el-table-column>
				<el-table-column prop="channel" label="渠道" fixed width="100" align="center" :formatter="channelFormat"></el-table-column>
				<el-table-column prop="totalProfit" label="总营收" width="100" align="center"></el-table-column>
				<el-table-column prop="totalChargeAmt" label="总充值金额" width="100" align="center"></el-table-column>
				<el-table-column prop="totalWithdrawAmt" label="总兑换金额" width="100" align="center"></el-table-column>
				<el-table-column prop="totalTax" label="总税收" width="100" align="center"></el-table-column>
				<el-table-column prop="onlineChargeAmt" label="在线充值金额" width="100" align="center"></el-table-column>
				<el-table-column prop="agentChargeAmt" label="代理充值金额" width="100" align="center"></el-table-column>
				<el-table-column prop="gameTax" label="游戏税收" width="100" align="center"></el-table-column>
				<el-table-column prop="totalWithdrawTax" label="兑换税收" width="100" align="center"></el-table-column>
				<el-table-column prop="totalWithdrawUserCount" label="总兑换人数" width="100" align="center"></el-table-column>
				<el-table-column prop="loginUserCount" label="登陆用户" width="100" align="center"></el-table-column>
				<el-table-column prop="newUserCount" label="新用户数" width="100" align="center"></el-table-column>
				<el-table-column prop="oldUserLoginUserCount" label="老用户登陆数" width="100" align="center"></el-table-column>
				<el-table-column prop="bindUserCount" label="绑定用户数" width="100" align="center"></el-table-column>
				<el-table-column prop="bindRate" label="绑定率" width="100" align="center"></el-table-column>
				<el-table-column prop="totalChargeUserCount" label="总充值人数" width="100" align="center"></el-table-column>
				<el-table-column prop="newUserChargeUserCount" label="新用户充值人数" width="100" align="center"></el-table-column>
				<el-table-column prop="payRate" label="付费率" width="100" align="center"></el-table-column>
				<el-table-column prop="newUserPayRate" label="新增用户付费率" width="100" align="center"></el-table-column>
				<el-table-column prop="newUserChargeAmt" label="新用户充值金额" width="100" align="center"></el-table-column>
				<el-table-column prop="oldUserChargeAmt" label="老用户充值金额" width="100" align="center"></el-table-column>
				<el-table-column prop="touristPresent" label="游客赠送" width="100" align="center"></el-table-column>
				<el-table-column prop="avgProfit" label="人均营收" width="100" align="center"></el-table-column>
				<el-table-column prop="avgChargeAmt" label="平均充值" width="100" align="center"></el-table-column>
				<el-table-column prop="newUserAvgChargeAmt" label="新增用户平均充值" width="100" align="center"></el-table-column>
				<el-table-column prop="oldUserAvgChargeAmt" label="老用户平均充值" width="100" align="center"></el-table-column>
				<el-table-column prop="ltv7" label="ltv7" width="120" align="center"></el-table-column>
				<el-table-column prop="ltv14" label="ltv14" width="120" align="center"></el-table-column>
				<el-table-column prop="ltv30" label="ltv30" width="120" align="center"></el-table-column>
				<el-table-column prop="ltv60" label="ltv60" width="120" align="center"></el-table-column>
				<el-table-column prop="retentionDay2" label="2日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay3" label="3日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay7" label="7日留存" width="100" align="center"></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="todayStatic.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { TodayStaticState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
//TodayStatic
interface QueryItem {
  pid: string;
  channel?: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TodayStatic extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  todayStatic: TodayStaticState = this.$store.state.todayStatic; //表单数据
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  logTime: Date[] = [this.startTime,this.endTime];
  page: number = 1; //当前页
  count: number = 10;
  // totalCount: number = 0;
  channel: string = "";
  type: number = 0; // 0 代表今日  1代表历史

  pidList: any[] = [];
  pid: string = "A";
  searchData(){
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    if (Object.keys(queryItem).length < 3) {
      this.$message({
        type: "warning",
        message: "至少输入一个查询条件！"
      });
      return;
    }
    myDispatch(this.$store, "GetTodayStatic", queryItem, true).then(() => {
      this.type = 1;
    });
  }


  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = { pid: this.pid };
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.channel == "官方") {
      temp.channel = "";
    }
    temp.page = this.page;
    temp.count = this.count;

    if (this.logTime && this.logTime[0]) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }

  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    if (this.type === 0) {
    } else {
      this.loadData();
    }
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    if (this.type === 0) {
    } else {
      this.loadData();
    }
  }

  sumDateFunc(row, column) {
    let date = new Date(row.sumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  channelFormat(row, column) {
    return row.channel === "" ? "官方" : row.channel + "";
  }

  logDateFunc(row, column) {
    let date = new Date(row.localeSumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
   //导出excle
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "统计时间", field: "sumDate", type: "Date" },
      { title: "渠道", field: "channel", type: "channelType" },
      { title: "总营收", field: "totalProfit", type: "money" },
      { title: "总充值金额", field: "totalChargeAmt", type: "money" },
      { title: "总兑换金额", field: "totalWithdrawAmt", type: "money" },
      { title: "总税收", field: "totalTax", type: "money" },
      { title: "在线充值金额", field: "onlineChargeAmt", type: "money" },
      { title: "代理充值金额", field: "agentChargeAmt", type: "money" },
      { title: "游戏税收", field: "gameTax", type: "money" },
      { title: "兑换税收", field: "totalWithdrawTax", type: "money" },
      { title: "总兑换人数", field: "totalWithdrawUserCount", type: "string" },
      { title: "登陆用户", field: "loginUserCount", type: "string" },
      { title: "新用户数", field: "newUserCount", type: "string" },
      { title: "老用户登陆数", field: "oldUserLoginUserCount", type: "string" },
      { title: "绑定用户数", field: "bindUserCount", type: "string" },
      { title: "绑定率", field: "bindRate", type: "string" },
      { title: "总充值人数", field: "totalChargeUserCount", type: "string" },
      { title: "新用户充值人数", field: "newUserChargeUserCount", type: "string" },
      { title: "付费率", field: "payRate", type: "string" },
      { title: "新增用户付费率", field: "newUserPayRate", type: "string" },
      { title: "新用户充值金额", field: "newUserChargeAmt", type: "money"  },
      { title: "老用户充值金额", field: "oldUserChargeAmt", type: "money" },
      { title: "游客赠送", field: "touristPresent", type: "money" },
      { title: "人均营收", field: "avgProfit", type: "money" },
      { title: "平均充值", field: "avgChargeAmt", type: "money" },
      { title: "新增用户平均充值", field: "newUserAvgChargeAmt", type: "money" },
      { title: "老用户平均充值", field: "oldUserAvgChargeAmt", type: "money" },
      { title: "ltv7", field: "ltv7", type: "money" },
      { title: "ltv14", field: "ltv14", type: "money" },
      { title: "ltv30", field: "ltv30", type: "money" },
      { title: "ltv60", field: "ltv60", type: "money" },
      { title: "2日留存", field: "retentionDay2", type: "string" },
      { title: "3日留存", field: "retentionDay3", type: "string" },
      { title: "7日留存", field: "retentionDay7", type: "string" },
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetExportCDaySum", queryItem).then(ret => {
      if(ret.code!==200){
        this.$message({type: "error",message: "导出失败"});
        return ;
      }
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
