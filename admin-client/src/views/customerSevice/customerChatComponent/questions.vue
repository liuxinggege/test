<template>
  <div class="recharge-question">
    <h3>充值问题录入</h3>
    <div class="question-main">
      <div class="question-left">
        <p>玩家ID</p>
        <el-input @blur="getPidByUid" placeholder="必填" type="text" style="width:90%" v-model="uid"></el-input>
        <p>充值方式</p>
        <el-select style="width:90%" v-model="rechargeType" placeholder="必选" @change="loadChannels">
          <el-option v-for="item in payTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <p>充值日期</p>
        <el-date-picker style="width:90%" v-model="rechargeTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="日期时间(必填)"></el-date-picker>
      </div>
      <div class="question-right">
        <p>项目</p>
        <el-select :disabled="true" style="width:100%" v-model="pid">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <!-- <el-input disabled placeholder="点击复制ID自动补全" type="text" style="width:100%" v-model="info.pid"></el-input> -->
        <p>充值渠道</p>
        <el-select style="width:100%" v-model="rechargeChannel" placeholder="必选">
          <el-option v-for="item in channels" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <p>充值金额</p>
        <el-input placeholder="(必填)" type="number" style="width:100%" v-model="money"></el-input>
      </div>
    </div>
    <div>
      <p>订单号</p>
      <el-input placeholder="(必填)" type="text" style="width:100%" v-model="orderId"></el-input>
      <p>第三方订单号</p>
      <el-input placeholder="(非必填)" type="text" style="width:100%" v-model="thirdOrderId"></el-input>
      <p>联系方式(如QQ/微信)</p>
      <el-input placeholder="(非必填)" type="text" style="width:100%" v-model="qq"></el-input>
      <p>备注或玩家描述</p>
      <el-input placeholder="(非必填)" type="text" style="width:100%" v-model="description"></el-input>
      <div style="text-align:center;margin-top:15px;">
        <el-button class="fastChat-item" type="primary" @click="confirm">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Emit } from "vue-property-decorator";
import { myAsyncFn } from "../../../utils/index.js";
import { rechargeQuestion } from "../../../api/admin/customerService/customerService";
import { getRechargeAndWithdrawItem } from "../../../api/admin/gameSetting/gameSetting";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Question extends Vue {
  uid: string = "";
  pid: string = "";
  rechargeChannel: string = "";
  channels: any = [];
  rechargeType: string = "";
  rechargeTime: any = "";
  money: number = 0;
  orderId: any = "";
  thirdOrderId: any = "";
  qq: any = "";
  description: any = "";
  payTypes = [
    { value: "wx_pay", label: "微信" },
    { value: "wx_fix", label: "固定微信" },
    { value: "ali_pay", label: "支付宝" },
    { value: "agentRechage", label: "官方代充" },
    { value: "union_pay", label: "银联" },
    { value: "yun_pay", label: "云闪付" },
    { value: "qq_pay", label: "QQ钱包" },
    { value: "jd_pay", label: "京东" },
    { value: "card_pay", label: "点卡" },
    { value: "ali_person", label: "个人支付宝" },
    { value: "ali_fix", label: "固定支付宝" }
  ];
  payTypesWeb: any = {
    wx_pay: "wxs",
    wx_fix: "wx_fix",
    ali_pay: "alis",
    union_pay: "unions",
    yun_pay: "yuns",
    qq_pay: "qqs",
    jd_pay: "jds",
    card_pay: "cards",
    ali_person: "oneAlis",
    ali_fix: "aliFixs"
  };
  options: any = [];
  pidList: any = [];
  @Prop({
    type: Array, // 父组件传递给子组件的数据类型
    required: false // 是否必填
  })
  messages!: any;
  created() {
    this.pidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
  }
  getPidByUid() {
    if (this.uid) {
      this.messages.map(i => {
        if (i.uid == this.uid) {
          this.pid = i.pid;
        }
      });
      if (!this.pid) {
        this.$message({
          type: "warning",
          message: "只能输入正在聊天的玩家ID"
        });
        this.uid = "";
      }
    }
  }
  confirm() {
    if (!this.uid) {
      this.$message({
        type: "warning",
        message: "请输入玩家ID"
      });
      return;
    }
    if (
      !this.rechargeType ||
      !this.rechargeChannel ||
      !this.rechargeTime ||
      !this.orderId
    ) {
      this.$message({
        type: "warning",
        message: "充值方式、充值渠道、充值日期、订单号必填"
      });
      return;
    }
    if (this.money === undefined || this.money <= 0) {
      this.$message({
        type: "warning",
        message: "充值金额格式不正确"
      });
      return;
    }
    let req: any = {
      pid: this.pid,
      uid: this.uid,
      rechargeType: this.rechargeType, //充值方式
      rechargeChannel: this.rechargeChannel, //充值渠道
      rechargeTime: this.rechargeTime, //充值日期
      money: this.money, //充值金额
      orderId: this.orderId //订单号
    };
    if (this.thirdOrderId) {
      req.thirdOrderId = this.thirdOrderId;
    }
    if (this.description) {
      req.description = this.description;
    }
    if (this.qq) {
      req.qq = this.qq;
    }
    this.$confirm(`是否确认提交`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(rechargeQuestion, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.initData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  initData() {
    this.pid = "";
    this.uid = "";
    this.rechargeChannel = "";
    this.rechargeType = "";
    this.money = 0;
    this.orderId = "";
    this.rechargeTime = "";
    this.description = "";
    this.thirdOrderId = "";
    this.qq = "";
  }
  loadChannels() {
    if (this.rechargeType === "agentRechage") {
      this.channels = [{ label: "官方代充", value: "agentRechage" }];
      return;
    }
    if (this.rechargeChannel) {
      this.rechargeChannel = "";
    }
    let queryItem = {
      name: this.rechargeType,
      type: "recharge"
    };
    queryItem.name = this.payTypesWeb[queryItem.name];
    getRechargeAndWithdrawItem(queryItem).then(res => {
      if (res.data.code != 200) {
        return;
      }
      if (!res.data.msg[0]) {
        this.$message.error("此支付方式暂无渠道");
        this.channels = [];
        return;
      }
      this.channels = res.data.msg[0].channel;
    });
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.recharge-question {
  width: 380px;
  height: 540px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  padding: 15px;
  border: 1px solid gray;
  font-size: 14px;
  h3 {
    padding: 0;
    margin: 0;
    text-align: center;
  }
  p {
    margin: 5px;
    padding: 0;
  }
}
.question-main {
  display: flex;
  justify-content: space-between;
}
</style>
