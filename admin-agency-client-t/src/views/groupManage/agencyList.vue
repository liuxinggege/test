<template>
  <div class="incontent">
    <div class="serchBox">
      <div class="btnSerch" @click="searchData"></div>
      <input type="text" v-model="agencyId" placeholder="输入代理id">
    </div>
    <div class="list">
      <cube-scroll class="items-div" ref="scroll" :data="agencyList" :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
        <div class="dlItem" v-for="(item,index) of agencyList" :key="index">
          <div class="title">点位<em>{{item.taxRate}}</em></div>
          <div class="dlId">渠道号：{{item.channel}}</div>
          <div class="clear"></div>
          <div class="userInfo">
            <dl class="photo">
              <dt><img src="~resources/images/head2.png" alt=""></dt>
              <dd>{{item.name}}</dd>
            </dl>
            <ul class="infos">
              <li class="strong">ID：{{item.agencyId}}</li>
              <li class="strong">账号：{{item.act}}</li>
              <li class="normal">创建：{{item.createDate}}</li>
              <li class="normal">登录：{{item.loginDate}}</li>
              <li class="normal">备注：{{item.remarks}}</li>
            </ul>
          </div>
        </div>
      </cube-scroll>
      <div class="addBox">
        <cube-button class="btn" @click="addAgency">添加新代理</cube-button>
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

@Component
export default class AgencyList extends Vue {
  page: number = 1;
  count: number = 10;
  agencyId: string = "";
  agencyList: any[] = this.$store.state.groupManage.agencyList;
  totalCount: number = this.$store.state.groupManage.agencyTotalCount;
  async created() {
    let cond = this.getQueryCond();
    await xutil.myDispatch(this.$store, "GetAgencyList", cond).then(() => {
      this.agencyList = this.$store.state.groupManage.agencyList;
      this.totalCount = this.$store.state.groupManage.agencyTotalCount;
    });
  }
  async searchData() {
    this.page = 1;
    let cond = this.getQueryCond();
    await xutil.myDispatch(this.$store, "GetAgencyList", cond).then(() => {
      this.agencyList = this.$store.state.groupManage.agencyList;
      this.totalCount = this.$store.state.groupManage.agencyTotalCount;
    });
  }
  getQueryCond() {
    let cond: any = {
      page: this.page,
      count: this.count
    };
    if (this.agencyId.trim()) {
      cond.agencyId = this.agencyId;
    }
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
    if (this.agencyList.length < this.totalCount) {
      // 如果有新数据
      this.page++;
      let cond = this.getQueryCond();
      await xutil.myDispatch(this.$store, "GetAgencyList", cond).then(() => {
        this.agencyList = this.agencyList.concat(
          this.$store.state.groupManage.agencyList
        );
        this.totalCount = this.$store.state.groupManage.agencyTotalCount;
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
    await xutil.myDispatch(this.$store, "GetAgencyList", cond).then(() => {
      this.agencyList = this.$store.state.groupManage.agencyList;
      this.totalCount = this.$store.state.groupManage.agencyTotalCount;
    });
  }
  addAgency() {
    this.$router.push({ path: "/addAgency" });
  }
}
</script>

<style lang="scss" scoped>
.incontent {
  min-height: 92vh;
  padding-top: 3vh;
}
.serchBox {
  height: 5vh;
  border-radius: 2.5vh;
  background: $color-l;
  display: flex;
  margin: 0 5vw 4vh 5vw;
  .btnSerch {
    flex: 1;
    background: url(#{$imgUrl}search-icon.png) no-repeat center center;
    background-size: 45%;
  }
  input {
    flex: 6;
    background: none;
    height: 100%;
    font-size: $size-s;
    padding-right: 4vw;
  }
}
.list {
  padding: 0 5vw;
  height: 69vh;
}
.items-div {
  height: 60vh
}
.dlItem {
  box-shadow: 0px 6px 28px 0px rgba(202, 218, 242, 0.74);
  border-radius: 6px;
  margin-bottom: 4vh;
  padding-bottom: 2vh;
  .title {
    width: 25%;
    height: 5vh;
    @include middle;
    background: $blue;
    color: #fff;
    font-size: $size-w;
    border-radius: 0 2.5vh 2.5vh 0;
    float: left;
    margin-right: 4vw;
  }
  .title em {
    font-size: $size-m;
    padding-left: 1vw;
  }
  .dlId {
    float: left;
    height: 5vh;
    font-size: $size-w;
    color: $blue;
    display: flex;
    align-items: center;
  }
  .userInfo {
    display: flex;
    margin-top: 2vh;
    .photo {
      flex: 1;
      padding-top: 1.5vh;
      dt {
        width: 12vw;
        height: 12vw;
        border-radius: 50%;
        background: #ccc;
        margin: 0 auto 2vh auto;
      }
      img {
        width: 12vw;
        height: 12vw;
        border-radius: 50%;
        background: #ccc;
      }
      dd {
        font-size: $size-w;
        padding: 0 5%;
        text-align: center;
      }
    }
    .infos {
      flex: 3;
      padding-left: 5vw;
      li {
        text-align: left;
        margin-bottom: 0.5vh;
        &.strong {
          font-weight: 700;
          font-size: $size-s;
          color: $titleColor;
        }
        &:nth-child(2) {
          margin-bottom: 1.5vh;
        }
        &.normal {
          color: $valueColor;
          font-size: $size-w;
        }
      }
    }
  }
}
.addBox {
  border-top: $border;
  width: 100vw;
  margin: 0 -5vw;
  padding: 10px 5vw;
  position: fixed;
  bottom:10vh;
  z-index: 100;
}
</style>

