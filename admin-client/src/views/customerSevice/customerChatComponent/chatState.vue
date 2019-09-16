<template>
  <div class="chat-state">
    <div class="state-msg">
      <p>
        <span>今日总接单数：{{info.totalNum}}</span>
        <span>今日总差评数：{{info.badNum}}</span>
      </p>
      <p>
        <span>今日总好评数：{{info.goodNum}}</span>
        <span>未评价服务数：{{info.totalNum-info.goodNum-info.badNum}}</span>
      </p>
      <p style="display:flxe;">
        <!-- <span>当前在线客服：{{info.goodNum}}</span> -->
        <button @click="loadInfo">刷新数据</button>
      </p>
      <el-button style="margin-left:20px;" type="success" @click="showOnline">客服列表</el-button>
      <p>
        当前状态：
        <span style="color:green" v-if="state==1">接单</span>
        <span style="color:red" v-else>休息</span>
      </p>
    </div>
    <div class="state-btn">
      <el-radio style="background-color:#fff" @change="changeChatState" v-model="state" :label="1" border>接单</el-radio>
      <el-radio style="background-color:#fff" @change="changeChatState" v-model="state" :label="2" border>休息</el-radio>
      <el-button class="fastChat-item" type="primary" @click="reLoad">刷新重连</el-button>
    </div>
    <el-dialog title="客服列表" width="40%" :visible.sync="isShowOnlineCS">
      <el-table border highlight-current-row width="100%" :data="onLineCSList">
        <el-table-column property="name" align="center" label="客服" min-width="100"></el-table-column>
        <el-table-column property="vip" align="center" label="客服类型" min-width="100" :formatter="vipFormat"></el-table-column>
        <el-table-column property="state" align="center" label="状态" min-width="100" :formatter="CSStateFormat"></el-table-column>
        <el-table-column property="gUsers" align="center" label="接待人数" min-width="100"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Loading } from "element-ui";
import { Prop, Emit } from "vue-property-decorator";
import { myAsyncFn } from "../../../utils/index.js";
import { todayInfo } from "../../../api/admin/customerService/customerService";
import socket from "../../../utils/newSocket";
import { pomelo } from "../../../../static/pomelo/index";
import { changeState, getcsList } from "../../../api/admin/webSocket";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ChatState extends Vue {
  state: number = 2;
  mysocket: any = null;
  info: any = {};
  onLineCSList: any[] = [];
  isShowOnlineCS: boolean = false;
  isOnline: boolean = false;
  created() {
    this.loadInfo();
    this.loginChat();
    this.onLost();
  }
  async loadInfo() {
    let ret = await myAsyncFn(todayInfo, {}, true);
    if (ret.code === 200) {
      this.info = ret.msg;
    }
  }
  async loginChat() {
    this.mysocket = new socket();
    await this.mysocket.connect();
    this.isOnline = true; //建立连接
  }
  async changeChatState(e) {
    let ret: any = await changeState({ state: e });
    if (ret.code == 200 && e === 1) {
      this.$message({
        type: "success",
        message: "开始接单"
      });
    } else if (ret.code == 200 && e === 2) {
      this.$message({
        type: "success",
        message: "休息中。。。"
      });
    } else {
      this.state = e === 1 ? 2 : 1;
      this.$message({
        type: "error",
        message: "状态切换失败，请重试"
      });
    }
  }
  onLost() {
    pomelo.on("disconnect", res => {
      this.state = 2;
      this.isOnline = false;
      sessionStorage.setItem("isOline", "false");
      this.$confirm("你已断线,请重新连接", "提示", {
        confirmButtonText: "重新连接",
        type: "warning"
      })
        .then(() => {
          this.loginChat();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    });
  }
  async showOnline() {
    let ret: any = await getcsList({});
    if (ret.code === 200) {
      this.onLineCSList = ret.csList;
      this.isShowOnlineCS = true;
    }
  }
  reLoad() {
    if (this.isOnline) {
      this.$message({
        type: "warning",
        message: "当前连接正常"
      });
      return;
    }
    this.loginChat();
    this.state = 2;
  }
  vipFormat(row) {
    if (row.vip !== undefined) {
      return row.vip == 1 ? "VIP客服" : "普通客服";
    }
    return "";
  }
  CSStateFormat(row) {
    if (row.state !== undefined) {
      return row.state == 1 ? "接单" : "休息";
    }
    return "";
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.chat-state {
  width: 380px;
  height: 300px;
  border-radius: 10px;
  // background-color: rgb(218, 218, 218);
  background-color: rgb(255, 255, 255);
  padding: 15px;
  border: 1px solid gray;
}
.state-msg {
  p {
    margin-left: 20px;
    margin-bottom: 20px;
    span {
      display: inline-block;
      width: 150px;
      margin-right: 10px;
    }
  }
}
.state-btn {
  margin-top: 25px;
  display: flex;
  width: 100%;
  justify-content: space-around;
}
</style>
