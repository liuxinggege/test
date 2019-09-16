<template>
  <div class="content">
    <div align="left" class="myleft">
      <el-row align="center">
        <el-col :span="24">
          <span align="right">玩家ID:</span>
          <el-input type="number" v-model="searchUid" @blur="onblur" style="width:120px; margin:20px 10px"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="userInfo">搜索</el-button>
        </el-col>
      </el-row>
      <el-row align="center">
        <el-col :span="12">
          <span style="font-size:20px;">玩家昵称：{{this.name}}</span>
        </el-col>
        <el-col :span="12">
          <span style="font-size:20px;">ID:{{this.uid}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span style="font-size:20px;">现有金币：{{this.money}}</span>
        </el-col>
        <el-col :span="8">
          <span style="font-size:20px;">银行金币:{{this.bankMoney}}</span>
        </el-col>
      </el-row>
      <el-row align="center">
        <el-col :span="24">
          <span>上分金额:</span>
          <el-input v-model="RMB" style="width:120px; margin:20px 10px"></el-input>
          <br>
          <span>上分金币:</span>
          <el-input type="number" v-model="upMoney" style="width:120px; margin:20px 10px" disabled="disabled"></el-input>
          <el-button class="mybutton" type="primary" @click="upPoint">确认上分</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script >
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";
import { UpPointModule } from "../../store/stateInterface";
var BigNumber = require("bignumber.js");
var util = require("../../utils/util");
// @Component 修饰符注明了此类为一个 Vue 组件
export default {
  data: function() {
    return {
      searchUid: "",
      RMB: 0,
      upMoney: 0,
      isTransfering: false,
      name: this.$store.state.upPoint.name,
      uid: this.$store.state.upPoint.uid,
      money: this.$store.state.upPoint.money,
      bankMoney: this.$store.state.upPoint.bankMoney
    };
  },
  computed: {
    agentMoney() {
      return !!sessionStorage.getItem("money")
        ? sessionStorage.getItem("money")
        : "无";
    }
  },
  methods: {
    userInfo() {
      if (!this.searchUid) {
        this.$message({ type: "error", message: "请输入查询条件!" });
        return;
      }
      // console.log(this.searchUid)
      let searchUid;
      if (!this.searchUid || this.searchUid == "" || this.searchUid == 0) {
        searchUid = 0;
      } else {
        searchUid = this.searchUid;
      }
      myDispatch(this.$store, "UserInfo", { uid: parseInt(searchUid) })
        .then(result => {
          switch (result.code) {
            case 200: {
              this.BusinessInfo = result.msg;
              break;
            }
            case 500: {
              this.$message({ type: "error", message: "系统错误!" });
              break;
            }
            case 501: {
              this.$message({ type: "error", message: "用户不存在!" });
              break;
            }
            case 400: {
              this.$message({ type: "error", message: "参数错误!" });
              break;
            }
            case 2000: {
              this.$message({ type: "error", message: "玩家不存在!" });
              break;
            }
            default: {
              this.$message({ type: "error", message: result.err });
              break;
            }
          }
          this.name = this.$store.state.upPoint.name;
          this.uid = this.$store.state.upPoint.uid;
          this.money = this.$store.state.upPoint.money;
          this.bankMoney = this.$store.state.upPoint.bankMoney;
        })
        .catch(() => {
          this.$message({ type: "error", message: "连接服务器错误!" });
          this.name = this.$store.state.upPoint.name;
          this.uid = this.$store.state.upPoint.uid;
          this.money = this.$store.state.upPoint.money;
          this.bankMoney = this.$store.state.upPoint.bankMoney;
          return;
        });
    },
    async upPoint() {
      let upMoney = this.upMoney;
      let RMB = this.RMB;
      let uid = this.$store.state.upPoint.uid;
      let name = this.$store.state.upPoint.name;
      if (this.isTransfering) {
        this.$message({ type: "error", message: "正在上分中，请稍候。。。" });
        return;
      }
      // await myDispatch(this.$store, "GetRegistrantInfo");
      // if (this.agentMoney < this.upMoney) {
      //   this.$message.error("商户金额不足，请尽快充值拿货！");
      //   return;
      // }
      if (!uid || !name) {
        this.$message({ type: "error", message: "请搜索用户." });
        return;
      }
      if (uid == sessionStorage.getItem("uid")) {
        this.$message({ type: "error", message: "不能给自己转账" });
        return;
      }
      if (
        util.notPositiveStringNumber(RMB) ||
        util.notPositiveStringNumber(upMoney)
      ) {
        this.$message({ type: "error", message: "上分必须输入正整数" });
        return;
      }
      if (isNaN(parseInt(RMB)) || parseInt(RMB) < 10) {
        this.$message({ type: "error", message: "最小10元" });
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [
          h("span", null, "确认上分?，你正在为ID："),
          h(
            "span",
            { style: "color: black;font-size:35px" },
            `${uid}(${name})`
          ),
          h("span", null, "充值"),
          h("span", { style: "color: red;font-size:35px" }, `${upMoney}`),
          h("span", null, "金币")
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (!upMoney) {
          this.$message({ type: "error", message: "请输入玩家金币" });
          return;
        }
        if (!uid) {
          this.$message({ type: "error", message: "请搜索用户" });
          return;
        }
        if (isNaN(parseInt(RMB)) || parseInt(RMB) < 10) {
          this.upMoney = "";
          this.RMB = "";
          this.$message({ type: "error", message: "最小10元" });
          return;
        }
        this.isTransfering = true;
        myDispatch(this.$store, "UpPoint", {
          money: upMoney,
          amount: RMB,
          destUid: uid
        }).then(res => {
          this.isTransfering = false;
          this.searchUid = "";
          this.upMoney = "";
          this.RMB = "";
          switch (res.code) {
            case 200:
              {
                myDispatch(this.$store, "GetRegistrantInfo")
                  .then(res => {
                    if (res.code == 200) {
                      this.$message({ type: "success", message: "操作成功!" });
                      return;
                    } else {
                      this.$message({ type: "error", message: res.err });
                      return;
                    }
                    if (res.code == 500) {
                      this.$message({ type: "error", message: "操作失败!" });
                      return;
                    }
                  })
                  .catch(() => {
                    this.$message({ type: "error", message: "操作失败!" });
                    return;
                  });
              }
              break;
            case (2100, 2101):
              {
                this.$message({ type: "error", message: res.err });
              }
              break;
            case 3007:
              {
                this.$message({ type: "error", message: "银币太多" });
              }
              break;
            case 6003:
              {
                this.$message({ type: "error", message: "参数错误" });
              }
              break;
            case 6004:
              {
                this.$message({ type: "error", message: "余额不足" });
              }
              break;
            case 6005:
              {
                this.$message({ type: "error", message: "安全密码错误" });
              }
              break;
            case 6006:
              {
                this.$message({ type: "error", message: "金额太少" });
              }
              break;
            case 6007:
              {
                this.$message({ type: "error", message: "对方不存在" });
              }
              break;
            case 6008:
              {
                this.$message({
                  type: "error",
                  message: "该账号不是VIP，普通用户只能转给VIP号"
                });
              }
              break;
            case 6009:
              {
                this.$message({ type: "error", message: "对方不是正式账号" });
              }
              break;
            case 400:
              {
                this.$message({ type: "error", message: "参数错误" });
              }
              break;
            default: {
              this.$message({ type: "error", message: res.err });
              break;
            }
          }
        });
      });
    },
    onblur() {
      this.userInfo();
    }
  },
  watch: {
    //比例设置
    RMB: function(newValue, oldVal) {
      if (util.notPositiveStringNumber(newValue)) {
        return;
      } else {
        let x = new BigNumber(newValue);
        let y = new BigNumber(sessionStorage.getItem("rate") || 1);
        this.upMoney = (x || 0).times(y).toString();
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.myleft {
  position: relative;
}
.myleft2 {
  position: relative;
  left: 24%;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #fff;
  min-height: 100vh;
  margin-top: -50px;
  padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
