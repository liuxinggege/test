<template>
  <div class="content">
    <div class="header">
      <div @click="toBack" class="back"></div>
      <div class="text">下级代理收入统计</div>
      <div class="rightIcon" @click="showDateSegmentPicker"></div>
    </div>
    <div class="serchBox">
      <div class="btnSerch"></div>
      <input type="text" @change="searchData" v-model="agencyId" placeholder="输入代理id">
    </div>
    <cube-scroll ref="scroll" class="scrollBox" :data="data" :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
      <div class="dlItem" v-for="(item,index) of data" :key="index">
        <div class="title">
          贡献比例
          <em>{{getRate(item.taxRate)}}</em>
        </div>
        <div class="dlId">代理ID：{{item.agencyId}}&nbsp;&nbsp;昵称：{{item.name}}</div>
        <div class="dataBox">
          <dl class="dataItem">
            <dt>
              <em></em>
              <span>团队税收</span>
            </dt>
            <dd>{{item.totalTax}}</dd>
          </dl>
          <dl class="dataItem">
            <dt>
              <em></em>
              <span>贡献利润</span>
            </dt>
            <dd>{{item.income}}</dd>
          </dl>
        </div>
        <div class="dataBox">
          <dl class="dataItem">
            <dt>
              <em></em>
              <span>注册人数</span>
            </dt>
            <dd>{{item.newUserCount}}</dd>
          </dl>
          <dl class="dataItem">
            <dt>
              <em></em>
              <span>发展下级</span>
            </dt>
            <dd>{{item.childCount}}</dd>
          </dl>
        </div>
      </div>
    </cube-scroll>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { ChildInfo } from "../../store/modules/dataReport/dataReport";
import bignumber, { BigNumber } from "bignumber.js";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
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
@Component
export default class ChildData extends Vue {
  sumDate: string = "";
  endDate: string = "";
  time: string = "";
  dateSegmentData = [
    {
      is: "cube-date-picker",
      title: "开始时间",
      min: new Date(2018, 9, 1),
      max: new Date(2030, 11, 31)
    },
    {
      is: "cube-date-picker",
      title: "结束时间",
      min: new Date(2018, 9, 1),
      max: new Date(2030, 11, 31)
    }
  ];
  dateSegmentPicker;
  data: ChildInfo[] = this.$store.state.dataReport.childInfo;
  totalCount: number = this.$store.state.dataReport.totalCount;
  page: number = 1;
  count: number = 10;
  agencyId: string = "";
  info = JSON.parse(<any>sessionStorage.getItem("userInfo"));
  created() {
    let date = new Date();
    let weekMS = 86400000;
    this.sumDate = formUtil.getDateYYYYMMDDHHmmss(date, false);
    this.time = this.sumDate;
    this.endDate = formUtil.getDateYYYYMMDDHHmmss(
      new Date(date.getTime() + weekMS),
      false
    );
    this.loadData();
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  mounted() {
    this.dateSegmentPicker = this.$createSegmentPicker({
      data: this.dateSegmentData,
      onSelect: (selectedDates, selectedVals, selectedTexts) => {
        if (new BigNumber(selectedTexts[0][1]).lt(10)) {
          selectedTexts[0][1] = "0" + selectedTexts[0][1];
        }
        if (new BigNumber(selectedTexts[1][1]).lt(10)) {
          selectedTexts[1][1] = "0" + selectedTexts[1][1];
        }
        if (new BigNumber(selectedTexts[0][2]).lt(10)) {
          selectedTexts[0][2] = "0" + selectedTexts[0][2];
        }
        if (new BigNumber(selectedTexts[1][2]).lt(10)) {
          selectedTexts[1][2] = "0" + selectedTexts[1][2];
        }
        this.time = selectedTexts[0].join("-");
        this.sumDate = selectedTexts[0].join("-");
        this.endDate = selectedTexts[1].join("-");
        this.searchData();
      },
      onNext: (i, selectedDate, selectedValue, selectedText) => {
        this.dateSegmentData[1].min = selectedDate;
        if (i === 0) {
          this.dateSegmentPicker.$updateProps({
            data: this.dateSegmentData
          });
        }
      }
    });
  }
  showDateSegmentPicker() {
    this.dateSegmentPicker.show();
  }
  async loadData() {
    let queryItem: any = this.getQueryItem();
    await xutil.myDispatch(this.$store, "GetChildInfo", queryItem).then(() => {
      this.data = this.$store.state.dataReport.childInfo;
      if (this.data) {
        this.data = this.data.sort(this.compare("totalTax"));
        this.data.forEach((item, index) => {
          this.data[index].income = parseFloat(item.income).toFixed(2);
        });
      }
      this.totalCount = this.$store.state.dataReport.totalCount;
    });
  }
  toBack() {
    this.$router.push({ path: "/dataReport" });
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
  getRate(taxRate) {
    let level = this.info.level;
    if (level >= 3) {
      if (new BigNumber(taxRate).eq(0)) {
        return "0.01(系统补贴)";
      }
    }
    return taxRate;
  }
  async onPullingUp() {
    if (this.data.length < this.totalCount) {
      // 如果有新数据
      this.page++;
      let queryItem: any = this.getQueryItem();
      await xutil
        .myDispatch(this.$store, "GetChildInfo", queryItem)
        .then(() => {
          this.data = this.data.concat(this.$store.state.dataReport.childInfo);
          if (this.data) {
            this.data = this.data.sort(this.compare("totalTax"));
          }
          this.totalCount = this.$store.state.dataReport.totalCount;
        });
    } else {
      // 如果没有新数据
      xutil.toastText("没有数据了");
      (this.$refs.scroll as any).forceUpdate();
    }
  }
  async onPullingDown() {
    this.page = 1;
    let queryItem: any = this.getQueryItem();
    await xutil.myDispatch(this.$store, "GetChildInfo", queryItem).then(() => {
      this.data = this.$store.state.dataReport.childInfo;
      if (this.data) {
        this.data = this.data.sort(this.compare("totalTax"));
      }
      this.totalCount = this.$store.state.dataReport.totalCount;
    });
  }
  getQueryItem() {
    let date: Date;
    let agencyId: any;
    if (this.sumDate) {
      let utcDate = Date.UTC(
        new Date(this.sumDate).getUTCFullYear(),
        new Date(this.sumDate).getUTCMonth(),
        new Date(this.sumDate).getUTCDate(),
        new Date(this.sumDate).getUTCHours()
      );
      date = new Date(utcDate - 8 * 60 * 60 * 1000);
    }
    if (this.agencyId) {
      agencyId = this.agencyId;
    }
    let queryItem: any = {
      agencyId: agencyId,
      sumDate: date,
      page: this.page,
      count: this.count
    };
    return queryItem;
  }
  compare(property) {
    return function(obj1, obj2) {
      var value1 = obj1[property];
      var value2 = obj2[property];
      return value2 - value1; // 升序
    };
  }
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "统计时间", field: "sumDate", type: "Date" },
      { title: "代理ID", field: "agencyId", type: "string" },
      { title: "代理名称", field: "name", type: "string" },
      { title: "总税收", field: "gameTax", type: "string" },
      { title: "兑换", field: "officialWithdrawAmt", type: "string" },
      { title: "充值", field: "totalChargeAmt", type: "string" },
      { title: "新增用户", field: "newUserCount", type: "string" },
      { title: "新增用户充值", field: "newUserChargeAmt", type: "string" },
      { title: "营收", field: "totalProfit", type: "string" },
      { title: "登陆用户数", field: "loginUserCount", type: "string" },
      { title: "绑定用户数", field: "bindUserCount", type: "string" },
      { title: "绑定率", field: "bindRate", type: "string" },
      {
        title: "新增充值人数",
        field: "newUserChargeUserCount",
        type: "string"
      },
      { title: "老充值人数", field: "oldUserChargeUserCount", type: "string" },
      { title: "新用户平均充值", field: "newUserAvgChargeAmt", type: "string" },
      { title: "老用户平均充值", field: "oldUserAvgChargeAmt", type: "string" },
      { title: "平均充值", field: "avgChargeAmt", type: "string" },
      { title: "人均营收", field: "avgProfit", type: "string" },
      { title: "渠道", field: "channel", type: "string" },
      { title: "发展下级", field: "totalNewAgency", type: "string" }
    ];
    let tmp: any = {};
    if (this.sumDate) {
      let utcDate = Date.UTC(
        new Date(this.sumDate).getUTCFullYear(),
        new Date(this.sumDate).getUTCMonth(),
        new Date(this.sumDate).getUTCDate(),
        new Date(this.endDate).getUTCHours()
      );
      let date = new Date(utcDate - 8 * 60 * 60 * 1000);
      tmp.sumDate = date;
    } else {
      xutil.toastWarn("必须选择开始时间！");
      return;
    }

    if (this.endDate) {
      if (
        new BigNumber(new Date(this.sumDate).getTime()).gt(
          new BigNumber(new Date(this.endDate).getTime())
        )
      ) {
        xutil.toastWarn("结束时间必须小于开始时间");
        return;
      }
      let utcDate = Date.UTC(
        new Date(this.endDate).getUTCFullYear(),
        new Date(this.endDate).getUTCMonth(),
        new Date(this.endDate).getUTCDate(),
        new Date(this.endDate).getUTCHours()
      );
      let date = new Date(utcDate - 8 * 60 * 60 * 1000);
      tmp.endDate = date;
    }
    xutil.myDispatch(this.$store, "DownloadChildInfoExcel", tmp).then(ret => {
      downloadExcel("数据报表", downloadExcelCfg, ret.msg);
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  padding-bottom: 12vh;
  background-color: #eff3f9;
}
.header {
  .rightIcon {
    flex: 1;
    height: 100%;
    @include middle;
    background: url(#{$imgUrl}date-icon.png) no-repeat center center;
    background-size: 40%;
  }
}
.serchBox {
  height: 5vh;
  border-radius: 2.5vh;
  background: $color-l * 0.95;
  display: flex;
  margin: 3vh 5vw 0 5vw;
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
.scrollBox {
  height: 84vh;
}
.dlItem {
  box-shadow: 0px 8px 18px 0px rgba(202, 218, 242, 0.56);
  border-radius: 6px;
  margin-bottom: 5vh;
  background: #fff;
  position: relative;
  width: 90vw;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 1vh;
  &:first-child {
    margin-top: 5vh;
  }
  .title {
    width: 35%;
    height: 7vh;
    @include middle;
    color: #fff;
    font-size: $size-w;
    font-weight: 700;
    background: $blue;
    border-radius: 6px;
    position: absolute;
    top: -2vh;
    left: 0;
  }
  .title em {
    font-size: $size-l;
    padding-left: 1vw;
  }
  .dlId {
    padding-top: 6vh;
    text-align: left;
    font-size: $size-w;
    color: $blue;
    line-height: 5vh;
    padding-left: 5vw;
  }
  .dataBox {
    display: flex;
    padding: 2vh 5vw;
    border-bottom: $border;
    &:last-child {
      border-bottom: none;
    }
    .dataItem {
      flex: 1;
      dt {
        font-size: $size-w;
        display: flex;
        align-items: center;
        margin-bottom: 0.8vh;
        color: $color-n * 1.2;
        em {
          display: block;
          width: 2vw;
          height: 2vw;
          border-radius: 50%;
        }
        span {
          margin-left: 2vw;
        }
      }
      dd {
        font-size: $size-m;
        text-align: left;
        padding-left: 4vw;
      }
      &:nth-child(1) dt em {
        background: $orange;
      }
      &:nth-child(2) dt em {
        background: $color-b;
      }
    }
    &:last-child {
      .dataItem:nth-child(1) dt em {
        background: $red;
      }
      .dataItem:nth-child(2) dt em {
        background: $blue;
      }
    }
  }
}
</style>