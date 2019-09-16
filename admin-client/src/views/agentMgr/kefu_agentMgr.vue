<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理列表">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">代理列表</span>
			</el-col>
			<div class="box">
				<span>项目</span>
				<el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
					<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
					</el-option>
				</el-select>
				<span>代理ID</span>
				<el-input v-model="agentId" style="width:120px; margin:10px"></el-input>
				<span>代理后台账号</span>
				<el-input v-model="agentAct" style="width:120px; margin:10px"></el-input>
				<span>代理名字</span>
				<el-input v-model="agentName" style="width:120px; margin:10px"></el-input>
				<span>代理渠道</span>
				<el-input v-model="agentChannel" style="width:120px; margin:10px"></el-input>
				<span>代理等级</span>
				<el-input v-model="agentLevel" style="width:120px; margin:10px"></el-input>
				<br/>
				<span>税收比例</span>
				<el-input v-model="minRate" style="width:120px; margin:10px"></el-input>
				<span>到</span>
				<el-input v-model="maxRate" style="width:120px; margin:10px"></el-input>
        <span>最后登录时间</span>
        <el-date-picker v-model="loginDate" type="datetimerange"
          value-format='yyyy-MM-dd HH:mm:ss' 
          style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
        </el-date-picker>
				<el-button type="primary" @click="searchData" style="margin:10px">搜索</el-button>
			</div>
			<!--列表-->
			<el-table :data="agentMgr.agentList" border highlight-current-row style="width: 99%;" max-height="700">
				<el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat"></el-table-column>
				<el-table-column prop="channel" label="代理渠道" min-width="175" align="center" fixed/>
				<el-table-column prop="agencyId" label="代理ID" width="120" align="center" fixed/>
				<el-table-column prop="level" label="代理等级" width="120" align="center" />
				<el-table-column prop="type" label="代理类型" min-width="100" align="center" :formatter="typeFormatther" />
				<el-table-column prop="name" label="代理名字" width="120" align="center" />
				<el-table-column prop="createDate" label="创建时间" min-width="220" align="center" :formatter="dateFormatter" />
        <el-table-column prop="loginDate" label="最后登录时间" min-width="220" align="center" :formatter="loginDateFormatter" />
			</el-table>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="agentMgr.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
		<el-card class="dashboard-second">
			<span>项目</span>
			<el-select v-model="agencyPid" @change="change" placeholder="必填项" style='width:200px; margin:10px 30px 10px 3px'>
				<el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select>
			<span>代理ID</span>
			<el-input v-model="searchAgencyId" style="width:120px; margin:0 10px"></el-input>
			<el-button type="primary" @click="searchAgencyById">搜索</el-button>
			<el-tree style="margin:30px" highlight-current node-key accordion :data="data" :props="defaultProps" @node-click="handleNodeClick">
			</el-tree>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import {
  AgentMgrState,
  AgentTaxSettingState
} from "../../store/stateInterface";
import { BigNumber } from "bignumber.js";

interface QueryItem {
  pid: string;
  agencyId?: string;
  act?: string;
  name?: string;
  taxRateStart?: string;
  taxRateEnd?: string;
  channel?: string;
  level?: string;
  page?: number;
  count?: number;
  loginDateStart?: Date;
  loginDateEnd?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgentMgr extends Vue {
  agentMgr: AgentMgrState = this.$store.state.agentMgr;
  agentTaxSetting: AgentTaxSettingState = this.$store.state.agentTaxSetting;

  page: number = 1; //当前页
  count: number = 10;
  channel: string = "";
  pid = "A";
  addPid = "";
  agencyPid = "A";
  pidList: any[] = [];
  pidListForAdd: any[] = [];
  loginDate:Date[] = []; 
  canFixGameUid: boolean = false;
  canFixMasterGameID: boolean = false;

  agentId: string = "";
  agentAct: string = "";
  agentName: string = "";
  minRate: string = "";
  maxRate: string = "";
  agentChannel: string = "";
  agentLevel: string = "";

  isBusinessman: boolean = false;
  isNormal: boolean = false;
  haveSonAgent: boolean = false;
  showSonAgent: boolean = false;

  addAgentName: string = "";
  addAgentGameID: string = "";
  addAgentMasterGameID: string = "";
  addAgentAct: string = "";
  addAgentPwd: string = "";
  settlePwd: string = "";
  addQQ: string = "";
  addPhoneNumber: string = "";
  addWetch: string = "";
  addInfo: string = "";
  addShuishou: string = "";
  addRate: string = "";
  addAgencyId: number = 0;

  businessFristAgent: string = "";
  generalHeadmanAgent: string = "";
  generalFristAgent: string = "";

  addAlipayAct: string = "";
  addAlipayName: string = "";
  addBankCardNo: string = "";
  addBankName: string = "";
  addBankCardName: string = "";

  restaurants: any[] = [
    { label: "未选择", value: "" },
    { label: "中国银行", value: "BOC" },
    { label: "工商银行", value: "ICBC" },
    { label: "农业银行", value: "ABC" },
    { label: "建设银行", value: "CCB" },
    { label: "交通银行", value: "BCM" },
    { label: "招商银行", value: "CMB" },
    { label: "光大银行", value: "CEB" },
    { label: "民生银行", value: "CMBC" },
    { label: "兴业银行", value: "CIB" },
    { label: "浦发银行", value: "SPDB" }
  ];

  //agencyTree
  searchAgencyId: string = "";
  tempData: any = "";
  data: any[] = [
    {
      agencyId: 1,
      label: "项目组",
      children: []
    }
  ];
  defaultProps = {
    agencyId: "0",
    label: "label",
    children: "children"
  };

  handleNodeClick(currAgency, node, vue) {
    myDispatch(
      this.$store,
      "GetAgentTree",
      { pid: this.agencyPid, agencyId: currAgency.agencyId },
      true
    ).then(() => {
      let tmp = this.agentMgr.agencyTree;
      let count = tmp.children.length || 0;
      let agency = `ID：${tmp.agency.agencyId || "-"}，名字：${tmp.agency
        .name || "-"}，渠道：${
        tmp.agency.channel ? tmp.agency.channel : "无"
      }，等级：${tmp.agency.level}， 下一级代理数量：${count}`;
      let children = tmp.children.map(e => {
        let child = {
          agencyId: e.agencyId,
          label: `ID：${e.agencyId}，	名字：${e.name}，	渠道：${
            e.channel ? e.channel : "无"
          }	，等级：${e.level}`,
          children: []
        };
        return child;
      });
      currAgency.children = children;
      currAgency.label = agency;
    });
  }
  change(value) {
    switch (value) {
      case "A":
        this.searchAgencyId = "1";
        this.agencyPid = value;
        break;
      case "B":
        this.searchAgencyId = "14060";
        this.agencyPid = value;
        break;
      case "C":
        this.searchAgencyId = "28520";
        this.agencyPid = value;
        break;
    }
    this.searchAgencyById();
  }
  searchAgencyById() {
    if (!this.searchAgencyId || !this.agencyPid) {
      this.$confirm("项目和代理ID必填", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      return;
    }
    this.loadAgencyTree({ agencyId: this.searchAgencyId, pid: this.agencyPid });
  }
  loadAgencyTree(cond) {
    myDispatch(this.$store, "GetAgentTree", cond, true).then(() => {
      let tmp = this.agentMgr.agencyTree;
      if (!tmp.children.length) {
        return;
      }
      let count = tmp.children.length;
      let agency = `ID：${tmp.agency.agencyId}，名字：${
        tmp.agency.name
      }，	渠道：${tmp.agency.channel ? tmp.agency.channel : "无"}，	等级：${
        tmp.agency.level
      }， 下一级代理数量：${count}`;
      let children = tmp.children.map(e => {
        let child = {
          agencyId: e.agencyId,
          label: `ID：${e.agencyId}，	名字：${e.name}，	渠道：${
            e.channel ? e.channel : "无"
          }	，等级：${e.level} `,
          children: []
        };
        return child;
      });
      this.data = [
        { label: agency, agencyId: tmp.agency.agencyId, children: children }
      ];
    });
  }

  //生命周期钩子函数
  created() {
    this.loadData();
    this.loadTaxInfo();
    this.loadAgencyTree({ level: 0, pid: this.agencyPid });
     this.pidList = [{name:"全部",pid:""},...JSON.parse(<string>sessionStorage.getItem("pid"))];
      this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
  }

  bankNameFormatther(row, index) {
    switch (row.bankName) {
      case "BOC":
        return "中国银行";
      case "ICBC":
        return "工商银行";
      case "ABC":
        return "农业银行";
      case "CCB":
        return "建设银行";
      case "BCM":
        return "交通银行";
      case "CMB":
        return "招商银行";
      case "CEB":
        return "光大银行";
      case "CMBC":
        return "民生银行";
      case "CIB":
        return "兴业银行";
      case "SPDB":
        return "浦发银行";
    }
  }

  loadTaxInfo() {
    myDispatch(this.$store, "GetAgentTaxSetting", {}, true).then(() => {
      this.businessFristAgent = this.agentTaxSetting.taxRateData.businessTaxRate;
      this.generalHeadmanAgent = this.agentTaxSetting.taxRateData.leaderTaxRate;
      this.generalFristAgent = this.agentTaxSetting.taxRateData.generalTaxRate;
    });
  }
  //初始化数据
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetAgentListNew", queryItem, true).then(() => {});
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  getQueryItem() {
    let tmp: QueryItem = { pid: this.pid };
    if (this.agentChannel.trim()) {
      tmp.channel = this.agentChannel;
    }
    if (this.agentLevel.trim()) {
      tmp.level = this.agentLevel;
    }
    if (this.agentAct.trim()) {
      tmp.act = this.agentAct;
    }
    if (this.loginDate && this.loginDate[0]) {
      tmp.loginDateStart = this.loginDate[0];
      tmp.loginDateEnd = this.loginDate[1];
    }
    if (this.agentName.trim()) {
      tmp.name = this.agentName;
    }

    if (this.agentId.trim()) {
      tmp.agencyId = this.agentId;
    }

    if (this.minRate.trim()) {
      tmp.taxRateStart = this.minRate;
    }

    if (this.maxRate.trim()) {
      tmp.taxRateEnd = this.maxRate;
    }
    return tmp;
  }

  handleShowSonAgent() {
    this.showSonAgent = true;
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

  updatStatus(index, row) {
    let msg = "";
    if (row.status) {
      msg = "冻结";
    } else {
      msg = "解冻";
    }
    let msg1 = "是否" + msg + "代理" + row.agencyId + "(" + row.name + ")";
    let tempData: any = {
      pid: row.pid,
      agencyId: row.agencyId,
      status: !row.status
    };
    this.$confirm(msg1, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UpdateAgentStatus", tempData, true).then(
          () => {
            if (this.agentMgr.code === 200) {
              this.$message({
                showClose: true,
                type: "success",
                message: "修改成功!"
              });
              this.loadData();
              return;
            }
            this.$message({
              showClose: true,
              type: "error",
              message: "修改失败!" + this.agentMgr.msg
            });
          }
        );
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  dateFormatter(row, index) {
    if (row.createDate) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  loginDateFormatter(row, index) {
    if (row.loginDate) {
      let date = new Date(row.loginDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  typeFormatther(row, index) {
    if (row.type === "general") {
      return "全民代理";
    } else if (row.type === "business") {
      return "商人代理";
    } else {
      return row.type;
    }
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
.el-tree-node__label,
.el-tree-node__content {
  font-size: 15px;
  margin: 0px;
}
</style>
