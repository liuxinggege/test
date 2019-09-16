<template>
  <div class="content">
      <div class="boxForm">
          <dl class="formitem">
              <dt>账号:</dt>
              <dd><cube-input class="loginbox" v-model="loginForm.username" placeholder="请输入账号"></cube-input></dd>
          </dl>
          <dl class="formitem">
              <dt>密码:</dt>
              <dd><cube-input type="password" class="loginbox" @keyup.enter.native="handleLogin" v-model="loginForm.password" placeholder="请输入密码"></cube-input></dd>
          </dl>
          <cube-button class="btnLogin" @click="handleLogin">登录</cube-button>
          <div class="forgetLink" @click="setNewPwd">忘记密码<em>?</em></div>
      </div>
  </div>

</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { xutil } from "../../utils/xutil";
import { setTimeout, setInterval } from "timers";
@Component
export default class Login extends Vue {
  loading = false;
  loginResult = this.$store.state.user;
  loginForm = {
    username: "",
    password: ""
  };
  handleLogin(): void {
    let username = this.loginForm.username;
    let password = this.loginForm.password;
    if (!username || !password || password.length < 6) {
      (this as any).$vux.toast.text("请输入正确的账号密码");
      return;
    }
    this.loading = true;
    xutil.myDispatch(this.$store, "Login", this.loginForm).then(() => {
      this.loading = false;
      let loginCode = this.loginResult.loginResult.code;
      if (loginCode !== 200) {
        xutil.toastWarn(this.loginResult.loginResult.message);
        return;
      }
      console.log(this.$router)
      this.$router.push({ path: "/home" });
    });
  }
  //忘记密码
  setNewPwd() {
    this.$router.push({ path: "/findPassword" });
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.content{background:url(#{$imgUrl}login-bg.jpg) no-repeat center top; background-size: 100%; width: 100vw;height: 100vh;}

.boxForm{width: 80vw;margin:0 auto;padding-top: 52vh}
.btnLogin{height: 8vh;border-radius: 5vh;font-size: $size-l}
.formitem{
    height: 8vh;border-radius: 4vh;border: solid 2px #dcdcdc;margin-bottom: 3vh; display: flex; align-items: center;
    dt{flex: 2;font-size: $size-l;text-align: center;}
    dd{flex: 5;}
    .loginbox{height: 7vh;width: 90%;border: none;position:static;font-size: $size-m;background: none;}
}
.forgetLink{
    margin-top: 5vh;font-size: $size-m; line-height: 5vw; text-align: center;
    em{width: 5vw;height: 5vw;border-radius: 50%;color: #fff;font-size: $size-s;background: $blue;display: inline-block;margin-left: 2vw}
}
</style>
