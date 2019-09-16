
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
  gonggaoRedDot: boolean = this.$store.state.announcement.gonggaoRedDot;

  async created() {
    let cond = this.getQueryCond();
    await xutil
      .myDispatch(this.$store, "GetGonggaoAnnouncementList", cond)
      .then(async () => {
        this.announcementList = this.$store.state.announcement.announcementList;
        this.gonggaoRedDot = this.$store.state.announcement.gonggaoRedDot;
        this.totalCount = this.$store.state.announcement.totalCount;
      });
  }
  toAnnouncement(item) {
    this.$router.push({
      name: "/announcement-html",
      path: "/announcement-html",
      query: { item: item, path: "/announcement", tab: "gonggao" }
    });
    if (item.redDot) {
      xutil.myDispatch(
        this.$store,
        "ReadAgencyBillboard",
        { id: item._id },
        true
      );
      xutil.myDispatch(this.$store, "GetAnnouncementNotRead", {}, true);
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
    cond.type = "gonggao";
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
        .myDispatch(this.$store, "GetGonggaoAnnouncementList", cond)
        .then(() => {
          this.announcementList = this.announcementList.concat(
            this.$store.state.announcement.announcementList
          );
          this.gonggaoRedDot = this.$store.state.announcement.gonggaoRedDot;
          this.totalCount = this.$store.state.announcement.totalCount;
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
      .myDispatch(this.$store, "GetGonggaoAnnouncementList", cond)
      .then(() => {
        this.announcementList = this.$store.state.announcement.announcementList;
        this.totalCount = this.$store.state.announcement.totalCount;
        this.gonggaoRedDot = this.$store.state.announcement.gonggaoRedDot;
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
        color: $titleColor * 1.7;
      }
      dd {
        color: $valueColor * 1.3;
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
        color: $titleColor;
      }
      dd {
        color: $valueColor;
      }
      .icon {
        background: url(#{$imgUrl}gg-icon1.png) no-repeat left center;
        background-size: 80%;
      }
    }
  }
}
</style>
