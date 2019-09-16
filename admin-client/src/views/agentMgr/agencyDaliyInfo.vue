<template>
     <div class="dashboard-outer">
	    <el-card class="dashboard-second">
			<el-col  class="toolbar1">
			<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理每日数据">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">代理每日数据</span>
			</el-col>
			<div class="box">
         <span>项目</span>
          <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
            </el-option>
          </el-select>
        <span>代理ID</span>
        <el-input v-model="agentID" style="width:120px; margin:20px 10px"></el-input>
        <span>时间</span>
        <el-date-picker v-model="registerTime" type="datetimerange"
            value-format='yyyy-MM-dd HH:mm:ss' 
            style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
        </el-date-picker>
				<el-button type="primary" @click="searchData" style="margin:0px 0px 10px 100px">搜索</el-button>
				<el-button type="primary" @click="downloadExcel">导出</el-button>
			</div>
		<!--列表-->
			<el-table :data="agentTaxInfo.agencyDaliyInfo"  border highlight-current-row style="width: 99%;" max-height="700">
          <el-table-column prop="pid" label="项目" width="80" align="center"  :formatter="pidFormat" />
	        <el-table-column prop="sumDate" label="日期" width="200" align="center" :formatter="localeSumDateFormatter"></el-table-column>
          <el-table-column prop="agencyId" label="代理ID" width="100" align="center"></el-table-column>
          <el-table-column prop="taxRate" label="税收比例" width="100" align="center"></el-table-column>
          <el-table-column prop="totalNewAgency" label="新开代理" width="100" align="center"></el-table-column>
          <el-table-column prop="totalBindUserCount" label="总绑定用户" width="100" align="center"></el-table-column>
          <el-table-column prop="gameTax" label="总税收" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelTotalGameTax" label="直推税收" width="100" align="center"></el-table-column>
          <el-table-column prop="subPromotionGameTax" label="下级税收" width="100" align="center"></el-table-column>
          <el-table-column prop="realGameTax" label="扣量前总税收" width="100" align="center"></el-table-column>
          <el-table-column prop="realMyChannelTotalGameTax" label="扣量前直推税收" width="100" align="center"></el-table-column>
          <el-table-column prop="realSubPromotionGameTax" label="扣量前下级税收" width="100" align="center"></el-table-column>
          <el-table-column prop="gameTaxIncome" label="总利润" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelTotalIncome" label="直推利润" width="100" align="center"></el-table-column>
          <el-table-column prop="subPromotionProfit" label="下级利润" width="100" align="center"></el-table-column>
          <el-table-column prop="totalNewUserCount" label="总新增用户" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelNewUserCount" label="直推新增用户" width="100" align="center"></el-table-column>
          <el-table-column prop="subNewUserCount" label="下级新增用户" width="100" align="center"></el-table-column>
          <el-table-column prop="totalChargeAmt" label="总充值金额" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelTotalChargeAmt" label="直推充值金额" width="100" align="center"></el-table-column>
          <el-table-column prop="subTotalChargeAmt" label="下级充值金额" width="100" align="center"></el-table-column>
          <el-table-column prop="totalChargeUserCount" label="总充值人数" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelChargeUserCount" label="直推充值人数" width="100" align="center"></el-table-column>
          <el-table-column prop="subChargeUserCount" label="下级充值人数" width="100" align="center"></el-table-column>
          <el-table-column prop="officialWithdrawAmt" label="总兑换" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelOfficialWithdrawAmt" label="直推兑换" width="100" align="center"></el-table-column>
          <el-table-column prop="subOfficialWithdrawAmt" label="下级兑换" width="100" align="center"></el-table-column>
          <el-table-column prop="officialWithdrawUserCount" label="总兑换人数" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelOfficialWithdrawUserCount" label="直推兑换人数" width="100" align="center"></el-table-column>
          <el-table-column prop="subOfficialWithdrawUserCount" label="下级兑换人数" width="100" align="center"></el-table-column>
          <el-table-column prop="totalGameUserCount" label="总活跃人数" width="100" align="center"></el-table-column>
          <el-table-column prop="myChannelGameUserCount" label="直推活跃人数" width="100" align="center"></el-table-column>
          <el-table-column prop="subGameUserCount" label="下级活跃人数" width="100" align="center"></el-table-column>
          <el-table-column prop="acceptSubsidy" label="接受补贴" width="100" align="center"></el-table-column>
          <el-table-column prop="paySubsidy" label="给出补贴" width="100" align="center"></el-table-column>

			</el-table>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
					@current-change="handleCurrentChange" 
					@size-change="handleSizeChange" 
					:current-page="page" 
					:page-sizes="[10,20,30,50]" 
					:page-size="count" 
					:total="agentTaxInfo.totalCount">
				</el-pagination>
			</el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch , getYearMonthDay } from "../../utils/index";
import { AgentTaxInfoState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";

interface QueryItem {
   pid:string;
  channel?: string;
  alipay?: string;
  status?: string[];
  page?: number;
  count?: number;
  startDate?: Date;
  endDate?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgentTaxInfo extends Vue {


  agentTaxInfo: AgentTaxInfoState = this.$store.state.agentTaxInfo;

  agentID: string = "";
  page:number = 1;
  count:number = 10;
  type:string = "day";

  infoVisible:boolean= false;
  timeRun:any = "";
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  registerTime: Date[] = [this.startTime,this.endTime];
  loadType:number = 1;
  pidList: any[] = [];
  pid: string = "";
  contactArray:any = [];
  contactDot:any = 0;
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
    myDispatch(this.$store, "GetAgenyDailyInfo", queryItem, true).then(() => {
    });
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }
  getQueryItem() {
    let temp: any = {pid:this.pid};

    if (this.agentID.trim()){
      temp.agencyId  =  this.agentID;
    }

    if (this.registerTime && this.registerTime.length === 2){
      temp.sumDateStart = this.registerTime[0];
      temp.sumDateEnd = this.registerTime[1];
    }
    return temp
  }
  localeSumDateFormatter(row, index){
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
   pidFormat(row, column){
    let name = "";
    this.pidList.forEach(element => {
        if(element.pid === row.pid){
          name =  element.name ;
        }
    });
    return name ;
  }
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "日期", field: "sumDate", type: "Date" },
      { title: "代理ID", field: "agencyId", type: "string" },
      { title: "税收比例", field: "taxRate", type: "string" },
      { title: "总税收", field: "gameTax", type: "string" },
      { title: "直推税收", field: "myChannelTotalGameTax", type: "string" },
      { title: "下级税收", field: "subPromotionGameTax", type: "string" },
      { title: "总利润", field: "gameTaxIncome", type: "string" },
      { title: "直推利润", field: "myChannelTotalIncome", type: "string" },
      { title: "下级利润", field: "subPromotionProfit", type: "string" },
      { title: "总新增用户", field: "totalNewUserCount", type: "string" },
      { title: "直推新增用户", field: "myChannelNewUserCount", type: "string" },
      { title: "下级新增用户", field: "subNewUserCount", type: "string" },
      { title: "总充值金额", field: "totalChargeAmt", type: "string" },
      { title: "直推充值金额", field: "myChannelTotalChargeAmt", type: "string" },
      { title: "下级充值金额", field: "subTotalChargeAmt", type: "string" },
      { title: "总充值人数", field: "totalChargeUserCount", type: "string" },
      { title: "直推充值人数", field: "myChannelChargeUserCount", type: "string" },
      { title: "下级充值人数", field: "subChargeUserCount", type: "string" },
      { title: "总兑换", field: "officialWithdrawAmt", type: "string" },
      { title: "直推兑换", field: "myChannelOfficialWithdrawAmt", type: "string" },
      { title: "下级兑换", field: "subOfficialWithdrawAmt", type: "string" },
      { title: "总兑换人数", field: "officialWithdrawUserCount", type: "string" },
      { title: "直推兑换人数", field: "myChannelOfficialWithdrawUserCount", type: "string" },
      { title: "下级兑换人数", field: "subOfficialWithdrawUserCount", type: "string" },
      { title: "总活跃人数", field: "totalGameUserCount", type: "string" },
      { title: "直推活跃人数", field: "myChannelGameUserCount", type: "string" },
      { title: "下级活跃人数", field: "subGameUserCount", type: "string" },
      { title: "接受补贴", field: "acceptSubsidy", type: "string" },
      { title: "给出补贴", field: "paySubsidy", type: "string" },
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetAgenyDailyInfoExcel", queryItem).then(ret => {
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
