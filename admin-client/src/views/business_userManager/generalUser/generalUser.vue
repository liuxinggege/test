<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <!--普通用户信息-->
      <el-col class="toolbar1" style="margin-bottom: 20px">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="普通用户信息">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">普通用户信息</span>
      </el-col>
      <!-- 查询条件 -->
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
        </el-option>
      </el-select>
      <span>用户ID</span>
      <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
      <span>用户账号</span>
      <el-input v-model="act" style="width:120px; margin:20px 10px"></el-input>
      <span>用户昵称</span>
      <el-input v-model="name" style="width:120px; margin:20px 10px"></el-input>
      <span>注册渠道</span>
      <el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>
      <span>平台</span>
      <el-select v-model="platform" placeholder="请选择" style="width:110px; margin:20px 10px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select><br>
      <span>注册时间</span>
      <el-date-picker v-model="createDate" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
      </el-date-picker>
      <span>最后登录时间</span>
      <el-date-picker v-model="lastLoginTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>

      <!-- 列表 -->
      <el-table :data="generalUserData.data" border max-height="700" highlight-current-row style="width: 100%;font-size:10pt">
        <el-table-column prop="pid" label="项目" width="80" align="center"  :formatter="pidFormat" fixed></el-table-column>
        <el-table-column label="uid" width="120" fixed align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="attribution(scope.$index, scope.row)">{{scope.row.uid}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="注册时间" width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="170" :formatter="lastLoginTimeFunc" align="center"></el-table-column>
        <el-table-column prop="totalGameTime" label="累计游戏时长" min-width="170" align="center" :formatter="totalGameFuc"></el-table-column>
        <el-table-column prop="todayGameTime" label="当日游戏时长" min-width="170" align="center" :formatter="todayGameFuc"></el-table-column>
        <el-table-column prop="channel" label="渠道" width="120" align="center" :formatter="channelFuc"></el-table-column>
        <el-table-column prop="platform" label="平台" width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="act" label="账号/手机" width="130" align="center"></el-table-column>
        <el-table-column prop="name" label="昵称" width="100" align="center"></el-table-column>
        <el-table-column prop="ip" label="登录IP" width="160" align="center"></el-table-column>
        <el-table-column prop="location" label="ip地址" width="160" align="center"></el-table-column>
        <el-table-column prop="money" label="金币" min-width="200" align="center"></el-table-column>
        <el-table-column prop="bankMoney" label="银行金币" min-width="200" align="center"></el-table-column>       
        <el-table-column label="追分" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="moneyRecovery(scope.$index, scope.row)">追分</el-button>
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
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="generalUserData.totalCount">
        </el-pagination>
      </el-col>

      <!--个人属性详细信息 -->
      <el-dialog v-if="dialogAttibutionVisible" :visible.sync="dialogAttibutionVisible" width=1200px>
        <Attribution v-bind:curUid="currentUid"></Attribution>
      </el-dialog>

      <!-- 师徒详细信息 -->
      <el-dialog v-if="dialogMaterInfoVisible" :visible.sync="dialogMaterInfoVisible" width=1200px>
        <MasterInfo v-bind:curUid="currentUid"></MasterInfo>
      </el-dialog>

      <!--修改账号信息-->
      <el-dialog :visible.sync="dialogAccountVisible" width=580px>
        <div style="margin:0 0 40px 50px">
          <span style="font-size:20px;">用户uid</span>
          <span style="font-size:20px">：{{currentUid}}</span>
        </div>
        <div style="margin:0 0 40px 50px">
          <span style="font-size:20px;">支付宝账号</span>
          <el-input v-model="newAlipayAccount" style="width:300px"></el-input>
        </div>
        <div style="margin:0 0 40px 50px">
          <span style="font-size:20px;">支付宝名字</span>
          <el-input v-model="newAlipayRealName" style="width:120px"></el-input>
        </div>
        <div style="margin:0 0 40px 75px">
          <span style="font-size:20px;">银行卡号</span>
          <el-input v-model="newBankCardNumber" style="width:300px"></el-input>
        </div>
        <div style="margin:0 0 40px 75px">
          <span style="font-size:20px;">银行卡名</span>
          <el-input v-model="newBankCardRealName" style="width:120px"></el-input>
        </div>
        <div style="margin:0 0 40px 75px">
          <span style="font-size:20px;">银行密码</span>
          <el-input v-model="newBankPwd" style="width:120px"></el-input>
        </div>
        <div style="margin:0 0 40px 75px">
          <span style="font-size:20px;">游戏密码</span>
          <el-input v-model="newPwd" style="width:300px"></el-input>
        </div>
        <el-button type="primary" @click="acountConfirm" style="margin:0px 0px 10px 180px">确认提交</el-button>
      </el-dialog>

      <!--转入操作-->
      <el-dialog :visible.sync="dialogTransferInVisible" width=500px @close="close">
        <div style="margin:0px 0px 40px 175px">
          <span style="font-size:20px;">ID</span>
          <el-input v-model="srcUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">转入金额(RMB)</span>
          <el-input-number :controls="false" v-model="transferInRMB" @blur='transferInClick' style="width:120px"></el-input-number>
          <br>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">转入金币(游戏币)</span>
          <el-input-number :controls="false" v-model="transferInMoney" style="width:120px"></el-input-number>
          <br>
        </div>
        <el-button type="primary" @click="transferInConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
      </el-dialog>

      <!--转出操作-->
      <el-dialog :visible.sync="dialogTransferOutVisible" width=500px @close="close">
        <div style="margin:0px 0px 40px 175px">
          <span style="font-size:20px;">ID</span>
          <el-input v-model="selfDestUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">转出金额(RMB)</span>
          <el-input-number :controls="false" v-model="transferOutRMB" @blur='transferOutClick' style="width:120px"></el-input-number>
          <br>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">转出金币(游戏币)</span>
          <el-input-number :controls="false" v-model="transferOutMoney" style="width:120px"></el-input-number>
          <br>
        </div>
        <el-button type="primary" @click="transferOutConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>

      </el-dialog>

      <!--追分操作-->
      <el-dialog :visible.sync="dialogMoneyRecoveryVisible" width=500px @close="close">
        <div style="margin:0px 0px 40px 180px">
          <span style="font-size:20px;">追分至(ID)</span>
          <el-input v-model="srcUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 63px">
          <span style="font-size:20px;">追分金额(RMB)</span>
          <el-input v-model="raceRecoveryRMB" style="width:120px"></el-input>
          <br>
        </div>
        <br />
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="raceRecoveryConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
      </el-dialog>

      <el-dialog v-if="dialogMoneyChangeVisible" :visible.sync="dialogMoneyChangeVisible" width=1400px>
        <MoneyChange v-bind:curUid="currentUid"></MoneyChange>
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
// import TransferRecord from "../component/transferRecord.vue";
import BillRecords from "../component/billRecords.vue";
import GameInfo from "../component/gameInfo.vue";
import MoneyChange from "../component/moneyChange.vue";

import { downloadExcel } from "../../../utils/downloadEXCEL";
import { GeneralUser } from "../../../store/stateInterface";
import { myDispatch, secToString, getTransferRate } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

interface QueryItem {
  pid:string;
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
    // TransferRecord,
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
  uid: string = "";
  act: string = "";
  pidList: any[] = [];
  pid: string = "A";
  name: string = "";
  channel: string = "";
  platform: string = "";
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
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-90, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  lastLoginTime: Date[] = [this.startTime,this.endTime];
  createDate: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;

  currentUid: string = ""; //选中用户id fromID
  dialogAttibutionVisible: boolean = false; //个人属性
  dialogMaterInfoVisible: boolean = false; //师徒信息

  dialogTransferInVisible: boolean = false; //转入
  srcUid: string = ""; //转入 fromID
  transferInRMB: any = "";
  transferInMoney: any = "";

  dialogTransferOutVisible: boolean = false; //转出
  selfDestUid: string = ""; //转出 toID
  transferOutRMB: any = "";
  transferOutMoney: any = "";

  dialogMoneyRecoveryVisible: boolean = false; //追分
  raceRecoveryRMB: string = "";
  optDiscription: string = "";

  dialogMoneyChangeVisible: boolean = false; //金币流水

  dialogAccountVisible: boolean = false; // 编辑个人信息
  newAlipayRealName: string = "";
  newAlipayAccount: string = "";
  newBankCardNumber: string = "";
  newBankCardRealName: string = "";
  newBankPwd: string = "";
  newPwd: string = "";

  created() {
    // this.loadData();
      this.pidList = [{name:"全部",pid:""},...JSON.parse(<string>sessionStorage.getItem("pid"))];
  }

  //method
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetGeneralUser", queryItem, true).then(() => {
      this.generalUserData = this.generalUser.generalUserData;
    });
    myDispatch(this.$store, "GetJushangConfig", {}, true).then(() => {
      this.jushangConfig = this.$store.state.jushangConfig.subFaLocation;
    });
  }
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
       pid:this.pid,
    };
    if (this.platform) {
      temp.platform = this.platform;
    }
    if (this.uid.trim()) {
      temp.uid = this.uid;
    }
    if (this.channel.trim()) {
      temp.channel = this.channel;
      if (this.channel === "官方") {
        temp.channel = "";
      }
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
    this.currentUid = row.uid;
  }
  //保存个人信息
  acountConfirm() {
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
            alipayRealName: this.newAlipayRealName,
            bankCardNumber: this.newBankCardNumber,
            bankCardRealName: this.newBankCardRealName,
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
  //转入
  transferIn(index, row) {
    this.dialogTransferInVisible = true;
    this.srcUid = JSON.parse(<string>sessionStorage.getItem("jushangInfo")).uid;
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

  // //记录
  // transfer(index, row) {
  //   // this.dialogTransferInfoVisible = true;
  //   // this.currentUid = row.uid;
  // }

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
              this.dialogMoneyRecoveryVisible = true;
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
                message: "操作失败！"+this.generalUser.msg
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
  //允许登陆
  loginForbidden(index, row) {
    let tmp = row.loginFlag === "禁止登录" ? "允许登录" : "禁止登录";
    this.$confirm(`是否确认${tmp}?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "LoginForbidden", {
          uid: row.uid,
          loginForbidden: tmp === "禁止登录" ? true : false
        }).then(() => {
          if (this.generalUser.loginForbiddenCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "操作成功!"
            });
            this.loadData();
            return;
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
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }

  //导出
  downloadExcel() {
    const downloadExcelCfg = [
      {
        title: "pid",
        field: "pid",
        type: "string"
      },
      {
        title: "uid",
        field: "uid",
        type: "string"
      },
      {
        title: "注册时间",
        field: "createDate",
        type: "Date"
      },
      {
        title: "注册周期",
        field: "createDateCycle",
        type: "createDateCycle"
      },
      // createDateCycle: dateUtil.getCreateDateCycle(e.createDate),//注册周期
      {
        title: "最后登录时间",
        field: "lastLoginTime",
        type: "Date"
      },
      //   {
      //     title: "累计在线时长",
      //     field: "totalGameTime",
      //     type: "GameTime"
      //   },
      //   {
      //     title: "当日在线时长",
      //     field: "todayGameTime",
      //     type: "GameTime"
      //   },
      {
        title: "渠道",
        field: "channel",
        type: "string"
      },
      {
        title: "平台",
        field: "platform",
        type: "string"
      },
      {
        title: "账号/手机",
        field: "act",
        type: "string"
      },
      {
        title: "昵称",
        field: "name",
        type: "string"
      },
      {
        title: "登录IP",
        field: "ip",
        type: "string"
      },
      {
        title: "ip地址",
        field: "location",
        type: "string"
      },
      {
        title: "总兑换",
        field: "totalWithdrawAmount",
        type: "string"
      },
      {
        title: "总充值",
        field: "rechargeTotalRmb",
        type: "string"
      },
      {
        title: "金币",
        field: "gold",
        type: "string"
      },
      {
        title: "银行金币",
        field: "bankGold",
        type: "string"
      }
      //   {
      //     title: "支付宝账号",
      //     field: "alipayAccount",
      //     type: "string"
      //   },
      //   {
      //     title: "支付宝名字",
      //     field: "alipayRealName",
      //     type: "string"
      //   },
      //   {
      //     title: "银行卡号",
      //     field: "bankCardNumber",
      //     type: "string"
      //   },
      //   {
      //     title: "银行卡名",
      //     field: "bankCardRealName",
      //     type: "string"
      //   },
      //   {
      //     title: "银行密码",
      //     field: "bankPwd",
      //     type: "string"
      //   },
      //   {
      //     title: "游戏密码",
      //     field: "pwd",
      //     type: "string"
      //   }
    ];

    let queryItem: any = this.getQueryItem();
    if (Object.keys(queryItem).length <= 1) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    myDispatch(this.$store, "DownloadGeneralUserExcel", queryItem).then(ret => {
      if (this.generalUser.downloadExcelCode !== 200) {
        this.$message({
          type: "error",
          message: `${this.generalUser.msg}`
        });
        return;
      }
      downloadExcel(ret,this);
    });
  }
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
