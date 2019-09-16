<template>
<div>
  <agentTaxSetting></agentTaxSetting>
<div id='dashboard' class="dashboard-outer">
    <el-card class="dashboard-second" style="width:55%;">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理结算、兑换配置">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">代理结算、兑换配置</span>
      </el-col>
      <el-button type="primary" @click="updateData" style="margin:10px 0 0 10px">保存</el-button>
      <el-button type="primary" @click="loadData" style="margin:10px">刷新</el-button>
      <div class="box" style="padding:0 65px;display:flex;">
        <div>
          <span style=" margin:10px 10px 10px 20px">代理银行卡兑换开关</span>
          <el-checkbox v-model="agencyBankSettleSwitch" style="width:120px; margin:10px 10px"></el-checkbox>
          <br>
          <span style=" margin:10px 10px 10px 20px">银行卡最小兑换金额</span>
          <el-input v-model="bankCardMinMoney" style="width:120px; margin:10px 10px"></el-input>
          <br>
          <span style=" margin:10px 10px 10px 20px">银行卡最大兑换金额</span>
          <el-input v-model="bankCardMaxMoney" style="width:120px; margin:10px 10px"></el-input>
          <br>
        </div>
        <div>
          <span style=" margin:10px 10px 10px 20px">代理支付宝兑换开关</span>
          <el-checkbox v-model="agencyAliSettleSwitch" style="width:120px; margin:10px 10px"></el-checkbox>
          <br>
          <span style=" margin:10px 10px 10px 20px">支付宝最小兑换金额</span>
          <el-input v-model="aliMinMoney" style="width:120px; margin:10px 10px"></el-input>
          <br>
          <span style=" margin:10px 10px 10px 20px">支付宝最大兑换金额</span>
          <el-input v-model="aliMaxMoney" style="width:120px; margin:10px 10px"></el-input>
          <br>
        </div>
      </div>
      <div>
        <span style=" margin:10px 10px 10px 150px">全面代理每日结算下级税收倍数</span>
        <el-input v-model="agencyTaxRateTime" style="width:120px; margin:10px 10px"></el-input>
        <br>
      </div>
    </el-card>
    <el-card class="dashboard-second" style="width:44%;">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="组员代理下级数量限制">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">组员代理下级数量限制</span>
      </el-col>
      <el-button type="primary" @click="updateChildNumber" style="margin:10px 0 0 10px">保存</el-button>
      <el-button type="primary" @click="getChildNumber" style="margin:10px">刷新</el-button>
      <br>
      <span style=" margin:10px 10px 10px 0">组员代理下级数量限制</span>
      <el-input v-model="limitNum" style="width:120px; margin:10px 10px"></el-input>
    </el-card>
  </div>
</div>
  
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn,myDispatch } from "../../utils/index";
import { AgencyCfgState } from "../../store/stateInterface";
import agentTaxSetting from "./agentTaxSetting.vue"
import {getAgencyChildNumber,updateAgencyChildNumber} from "../../api/admin/agentMgr/agentMgr";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components:{"agentTaxSetting":agentTaxSetting}
})
export default class AgencyCfg extends Vue {
  agencyCfgState: AgencyCfgState = this.$store.state.agencyCfg;

  agencyBankSettleSwitch: boolean = false;
  bankCardMinMoney: string = "";
  bankCardMaxMoney: string = "";
  agencyAliSettleSwitch: boolean = false;
  aliMinMoney: string = "";
  aliMaxMoney: string = "";
  agencyTaxRateTime: string = "";
  dialogDeleteAgencyVisible:boolean = false;
  pid = "A";
  pidList: any[] = [];
  timeLine:Date[]=[];
  limitNum: string = "";
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
    this.getChildNumber();
  }
  loadData() {
    myDispatch(this.$store, "GetAgencyCfg").then(() => {
      console.log(this.agencyCfgState);
      this.agencyBankSettleSwitch = this.agencyCfgState.data.agencyBankSettleSwitch;
      this.bankCardMinMoney = this.agencyCfgState.data.bankCardMinMoney;
      this.bankCardMaxMoney = this.agencyCfgState.data.bankCardMaxMoney;
      this.agencyAliSettleSwitch = this.agencyCfgState.data.agencyAliSettleSwitch;
      this.aliMinMoney = this.agencyCfgState.data.aliMinMoney;
      this.aliMaxMoney = this.agencyCfgState.data.aliMaxMoney;
      this.agencyTaxRateTime = this.agencyCfgState.data.agencyTaxRateTime;
    });
  }
  async getChildNumber(){
    let ret = await myAsyncFn(getAgencyChildNumber)
    if(ret.code===200){
      this.limitNum = ret.msg.agencyChildNumber
    }else{
      this.$message({
        type:'error',
        message:ret.err
      })
    }
  }
  async updateChildNumber(){
    if(!this.limitNum){
      this.$message({
        type:'error',
        message:"不能为空！"
      })
    }else{
      let ret = await myAsyncFn(updateAgencyChildNumber,{agencyChildNumber:this.limitNum})
      if(ret.code === 200){
        this.$message({
        type:'success',
        message:"修改成功！"
      })
      this.getChildNumber();
      }else{
        this.$message({
        type:'error',
        message:ret.err
      })
      }
    }
    
  }
  async updateData() {
    if (
      !this.bankCardMinMoney.trim() ||
      !this.bankCardMaxMoney.trim() ||
      !this.aliMinMoney.trim() ||
      !this.aliMaxMoney.trim() ||
      !this.agencyTaxRateTime.trim() 
    ) {
      this.$message({
        type: "error",
        message: "存在未输入项！"
      });
      return;
    }
    let data = {
      agencyBankSettleSwitch: this.agencyBankSettleSwitch,
      bankCardMinMoney: this.bankCardMinMoney,
      bankCardMaxMoney: this.bankCardMaxMoney,
      agencyAliSettleSwitch: this.agencyAliSettleSwitch,
      aliMinMoney: this.aliMinMoney,
      aliMaxMoney: this.aliMaxMoney,
      agencyTaxRateTime: this.agencyTaxRateTime,
    };
    await myDispatch(this.$store, "UpdateAgencyCfg", data ).then(() => {});
    if (this.agencyCfgState.code === 200) {
      this.$message({
        type: "success",
        message: "操作成功"
      });
      return;
    } else {
      this.$message({
        type: "error",
        message: `操作失败${this.agencyCfgState.msg}`
      });
      return;
    }
  }
  addAgency(){

  }
  deleteAgencyConfirm(){

  }
  deleteAgency(){
    this.dialogDeleteAgencyVisible = true;
  }
  deleteAgencyCancel(){
    this.dialogDeleteAgencyVisible = true;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
#dashboard{
  display: flex;
  justify-content: space-between;
}
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
