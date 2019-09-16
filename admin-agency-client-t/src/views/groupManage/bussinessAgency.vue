<template>
  <div class="content">
    <div class="formBox">
        <div class="formItem"><em>代理昵称：</em><input type="text" v-model="addAgentName"></div>
        <div class="formItem"><em>游戏ID：</em><input type="text" v-model="addAgentGameID"></div>
        <div class="formItem"><em>后台账号：</em><input type="text" v-model="addAgentAct"></div>
        <div class="formItem"><em>登录密码：</em><input type="text" v-model="addAgentPwd"></div>
        <div class="formItem"><em>备注信息：</em><input type="text" v-model="addInfo"></div>
        <group>
        <x-switch title="允许开设下级代理" class="switch" @switch-height="40" v-model="checked"></x-switch>
        </group>
        <cube-button class="btn" @click="onConfirm">添加代理</cube-button>
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
import { BigNumber } from "bignumber.js";
@Component
export default class BussinessAgency extends Vue {
  checked:boolean = true;
  toHome() {
    this.$router.push({ path: "/spromotionGUsers",name:"团队管理",params:{tab:"agencyList"} });
  }
  check(){
    this.checked = !this.checked;
  }
  addAgentVisible: boolean = false;
  agencyCode: number = 0;
  addAgentName: string = "";
  addAgentGameID: string = "";
  addAgentAct: string = "";
  addAgentPwd: string = "";
  addQQ: string = "";
  addWetch: string = "";
  addInfo: string = "";
  addRate: string = ""; //扣量比
  addAgencyId: number = 0;
  addSettlePwd: string = "";
  General: string = "全民代理";
   open: string = "";
  agencyType: string = "全民代理";
  Business: string = "商人代理";
  haveSonAgent: boolean = true;
  level: number = 0;
  isBusinessman: boolean = false;
  show: boolean = false;
  isGeneralRate: boolean = false;
  agencyList = this.$store.state.agentList;
  checkGameTax: boolean = true;
  levelRequrie1: boolean = true;
  onConfirm() {
    let myGameTax = JSON.parse(<any>sessionStorage.getItem("userInfo")).gameTax;
    this.checkGameTax = JSON.parse(<any>sessionStorage.getItem(
      "userInfo"
    )).setAgencyCheckGameTax;
    if (!this.addAgentGameID.trim()) {
      xutil.toastWarn("添加商人代理时,代理游戏ID必填");
      return;
    }
    if (
      !this.addAgentName.trim() ||
      !this.addAgentAct.trim() ||
      !this.addAgentPwd.trim() 
    ) {
      xutil.toastWarn("缺少必填项");
      return;
    }
    let tempData: any = {
      name: this.addAgentName,
      act: this.addAgentAct,
      pwd: this.addAgentPwd,
      allowSetAgency: this.checked,
    };
    tempData.type = "business";
    if (this.addAgentGameID && this.addAgentGameID.trim()) {
      tempData.gameUid = this.addAgentGameID;
    }
    if (this.addQQ && this.addQQ.trim()) {
      tempData.qq = this.addQQ;
    }
    if (this.addWetch && this.addWetch.trim()) {
      tempData.wx = this.addWetch;
    }
    if (this.addInfo && this.addInfo.trim()) {
      tempData.remarks = this.addInfo;
    }
    tempData.setAgencyCheckGameTax = true;
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regex.test(this.addAgentPwd)) {
      xutil.toastWarn("密码至少8位必须包含字母数字");
      return;
    }
    let numRegex = /^\d{11}$/;
    xutil.myDispatch(this.$store, "AddAgentNew", tempData).then(() => {
      if (this.agencyList.code === 200) {
        xutil.toastSuccess("添加成功!");
        this.addAgentVisible = false;
        // this.loadData();
        return;
      }
      xutil.toastWarn("添加失败!" + this.agencyList.msg);
    });
  }
  onCancel() {
    this.show = false;
    xutil.toastCancel("已取消！");
  }
  getAgencyType(value) {
    this.agencyType = value;
    if (value === this.General) {
      this.isBusinessman = false;
    } else if (value === this.Business) {
      this.isBusinessman = true;
    }
  }
  closed() {
    this.agencyCode = 0;
  }
  addAgency(){
    this.$router.push({ path: "/addAgency" });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.formBox{margin-top: 4vh;}
.switch{margin: 3vh 0;display: flex;justify-content: center;font-size: $size-s;height: 6vh;}
.content{min-height: 0;}
</style>
