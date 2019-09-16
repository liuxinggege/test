<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <!--个人水位线-->
      <el-col class="toolbar1" style="margin-bottom: 20px">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="个人水位线">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">个人水位线</span>
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
      <span>支付宝账号</span>
      <el-input v-model="alipayAccount" style="width:120px; margin:20px 10px"></el-input>
      <span>ip</span>
      <el-input v-model="ip" style="width:120px; margin:20px 10px"></el-input>
      <br/>
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
        <el-table-column prop="pid" label="项目" min-width="80" align="center" :formatter="pidFormat" fixed></el-table-column>
        <el-table-column prop="uid" label="uid" min-width="120" fixed align="center"></el-table-column>
        <el-table-column prop="createDate" label="注册时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="170" :formatter="lastLoginTimeFunc" align="center"></el-table-column>
        <el-table-column prop="channel" label="渠道" min-width="120" align="center" :formatter="channelFuc"> </el-table-column>
        <!-- <el-table-column prop="bundleId" label="包ID" min-width="160" :show-overflow-tooltip="true"	 align="center" ></el-table-column> -->
        <el-table-column prop="platform" label="平台" min-width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="act" label="账号/手机" min-width="130" align="center"></el-table-column>
        <el-table-column prop="name" label="昵称" min-width="100" align="center"></el-table-column>
        <el-table-column label="个人水位线" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editAccount(scope.$index, scope.row)">{{scope.row.personWaterLine}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="上下分" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleRecharge(scope.$index, scope.row)">上分</el-button>
            <el-button type="text" @click="handleWithDraw(scope.$index, scope.row)">下分</el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除用户" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="delUser(scope.row.uid)">删除用户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="generalUserData.totalCount">
        </el-pagination>
      </el-col>
      <!--修改账号信息-->
      <el-dialog :visible.sync="dialogAccountVisible" width=580px>
        <div style="margin:0 0 40px 50px">
          <span style="font-size:20px;">用户uid</span>
          <span style="font-size:20px">：{{currentUid}}</span>
        </div>
        <div style="margin:0 0 0 56px">
          <span style="font-size:20px;">个人水位线</span>
          <el-input v-model="personWaterLine" style="width:120px"></el-input>
        </div>
        <el-button type="primary" @click="fixWaterLine" style="margin:10px 0 40px 357px">确认修改个人水位</el-button>
      </el-dialog>
      <!--配置上分-->
      <el-dialog :visible.sync="dialogChargeVisible" width=500px @close="close">
        <div style="margin:0px 0px 40px 70px">
          <span style="font-size:20px;margin:0px 80px 0px 0px">用户ID</span>
          <span style="font-size:20px;">{{currentUid}}</span>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">上分金额(RMB)</span>
          <el-input-number :controls="false" v-model="rechargeRMB" @blur='rechargeClick' style="width:120px"></el-input-number>
          <br>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">上分金币(游戏币)</span>
          <el-input-number :controls="false" v-model="rechargeMoney" disabled style="width:120px"></el-input-number>
          <br>
        </div>
        <br />
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="rechargeConfirm" style="margin:0px 0px 10px 190px">确认提交</el-button>
      </el-dialog>

      <!--配置下分-->
      <el-dialog :visible.sync="dialogWithdrawVisible" width=500px @close="close">
        <div style="margin:0px 0px 40px 120px">
          <span style="font-size:20px;margin:0px 30px 30px 0px">用户ID</span>
          <span style="font-size:20px;">{{currentUid}}</span>
        </div>
        <div style="margin:0px 0px 40px 60px">
          <span style="font-size:20px;">下分金额(RMB)</span>
          <el-input-number :controls="false" v-model="withDrawRMB" @blur='withDrawClick' style="width:120px"></el-input-number>
          <br>
        </div>
        <div style="margin:0px 0px 40px 50px">
          <span style="font-size:20px;">下分金币(游戏币)</span>
          <el-input-number :controls="false" v-model="withDrawMoney" disabled style="width:120px"></el-input-number>
          <br>
        </div>
        <br />
        <div style="margin:0px 0px 40px 100px">
          <span style="font-size:20px">操作描述：</span>
          <el-input style="width:300px" v-model="optDiscription"></el-input>
        </div>
        <el-button type="primary" @click="withDrawConfirm" style="margin:0px 0px 10px 190px">确认提交</el-button>
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
import { GeneralUser } from "../../../store/stateInterface";
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
    Attribution,
    MasterInfo,
    TransferRecord,
    BillRecords,
    GameInfo,
    MoneyChange
  }
})
export default class PersonWaterLine extends Vue {
  jushangConfig = this.$store.state.jushangConfig.subFaLocation;
  generalUser: GeneralUser = this.$store.state.generalUser;
  generalUserData = this.generalUser.generalUserData;
  uid: string = "";
  act: string = "";
  name: string = "";
  pidList: any[] = [];
  pid: string = "A";
  channel: string = "";
  platform: string = "";
  alipayAccount: string = "";
  ip: string = "";
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
  createDate: Date[] = [this.startTime, this.endTime];
  lastLoginTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;

  currentUid: string = ""; //选中用户id fromID

  dialogAccountVisible: boolean = false; // 编辑个人信息
  dialogChargeVisible: boolean = false; //上分
  rechargeMoney: any = "";
  rechargeRMB: any = "";

  dialogWithdrawVisible: boolean = false; //下分
  withDrawRMB: any = "";
  withDrawMoney: any = "";
  optDiscription: string = "";

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
  personWaterLine: string = "";
  created() {
    this.loadData();
     this.pidList = [{name:"全部",pid:""},...JSON.parse(<string>sessionStorage.getItem("pid"))];
  }
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "WaterLineUserData", queryItem).then(() => {
      this.generalUserData = this.generalUser.generalUserData;
    });
    myDispatch(this.$store, "GetJushangConfig", {}, true).then(() => {
      this.jushangConfig = this.$store.state.jushangConfig.subFaLocation;
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
  numToChi(data) {
    if (parseInt(data) > 10000) {
      return parseFloat(data) / 10000 + "万";
    } else {
      return data;
    }
  }
  /**上分 */
  handleRecharge(index, row) {
    this.dialogChargeVisible = true;
    this.currentUid = row.uid;
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
        `你正在为ID:${this.currentUid}的用户充值${
          this.rechargeRMB
        }元人民币，上分金币为${RMB}`,
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
  /**下分 */
  handleWithDraw(index, row) {
    this.dialogWithdrawVisible = true;
    this.currentUid = row.uid;
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
        `你正在为ID:${this.currentUid}的用户下分${
          this.withDrawRMB
        }元人民币，下分金币为${money}`,
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
  //操作，编辑个人信息
  editAccount(index, row) {
    this.dialogAccountVisible = true;
    this.currentUid = row.uid;

    this.personWaterLine = row.personWaterLine;
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
          "UpdateUserPersonWaterLine",
          {
            uid: this.currentUid,
            personWaterLine: this.personWaterLine
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

  //清空缓存数据
  close() {
    this.currentUid = "";
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
