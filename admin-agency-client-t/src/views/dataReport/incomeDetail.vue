<template>
  <div class="content">
    <div class="header">
      <div class="back" @click="toBack"></div>
      <div class="text">收入明细</div>
      <div class="rightIcon" @click="showDateSegmentPicker"></div>
      <div class="rightIcon"></div>
    </div>
    <div class="nowDate">{{sumDate}}-{{endDate}}</div>
    <cube-scroll class="settle-items-div" ref="scroll" :data="data" :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
      <div class="mxBox">
        <div :class="item.changeMoney>0?'mxItem add':'mxItem reduce'" v-for="(item,index) of data" :key="index">
          <dl class="left">
            <dt>
              <em></em>
              {{item.recordType}}
            </dt>
            <dd>{{item.logDate}}</dd>
          </dl>
          <div class="right">{{item.changeMoney}}</div>
        </div>
      </div>
    </cube-scroll>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { IncomeDetailDoc } from "../../store/modules/dataReport/dataReport";
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
export default class IncomeDetail extends Vue {
  sumDate: string = "";
  endDate: string = "";
  time: string = "";
  dateSegmentData = [
    {
      is: "cube-date-picker",
      title: "开始时间",
      min: new Date(2018, 0, 1),
      max: new Date(2030, 11, 31)
    },
    {
      is: "cube-date-picker",
      title: "结束时间",
      min: new Date(2018, 0, 1),
      max: new Date(2030, 11, 31)
    }
  ];
  dateSegmentPicker;
  data: IncomeDetailDoc[] = this.$store.state.dataReport.incomeDetail;
  totalCount: number = this.$store.state.dataReport.totalCount;
  page: number = 1;
  count: number = 10;
  created() {
    let date = new Date();
    let weekMS = 7 * 86400000;
    this.sumDate = formUtil.getDateYYYYMMDDHHmmss(
      new Date(date.getTime() - weekMS),
      false
    );
    this.time = this.sumDate;
    this.endDate = formUtil.getDateYYYYMMDDHHmmss(date, false);
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
  searchData() {
    this.page = 1;
    this.loadData();
  }
  async loadData() {
    let queryItem: any = this.getQueryItem();
    await xutil
      .myDispatch(this.$store, "GetIncomeDetail", queryItem)
      .then(() => {
        this.data = this.$store.state.dataReport.incomeDetail;
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
  async onPullingUp() {
    if (this.data.length < this.totalCount) {
      // 如果有新数据
      this.page++;
      let queryItem: any = this.getQueryItem();
      await xutil
        .myDispatch(this.$store, "GetIncomeDetail", queryItem)
        .then(() => {
          this.data = this.data.concat(
            this.$store.state.dataReport.incomeDetail
          );
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
    await xutil
      .myDispatch(this.$store, "GetIncomeDetail", queryItem)
      .then(() => {
        this.data = this.$store.state.dataReport.incomeDetail;
        this.totalCount = this.$store.state.dataReport.totalCount;
      });
  }
  getQueryItem() {
    let dayMS = 86400000;
    let date;
    let queryItem: any = { page: this.page, count: this.count };
    if (this.sumDate) {
      let utcDate = Date.UTC(
        new Date(this.sumDate).getUTCFullYear(),
        new Date(this.sumDate).getUTCMonth(),
        new Date(this.sumDate).getUTCDate(),
        new Date(this.endDate).getUTCHours()
      );
      let date = new Date(utcDate - 8 * 60 * 60 * 1000);
      queryItem.sumDate = date;
    } else {
      xutil.toastWarn("必须选择开始时间！");
      return;
    }
    if (this.endDate) {
      if (new Date(this.sumDate).getTime() > new Date(this.endDate).getTime()) {
        xutil.toastWarn("结束时间必须小于开始时间");
        return;
      }
      let utcDate = Date.UTC(
        new Date(this.endDate).getUTCFullYear(),
        new Date(this.endDate).getUTCMonth(),
        new Date(this.endDate).getUTCDate(),
        new Date(this.endDate).getUTCHours()
      );
      let date = new Date(utcDate + dayMS - 8 * 60 * 60 * 1000);
      queryItem.endDate = date;
    }
    queryItem.type = [
      "system",
      "其他",
      "artificial",
      "master",
      "wcg",
      "transferIn",
      "transferOut",
      "activity",
      "bonusPool",
      "minusBonusPool"
    ];
    return queryItem;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  .rightIcon {
    flex: 1;
    height: 100%;
    @include middle;
    background: url(#{$imgUrl}date-icon.png) no-repeat center center;
    background-size: 40%;
    &:last-child {
      background: url(#{$imgUrl}daochu-icon.png) no-repeat center center;
      background-size: 40%;
    }
  }
}
.nowDate {
  color: $orange;
  height: 6vh;
  line-height: 6vh;
  margin-bottom: 3vh;
  font-size: $size-s;
  text-align: center;
}
.settle-items-div {
  height: 83vh;
}
.mxBox {
  margin: 0 5vw;
  border-left: $border;
}
.mxItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6vh;
  margin-bottom: 2vh;
  .left {
    text-align: left;
    padding-left: 5vw;
    dt {
      color: $valueColor * 1.2;
      margin-bottom: 1vh;
      font-size: $size-w;
      position: relative;
    }
    dt em {
      display: block;
      width: 3vw;
      height: 3vw;
      border: solid 2px $blue;
      border-radius: 1.7vw;
      position: absolute;
      left: -6.5vw;
      background: #fff;
    }
    dd {
      font-size: $size-w;
      color: $titleColor;
    }
  }
  .right {
    font-size: $size-s;
    color: $blue;
  }
  &.reduce {
    .right {
      color: $color-n * 1.2;
    }
  }
}
</style>