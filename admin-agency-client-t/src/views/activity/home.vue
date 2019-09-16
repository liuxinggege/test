<template>
  <div class="content">
    <div class="header">
      <div @click="toHome" class="back"></div>
      <div class="text">活动列表</div>
    </div>
    <div class="activeAll">
      <div v-for="(item,index) in activeData" :key="index">
        <div class="activeItem" v-if="item.type=='agencyWelfare'" @click="toNew">
          <img src="~resources/images/active1.png">
          <div class="date">截止时间：{{item.endDate|dateFormat}}</div>
        </div>
        <div class="activeItem" v-if="item.type=='agencyBonusPool'" @click="toBonusPool">
          <img src="~resources/images/active2.png">
          <div class="date">截止时间：{{item.endDate|dateFormat}}</div>
        </div>
      </div>
      <div v-if="activeData.length==0" style="height:60px;line-height:60px;text-align:center;">暂无活动</div>
    </div>
  </div>
</template>
<script>
import { getActivity } from "@/api/agent/activity/bonusPool";
export default {
  data() {
    return {
      flag: false,
      activeData: []
    };
  },
  filters: {
    dateFormat(date) {
      let newDate = new Date(date);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    toNew() {
      this.$router.push("/novice");
    },
    loadData() {
      getActivity().then(res => {
        this.activeData = res.data.msg;
      });
    },
    toBonusPool() {
      this.$router.push("bonusPool");
    },
    toHome() {
      this.$router.push({ path: "/home" });
    }
  }
};
</script>

<style lang="scss" scoped>
.activeAll {
  margin: 0 5vw;
  padding: 20px 0;
}
.activeItem {
  margin-bottom: 20px;
  img {
    max-width: 100%;
  }
  .date {
    text-align: center;
    line-height: 30px;
    color: $orange;
  }
}
</style>
