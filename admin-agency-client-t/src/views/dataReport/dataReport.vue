<template>
  <div class="content tab2">
    <div class="header">
      <div class="back" @click="toHome"></div>
      <div class="text">数据报表</div>
      <div class="rightIcon" @click="showDatePicker"></div>
    </div>
    <div class="chartInfo">
      <dl class="mainData">
        <dt>预计利润</dt>
        <dd>
          ¥
          <em>{{data.totalIncome}}</em>
        </dd>
      </dl>
      <div class="chartBox">
        <pieChart :theData="chartData"></pieChart>
        <div class="data">
          <dl v-for="item in chartData.rows" :key="item.name">
            <dt>
              <em></em>
              <span>{{item.value}}</span>
            </dt>
            <dd>
              {{item.name}}
              <span>{{item.baifen}}</span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="dataLayer">
      <div class="mainData">
        税收
        <em>{{data.gameTax}}</em>
      </div>
      <div class="subInfo">
        <dl>
          <dt>
            <span>{{data.myChannelTotalGameTax}}</span>
            <img src="~resources/images/up.png">
          </dt>
          <dd>直推税收</dd>
        </dl>
        <dl>
          <dt>
            <span>{{data.subPromotionGameTax}}</span>
            <img src="~resources/images/down.png">
          </dt>
          <dd>下级贡献</dd>
        </dl>
      </div>
    </div>
    <div class="dataLayer zhuce">
      <div class="mainData">
        注册
        <em>{{data.totalNewUserCount}}</em>
      </div>
      <div class="subInfo">
        <dl>
          <dt>
            <span>{{data.myChannelNewUserCount}}</span>
            <img src="~resources/images/up.png">
          </dt>
          <dd>直推注册</dd>
        </dl>
        <dl>
          <dt>
            <span>{{data.subNewUserCount}}</span>
            <img src="~resources/images/down.png">
          </dt>
          <dd>下级贡献</dd>
        </dl>
      </div>
    </div>
    <div class="otherData">
      <h2>其他数据指标</h2>
      <div v-if="department=='two'">
        <div class="otherBox two">
          <div class="dl">
            <div class="dt">{{data.totalChargeUserCount}}</div>
            <div class="dd">充值人数</div>
          </div>
          <div class="dl">
            <div class="dt">{{data.totalGameUserCount}}</div>
            <div class="dd">活跃人数</div>
          </div>
          <div class="dl">
            <div class="dt">{{data.newAgency}}</div>
            <div class="dd">新增代理</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="otherBox">
          <div class="dl">
            <div class="dt">{{data.totalChargeUserCount}}</div>
            <div class="dd">充值人数</div>
          </div>
          <div class="dl">
            <div class="dt">{{data.totalChargeAmt}}</div>
            <div class="dd">充值</div>
          </div>
        </div>
        <div class="otherBox">
          <div class="dl">
            <div class="dt">{{data.totalGameUserCount}}</div>
            <div class="dd">活跃人数</div>
          </div>
          <div class="dl">
            <div class="dt">{{data.totalWithdrawAmt}}</div>
            <div class="dd">兑换</div>
          </div>
        </div>
        <div class="otherBox">
          <div class="dl">
            <div class="dt">{{data.newAgency}}</div>
            <div class="dd">新增代理</div>
          </div>
          <div class="dl">
            <div class="dt">{{data.totalProfit}}</div>
            <div class="dd">营收</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnBox">
      <cube-button class="btn" @click="toChildData">查看下级数据</cube-button>
      <cube-button class="btn" @click="toIncomeDetail">收入明细</cube-button>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { DataReportDoc } from "../../store/modules/dataReport/dataReport";
import bignumber, { BigNumber } from "bignumber.js";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
import pieChart from "@/components/pieChart.vue";
import tabbar from "@/components/tabbar.vue";
interface QueryItem {
  agencyId?: number;
  act?: string;
  name?: string;
  taxRateStart?: string;
  taxRateEnd?: string;
  channel?: string;
  page?: number;
  count?: number;
  createDateStart?: Date;
  createDateEnd?: Date;
  loginDateStart?: Date;
  loginDateEnd?: Date;
}
var colors = ["#03a9ec", "#9ac4e7", "#2f78ba"];
@Component({
  components: {
    pieChart,
    tabbar
  }
})
export default class DataReport extends Vue {
  sumDate: string = "2015-12-01";
  chartData: any = {
    //图表数据
    columns: ["name", "value"],
    rows: [
      { name: "直推利润", value: 1021 },
      { name: "下级贡献利润", value: 1223 },
      { name: "系统奖励利润", value: 2123 }
    ]
  };
  department = process.env.DEPART_MENT;
  data: DataReportDoc = this.$store.state.dataReport.dataReport;
  created() {
    this.sumDate = formUtil.getDateYYYYMMDDHHmmss(new Date(), false);
    this.loadData();
  }
  mounted() {
    this.loadData();
    // this.chartLine = echarts.init(document.getElementById("chartLine"));
    // this.chartLine.showLoading({ text: "加载中..." });
    // this.drawLineChart(this.data.totalIncome,this.data.yesTotalIncome,this.data.myChannelTotalIncome,this.data.subPromotionProfit);
  }
  async loadData() {
    let date;
    let queryItem: any;
    if (this.sumDate) {
      let utcDate = Date.UTC(
        new Date(this.sumDate).getUTCFullYear(),
        new Date(this.sumDate).getUTCMonth(),
        new Date(this.sumDate).getUTCDate(),
        new Date(this.sumDate).getUTCHours()
      );
      let sdate = new Date(utcDate - 8 * 60 * 60 * 1000);
      queryItem = { sumDate: sdate };
    }
    await xutil.myDispatch(this.$store, "GetDataReport", queryItem).then(() => {
      this.data = this.$store.state.dataReport.dataReport;
      let json = [
        { name: "直推利润", value: this.data.myChannelTotalIncome },
        { name: "下级贡献利润", value: this.data.subPromotionProfit },
        { name: "系统奖励利润", value: this.data.sysIncome }
      ];
      this.chartData.rows = json;
      let title = this.data.totalIncome;
      return;
    });
  }
  showDatePicker() {
    (this as any).$vux.datetime.show({
      cancelText: "取消",
      confirmText: "确定",
      format: "YYYY-MM-DD",
      value: this.sumDate,
      onConfirm: val => {
        this.sumDate = val;
        this.loadData();
      },
      onShow: () => {},
      onHide: () => {
        this.loadData();
      }
    });
  }
  toHome() {
    this.$router.push({ path: "/home" });
  }
  toChildData() {
    this.$router.push({ path: "/childData" });
  }
  toIncomeDetail() {
    this.$router.push({ path: "/incomeDetail" });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  padding-bottom: 12vh;
}
.header {
  .rightIcon {
    width: 15vw;
    height: 100%;
    @include middle;
    background: url(#{$imgUrl}date-icon.png) no-repeat center center;
    background-size: 40%;
  }
}
.chartInfo {
  padding: 2vh 8vw 5vh 5vw;
  .mainData {
    text-align: left;
    margin-bottom: 1vh;
    dt {
      font-size: $size-s;
      margin-bottom: 1vh;
      color: $titleColor;
    }
    dd {
      font-size: $size-s;
      font-weight: 700;
      color: $blue;
    }
    dd em {
      font-size: $size-xl;
      font-weight: 700;
    }
  }
  .chartBox {
    display: flex;
    .data {
      margin-left: 8vw;
      padding-top: 2vh;
      dl {
        margin-bottom: 1.8vh;
        &:nth-child(2) em {
          background: $orange;
        }
        &:nth-child(3) em {
          background: $red;
        }
      }
      dt {
        font-size: $size-w;
        display: flex;
        align-items: center;
        margin-bottom: 1vh;
        em {
          display: block;
          width: 4vw;
          height: 4vw;
          border-radius: 50%;
          background: #2476f1;
        }
        span {
          display: block;
          height: 4vw;
          display: flex;
          align-items: center;
          color: $color-b;
          padding-left: 2vw;
          padding-top: 0.4vh;
          color: $titleColor;
        }
      }
      dd {
        font-size: $size-w;
        color: $color-n;
        text-align: left;
        padding-left: 6vw;
        color: $valueColor * 1.2;
      }
    }
  }
}
.dataLayer {
  width: 90vw;
  margin: 0 5vw;
  border-radius: 10px;
  box-shadow: 0 -2px 5px #eee;
  margin-bottom: 5vh;
  .mainData {
    height: 8vh;
    display: flex;
    margin: 0 4vw;
    text-align: left;
    font-size: $size-s;
    font-weight: 700;
    align-items: center;
    border-bottom: $border;
    background: url(#{$imgUrl}ss-icon.png) no-repeat right 1vh;
    background-size: 15%;
    color: $titleColor;
    em {
      font-size: $size-l;
      font-weight: 700;
      padding-left: 2vw;
      color: $blue;
    }
  }
  &.zhuce {
    .mainData {
      background: url(#{$imgUrl}zc-icon.png) no-repeat right 1vh;
      background-size: 15%;
    }
  }
  .subInfo {
    display: flex;
    height: 8vh;
    align-items: center;
    dl {
      height: 5vh;
      flex: 1;
      padding-left: 4vw;
      &:first-child {
        border-right: $border;
      }
      dt {
        color: $titleColor;
        height: 2vh;
        font-size: $size-s;
        margin-bottom: 1vh;
        line-height: 2vh;
        display: flex;
        img {
          height: 100%;
          margin-left: 1vw;
        }
      }
      dd {
        color: $valueColor * 1.2;
        height: 2vh;
        text-align: left;
      }
    }
  }
}
.otherData {
  width: 90vw;
  margin: 0 auto;
  padding-bottom: 8vh;
  h2 {
    height: 8vh;
    line-height: 8vh;
    text-align: left;
    font-size: $size-l;
    font-weight: 700;
  }
  .otherBox {
    display: flex;
    padding: 0 2vw;
    height: 9vh;
    &:last-child .dl {
      border-bottom: none;
    }
    &.two {
      .dl {
        border-right: none;
      }
    }
    .dl {
      flex: 1;
      border-bottom: $border;
      border-right: $border;
      height: 9vh;
      padding: 2vh 0;
      text-align: center;
      &:nth-child(2n) {
        border-right: none;
      }
      .dt {
        color: $blue;
        margin-bottom: 1vh;
      }
      .dd {
        color: $color-b;
      }
    }
  }
}
.btnBox {
  display: flex;
  justify-content: space-between;
  padding: 4vh 5vw;
  position: fixed;
  bottom: 10vh;
  padding: 2vh 5vw;
  width: 100%;
  background: #fff;
  .btn {
    width: 40vw;
    &:nth-child(2) {
      background: $color-n;
    }
  }
}
</style>