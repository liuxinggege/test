<template>
  <div class="content">
    <div class="header">
      <div class="back" @click="toHome"></div>
      <div class="text">添加新代理</div>
    </div>
    <div v-if="levelRequrie1">
      <ul class="tabNav">
        <li v-for="(tab ,index) in tabs" :key="index" :class="{cur:iscur==index}" @click="iscur=index,tabChange(tab.tab)">{{tab.name}}</li>
      </ul>
      <keep-alive>
        <component v-bind:is="tabView"></component>
      </keep-alive>
    </div>
    <div class="formBox" v-if="!levelRequrie1">
      <div class="formItem">
        <em>代理昵称：</em>
        <input type="text" v-model="addAgentName">
      </div>
      <div class="formItem">
        <em>后台账号：</em>
        <input type="text" v-model="addAgentAct">
      </div>
      <div class="formItem">
        <em>登录密码：</em>
        <input type="text" v-model="addAgentPwd">
      </div>
      <div class="formItem" v-if="department=='two'&&level>=3">
        <em>税收分成：</em>
        <input type="number" :placeholder="'0-'+upTaxRate+'之间'" v-model="addTaxRate">
      </div>
      <div class="formItem">
        <em>备注信息：</em>
        <input type="text" v-model="addInfo">
      </div>
      <x-switch title="允许开设下级代理" class="switch" @switch-height="40" v-model="checked"></x-switch>
      <cube-button class="btn" @click="onConfirm">添加代理</cube-button>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { xutil } from "../../utils/xutil";
import { Toast } from "cube-ui";
import { utils } from "cfb/types";
import GeneralAgency from "./generalAgency.vue";
import BussinessAgency from "./bussinessAgency.vue";
import { BigNumber } from "bignumber.js";
@Component({
  components: {
    generalAgency: GeneralAgency,
    bussinessAgency: BussinessAgency
  }
})
export default class AddAgency extends Vue {
  checked: boolean = true;
  tabView: string = "generalAgency";
  tabs: any[] = [
    { name: "组员", tab: "generalAgency" },
    { name: "商人代理", tab: "bussinessAgency" }
  ];
  iscur: number = 0;
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
  addTaxRate: number;
  addSettlePwd: string = "";
  General: string = "全民代理";
  open: string = "";
  agencyType: string = "全民代理";
  Business: string = "商人代理";
  haveSonAgent: boolean = true;
  level: number = 0;
  type: string = "";
  myAllowSetAgency: boolean = false;
  isBusinessman: boolean = false;
  show: boolean = false;
  isGeneralRate: boolean = false;
  agencyList = this.$store.state.agentList;
  checkGameTax: boolean = true;
  levelRequrie1: boolean = false;
  setAgencyCheckGameTax: boolean = true;
  department = process.env.DEPART_MENT;
  upTaxRate:number;
  created() {
    this.level = JSON.parse(<any>sessionStorage.getItem("userInfo")).level; // 等级
    this.upTaxRate = JSON.parse(<any>sessionStorage.getItem("userInfo")).taxRate;
    console.log("", this.level);
    this.type = JSON.parse(<any>sessionStorage.getItem("userInfo")).type;
    this.myAllowSetAgency = JSON.parse(<any>(
      sessionStorage.getItem("userInfo")
    )).allowSetAgency;
    if (this.level === 1) {
      this.levelRequrie1 = true;
    }
    if (this.level >= 2) {
      this.isGeneralRate = true;
    }
    if (this.department == "two") {
      this.tabs.splice(1, 1);
    }
  }
  addAgentConfirm() {
    this.show = true;
  }
  toHome() {
    this.$router.push({
      path: "/spromotionGUsers",
      name: "团队管理",
      params: { tab: "agencyList" }
    });
  }
  check() {
    this.checked = !this.checked;
  }
  tabChange(tab) {
    this.tabView = tab;
  }
  onConfirm() {
    let myGameTax = JSON.parse(<any>sessionStorage.getItem("userInfo")).gameTax;
    this.checkGameTax = JSON.parse(<any>(
      sessionStorage.getItem("userInfo")
    )).setAgencyCheckGameTax;
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
      allowSetAgency: this.checked
    };
    if (this.department == "two" && this.level >= 3) {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (this.addTaxRate >= userInfo.taxRate) {
        xutil.toastWarn("下级分成不能大于本角色");
        return;
      }
      tempData.taxRate = this.addTaxRate.toString();
    }
    tempData.type = "general";
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
    let checkAliAct = act => {
      for (let v of act) {
        if (
          (v >= "a" && v <= "z") ||
          (v >= "A" && v <= "Z") ||
          (v >= "0" && v <= "9")
        ) {
          continue;
        }
        return false;
      }
      return true;
    };
    if (!checkAliAct(this.addAgentAct)) {
      xutil.toastWarn("账号只能是数字和字母且不能有空格");
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
  addAgency() {
    this.$router.push({ path: "/addAgency" });
  }
}
</script>

<style lang="scss" scoped>
.tabNav {
  height: 8vh;
  display: flex;
  align-items: center;
  li {
    flex: 1;
    font-size: $size-l;
    text-align: center;
  }
  li.cur {
    color: $blue;
  }
}
.switch {
  display: flex;
  justify-content: center;
  margin-bottom: 2vh;
}
.content {
  min-height: 0;
}
.formBox {
  margin-top: 5vh;
}
</style>
