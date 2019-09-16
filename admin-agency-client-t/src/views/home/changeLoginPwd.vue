<template>
    <div class="content settings">
        <div class="header">
            <div @click="toHome" class="back"></div>
            <div class="text">修改登录密码</div>
        </div>
        <div class="hint">请输入你需要修改的登录密码</div>
        <div class="formBox">
            <div class="formItem"><em>新密码：</em><input placeholder="请输入新登录密码" v-model="newPwd" type="password" autocomplete="off"></div>
            <div class="formItem"><em>确认密码：</em><input placeholder="请确认新登录密码" v-model="confirmPwd" type="password" autocomplete="off"></div>
            <div class="formItem item3">
              <em>验证码：</em>
              <input type="text" v-model="reg">
              <cube-button class="lineBtn" @click="getReg" :disabled="disabled">
                <span v-if="!disabled">获取验证码</span><span v-if="disabled">{{setTimeOutMsg}}</span>
              </cube-button>
            </div>
            <cube-button class="btn" @click="confirmUpdatePwd">提交</cube-button>
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
export default class SelfInfo extends Vue {


  newPwd: string = "";
  oldPwd: string = "";
  confirmPwd: string = "";
  selfInfo: SelfInfoState = this.$store.state.selfInfo; //表单数据
  parentInfo = this.selfInfo.parentInfo;
  info = JSON.parse(<any>sessionStorage.getItem("userInfo"));

  reg: string = "";
  setTimeOutMsg: string = "";
  setTimeOutflg: number = 60;
  disabled: boolean = false;
  intervalID: number;
  path: string = "";
  created() {  
    this.path = this.$route.query.path;
  }

  confirmUpdatePwd() {
    if(!this.confirmPwd||!this.newPwd||!this.reg){
      xutil.toastWarn('输入信息不完全');
      return;
    }
    if(this.confirmPwd!==this.newPwd){
      xutil.toastWarn(`2次输入密码不一致`);
      return;
    }
    xutil.confirm("确认修改密码?", this.updatePwd);
  }
  async updatePwd() {
    let tmp = {
      reg:this.reg,
      newPwd: this.newPwd,
      confirmPwd: this.confirmPwd,
    };
    await xutil.myDispatch(this.$store, "UpdateSelfLoginPwd", tmp);
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("修改成功!");
      xutil.sessionStorageSetItem("userInfo", this.selfInfo.selfInfo); 
    } else {
      xutil.toastWarn(`修改失败:${this.selfInfo.msg}`);
    }
  }

  toHome() {
    this.$router.push({name:"/selfInfo", path: "/selfInfo",query: { path: this.path } });
  }
  async getReg() {
    await xutil.myDispatch(this.$store, "GetSelfPhoneReg", {});
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      this.intervalID = window.setInterval(() => {
        this.disabled = true;
        this.setTimeOutMsg = ""+ this.setTimeOutflg;
        this.setTimeOutflg--;
        if (this.setTimeOutflg === -1) {
          this.setTimeOutMsg = "";
           this.setTimeOutflg=  60;
          this.disabled = false;
          window.clearInterval(this.intervalID);
        }
      }, 1000);
    } else {
      xutil.toastWarn(`失败:${this.selfInfo.msg}`);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
