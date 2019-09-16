
<template>
  <div class="bulletinBox">
    <div :class="item.redDot?'item unread':'item'" v-for="(item,index) of announcementList" :key="index" @click="toAnnouncement(item)">
      <div class="icon"></div>
      <dl class="info">
        <dt>{{item.title}}</dt>
        <dd>{{item.createTime}}</dd>
      </dl>
      <div class="linkIcon"></div>
    </div>
  </div>
</template>
 

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";

@Component
export default class GonggaoList extends Vue {
  page: number = 1;
  count: number = 10;
  uid: string = "";
  announcementList: any[] = this.$store.state.announcement.announcementList;
  totalCount: number = this.$store.state.announcement.totalCount;
  gonglueRedDot: boolean = this.$store.state.announcement.gonglueRedDot;
  async created() {
    let cond = this.getQueryCond();
    await xutil
      .myDispatch(this.$store, "GetGonglueAnnouncementList", cond)
      .then(async () => {
        this.announcementList = this.$store.state.announcement.announcementList;
        this.totalCount = this.$store.state.announcement.totalCount;
        this.gonglueRedDot = this.$store.state.announcement.gonglueRedDot;
      });
  }
  toAnnouncement(item) {
    this.$router.push({
      name: "/announcement-html",
      path: "/announcement-html",
      query: { item: item, path: "/announcement", tab: "gonglue" }
    });
    if (item.redDot) {
      xutil.myDispatch(this.$store, "ReadAgencyBillboard", { id: item._id });
      xutil.myDispatch(this.$store, "GetAnnouncementNotRead", {});
    }
  }
  getQueryCond() {
    let cond: any = {
      page: this.page,
      count: this.count
    };
    if (this.uid.trim()) {
      cond.uid = this.uid;
    }
    cond.type = "gonglue";
    return cond;
  }
  options = {
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
  };
  async onPullingUp() {
    if (this.announcementList.length < this.totalCount) {
      // 如果有新数据
      this.page++;
      let cond = this.getQueryCond();
      await xutil
        .myDispatch(this.$store, "GetGonglueAnnouncementList", cond)
        .then(() => {
          this.announcementList = this.announcementList.concat(
            this.$store.state.announcement.announcementList
          );
          this.totalCount = this.$store.state.announcement.totalCount;
          this.gonglueRedDot = this.$store.state.announcement.gonglueRedDot;
        });
    } else {
      // 如果没有新数据
      xutil.toastText("没有数据了");
      (this.$refs.scroll as any).forceUpdate();
    }
  }
  async onPullingDown() {
    this.page = 1;
    let cond = this.getQueryCond();
    await xutil
      .myDispatch(this.$store, "GetGonglueAnnouncementList", cond)
      .then(() => {
        this.announcementList = this.$store.state.announcement.announcementList;
        this.totalCount = this.$store.state.announcement.totalCount;
        this.gonglueRedDot = this.$store.state.announcement.gonglueRedDot;
      });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.bulletinBox {
  padding: 0 5vw;
  .item {
    display: flex;
    padding: 0 3vw;
    align-items: center;
    background: #fff;
    margin-bottom: 2vh;
    height: 10vh;
    .icon {
      flex: 1;
      background: url(#{$imgUrl}gg-icon2.png) no-repeat left center;
      background-size: 80%;
      height: 100%;
    }
    .info {
      flex: 5;
      text-align: left;
      dt {
        font-size: $size-s;
        margin-bottom: 0.8vh;
        color: $color-l * 0.8;
      }
      dd {
        color: $color-l * 0.8;
        font-size: $size-w;
      }
    }
    .linkIcon {
      background: url(#{$imgUrl}arrow.png) no-repeat right center;
      background-size: 20%;
      flex: 1;
      height: 100%;
    }
    &.unread {
      dt {
        color: $color-b;
      }
      .icon {
        background: url(#{$imgUrl}gg-icon1.png) no-repeat left center;
        background-size: 80%;
      }
    }
  }
}
</style>
