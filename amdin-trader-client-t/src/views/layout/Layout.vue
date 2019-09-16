<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import store from "../../store";
import socket from "@/utils/newSocket";
export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    TagsView,
    // AppMain
    /* 异步组件 */
    AppMain: () => {
      return new Promise(async (resolve, reject) => {
        let mysocket = new socket();
        await mysocket.connect(); //建立连接
        let login = await mysocket.login(); //登录后台
        console.log("-----------------",login)
        if (login.code == 200) {
          let chat = await mysocket.chat(); //登录聊天
          sessionStorage.setItem("agentInfo", JSON.stringify(chat.info));
          store.dispatch("updateSocketOrder", chat.info.state);
          resolve(AppMain);
        }
      });
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    login() {
      return new Promise(async (resolve, reject) => {
        resolve();
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
