<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <!-- <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="兑换配置"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>兑换配置</b>
      </span>-->
      <span style="position:absolute; right:0; top:1;z-index:1">
        <el-button type="primary" style="margin:0px 0px 10px 0px" @click="updateWithdrawCfg">读取</el-button>
        <el-button type="primary" style="margin:0px 100px 10px 0px" @click="saveWithdrawCfg">保存</el-button>
      </span>
      <el-row :gutter="20">
        <el-col :span="6">
          <span style="font-size:12pt; margin:10px 10px 10px 35px">总充值上限</span>
          <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="totalRechargeRLimit"></el-input>
        </el-col>
        <el-col :span="6">
          <span style="font-size:12pt; margin:10px 10px 10px 20px">每天提现限制</span>
          <el-input type="text" style="width:100px; margin:10px 0px" v-model="perDayWithdrawLimit"></el-input>
        </el-col>
        <el-col :span="6">
          <span style="font-size:12pt; margin:10px 10px 10px 0">总游戏时间最小限制</span>
          <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="totalGameTimeLimit"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <span style="font-size:12pt; margin:0px 10px 0px 0px">累积兑换超过抽水的倍数</span>
          <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="relationWithdrawAndTaxRate"></el-input>
        </el-col>
        <el-col :span="6">
          <span style="font-size:12pt; margin:10px 10px 10px 0px">支付宝提现渠道</span>
          <el-select v-model="channel" placeholder="请选择" style="width:110px; margin:0px 0px 0px 0px">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span style="font-size:12pt; margin:10px 10px 10px 50px">每天提现次数</span>
          <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="perDayWithdrawTimes"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9">
          <span style="font-size:12pt; margin:10px 10px 10px 84px">捕鱼次数限制</span>
          <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="buyuCountLimit"></el-input>
          <span style="font-size:12pt;">ps:超过次数兑换将会机审通过</span>
        </el-col>
        <el-col :span="9">
          <span style="font-size:12pt; margin:10px 10px 10px 0px">银行卡提现渠道</span>
          <el-select v-model="bankCardChannel" placeholder="请选择" style="width:160px; margin:10px 0px 0px 0px">
            <el-option v-for="item in bankcardOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20"></el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <span style="font-size:12pt; margin:0px 0px 0px 35px">提现总开关</span>
          <el-checkbox v-model="active" style="margin:20px 0px 10px 15px"></el-checkbox>
        </el-col>
        <el-col :span="4">
          <span style="font-size:12pt; margin:0px 0px 10px 15px">支付宝开关</span>
          <el-checkbox v-model="alipay" style="margin:20px 0px 10px 15px"></el-checkbox>
        </el-col>
        <el-col :span="4">
          <span style="font-size:12pt; margin:0px 0px 10px 15px">银行卡提现开关</span>
          <el-checkbox v-model="bankCard" style="margin:20px 0px 10px 15px"></el-checkbox>
        </el-col>
        <el-col :span="4">
          <span style="font-size:12pt; margin:0px 0px 10px 15px">自动退钱</span>
          <el-checkbox v-model="autoDrawback" style="margin:20px 0px 10px 15px"></el-checkbox>
        </el-col>
      </el-row>
      <!--列表-->
      <el-table :data="withdrawCfg.vip" border highlight-current-row style="width: 98%;">
        <el-table-column prop="pid" label="项目" min-width="50" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="active" label="开关" min-width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.active" style="margin:20px 0px 10px 15px"></el-checkbox>
            <!-- <el-checkbox type="text" @click="editActive(scope.$index,scope.row)"  >{{scope.row.active}}</el-checkbox>      -->
          </template>
        </el-table-column>
        <el-table-column prop="minMoney" label="vip兑换最小金额" min-width="100" align="center">
          <template slot-scope="scope">
            <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="scope.row.minMoney"></el-input>
            <!-- <el-input type="text" @click="editMinMoney(scope.$index,scope.row)"  >{{scope.row.pid}}</el-input>      -->
          </template>
        </el-table-column>
        <el-table-column prop="maxMoney" label="vip兑换最大金额" min-width="100" align="center">
          <template slot-scope="scope">
            <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="scope.row.maxMoney"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="userShowVipMinMoney" label="显示vip兑换需要的最小携带金额" min-width="100" align="center">
          <template slot-scope="scope">
            <el-input type="text" style="width:100px; margin:10px 0px 10px 0px" v-model="scope.row.userShowVipMinMoney"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="agent" label="商人" min-width="300" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="width:100px; margin:10px 0px 10px 0px" @click="agentChange(scope.$index,scope.row)">{{scope.row.agent.toString()}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" style="margin:10px 0 -15px 20px" @click="addRechargeSection">添加倍数</el-button>
      <el-table :data="rechargeSection" border highlight-current-row style="width: 70%;margin: 20px">
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="del(scope.$index)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="倍数" align="center">
          <template slot-scope="scope">
            <template v-if="rateFlag[scope.$index]">
              <el-input style="width:90px" class="edit-input" v-model="scope.row.rate"></el-input>
              <el-button class="close-btn" icon="el-icon-close" type="warning" @click="cancelEditRate(scope.$index)"></el-button>
            </template>
            <el-input v-else style="width:60px" disabled class="edit-input" v-model="scope.row.rate"></el-input>
            <el-button v-if="rateFlag[scope.$index]" type="success" class="close-btn" @click="saveRate(scope.$index, scope.row)" icon="el-icon-circle-check-outline"></el-button>
            <el-button v-else type="primary" @click="editRate(scope.$index)" icon="el-icon-edit"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="左区间" align="center">
          <template slot-scope="scope">
            <template v-if="lLimitFlag[scope.$index]">
              <el-input style="width:90px" class="edit-input" v-model="scope.row.lLimit"></el-input>
              <el-button class="close-btn" icon="el-icon-close" type="warning" @click="cancelEditLLimit(scope.$index)"></el-button>
            </template>
            <el-input v-else style="width:90px" disabled class="edit-input" v-model="scope.row.lLimit"></el-input>
            <el-button v-if="lLimitFlag[scope.$index]" type="success" class="close-btn" @click="saveLLimit(scope.$index, scope.row)" icon="el-icon-circle-check-outline"></el-button>
            <el-button v-else type="primary" @click="editLLimit(scope.$index)" icon="el-icon-edit"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="右区间" align="center">
          <template slot-scope="scope">
            <template v-if="rLimitFlag[scope.$index]">
              <el-input style="width:90px" class="edit-input" v-model="scope.row.rLimit"></el-input>
              <el-button class="close-btn" icon="el-icon-close" type="warning" @click="cancelEditRLimit(scope.$index)"></el-button>
            </template>
            <el-input v-else style="width:90px" disabled class="edit-input" v-model="scope.row.rLimit"></el-input>
            <el-button v-if="rLimitFlag[scope.$index]" type="success" class="close-btn" @click="saveRLimit(scope.$index, scope.row)" icon="el-icon-circle-check-outline"></el-button>
            <el-button v-else type="primary" @click="editRLimit(scope.$index)" icon="el-icon-edit"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogAgentVisible" @close="close">
        <div style="margin:0 13px 20px">
          <span style="font-size:15px;">商人</span>
          <el-input v-model="vipAgent" style="width:300px; margin:0 10px"></el-input>
        </div>
        <el-button type="primary" @click="confirmAgent" style="margin:0 0 0 400px">确认</el-button>
      </el-dialog>
      <el-dialog :visible.sync="dialogRechargeSectionVisible">
        <div style="margin:0 13px 20px">
          <span style="font-size:15px;">倍数</span>
          <el-input v-model="rate" style="width:90px; margin:0 10px"></el-input>
          <span style="font-size:15px;">左区间</span>
          <el-input v-model="lLimit" style="width:90px; margin:0 10px"></el-input>
          <span style="font-size:15px;">右区间</span>
          <el-input v-model="rLimit" style="width:90px; margin:0 10px"></el-input>
        </div>
        <el-button type="primary" @click="confirmRechargeSection" style="margin:0 0 0 400px">确认</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { WithdrawCfg } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//withdrawCfg

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class withdrawCfg extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    myDispatch(this.$store, "GetRechargeAndWithdrawItem", {
      type: "withdraw"
    }).then(() => {
      if (this.$store.state.rechargeAndWithdrawCfg.code === 200) {
        this.stateOptions = this.$store.state.rechargeAndWithdrawCfg.withdraw_ali;
        this.bankcardOptions = this.$store.state.rechargeAndWithdrawCfg.withdraw_bank;
        this.loadData();
      } else {
        this.$message({ type: "error", message: "获取数据失败!!" });
      }
    });
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  withdrawCfg: WithdrawCfg = this.$store.state.withdrawCfg; //表单数据
  stateOptions = [];
  bankcardOptions = [];

  rechargeSection: any = [];
  rateFlag: any = [];
  lLimitFlag: any = [];
  rLimitFlag: any = [];

  tmpRate: any = [];
  tmpLLimit: any = [];
  tmpRLimit: any = [];
  dialogRechargeSectionVisible: boolean = false;
  dialogAgentVisible: boolean = false;
  rate: string = "";
  lLimit: string = "";
  rLimit: string = "";

  vipAgent: string = "";
  index: number = 0;

  relationWithdrawAndTaxRate: any = "";
  autoDrawback: boolean = false;

  totalGameTimeLimit: any = "";
  perDayWithdrawLimit: any = "";
  totalRechargeRLimit: any = "";
  perDayWithdrawTimes: any = "";
  buyuCountLimit: any = "";
  active: boolean = false;
  vip: any[] = [];
  alipay: boolean = false;
  bankCard: boolean = false;
  agent: boolean = false;
  pidList: any[] = [];

  channel: string = "";
  bankCardChannel: string = "";

  vipMinMoney: string = "";
  vipMaxMoney: string = "";
  userShowVipMinMoney: string = "";
  yqWithdrawVIP: string = "";
  kxWithdrawVIP: string = "";
  //   bankWithdrawCDSwitch: boolean = false;

  /*method*/
  loadData() {
    this.updateWithdrawCfg();
  }

  del(index) {
    this.rechargeSection.splice(index, 1);
  }
  confirmRechargeSection() {
    if (!this.rate || !this.rLimit || !this.lLimit) {
      this.$message({
        message: "请输入完整数据",
        duration: 1500
      });
      return;
    }
    this.rechargeSection.push({
      rate: this.rate,
      lLimit: this.lLimit,
      rLimit: this.rLimit
    });
    this.dialogRechargeSectionVisible = false;
  }

  addRechargeSection() {
    this.dialogRechargeSectionVisible = true;
  }

  editRate(index) {
    this.rateFlag.splice(index, 1, !this.rateFlag[index]);
  }

  editLLimit(index) {
    this.lLimitFlag.splice(index, 1, !this.lLimitFlag[index]);
  }

  editRLimit(index) {
    this.rLimitFlag.splice(index, 1, !this.rLimitFlag[index]);
  }

  cancelEditRate(index) {
    this.rechargeSection[index].rate = this.tmpRate[index];
    this.rateFlag.splice(index, 1, !this.rateFlag[index]);
  }

  cancelEditLLimit(index) {
    this.rechargeSection[index].lLimit = this.tmpLLimit[index];
    this.lLimitFlag.splice(index, 1, !this.lLimitFlag[index]);
  }

  cancelEditRLimit(index) {
    this.rechargeSection[index].rLimit = this.tmpRLimit[index];
    this.rLimitFlag.splice(index, 1, !this.rLimitFlag[index]);
  }

  saveRate(index, row) {
    this.rateFlag.splice(index, 1, !this.rateFlag[index]);
  }

  saveLLimit(index, row) {
    this.lLimitFlag.splice(index, 1, !this.lLimitFlag[index]);
  }
  saveRLimit(index, row) {
    this.rLimitFlag.splice(index, 1, !this.rLimitFlag[index]);
  }

  getWithdrawCfg() {
    this.loadData();
  }
  updateWithdrawCfg() {
    this.$store.dispatch("GetWithdrawCfg").then(() => {
      this.relationWithdrawAndTaxRate = this.withdrawCfg.relationWithdrawAndTaxRate;
      this.autoDrawback = this.withdrawCfg.autoDrawback;
      this.channel = this.withdrawCfg.aliChannel;
      this.bankCardChannel = this.withdrawCfg.bankCardChannel;
      this.totalGameTimeLimit = this.withdrawCfg.totalGameTimeLimit;
      this.perDayWithdrawLimit = this.withdrawCfg.perDayWithdrawLimit;
      this.totalRechargeRLimit = this.withdrawCfg.totalRechargeRLimit;
      this.buyuCountLimit = this.withdrawCfg.buyuCountLimit;
      this.perDayWithdrawTimes = this.withdrawCfg.perDayWithdrawTimes.join(",");
      this.vip = this.withdrawCfg.vip || [];
      this.alipay = this.withdrawCfg.alipay;
      this.bankCard = this.withdrawCfg.bankCard;
      this.agent = this.withdrawCfg.agent;
      this.active = this.withdrawCfg.switch;

      //   this.bankWithdrawCDSwitch = this.withdrawCfg.bankWithdrawCDSwitch;

      this.rechargeSection = this.withdrawCfg.rechargeSection;
      this.rechargeSection.forEach(element => {
        this.rateFlag.push(false);
        this.lLimitFlag.push(false);
        this.rLimitFlag.push(false);
        this.tmpRate.push(element.rate);
        this.tmpLLimit.push(element.lLimit);
        this.tmpRLimit.push(element.rLimit);
      });
    });
  }
  pidFormat(row, column) {
    let name = "";
    if (row.pid) {
      this.pidList.forEach(element => {
        if (element.pid === row.pid) {
          name = element.name;
        }
      });
    }
    return name;
  }
  agentChange(index, row) {
    this.index = index;
    this.vipAgent = row.agent.toString();
    this.dialogAgentVisible = true;
  }
  confirmAgent() {
    let num: any = this.vipAgent.split(",");
    for (let item in num) {
      if (!isNaN(parseInt(num[item]))) {
        num[item] = parseInt(num[item]);
      } else {
        this.$message({ message: "不正确的商人id", type: "error" });
        return;
      }
    }
    this.vip[this.index].agent = num;
    this.dialogAgentVisible = false;
  }
  close() {
    this.index = 0;
    this.vipAgent = "";
    this.dialogAgentVisible = false;
  }
  saveWithdrawCfg() {
    console.log(JSON.stringify(this.vip));

    let tmp = {
      rechargeSection: this.rechargeSection,
      relationWithdrawAndTaxRate: this.relationWithdrawAndTaxRate,
      autoDrawback: this.autoDrawback,
      aliChannel: this.channel,
      bankCardChannel: this.bankCardChannel,
      totalGameTimeLimit: this.totalGameTimeLimit,
      perDayWithdrawLimit: this.perDayWithdrawLimit,
      totalRechargeRLimit: this.totalRechargeRLimit,
      buyuCountLimit: this.buyuCountLimit,
      perDayWithdrawTimes: this.perDayWithdrawTimes
        .split(",")
        .map(s => parseInt(s.trim())),
      vip: this.vip,
      alipay: this.alipay,
      bankCard: this.bankCard,
      agent: this.agent,
      switch: this.active

      //   bankWithdrawCDSwitch: this.bankWithdrawCDSwitch
    };
    for (let key in tmp) {
      if (tmp[key] === "" && key != "aliChannel" && key != "bankCardChannel") {
        this.$message({
          message: "请输入完整数据",
          duration: 1500
        });
        return;
      }
    }
    this.$store
      .dispatch("UpdateWithdrawCfg", tmp)
      .then(() => {
        if (this.withdrawCfg.code == 200) {
          this.$message({
            type: "success",
            message: "数据保存成功",
            duration: 3000
          });
        } else {
          this.$message({
            type: "error",
            message: `操作失败! ${this.withdrawCfg.msg}`,
            duration: 3000
          });
        }
      })
      .catch(err => {
        this.$message({
          message: "数据保存失败",
          duration: 1500
        });
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
    margin-top: 80px;
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
</style>
