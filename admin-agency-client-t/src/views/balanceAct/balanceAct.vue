<template>
  <div>
    <x-header :right-options="{showMore: false}" class="header"> 结算
      <a slot="right" @click="toHome">首页 </a>
    </x-header>
    <br><br><br>
    <tab :line-width=1 active-color='#fc378c' v-model="index">
      <tab-item class="vux-center" :selected="demo2 === list2[0]" @on-item-click="onItemClick" :key="0">{{list2[0]}}</tab-item>
      <tab-item class="vux-center" :selected="demo2 === list2[1]" @on-item-click="onItemClick" :key="1">{{list2[1]}}</tab-item>
    </tab>
    <br>
    <div v-if="index===0">
      <divider>结算账号设置</divider>
      <br>
      <button-tab v-model="settleType" style="width:80%;margin:0 auto;">
        <button-tab-item @on-item-click="consoleIndex()">支付宝</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex()">银行卡</button-tab-item>
      </button-tab>
      <group v-if="settleType===0" style="margin:0 5px;">
        <x-input placeholder="支付宝账号" title="账号" type="text" v-model="aliAct" required></x-input>
        <x-input placeholder="支付宝姓名" title="姓名" type="text" v-model="aliName" required></x-input>
        <x-input title="验证码" placeholder="必填" type="number" v-model="reg" required>
          <x-button slot="right" type="primary" mini @click.native="getReg" :disabled="disabled">验证码{{setTimeOutMsg}}</x-button>
        </x-input>
        <x-input style="height:0;" type="text" disabled></x-input>
        <x-button style="float:right;" class="button" type="primary" mini @click.native="confirmAliClick">确认</x-button>
      </group>
      <group v-if="settleType===1" style="margin:0 5px;">
        <cube-select v-model="bank" :options="restaurants" title="请选择银行" placeholder="请选择银行">
        </cube-select>
        <x-input placeholder="银行卡号" title="银行卡号" type="text" v-model="bankCardNum" required></x-input>
        <x-input placeholder="持卡人姓名" title="持卡人姓名" type="text" v-model="bankCardName" required></x-input>
        <x-input title="验证码" placeholder="必填" type="number" v-model="reg" required>
          <x-button slot="right" type="primary" mini @click.native="getReg" :disabled="disabled">验证码{{setTimeOutMsg}}</x-button>
        </x-input>
        <x-input style="height:0;" type="text" disabled></x-input>
        <x-button style="float:right;" class="button" type="primary" mini @click.native="confirmBankClick">确认</x-button>
      </group>
    </div>
    <div v-if="index===1">
      <divider>申请结算</divider>
      <group>
        <x-input placeholder=" " title="可结算金额" type="number" v-model="balance" disabled></x-input>
        <group :title="'结算方式:点击选中'">
          <radio :options="radio" v-model="value" @on-change="change"></radio>
        </group>
        <x-input placeholder="单次最小100元, 最高50000元" title="结算金额" type="number" v-model="settleMoney" required></x-input>
        <x-input placeholder=" " title="结算密码" type="text" v-model="settlePwd" required></x-input>
        <x-input style="height:0;" type="text" disabled></x-input>
        <x-button style="float:right;" class="button" type="primary" mini @click.native="confirmClick">提交结算</x-button>
        <x-button style="float:right;" class="button" type="primary" mini @click.native="masterIncomeSettle" v-if="isMaster">结算师徒收益</x-button>
      </group>
      <x-dialog :show.sync="aliSettleVisible" class="dialog-demo" hide-on-blur :dialog-style="{ height: '80', width: '80'}">
        <div style="float:right;" @click="aliSettleVisible=false">
          <x-icon type="ios-close-outline"></x-icon>
        </div>
        <div>
          <br>
          <group title="提现金额">
            <x-input placeholder=" " title="" type="text" v-model="settleMoney" disabled></x-input>
          </group>
          <group title="支付宝账户">
            <x-input placeholder=" " title="" type="text" v-model="aliAct" disabled></x-input>
          </group>
          <x-button class="button" type="primary" mini @click.native="settleConfirm">确认提现</x-button>
        </div>
      </x-dialog>
      <x-dialog :show.sync="bankCarkSettleVisible" class="dialog-demo" hide-on-blur :dialog-style="{ height: '80', width: '80'}">
        <div style="float:right;" @click="bankCarkSettleVisible=false">
          <x-icon type="ios-close-outline"></x-icon>
        </div>
        <div>
          <group title="提现金额">
            <x-input placeholder=" " title="" type="text" v-model="settleMoney" disabled></x-input>
          </group>
          <group title="银行账户">
            <x-input placeholder=" " title="" type="text" v-model="bankCardNum" disabled></x-input>
          </group>
          <group title="开户银行">
            <x-input placeholder=" " title="" type="text" v-model="bankChineseName" disabled></x-input>
          </group>
          <x-button class="button" type="primary" mini @click.native="settleConfirm">确认提现</x-button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BalanceActState } from "../../store/stateInterface";
import { xutil } from "../../utils/xutil";

@Component
export default class BalanceAct extends Vue {
  //==================================================
  list2 = ["结算账号", "申请结算"];
  index = 0;
  demo2 = "结算账号";
  balance: string = "";
  settleMoney: string = "";
  settlePwd: string = "";
  value: string = "";
  radio: any[] = [
    { key: "alipay", value: "支付宝" },
    { key: "unionpay", value: "银行卡" }
  ];
  aliSettleVisible: boolean = false;
  bankCarkSettleVisible: boolean = false;
  isMaster: boolean = false;

  settleType: number = 0;
  //   act: string = "";
  balanceAct: BalanceActState = this.$store.state.balanceAct; //表单数据
  bankCardNum: string = "";
  bankCardName: string = "";
  bank: string = "";
  bankChineseName: string = "";
  aliAct: string = "";
  aliName: string = "";
  restaurants: any[] = [
    { text: "未选择", value: "" },
    { text: "中国银行", value: "BOC" },
    { text: "工商银行", value: "ICBC" },
    { text: "农业银行", value: "ABC" },
    { text: "建设银行", value: "CCB" },
    { text: "交通银行", value: "BCM" },
    { text: "招商银行", value: "CMB" },
    { text: "光大银行", value: "CEB" },
    { text: "民生银行", value: "CMBC" },
    { text: "兴业银行", value: "CIB" },
    { text: "浦发银行", value: "SPDB" }
  ];
  //   canAliAct: boolean = false;
  //   canAliName: boolean = false;
  //   canBankCardNum: boolean = false;
  //   canBank: boolean = false;
  //   canBankCardName: boolean = false;
  //   showAliBt: boolean = false;
  //   showBankBt: boolean = false;
  reg: string = "";
  setTimeOutMsg: string = "";
  setTimeOutflg: number = 60;
  disabled: boolean = false;

  created() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    // this.showAliBt = false;
    // this.showBankBt = false;
    this.reg = "";
    xutil.myDispatch(this.$store, "GetUserInfo", {}).then(() => {
      //   this.act = <string>this.balanceAct.userInfo.act;
      this.aliAct = <string>this.balanceAct.userInfo.alipayAct;
      this.aliName = <string>this.balanceAct.userInfo.alipayName;
      this.bankCardNum = <string>this.balanceAct.userInfo.bankCardNo;
      this.bankCardName = <string>this.balanceAct.userInfo.bankCardName;
      this.bank = <string>this.balanceAct.userInfo.bankName;
      this.balance = <string>this.balanceAct.userInfo.balance;
      if (this.balanceAct.userInfo.masterGameUid) {
        this.isMaster = true;
      }
    });
  }
  //获取验证码
  async getReg() {
    let phone = <string>this.balanceAct.userInfo.phone;
    await xutil.myDispatch(this.$store, "GetSettlementReg", {});
    if (this.$store.state.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      let intervalID = window.setInterval(() => {
        this.disabled = true;
        this.setTimeOutMsg = "已发送" + this.setTimeOutflg;
        this.setTimeOutflg--;
        if (this.setTimeOutflg === -1) {
          this.setTimeOutMsg = "";
          this.setTimeOutflg=  60;
          this.disabled = false;
          window.clearInterval(intervalID);
        }
      }, 1000);
    } else {
      xutil.toastWarn(`失败:${this.$store.state.selfInfo.msg}`);
    }
  }
  confirmBankClick() {
    if (
      !(this.bankCardNum && this.bankCardNum.trim()) ||
      !(this.bankCardName && this.bankCardName.trim()) ||
      !(this.bank && this.bank.trim())
    ) {
      xutil.toastWarn("保存失败，填写银行信息不全!!!");
      return;
    }
    xutil.confirm("此操作将修改此账号结算信息,是否继续?", this.bindBankAct);
  }
  bindBankAct() {
    if (
      !(this.reg && this.reg.trim()) ||
      !(this.bankCardNum && this.bankCardNum.trim()) ||
      !(this.bankCardName && this.bankCardName.trim()) ||
      !(this.bank && this.bank.trim())
    ) {
      xutil.toastWarn("保存失败，填写银行信息不全!!!");
      return;
    }
    let createData = {
      reg: this.reg,
      bankCardNo: this.bankCardNum,
      bankCardName: this.bankCardName,
      bankName: this.bank
    };
    xutil
      .myDispatch(this.$store, "ConfirmBankCard", createData)
      .then(() => {
        if (this.balanceAct.code == 200) {
          xutil.toastSuccess("操作成功！");
          this.loadUserInfo();
          return;
        } else {
          xutil.toastWarn(`${this.balanceAct.msg}`);
        }
      })
      .catch(err => {
        console.error("err:", err);
        xutil.toastWarn("操作失败！");
        return;
      });
  }
  confirmAliClick() {
    if (
      !(this.reg && this.reg.trim()) ||
      !(this.aliAct && this.aliAct.trim()) ||
      !(this.aliName && this.aliName.trim())
    ) {
      xutil.toastWarn("存在未输项");
      return;
    }
    xutil.confirm("此操作将修改此账号结算信息,是否继续?", this.bindAliAct);
  }
  bindAliAct() {
    let message = "";
    if (
      !(this.aliAct && this.aliAct.trim()) ||
      !(this.aliName && this.aliName.trim())
    ) {
      xutil.toastWarn("存在未输项");
      return;
    }
    let createData = {
      reg: this.reg,
      alipayAct: this.aliAct,
      alipayName: this.aliName
    };
    xutil
      .myDispatch(this.$store, "ConfirmAli", createData)
      .then(() => {
        if (this.balanceAct.code == 200) {
          xutil.toastSuccess("操作成功！");
          this.loadUserInfo();
          return;
        } else {
          xutil.toastWarn(`${this.balanceAct.msg}`);
        }
      })
      .catch(err => {
        console.error("err:", err);
        xutil.toastWarn("操作失败！");
        return;
      });
  }
  consoleIndex() {
    this.reg = "";
    console.log("this.settleType", this.settleType);
  }
  toHome() {
    this.$router.push({ path: "/home" });
  }
  onItemClick() {
    console.log("this.index", this.index);
    this.loadUserInfo();
    if (this.index === 1) {
      if (!this.aliAct && !this.aliName) {
        xutil.toastWarn("尚未绑定支付宝账户");
        return;
      }
      if (!this.bank && !this.bankCardNum && !this.bankCardName) {
        xutil.toastWarn("尚未绑定银行卡账户");
        return;
      }
    }
  }
  change(value, label) {
    console.log("change:", value, label);
    console.log("this.value", value);
    if (value === "alipay" && !this.aliAct && !this.aliName) {
      xutil.toastWarn("尚未绑定支付宝账户");
    }
    if (
      value === "unionpay" &&
      !this.bank &&
      !this.bankCardNum &&
      !this.bankCardName
    ) {
      xutil.toastWarn("尚未绑定银行卡账户");
      this.value = "";
      value = "";
    }
  }
  confirmClick() {
    if (!this.settleMoney.trim()) {
      xutil.toastWarn("申请金额不能为空");
      return;
    }
    if (!this.value) {
      xutil.toastWarn("尚未选择结算方式");
      return;
    }
    if (!this.settlePwd.trim()) {
      xutil.toastWarn("结算密码不能为空");
      return;
    }
    if (
      parseInt(this.settleMoney) > parseInt(this.balance) ||
      parseInt(this.settleMoney) > 50000 ||
      parseInt(this.settleMoney) < 100
    ) {
      xutil.toastWarn("申请金额不合法");
    } else {
      this.format(this.bank);
      if (this.value == "alipay") {
        this.aliSettleVisible = true;
      } else {
        this.bankCarkSettleVisible = true;
      }
    }
  }
  settleConfirm() {
    xutil.confirm("确认提取,是否继续?", this.settleMent);
    if (this.value == "alipay") {
      this.aliSettleVisible = false;
    } else {
      this.bankCarkSettleVisible = false;
    }
  }
  async settleMent() {
    let createData = {
      payPwd: this.settlePwd,
      settleType: this.value,
      setMoney: this.settleMoney
    };
    await xutil.myDispatch(this.$store, "ComfirmSubmitBalance", createData);
    if (this.$store.state.submitBalance.code == 200) {
      xutil.toastSuccess("申请提现成功!");
      this.loadUserInfo();
      return;
    } else {
      xutil.toastWarn("申请提现失败!" + this.$store.state.submitBalance.msg);
      return;
    }
  }
  //师徒收益结算
  async masterIncomeSettle() {
    await xutil.myDispatch(this.$store, "MasterIncomeSettle", {});
    let msg = this.balanceAct.msg;
    if (this.balanceAct.code == 200) {
      xutil.toastSuccess("结算成功!");
      this.loadUserInfo();
    } else {
      xutil.toastWarn(`结算失败!${msg}`);
    }
  }
  format(bank) {
    switch (bank) {
      case "BOC":
        this.bankChineseName = "中国银行";
        return;
      case "ICBC":
        this.bankChineseName = "工商银行";
        return;
      case "ABC":
        this.bankChineseName = "农业银行";
        return;
      case "CCB":
        this.bankChineseName = "建设银行";
        return;
      case "BCM":
        this.bankChineseName = "交通银行";
        return;
      case "CMB":
        this.bankChineseName = "招商银行";
        return;
      case "CEB":
        this.bankChineseName = "光大银行";
        return;
      case "CMBC":
        this.bankChineseName = "民生银行";
        return;
      case "CIB":
        this.bankChineseName = "兴业银行";
        return;
      case "SPDB":
        this.bankChineseName = "浦发银行";
        return;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  width: 100%;
  position: fixed !important;
  z-index: 2;
}
.datetime p,
.datetime {
  margin: 0;
}
.weui-cell__bd p {
  padding: 5px !important;
  margin: 0;
}
.datetime {
  padding: 0 10px;
  margin: 0;
}
.datetime datetime,
.weui-cell_radio {
  padding: 5px;
}
.vux-datetime {
  padding: 10px 0 !important;
}
label,
p {
  font-size: 14px;
  font-weight: 700;
}
.button {
  margin: 10px 20px !important;
}
.scroll-list-wrap {
  height: 756px;
  overflow: hidden;
}
// .scrollTo {
//   position: fixed !important;
//   z-index: 99;
//   opacity: 0.05;
//   bottom: 30px;
//   right: 35px;
//   transform: scale(2.5) rotate(-90deg);
//   text-align: center;
// } index.html

//card
.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  position: relative;
  padding: 3px 4px;
}
.field2 {
  position: absolute;
  left: 26%;
}
.field3 {
  position: absolute;
  left: 53%;
}
.field4 {
  position: absolute;
  left: 78%;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  text-align: left;
  //   font-size: 12px;
}
.card-demo-flex span {
  color: #f74c31;
}
.vux-1px-r {
  margin: 0 6px;
}
.fieldName {
  color: #000 !important;
  font-size: 8px !important;
  display: inline-block;
  margin: 2px 0;
}
//生气
.vux-1px-r:after {
  border: 0;
}

// #ffe26d
.vux-button-group {
  & > a.vux-button-group-current {
    // background: #ffe26d;
    background: #35495e;
  }
}
</style>
