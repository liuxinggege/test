<template>
  <div>
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="全局配置"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>全局配置</b>
      </span>
      <span style="position:absolute; right:0; top:1">
        <el-button type="primary" style="margin:0 10px 10px 0" @click="getSubGlobalConfig">读取</el-button>
        <el-button type="primary" style="margin:0 100px 10px 0" @click="saveSubGlobalConfig">保存</el-button>
      </span>
      <div style="margin:10px 0px 10px 0px">
        <div>
          <el-checkbox type="text" style="width:150px; font-size:12pt; margin:0px 0px 0px 150px" class="checkbox" id="matchIp" label="显示公告板" border v-model="subGlobalConfig.showBillboard"></el-checkbox>
          <el-checkbox type="text" style="width:150px; font-size:12pt; margin:0px 0px 0px 150px" class="checkbox" id="matchIp" label="支付渠道紧张" border v-model="subGlobalConfig.tempSwitch"></el-checkbox>
          <el-checkbox type="text" style="width:150px; font-size:12pt; margin:0px 0px 0px 150px" class="checkbox" id="matchIp" label="天御防刷开关" border v-model="subGlobalConfig.checkRegister"></el-checkbox>
          <el-checkbox type="text" style="width:150px; font-size:12pt; margin:0px 0px 0px 150px" class="checkbox" id="matchIp" label="禁止ip登陆开关" border v-model="subGlobalConfig.banIpActive"></el-checkbox>
        </div>
        <div>
          <span style="font-size:12pt; margin:1px 10px 0px 20px">匹配玩家金币浮动</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.matchMoneyUpDownRate"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 20px">支付宝银行卡最大绑定数</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.bindAliBankMaxCount"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:1px 10px 0px 5px">用户创建好友房最小间隔(秒)</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.createRoomInterval"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 20px">转账记录条数</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.transferPageRecordCount"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 20px">不匹配机器人的充值额(元)</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.minBillCanNotMatchRobot"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:1px 10px 0px 125px">强制换桌数</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.forceChangeRoom"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 20px">绑定超时时间（单位：秒）：</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.bindTimeout"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:1px 10px 0px 115px">天御secretId</span>
          <el-input type="text" style="width:340px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.secretId"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 7px">天御secretKey</span>
          <el-input type="text" style="width:340px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.secretKey"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:1px 10px 0px 125px">支付宝每天兑换限制</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.withdrawAliLimit"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 52px">支付宝兑换次数限制</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.withdrawAliTimesLimit"></el-input>
          <span style="font-size:12pt; margin:1px 10px 0px 52px">天域封号恶意等级(1~4)</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.riskLevel"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:1px 10px 0px 125px">显示代理按钮天数限制</span>
          <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" @change="valueChange" v-model="subGlobalConfig.agentShowLimitDay"></el-input>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top:20px;">
      <el-form label-width="150px" label-position="left" :inline="true" class="demo-form-inline">
        <el-form-item label="后台短信平台配置">
          <el-radio v-model="smsActive" label="yunPian">云片</el-radio>
          <el-radio v-model="smsActive" label="huYi">互亿</el-radio>
          <el-radio v-model="smsActive" disabled label="yunZhiXun">云之讯</el-radio>
        </el-form-item>
        <el-form-item label="  ">
          <el-button type="primary" @click="saveSmsconfig">保存</el-button>
          <el-button type="success" @click="getSmsconfig">读取</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px;">
      <el-button type="primary" @click="noticeGameServer">游戏服短信修改通知</el-button>
    </el-card>
    <el-card class="dashboard-second">
      <div class="business">
        <h3>商人配置</h3>
        <el-form>
          <el-form-item>
            <el-button type="primary" @click="getBusinessConfig">读取</el-button>
            <el-button type="primary" @click="postBusinessConfig">修改</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="商人匹配最低金额">
            <el-input type="number" v-model="businessConfig.lowMoney"></el-input>
          </el-form-item>
          <el-form-item label="商人匹配最大值">
            <el-input type="number" v-model="businessConfig.maxOrders"></el-input>
          </el-form-item>
          <el-form-item label="商人未回复玩家消息时长">
            <el-input type="number" v-model="businessConfig.agentTimeOutReplyTimeLimit"></el-input>
          </el-form-item>
          <span style="line-height:36px;margin-left:-5px;">秒</span>
          <el-form-item label="频繁充值限制">
            <el-input type="number" style="display:inline-block;" v-model="businessConfig.chatTimeLimit"></el-input>
          </el-form-item>
          <span style="line-height:36px;margin-left:-5px;">秒</span>
          <br>
          <el-form-item label="关键词">
            <el-input type="textarea" :rows="3" placeholder="多个关键词用英文逗号隔开" style="width:600px" v-model="businessConfig.keyWords"></el-input>
          </el-form-item>
          <!-- <h5>权重分值</h5>
          <el-form-item label="举报">
            <el-input type="number" v-model="businessConfig.complaintPoint"></el-input>
          </el-form-item>
          <el-form-item label="追分">
            <el-input type="number" v-model="businessConfig.chasingPoint"></el-input>
          </el-form-item>
          <el-form-item label="差评">
            <el-input type="number" v-model="businessConfig.badReviewPoint"></el-input>
          </el-form-item>
          <el-form-item label="好评">
            <el-input type="number" v-model="businessConfig.goodReviewPoint"></el-input>
          </el-form-item>
          <el-form-item label="接单数">
            <el-input type="number" v-model="businessConfig.orderPoint"></el-input>
          </el-form-item>-->
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SubGlobalConfig } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js";
import {
  getSmsSwitch,
  postSmsSwitch,
  smsAdvice
} from "@/api/admin/gameSetting/gameSetting";
//subGlobalConfig

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class subGlobalConfig extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
    this.getBusinessConfig();
    this.getSmsconfig();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  subGlobalConfig: SubGlobalConfig = this.$store.state.subGlobalConfig; //表单数据
  businessConfig = {
    lowMoney: "",
    maxOrders: "",
    chatTimeLimit: undefined,
    complaintPoint: "",
    chasingPoint: "",
    badReviewPoint: "",
    goodReviewPoint: "",
    orderPoint: ""
  };
  smsActive = "";
  smsArr = [
    { value: "yunPian", label: "云片" },
    { value: "huYi", label: "互亿" },
    { value: "yunZhixun", label: "云之讯" }
  ];
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetSubGlobalConfig", {}, true).then(() => {
      if (this.subGlobalConfig.showBillboard == 1) {
        this.subGlobalConfig.showBillboard = true;
      } else {
        this.subGlobalConfig.showBillboard = false;
      }
    });
    // this.$store.dispatch("GetSubGlobalConfig");
  }
  saveSmsconfig() {
    let query = {
      active: this.smsActive
    };
    postSmsSwitch(query).then(res => {
      this.$message.success("修改成功");
    });
  }
  getSmsconfig() {
    getSmsSwitch().then(res => {
      this.smsActive = res.data.msg.active;
    });
  }
  getSubGlobalConfig() {
    this.loadData();
  }
  noticeGameServer() {
    this.$confirm("确认通知游戏服短信平台配置更改?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        smsAdvice()
          .then(res => {
            if (200 === res.data.code) {
              this.$message({
                type: "success",
                message: "ok!"
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.code
              });
            }
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err.err
            });
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  saveSubGlobalConfig() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
    if (this.subGlobalConfig.showBillboard) {
      this.subGlobalConfig.showBillboard = 1;
    } else {
      this.subGlobalConfig.showBillboard = 0;
    }
    myDispatch(this.$store, "UpdateSubGlobalConfig", this.subGlobalConfig)
      // this.$store
      //   .dispatch("UpdateSubGlobalConfig", this.subGlobalConfig)
      .then(() => {
        if (this.subGlobalConfig.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.loadData();
          return;
        } else {
          this.$message({
            type: "error",
            message: "保存失败!"
          });
          return;
        }
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: err
        });
        return;
      });
  }
  valueChange(value) {
    if (value === undefined || value === null || !value.trim()) {
      this.checkNullFlag = false;
    } else {
      this.checkNullFlag = true;
    }
  }
  inputvalit(value) {
    if (value <= 20 && value >= 2) {
      return;
    } else {
      // this.subGlobalConfig.minUserCount = 2;
      // this.subGlobalConfig.maxUserCount = 20;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(2~20)!"
      });
    }
  }
  getBusinessConfig() {
    myDispatch(this.$store, "GetChatConfig", {}, true).then(res => {
      if (res) {
        this.businessConfig = res;
      }
    });
  }
  async postBusinessConfig() {
    for (let key in this.businessConfig) {
      if (this.businessConfig[key] != "") {
        this.businessConfig[key] = this.businessConfig[key];
      }
    }
    let res = await myDispatch(
      this.$store,
      "PostChatConfig",
      this.businessConfig
    );
    console.log(res);

    if (res.code === 200) {
      this.$message.success("修改成功");
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
