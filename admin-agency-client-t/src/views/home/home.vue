<template>
  <div class="content tab1">
    <div class="wrapper">
      <div class="indexheader">
        <div class="pageTitle">代理后台</div>
        <div class="reload" @click="loadData"></div>
      </div>
      <div class="userBox">
        <div class="email" v-if="home.mail!=0" @click="hasMail=true">
          <em v-if="home.mail==2"></em>
          <img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADFwAAAxcBwpsE1QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPOSURBVGiB7ZhLbFR1FIe/c+8I1M7cO1Oa4iNGEw2JEjGCaJnpFCok1cSkgYrigx2hK7dAID4WkFiWsNIQiYaYBqEJiUbcaJxHQdsEQjQS06CJRiFg5z5aGOjMPW5QS6kt084wDbnfdv6P7+Qm8/+dAyEhISEhdUDcnK31lqgGRr0FqoUB3B1fRNToAtx6i8yBAPQdAfjr26aHImb5GLCqzlKVcsEQeTWWcjKGk7VXLl4z8tu18QXPi3K03mYVcFrLJGMpJ+Pnoy2GCKecrL2jpePSqJV2N6nSA1yvt+W0qOy3PHd1fI37i5Ox1wVq/jDh71cOW0Z0myR/v+rlEm2KHgG9v77Gt3AF0R475R0GcLL2DhH2AJHJ78jpwJSNidXOr2O55gdKjB8FVtdF+VbOByLdiZRz5sJXSxob7i0eRNj8z4+T35GnjbIOOll7fWPb5T8sz+1AZf8dFp6KExi6KpFyzvgno483NBaHJhYB//+yl1XZHU+7vQBu1tqiIh8INNwR7f8IVNllt7n7RFAnb3eLcgiITV44fURR+q5eWbT1vs6LY07GXiEGx4BHaud9EwVEt9gp7ws9guk/aO9VZTsgUy2eMWsJnA2UDfG0e977JtasEaMPYV1N1CfcqYZ220lv2M9HW1TNPoWO6fbMmLUUlosw6A5YnVaHf9kquS+I0Fs97Un3KYdi4+5zdtIbdgesZwM1h2YqAipLvyrCvljS3SVC4OatzagcBBrnpv4v11V5K552PwTwcvZWhQPAotvZXHmMF/m8vFDebHqm4I5kEstNI+gHHq1Y++ZD/5SgvMlq9/P6Iwt8xz6gyrZKTqg8xqu+ZBaD7/1c07Km9sLZUsRcAXq84nNuIPC1EZSestr9fCEff9gr2AOVFgGz70eWBpRPOnm7e3HriGelvA2q7ASCSg4RoTc27nbG2kcvOVl7vaE6BKycjdBcGquYKJ95eft9QOJpt1c06AKc29g7hurrVsrdyVrKN6LGCaB5tjLVanW/VOWNeNoteNnYUhXpB1k25UrlJzGDjVbSPzcylLDNYvljkK65ClSr1X1RhMHRgcSTVtr/+dr4wtapWgKF/tI9ZquV9M/5megTZjH4rhpFQPWHD0VUeuy084kq4ubs7SLsBVBl94So8bIoHzFF1JgttZiiKMgeK+W8J0Lg5eNdAFbKOa6KeHnrbZB3qfLgo2bjIIVMJFJ6Jdo6dhFg9FTjkqAU6VNYW4v7aj3XGlZ4TUQFlU+Bx2p1UTigm2+Ehcw3wkLmG2Eh842wkPnGXVNISEhISEhd+BsUhZWaA0kwIwAAAABJRU5ErkJggg==" alt>
        </div>
        <dl class="userInfo">
          <dt>
            <img src="~resources/images/head2.png" alt>
          </dt>
          <dd class="username" @click="myInfo">{{name}}</dd>
          <dd class="setText" @click="myInfo">进入个人中心设置个人信息>></dd>
          <dd class="infos">
            <li>代理id:{{agencyId}}</li>
            <li>分成比例:{{taxRate}}</li>
            <li>渠道号:{{channel||"-"}}</li>
          </dd>
        </dl>
        <dl class="shuishou">
          <dt @click="tadayTaxDetail">
            <span>今日税收</span>
            <em></em>
          </dt>
          <dd>
            ¥
            <em>{{home.todayGameTax}}</em>
          </dd>
        </dl>
        <div class="boxBottom">
          <dl>
            <dt>今日注册</dt>
            <dd>{{home.todayNewUserCount}}</dd>
          </dl>
          <dl>
            <dt>总注册</dt>
            <dd>{{home.totalNewUserCount}}</dd>
          </dl>
          <dl>
            <dt>{{department=='two'?'有效客户':'总利润'}}</dt>
            <dd v-if="department=='two'">{{home.aliveCustom}}</dd>
            <dd v-else>{{home.totalGameTaxIncome>100000?Math.round(home.totalGameTaxIncome):home.totalGameTaxIncome}}</dd>
          </dl>
          <dl>
            <dt>总税收{{home.level}}</dt>
            <dd>{{home.totalGameTax>100000?Math.round(home.totalGameTax):home.totalGameTax}}</dd>
          </dl>
        </div>
      </div>
      <router-link v-if="level!=1" class="advLink" to="/spreadSetting">
        <img src="~resources/images/adv-img.png" alt>
      </router-link>
      <div class="zixun">
        <div class="zxHeader">
          <h2>
            最新资讯
            <em>({{home.gonggaoNotRead+home.gonglueNotRead}}未读)</em>
          </h2>
          <a class="more" @click="announcement">更多</a>
        </div>
        <div class="zxPic" @click="toAnnouncement(home.one)">
          <img v-if="home.one&&home.one.imgUrl" :src="home.one.imgUrl" alt>
          <img v-else src="~resources/images/bg_banner22.png" alt>
        </div>
        <div class="zxPic" @click="toAnnouncement(home.two)">
          <img v-if="home.two&&home.two.imgUrl" :src="home.two.imgUrl" alt>
          <img v-else src="~resources/images/bg_banner3.png" alt>
        </div>
      </div>
    </div>
    <div v-if="!firstDisabled&&department=='one'" class="firstDisabled">
      <div class="bg"></div>
      <div class="img-close">
        <img class="img-close" src="~resources/images/ic_close.png" @click="close()">
      </div>
      <div class="img">
        <img class="img" src="~resources/images/xinshou_home.png" @click="toActivity('/novice')">
      </div>
    </div>
    <div id="resave_grap" v-if="resave_grap">
      <div class="resave_content">
        <img class="resave_close" src="../../assets/img/ic_close.png" alt @click="resave_grap=false">
        <img class="resave_img" src="../../assets/img/home/resave1.png" alt @click="toResave">
        <div class="resave_btn">
          <img src="../../assets/img/home/resave_btn.png" alt @click="toResave">
        </div>
      </div>
    </div>
    <div class="bonusPool" v-if="home.fundReserve&&showLayer&&department=='one'" @click="hideBonusPool">
      <img src="~resources/images/bonusPool_layer.png" @click="goBonus" style="width:90vw;">
    </div>
    <div v-if="home.fundFlag&&department=='one'" class="bonusPool">
      <div class="bonusPoolIn">
        <dl>
          <dd>推广基金奖励已发放，请查收</dd>
        </dl>
        <cube-button class="btnBlue" @click="setFlgFalse">确定</cube-button>
      </div>
    </div>
    <tabbar></tabbar>
    <email v-if="hasMail" @hideMail="hideMail"></email>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { RouterCfg } from "../../router/router";
import Component from "vue-class-component";
import { HomeState } from "../../store/stateInterface";
import { xutil } from "../../utils/xutil";
import { Swiper, XTextarea, Group } from "vux";
import { PID } from "../../const/status";
import tabbar from "../../components/tabbar.vue";
import email from "./components/email.vue";
import { fundFlagFalse } from "../../api/agent/home/home";
import home from "../../store/modules/home/home";
@Component({
  components: {
    tabbar,
    email
  }
})
export default class Home extends Vue {
  gridArr: RouterCfg[] = [];
  act: string = "";
  newPwd1: string = "";
  channels: string[] = [];
  home: HomeState = this.$store.state.home; //表单数据
  data = this.$store.state.selfInfo.selfInfo;
  timeRun: any = "";
  agencyId: string = "";
  taxRate: string = "";
  channel: string = "";
  name: string = "";
  phone: string = "";
  reg: string = "";
  setTimeOutMsg: string = "";
  setTimeOutflg: number = 60;
  disabled: boolean = false;
  firstDisabled: boolean = true;
  hasMail: boolean = false;
  level: any = "";
  department = process.env.DEPART_MENT;
  showLayer: boolean = false;
  resave_grap: boolean = false;
  created() {
    this.home.mail = 0;
  }
  mounted() {
    let firstBind = this.$route.params.firstBind;
    this.gridArr = this.$store.state.permission.gridRouters;
    let userInfo = JSON.parse(<any>sessionStorage.getItem("userInfo"));
    this.agencyId = userInfo.agencyId;
    this.channel = userInfo.channel;
    this.taxRate = userInfo.taxRate;
    this.name = userInfo.name;
    this.level = userInfo.level;

    if (!userInfo.phone && this.department != "two") {
      this.$router.push({ path: "/bindPhone" });
    }
    if (firstBind === "true") {
      let userInfo = JSON.parse(<any>sessionStorage.getItem("userInfo"));
      let flag = false;
      let startDate = new Date("2018-11-06T16:00:00.000Z").getTime();
      if (
        userInfo.createDate &&
        new Date(userInfo.createDate).getTime() > startDate
      ) {
        flag = true;
      }
      if (flag) {
        this.firstDisabled = false;
      }
    }
    if (userInfo.urlChangeFlag) {
      this.resave_grap = true;
    }
    this.loadData();
  }
  hideMail() {
    this.hasMail = false;
    this.loadData();
  }
  setFlgFalse() {
    fundFlagFalse();
    this.home.fundFlag = false;
  }
  loadData() {
    xutil.myDispatch(this.$store, "GetHomeData", {}).then(() => {
      this.home = this.$store.state.home;
      if (!sessionStorage.getItem("openLayer")) {
        this.showLayer = true;
      } else {
        this.showLayer = false;
      }
    });
  }
  hideBonusPool() {
    sessionStorage.setItem("openLayer", "ready");
    this.showLayer = false;
  }
  toResave() {
    let resave_grap = document.getElementById("resave_grap");
    resave_grap.setAttribute("style", "display: none");
    this.$router.push({ path: "/spreadSetting" });
    let userInfo = JSON.parse(<any>sessionStorage.getItem("userInfo"));
    userInfo.urlChangeFlag = false;
    xutil.sessionStorageSetItem("userInfo", userInfo); //将用户数据存放入sessionStorage
    xutil.myDispatch(this.$store, "SetChangeChannelFlagFlase", {}, true);
  }
  tadayTaxDetail() {
    xutil.alert("今日税收等于代理当日直推税收与下级当日总税收之和");
  }
  fun() {}
  to(path) {
    this.$router.push({ path: path });
  }
  toActivity(path) {
    this.$router.push({ path: path });
  }

  toAnnouncement(item) {
    if (item === undefined) {
      xutil.toastCancel("暂无公告");
      return;
    }
    this.$router.push({
      name: "/announcement-html",
      path: "/announcement-html",
      query: { item, path: "/home" }
    });
    if (item.redDot) {
      xutil.myDispatch(
        this.$store,
        "ReadAgencyBillboard",
        { id: item._id },
        true
      );
    }
  }
  myInfo() {
    this.$router.push({
      name: "/selfInfo",
      path: "/selfInfo",
      query: { path: "/home" }
    });
  }
  close() {
    this.firstDisabled = true;
  }
  announcement() {
    this.$router.push({
      name: "/announcement",
      path: "/announcement",
      params: {
        gonggaoNotRead: JSON.stringify(this.home.gonggaoNotRead),
        gonglueNotRead: JSON.stringify(this.home.gonglueNotRead)
      }
    });
  }
  goBonus() {
    this.$router.push({
      name: "/bonusPool",
      path: "/bonusPool",
      query: { path: "/bonusPool" }
    });
  }
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  background: url(#{$imgUrl}home-bg.jpg) no-repeat center top fixed;
  background-size: 100% auto;
  padding-bottom: 12vh;
}
.wrapper {
  width: 88vw;
  margin: 0 auto;
}
.email {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  img {
    max-width: 100%;
    max-height: 100%;
    content: none;
  }
  em {
    position: absolute;
    top: -2px;
    right: -4px;
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background: #f00;
    display: block;
  }
}
.indexheader {
  height: 10vh;
  display: flex;
  justify-content: space-between;
  font-size: $size-xl;
  color: #fff;
  align-items: center;
}
.reload {
  background: url(#{$imgUrl}reload.png) no-repeat center center;
  background-size: 80%;
  width: 10vw;
  height: 100%;
}
.userBox {
  width: 100%;
  background: #fff;
  box-shadow: 0px 6px 28px 0px rgba(171, 198, 239, 0.59);
  border-radius: 2vh;
  margin-top: 8vh;
  margin-bottom: 3vh;
  position: relative;
  border: solid 1px #fff;
  .userInfo {
    width: 80%;
    margin: 0 auto 4vh auto;
    position: relative;
    margin-top: -9vw;
    dt {
      width: 18vw;
      height: 18vw;
      border-radius: 6px;
      margin: 0 auto;
    }
    img {
      width: 100%;
      height: 100%;
      content: none;
    }
    .username {
      height: 5vh;
      @include middle;
      font-size: $size-l;
      font-weight: 700;
      color: $titleColor;
    }
    .infos {
      display: flex;
      justify-content: space-between;
      font-size: $size-m * 0.7;
    }
    .setText {
      text-align: center;
      margin-bottom: 2vh;
      color: $valueColor;
      font-size: $size-w;
    }
  }
  .shuishou {
    width: 90%;
    margin: 0 auto;
    dt {
      font-size: $size-xl;
      color: $color-b;
      display: flex;
      align-items: center;
      color: $valueColor;
      em {
        width: $size-xl;
        height: $size-xl;
        display: block;
        background: url(#{$imgUrl}wenhao.png) no-repeat center center;
        background-size: 100%;
      }
    }
    dd {
      font-size: $size-m;
      font-weight: 700;
      color: $blue;
      height: 10vh;
      @include middle;
      border-bottom: solid 1px#e5e5e5;
      em {
        font-size: $size-xxl * 1.2;
        font-weight: 700;
      }
    }
  }
  .boxBottom {
    display: flex;
    margin-top: 4vh;
    justify-content: space-between;
    padding-bottom: 2vh;
    dl {
      height: 6vh;
      border-right: solid 1px #f0f0f0;
      flex: 1;
    }
    dl:last-child {
      border: none;
    }
    dt {
      font-size: $size-w;
      margin-bottom: 2vh;
      @include middle;
      width: 100%;
      color: $valueColor;
    }
    dd {
      font-size: $size-w;
      color: $blue;
      @include middle;
      width: 100%;
    }
  }
}
.advLink {
  display: block;
  @include middle;
  margin-bottom: 3vh;
  img {
    width: 100%;
    height: 100%;
    content: none;
  }
}
.zxHeader {
  height: 6vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    white-space: nowrap;
    font-size: $size-xl;
    color: $titleColor;
  }
  h2 em {
    font-size: $size-s;
    margin-left: 2vw;
    color: $red;
  }
  .more {
    width: 20vw;
    border-radius: 3vh 0 0 3vh;
    background: $blue;
    color: #fff;
    font-size: $size-w;
    display: block;
    @include middle;
    height: 100%;
  }
}
.zxPic {
  width: 100%;
  margin-top: 3vh;
  img {
    max-width: 100%;
    border-radius: 10px;
    content: none;
  }
}
.firstDisabled {
  .bg {
    background-color: #000000;
    position: fixed;
    z-index: 10;
    right: 0;
    top: 0;
    opacity: 0.8;
    width: 100vw;
    height: 100vh;
  }
  .img-close {
    position: fixed;
    z-index: 11;
    left: 90px;
    top: 165px;
    text-align: center;
    width: 35px;
    height: 40px;
    content: none;
  }
  .img {
    position: fixed;
    z-index: 10;
    left: 60px;
    top: 200px;
    text-align: center;
    width: 507px;
    height: 503px;
    content: none;
  }
}
#resave_grap {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 10;
  top: 0;
  display: none;
  .resave_content {
    position: relative;
    .resave_close {
      width: 50px;
      position: absolute;
      top: 20px;
      right: 20px;
      content: none;
    }
    .resave_img {
      display: inline-block;
      width: 100%;
      margin-top: 20vh;
      content: none;
    }
    .resave_btn {
      position: absolute;
      bottom: 19.25vw;
      right: 32.25vw;
      img {
        width: 200px;
        content: none;
      }
    }
  }
}
.bonusPool {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .bonusPoolIn {
    width: 60vw;
    background: #fff;
    padding: 30px 0;
    dl {
      padding: 0 30px;
      margin-bottom: 20px;
      text-align: center;
      dt {
        height: 60px;
        line-height: 60px;
        font-size: 40px;
      }
      dd {
        line-height: 30px;
        font-size: 28px;
      }
    }
    .btnBlue {
      display: block;
      margin: 0 auto;
      width: 120px;
      height: 50px;
      line-height: 50px;
      padding: 0;
    }
  }
}
</style>