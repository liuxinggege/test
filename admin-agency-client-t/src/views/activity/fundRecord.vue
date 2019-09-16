<template>
  <div class="content">
    <div class="header">
      <div @click="backUp" class="back"></div>
      <div class="text">资金记录</div>
    </div>
    <cube-scroll class="scrollBox" ref="scroll" :data="pageData" :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
      <div class="list">
        <div class="listItem" v-for="(item,index) in pageData" :key="index">
          <div class="date">{{item.sumDate|dateFormat}}</div>
          <div class="amount">{{item.money}}</div>
        </div>
      </div>
    </cube-scroll>
  </div>
</template>
<script>
import { getBonusPoolRecord } from "@/api/agent/activity/bonusPool";
import { xutil } from "@/utils/xutil";
import { rejects } from "assert";
export default {
  data() {
    return {
      page: 1,
      count: 10,
      pageData: [],
      dataMore: true,
      options: {
        pullUpLoad: {
          threshold: 30,
          txt: {
            more: "加载更多",
            noMore: "没有更多数据了"
          }
        },
        pullDownRefresh: {
          threshold: 90,
          stop: 50,
          txt: "刷新成功"
        }
      }
    };
  },
  filters: {
    dateFormat(data) {
      let newDate = new Date(data);
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
    loadData() {
      return new Promise((resolve, reject) => {
        getBonusPoolRecord({ page: this.page, count: this.count }).then(res => {
          if (res.data.code != 200) {
            reject();
            return;
          }
          this.pageData = this.pageData.concat(res.data.msg.pageData);
          resolve(res.data.msg);
        });
      });
    },
    backUp() {
      this.$router.push({
        name: "/bonusPool",
        path: "/bonusPool",
        query: { path: "/bonusPool" }
      });
    },
    onPullingUp() {
      console.log("上拉加载");
      console.log(this.dataMore);
      if (!this.dataMore) {
        this.$refs.scroll.forceUpdate();
        return;
      }
      this.page++;
      this.loadData().then(res => {
        if (res.pageData.length == 0) {
          xutil.toastText("没有数据了");
          this.dataMore = false;
          this.$refs.scroll.forceUpdate();
        }
      });
    },
    onPullingDown() {
      console.log("下拉刷新");
      this.page = 1;
      this.pageData = [];
      this.loadData().then(res => {
        if (res.totalCount == 0) {
          xutil.toastText("刷新成功");
          this.$refs.scroll.forceUpdate();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.scrollBox {
  height: 92vh;
}
.list {
  margin-top: 20px;
  .listItem {
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    padding: 0 6vw;
    display: flex;
    align-items: center;
    &:nth-child(2n + 1) {
      background: #f5e7d7;
    }
    .date {
      flex: 3;
      text-align: left;
      color: #92756a;
    }
    .amount {
      flex: 2;
      text-align: right;
      color: $orange;
    }
  }
}
</style>

