<template>
  <div class="content">
    <div class="header">
      <div class="back" @click="toHome"></div>
      <div class="text">推广基金池</div>
      <div class="rightIcon" @click="fundRecord"></div>
      <div class="rightIcon" @click="ranking"></div>
    </div>
    <dl class="main">
      <dt>
        {{totalFund}}
        <em>元</em>
      </dt>
      <dd>
        <cube-button class="btnBlue" @click="open" v-if="state==1">开启</cube-button>
        <cube-button :disabled="true" class="btnBlue" v-if="state==4||state==2||(totalFund==0&&state!=1&&state!=5)" style="background:#ccc;border:solid 4px #ccc;">领取</cube-button>
        <cube-button class="btnBlue" v-if="(state==3||state==6)&&totalFund!=0" @click="receiveFuc">领取</cube-button>
        <cube-button :disabled="true" style="background:#ccc;border:solid 4px #ccc;" class="btnBlue" v-if="state==5">已领取</cube-button>
      </dd>
    </dl>
    <div class="textContent">
      <section>
        <h3>参与条件</h3>
        <div class="info">完成新手任务。</div>
      </section>
      <section>
        <h3>内容介绍</h3>
        <div class="info">《推广基金池》可每日累计推广基金，具体累计金额由直推税收决定，奖次金额累计无上限，领取后为止。</div>
      </section>
      <section>
        <h3>金额算法</h3>
        <div class="info">可领取金额=每日直推税收*（{{taxRate}}-当日点位）</div>
      </section>
      <section>
        <h3>注意事项</h3>
        <ul class="info">
          <li>1.代理点位达到{{taxRate}}才可领取</li>
          <li>2.每个代理只可领取1次奖励</li>
          <li>3.奖励领取后可直接提现</li>
          <li>4.活动最终解释权归平台所有</li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
import {
  getBonusPool,
  receiveBonusPool,
  openBonusPool
} from "@/api/agent/activity/bonusPool";
import { xutil } from "../../utils/xutil";
export default {
  data() {
    return {
      totalFund: 0,
      state: 0,
      taxRate: ""
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    toHome() {
      this.$router.push({ path: "/home" });
    },
    loadData() {
      getBonusPool().then(res => {
        this.totalFund = res.data.msg.totalFund;
        this.state = res.data.msg.state;
        this.taxRate = parseFloat(res.data.msg.taxRate).toFixed(2) * 100 + "%";
      });
    },
    receiveFuc() {
      receiveBonusPool().then(res => {
        xutil.toastSuccess("领取成功！");
        this.loadData();
      });
    },
    fundRecord() {
      this.$router.push({
        name: "/fundRecord",
        path: "/fundRecord",
        query: { path: "/fundRecord" }
      });
    },
    ranking() {
      this.$router.push({
        name: "/ranking",
        path: "/ranking",
        query: { path: "/ranking" }
      });
    },
    open() {
      openBonusPool().then(res => {
        xutil.toastSuccess("开启成功！");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: url(#{$imgUrl}bonus_bg.jpg) no-repeat center 8vh;
  background-size: 100% 100%;
  padding-bottom: 20px;
}
.header {
  .rightIcon {
    flex: 1;
    height: 100%;
    @include middle;
    background: url(#{$imgUrl}history.png) no-repeat center center;
    background-size: 45%;
    &:last-child {
      background: url(#{$imgUrl}paiming.png) no-repeat center center;
      background-size: 45%;
    }
  }
}
.main {
  text-align: center;
  border-radius: 10px;
  margin: 30px 10vw 20px 10vw;
  padding: 30px 0;
  dt {
    line-height: 90px;
    font-size: 120px;
    font-weight: 700;
    margin-bottom: 40px;
    margin-top: 30px;
    color: yellow;
    em {
      font-size: 90px;
      font-weight: 700;
    }
  }
  dd {
    .btnBlue {
      display: block;
      margin: 0 auto;
      background: #ffa333;
      border-radius: 20px;
      width: 240px;
      height: 70px;
      padding: 0;
      font-size: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.btns {
  display: flex;
  padding: 20px;
  .btnBlue {
    flex: 1;
    margin: 0 10vw;
    padding: 0;
    height: 50px;
    line-height: 50px;
    font-size: 30px;
  }
}
.textContent {
  background: #fff;
  margin: 0 5vw;
  padding: 20px 0;
  border-radius: 10px;
}
section {
  margin: 0 0 10px 30px;
  h3 {
    line-height: 40px;
    margin-bottom: 20px;
    font-size: 36px;
    color: #da6ed8;
    font-weight: 700;
  }
  .info {
    line-height: 45px;
    font-size: 28px;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
