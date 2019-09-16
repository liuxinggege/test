<template>
  <div class="content">
    <div class="header">
      <div @click="backUp" class="back"></div>
      <div class="text">代理活动排名</div>
    </div>
    <div class="imgBar">
      <img src="~resources/images/pm_header.png">
    </div>
    <div class="pmList">
      <div class="pmItem pmHedader">
        <div class="td1">排名</div>
        <div class="td2">代理ID</div>
        <div class="td3">当前点位</div>
        <div class="td4">奖金金额</div>
      </div>
      <div class="pmItem" v-for="(item,index) in rankInfo" :key="index">
        <div class="lingqu" v-if="item.fundReserve=='success'">
          <img src="~resources/images/ylq.png">
        </div>
        <div class="td1">
          <img src="~resources/images/number1.png" v-if="index==0">
          <img src="~resources/images/number2.png" v-else-if="index==1">
          <img src="~resources/images/number3.png" v-else-if="index==2">
          <template v-else>NO.{{index+1}}</template>
        </div>
        <div class="td2">
          <dl v-if="index<3">
            <dt>
              <img src="~resources/images/pm_photo.png">
            </dt>
            <dd>ID:{{item.agencyId}}</dd>
          </dl>
          <template v-else>ID:{{item.agencyId}}</template>
        </div>
        <div class="td3">{{item.taxRate}}</div>
        <div class="td4">{{item.totalFund}}</div>
      </div>
    </div>
    <div class="myNumber">
      <div>我的排名：{{selfInfo.rank}}</div>
      <div class="btnOrange" @click="toTuiguang">推广攻略</div>
    </div>
  </div>
</template>
<script>
import { getBonusPoolRank } from "@/api/agent/activity/bonusPool";
import { xutil } from "../../utils/xutil";
export default {
  data() {
    return {
      rankInfo: [],
      selfInfo: {
        rank: "未上榜"
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      getBonusPoolRank().then(res => {
        this.rankInfo = res.data.msg.rankInfo;
        this.selfInfo = res.data.msg.selfInfo;
      });
    },
    backUp() {
      this.$router.push({
        name: "/bonusPool",
        path: "/bonusPool",
        query: { path: "/bonusPool" }
      });
    },
    toTuiguang() {
      this.$router.push("spreadSetting");
    }
  }
};
</script>
<style lang="scss" scoped>
.imgBar {
  width: 100vw;
  img {
    max-width: 100%;
  }
}
.pmList {
  padding-bottom: 80px;
  color: #92756a;
  .pmHedader {
    height: 50px !important;
    background: #fed2a8;
    font-size: 24px !important;
  }
  .pmItem {
    display: flex;
    align-items: center;
    border-bottom: $border;
    height: 80px;
    padding-right: 12vw;
    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      height: 150px;
    }
    .td1 {
      flex: 1;
      height: 100%;
      img {
        max-height: 85%;
      }
    }
    .td2 {
      flex: 2;
      font-size: 22px;
      img {
        max-width: 80%;
        display: block;
        margin: 0 auto 10px auto;
      }
      dl {
        text-align: center;
      }
    }
    .td3 {
      flex: 1;
      white-space: nowrap;
    }
    .td4 {
      flex: 2;
    }
    .lingqu {
      position: absolute;
      right: 2vw;
      img {
        width: 15vw;
      }
    }
  }
}
.myNumber {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5vw;
  background: #92756a;
  color: #fff;
  font-size: 30px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .btnOrange {
    width: 160px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: $orange;
    border-radius: 8px;
  }
}
</style>


