<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <!--商人信息-->
      <el-col class="toolbar1" style="margin-bottom: 20px">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人信息"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">商人信息</span>
      </el-col>
      <!-- 查询条件 -->
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
      </el-select>
      <span>商人ID</span>
      <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
      <span>商人账号</span>
      <el-input v-model="act" style="width:120px; margin:20px 10px"></el-input>
      <span>商人昵称</span>
      <el-input v-model="name" style="width:120px; margin:20px 10px"></el-input>
      <span>注册渠道</span>
      <el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>
      <span>平台</span>
      <el-select v-model="platform" placeholder="请选择" style="width:110px; margin:20px 10px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <br>
      <span>注册时间</span>
      <el-date-picker v-model="createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      <span>最后登录时间</span>
      <el-date-picker v-model="lastLoginTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      <el-button-group>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
        <el-button type="primary" @click="addBusiness" icon="el-icon-circle-plus">添加商人</el-button>
      </el-button-group>
      <!-- 列表 -->
      <el-table :data="jsBusinessUserData.data" border max-height="700" highlight-current-row style="width: 100%;font-size:10pt">
        <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat" fixed></el-table-column>
        <el-table-column prop="uid" label="ID" width="100" sortable align="center" fixed></el-table-column>
        <el-table-column prop="name" label="昵称" width="200" align="center" fixed></el-table-column>
        <el-table-column prop="ip" label="登录IP" width="160" align="center"></el-table-column>
        <el-table-column prop="channel" label="渠道" width="120" align="center" :formatter="channelFuc"></el-table-column>
        <el-table-column prop="platform" label="平台" width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="createDate" label="注册时间" width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="170" :formatter="lastLoginTimeFunc" align="center"></el-table-column>
        <el-table-column prop="act" label="账号/手机" width="130" align="center"></el-table-column>
        <el-table-column prop="location" label="ip地址" width="160" align="center"></el-table-column>
        <el-table-column prop="money" label="金币" min-width="200" align="center"></el-table-column>
        <el-table-column prop="bankMoney" label="银行金币" min-width="200" align="center"></el-table-column>
        <el-table-column prop="wx" label="微信" min-width="130" align="center"></el-table-column>
        <el-table-column prop="qq" label="QQ" min-width="130" align="center"></el-table-column>
        <el-table-column prop="state" :formatter="stateFormat" label="接单状态" min-width="130" align="center"></el-table-column>
        <el-table-column label="账号信息" align="center" min-width="130">
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="editAccount(scope.$index, scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="转账" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="transferIn(scope.$index, scope.row)">转入</el-button>
          </template>
        </el-table-column>
        <el-table-column label="追分" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="moneyRecovery(scope.$index, scope.row)">追分</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑信息</el-button>
          </template>
        </el-table-column>
        <el-table-column label="流水" width="65" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="moneyChange(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="IP" width="65" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editIp(scope.$index, scope.row)">IP登陆</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="jsBusinessUserData.totalCount"></el-pagination>
      </el-col>

      <!-- ip登录限制 -->
      <el-dialog :visible.sync="dialogBusinessIpVisible" width="450px">
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">商人ID</span>
          <el-input v-model="ipUid" disabled style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">登录ip</span>
          <span style="font-size:20px;">(以逗号 换行分隔)</span>
          <el-input style="width:280px;" type="textarea" :rows="8" placeholder="请输入内容" v-model="ips"></el-input>
        </div>
        <div style="margin:0px 0px 40px 90px">
          <el-checkbox v-model="enableIp">IP限制开关</el-checkbox>
        </div>
        <el-button type="primary" @click="addBusinessIps" style="margin:0px 0px 10px 130px">确认添加</el-button>
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
      <el-dialog :visible.sync="dialogTransferInVisible" width="500px" @close="close">
        <div style="margin:0px 0px 40px 175px">
          <span style="font-size:20px;">ID</span>
          <el-input v-model="srcUid" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">转入金额(RMB)</span>
          <el-input-number :controls="false" v-model="transferInRMB" @blur="transferInClick" style="width:120px"></el-input-number>
          <br>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">转入金币(游戏币)</span>
          <el-input-number :controls="false" v-model="transferInMoney" style="width:120px"></el-input-number>
          <br>
        </div>
        <el-button type="primary" @click="transferInConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
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
          <br>
        </div>
        <br>
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="raceRecoveryConfirm" style="margin:0px 0px 10px 130px">确认提交</el-button>
      </el-dialog>

      <!--添加商人界面-->
      <el-dialog :visible.sync="dialogNewTableVisible" width="380px">
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">聚商ID</span>
          <el-input v-model="newJsID" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">商人ID</span>
          <el-input v-model="newUID" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 70px">
          <span style="font-size:20px;">微信</span>
          <el-input v-model="newWx" style="width:120px"></el-input>
        </div>
        <div style="margin:0px 0px 40px 90px">
          <span style="font-size:20px;">qq</span>
          <el-input v-model="newQq" style="width:120px"></el-input>
        </div>
        <el-button type="primary" @click="addBusinessConfirm" style="margin:0px 0px 10px 130px">确认添加</el-button>
      </el-dialog>

      <!--编辑商人信息界面(可以对不同的数据表进行编辑操作)-->
      <el-dialog :visible.sync="dialogTableVisible" width="600px">
        <div style="border:1px  solid #7FFFD4">
          <el-col :span="48" class="toolbar2">
            <span style="font-size:20px;">账号信息</span>
            <span style="font-size:15px;margin:0px 0px 10px 200px">ID:</span>
            <span style="font-size:15px;">{{currentId}}</span>
            <span style="font-size:15px;margin:0px 0px 10px 10px">账号/手机:</span>
            <span style="font-size:15px;">{{currentAct}}</span>
          </el-col>
          <div style="margin:0px 0px 10px 100px">
            <span>昵称</span>
            <el-input v-model="updateName" style="width:120px"></el-input>
            <span style="margin:0px 0px 10px 100px">金币</span>
            <span>{{golds}}</span>
          </div>
          <div style="margin:0px 0px 10px 100px">
            <span>微信</span>
            <el-input v-model="wx" style="width:120px"></el-input>
          </div>
          <div style="margin:0px 0px 10px 100px">
            <span>QQ</span>
            <el-input v-model="qq" style="width:120px"></el-input>
            <span style="margin:0px 10px 10px 100px">vip</span>
            <el-checkbox v-model="vip" style="width:120px"></el-checkbox>
          </div>
          <div style="margin:0px 0px 10px 100px">
            <span style>vipTop</span>
            <el-input-number style="width:100px" :min="0" :controls="false" v-model="vipTop"></el-input-number>
            <span style="margin:0px 10px 10px 100px">聚商</span>
            <el-checkbox v-model="conUid"></el-checkbox>
          </div>
          <div style="margin:0px 0px 10px 100px">
            <span>备注</span>
            <el-input v-model="notes" style="width:120px"></el-input>
            <span style="margin-left:90px">禁止登录</span>
            <el-checkbox v-model="loginForbidden"></el-checkbox>
          </div>
          <el-button type="primary" @click="saveBusiness" style="margin:0px 0px 10px 400px">确认修改</el-button>
          <div style="margin:0px 0px 10px 100px">
            <span>权重</span>
            <el-input v-model="weightPoint" type="number" style="width:120px"></el-input>
            <el-button type="primary" @click="setWeight" style="margin:0px 0px 0 20px;display:inline-block;">修改权重</el-button>
          </div>
          <div style="margin:20px 0px 10px 100px">
            <span>接单</span>
            <el-switch v-model="bDisable"></el-switch>
            <el-button type="primary" @click="setBdisable" style="margin:0px 0px 0 20px;display:inline-block;">提交</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 流水详细信息 -->
      <el-dialog v-if="dialogMoneyChangeVisible" :visible.sync="dialogMoneyChangeVisible" width="1400px">
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
import MasterInfo from "../component/masterInfo.vue";
import TransferRecord from "../component/transferRecord.vue";
import BillRecords from "../component/billRecords.vue";
import GameInfo from "../component/gameInfo.vue";
import MoneyChange from "../component/moneyChange.vue";
import { setBDisableByUid } from "../../../api/admin/userManager/userManager";

import { BusinessUser } from "../../../store/stateInterface";
import { myDispatch, secToString, getTransferRate } from "../../../utils/index";
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
    MasterInfo,
    TransferRecord,
    BillRecords,
    GameInfo,
    MoneyChange
  }
})
export default class BusinessUserInfo extends Vue {
  //初始化数据
  jushangConfig = this.$store.state.jushangConfig.subFaLocation;

  businessUser: BusinessUser = this.$store.state.businessUser;
  jsBusinessUserData = this.businessUser.jsBusinessUserData;
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
  createDate: Date[] = [];
  lastLoginTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;

  currentUid: string = ""; //选中用户id fromID
  dialogMaterInfoVisible: boolean = false; //师徒信息
  dialogTransferInVisible: boolean = false; //转入
  srcUid: string = ""; //转入 fromID
  transferInRMB: any = "";
  transferInMoney: any = "";

  dialogMoneyRecoveryVisible: boolean = false; //追分
  raceRecoveryRMB: string = "";
  optDiscription: string = "";

  //添加商人
  dialogNewTableVisible: boolean = false;
  newJsID: string = "";
  newUID: string = "";
  newWx: string = "";
  newQq: string = "";
  //编辑商人配置
  curStatus: string = "";
  updateName: string = "";
  golds: string = "";
  wx: string = "";
  qq: string = "";
  notes: string = "";
  vip: boolean = false;
  vipTop: number = 0;
  conUid: boolean = false;
  loginForbidden: boolean = false;
  currentId: string = "";
  currentStatus: string = "";
  currentAct: string = "";
  dialogTableVisible: boolean = false;

  dialogMoneyChangeVisible: boolean = false; //金币流水

  dialogAccountVisible: boolean = false; // 编辑个人信息
  newAlipayRealName: string = "";
  newAlipayAccount: string = "";
  newBankCardNumber: string = "";
  newBankCardRealName: string = "";
  newBankPwd: string = "";
  newPwd: string = "";
  weightPoint: any = ""; //权重
  bDisable: boolean = false;

  //接单状态
  stateArr = [
    { label: "离线", value: 0 },
    { label: "休息", value: 1 },
    { label: "接单", value: 2 },
    { label: "繁忙", value: 3 }
  ];

  //商人IP
  ipUid: string = "";
  ips: string = "";
  enableIp: boolean = false;
  dialogBusinessIpVisible: boolean = false;
  created() {
    // this.loadData();
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
  }
  setBdisable() {
    let queryItem = {
      uid: this.currentId,
      bDisable: !this.bDisable
    };
    setBDisableByUid(queryItem).then(res => {
      if (res.data.code == 200) {
        this.$message.success("修改成功");
      }
    });
  }
  editIp(index, row) {
    this.dialogBusinessIpVisible = true;
    this.ipUid = row.uid;
    if (row.ips.length) {
      this.ips = row.ips.join(",\n");
    }
    this.enableIp = row.enableIp;
  }
  addBusinessIps() {
    let ips;
    if (this.ips && this.ips.indexOf(",\n") !== -1) {
      ips = this.ips.split(",\n");
    }
    let update = {
      uid: this.ipUid,
      enableIp: this.enableIp,
      ips: ips
    };
    myDispatch(this.$store, "UpdateBusinessIps", update, true).then(() => {
      if (this.businessUser.updateUserInfoCode === 200) {
        this.$message({
          showClose: true,
          type: "success",
          message: "设置成功!"
        });
        this.loadData();
        this.dialogBusinessIpVisible = false;
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "设置失败!"
        });
      }
    });
  }

  //method
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetJsBusinessInfo", queryItem).then(() => {
      this.jsBusinessUserData = this.businessUser.jsBusinessUserData;
      myDispatch(this.$store, "GetJushangConfig", {}).then(() => {
        this.jushangConfig = this.$store.state.jushangConfig.subFaLocation;
      });
    });
  }
  searchLoadData() {
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
      pid: this.pid,
      vip: 1
    };
    if (this.act.trim()) {
      temp.act = this.act;
    }
    if (this.platform) {
      temp.platform = this.platform;
    }
    if (this.channel.trim()) {
      temp.channel = this.channel;
      if (this.channel === "官方") {
        temp.channel = "";
      }
    }
    if (this.name.trim()) {
      temp.name = this.name;
    }
    if (this.uid.trim()) {
      temp.uid = this.uid;
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

  //添加商人
  addBusiness() {
    this.dialogNewTableVisible = true;
  }
  //确定添加商人
  addBusinessConfirm() {
    if (!Boolean(this.newQq) && !Boolean(this.newWx)) {
      this.$message({
        showClose: true,
        type: "error",
        message: "qq或微信不允许为空1!"
      });
      return;
    }
    if (!this.newUID.trim() || !this.newJsID.trim()) {
      this.$message({
        showClose: true,
        type: "error",
        message: "聚商ID和商人ID不允许为空!"
      });
      return;
    }
    this.$confirm("是否确认提交?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddBusinessInfo", {
          uid: this.newUID,
          qq: this.newQq,
          wx: this.newWx,
          jsId: this.newJsID
        })
          .then(() => {
            switch (this.businessUser.updateUserInfoCode) {
              case 200:
                {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "添加成功!"
                  });
                }
                this.dialogNewTableVisible = false;
                break;
              case 1010:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "用户不存在～!"
                  });
                }
                break;
              case 1011:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "已经是VIP了，不能重复设置！!"
                  });
                }
                break;
              case 1012:
                {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "该账号未绑定！!"
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
            this.loadData();
            this.dialogNewTableVisible = false;
          })
          .catch(ex => {
            this.$message({
              showClose: true,
              type: "error",
              message: ex.message
            });
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
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
          if (this.businessUser.updateUserInfoCode === 200) {
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
    if (
      this.transferInRMB < 10 ||
      this.transferInRMB > 50000 ||
      !this.transferInRMB
    ) {
      this.$message({
        showClose: true,
        type: "error",
        message: "最少10元,最大50000!"
      });
      this.transferInMoney = "";
      this.transferInRMB = "";
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
    if (
      this.transferInRMB < 10 ||
      this.transferInRMB > 50000 ||
      !this.transferInRMB
    ) {
      this.$message({
        showClose: true,
        type: "error",
        message: "最少10元,最大50000!"
      });
      this.transferInMoney = "";
      this.transferInRMB = "";
      return;
    }
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
          switch (this.businessUser.transferCode) {
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
        this.transferInRMB = "";
        this.transferInMoney = "";
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

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
          switch (this.businessUser.transferCode) {
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
                message: "操作失败！" + this.businessUser.msg
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

  //编辑商人配置
  check(userState, constStatus) {
    return (userState & constStatus) > 0 ? true : false;
  }
  handleEdit(index, row) {
    this.curStatus = row.status;
    this.updateName = row.name;
    this.golds = row.money;
    this.wx = row.wx;
    this.qq = row.qq;
    this.notes = row.notes;
    this.vip = !!row.vip ? true : false;
    this.vipTop = row.vipTop;
    this.conUid = row.status
      ? this.check(row.status, ban.STATUS_JUSHANG)
      : false;
    this.loginForbidden = row.status
      ? this.check(row.status, ban.STATUS_BAN_LOGIN)
      : false;
    this.currentId = row.uid;
    this.currentStatus = row.uid;
    if (row.act == undefined) {
      this.currentAct = "无";
    } else {
      this.currentAct = row.act;
    }
    this.dialogTableVisible = true;
    //获取权重
    this.getWeight();
  }
  getWeight() {
    myDispatch(this.$store, "GetWeightByUid", { uid: this.currentId }).then(
      res => {
        this.weightPoint = res.weightPoint;
        this.bDisable = !res.bDisable;
      }
    );
  }
  //保存商人信息配置
  saveBusiness() {
    this.$confirm("是否确认提交?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        if (!Boolean(this.wx) && !Boolean(this.qq) && this.vip) {
          this.$message({
            showClose: true,
            type: "error",
            message: "qq或微信不能为空!"
          });
          return;
        }
        let payload = {
          uid: this.currentId,
          name: this.updateName,
          wx: this.wx ? this.wx : "",
          qq: this.qq ? this.qq : "",
          vip: this.vip ? 1 : 0,
          vipTop: this.vipTop,
          status: this.convertBusiStatus(this.conUid, this.loginForbidden),
          notes: this.notes
        };
        myDispatch(this.$store, "UpdateBusinessInfo", payload).then(() => {
          if (this.businessUser.updateUserInfoCode === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功"
            });
            this.dialogTableVisible = false;
            this.loadData();
            return;
          }
          if (this.businessUser.updateUserInfoCode == 11000) {
            this.$message({
              showClose: true,
              type: "error",
              message: "昵称重复，请更换"
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
  convertBusiStatus(conUid, loginForbidden) {
    let first = 0,
      tmp: any = 0;
    if (!Boolean(this.curStatus) && !conUid && !loginForbidden) {
      return 0;
    } else if (conUid || loginForbidden) {
      tmp = 0;
    } else {
      tmp = this.curStatus;
    }
    if (conUid) {
      first = this.set(tmp, ban.STATUS_JUSHANG);
    } else {
      first = this.unSet(tmp, ban.STATUS_JUSHANG);
    }
    if (loginForbidden) {
      return this.set(first, ban.STATUS_BAN_LOGIN);
    } else {
      return this.unSet(first, ban.STATUS_BAN_LOGIN);
    }
  }
  set(userState, constStatus) {
    return userState | constStatus;
  }
  unSet(userState, constStatus) {
    return userState & ~constStatus;
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
  close() {
    this.currentUid = "";
    this.srcUid = "";
    this.transferInRMB = "";
    this.transferInMoney = "";
    this.raceRecoveryRMB = "";
    this.optDiscription = "";
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
  setWeight() {
    let queryItem = {
      uid: this.currentId,
      weightPoint: this.weightPoint
    };
    myDispatch(this.$store, "SetWeightByUid", queryItem).then(res => {
      if (this.businessUser.updateUserInfoCode === 200) {
        this.$message({
          type: "success",
          message: "权重修改成功",
          duration: 8 * 1000
        });
      }
    });
  }
  stateFormat(row) {
    let str = "-";
    this.stateArr.forEach(item => {
      if (row.state == item.value) {
        str = item.label;
      }
    });
    return str;
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
  margin: 10px 0px;
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
