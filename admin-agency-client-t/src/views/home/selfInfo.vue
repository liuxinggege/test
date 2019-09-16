<template>
  <div class="content">
    <div class="back" @click="toHome"></div>
    <div class="wrapper">
      <dl class="main">
        <dt><img src="~resources/images/userphoto.png" alt=""></dt>
        <dd class="name">{{data.name}}</dd>
        <dd class="words">
          <li>代理id：{{data.agencyId}}</li>
          <li>分成比例：{{data.taxRate}}</li>
          <li>渠道号：{{data.channel||"-"}}</li>
        </dd>
        <dd class="btnBox">
          <cube-button class="btn" @click="toChangeLoginPwd">修改登录密码</cube-button>
          <cube-button class="btn" @click="toChangeSettlePwd">修改结算密码</cube-button>
        </dd>
      </dl>
      <div class="formBox">
        <div class="infoItem">
          <div class="title">微信:</div>
          <div class="value"><input type="text" v-model="wx"></div>
          <div class="edit" @click="updateWx">编辑</div>
        </div>
        <div class="infoItem">
          <div class="title">QQ:</div>
          <div class="value"><input type="text" v-model="qq"></div>
          <div class="edit" @click="updateQQ">编辑</div>
        </div>
        <div class="infoItem" v-if="data.phone" @click="toChangePhone">
          <div class="title">绑定手机:</div>
          <div class="value">{{data.phone}}</div>
          <div class="edit">编辑</div>
        </div>
        <div class="infoItem info2" v-if="!data.phone" @click="toBindPhone">
          <div class="title">绑定手机</div>
          <div class="value"></div>
          <div class="edit">&nbsp;</div>
        </div>
        <div class="hint">用于接收短信验证码，以修改结算账号、密码等重要信息</div>
        <div class="infoItem info2" @click="toChangeAli">
          <div class="title">支付宝信息:</div>
          <div class="value">{{data.alipayAct}}</div>
          <div class="edit">修改</div>
        </div>
        <div class="infoItem info2" @click="toChangeUn">
          <div class="title">银行卡信息:</div>
          <div class="value">{{data.bankName}}</div>
          <div class="edit">修改</div>
        </div>
      </div>
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
// import selfInfo from "../../../../../../../Users/game/wind/web-agent-client/src/store/modules/selfInfo/selfInfo";

@Component
export default class SelfInfo extends Vue {
  //
  oldReg: string = "";
  newReg: string = "";
  oldSetTimeOutMsg: string = "";
  newSetTimeOutMsg: string = "";
  oldSetTimeOutflg: number = 60;
  newSetTimeOutflg: number = 60;
  oldDisabled: boolean = false;
  newDisabled: boolean = false;
  phone: string = "";

  oldIntervalID: number;
  newIntervalID: number;

  //
  act: string = "";
  wx: string = "";
  oldPhone: string = "";
  qq: string = "";
  pwd: string = "";
  settlePwd: string = "";
  selfInfo: SelfInfoState = this.$store.state.selfInfo; //表单数据
  data = this.$store.state.selfInfo.selfInfo;
  info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
  path: string = "";
  created() {
    this.path = this.$route.query.path;
    xutil.myDispatch(this.$store, "GetMyInfo", {}).then(() => {
      this.data = this.$store.state.selfInfo.selfInfo;
      console.log(this.data);
      this.act = <string>sessionStorage.getItem("name");
      this.wx = this.info.wx;
      this.oldPhone = this.info.phone;
      this.qq = this.info.qq;
      this.pwd = this.info.pwd;
      this.settlePwd = this.info.settlePwd;
      let parentId = this.info.parentId;
    });
  }
  confirmUpdatePhone() {
    xutil.confirm("确认修改绑定手机?", this.updatePhone);
  }
  async updatePhone() {
    if (!this.oldReg) {
      xutil.toastWarn("请填写原手机接受的验证码");
      return;
    }
    if (!this.newReg) {
      xutil.toastWarn("请填写新手机接收的验证码");
      return;
    }
    let tmp = {
      phone: this.phone,
      oldPhone: this.oldPhone,
      oldReg: this.oldReg,
      newReg: this.newReg
    };
    await xutil.myDispatch(this.$store, "UpdateSelfPhone", tmp);
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("修改成功!");
      xutil.sessionStorageSetItem("userInfo", this.selfInfo.selfInfo); //将用户数据存放入sessionStorage
      this.act = <string>sessionStorage.getItem("name");
      let info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
      this.oldPhone = info.phone;
      this.phone = "";
      this.oldReg = "";
      this.newReg = "";
      this.oldSetTimeOutMsg = "";
      this.newSetTimeOutMsg = "";
      this.oldSetTimeOutflg = 60;
      this.newSetTimeOutflg = 60;
      this.oldDisabled = false;
      this.newDisabled = false;
      window.clearInterval(this.oldIntervalID);
      window.clearInterval(this.newIntervalID);
    } else {
      xutil.toastWarn(`修改失败!${this.selfInfo.msg}`);
    }
  }
  toHome() {
    this.$router.push({ name: this.path, path: this.path });
  }
  toChangeLoginPwd(title: string) {
    this.$router.push({
      name: "changeLoginPwd",
      path: "/changeLoginPwd",
      query: { path: this.path }
    });
  }
  toChangeSettlePwd(title: string) {
    this.$router.push({
      name: "changeSettlePwd",
      path: "/changeSettlePwd",
      query: { path: this.path }
    });
  }
  toChangeAli(title: string) {
    this.$router.push({
      name: "changeAli",
      path: "/changeAli",
      query: { path: this.path }
    });
  }
  toChangeUn(title: string) {
    this.$router.push({
      name: "changeUn",
      path: "/changeUn",
      query: { path: this.path }
    });
  }
  toChangePhone(title: string) {
    this.$router.push({
      name: "changePhone",
      path: "/changePhone",
      query: { path: this.path }
    });
  }
  toBindPhone(){
    this.$router.push({
      name: "bindPhone",
      path: "/bindPhone",
      query: { path: this.path }
    });
  }
  async getOldPhoneReg() {
    await xutil.myDispatch(this.$store, "GetOldPhoneReg", {});
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      this.oldIntervalID = window.setInterval(() => {
        this.oldDisabled = true;
        this.oldSetTimeOutMsg = "" + this.oldSetTimeOutflg;
        this.oldSetTimeOutflg--;
        if (this.oldSetTimeOutflg === -1) {
          this.oldSetTimeOutMsg = "";
          this.oldSetTimeOutflg = 60;
          this.oldDisabled = false;
          window.clearInterval(this.oldIntervalID);
        }
      }, 1000);
    } else {
      xutil.toastWarn(`失败:${this.selfInfo.msg}`);
    }
  }
  async getNewPhoneReg() {
    await xutil.myDispatch(this.$store, "GetNewPhoneReg", {
      newPhone: this.phone
    });
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("成功!");
      this.newIntervalID = window.setInterval(() => {
        this.newDisabled = true;
        this.newSetTimeOutMsg = "" + this.oldSetTimeOutflg;
        this.newSetTimeOutflg--;
        if (this.newSetTimeOutflg === -1) {
          this.newSetTimeOutMsg = "";
          this.newSetTimeOutflg = 60;
          this.newDisabled = false;
          window.clearInterval(this.newIntervalID);
        }
      }, 1000);
    } else {
      xutil.toastWarn(`失败:${this.selfInfo.msg}`);
    }
  }
  async updateWx() {
    if (!this.wx) {
      xutil.toastWarn(`请输入微信`);
      return;
    }
    let info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
    let wx = info.wx;
    if (this.wx === wx) {
      xutil.toastWarn(`请输入不同的微信`);
      return;
    }
    var regex1 = /\u4e00-\u9fa5/;
    let ret = new RegExp(/[\u4E00-\u9FA5\uF900-\uFA2D]/);
    if (ret.test(this.wx)) {
      xutil.toastWarn(`请输入正确的微信号！`);
      return;
    }
    await xutil.myDispatch(this.$store, "UpdateSelfChat", {
      wx: this.wx,
      qq: this.qq
    });
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("修改成功!");
      xutil.sessionStorageSetItem("userInfo", this.selfInfo.selfInfo); //将用户数据存放入sessionStorage
      let info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
      this.wx = info.wx;
    } else {
      xutil.toastWarn(`修改失败!${this.selfInfo.msg}`);
    }
  }
  async updateQQ() {
    if (!this.qq) {
      xutil.toastWarn(`请输入QQ`);
      return;
    }
    let info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
    let qq = info.qq;
    if (this.qq === qq) {
      xutil.toastWarn(`请输入不同的QQ`);
      return;
    }
    let ret = new RegExp("\\D");
    if (ret.test(this.qq)) {
      xutil.toastWarn(`只能输入数字`);
      return;
    }
    await xutil.myDispatch(this.$store, "UpdateSelfChat", { qq: this.qq });
    if (this.selfInfo.code === 200) {
      xutil.toastSuccess("修改成功!");
      xutil.sessionStorageSetItem("userInfo", this.selfInfo.selfInfo); //将用户数据存放入sessionStorage
      let info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
      this.qq = info.qq;
    } else {
      xutil.toastWarn(`修改失败!${this.selfInfo.msg}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  position: relative;
  background: url(#{$imgUrl}home-bg.jpg) no-repeat center top;
  background-size: 100% auto;
  padding-bottom: 10vh;
}
.wrapper {
  width: 90vw;
  margin: 0 4vw 0 6vw;
}
.back {
  width: 12vw;
  height: 6vh;
  position: absolute;
  top: 4vh;
  left: 5vw;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADFwAAAxcBwpsE1QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADdSURBVGiB7di7zkFBGEbh2b9o/JFISCg0uAeV21VrFQ4NDQkKNBrcyFIYCeI4kv0xeZ92TybvKnYzzomIiIiIpAXIAx2gbb0lmI8YcTS13hMEKAIzH7ECytab3qaIb+Ej5j5iHUtExXrT22KJKMUSsYgpYgNUrTfdkjz6COSdcz3nXDOdOXeNkyRpPTrw9+SC7Atn0pD5+AagAEx++v84Af6BoY/ZAjXrTcFijBnEEpM7i9kBdetNwWKM6Z/FNKw3BbuK2SvmW3D5+LC03vMRH9MFhtZbRERERERuOgD33nZsf+WGIAAAAABJRU5ErkJggg==)
    no-repeat center center;
  background-size: 100%;
}
.main {
  padding: 13vh 0 0 0;
  margin-bottom: 6vh;
  dt {
    width: 20vw;
    height: 20vw;
    border-radius: 8px;
    img {
      border-radius: 8px;
      width: 100%;
      height: 100%;
      content: none;
    }
  }
  .name {
    height: 5vh;
    margin-top: 1vh;
    display: flex;
    align-items: center;
    font-size: $size-l;
    margin-bottom: 2vh;
    color: $titleColor;
    text-shadow: 0 0 3px #fff;
  }
  .words {
    display: flex;
    margin-bottom: 2vh;
    justify-content: space-between;
    color: $valueColor;
    margin-top: 3vh;
    li {
      font-size: $size-w * 0.9;
      color: #fff;
      text-shadow: 0 0 5px #333;
      flex: 1;
      text-align: left;
    }
  }
  .btnBox {
    display: flex;
    justify-content: space-between;
    .btn {
      width: 40vw;
      &:nth-child(2) {
        background: #fff;
        border: solid 2px $blue;
        color: $blue;
      }
    }
  }
}
.formBox {
  padding: 0;
  .infoItem {
    height: 8vh;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #e5e5e5;
    justify-content: space-between;
    .title {
      text-align: left;
      flex: 1;
      color: $titleColor;
    }
    .edit {
      display: block;
      flex: 1;
      color: $blue;
    }
    .value {
      text-align: left;
      flex: 4;
      color: $valueColor;
    }
    &:nth-child(3) {
      .title {
        flex: 1.5;
      }
    }
    input {
      color: $valueColor;
      background: none;
    }
    &.info2 {
      .title {
        flex: 3;
      }
      .value {
        flex: 5;
        color: $valueColor;
      }
      .edit {
        background: url(#{$imgUrl}arrow.png) no-repeat right center;
        background-size: 15%;
        padding-right: 2vw;
        color: $blue;
      }
    }
  }
  .hint {
    color: $orange;
    margin: 2vh 0 5vh 0;
    font-size: $size-w * 0.9;
  }
}
</style>
