<template>
    <div class="content settings">
        <div class="header">
            <div @click="toHome" class="back"></div>
            <div class="text">修改手机号</div>
        </div>
        <div class="hint">请输入你需要修改的手机号信息</div>
        <div class="formBox">
            <div class="formItem"><em>原手机号：</em><input type="text" placeholder="请输入原手机号" v-model="oldPhone"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="oldReg">
              <cube-button class="lineBtn" @click="getOldPhoneReg" :disabled="oldDisabled">
                <span v-if="!oldDisabled">获取验证码</span><span v-if="oldDisabled">{{oldSetTimeOutMsg}}</span>
              </cube-button>
            </div>
            <div class="formItem"><em>新手机号：</em><input type="text" placeholder="输入新手机号" v-model="phone"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="newReg">
              <cube-button class="lineBtn" @click="getNewPhoneReg" :disabled="newDisabled">
                <span v-if="!newDisabled">获取验证码</span><span v-if="newDisabled">{{newSetTimeOutMsg}}</span>
              </cube-button>
            </div>
            <cube-button class="btn" @click="confirmUpdatePhone">提交</cube-button>
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
  oldReg: string = "";
  newReg: string = "";
  oldSetTimeOutMsg: string = "";
  newSetTimeOutMsg: string = "";
  oldSetTimeOutflg: number = 60;
  newSetTimeOutflg: number = 60;
  oldDisabled: boolean = false;
  newDisabled: boolean = false;
  phone: string = "";
  oldPhone: string = "";
  oldIntervalID: number;
  newIntervalID: number;
  selfInfo: SelfInfoState = this.$store.state.selfInfo; //表单数据
  path: string = "";
  created() {
    this.path = this.$route.query.path;
  }
  confirmUpdatePhone() {
    if(!this.oldPhone){
      xutil.toastWarn("请填写原手机号");
      return;
    }
    if(!this.phone){
      xutil.toastWarn("请填写新手机号");
      return;
    }
    if (!this.oldReg) {
      xutil.toastWarn("请填写原手机接受的验证码");
      return;
    }
    if (!this.newReg) {
      xutil.toastWarn("请填写新手机接收的验证码");
      return;
    }
    xutil.confirm("确认修改绑定手机?", this.updatePhone);
  }
  async updatePhone() {
    let tmp = {
      phone: this.phone,
      oldPhone: this.oldPhone,
      oldReg: this.oldReg,
      newReg: this.newReg
    };
    await xutil.myDispatch(this.$store, "UpdateSelfPhone", tmp);
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("修改成功!");
      xutil.sessionStorageSetItem("userInfo", this.selfInfo.selfInfo); 
      window.clearInterval(this.oldIntervalID);
      window.clearInterval(this.newIntervalID);
    } else {
      xutil.toastWarn(`修改失败!${this.selfInfo.msg}`);
    }
  }
  async getOldPhoneReg() {
    if(!this.oldPhone){
      xutil.toastWarn("请填写原手机号");
      return;
    }
    await xutil.myDispatch(this.$store, "GetOldPhoneReg", {oldPhone:this.oldPhone});
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      this.oldIntervalID = window.setInterval(() => {
        this.oldDisabled = true;
        this.oldSetTimeOutMsg = ""+ this.oldSetTimeOutflg;
        this.oldSetTimeOutflg--;
        if (this.oldSetTimeOutflg === -1) {
          this.oldSetTimeOutMsg = "";
          this.oldSetTimeOutflg=  60;
          this.oldDisabled = false;
          window.clearInterval(this.oldIntervalID);
        }
      }, 1000);
    } else {
      xutil.toastWarn(`失败:${this.selfInfo.msg}`);
    }
  }
  async getNewPhoneReg() {
    if(!this.phone){
      xutil.toastWarn("请填写新手机号");
      return;
    }
    await xutil.myDispatch(this.$store, "GetNewPhoneReg", {
      newPhone: this.phone
    });
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      this.newIntervalID = window.setInterval(() => {
        this.newDisabled = true;
        this.newSetTimeOutMsg = ""+ this.newSetTimeOutflg;
        this.newSetTimeOutflg--;
        if (this.newSetTimeOutflg === -1) {
          this.newSetTimeOutMsg = "";
          this.newSetTimeOutflg=  60;
          this.newDisabled = false;
          window.clearInterval(this.newIntervalID);
        }
      }, 1000);
    } else {
      xutil.toastWarn(`失败:${this.selfInfo.msg}`);
    }
  }
  toHome() {
    this.$router.push({name:"/selfInfo", path: "/selfInfo",query: { path: this.path } });
  }
}
</script>
