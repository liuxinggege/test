<template>
  <section class="app-main" style="min-height: 100%">
    <sokettalk v-show="socketShow"></sokettalk>
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import sokettalk from "../../agent/newSocket.vue";
export default {
  name: "AppMain",
  components: {
    sokettalk
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    socketShow() {
      return this.$store.state.agentRecharge.socketShow;
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
};
</script>
