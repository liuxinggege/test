<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="推广日表">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">推广日表(代理每日直推)</span>
			</el-col>
			<div class="box">
			<span style="font-size:12pt; margin:10px 5px 10px 0">【推广(扣量后)】总营收:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalProfit ?spreadDayTable.totalStaticData.totalProfit : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总充值:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalChargeAmt ? spreadDayTable.totalStaticData.totalChargeAmt : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">(玩家)总兑换:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalWithdrawAmt ? spreadDayTable.totalStaticData.totalWithdrawAmt : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总注册用户:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.newUserCount ? spreadDayTable.totalStaticData.newUserCount : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总税收:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalTax ? spreadDayTable.totalStaticData.totalTax : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总付费率:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.payRate ? spreadDayTable.totalStaticData.payRate : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总ARPPU:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.arppu ? spreadDayTable.totalStaticData.arppu : 0}}</span>
			<br>
			<br>
			<span style="font-size:12pt; margin:10px 5px 10px 0">【实际(扣量前)】总营收:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalProfit ? spreadDayTable.totalStaticData.totalProfit : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总充值:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalChargeAmt ? spreadDayTable.totalStaticData.totalChargeAmt : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">(玩家)总兑换:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalWithdrawAmt ? spreadDayTable.totalStaticData.totalWithdrawAmt : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总注册用户:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.newUserCount ? spreadDayTable.totalStaticData.newUserCount : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总税收:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.totalTax ? spreadDayTable.totalStaticData.totalTax : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总付费率:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.payRate ? spreadDayTable.totalStaticData.payRate : 0}}</span>
			<span style="font-size:12pt; margin:10px 5px 10px 25px">总ARPPU:</span>
			<span style="font-size:12pt;">{{spreadDayTable.totalStaticData.arppu ? spreadDayTable.totalStaticData.arppu : 0}}</span>
			<br><br>
				<span>项目</span>
				<el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
					<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
					</el-option>
				</el-select>
				<span>代理ID</span>
				<el-input v-model="agencyId" style="width:120px; margin:0 10px"></el-input>
				<span>代理名称</span>
				<el-input v-model="name" style="width:120px; margin:0 10px"></el-input>
				<span>统计时间</span>
				<el-date-picker v-model="staticTime" type="date"  style="margin:20px 10px" placeholder="选择日期">
				</el-date-picker>
				<el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
        <el-button type="primary" @click="loadTotal" style="margin:0px 0px 10px 10px">查看总数据</el-button>
				<el-button type="primary" @click="downloadExcel" style="margin:0px 0px 10px 10px">导出</el-button>
			</div>
			<!--列表-->
			<el-table :data="spreadDayTable.spreadDayTableDatas" border highlight-current-row style="width: 99%;" max-height="600">
				<el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat" fixed/>
				<el-table-column prop="sumDate" label="统计时间" min-width="220" align="center" :formatter="sumDatedFormatter" fixed/>
				<el-table-column prop="agencyId" label="代理ID" min-width="175" align="center" fixed/>
				<el-table-column prop="name" label="代理名称" width="100" align="center" fixed/>
				<el-table-column prop="totalProfit" label="营收" width="150" align="center" />
				<el-table-column prop="totalChargeAmt" label="充值" width="200" align="center" />
				<el-table-column prop="totalWithdrawAmt" label="(玩家)兑换" width="170" align="center" />
				<el-table-column prop="newUserCount" label="新增用户" width="200" align="center" />
				<el-table-column prop="oldUserCount" label="老用户" width="200" align="center" />
				<el-table-column prop="loginUserCount" label="登陆用户数" width="200" align="center" />
				<el-table-column prop="bindUserCount" label="绑定用户数" width="200" align="center" />
				<el-table-column prop="bindRate" label="绑定率" width="200" align="center" />
				<el-table-column prop="newUserChargeUserCount" label="新增充值人数" width="200" align="center" />
				<el-table-column prop="oldUserChargeUserCount" label="老充值人数" width="200" align="center" />
				<el-table-column prop="newUserAvgChargeAmt" label="新用户平均充值" width="200" align="center" />
				<el-table-column prop="oldUserAvgChargeAmt" label="老用户平均充值" width="200" align="center" />
				<el-table-column prop="avgChargeAmt" label="平均充值" width="200" align="center" />
				<el-table-column prop="gameTax" label="总税收" width="200" align="center" />
				<el-table-column prop="avgProfit" label="人均营收" width="200" align="center" />


			</el-table>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="spreadDayTable.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { SpreadDayTableState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";

interface QueryItem {
  pid: string;
  agencyId?: string;
  name?: string;
  page?: number;
  count?: number;
  sumDateStart?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SpreadDayTable extends Vue {
  page: number = 1; //当前页
  count: number = 10;
  staticTime: Date = new Date();
  spreadDayTable: SpreadDayTableState = this.$store.state.spreadDayTable;
  agencyId: string = "";
  name: string = "";
  pidList: any[] = [];
  pid: string = "A";

  //生命周期钩子函数
  created() {
    this.pidList = [{name:"全部",pid:""},...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }

  //初始化数据
  loadData() {
    let queryItem: QueryItem|undefined = this.getQueryItem();
    if(!queryItem){
      this.$message({  type: "error",  message: "必须输入查询时间！"});
      return;
    }
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetSpreadDayTable", queryItem).then(() => {});
  }
  //初始化数据
  loadTotal() {
    myDispatch(this.$store, "GetSpreadDayTotal", {pid:this.pid}).then(() => {});
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let tmp: QueryItem = { pid: this.pid };
    if (this.agencyId.trim()) {
      tmp.agencyId = this.agencyId;
    }
    if (this.name.trim()) {
      tmp.name = this.name;
    }
    if(!this.staticTime){
      return;
    }
    tmp.sumDateStart = this.staticTime;
    return tmp;
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

  sumDatedFormatter(row, index) {
    if (row.sumDate) {
      let date = new Date(row.sumDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "统计时间", field: "sumDate", type: "Date" },
      { title: "代理ID", field: "agencyId", type: "string" },
      { title: "代理名称", field: "name", type: "string" },
      { title: "营收", field: "totalProfit", type: "string" },
      { title: "充值", field: "totalChargeAmt", type: "string" },
      { title: "(玩家)兑换", field: "totalWithdrawAmt", type: "string" },
      { title: "新增用户", field: "newUserCount", type: "string" },
      { title: "老用户", field: "oldUserCount", type: "string" },
      { title: "登陆用户数", field: "loginUserCount", type: "string" },
      { title: "绑定用户数", field: "bindUserCount", type: "string" },
      { title: "绑定率", field: "bindRate", type: "string" },
      {
        title: "新增充值人数",
        field: "newUserChargeUserCount",
        type: "string"
      },
      { title: "老充值人数", field: "oldUserChargeUserCount", type: "string" },
      { title: "新用户平均充值", field: "newUserAvgChargeAmt", type: "string" },
      { title: "老用户平均充值", field: "oldUserAvgChargeAmt", type: "string" },
      { title: "平均充值", field: "avgChargeAmt", type: "string" },
      { title: "总税收", field: "gameTax", type: "string" },
      { title: "人均营收", field: "avgProfit", type: "string" }
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    if (!queryItem ) {
      this.$message({
        type: "warning",
        message: "至少输入查询时间！"
      });
      return;
    }
    myDispatch(this.$store, "GetSpreadDayTableExcel", queryItem).then(ret => {
      downloadExcel(ret,this);
    });
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
