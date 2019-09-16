<template>
  <div>
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="返利活动配置"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>返利活动配置</b>
      </span>
    </el-card>
    <el-card class="dashboard-second">
      <div>
        <el-form>
          <el-form-item>
            <el-button type="primary" @click="loadData">读取</el-button>
            <el-button type="primary" @click="updateData">修改</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="活动时间">
            <el-date-picker v-model="times" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:0px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="返利比率">
            <el-input type="number" v-model="rechargeRebateCfg.interest"></el-input>
          </el-form-item>
          <el-form-item label="返利最小充值金额">
            <el-input type="number" v-model="rechargeRebateCfg.minMoney"></el-input>
          </el-form-item>
          <el-form-item label="返利最小充值金额">
            <el-input type="number" v-model="rechargeRebateCfg.maxMoney"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="充值渠道">
            <el-checkbox-group v-model="rechargeRebateCfg.types">
              <el-checkbox label="chat">官方代充</el-checkbox>
              <el-checkbox label="yun_pay">云闪付</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <br>
          <el-form-item label="是否启用">
            <el-switch v-model="rechargeRebateCfg.active"></el-switch>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getRechargeRebate,
  updateRechargeRebate
} from "../../api/admin/activity/activityCfg";
//subGlobalConfig

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class subGlobalConfig extends Vue {
  // lifecycle hook
  created() {
    // this.loadData();
  }
  /*inital data*/
  times: any[] = [];
  curId: string = "";
  rechargeRebateCfg: any = {
    startDate: "",
    endDate: "",
    types: [],
    interest: 0,
    minMoney: 0,
    maxMoney: 0,
    active: false
  };
  /*method*/
  async loadData() {
    let ret = await myAsyncFn(getRechargeRebate);
    if (ret.code == 200 && ret.msg) {
      this.rechargeRebateCfg = ret.msg;
      this.curId = ret.msg._id;
      this.times = [ret.msg.startDate, ret.msg.endDate];
    }
  }

  async updateData() {
    if (this.times.length == 2) {
      this.rechargeRebateCfg.endDate = this.times[1];
      this.rechargeRebateCfg.startDate = this.times[0];
    } else {
      this.$message({
        type: "warning",
        message: "活动时间不能为空"
      });
      return;
    }
    for (let key in this.rechargeRebateCfg) {
      if (this.rechargeRebateCfg[key] !== "") {
        this.rechargeRebateCfg[key] = this.rechargeRebateCfg[key];
      } else {
        console.log(this.rechargeRebateCfg[key]);
        this.$message({
          type: "warning",
          message: "返利比率、返利最大最小充值金额不能为空！"
        });
        return;
      }
    }
    if (this.rechargeRebateCfg.types.length == 0) {
      this.$message({
        type: "warning",
        message: "充值渠道至少选择一项！"
      });
      return;
    }
    this.rechargeRebateCfg.id = this.curId;
    let ret = await myAsyncFn(updateRechargeRebate, this.rechargeRebateCfg);
    if (ret.code == 200) {
      this.$message.success("修改成功");
      this.loadData();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
    margin-top: 80px;
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
</style>
