<template>
    <div class="content settings">
        <div class="header">
            <div @click="toHome" class="back"></div>
            <div class="text">修改银行卡信息</div>
        </div>
        <div class="hint">请输入需要修改的银行卡信息</div>
        <div class="formBox">
            <div class="formItem"><em>卡号：</em><input type="text" placeholder="请输入新卡号" v-model="bankCardNum"></div>
            <div class="formItem"><em>姓名：</em><input type="text" placeholder="请输入新姓名" v-model="bankCardName"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="reg" placeholder="输入验证码">
              <cube-button class="lineBtn" @click="getReg" :disabled="disabled">
                <span v-if="!disabled">获取验证码</span><span v-if="disabled">{{setTimeOutMsg}}</span>
              </cube-button>
            </div>
            <cube-button class="btn" @click="confirmBankClick">提交</cube-button>
        </div>
    </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SelfInfoState } from "../../store/stateInterface";
import { xutil } from "../../utils/xutil";
import { Toast } from "cube-ui";
import { utils } from "cfb/types";
import { BalanceActState } from "../../store/stateInterface";

@Component
export default class SelfInfo extends Vue {
  //
  reg: string = "";
  setTimeOutMsg: string = "";
  setTimeOutflg: number = 60;
  disabled: boolean = false;
  title: string = "";
  balanceAct: BalanceActState = this.$store.state.balanceAct; //表单数据
  bankCardNum: string = "";
  bankCardName: string = "";
  path: string = "";
  created() {
    this.path = this.$route.query.path;
  }
  //获取验证码
  async getReg() {
    await xutil.myDispatch(this.$store, "GetSettlementReg", {});
    if (this.$store.state.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      let intervalID = window.setInterval(() => {
        this.disabled = true;
        this.setTimeOutMsg = "已发送" + this.setTimeOutflg;
        this.setTimeOutflg--;
        if (this.setTimeOutflg === -1) {
          this.setTimeOutMsg = "";
          this.setTimeOutflg = 60;
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
      !(this.bankCardName && this.bankCardName.trim())
    ) {
      xutil.toastWarn("保存失败，填写银行信息不全!!!");
      return;
    }
    let regex = /^[0-9]+$/;
    if (!regex.test(this.bankCardNum)) {
      xutil.toastWarn("银行卡号不合法");
      return;
    } else {
      xutil.confirm("此操作将修改此账号结算信息,是否继续?", this.bindBankAct);
    }
  }
  bindBankAct() {
    if (
      !(this.reg && this.reg.trim()) ||
      !(this.bankCardNum && this.bankCardNum.trim()) ||
      !(this.bankCardName && this.bankCardName.trim())
    ) {
      xutil.toastWarn("保存失败，填写银行信息不全!!!");
      return;
    }
    let createData = {
      reg: this.reg,
      bankCardNo: this.bankCardNum,
      bankCardName: this.bankCardName
    };
    xutil
      .myDispatch(this.$store, "ConfirmBankCard", createData)
      .then(() => {
        if (this.balanceAct.code == 200) {
          xutil.toastSuccess("操作成功！");
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
  toHome() {
    this.$router.push({
      name: "/selfInfo",
      path: "/selfInfo",
      query: { path: this.path }
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
input::-ms-input-placeholder {
  text-align: center;
}
input::-webkit-input-placeholder {
  text-align: center;
}
.page-div {
  width: 640px;
  height: 100vh;
  background-color: #e7e7e7;
}
.head-div {
  width: 576px;
  height: 40px;
  padding: 25px 0 32px 0;
}
.head-img {
  margin: 0 10px 0 28px;
  content: none;
}
.head-text {
  vertical-align: middle;
  font-size: 36px;
  line-height: 60px;
}
.content-div {
  background-color: #ffffff;
}
.top-div {
  text-align: center;
  padding: 40px 0 40px 0;
  font-size: 30px;
  color: #959595;
}
.item-div {
  margin: 20px 0 20px 0;
  padding: 0 0 20px 0;
  text-align: center;
  .item {
    width: 520px;
    height: 50px;
    margin: 20px auto;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0 0 0 20px;
    background-color: #dfdfdf;
    input {
      width: 400px;
      background-color: #dfdfdf;
      outline: none;
    }
    .yzm-input {
      width: 350px;
    }
    span {
      margin: 0 0 0 20px;
    }
  }
}
.yzm-item {
  width: 520px;
  height: 50px;
  margin: 20px auto;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 0 0 20px;
  background-color: #dfdfdf;
  input {
    background-color: #dfdfdf;
    width: 180px;
    margin: 0 0 0 30px;
    outline: none;
  }
  .yzm-span {
    margin: 0 0 0 20px;
  }
}
.yzm-button {
  width: 150px;
  height: 40px;
  border-radius: 6px;
  border-color: #1d9ed2;
  border-width: 3px;
  color: #1d9ed2;
  outline: none;
  margin: 0 0 0 40px;
  background-color: #dfdfdf;
}
.item-button {
  .submit-button {
    width: 150px;
    height: 40px;
    border-radius: 6px;
    border-color: #1d9ed2;
    border-width: 3px;
    margin: 0 0 0 20px;
    color: #1d9ed2;
    outline: none;
    background-color: #ffffff;
  }
}
</style>
