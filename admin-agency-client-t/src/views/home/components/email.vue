<template>
  <div class="mailBox">
    <div class="mailBg" @click="hideMail"></div>
    <div class="layerBox">
      <header>
        <div class="backIcon" @click="backList"><img v-if="sub" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAByklEQVRIS+3Wz4vNURjH8dcwDREjC4n8iIUpv1bKbrC1Q5myUqPIZAbZiIyFsrBVpmYxsbKQrCxlgx2ZfwAp09jJYkZkeurc+s6d+733XL73Tsmz+3Z+vM/zeZ7zOd8eyxQ9y8T1H9xK+TU4j0f42mpys/FcqdfhIq5hI3bgUyfB/biEK9hQAHUMHFldxigi2/qoHLwJV5Osa5tI+QbzdeNz+JxK8BHv8bZsj1qNV+AOxrD6b2pXt/ZVSiQOuiiKzbUF13EOfRXCf2IEE8U9G3X1dtzEWawsOcBpzJaMrcchDGNzmvMbx/G8tqbZddqFWzjT4AA5zRV3/iFOJlhcv90IBbIscw/GEVnWDpoDjv1DsWcp2/g+gae54Jo6+3A7Lc4Fx9ptBbO5n+qdlXF9Kfcjrsu3NhrwQ3K7FzjWbsZtcJZMfY3DmMaBboLf4WC3wb34jlV4iSPdyjg6+UkS/wEudAMcBhL13ZnAQ3jcSXDIehST2JqgXxCu2NRABtPCdjo5/D2caQB7G7jdqYLkpfc4rDLcqoqI5/MG7rV6JGK8CnAAp3AXYSCLouyR+BOpf2EmQcLZAvajTLLcn70qJM/KuHJQrtT/LngBCfBIH4F8aaAAAAAASUVORK5CYII=" alt=""></div>
        <div class="title">我的邮箱</div>
        <div class="closeIcon" @click="hideMail"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABwUlEQVRIS+2W2ypFURSGvy1ySA43rrwCSUmJSETkQrn1CN6BV3DtHYicIpFSUhJ5AbmVQ3LIBf01Vs2Wtdaccyn7Zu/Lteec3/r/8c8xVoUq/SpV4lID/5vzPqs7gKeSb9MJPObtLQIvAGvAJHARCe8DjoBVYDlrbx64C7gDGoFXYDwCLugJ0GaKe4H7NLxI8SywAdQbfAo48ygfAA4N+gyMADcxipO1gq8DDcA7MFEAHwL2gVZAULl0WabGyR7VeNuBzwDHqQMFldLmEKj2+lLtwres5p/AtAMfA3YMqjyMFilNDgwFa70Aeym4SpC8kKAqxXnIDYgBZ8HrrARR0BirXRGutXr+ZkEKUlrG6mTPsKW3xR740p7pfKzVg9aRBFXIvoEmu2pZac8tdwxYUF0Z3dMk2To4Hbj0VfuTYhcqa1116bTPAQe+ZIco7rfeK6VKb1brdOFfgDpeIdwHFlRTpj1gWLhp98KLwD3AqUFfrDn4xqPbOgWft3b7y/k8cDdwDSTDXA3/ylc3+9+FfwA66yFmLK4ASzbabgOhyTLBd4FFYLPMWCz8fPG8TOFnky9ckULDl9fA4V79cWXVrP4BKUFhH33txJQAAAAASUVORK5CYII=" alt=""></div>
      </header>
      <section v-if="!sub">
        <cube-scroll class="scrollBox" ref="scroll" :data="mailData" :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
          <ul>
            <li :class="item.state?'':'unread'" v-for="item in mailData" :key="item._id" @click="readEmail(item._id)">
              <div class="mailTitle">{{item.title}}</div>
              <div class="dateTime">{{item.createTime | dateFormat}}</div>
            </li>
          </ul>
        </cube-scroll>

      </section>
      <section v-if="sub" class="mailContent">
        <dl>
          <dt>{{mailDetail.title}}<em>{{mailDetail.createTime | dateFormat}}</em></dt>
          <dd>{{mailDetail.content}}</dd>
        </dl>
      </section>
    </div>
  </div>

</template>
<script>
import { getAgencyMailList, readAgencyMail } from "@/api/agent/home/home";
import { xutil } from "@/utils/xutil";
import { resolve } from "url";
export default {
  data() {
    return {
      mailData: [],
      sub: false,
      page: 1,
      count: 10,
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
      },
      mailDetail: {},
      dataMore: true
    };
  },
  filters: {
    dateFormat(value) {
      let newDate = new Date(value);
      let sdate = newDate.toLocaleString(undefined, { hour12: false });
      return sdate;
    }
  },
  created() {
    this.loadMail();
  },
  methods: {
    loadMail() {
      return new Promise((resolve, reject) => {
        let queryItem = {
          page: this.page,
          count: this.count
        };
        getAgencyMailList(queryItem).then(res => {
          if (res.data.err) {
            xutil.toastWarn(res.data.err);
            reject();
            return;
          }
          this.mailData = this.mailData.concat(res.data.msg.pageData);
          resolve(res.data.msg);
        });
      });
    },
    backList() {
      this.sub = false;
      for (let i in this.mailData) {
        if (this.mailDetail._id == this.mailData[i]._id) {
          this.mailData[i].state = true;
        }
      }
    },
    readEmail(id) {
      readAgencyMail({ id: id }).then(res => {
        if (res.data.err) {
          xutil.toastWarn(res.data.err);
          return;
        }
        this.sub = true;
        this.mailDetail = res.data.msg;
      });
    },
    hideMail() {
      this.$emit("hideMail");
    },
    onPullingUp() {
      console.log("上拉加载");
      console.log(this.dataMore);
      if (!this.dataMore) {
        this.$refs.scroll.forceUpdate();
        return;
      }
      this.page++;
      this.loadMail().then(res => {
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
      this.mailData = [];
      this.loadMail().then(res => {
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
.mailBox {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
}
.mailBg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1;
}
.layerBox {
  width: 80vw;
  height: 60vh;
  position: absolute;
  top: 20vh;
  left: 10vw;
  background: #fff;
  z-index: 2;
  header {
    height: 6vh;
    display: flex;
    align-items: center;
    border-bottom: $border;
    .backIcon {
      flex: 1;
      @include middle;
      img {
        transform: scale(0.8);
        content: none;
      }
    }
    .title {
      flex: 8;
      @include middle;
    }
    .closeIcon {
      flex: 1;
      @include middle;
      img {
        transform: scale(0.8);
        content: none;
      }
    }
  }
  section {
    padding: 0 2vw;
    height: 52vh;
    overflow-y: auto;
    .scrollBox {
      height: 52vh;
    }
    li {
      height: 6vh;
      display: flex;
      align-items: center;
      border-bottom: $border;
      opacity: 0.5;
      .mailTitle {
        flex: 3;
        padding-right: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: $titleColor;
        font-size: $size-w * 0.9;
      }
      .dateTime {
        flex: 2;
        color: $valueColor;
        font-size: $size-w * 0.6;
      }
      &.unread {
        opacity: 1;
        &::before {
          content: "";
          background: #f00;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }
    &.mailContent {
      padding-top: 2vh;
      dt {
        color: $titleColor;
        font-size: $size-w;
        text-align: center;
        em {
          font-size: $size-w * 0.8;
          opacity: 0.8;
          display: block;
          margin: 10px 0 20px;
        }
      }
      dd {
        font-size: $size-w;
        line-height: 3vh;
      }
    }
  }
}
</style>
