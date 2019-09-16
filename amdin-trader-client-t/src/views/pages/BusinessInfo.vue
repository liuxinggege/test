<template>
	<div class="dashboard-editor-container">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人信息">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">商人信息</span>
			</el-col>
			<div style="clear:both">
				<el-row align="center">
					<el-col :span="8" align="left">
						<span style="font-size:20px;">ID：{{uid}}</span>
					</el-col>
					<el-col :span="8" align="left">
						<span style="font-size:20px;">昵称：{{name}}</span>
					</el-col>
				</el-row>
				<el-row align="center">
					<el-col :span="8" align="left">
						<span style="font-size:20px;">账号/手机：{{act}}</span>
					</el-col>
					<el-col :span="8" align="left">
						<span style="font-size:20px;">登录手机号：{{loginAct}}</span>
						<el-button class="filter-item" type="primary" @click="change">修改</el-button>
					</el-col>
				</el-row>
				<el-row align="center">
					<el-col :span="8" align="left">
						<span style="font-size:20px;">注册时间：{{createDate}}</span>
					</el-col>
					<el-col :span="8" align="left">
						<span style="font-size:20px;">金币数量：{{money}}</span>
					</el-col>
				</el-row>
				<el-row align="center">
					<el-col :span="8" align="left">
						<span style="font-size:20px;">展示QQ：{{qq}}</span>
					</el-col>
					<el-col :span="8" align="left">
						<span style="font-size:20px;">展示微信：{{wx}}</span>
					</el-col>
				</el-row>
			</div>

			<el-dialog :visible.sync="updateActDialog" title="修改登录手机号">
				<el-form label-width="100px">
					<el-form-item label="新手机号：">
						<el-input v-model="uname" class="codeInput"></el-input>
					</el-form-item>
					<el-form-item label="验证码：">
						<el-input v-model="code" class="codeInput"></el-input>
						<el-button @click="getCode" :disabled="isButtonDisabled">
							<span class="tip" v-if="!sendMsgDisabled && !reGet">发送验证码</span>
							<span class="tip" v-if="!sendMsgDisabled && reGet">重新获取</span>
							<span class="tip" v-if="sendMsgDisabled">{{rTime+'秒后重新获取'}}</span>
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="updateAct">确认修改</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-card>
	</div>
</template>

<script >
import Vue from "vue";
import { myDispatch } from "../../utils/index.js";
export default {
  data() {
    return {
      uname: "",
      code: "",
      reGet: false, // 重新获取
      rTime: 59, // 发送验证码倒计时
      time: 60,
      sendMsgDisabled: false, // 发送验证码按钮状态
      isButtonDisabled: false,
      updateActDialog: false
    };
  },
  computed: {
    name() {
      return sessionStorage.getItem("name");
    },
    uid() {
      return sessionStorage.getItem("uid");
    },
    act() {
      return sessionStorage.getItem("act");
    },
    loginAct() {
      return sessionStorage.getItem("loginAct");
    },
    createDate() {
      let date = new Date(sessionStorage.getItem("createDate"));
      return date.toLocaleString(undefined, { hour12: false });
    },
    money() {
      return !!sessionStorage.getItem("money")
        ? sessionStorage.getItem("money")
        : "无";
    },
    qq() {
      return !!sessionStorage.getItem("qq")
        ? sessionStorage.getItem("qq")
        : "无";
    },
    wx() {
      return !!sessionStorage.getItem("wx")
        ? sessionStorage.getItem("wx")
        : "无";
    }
  },
  mounted() {
    myDispatch(this.$store, "GetRegistrantInfo")
      .then(res => {
        if (res.code == 200) {
          // this.$message({type: "success",message: "操作成功!"});
          return;
        } else {
          this.$message({ type: "error", message: res.err });
          return;
        }
      })
      .catch(() => {
        this.$message({ type: "error", message: "操作失败!" });
        return;
      });
  },
  methods: {
    change() {
      this.updateActDialog = true;
      // 下面是用来检查是否已经发送过验证码的，发送后需要继续cd
      let time = Number(localStorage.getItem("uTime"));
      let rTime = Math.floor(this.time - (Date.now() - time) / 1000);
      if (rTime > 0) {
        this.sendMsgDisabled = true;
        this.isButtonDisabled = true;
        let time = Number(localStorage.getItem("uTime"));
        this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
        let interval = window.setInterval(() => {
          let time = Number(localStorage.getItem("uTime"));
          this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
          if (this.rTime <= 0) {
            this.sendMsgDisabled = false;
            this.reGet = true; // 重新获取按钮
            this.isButtonDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
      }
      ////////////////////////////////////////
    },
    updateAct() {
      // console.log("this.uname,this.pwd:", this.uname, this.pwd);
      if (this.uname == "") {
        this.$message({ type: "error", message: "请输入新的登录手机号" });
        return;
      }
      if (this.code == "") {
        this.$message({ type: "error", message: "请输入验证码" });
        return;
      }

      myDispatch(this.$store, "UpdateAct", {
        oldAct: sessionStorage.getItem("loginAct"),
        newAct: this.uname,
        code: this.code
      })
        .then(result => {
          if (result.code == 200) {
            this.$message({ type: "success", message: "修改登录手机号成功!" });
            location.reload();
          } else if (result.code == 2103) {
            this.$message({ type: "error", message: result.err });
          } else {
            this.$message({ type: "error", message: result.err });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: "连接服务器错误!" + err.err
          });
          return;
        });
    },
    getCode() {
      if (this.uname == "") {
        this.$message({ type: "error", message: "请输入手机号" });
        return;
      }
      if (this.uname == this.act || this.uname == this.loginAct) {
        this.$message({ type: "error", message: "请输入不同的手机号" });
        return;
      }
      myDispatch(this.$store, "GetUpdateCode", {
        name: sessionStorage.getItem("loginAct")
      })
        .then(result => {
          if (result.code == 200) {
            localStorage.setItem("uTime", Date.now().toString());
            let time = Number(localStorage.getItem("uTime"));
            this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
            this.sendMsgDisabled = true;
            this.isButtonDisabled = true;
            // 倒计时
            let interval = window.setInterval(() => {
              let time = Number(localStorage.getItem("uTime"));
              this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
              if (this.rTime <= 0) {
                this.sendMsgDisabled = false;
                this.reGet = true; // 重新获取按钮
                this.isButtonDisabled = false;
                window.clearInterval(interval);
              }
            }, 1000);
            this.$message({
              type: "success",
              message: "已经给原手机发送一条验证码短信，请注意查收!"
            });
          } else {
            this.$message({
              type: "error",
              message: "获取验证码短信失败!" + result.err
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "连接服务器错误!" + err.err
          });
          return;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.codeInput {
  width: 150px;
}
// .el-row_colss{
//   margin-top: 10px;
// }
.filter-item {
  margin-left: 20px;
}
.el-form-item {
  margin-left: 25%;
}
.el-row {
  position: relative;
  left: 15%;
  height: 80px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 20px;
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
