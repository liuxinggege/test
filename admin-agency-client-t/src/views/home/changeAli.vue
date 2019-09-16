<template>
    <div class="content settings">
        <div class="header">
            <div @click="toHome" class="back"></div>
            <div class="text">修改支付宝信息</div>
        </div>
        <div class="hint">请输入你需要修改的支付宝信息</div>
        <div class="formBox">
            <div class="formItem"><em>账号：</em><input type="text" placeholder="请输入新账号" v-model="aliAct"></div>
            <div class="formItem"><em>姓名：</em><input type="text" placeholder="请输入新姓名" v-model="aliName"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="reg" placeholder="输入验证码">
              <cube-button class="lineBtn" @click="getReg" :disabled="disabled">
                <span v-if="!disabled">获取验证码</span><span v-if="disabled">{{setTimeOutMsg}}</span>
              </cube-button>
            </div>
            <cube-button class="btn" @click="confirmAliClick">提交</cube-button>
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
  aliAct: string = "";
  aliName: string = "";
  balanceAct: BalanceActState = this.$store.state.balanceAct; //表单数据
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
        this.setTimeOutMsg = "" + this.setTimeOutflg;
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
  confirmAliClick() {
    if (
      !(this.reg && this.reg.trim()) ||
      !(this.aliAct && this.aliAct.trim()) ||
      !(this.aliName && this.aliName.trim())
    ) {
      xutil.toastWarn("存在未输项");
      return;
    }

    if (!this.checkAliAct(this.aliAct)) {
      xutil.toastWarn("支付宝账号不合法");
      return;
    } else {
      xutil.confirm("此操作将修改此账号结算信息,是否继续?", this.bindAliAct);
    }
  }

  checkAliAct(aliAct) {
    for (let v of aliAct) {
      if (
        (v >= "a" && v <= "z") ||
        (v >= "A" && v <= "Z") ||
        (v >= "0" && v <= "9") ||
        v === "@" ||
        v === "."
      ) {
        continue;
      }
      return false;
    }
    return true;
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
