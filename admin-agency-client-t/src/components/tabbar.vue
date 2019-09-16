<template>
  <cube-tab-bar v-model="sel" :showSlider="false" inline @click="clickHandler">
    <cube-tab v-for="item in tabs" :label="item.label" :key="item.label">
      <dl :class="item.icon">
        <dt></dt>
        <dd>{{item.label}}</dd>
      </dl>
    </cube-tab>
  </cube-tab-bar>
</template>
<script>
import { xutil } from "../utils/xutil";
export default {
  data() {
    return {
      sel: "",
      tabs: [
        {
          label: "首页",
          icon: "tabbar1"
        },
        {
          label: "数据报表",
          icon: "tabbar2"
        },
        {
          label: "团队管理",
          icon: "tabbar3"
        }
      ],
      department:process.env.DEPART_MENT
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (!this.userInfo.banSettlement) {
      this.tabs.push({
        label: "资金结算",
        icon: "tabbar5"
      });
    }
    if(this.department!='two'){
      this.tabs.push({
        label: "活动列表",
        icon: "tabbar4"
      });
    }
  },
  methods: {
    clickHandler(label) {
      // if you clicked home tab, then print 'Home'
      console.log(label);
      switch (label) {
        case "首页":
          this.$router.push("home");
          break;
        case "数据报表":
          this.$router.push("dataReport");
          break;
        case "团队管理":
          this.$router.push("groupManage");
          break;
        case "活动列表":
          this.$router.push("activity");
          break;
        case "资金结算":
          this.$router.push("balanceSettle");
          break;
      }
    },
    changeHandler(label) {
      // if you clicked different tab, this methods can be emitted
    }
  }
};
</script>
