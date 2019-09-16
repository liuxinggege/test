
<template>
  <div class="list">
    <div class="headerLine">
      <div class="td1">任务要求</div>
      <div class="td2">完成进度</div>
      <div class="td3">金额</div>
      <div class="td4">状态</div>
    </div>
    <div class="item" v-for="(item,index) of activityList" :key="index">
      <div class="td1">{{item.description}}</div>
      <div class="td2">{{item.finNumber}}/{{item.number}}</div>
      <div class="td3">{{item.reward}}</div>
      <div class="td4" v-if="item.finish&&!item.receiver">
        <cube-button class="btnBlue" @click="receiveWelfare(item.activityId)">领取</cube-button>
      </div>
      <div class="td4" v-if="item.type==='self'&&!item.finish">
        <cube-button class="btnRed" @click="goSelf">前往</cube-button>
      </div>
      <div class="td4" v-if="item.type!=='self'&&!item.finish">
        <span class="red">未完成</span>
      </div>
      <div class="td4" v-if="item.receiver">
        <span class="gray">已领取</span>
      </div>
    </div>
  </div>
</template>
 

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
import { BigNumber } from "bignumber.js";
@Component
export default class NewWelfare extends Vue {
  activityList = this.$store.state.activity.activityList;
  created() {
    this.loadData();
  }
  loadData() {
    xutil.myDispatch(this.$store, "GetWelfare", {}).then(() => {
      this.activityList = this.$store.state.activity.activityList;
    });
  }
  receiveWelfare(activityId) {
    let fundReserve = this.$store.state.home.fundReserve;
    xutil
      .myDispatch(this.$store, "ReceiveWelfare", {
        activityId: activityId,
        fundReserve: fundReserve
      })
      .then(() => {
        if (this.$store.state.activity.code === 200) {
          xutil.toastSuccess("领取成功");
          this.loadData();
        } else {
          xutil.toastWarn("领取失败");
        }
      });
  }
  goSelf() {
    this.$router.push({
      name: "/selfInfo",
      path: "/selfInfo",
      query: { path: "/activity" }
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.list {
  padding: 0 5vw;
  position: absolute;
  top: 42vh;
  bottom: 12vh;
  width: 100%;
  overflow-y: scroll;
  .headerLine {
    background: #faf5ec;
    height: 6vh;
    display: flex;
    align-items: center;
    font-size: $size-w;
  }
  .td1,
  .td2,
  .td3,
  .td4 {
    flex: 1;
    @include middle;
  }
  .item {
    height: 6vh;
    display: flex;
    border-bottom: $border;
    font-size: $size-w;
    color: $color-n;
    .btnBlue,
    .btnRed {
      width: 80%;
      font-size: $size-w;
      height: 80%;
      @include middle;
      padding: 0;
    }
    .btnBlue {
      background: $blue;
    }
    .btnRed {
      background: $red;
    }
    .red {
      color: $red;
    }
  }
}
</style>
