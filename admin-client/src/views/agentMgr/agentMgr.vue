<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理列表"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代理列表</span>
      </el-col>
      <div class="box">
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="width:120px; margin:10px">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
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
        <br>
        <span>税收比例</span>
        <el-input v-model="minRate" style="width:120px; margin:10px"></el-input>
        <span>到</span>
        <el-input v-model="maxRate" style="width:120px; margin:10px"></el-input>
        <span>资金池状态</span>
        <el-select v-model="fundReserve" placeholder="请选择状态" clearable style="width:120px; margin:10px">
          <el-option v-for="item in bonusPoolStates" :key="item.backEndValue" :label="item.displayValue" :value="item.backEndValue"></el-option>
        </el-select>
        <span>最后登录时间</span>
        <el-date-picker v-model="loginDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button type="primary" @click="searchData" style="margin:10px">搜索</el-button>
        <el-button type="primary" @click="downloadExcel" style="margin:10px">导出execel</el-button>
        <el-button type="primary" @click="addClick" style="margin:10px">添加</el-button>
      </div>
      <!--列表-->
      <el-table :data="agentMgr.agentList" border highlight-current-row style="width: 99%;" max-height="700">
        <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="channel" label="代理渠道" min-width="175" align="center" fixed/>
        <el-table-column prop="agencyId" label="代理ID" width="120" align="center" fixed/>
        <el-table-column prop="level" label="代理等级" width="120" align="center"/>
        <el-table-column prop="type" label="代理类型" min-width="100" align="center" :formatter="typeFormatther"/>
        <el-table-column prop="name" label="代理名字" width="120" align="center"/>
        <el-table-column prop="createDate" label="创建时间" min-width="220" align="center" :formatter="dateFormatter"/>
        <el-table-column prop="loginDate" label="最后登录时间" min-width="220" align="center" :formatter="loginDateFormatter"/>
        <el-table-column prop="gameUid" label="代理游戏ID" width="120" align="center"/>
        <el-table-column prop="act" label="代理后台账号" width="120" align="center"/>
        <!-- <el-table-column prop="maxChildrenCount" label="最大下级代理数量" width="120" align="center"/> -->
        <el-table-column prop="alipayAct" label="支付宝账号" width="120" align="center"/>
        <el-table-column prop="alipayName" label="支付宝姓名" width="120" align="center"/>
        <el-table-column prop="bankCardNo" label="银行卡号" width="240" align="center"/>
        <el-table-column prop="bankName" label="银行开户行" width="120" align="center" :formatter="bankNameFormatther"/>
        <el-table-column prop="bankCardName" label="持卡人姓名" width="120" align="center"/>
        <el-table-column prop="qq" label="联系QQ" width="120" align="center"/>
        <el-table-column prop="wx" label="联系微信" width="120" align="center"/>
        <el-table-column prop="phone" label="联系电话" width="120" align="center"/>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="agentForbidden(scope.row)" v-if="!scope.row.status">冻结</el-button>
            <el-button type="text" @click="agentForbidden(scope.row)" v-if="scope.row.status">正常</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="上级归属ID" width="120" align="center"/>
        <el-table-column prop="taxRate" label="税收比例" width="120" align="center"/>
        <el-table-column prop="fundReserve" label="资金池状态" width="120" align="center" :formatter="stateFormatter"/>
        <el-table-column prop="totalFund" label="资金池金额" width="120" align="center"/>
        <el-table-column prop="1" label="税收扣量" width="120" align="center"/>
        <el-table-column prop="remarks" label="备注" width="200" align="center"/>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="eidtAnget(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button  type="text" @click="deletAgent(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="agentMgr.totalCount"></el-pagination>
      </el-col>
      <!-- 添加代理 -->
      <el-dialog :visible.sync="addAgentVisible" width="800px">
        <span style="font-size:12pt; margin:10px 0px 10px 98px">项目</span>
        <el-select v-model="addPid" placeholder="必填项" style="width:200px; margin:10px 30px 10px 35px">
          <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">代理名字</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="必填项" v-model="addAgentName"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 50px">代理游戏ID</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="选填项" v-model="addAgentGameID"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 34px">代理后台账号</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="必填项" v-model="addAgentAct"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">后台密码</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="必填项" v-model="addAgentPwd"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 103px">QQ</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="选填项" v-model="addQQ"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 80px">手机号</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addPhoneNumber"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 80px">微信号</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addWetch"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 95px">备注</span>
        <el-input type="text" style="width:400px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addInfo"></el-input>
        <br>
        <br>
        <el-checkbox type="text" style="font-size:12pt; margin:0px 0px 0px 164px" class="checkbox" label="开设下级代理" border v-model="haveSonAgent"></el-checkbox>
        <el-button type="primary" @click="addAgentCancel" style="margin:20px 0px 10px 500px">取消</el-button>
        <el-button type="primary" @click="addAgentConfirm" style="margin:20px 0px 10px 30px">确认</el-button>
      </el-dialog>
      <!-- 封号解封 -->
      <el-dialog :visible.sync="dialogUserForbiddenVisible" width="500px">
        <div style="margin:0px 0px 40px 220px;font-size:20px;">{{this.loginForbidden?"解封":"冻结"}}</div>
        <div style="margin:0px 0px 40px 40px">
          <span style="font-size:20px;">项目：{{curPidStr}}</span>
        </div>
        <div style="margin:0px 0px 40px 40px">
          <span style="font-size:20px;">代理ID：{{curAgentId}}</span>
        </div>
        <div style="margin:0px 0px 40px 40px">
          <span style="font-size:20px;">理由：</span>
          <el-input type="textarea" v-model="reason" placeholder="理由必填" style="width:320px"></el-input>
          <br>
        </div>
        <el-button type="primary" @click="updatStatus" style="margin:0px 0px 10px 230px">确认提交</el-button>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog :visible.sync="updateAgentVisible" width="800px">
        <span style="font-size:12pt; margin:10px 0px 10px 98px">项目</span>
        <el-select disabled v-model="addPid" placeholder="必填项" style="width:200px; margin:10px 30px 10px 35px">
          <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">代理名字</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="必填项" v-model="addAgentName"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 50px">代理游戏ID</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="选填项" v-model="addAgentGameID" :disabled="canFixGameUid"></el-input>
        <span style="font-size:12pt; margin:0">代理(师傅)游戏ID</span>
        <!-- :disabled="canFixMasterGameID" -->
        <el-input type="text" style="width:200px; margin:10px 14px 10px 13px" placeholder="选填项" v-model="addAgentMasterGameID"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 34px">代理后台账号</span>
        <el-input type="text" style="width:200px; margin:10px 30px 10px 35px" placeholder="必填项" v-model="addAgentAct" disabled></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">后台密码</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addAgentPwd"></el-input>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">结算密码</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="settlePwd"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 49px">支付宝账户</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addAlipayAct"></el-input>

        <span style="font-size:12pt; margin:10px 0px 10px 64px">银行卡号</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addBankCardNo"></el-input>
        <span style="font-size:12pt; margin:10px 0px 10px 49px">支付宝姓名</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addAlipayName"></el-input>
        <span style="font-size:12pt; margin:10px 0px 10px 49px">持卡人姓名</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addBankCardName"></el-input>
        <br>

        <span style="font-size:12pt; margin:10px 0px 10px 103px">QQ</span>
        <el-input type="text" style="width:200px;margin:10px 0px 10px 36px" placeholder="选填项" v-model="addQQ"></el-input>
        <span style="font-size:12pt; margin:10px 0px 10px 49px">银行开户行</span>
        <el-input type="text" style="width:200px;margin:10px 0px 10px 35px" v-model="addBankName" :disabled="true"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 80px">手机号</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addPhoneNumber"></el-input>
        <span style="font-size:12pt; margin:10px 0px 10px 80px">微信号</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addWetch"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 64px">税收分成</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addShuishou"></el-input>
        <span style="font-size:12pt; margin:10px 0px 10px 31px">下级代理数量</span>
        <el-input type="text" style="width:200px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addMaxChildrenCount"></el-input>
        <br>
        <span style="font-size:12pt; margin:10px 0px 10px 95px">备注</span>
        <el-input type="text" style="width:400px; margin:10px 0px 10px 35px" placeholder="选填项" v-model="addInfo"></el-input>
        <!-- <span style="font-size:12pt; margin:10px 0px 10px 64px">扣量比例</span>
        <el-input  type='text' style='width:200px; margin:10px 0px 10px 35px'  placeholder="选填,不填默认为1"  v-model="addRate"></el-input>-->
        <br>
        <el-checkbox type="text" style="font-size:12pt; margin:0px 0px 20px 164px" class="checkbox" label="开设下级代理" border v-model="haveSonAgent"></el-checkbox>
        <el-checkbox type="text" style="font-size:12pt; margin:0px 0px 20px 164px" class="checkbox" label="下级税收限制" border v-model="haveSetAgencyCheckGameTax"></el-checkbox>
        <el-checkbox type="text" style="font-size:12pt; margin:0px 0px 20px 164px" class="checkbox" label="禁止提现" border v-model="banSettlement"></el-checkbox>
        <el-checkbox type="text" style="font-size:12pt; margin:0px 0px 20px 164px" class="checkbox" label="数据后台查看权限" border v-model="haveDataPrivilege"></el-checkbox>
        <el-checkbox type="text" style="font-size:12pt; margin:0px 10px 20px 164px" class="checkbox" label="独立域名" border v-model="isIndep"></el-checkbox>
        <span v-if="isIndep" style="font-size:12pt">域名个数</span>
        <el-input-number v-if="isIndep" style="width:80px" controls-position="right" v-model="indepNum" :min="1" :max="3"></el-input-number>

        <el-button type="primary" @click="updateAgentCancel" style="margin:20px 0px 10px 500px">取消</el-button>
        <el-button type="primary" @click="updateAgentConfirm" style="margin:20px 0px 10px 30px">确认</el-button>
      </el-dialog>
    </el-card>
    <el-card class="dashboard-second">
      <span>项目</span>
      <el-select v-model="agencyPid" @change="change" placeholder="必填项" style="width:200px; margin:10px 30px 10px 3px">
        <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
      </el-select>
      <span>代理ID</span>
      <el-input v-model="searchAgencyId" style="width:120px; margin:0 10px"></el-input>
      <el-button type="primary" @click="searchAgencyById">搜索</el-button>
      <el-tree style="margin:30px" highlight-current node-key accordion :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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
import { downloadExcel } from "../../utils/downloadEXCEL";
import { BigNumber } from "bignumber.js";
import { BonusPoolActivityState } from "../../utils/enums";

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
  fundReserve?: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AgentMgr extends Vue {
  agentMgr: AgentMgrState = this.$store.state.agentMgr;

  page: number = 1; //当前页
  count: number = 10;
  channel: string = "";
  pid = "A";
  addPid = "";
  agencyPid = "A";
  pidList: any[] = [];
  pidListForAdd: any[] = [];
  loginDate: Date[] = [];
  updateAgentVisible: boolean = false;
  canFixGameUid: boolean = false;
  canFixMasterGameID: boolean = false;
  dialogUserForbiddenVisible: boolean = false;
  curAgentId: string = "";
  curPid: string = "";
  curPidStr: string = "";
  curName: string = "";
  loginForbidden: boolean = false;
  reason: string = "";

  agentId: string = "";
  agentAct: string = "";
  agentName: string = "";
  minRate: string = "";
  maxRate: string = "";
  agentChannel: string = "";
  agentLevel: string = "";

  addAgentVisible: boolean = false;
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
  addMaxChildrenCount: string = "";

  addAlipayAct: string = "";
  addAlipayName: string = "";
  addBankCardNo: string = "";
  addBankName: string = "";
  addBankCardName: string = "";
  haveSetAgencyCheckGameTax: boolean = false;
  banSettlement: boolean = false;
  haveDataPrivilege: boolean = false;
  isIndep: boolean = false;
  indepNum: number = 1;
  fundReserve: string = "";
  bonusPoolStates: Array<any> = [];

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
  changIsIndep(val) {
    this.indepNum = 1;
  }
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
      //   [
      //     { label: agency, agencyId: tmp.agency.agencyId, children: children }
      //   ];
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
      case "D":
        this.searchAgencyId = "111838";
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
    this.loadAgencyTree({ level: 0, pid: this.agencyPid });
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.bonusPoolStates = BonusPoolActivityState.map(x => x);
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

  stateFormatter(row, index) {
    switch (row.fundReserve) {
      case "notReserve":
        return "未预约";
      case "reserve":
        return "已预约";
      case "submit":
        return "已提交";
      case "success":
        return "已领取";
    }

    // 没有该字段视为未预约
    return "未预约";
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
    if (this.fundReserve.trim()) {
      tmp.fundReserve = this.fundReserve.trim();
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

  addClick() {
    this.addPid = "";
    this.addAgentName = "";
    this.isBusinessman = false;
    this.addAgentGameID = "";
    this.addAgentAct = "";
    this.addAgentPwd = "";
    this.addQQ = "";
    this.addPhoneNumber = "";
    this.addWetch = "";
    this.addInfo = "";
    this.haveSonAgent = false;
    this.addAgentVisible = true;
  }

  addAgentCancel() {
    this.addAgentVisible = false;
  }
  agentForbidden(row) {
    this.reason = "";
    this.loginForbidden = !row.status;
    this.curAgentId = row.agencyId;
    this.curName = row.name;
    this.curPid = row.pid;
    this.curPidStr = this.pidFormat(row);
    this.dialogUserForbiddenVisible = true;
  }
  updatStatus() {
    let msg = "";
    if (!this.loginForbidden) {
      msg = "冻结";
    } else {
      msg = "解冻";
    }
    if (!this.reason) {
      this.$message({
        showClose: true,
        type: "error",
        message: "请填写理由!"
      });
      return;
    }
    let msg1 =
      "是否" + msg + "代理" + this.curAgentId + "(" + this.curName + ")";
    let tempData: any = {
      pid: this.curPid,
      agencyId: this.curAgentId,
      status: this.loginForbidden,
      reason: this.reason
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
              this.dialogUserForbiddenVisible = false;
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

  addAgentConfirm() {
    if (
      !this.addAgentName.trim() ||
      !this.addAgentAct.trim() ||
      !this.addAgentPwd.trim() ||
      !this.pid.trim()
    ) {
      this.$confirm("缺少必填项", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      return;
    }
    let tempData: any = {
      name: this.addAgentName,
      act: this.addAgentAct,
      pwd: this.addAgentPwd,
      pid: this.addPid,
      allowSetAgency: this.haveSonAgent
    };

    if (this.isBusinessman) {
      tempData.type = "business";
    } else {
      tempData.type = "general";
    }
    if (this.addAgentGameID.trim()) {
      tempData.gameUid = this.addAgentGameID;
    }
    if (this.addQQ.trim()) {
      tempData.qq = this.addQQ;
    }
    if (this.addWetch.trim()) {
      tempData.wx = this.addWetch;
    }
    if (this.addPhoneNumber.trim()) {
      tempData.phone = this.addPhoneNumber;
    }
    if (this.addInfo.trim()) {
      tempData.remarks = this.addInfo;
    }
    this.$confirm("是否确认提交", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddAgentNew", tempData, true).then(() => {
          if (this.agentMgr.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "添加成功!"
            });
            this.addAgentVisible = false;
            this.loadData();
            return;
          }

          let errormsg = "添加失败!";
          if (this.agentMgr.msg) {
            errormsg = "添加失败!" + this.agentMgr.msg;
          }
          console.log("--->", this.agentMgr.msg);
          this.$message({
            showClose: true,
            type: "error",
            message: errormsg
          });
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  eidtAnget(index, row) {
    this.addAgentName = row.name || "";
    if (row.type === "business") {
      this.isBusinessman = true;
    } else if (row.type === "general") {
      this.isBusinessman = false;
    }
    this.addMaxChildrenCount = !row.maxChildrenCount
      ? ""
      : row.maxChildrenCount + "";
    this.addPid = row.pid;
    this.addAgentGameID = row.gameUid || "";
    this.addAgentAct = row.act || "";
    this.addAgentPwd = row.pwd || "";
    this.settlePwd = row.settlePwd || "";
    this.addQQ = row.qq || "";
    this.addPhoneNumber = row.phone || "";
    this.addWetch = row.wx || "";
    this.addInfo = row.remarks || "";
    this.addShuishou = row.taxRate || "";
    this.haveSonAgent = row.allowSetAgency;
    this.addAgencyId = row.agencyId || "";
    this.addAlipayAct = row.alipayAct || "";
    this.addAlipayName = row.alipayName || "";
    this.addBankCardNo = row.bankCardNo || "";
    this.addBankName = row.bankName || "";
    this.addBankCardName = row.bankCardName || "";
    this.haveSetAgencyCheckGameTax =
      row.setAgencyCheckGameTax === undefined
        ? false
        : row.setAgencyCheckGameTax;
    this.banSettlement =
      row.banSettlement === undefined ? false : row.banSettlement;
    this.haveDataPrivilege =
      row.dataPrivilege === undefined ? false : row.dataPrivilege;
    this.isIndep = row.isIndep === undefined ? false : row.isIndep;
    this.indepNum = row.indepNum || 1;
    if (row.gameUid && row.gameUid !== "") {
      this.canFixGameUid = true;
    } else {
      this.canFixGameUid = false;
    }
    this.addAgentMasterGameID = row.masterGameUid;
    if (row.masterGameUid && row.masterGameUid !== "") {
      this.canFixMasterGameID = true;
    } else {
      this.canFixMasterGameID = false;
    }
    this.updateAgentVisible = true;
  }

  updateAgentCancel() {
    this.updateAgentVisible = false;
  }

  updateAgentConfirm() {
    if (!this.addAgentName.trim() || !this.addAgentAct.trim()) {
      this.$confirm("缺少必填项", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      return;
    }
    let tempData: any = {
      pid: this.addPid,
      name: this.addAgentName,
      act: this.addAgentAct,
      pwd: this.addAgentPwd || undefined,
      settlePwd: this.settlePwd || undefined,
      allowSetAgency: this.haveSonAgent,
      setAgencyCheckGameTax: this.haveSetAgencyCheckGameTax,
      banSettlement: this.banSettlement,
      dataPrivilege: this.haveDataPrivilege,
      isIndep: this.isIndep
    };
    if (this.isIndep) {
      tempData.indepNum = this.indepNum;
    }
    if (this.addAgentMasterGameID) {
      tempData.masterGameUid = this.addAgentMasterGameID;
    }
    if (this.addMaxChildrenCount && this.addMaxChildrenCount.trim()) {
      tempData.maxChildrenCount = this.addMaxChildrenCount;
    }
    if (this.addQQ && this.addQQ.trim()) {
      tempData.qq = this.addQQ;
    }
    if (this.addWetch && this.addWetch.trim()) {
      tempData.wx = this.addWetch;
    }
    if (this.addPhoneNumber && this.addPhoneNumber.trim()) {
      tempData.phone = this.addPhoneNumber;
    }
    if (this.addInfo && this.addInfo.trim()) {
      tempData.remarks = this.addInfo;
    }
    if (this.addShuishou && this.addShuishou.trim()) {
      tempData.taxRate = this.addShuishou;
    }
    if (this.addAlipayAct && this.addAlipayAct.trim()) {
      tempData.alipayAct = this.addAlipayAct;
    }
    if (this.addAlipayName && this.addAlipayName.trim()) {
      tempData.alipayName = this.addAlipayName;
    }
    if (this.addBankCardNo && this.addBankCardNo.trim()) {
      tempData.bankCardNo = this.addBankCardNo;
    }
    if (this.addBankName && this.addBankName.trim()) {
      tempData.bankName = this.addBankName;
    }
    if (this.addBankCardName && this.addBankCardName.trim()) {
      tempData.bankCardName = this.addBankCardName;
    }
    tempData.agencyId = this.addAgencyId;
    this.$confirm("是否确认提交", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UpdateAgentNew", tempData, true).then(() => {
          if (this.agentMgr.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.updateAgentVisible = false;
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: `修改失败!${this.agentMgr.msg}`
          });
        });
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
  downloadExcel() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    // if (!Object.keys(queryItem).length) {
    //   this.$message({
    //     type: "error",
    //     message: "必须输入任一搜索条件"
    //   });
    //   return;
    // }
    myDispatch(this.$store, "GetAgentListExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
    });
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
  pidFormat(row) {
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
