<template>
    <div class="dashboard-outer">
		<el-card class="dashboard-second">		
			<el-col  class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="用户信息">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">用户信息</span>
			</el-col>
			<span style="font-size:12pt; margin:10px 0px 10px 100px">账号名</span>
				<el-input type='text' style='width:200px; margin:20px 30px 20px 20px'  v-model="act" :disabled="true"></el-input>
				<br>
			<span style="font-size:12pt; margin:10px 0px 10px 115px">密码</span>
			<el-input type='text' style='width:200px; margin:20px 30px 20px 20px'  v-model="newPwd1"></el-input>			
			<!-- <label for="minUserCount" class="label">确认密码</label>
			<el-input type='text' class="input" id="minUserCount"  v-model="newPwd2">
			</el-input> -->
			<div style="margin-left:380px">
				<el-button type="primary" @click="submitForm()">提交</el-button>
				<el-button @click="resetForm()">重置</el-button>
			</div>        
		
		</el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SelfInfoState } from "../store/stateInterface";
import { myDispatch } from "../utils/index.js";

@Component
export default class SelfInfo extends Vue {
  act: string = "";
  newPwd1: string = "";
  newPwd2: string = "";

  selfInfo: SelfInfoState = this.$store.state.selfInfo; //表单数据

  created() {
    // this.act = JSON.parse(<string>sessionStorage.getItem("user")).name;
    this.act = "ty";
  }
  submitForm() {
    let message = "原密码不能为空!";
    if (this.newPwd1 === "") {
      message = "密码不能为空!";
      this.$message({
        type: "error",
        message: message
      });
      return;
    }
    let createData = {
      name: this.act,
      pwd: this.newPwd1
    };
    this.$confirm("此操作将修改此账号密码,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "UpdateSelfInfo", createData)
          .then(() => {
            if (this.selfInfo.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "修改失败!"
            });
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
      });
  }

  resetForm() {
    this.newPwd1 = "";
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
