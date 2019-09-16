<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <h2 class="title-name">{{titleName}}</h2>
    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>
      <el-button type="primary" icon="el-icon-sort" class="reconnect" @click="reconnect">切换线路</el-button>
      <span class="time-now">{{now}}</span>
      <el-tooltip effect="dark" :content="screenfull" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>
     
      <el-tooltip effect="dark" :content="theme" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">

          <router-link to="/hello">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          
          <!-- <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a> -->
          <!-- <router-link to="/selfInfo">
            <el-dropdown-item>个人信息</el-dropdown-item>
          </router-link> -->

          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import ThemePicker from "@/components/ThemePicker";

import { myDispatch } from "@/utils/index";
import chekLine from "@/utils/chekLine";

export default {
  data: function() {
    return {
      now: "",
      theme: "换肤",
      screenfull: "全屏",
      titleName:"测试"
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar"])
  },
  mounted() {
    // if(!process.env.BASE_STYLE){
    //   this.titleName = ''
    // }else{
    //   if(process.env.BASE_STYLE==="one"){
    //     switch(process.env.PID){
    //       case "A":
    //       this.titleName = "友趣";
    //       break;
    //       case "B":
    //       this.titleName = "凯旋";
    //       break;
    //       case "C":
    //       this.titleName = "星光";
    //       break;
    //       case "D":
    //       this.titleName = "花样";
    //       break;
    //     }
    //   }else{
    //     switch(process.env.PID){
    //       case "A":
    //       this.titleName = "魔方";
    //       break;
    //       case "B":
    //       this.titleName = "魔盒";
    //       break;
    //       case "C":
    //       this.titleName = "牛仔";
    //       break;
    //     }
    //   }
    // }
    setInterval(() => {
      let date = new Date();
      this.now = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
    }, 1000);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    async reconnect(){
      sessionStorage.removeItem("x-baseurl");
      let url = await chekLine();
      console.log("当前URL:",url) 
      sessionStorage.setItem("x-baseurl", url);
      this.$message({
        message: '路线已切换，请重新请求数据',
        type: 'success'
      });
    },
    logout() {
      myDispatch(this.$store, "LogOut").then(() => {
        if (this.$store.state.user.loginResult.code !== 200) {
          this.$message({
            type: "error",
            message: this.loginResult.loginResult.message
          });
          return;
        }
        sessionStorage.clear();
        this.$router.push({ path: "/login" });
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  position: relative;
  .reconnect{
    position: absolute;
    right: 360px;
    top:5px
  }
  .time-now {
    position: absolute;
    right: 200px;
    color: #666699;
    font-weight: bold;
    font-family: "Times New Roman", Times, serif;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .title-name{
    position: absolute;
    left: 42%;
    top:-20px;
  }
}
</style>
