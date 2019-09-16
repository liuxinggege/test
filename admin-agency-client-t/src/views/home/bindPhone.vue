<template>
    <div class="content settings">
        <div class="header">
            <div @click="toHome" class="back"></div>
            <div class="text">绑定手机号</div>
        </div>
        <div class="hint">请输入你需要绑定的手机信息</div>
        <div class="formBox">
            <div class="formItem"><em>手机号：</em><input v-model="phone" type="text" placeholder="请输入手机号"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="reg" placeholder="输入验证码">
              <cube-button class="lineBtn" @click="getOldPhoneReg" :disabled="oldDisabled">
                <span v-if="!oldDisabled">获取验证码</span><span v-if="oldDisabled">{{oldSetTimeOutMsg}}</span>
              </cube-button>
            </div>
            <cube-button class="btn" @click="updatePhone">提交</cube-button>
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
export default class BindPhone extends Vue {
  reg: string = "";
  oldSetTimeOutMsg: string = "";
  oldSetTimeOutflg: number = 60;
  oldDisabled: boolean = false;
  phone: string = "";
  oldIntervalID: number;
  selfInfo: SelfInfoState = this.$store.state.selfInfo; //表单数据
  created() {
  }
  confirmUpdatePhone() {
    if(!this.phone){
      xutil.toastWarn("请填写手机号");
      return;
    }
    if (!this.reg) {
      xutil.toastWarn("请填写手机接受的验证码");
      return;
    }
    xutil.confirm("确认绑定手机?", this.updatePhone);
  }
  async updatePhone() {
    let tmp = {
      phone: this.phone,
      reg: this.reg,
    };
    await xutil.myDispatch(this.$store, "BindPhone", tmp);
    if (this.selfInfo.code === 200) {
      this.selfInfo = this.$store.state.selfInfo; //表单数据
      xutil.sessionStorageSetItem("userInfo", this.selfInfo.selfInfo); 
      window.clearInterval(this.oldIntervalID);
      this.$router.push({name:"/home", path: "/home", params: {firstBind:"true" }});
    } else {
      xutil.toastWarn(`绑定失败!${this.selfInfo.msg}`);
    }
  }
  async getOldPhoneReg() {
    if(!this.phone){
      xutil.toastWarn("请填写手机号");
      return;
    }
    await xutil.myDispatch(this.$store, "GetNewPhoneReg", {newPhone:this.phone});
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
  toHome() {
    this.$router.push({ path: "/home" });
  }
}
</script>
