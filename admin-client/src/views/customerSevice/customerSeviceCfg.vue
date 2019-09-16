<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="客服信息配置"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">客服信息配置</span>
      </el-col>
      <div class="cfg-main">
        <div class="cfg-left">
          <div class="left-head">
            <h2>普通客服信息配置</h2>
            <el-button class="filter-item" type="primary" @click="update">保存</el-button>
            <el-button class="filter-item" type="primary" @click="loadData">刷新</el-button>
          </div>
          <div>
            <span>客服最大接待人数:</span>
            <el-input type="number" style="margin-bottom:10px;width:150px" v-model="seviceCfg.receptionMax"></el-input>
            <br>
            <span>客服统一显示昵称:</span>
            <el-input type="text" style="margin-bottom:10px;width:150px" v-model="seviceCfg.nickname"></el-input>
            <br>
            <span>客服服务超时配置:</span>
            <el-input type="number" style="margin-bottom:10px;width:150px" v-model="seviceCfg.timeout"></el-input>分钟
            <br>
            <span>客服断线超时配置:</span>
            <el-input type="number" style="margin-bottom:10px;width:150px" v-model="seviceCfg.brokenTimeout"></el-input>分钟
            <br>
            <p>客服服务宣言:</p>
            <el-input type="textarea" rows="3" style="width:320px" v-model="seviceCfg.declaration"></el-input>
            <br>
            <p>服务结束系统提示语:</p>
            <el-input type="textarea" rows="3" style="width:320px" v-model="seviceCfg.overPrompt"></el-input>
            <br>
            <p>服务超时系统提示语:</p>
            <el-input type="textarea" rows="3" style="width:320px" v-model="seviceCfg.brokenTimeoutPrompt"></el-input>
            <br>
            <p>服务断线系统提示语:</p>
            <el-input type="textarea" rows="3" style="width:320px" v-model="seviceCfg.brokenPrompt"></el-input>
          </div>
        </div>
        <div class="cfg-left">
          <div class="left-head">
            <h2>VIP客服信息配置</h2>
            <el-button class="filter-item" type="primary" @click="updateVip">保存</el-button>
            <el-button class="filter-item" type="primary" @click="loadData">刷新</el-button>
          </div>
          <div>
            <span>VIP客服开始服务时间:</span>
            <el-time-picker style="margin-bottom:10px;width:150px" value-format="HH:mm:ss" v-model="seviceCfg.vipStartTime" placeholder="选择时间"></el-time-picker>
            <br>
            <span>VIP客服结束服务时间:</span>
            <el-time-picker style="margin-bottom:10px;width:150px" value-format="HH:mm:ss" v-model="seviceCfg.vipEndTime" placeholder="选择时间"></el-time-picker>
            <br>
            <span>VIP客服最大接待人数:</span>
            <el-input type="number" v-model="seviceCfg.vipReceptionMax" style="margin-bottom:10px;width:150px"></el-input>
            <br>
            <span>VIP客服统一显示昵称:</span>
            <el-input type="text" v-model="seviceCfg.vipNickname" style="margin-bottom:10px;width:150px"></el-input>
            <br>
            <span>VIP客服服务超时配置:</span>
            <el-input type="number" v-model="seviceCfg.vipTimeout" style="margin-bottom:10px;width:150px"></el-input>分钟
            <br>
            <span>VIP客服断线超时配置:</span>
            <el-input type="number" v-model="seviceCfg.vipBrokenTimeout" style="margin-bottom:10px;width:150px"></el-input>分钟
            <br>
            <p>VIP客服服务开始宣言:</p>
            <el-input type="textarea" v-model="seviceCfg.vipDeclaration" rows="3" style="width:320px"></el-input>
            <br>
            <p>VIP服务结束系统提示语:</p>
            <el-input type="textarea" v-model="seviceCfg.vipOverPrompt" rows="3" style="width:320px"></el-input>
            <br>
            <p>VIP服务超时系统提示语:</p>
            <el-input type="textarea" v-model="seviceCfg.vipBrokenTimeoutPrompt" rows="3" style="width:320px"></el-input>
            <br>
            <p>VIP服务断线系统提示语:</p>
            <el-input type="textarea" v-model="seviceCfg.vipBrokenPrompt" rows="3" style="width:320px"></el-input>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getOneChatCfg,
  updateChatCfg
} from "../../api/admin/customerService/customerService";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class customerSeviceCfg extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  seviceCfg: any = {
    _id:"",
    receptionMax: 0, //最大接待
    nickname: "", //统一昵称
    timeout: 0, //超时（分钟）
    brokenTimeout: 0, //断线超时（分钟）
    declaration: "", //宣言
    overPrompt: "", //结束提示
    brokenPrompt: "", //客服断线提示
    brokenTimeoutPrompt: "", //客服超时提示

    vipStartTime: undefined, //vip开始服务时间
    vipEndTime: undefined, //vip结束服务时间
    vipReceptionMax: 0, //最大接待
    vipNickname: "", //统一昵称
    vipTimeout: 0, //超时（分钟）
    vipBrokenTimeout: 0, //断线超时（分钟）
    vipDeclaration: "", //宣言
    vipOverPrompt: "", //结束提示
    vipBrokenPrompt: "", //客服断线提示
    vipBrokenTimeoutPrompt: "" //客服超时提示
  };
  /*method*/
  async loadData() {
    let ret = await myAsyncFn(getOneChatCfg);
    if (ret.code === 200 && ret.msg) {
      this.seviceCfg = ret.msg;
    }
  }
  update() {
    this.$confirm(`此操作将修改该普通客服信息配置, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          id:this.seviceCfg._id,
          receptionMax: this.seviceCfg.receptionMax,
          nickname: this.seviceCfg.nickname,
          timeout: this.seviceCfg.timeout,
          brokenTimeout: this.seviceCfg.brokenTimeout,
          declaration: this.seviceCfg.declaration,
          overPrompt: this.seviceCfg.overPrompt,
          brokenPrompt: this.seviceCfg.brokenPrompt,
          brokenTimeoutPrompt: this.seviceCfg.brokenTimeoutPrompt
        };
        let ret = await myAsyncFn(updateChatCfg, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  updateVip() {
    this.$confirm(`此操作将修改该VIP客服信息配置, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          id:this.seviceCfg._id,
          vipStartTime: this.seviceCfg.vipStartTime,
          vipEndTime: this.seviceCfg.vipEndTime,
          vipReceptionMax: this.seviceCfg.vipReceptionMax,
          vipNickname: this.seviceCfg.vipNickname,
          vipTimeout: this.seviceCfg.vipTimeout,
          vipBrokenTimeout: this.seviceCfg.vipBrokenTimeout,
          vipDeclaration: this.seviceCfg.vipDeclaration,
          vipOverPrompt: this.seviceCfg.vipOverPrompt,
          vipBrokenPrompt: this.seviceCfg.vipBrokenPrompt,
          vipBrokenTimeoutPrompt: this.seviceCfg.vipBrokenTimeoutPrompt
        };
        let ret = await myAsyncFn(updateChatCfg, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.cfg-main {
  display: flex;
  width: 100%;
  justify-content: center;
}
.cfg-left {
  width: 30%;
}
.left-head {
  margin: 10px 0;
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
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
