<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <!--普通用户信息-->
      <el-col class="toolbar1" style="margin-bottom: 20px">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="普通用户信息"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">普通用户信息</span>
      </el-col>
      <!-- 查询条件 -->
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:100px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
      </el-select>
      <span>用户ID</span>
      <el-input v-model="uid" style="width:100px; margin:20px 10px"></el-input>
      <span>用户账号</span>
      <el-input v-model="act" style="width:100px; margin:20px 10px"></el-input>
      <span>用户昵称</span>
      <el-input v-model="name" style="width:100px; margin:20px 10px"></el-input>
      <span>支付宝账号</span>
      <el-input v-model="alipayAccount" style="width:100px; margin:20px 10px"></el-input>
      <span>ip</span>
      <el-input v-model="ip" style="width:100px; margin:20px 10px"></el-input>
      <span>注册渠道</span>
      <el-input v-model="channel" style="width:100px; margin:20px 10px"></el-input>
      <br />
      <span>平台</span>
      <el-select v-model="platform" placeholder="请选择" style="width:100px; margin:20px 10px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span>注册时间</span>
      <el-date-picker v-model="createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="width:400px; margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      <span>最后登录时间</span>
      <el-date-picker v-model="lastLoginTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="width:400px; margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
      <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 10px">导出excel</el-button>
      <br />
      <span>注册ip</span>
      <el-input v-model="registeIp" style="width:200px; margin:20px 10px"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchByIP">注册ip搜索</el-button>
      <el-button type="success" icon="search" @click="downloadExcelByIp" style="margin:8px 0px 10px 10px">注册ip导出excel</el-button>
      <!-- 列表 -->
      <el-table :data="generalUserData.data" border max-height="700" highlight-current-row style="width: 100%;font-size:10pt">
        <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat" fixed></el-table-column>
        <el-table-column label="uid" width="120" fixed align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="attribution(scope.$index, scope.row)">{{scope.row.uid}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="注册时间" width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="170" :formatter="lastLoginTimeFunc" align="center"></el-table-column>
        <el-table-column prop="totalGameTime" label="累计游戏时长" min-width="170" align="center" :formatter="totalGameFuc"></el-table-column>
        <el-table-column prop="todayGameTime" label="当日游戏时长" min-width="170" align="center" :formatter="todayGameFuc"></el-table-column>
        <el-table-column prop="createDateCycle" label="注册周期(天)" width="130" align="center"></el-table-column>
        <el-table-column prop="channel" label="渠道" width="120" align="center" :formatter="channelFuc">
          <template slot-scope="scope">
            <el-button type="text" @click="changeUserChannel(scope.row)">{{channelFuc(scope.row)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台" width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="act" label="账号/手机" width="130" align="center"></el-table-column>
        <el-table-column prop="name" label="昵称" width="100" align="center"></el-table-column>
        <el-table-column prop="ip" label="登录IP" width="160" align="center"></el-table-column>
        <el-table-column prop="location" label="ip地址" width="160" align="center"></el-table-column>
        <el-table-column prop="createIP" label="注册IP" width="160" align="center"></el-table-column>
        <el-table-column prop="createLocation" label="注册地区" width="160" align="center"></el-table-column>
        <el-table-column prop="totalWithdrawAmount" label="总兑换" width="130" align="center"></el-table-column>
        <el-table-column prop="rechargeTotalRmb" label="总充值" width="130" align="center"></el-table-column>

        <el-table-column prop="money" label="金币" min-width="200" align="center"></el-table-column>
        <el-table-column prop="bankMoney" label="银行金币" min-width="200" align="center"></el-table-column>
        <el-table-column label="账号信息" align="center" min-width="130">
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="editAccount(scope.$index, scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="追分" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="moneyRecovery(scope.$index, scope.row)">追分</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" width="700" align="center">
          <template slot-scope="scope">
            <el-button type="info" disabled>{{scope.row.loginFlag}}</el-button>
            <el-button type="info" @click="withdrawForbidden(scope.$index, scope.row)">{{scope.row.withdrawFlag}}</el-button>
            <el-button type="info" @click="rechargeForbidden(scope.$index, scope.row)">{{scope.row.rechargeFlag}}</el-button>
            <el-button type="info" @click="vipRechargeForbidden(scope.$index, scope.row)">{{scope.row.vipRechargeFlag}}</el-button>
            <el-button type="danger" @click="forceKickUser(scope.row.uid)">强制踢人</el-button>
            <el-button type="primary" @click="banned(scope.row)">禁言</el-button>
          </template>
        </el-table-column>
        <el-table-column label="流水" width="65" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="moneyChange(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="generalUserData.totalCount"></el-pagination>
      </el-col>
      <!-- changeChannel -->
      <el-dialog :visible.sync="dialogChangeChannelVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 125px;font-size:20px;">修改注册渠道</div>
        <div style="margin:0px 0px 40px 125px">
          <span style="font-size:20px;">ID</span>
          <el-input v-model="srcUid" style="width:120px" disabled></el-input>
        </div>
        <div style="margin:0px 0px 40px 86px">
          <span style="font-size:20px;">新渠道</span>
          <el-input v-model="changeChannel" style="width:120px" :disabled="changeChannelFlg"></el-input>
          <br />
        </div>
        <el-button type="primary" @click="changeChannelConfirm" style="margin:0px 0px 10px 230px" :disabled="changeChannelFlg">确认提交</el-button>
      </el-dialog>
      <!--个人属性详细信息 -->
      <el-dialog v-if="dialogAttibutionVisible" :visible.sync="dialogAttibutionVisible" width="1200px">
        <Attribution v-bind:curUid="currentUid"></Attribution>
      </el-dialog>

      <!-- 师徒详细信息 -->
      <el-dialog v-if="dialogMaterInfoVisible" :visible.sync="dialogMaterInfoVisible" width="1200px">
        <MasterInfo v-bind:curUid="currentUid"></MasterInfo>
      </el-dialog>

      <!--修改账号信息-->
      <el-dialog :visible.sync="dialogAccountVisible" width="580px">
        <div style="margin:0 0 40px 50px">
          <span style="font-size:20px;">用户uid</span>
          <span style="font-size:20px">：{{currentUid}}</span>
        </div>
        <div style="margin:0 0 20px 50px">
          <span style="font-size:20px;">支付宝账号</span>
          <el-input v-model="newAlipayAccount" style="width:300px"></el-input>
        </div>
        <div style="margin:0 0 0 50px">
          <span style="font-size:20px;">支付宝名字</span>
          <el-input v-model="newAlipayRealName" style="width:120px"></el-input>
        </div>
        <el-button type="primary" @click="fixAliPay" style="margin:10px 0 40px 357px">确认修改支付宝</el-button>
        <div style="margin:0 0 20px 75px">
          <span style="font-size:20px;">银行卡号</span>
          <el-input v-model="newBankCardNumber" style="width:300px"></el-input>
        </div>
        <div style="margin:0 0 0 75px">
          <span style="font-size:20px;">银行卡名</span>
          <el-input v-model="newBankCardRealName" style="width:120px"></el-input>
        </div>
        <el-button type="primary" @click="fixBankCard" style="margin:10px 0 40px 357px">确认修改银行卡</el-button>
        <div style="margin:0 0 20px 75px">
          <span style="font-size:20px;">银行密码</span>
          <el-input v-model="newBankPwd" style="width:120px"></el-input>
        </div>
        <div style="margin:0 0 0 75px">
          <span style="font-size:20px;">游戏密码</span>
          <el-input v-model="newPwd" style="width:300px"></el-input>
        </div>
        <el-button type="primary" @click="fixPwd" style="margin:10px 0 40px 357px">确认修改密码</el-button>
        <div style="margin:0 0 0 56px">
          <span style="font-size:20px;">转入银行</span>
          <el-input type="text" v-model="transferToBank" style="width:120px"></el-input>
        </div>
        <el-button type="primary" @click="fixTransferToBank" style="margin:10px 0 40px 357px">确认转入银行</el-button>
        <div style="margin:0 0 0 56px">
          <span style="font-size:20px;">转到身上</span>
          <el-input type="text" v-model="transferToPeople" style="width:120px"></el-input>
        </div>
        <el-button type="primary" @click="fixTransferToPeople" style="margin:10px 0 40px 357px">确认转到身上</el-button>
      </el-dialog>

      <!-- 转账详细信息 -->
      <el-dialog v-if="dialogTransferInfoVisible" :visible.sync="dialogTransferInfoVisible" width="1400px">
        <TransferRecord v-bind:curUid="currentUid"></TransferRecord>
      </el-dialog>

      <!--转入操作-->
      <el-dialog :visible.sync="dialogTransferInVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 175px">
          <span style="font-size:20px;">ID</span>
          <el-input v-model="srcUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">转入金额(RMB)</span>
          <el-input-number :controls="false" v-model="transferInRMB" @blur="transferInClick" style="width:120px"></el-input-number>
          <br />
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">转入金币(游戏币)</span>
          <el-input-number :controls="false" v-model="transferInMoney" style="width:120px"></el-input-number>
          <br />
        </div>
        <el-button type="primary" @click="transferInConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
      </el-dialog>

      <!--转出操作-->
      <el-dialog :visible.sync="dialogTransferOutVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 175px">
          <span style="font-size:20px;">ID</span>
          <el-input v-model="selfDestUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">转出金额(RMB)</span>
          <el-input-number :controls="false" v-model="transferOutRMB" @blur="transferOutClick" style="width:120px"></el-input-number>
          <br />
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">转出金币(游戏币)</span>
          <el-input-number :controls="false" v-model="transferOutMoney" style="width:120px"></el-input-number>
          <br />
        </div>
        <el-button type="primary" @click="transferOutConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
      </el-dialog>

      <!--追分操作-->
      <el-dialog :visible.sync="dialogMoneyRecoveryVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 180px">
          <span style="font-size:20px;">追分至(ID)</span>
          <el-input v-model="srcUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 63px">
          <span style="font-size:20px;">追分金额(RMB)</span>
          <el-input v-model="raceRecoveryRMB" style="width:120px"></el-input>
          <br />
        </div>
        <br />
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="raceRecoveryConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
      </el-dialog>

      <!--配置上分-->
      <el-dialog :visible.sync="dialogChargeVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 70px">
          <span style="font-size:20px;margin:0px 80px 0px 0px">用户ID</span>
          <span style="font-size:20px;">{{currentUid}}</span>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">上分金额(RMB)</span>
          <el-input-number :controls="false" v-model="rechargeRMB" @blur="rechargeClick" style="width:120px"></el-input-number>
          <br />
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">上分金币(游戏币)</span>
          <el-input-number :controls="false" v-model="rechargeMoney" style="width:120px"></el-input-number>
          <br />
        </div>
        <br />
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="rechargeConfirm" style="margin:0px 0px 10px 190px">确认提交</el-button>
      </el-dialog>

      <!--配置下分-->
      <el-dialog :visible.sync="dialogWithdrawVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 120px">
          <span style="font-size:20px;margin:0px 30px 30px 0px">用户ID</span>
          <span style="font-size:20px;">{{currentUid}}</span>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">下分金额(RMB)</span>
          <el-input-number :controls="false" v-model="withDrawRMB" @blur="withDrawClick" style="width:120px"></el-input-number>
          <br />
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">下分金币(游戏币)</span>
          <el-input-number :controls="false" v-model="withDrawMoney" style="width:120px"></el-input-number>
          <br />
        </div>
        <br />
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="withDrawConfirm" style="margin:0px 0px 10px 190px">确认提交</el-button>
      </el-dialog>

      <!-- 上分详细信息 -->
      <el-dialog v-if="dialogBillRecordInfoVisible" :visible.sync="dialogBillRecordInfoVisible" :close-on-click-modal="true" width="1000px">
        <BillRecords v-bind:curUid="currentUid"></BillRecords>
      </el-dialog>

      <!-- 玩家详细信息 ===游戏 -->
      <el-dialog v-if="dialogGameInfoVisible" :visible.sync="dialogGameInfoVisible" :close-on-click-modal="true" width="1000px">
        <GameInfo v-bind:curUid="currentUid"></GameInfo>
      </el-dialog>

      <!-- 流水详细信息 -->
      <el-dialog v-if="dialogMoneyChangeVisible" :visible.sync="dialogMoneyChangeVisible" width="1400px">
        <MoneyChange v-bind:curUid="currentUid"></MoneyChange>
      </el-dialog>
      <!-- 禁言 -->
      <el-dialog :visible.sync="dialogBannedVisible" :close-on-click-modal="true" width="500px">
        <div style="text-align:center;">
          <h2 style="margin-top:-20px;text-align:center;">禁言</h2>
          <span>请输入禁言时间：</span>
          <el-input type="number" style="width:60px" v-model="day"></el-input>
          <span>天</span>
          <el-input type="number" style="width:60px" v-model="hours"></el-input>
          <span>时</span>
          <el-input type="number" style="width:60px" v-model="minute"></el-input>
          <span>分</span>
          <el-input type="number" style="width:60px" v-model="second"></el-input>
          <span>秒</span>
          <el-input type="textarea" style="width:400px;margin-top:20px;" :rows="3" v-model="reason" placeholder="请输入禁言理由(必填)"></el-input>
        </div>
        <div style="text-align:center;margin-top:20px">
          <el-button type="primary" @click="confirmBanned">提交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { ban } from "../../../const/status";
import Attribution from "@/components/userAttribution.vue";
import MasterInfo from "../component/masterInfo.vue";
import TransferRecord from "../component/transferRecord.vue";
import BillRecords from "../component/billRecords.vue";
import GameInfo from "../component/gameInfo.vue";
import MoneyChange from "../component/moneyChange.vue";

import { downloadExcel } from "../../../utils/downloadEXCEL";
import { GeneralUser } from "../../../store/stateInterface";
import {
  myDispatch,
  secToString,
  getTransferRate,
  myAsyncFn
} from "../../../utils/index";
import { shutUp } from "../../../api/admin/customerService/customerService";
// import { Getter, Action } from "vuex-class";

interface QueryItem {
  pid: string;
  uid: number;
  act: string;
  platform: string[];
  name: string;
  channel: string;
  page: number;
  count: number;
  createDateBegin: Date;
  createDateEnd: Date;
  lastLoginTimeBegin: Date;
  lastLoginTimeEnd: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    Attribution,
    MasterInfo,
    TransferRecord,
    BillRecords,
    GameInfo,
    MoneyChange
  }
})
export default class GetGeneralUser extends Vue {
  //初始化数据
  jushangConfig = this.$store.state.jushangConfig.subFaLocation;

  generalUser: GeneralUser = this.$store.state.generalUser;
  generalUserData = this.generalUser.generalUserData;
  isSearchByIP: boolean = false;
  uid: string = "";
  act: string = "";
  name: string = "";
  pidList: any[] = [];
  pid: string = "A";
  channel: string = "";
  platform: string = "";
  alipayAccount: string = "";
  ip: string = "";
  registeIp: string = "";
  stateOptions = [
    {
      value: "",
      label: "所有"
    },
    {
      value: "web",
      label: "web"
    },
    {
      value: "android",
      label: "android"
    },
    {
      value: "ios",
      label: "ios"
    }
  ];
  now = new Date(Date.now());
  startTime = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() - 90,
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
  lastLoginTime: Date[] = [this.startTime, this.endTime];
  createDate: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;

  currentUid: string = ""; //选中用户id fromID
  dialogAttibutionVisible: boolean = false; //个人属性
  dialogMaterInfoVisible: boolean = false; //师徒信息
  dialogBillRecordInfoVisible: boolean = false; //账单
  dialogTransferInVisible: boolean = false; //转入
  dialogTransferVisible: boolean = false; //转账
  //   destUid: string = ""; // 转账者
  srcUid: string = ""; //转入 fromID
  transferInRMB: any = "";
  transferInMoney: any = "";
  transferToBank: number = 0;
  transferToPeople: number = 0;
  dialogTransferOutVisible: boolean = false; //转出
  selfDestUid: string = ""; //转出 toID
  transferOutRMB: any = "";
  transferOutMoney: any = "";

  dialogTransferInfoVisible: boolean = false; //记录

  dialogMoneyRecoveryVisible: boolean = false; //追分
  raceRecoveryRMB: string = "";
  optDiscription: string = "";

  dialogChargeVisible: boolean = false; //上分
  rechargeMoney: any = "";
  rechargeRMB: any = "";

  dialogWithdrawVisible: boolean = false; //下分
  withDrawRMB: any = "";
  withDrawMoney: any = "";

  dialogGameInfoVisible: boolean = false; //玩家游戏详情
  dialogMoneyChangeVisible: boolean = false; //金币流水

  dialogAccountVisible: boolean = false; // 编辑个人信息
  newAlipayRealName: string = "";
  newAlipayAccount: string = "";
  newBankCardNumber: string = "";
  newBankCardRealName: string = "";
  newBankPwd: string = "";
  newPwd: string = "";

  //修改channel
  changeChannelFlg: boolean = true;
  dialogChangeChannelVisible: boolean = false;
  changeChannel: string = "";
  // 禁言
  bannedUid: string = "";
  curPid: string = "";
  reason: string = "";
  day: any = "";
  hours: any = "";
  minute: any = "";
  second: any = "";
  dialogBannedVisible: boolean = false;
  // personWaterLine:string = "";
  created() {
    // this.loadData();
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
  }

  //method
  changeUserChannel(row) {
    if (row.createDateCycle > 5) {
      this.changeChannelFlg = true;
      this.changeChannel = row.channel === "" ? "官方" : row.channel;
    } else {
      this.changeChannelFlg = false;
    }
    this.srcUid = row.uid;
    this.dialogChangeChannelVisible = true;
  }
  changeChannelConfirm() {
    let data = {
      uid: this.srcUid,
      channel: this.changeChannel
    };
    myDispatch(this.$store, "ChangeChannel", data).then(() => {
      let msg = this.generalUser.msg;
      if (this.generalUser.changeChannelCode === 200) {
        this.$message({
          showClose: true,
          type: "success",
          message: "修改成功!"
        });
        this.dialogChangeChannelVisible = false;
        this.loadData();
        return;
      }
      this.$message({
        showClose: true,
        type: "error",
        message: `修改失败!${msg}`
      });
    });
  }

  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetGeneralUser", queryItem).then(() => {
      this.generalUserData = this.generalUser.generalUserData;
    });
    myDispatch(this.$store, "GetJushangConfig", {}, true).then(() => {
      this.jushangConfig = this.$store.state.jushangConfig.subFaLocation;
    });
  }
  searchLoadData() {
    this.page = 1;
    this.isSearchByIP = false;
    this.loadData();
  }
  searchByIP() {
    this.page = 1;
    this.isSearchByIP = true;
    this.searchIpLoadData();
  }
  searchIpLoadData() {
    if (!this.registeIp) {
      this.$message({
        type: "warning",
        message: "请输入注册ip"
      });
      return;
    }
    let req: any = {
      page: this.page,
      count: this.count,
      ip: this.registeIp
    };
    myDispatch(this.$store, "GetGeneralUserByCreateIP", req).then(() => {
      this.generalUserData = this.generalUser.generalUserData;
    });
    myDispatch(this.$store, "GetJushangConfig", {}, true).then(() => {
      this.jushangConfig = this.$store.state.jushangConfig.subFaLocation;
    });
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
      pid: this.pid,
      vip: 0
    };
    if (this.platform) {
      temp.platform = this.platform;
    }
    if (this.uid.trim()) {
      temp.uid = this.uid;
    }
    if (this.act.trim()) {
      temp.act = this.act;
    }
    if (this.name.trim()) {
      temp.name = this.name;
    }
    if (this.channel.trim()) {
      temp.channel = this.channel;
      if (this.channel === "官方") {
        temp.channel = "";
      }
    }

    if (this.ip.trim()) {
      temp.ip = this.ip;
    }

    if (this.alipayAccount.trim()) {
      temp.alipayAccount = this.alipayAccount;
    }

    if (this.createDate && this.createDate.length) {
      temp.createDateBegin = this.createDate[0];
      temp.createDateEnd = this.createDate[1];
    }
    if (this.lastLoginTime && this.lastLoginTime.length) {
      temp.lastLoginTimeBegin = this.lastLoginTime[0];
      temp.lastLoginTimeEnd = this.lastLoginTime[1];
    }
    return temp;
  }
  //操作，编辑个人信息
  editAccount(index, row) {
    this.dialogAccountVisible = true;
    this.currentUid = row.uid;
    this.newAlipayAccount = row.alipayAccount;
    this.newAlipayRealName = row.alipayRealName;
    this.newBankCardNumber = row.bankCardNumber;
    this.newBankCardRealName = row.bankCardRealName;
    this.newBankPwd = row.bankPwd;
    this.newPwd = row.pwd;
    // this.personWaterLine = row.personWaterLine;
    this.currentUid = row.uid;
    this.transferToBank = 0;
    this.transferToPeople = 0;
  }
  //修改个人信息
  fixAliPay() {
    this.$confirm("是否确认修改", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "UpdateUserInfo",
          {
            uid: this.currentUid,
            alipayAccount: this.newAlipayAccount,
            alipayRealName: this.newAlipayRealName
          },
          true
        ).then(() => {
          if (this.generalUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.dialogAccountVisible = false;
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
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
  //修改个人信息
  fixBankCard() {
    this.$confirm("是否确认修改", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "UpdateUserInfo",
          {
            uid: this.currentUid,
            bankCardNumber: this.newBankCardNumber,
            bankCardRealName: this.newBankCardRealName
          },
          true
        ).then(() => {
          if (this.generalUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.dialogAccountVisible = false;
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
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
  // 禁言
  banned(row) {
    this.bannedUid = row.uid;
    this.reason = "";
    this.day = 0;
    this.minute = 0;
    this.hours = 0;
    this.second = 0;
    this.curPid = row.pid;
    this.currentUid = row.uid;
    this.dialogBannedVisible = true;
  }
  confirmBanned() {
    let time: number = 0;
    if (this.day !== undefined) {
      time += this.day * 24 * 3600 * 1000;
    }
    if (this.hours !== undefined) {
      time += this.hours * 3600 * 1000;
    }
    if (this.minute !== undefined) {
      time += this.minute * 60 * 1000;
    }
    if (this.second !== undefined) {
      time += this.second * 1000;
    }
    if (time <= 0) {
      this.$message({
        type: "error",
        message: "时间格式不正确"
      });
      return;
    }
    if (!this.reason) {
      this.$message({
        type: "error",
        message: "请输入禁言理由"
      });
      return;
    }
    let req = {
      pid: this.curPid,
      uid: this.currentUid,
      time: time,
      msg: this.reason
    };
    this.$confirm(`是否确认禁言游戏ID为${this.currentUid}的玩家`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(shutUp, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "禁言成功"
          });
          this.dialogBannedVisible = false;
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  //修改个人信息
  fixPwd() {
    this.$confirm("是否确认修改", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "UpdateUserInfo",
          {
            uid: this.currentUid,
            bankPwd: this.newBankPwd,
            pwd: this.newPwd
          },
          true
        ).then(() => {
          if (this.generalUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.dialogAccountVisible = false;
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
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
  //修改个人信息
  fixWaterLine() {
    this.$confirm("是否确认修改", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "UpdateUserInfo",
          {
            uid: this.currentUid
            // personWaterLine :this.personWaterLine,
          },
          true
        ).then(() => {
          if (this.generalUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!"
            });
            this.dialogAccountVisible = false;
            this.loadData();
            return;
          }
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
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
  //将身上的金币转入银行
  fixTransferToBank() {
    this.$confirm("是否确认转入银行", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "ToBank",
          {
            uid: this.currentUid,
            money: this.transferToBank
          },
          true
        ).then(() => {
          if (this.generalUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "转入成功!"
            });
            this.dialogAccountVisible = false;
            this.loadData();
            return;
          } else if (this.generalUser.updateUserInfoCode === 400) {
            this.$message({
              showClose: true,
              type: "error",
              message: "参数错误!"
            });
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `转入失败!${this.generalUser.msg}`
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  //将银行的金币转到玩家身上
  fixTransferToPeople() {
    this.$confirm("是否确认转到身上", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(
          this.$store,
          "ToPeople",
          {
            uid: this.currentUid,
            money: this.transferToPeople
          },
          true
        ).then(() => {
          if (this.generalUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "转入成功!"
            });
            this.dialogAccountVisible = false;
            this.loadData();
            return;
          } else if (this.generalUser.updateUserInfoCode === 400) {
            this.$message({
              showClose: true,
              type: "error",
              message: "参数错误!"
            });
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `转入失败!${this.generalUser.msg}`
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  //转入
  transferIn(index, row) {
    this.dialogTransferInVisible = true;
    this.currentUid = row.uid;
  }
  transferInClick() {
    if (this.transferInRMB < 10 || !this.transferInRMB) {
      this.$message({
        showClose: true,
        type: "success",
        message: "最少10元!"
      });
      this.transferInMoney = 0;
      this.transferInRMB = 0;
      return;
    }
    let x = new BigNumber(this.transferInRMB);
    let transferRate: any = getTransferRate(
      this.currentUid,
      this.jushangConfig
    );
    let y = new BigNumber(transferRate);
    this.transferInMoney = x.times(y).toString();
  }
  /*转入确认操作*/
  transferInConfirm() {
    this.$confirm("是否确认提交?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let payload = {
          // process: "transfer",
          uid: parseInt(this.srcUid), //to uID
          destUid: parseInt(this.currentUid), //from uID
          amount: this.transferInRMB.toString(),
          money: this.transferInMoney.toString()
        };
        myDispatch(this.$store, "Transfer", payload).then(() => {
          switch (this.generalUser.transferCode) {
            case 200:
              {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "操作成功!"
                });
              }
              this.dialogTransferInVisible = false;
              break;
            case 400:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "参数错误!"
                });
              }
              break;
            case 6003:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "参数错误!"
                });
              }
              break;
            case 3007:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "银币太多!"
                });
              }
              break;
            case 6004:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "余额不足!"
                });
              }
              break;
            case 6005:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "安全密码错误!"
                });
              }
              break;
            case 6006:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "金额太少!"
                });
              }
              break;
            case 6007:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不存在!"
                });
              }
              break;
            case 6008:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "该账号不是VIP，普通用户只能转给VIP号!"
                });
              }
              break;
            case 6009:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不是正式账号!"
                });
              }
              break;
            default: {
              this.$message({
                showClose: true,
                type: "error",
                message: "操作失败！!"
              });
            }
          }
        });
        this.dialogTransferInVisible = false;
        this.transferInRMB = 0;
        this.transferInMoney = 0;
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  //转出
  transferOut(index, row) {
    this.dialogTransferOutVisible = true;
    this.currentUid = row.uid;
  }
  transferOutClick() {
    if (this.transferOutRMB < 10 || !this.transferOutRMB) {
      this.$message({
        showClose: true,
        type: "success",
        message: "最少10元!"
      });
      this.transferOutMoney = 0;
      this.transferOutRMB = 0;
      return;
    }
    let x = new BigNumber(this.transferOutRMB);
    let transferRate: any = getTransferRate(
      this.currentUid,
      this.jushangConfig
    );
    let y = new BigNumber(transferRate);
    this.transferOutMoney = x.times(y).toString();
  }
  /**转出确认操作 */
  transferOutConfirm() {
    this.$confirm("是否确认提交?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.dialogTransferVisible = false;
        let payload = {
          // process: "transfer",
          uid: parseInt(this.currentUid), //from ID
          destUid: parseInt(this.selfDestUid), //to ID
          money: this.transferOutMoney.toString(),
          amount: this.transferOutRMB.toString()
        };
        //通知服务器
        myDispatch(this.$store, "Transfer", payload).then(() => {
          switch (this.generalUser.transferCode) {
            case 200:
              {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "操作成功!"
                });
              }
              this.dialogTransferOutVisible = false;
              break;
            case 400:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "参数错误!"
                });
              }
              break;
            case 6003:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "参数错误!"
                });
              }
              break;
            case 3007:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "银币太多!"
                });
              }
              break;
            case 6004:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "余额不足!"
                });
              }
              break;
            case 6005:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "安全密码错误!"
                });
              }
              break;
            case 6006:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "金额太少!"
                });
              }
              break;
            case 6007:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不存在!"
                });
              }
              break;
            case 6008:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不是VIP，普通用户只能转给VIP号!"
                });
              }
              break;
            case 6009:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不是正式账号!"
                });
              }
              break;
            default: {
              this.$message({
                showClose: true,
                type: "error",
                message: "操作失败！!"
              });
            }
          }
        });
        this.dialogTransferOutVisible = false;
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  //记录
  transfer(index, row) {}

  moneyRecovery(index, row) {
    this.dialogMoneyRecoveryVisible = true;
    this.currentUid = row.uid;
  }
  /*追分操作*/
  raceRecoveryConfirm() {
    this.$confirm("是否确认提交?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let payload = {
          // process: "recoverySection",
          from: parseInt(this.srcUid),
          to: parseInt(this.currentUid),
          money: this.raceRecoveryRMB,
          optDiscription: this.optDiscription
        };
        myDispatch(this.$store, "RecoverySection", payload).then(() => {
          switch (this.generalUser.transferCode) {
            case 200:
              {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "操作成功!"
                });
              }
              this.dialogMoneyRecoveryVisible = false;
              break;
            case 400:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "参数错误!"
                });
              }
              break;
            case 6003:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "参数错误!"
                });
              }
              break;
            case 3007:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "银币太多!"
                });
              }
              break;
            case 6004:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "余额不足!"
                });
              }
              break;
            case 6005:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "安全密码错误!"
                });
              }
              break;
            case 6006:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "金额太少!"
                });
              }
              break;
            case 6007:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不存在!"
                });
              }
              break;
            case 6008:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "该账号不是VIP，普通用户只能转给VIP号!"
                });
              }
              break;
            case 6009:
              {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "对方不是正式账号!"
                });
              }
              break;
            default: {
              this.$message({
                showClose: true,
                type: "error",
                message: "操作失败！" + this.generalUser.msg
              });
            }
          }
        });
        this.dialogMoneyRecoveryVisible = false;
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  /**上分 */
  handleRecharge(index, row) {
    this.dialogChargeVisible = true;
    this.currentUid = row.uid;
  }
  rechargeClick() {
    let x = new BigNumber(this.rechargeRMB);
    let transferRate: any = getTransferRate(
      this.currentUid,
      this.jushangConfig
    );
    let y = new BigNumber(transferRate);
    this.rechargeMoney = x.times(y).toString();
    return;
  }
  numToChi(data) {
    if (parseInt(data) > 10000) {
      return parseFloat(data) / 10000 + "万";
    } else {
      return data;
    }
  }
  /**确认上分 */
  rechargeConfirm() {
    if (this.rechargeMoney === 0 || this.rechargeRMB === 0) {
      this.$message({
        showClose: true,
        type: "error",
        message: "请填写完整数据!"
      });
      return;
    }
    if (parseInt(this.rechargeMoney) > 0 && parseInt(this.rechargeRMB) > 0) {
      //提示确认数据操作
      let RMB = this.numToChi(this.rechargeMoney);
      this.$confirm(
        `你正在为ID:${this.currentUid}的用户充值${this.rechargeRMB}元人民币，上分金币为${RMB}`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let payload = {
            // process: "recharge",
            uid: parseInt(this.currentUid),
            money: this.rechargeMoney.toString(),
            rmb: this.rechargeRMB.toString(),
            optDiscription: this.optDiscription
          };
          myDispatch(this.$store, "Recharge", payload).then(() => {
            switch (this.generalUser.transferCode) {
              case 200:
                {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "操作成功!"
                  });
                }
                this.dialogChargeVisible = false;
                break;
              case 400:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "参数错误!"
                  });
                }
                break;
              case 500:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "通知服务器失败"
                  });
                }
                break;
              case 5001:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "系统错误!"
                  });
                }
                break;
              case 5002:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "系统错误!"
                  });
                }
                break;
              default: {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "操作失败！!"
                });
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    } else {
      this.$message({
        showClose: true,
        type: "error",
        message: "请填写合法数据!"
      });
      return;
    }
  }
  /**下分 */
  handleWithDraw(index, row) {
    this.dialogWithdrawVisible = true;
    this.currentUid = row.uid;
  }
  withDrawClick() {
    let x = new BigNumber(this.withDrawRMB);
    let transferRate: any = getTransferRate(
      this.currentUid,
      this.jushangConfig
    );
    let y = new BigNumber(transferRate);
    this.withDrawMoney = x.times(y).toString();
    return;
  }
  /**下分确认 */
  withDrawConfirm() {
    if (this.withDrawMoney == "" || this.withDrawRMB == "") {
      this.$message({
        showClose: true,
        type: "error",
        message: "请填写完整数据!"
      });
      return;
    }
    if (parseInt(this.withDrawMoney) > 0 && parseInt(this.withDrawRMB) > 0) {
      //提示确认数据操作
      let money = this.numToChi(this.withDrawMoney);
      this.$confirm(
        `你正在为ID:${this.currentUid}的用户下分${this.withDrawRMB}元人民币，下分金币为${money}`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let payload = {
            // process: "withdraw",
            uid: parseInt(this.currentUid),
            money: this.withDrawMoney.toString(),
            rmb: this.withDrawRMB.toString(),
            optDiscription: this.optDiscription
          };
          myDispatch(this.$store, "Withdraw", payload).then(() => {
            switch (this.generalUser.transferCode) {
              case 200:
                {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "操作成功!"
                  });
                }
                this.dialogWithdrawVisible = false;
                break;
              case 400:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "参数错误!"
                  });
                }
                break;
              case 500:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "通知服务器失败"
                  });
                }
                break;
              case 5001:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "系统错误!"
                  });
                }
                break;
              case 5002:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "金额不足!"
                  });
                }
                break;
              case 3006:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "玩家正在游戏中!"
                  });
                }
                break;
              default: {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "操作失败！!"
                });
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    } else {
      this.$message({
        showClose: true,
        type: "error",
        message: "请填写合法数据!"
      });
      return;
    }
  }
  //允许兑换
  withdrawForbidden(index, row) {
    let tmp = row.withdrawFlag === "禁止兑换" ? "允许兑换" : "禁止兑换";
    this.$confirm(`是否确认${tmp}?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UserWithdrawForbidden", {
          uid: row.uid,
          withdrawForbidden: tmp === "禁止兑换" ? true : false
        }).then(() => {
          if (this.generalUser.loginForbiddenCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "重置成功!"
            });
            this.loadData();
            return;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  //允许在线充值
  rechargeForbidden(index, row) {
    let tmp = row.rechargeFlag === "禁止在线充值" ? "允许充值" : "禁止在线充值";
    this.$confirm(`是否确认${tmp}?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UserChargeForbidden", {
          uid: row.uid,
          rechargeForbidden: tmp === "禁止在线充值" ? true : false
        }).then(() => {
          if (this.generalUser.loginForbiddenCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "重置成功!"
            });
            this.loadData();
            return;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  vipRechargeForbidden(index, row) {
    let tmp =
      row.vipRechargeFlag === "屏蔽vip充值" ? "允许vip充值" : "屏蔽vip充值";
    this.$confirm(`是否确认${tmp}?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UserVipRechargeForbidden", {
          uid: row.uid,
          vipRechargeForbidden: tmp === "屏蔽vip充值" ? true : false
        }).then(() => {
          if (this.generalUser.loginForbiddenCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "重置成功!"
            });
            this.loadData();
            return;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消" });
      });
  }
  //踢人
  forceKickUser(uid) {
    this.$confirm(`是否确认踢出该玩家`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "ForceKickUser", uid).then(() => {
          if (this.generalUser.loginForbiddenCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "踢出成功!"
            });
            this.loadData();
            return;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  //删除用户
  delUser(uid) {
    this.$confirm(`是否确认删除游戏ID为${uid}的玩家`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DelUser", uid).then(() => {
          if (this.generalUser.loginForbiddenCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功!"
            });
            this.loadData();
            return;
          } else if (this.generalUser.loginForbiddenCode === 1023) {
            this.$message({
              showClose: true,
              type: "error",
              message: "已绑定用户不能删除!"
            });
          } else if (this.generalUser.loginForbiddenCode === 1024) {
            this.$message({
              showClose: true,
              type: "error",
              message: "已充值用户不能删除!"
            });
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  //个人详情
  attribution(index, row) {
    this.currentUid = row.uid;
    this.dialogAttibutionVisible = true;
  }
  //师徒详情
  masterInfo(index, row) {
    this.currentUid = row.uid;
    this.dialogMaterInfoVisible = true;
  }
  //账单
  rechargeInfo(index, row) {
    this.currentUid = row.uid;
    this.dialogBillRecordInfoVisible = true;
  }
  //游戏
  gameInfo(index, row) {
    this.currentUid = row.uid;
    this.dialogGameInfoVisible = true;
  }
  //流水
  moneyChange(index, row) {
    this.currentUid = row.uid;
    this.dialogMoneyChangeVisible = true;
  }

  //整形
  timeFormat(row, column) {
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  lastLoginTimeFunc(row, column) {
    let date = new Date(row.lastLoginTime);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  totalGameFuc(row, column) {
    if (row.totalGameTime) {
      return secToString(row.totalGameTime);
    } else {
      return row.totalGameTime + "秒";
    }
  }
  todayGameFuc(row, column) {
    if (row.todayGameTime) {
      return secToString(row.todayGameTime);
    } else {
      return row.todayGameTime + "秒";
    }
  }
  channelFuc(row, column) {
    if (row.channel === "") {
      return "官方";
    } else {
      return row.channel;
    }
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    if (this.isSearchByIP) {
      this.searchIpLoadData();
    } else {
      this.loadData();
    }
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    if (this.isSearchByIP) {
      this.searchIpLoadData();
    } else {
      this.loadData();
    }
  }

  //导出
  downloadExcel() {
    let queryItem: any = this.getQueryItem();
    if (Object.keys(queryItem).length <= 1) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    let threeDate = new Date().getTime() - 86400000 * 3;
    if (queryItem.lastLoginTimeBegin) {
      let data = new Date(queryItem.lastLoginTimeBegin).getTime();
      if (data < threeDate) {
        queryItem.lastLoginTimeEnd = new Date();
        queryItem.lastLoginTimeBegin = new Date(threeDate);
      }
    }
    if (queryItem.createDateBegin) {
      let data = new Date(queryItem.createDateBegin).getTime();
      if (data < threeDate) {
        queryItem.createDateEnd = new Date();
        queryItem.createDateBegin = new Date(threeDate);
      }
    }
    if (!queryItem.createDateBegin && !queryItem.lastLoginTimeBegin) {
      queryItem.createDateEnd = new Date();
      queryItem.createDateBegin = new Date(threeDate);
    }
    myDispatch(this.$store, "DownloadGeneralUserExcel", queryItem).then(ret => {
      if (this.generalUser.downloadExcelCode !== 200) {
        this.$message({
          type: "error",
          message: `${this.generalUser.msg}`
        });
        return;
      }
      downloadExcel(ret, this);
    });
  }
  downloadExcelByIp() {
    if (!this.registeIp) {
      this.$message({
        type: "warning",
        message: "请输入注册IP"
      });
      return;
    }
    myDispatch(this.$store, "DownloadGeneralUserExcelByIP", {
      ip: this.registeIp
    }).then(ret => {
      if (this.generalUser.downloadExcelCode !== 200) {
        this.$message({
          type: "error",
          message: `${this.generalUser.msg}`
        });
        return;
      }
      downloadExcel(ret, this);
    });
  }
  //清空缓存数据
  close() {
    this.currentUid = "";
    this.srcUid = "";
    this.transferInRMB = "";
    this.transferInMoney = "";
    this.selfDestUid = "";
    this.transferOutRMB = "";
    this.transferOutMoney = "";
    this.raceRecoveryRMB = "";
    this.optDiscription = "";
    this.rechargeMoney = "";
    this.rechargeRMB = "";
    this.withDrawRMB = "";
    this.withDrawMoney = "";
    this.changeChannel = "";
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
.toolbar1 {
  padding: 2px;
  background-color: #f9fafc;
  border: 1px;
  margin: 0px 0px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 0px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 10px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}

.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}

.content_font {
  font-size: 14px;
  font-weight: 700;
}
</style>
