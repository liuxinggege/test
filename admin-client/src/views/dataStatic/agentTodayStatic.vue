<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人每日统计">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">商人每日统计</span>
			</el-col>
			<!--工具条-->
			<span class="content_font"></span>
			<!-- <span>项目</span>
			<el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
				<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select> -->
			<span>商人id</span>
			<el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
			<span>统计时间</span>
			 <el-date-picker v-model="logTime"  value-format='yyyy-MM-dd HH:mm:ss' style="margin:5px 20px 5px 10px" type="daterange" start-placeholder="开始日期"
      end-placeholder="结束日期"></el-date-picker>

			<el-button type="primary" @click="searchData" style="margin:0px 0px 10px 0px">查询</el-button>
      <!-- <el-button type="success" @click="downloadExcel" style="margin:0px 0px 10px 10px">导出excel</el-button> -->
			<!--列表-->
			<el-table :data="todayStatic" border highlight-current-row style="width: 100%;" max-height="600">
				<el-table-column prop="sumDate" label="统计时间" fixed min-width="150" align="center" :formatter="sumDateFunc"></el-table-column>
				<el-table-column prop="pid" label="项目" fixed min-width="100" align="center" :formatter="pidFormat"></el-table-column>
				<el-table-column prop="uid" label="商人id" min-width="100" align="center"></el-table-column>
				<el-table-column prop="transferInSum" label="转入" min-width="100" align="center"></el-table-column>
				<el-table-column prop="transferOutSum" label="转出" min-width="100" align="center"></el-table-column>
				<el-table-column prop="upScoreSum" label="上分" min-width="100" align="center"></el-table-column>
				<el-table-column prop="downScoreSum" label="下分" min-width="100" align="center"></el-table-column>
				<el-table-column prop="recoverSectionFromSum" label="追分(加金币)" min-width="100" align="center"></el-table-column>
				<el-table-column prop="recoverSectionToSum" label="被追分(扣金币)" min-width="100" align="center"></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total" class="pag" :total="totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import {getAgentDailyStat} from "../../api/admin/dataStatic/dataStatic"
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myAsyncFn,myDispatch } from "../../utils/index.js";
//TodayStatic
interface QueryItem {
  uid?: string;
  startTime?: Date;
  endTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TodayStatic extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  /*inital data*/
  todayStatic: any[] = []; //表单数据
  logTime: Date[] = [];
  totalCount: number = 0;
  uid: string = "";

  pidList: any[] = [];
  pid: string = "A";
  searchData(){
    this.loadData();
  }
  async loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    if (Object.keys(queryItem).length < 3) {
      this.$message({
        type: "warning",
        message: "请输入全部查询条件！"
      });
      return;
    }
    let ret = await myAsyncFn(getAgentDailyStat,queryItem)
    if(ret.code===200){
      this.todayStatic = ret.msg.pageData
      this.totalCount = ret.msg.totalCount
    }else{
      this.$message({
        type:'error',
        message:ret.err
      })
    }
  }


  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = { };
    if (this.uid) {
      temp.uid = this.uid;
    }
    if (this.logTime && this.logTime[0]) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }


  sumDateFunc(row, column) {
    let date = new Date(row.sumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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
