<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="abc">
        <navbar class="adc_nav_bar"></navbar>
        <tags-view></tags-view>
      </div>
      <!-- <div style="height:80px;"></div> -->
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
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
// .abc{
//   position:fixed;
//   width:89%;
//   z-index:2013;
// }
// .adc_nav_bar{
//    z-index:2014;
// }
</style>
