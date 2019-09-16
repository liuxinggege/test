<template>
  <div class="login-container">
    <el-form class="login-form" auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">后台登录</h3>
      </div>

      <el-form-item prop="userid">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input name="userid" type="text" v-model="loginForm.userid" auto-complete="on" placeholder="请输入userid登录账号"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="on" placeholder="密码"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="lock"/>
        </span>
        <el-input name="code" type="text" v-model="loginForm.code" auto-complete="off" placeholder="验证码"/>
      </el-form-item> -->
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Login extends Vue {
  // name: "login";
  // inital data
  loginResult = this.$store.state.user.loginResult;
  loginForm = {
    userid: "",
    password: "",
  };
  validateUsername(rule, value: string, callback) {
    if (!value) {
      callback(new Error("请输入userid"));
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
  validateCode(rule, value: string, callback) {
    if (value.length !== 6) {
      callback(new Error("必须输入6位验证码"));
    } else {
      callback();
    }
  }
  loginRules = {
    userid: [
      { required: true, trigger: "blur", validator: this.validateUsername }
    ],
    password: [
      { required: true, trigger: "blur", validator: this.validatePassword }
    ],
    code: [
      { required: true, message: "必须输入验证码", trigger: "blur" },
      { min: 6, max: 6, message: "验证码长度为6", trigger: "blur" }
    ]
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
        this.loading = true;
        myDispatch(this.$store, "Login", this.loginForm).then(() => {  
            if(this.loginResult.code === 200){
                  this.loading = false;
                  this.$router.push({ path: "/" });
            }else{
              this.$message.error(this.loginResult.message)
              this.loading = false;
            }     
        });
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
  // lifecycle hook
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
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
  .toreg{
    text-align: right;
    padding: 10px 0;
    color: #fff;
    span{
      cursor: pointer;
      font-size: 14px;
    }
  }
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
