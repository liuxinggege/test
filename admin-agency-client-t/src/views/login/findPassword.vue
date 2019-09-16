<template>
    <div class="content settings">
        <div class="header">
            <div @click="toHome" class="back"></div>
            <div class="text">找回密码</div>
        </div>
        <div class="formBox">
            <div class="formItem"><em>账号：</em><input type="text" v-model="act" placeholder="请输入您的账号"></div>
            <div class="formItem"><em>手机号：</em><input v-model="phone" type="text" placeholder="请输入原手机号"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="reg">
              <cube-button class="lineBtn" @click="getReg" :disabled="disabled">
                <span v-if="!disabled">获取验证码</span><span v-if="disabled">{{setTimeOutMsg}}</span>
              </cube-button>
            </div>
            <div class="formItem"><em>新密码：</em><input placeholder="请输入新登录密码" v-model="newPwd" type="password"></div>
            <cube-button class="btn" @click="confirmUpdate">提交</cube-button>
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

@Component
export default class FindPassword extends Vue {
  newPwdFlag: boolean = false;
  act: string = "";
  phone: string = "";
  reg: string = "";
  setTimeOutMsg: string = "";
  setTimeOutflg: number = 60;
  disabled: boolean = false;
  newPwd: string = "";
  toHome() {
    this.$router.push({ path: "/login" });
  }
  async getReg() {
    if (!this.phone) {
      xutil.toastWarn("手机号为必输项");
      return;
    }
    await xutil.myDispatch(this.$store, "GetFixPwdReg", {
      oldPhone: this.phone,
      act: this.act
    });
    if (this.$store.state.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      let intervalID = window.setInterval(() => {
        this.disabled = true;
        this.setTimeOutMsg = ""+ this.setTimeOutflg;
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
  confirmUpdate() {
    if (!this.act.trim()) {
      xutil.toastWarn("账号必填");
      return;
    }
    if (!this.phone.trim()) {
      xutil.toastWarn("绑定手机号码必填");
      return;
    }
    if (!this.reg.trim()) {
      xutil.toastWarn("验证码必填");
      return;
    }
    if (!this.newPwd.trim()) {
      xutil.toastWarn("新密码必填");
      return;
    }
    xutil.confirm("确认修改密码？", this.updatePwd);
  }
  async updatePwd() {
    let tmp: any = {};
    if (this.newPwd) {
      let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!regex.test(this.newPwd)) {
        xutil.toastWarn("密码至少8位必须包含字母数字");
        return;
      }
    }
    await xutil.myDispatch(this.$store, "FixPwdByPhone", {
      act: this.act,
      phone: this.phone,
      reg: this.reg,
      newPwd: this.newPwd
    });
    if (this.$store.state.selfInfo.code === 200) {
      xutil.toastSuccess("修改成功");
      this.newPwdFlag = false;
    } else {
      xutil.toastWarn(`修改失败${this.$store.state.selfInfo.msg}`);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.formBox{margin-top: 4vh;}
</style>
