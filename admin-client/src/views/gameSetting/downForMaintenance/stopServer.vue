<template>
	 <el-card class="dashboard-second " style="margin:40px; width: 700px; height: 540px">
        <el-col  class="toolbar1" style="margin-bottom: 20px">
            <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="停机维护">
            </el-popover>
            <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
            <span class="title">停机维护</span>
        </el-col>
        <div class="stopServerBox">
            <div style="height: 420px;width:700px">
                <el-steps direction="vertical" >
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2" description=""></el-step>
                </el-steps>
            </div>
            <el-col class="stopServerButton">               
                <dl>
                <dd v-if="!allowLoginIP.switch" style="margin-top: 0">
                    <el-button type="primary" @click="changeFlag">禁止登录(更换状态后需点右侧保存)</el-button>
                    <span>当前允许所有玩家登陆</span></dd>
                <dd v-if="allowLoginIP.switch" style="margin-top: 0px">
                    <el-button type="danger" @click="changeFlag">允许登录(更换状态后需点右侧保存)</el-button>
                    <span>当前只允许白名单玩家登陆</span></dd>
                <dd style="margin-top: 280px">
                    <el-button type="danger" @click="stopServerFn">强制玩家结算并踢下线</el-button>
                </dd>
                </dl>
            </el-col> 
        </div>      
      </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AllowLoginIP } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js";
//brnnMatchRules

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class brnnMatchRules extends Vue {
  // lifecycle hook
  created() { }
  /*inital data*/
  allowLoginIP: AllowLoginIP = this.$store.state.allowLoginIP; //表单数据
  /*method*/
  changeFlag() {
    this.allowLoginIP.switch = !this.allowLoginIP.switch;
  }
  stopServerFn() {
    this.$confirm("此操作将关闭游戏服务器, 是否继续?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "GetStopServer", {}, true)
          // this.$store.dispatch("GetStopServer")
          .then(() => {
            if (this.$store.state.stopServer.code === 200) {
              this.$message({
                type: "success",
                message: "成功!"
              });
              return;
            } else {
              this.$message({
                type: "error",
                message: "保存!"
              });
              return;
            }
          });
      })
      .catch(err => {
        this.$message({
          type: "info",
          message: "取消"
        });
        return;
      });
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
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
.stopServerBox {
  width: 600px;
  position: relative;
  overflow: hidden;
}
.stopServerButton {
  position: absolute;
  top: 20px;
  left: 100px;
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
</style>
