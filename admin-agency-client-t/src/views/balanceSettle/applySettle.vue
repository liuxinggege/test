
<template>
  <div class="incontent">
    <div class="jine">可结算金额<em>{{this.balance}}</em></div>
    <div class="formLine">
        <em>结算金额</em>
        <input type="text" v-model="settleMoney" placeholder="单笔最小100起，最高49999元">
    </div>
    <div class="formLine">
        <em>结算方式</em>
        <div class="radioList">
            <cube-radio
                v-for="(option, index) in options"
                :key="index"
                :option="option"
                v-model="type">
                <div class="box">
                  <img v-if="index==0" src="~resources/images/ic_zfb.png" alt="">
                  <img v-else src="~resources/images/ic_yl.png" alt="">
                </div>
            </cube-radio>
        </div>
    </div>
    <div class="formLine">
        <em>结算密码</em>
        <input type="password" v-model="settlePwd" placeholder="默认密码a12345678" autocomplete="new-password">
    </div>
    <cube-button class="btn" @click="settleConfirm">提交结算</cube-button>
    
  </div>
</template>
 

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";

@Component
export default class ApplySettle extends Vue {
  settleMoney:string="";
  balance:string="";
  settlePwd:string="";
  type:string = "alipay";
  check:boolean = true;
  options= [
      {
      label: 'alipay',
      value: 'alipay',
      src: '~resources/images/ic_zfb.png',
      },
      {
      label: 'unionpay',
      value: 'unionpay',
      src: '~resources/images/ic_yl.png',
      }
  ]
  created() {
    this.loadUserInfo();
  }
  loadUserInfo() {
    xutil.myDispatch(this.$store, "GetUserInfo", {}).then(() => {
      this.balance = <string>this.$store.state.balanceAct.userInfo.balance;
    });
  }
  settleConfirm() {
    console.log(this.type);
    if (!this.settleMoney.trim()) {
      xutil.toastWarn("申请金额不能为空");
      return;
    }
    if (!this.type) {
      xutil.toastWarn("尚未选择结算方式");
      return;
    }
    if (!this.settlePwd.trim()) {
      xutil.toastWarn("结算密码不能为空");
      return;
    }
    console.log(this.settleMoney)
    if (
      parseInt(this.settleMoney) > parseInt(this.balance) ||
      parseInt(this.settleMoney) > 49999 ||
      parseInt(this.settleMoney) < 100
    ) {
      xutil.toastWarn("申请金额不合法");
    } else {
      xutil.confirm("确认提现,是否继续?", this.settleMent);
    }
  }
  async settleMent() {
    let createData = {
      payPwd: this.settlePwd,
      settleType: this.type,
      setMoney: this.settleMoney
    };
    await xutil.myDispatch(this.$store, "ComfirmSubmitBalance", createData);
    if (this.$store.state.submitBalance.code == 200) {
      xutil.toastSuccess("申请提现成功!");
      this.loadUserInfo();
      return;
    } else {
      xutil.toastWarn("申请提现失败!" + this.$store.state.submitBalance.msg);
      return;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.incontent{padding: 0 5vw;}
.jine{
    height: 6vh;font-size: $size-s;background: $color-l;@include middle;width: 100vw;margin: 0 -5vw;color:$valueColor;
    em{color: $red;font-size: $size-l;padding-left: 2vw;}
}
.formLine{
    display: flex;min-height: 8vh;align-items: center; margin-bottom: 3vh;
    &:nth-child(3){
        align-items: flex-start;
        em{padding-top: 4vh;}
    }
    em{flex: 1;font-size: $size-s;margin-right: 5vw;color: $titleColor;}
    input{flex: 3;border-bottom: $border;height: 8vh;color: $valueColor;}
    input::-ms-input-placeholder{font-size: $size-w;color:$valueColor*1.2;margin: 0 0 0 85px;} 
    input::-webkit-input-placeholder{font-size: $size-w;color:$valueColor*1.2;margin: 0 0 0 85px;}
    .radioList{
        flex: 3;
        .box{
          width:250px*1.2;height: 70px*1.2;overflow: hidden;
          img{width:250px*1.2+4;height: 70px*1.2+4;border: none;margin: -2px;content: none;}
        }
    }
}
</style>
