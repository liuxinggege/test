<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">

      <div class="title-container">
        <h3 class="title">商代管理系统</h3>
      </div>

      <el-form-item prop="name">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="name" type="text" v-model="loginForm.name" autoComplete="on" placeholder="用户名" />
      </el-form-item>

      <el-form-item prop="pwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="pwd" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.pwd" autoComplete="on" placeholder="密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <div>
        <el-form-item prop="code" style="width:70%">
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>
          <el-input name="code" type="number" v-model="loginForm.code" autoComplete="on" placeholder="验证码" />
        </el-form-item>
        <el-button type="primary" class="code" v-bind:disabled="isButtonDisabled" :loading="loading" @click.native.prevent="getCode">
          <span class="tip" v-if="!sendMsgDisabled && !reGet">发送验证码</span>
          <span class="tip" v-if="!sendMsgDisabled && reGet">重新获取</span>
          <span class="tip" v-if="sendMsgDisabled">{{rTime+'秒后重新获取'}}</span>
        </el-button>
      </div>

      <el-button type="primary" class="login" style="width:100%" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
// import { Getter, Action } from "vuex-class";
import { myDispatch } from "../../utils/index";
import router from "../../router/index";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Login extends Vue {
  reGet: boolean = false; // 重新获取
  rTime: number = 59; // 发送验证码倒计时
  time: number = 60; // 发送验证码倒计时
  sendMsgDisabled: boolean = false; // 发送验证码按钮状态
  isButtonDisabled: boolean = false;
  created() {
    let time = Number(localStorage.getItem("Time"));
    let rTime = Math.floor(this.time - (Date.now() - time) / 1000);
    if (rTime > 0) {
      this.sendMsgDisabled = true;
      this.isButtonDisabled = true;
      let time = Number(localStorage.getItem("Time"));
      this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
      let interval = window.setInterval(() => {
        let time = Number(localStorage.getItem("Time"));
        this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
        if (this.rTime <= 0) {
          this.sendMsgDisabled = false;
          this.reGet = true; // 重新获取按钮
          this.isButtonDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    }
  }
  // name: "login";

  // inital data
  loginResult = this.$store.state.user;
  loginForm = {
    name: "",
    pwd: "",
    code: ""
  };
  validateUsername(rule, value: string, callback) {
    if (!value) {
      callback(new Error("用户名不能为空"));
    } else {
      callback();
    }
  }
  validateSMScode(rule, value: string, callback) {
    if (!value) {
      callback(new Error("验证码不能为空"));
    } else {
      callback();
    }
  }
  validatePassword(rule, value: string, callback) {
    if (value.length < 6) {
      callback(new Error("密码长度不能小于6位"));
    } else {
      callback();
    }
  }
  loginRules = {
    name: [
      { required: true, trigger: "blur", validator: this.validateUsername }
    ],
    pwd: [
      { required: true, trigger: "blur", validator: this.validatePassword }
    ],
    code: [{ required: true, trigger: "blur", validator: this.validateSMScode }]
  };
  passwordType: string = "password";
  loading: boolean = false;
  showDialog: boolean = false;
  // method
  showPwd(): void {
    if (this.passwordType === "password") {
      this.passwordType = "";
    } else {
      this.passwordType = "password";
    }
  }
  handleLogin(): void {
    let loginForm: any = this.$refs.loginForm;
    loginForm.validate(valid => {
      if (valid) {
        myDispatch(this.$store, "Login", this.loginForm).then(() => {
          if (this.loginResult.loginResult.code !== 200) {
            this.$message({
              type: "error",
              message: this.loginResult.loginResult.message
            });
            return;
          }
          console.log("登录成功");
          this.$router.push({ path: "/" });
        });
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
  getCode(): void {
    let loginForm: any = this.loginForm;
    if (!loginForm.name) {
      this.$message({
        type: "error",
        message: "请输入用户名"
      });
    } else {
      myDispatch(this.$store, "GetCode", this.loginForm.name).then(() => {
        console.log(this.loginResult.loginResult.code !== 200);
        if (this.loginResult.loginResult.code !== 200) {
          this.$message({
            type: "error",
            message: this.loginResult.loginResult.message
          });
          return;
        } else {
          localStorage.setItem("Time", Date.now().toString());
          let time = Number(localStorage.getItem("Time"));
          this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
          this.sendMsgDisabled = true;
          this.isButtonDisabled = true;
          // 倒计时
          let interval = window.setInterval(() => {
            let time = Number(localStorage.getItem("Time"));
            this.rTime = Math.floor(this.time - (Date.now() - time) / 1000);
            if (this.rTime <= 0) {
              this.sendMsgDisabled = false;
              this.reGet = true; // 重新获取按钮
              this.isButtonDisabled = false;
              window.clearInterval(interval);
            }
          }, 1000);
        }
      });
    }
  }

  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(69, 69, 69, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.code {
  position: relative;
  top: -72px;
  // right:20px
  left: 320px;
  width: 125px;
  height: 50px;
}
.login {
  position: relative;
  top: -50px;
  // left: 0px;
  width: 125px;
  height: 50px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 15px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
