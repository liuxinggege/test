<template>
  <div>
    <x-header :right-options="{showMore: false}" class="header"> 流水记录
      <a slot="right" @click="toHome">首页 </a>
    </x-header>
    <br><br>
    <div class="wrap-box">
      <div class="scroll-list-wrap">
        <cube-scroll ref="scroll" :data="data" @pulling-up="onPullingUp" @pulling-down="onPullingDown" :options="options">
          <group>
            <cell title='搜索' is-link :border-intent="false" :arrow-direction="showContent ? 'up' : 'down'" @click.native="showContent = !showContent"></cell>
            <template v-if="showContent">
              <group class="datetime">
                <datetime v-model="sumDateStart" clear-text="clear" :title="startTimeTitle" @on-clear="clearSumDateStart"></datetime>
              </group>
              <group class="datetime">
                <datetime v-model="sumDateEnd" clear-text="clear" :title="endTimeTitle" @on-clear="clearSumDateEnd"></datetime>
              </group>
              <group v-if="downloadExcelFlag" title="类型">
                <cube-select v-model="type" :options="stateOptions" title="请选择类型" placeholder="请选择类型">
                </cube-select>
              </group>
              <x-button class="button" type="primary" mini @click.native="getData">搜索</x-button>
              <x-button class="button" type="primary" mini @click.native="downloadExcel" v-if="downloadExcelFlag">导出</x-button>
            </template>
          </group>
          <br>
          <ul v-for="item in data">
            <li>
              <card style="padding:5px 0;">
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="vux-1px-r">
                    日期:
                    <span style="text-align:center;display:inline-block;font-size:16px;">{{item.logDate ? logDateFormatter(item.logDate) :"-"}}</span>
                  </div>
                </div>
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="vux-1px-r">
                    <span style="text-align:center;display:inline-block;font-size:14px;">{{item.changeMoney?item.changeMoney:"-"}}</span>
                    <br>
                    <span class="fieldName">变化金额</span>
                  </div>
                  <div class="vux-1px-r field3">
                    <span style="text-align:center;display:inline-block;font-size:13px;">{{item.recordType?recordTypeFormatter(item.recordType):"-"}}</span>
                    <br>
                    <span class="fieldName">变化类型</span>
                  </div>
                </div>
              </card>
            </li>
          </ul>
          <div style="height:300px"></div>
        </cube-scroll>
      </div>
      <div @click="scrollTo" class="scrollTo">
        <i class="cubeic-arrow"></i>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import {
  SubmitBalanceState,
  BalanceActState
} from "../../store/stateInterface";
import router from "../../router/router";
import { find } from "cfb/types";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";

@Component
export default class SubmitBalance extends Vue {
  downloadExcelFlag: boolean = false;
  submitBalance: SubmitBalanceState = this.$store.state.submitBalance; //表单数据
  data = this.submitBalance.submitBalanceData;
  page: number = 1;
  count: number = 10;
  showContent: boolean = false;
  sumDateStart: string = "";
  sumDateEnd: string = "";
  startTimeTitle: string = "开始时间";
  endTimeTitle: string = "结束时间";
  type: string = "";
  stateOptions = [
    { value: "", text: "全部" },
    { value: "system", text: "收益(系统每日结算)" },
    { value: "master", text: "师徒结算" },
    { value: "wcg", text: "世界杯结算" }
  ];
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
  created() {
    this.downloadExcelFlag = xutil.userAgent();
    this.loadHistoryRecords().then(() => {
      this.data = this.$store.state.submitBalance.submitBalanceData;
    });
  }
  getData() {
    this.page = 1;
    this.loadHistoryRecords().then(() => {
      this.data = this.$store.state.submitBalance.submitBalanceData;
    });
  }
  async loadHistoryRecords() {
    let tmp: any = {};
    if (this.sumDateStart) {
      tmp.sumDateStart = new Date(this.sumDateStart).toDateString();
    }
    if (this.sumDateEnd) {
      tmp.sumDateEnd = new Date(this.sumDateEnd).toDateString();
    }
    if (this.sumDateStart && this.sumDateEnd) {
      let tmp = formUtil.judgmentDate(this.sumDateStart, this.sumDateEnd);
      if (!tmp) {
        xutil.toastWarn("结束时间不得小于开始时间！");
      }
    }
    tmp.page = this.page;
    tmp.count = this.count;
    await xutil.myDispatch(this.$store, "GetSubmitBalanceData", tmp);
  }

  recordTypeFormatter(recordType) {
    if (recordType === "artificial") {
      return "操作(人工操作)";
    } else if (recordType === "system") {
      return "收益(系统每日结算)";
    } else if (recordType === "apply") {
      return "提现";
    } else if (recordType === "transferOut") {
      return "转出";
    } else if (recordType === "master") {
      return "师徒结算";
    } else if (recordType === "wcg") {
      return "世界杯结算";
    } else if (recordType === "transferIn") {
      return "转入";
    } else {
      return recordType;
    }
  }
  logDateFormatter(logDate) {
    return formUtil.getDateYYYYMMDDHHmmss(logDate);
  }
  ////////////////////////////////////////////
  toHome() {
    this.$router.push({ path: "/home" });
  }
  scrollTo() {
    (this.$refs.scroll as any).scrollTo(0, 0, 700);
  }
  clearSumDateStart(value) {
    this.sumDateStart = "";
  }
  clearSumDateEnd(value) {
    this.sumDateEnd = "";
  }
  async onPullingUp() {
    if (this.data.length < this.submitBalance.totalCount) {
      // 如果有新数据
      this.page++;
      await this.loadHistoryRecords();
      this.data = this.data.concat(
        this.$store.state.submitBalance.submitBalanceData
      );
    } else {
      // 如果没有新数据
      xutil.toastText("没有数据了");
      (this.$refs.scroll as any).forceUpdate();
    }
  }
  async onPullingDown() {
    this.page = 1;
    await this.loadHistoryRecords();
    this.data = this.$store.state.submitBalance.submitBalanceData;
  }
  //导出
  downloadExcel() {
    const downloadExcelCfg = [
      { field: "logDate", title: "时间", type: "Date" },
      { field: "agencyId", title: "代理ID", type: "string" },
      { field: "act", title: "账号", type: "string" },
      { field: "changeMoney", title: "金额", type: "string" },
      { field: "recordType", title: "类型", type: "recordType" },
      { field: "remarks", title: "备注", type: "string" }
    ];
    let tmp: any = {};
    if (this.type) {
      tmp.recordType = this.type;
    }
    if (this.sumDateStart) {
      tmp.startTime = new Date(this.sumDateStart).toDateString();
    }
    if (this.sumDateEnd) {
      tmp.endTime = new Date(this.sumDateEnd).toDateString();
    }
    if (this.sumDateStart && this.sumDateEnd) {
      let tmp = formUtil.judgmentDate(this.sumDateStart, this.sumDateEnd);
      if (!tmp) {
        xutil.toastWarn("结束时间不得小于开始时间！");
      }
    }
    if (!tmp.startTime || !tmp.endTime) {
      // this.$message({
      //   type: "warning",
      //   message: "至少输入查询时间！"
      // });
      return;
    }
    xutil.myDispatch(this.$store, "MoneyHistoryExport", tmp).then(ret => {
      downloadExcel("历史利润", downloadExcelCfg, ret.msg);
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  width: 100%;
  position: fixed !important;
  z-index: 2;
}
.datetime p,
.datetime {
  margin: 0;
}
.weui-cell__bd p {
  padding: 5px !important;
  margin: 0;
}
.datetime {
  padding: 0 10px;
  margin: 0;
}
.datetime datetime,
.weui-cell_radio {
  padding: 5px;
}
.vux-datetime {
  padding: 10px 0 !important;
}
label,
p {
  font-size: 14px;
  font-weight: 700;
}
.button {
  margin: 10px 20px !important;
}
.scroll-list-wrap {
  height: 756px;
  overflow: hidden;
}
// .scrollTo {
//   position: fixed !important;
//   z-index: 99;
//   opacity: 0.05;
//   bottom: 30px;
//   right: 35px;
//   transform: scale(2.5) rotate(-90deg);
//   text-align: center;
// } index.html

//card
.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  position: relative;
  padding: 3px 4px;
}
.field2 {
  position: absolute;
  left: 26%;
}
.field3 {
  position: absolute;
  left: 53%;
}
.field4 {
  position: absolute;
  left: 78%;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  text-align: left;
  //   font-size: 12px;
}
.card-demo-flex span {
  color: #f74c31;
}
.vux-1px-r {
  margin: 0 6px;
}
.fieldName {
  color: #000 !important;
  font-size: 8px !important;
  display: inline-block;
  margin: 2px 0;
}

//生气
.vux-1px-r:after {
  border: 0;
}
</style>
