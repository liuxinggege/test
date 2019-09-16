<template>
  <div class="content">
    <div class="header">
      <div class="back" @click="toHome"></div>
      <div class="text">推广赚钱</div>
    </div>
    <div class="inner">
      <img src="~resources/images/tg_bg.jpg" width="640" height="2596" class="pageBg" alt />
      <div class="domainList">
        <div class="dmItem" v-for="(item,index) in domainList" :key="index">
          <div class="dmImg">
            <img :src="getImgUrl(item.name)" alt />
          </div>
          <dl class="dmInfo">
            <dt>{{item.downloadUrl}}</dt>
            <!-- <dd class="linkData"><span>访问量：{{item.views}}</span><span>下载量：{{item.download}}</span></dd> -->
            <dd class="btnBox">
              <input type="button" class="dmBtn" :data-clipboard-text="item.downloadUrl" value="复制推广链接" />
              <input type="button" class="dmBtn" @click="downloadQrcode(item.name)" value="下载二维码" />
              <input type="button" class="dmBtn" @click="changeBg(item)" value="更换模板" />
              <input type="button" class="dmBtn" :style="{backgroundColor:item.type === 1?'rgb(154,205,50)':'rgb(214,160,84)'}" :value="item.type === 1?'地推域名':'线上域名'" />
            </dd>
          </dl>
        </div>
      </div>
      <ul class="zhinan">
        <li>保存推广网址或图片到手机上</li>
        <li>把网址或图片发给身边朋友下载玩游戏</li>
        <li>加入更多微信、QQ群发生广告招揽玩家</li>
        <li>贴吧、论坛、博客，只要可以交流的地方就可以招揽玩家</li>
        <li>大量印刷图片传单发送</li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SpreadSettingState } from "../../store/stateInterface";
import handleClipboard from "../../utils/clipboard";
import Clipboard from "clipboard";
import QRCode from "qrcode";
import MCanvas from "mcanvas";
import { xutil } from "../../utils/xutil";
import {
  promotionLoad,
  getSpreadSettingData
} from "../../api/agent/spreadSetting/spreadSetting";
interface QueryItem {
  page: number;
  count: number;
  templateId: number;
}
var opts = {
  errorCorrectionLevel: "H",
  type: "image/png",
  rendererOpts: {
    quality: 0.95
  },
  width: 1600
};

@Component
export default class SpreadSetting extends Vue {
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
  url: string = "";
  page: number = 1;
  count: number = 1;
  totalCount: number = 0;
  domainList: any = [];
  created() {
    this.fuzhi();
    this.loadDomainList();
  }
  getImgUrl(fileName) {
    return process.env.BASE_API+"/images/"+fileName
  }
  changeBg(item) {
    item.page++;
    if (item.page > this.totalCount) {
      item.page = 1;
    }
    let queryItem = {
      url: item.downloadUrl,
      page: item.page,
      count: this.count
    };
    (this as any).$vux.loading.show({ text: "加载中" });
    getSpreadSettingData(queryItem).then((res: any) => {
      if (res.data.code != 200) {
        return;
      }
      if (!res.data.msg) {
        xutil.toastText("没有数据了");
        return;
      }
      item.name = res.data.msg;
      (this as any).$vux.loading.hide();
    });
  }
  downloadQrcode(name) {
    let url: any = this.getImgUrl(name);
    if (url) {
      window.open(url);
    }
  }
  fuzhi() {
    let itemBoard = new Clipboard(".dmBtn");
    itemBoard.on("success", function(e) {
      xutil.toastText("复制成功");
    });
    itemBoard.on("error", function(e) {
      xutil.toastText("复制失败");
    });
  }
  loadDomainList() {
    promotionLoad()
      .then(res => {
        console.log(res.data.msg);
        if (res.data.code != 200) {
          return;
        }
        this.domainList = res.data.msg.pageData;
        this.totalCount = res.data.msg.totalCount;
        this.domainList.forEach((item, index) => {
          this.domainList[index].page = 1;
        });
      })
      .catch(err => {
        xutil.toastWarn(err.err);
      });
  }
  toHome() {
    this.$router.push({ path: "/home" });
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bli: 100vw/1080px;
.inner {
  position: relative;
}
.header {
  position: relative;
  z-index: 10;
}
.pageBg {
  position: absolute;
  left: 0;
  width: 100vw;
  top: 0;
  z-index: 0;
  height: auto;
  content: none;
}
.link {
  height: $bli * 340px;
  flex-direction: column;
  position: absolute;
  z-index: 1;
  top: $bli * 593px;
  @include middle;
  width: 100%;
  dt {
    flex: 1;
    font-size: $bli * 44px;
    color: $blue;
    @include middle;
  }
  dd {
    flex: 1.5;
    @include middle;
  }
  .btnCopy {
    width: $bli * 640px;
    height: $bli * 130px;
    background-image: linear-gradient(90deg, #ffc62b 1%, #ffb42b 100%),
      linear-gradient(#ffb42b, #ffb42b);
    background-blend-mode: normal, normal;
    box-shadow: 0px $bli * 7px $bli * 20px 0px rgba(255, 193, 59, 0.84);
    border-radius: $bli * 65px;
  }
}
.imgList {
  display: flex;
  flex-direction: column;
  height: $bli * 1200px;
  top: $bli * 1013px;
  position: absolute;
  width: 100%;
  @include middle;
  .btnCopy {
    width: $bli * 640px;
    height: $bli * 130px;
    background-image: linear-gradient(90deg, #f88444 0%, #f64b4b 100%),
      linear-gradient(#ffb42b, #ffb42b);
    background-blend-mode: normal, normal;
    box-shadow: 0px $bli * 7px $bli * 24px 0px rgba(255, 110, 88, 0.84);
    border-radius: $bli * 65px;
  }
}
.domainList {
  display: flex;
  flex-direction: column;
  height: $bli * 1200px;
  top: $bli * 780px;
  position: absolute;
  padding: 0 5vw;
  width: 100vw;
  .dmItem {
    color: #333;
    display: flex;
    flex: 1;
    padding: 10px 0;
    max-height: 280px;
    .dmImg {
      flex: 0.5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5vw;
      background: #ccc;
      img {
        width: 23vw;
        height: 19vh;
        content: none;
      }
    }
    .dmInfo {
      flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      dt {
        flex: 1;
        color: $titleColor;
        font-size: $size-w * 0.8;
        word-break: break-all;
      }
      .linkData {
        flex: 1;
        color: $valueColor;
        font-size: $size-w * 0.6;
        span {
          margin-right: 20px;
        }
      }
      .btnBox {
        flex: 3;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .dmBtn {
          width: 40%;
          height: 50px;
          margin-right: 5%;
          background: $blue;
          font-size: $size-w * 0.8;
          color: #fff;
          border-radius: 10px;
        }
        // .dmBtn.dmBtnTagD {
        //   background-color: blue;
        // }
        // .dmBtn.dmBtnTagX {
        //   background-color: blue;
        // }
      }
    }
  }
}
.slider {
  height: $bli * 870px;
  width: $bli * 1000px;
  margin: $bli * 80px 0 $bli * 74px 0;
  display: flex;
  .imgBox {
    height: 100%;
    @include middle;
    flex: 4;
    img {
      max-height: 100%;
      max-width: 100%;
      height: auto;
    }
  }
  .prev,
  .next {
    flex: 1;
    @include middle;
    img {
      width: 15vw;
      content: none;
    }
  }
}
.zhinan {
  height: $bli * 750px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: $bli * 2290px;
  position: absolute;
  z-index: 1;
  padding: 4vh 10vw;
  li {
    $bg-size: 13%;
    line-height: 3vh;
    padding-left: 15%;
    min-height: 5vh;
    display: flex;
    align-items: center;
    &:nth-child(1) {
      background: url(#{$imgUrl}tg-1.png) no-repeat left $bli * 20px;
      background-size: $bg-size;
    }
    &:nth-child(2) {
      background: url(#{$imgUrl}tg-2.png) no-repeat left $bli * 20px;
      background-size: $bg-size;
    }
    &:nth-child(3) {
      background: url(#{$imgUrl}tg-3.png) no-repeat left $bli * 20px;
      background-size: $bg-size;
    }
    &:nth-child(4) {
      background: url(#{$imgUrl}tg-4.png) no-repeat left $bli * 20px;
      background-size: $bg-size;
    }
    &:nth-child(5) {
      background: url(#{$imgUrl}tg-5.png) no-repeat left $bli * 20px;
      background-size: $bg-size;
    }
  }
}
</style>
