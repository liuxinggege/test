<template>
  <el-card class="dashboard-second">
    <span>玩家兑换数据监控</span>
    <div class="dashboard-winLoseButton">
      <!-- <span>项目：</span>
      <el-select v-model="pid" placeholder="请选择pid" style="width:110px">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
        </el-option>
      </el-select> -->
      <el-button type="primary" size="mini" icon="el-icon-refresh" @click="loadData">刷新</el-button>
    </div>
    <div id="chartLine" class="dashboard-winChart"></div>
  </el-card>

</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { myDispatch } from "../../utils/index";
import echarts from "echarts";
var colors = ["#c23531", "#2f4554", "#61a0a8"];
@Component
export default class Graph extends Vue {
  chartLine: any;
  // pid = "A";
  // pidList: any[] = [];
  mounted() {
    // this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetWithdrawMonitor", {},true).then(() => {
      let code = this.$store.state.withdrawMonitor.code;
      let lineData = this.$store.state.withdrawMonitor.lineData;
      let xData: string[] = [];
      let warningData: number[] = [];
      let yestData: number[] = [];
      let todayData: number[] = [];
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.showLoading({ text: "加载中..." });
      lineData.forEach(item => {
        xData.push(item["hour"]);
        warningData.push(Number(item["warningAmt"]));
        yestData.push(Number(item["yestAmt"]));
        todayData.push(Number(item["todayAmt"]));
      });
      this.drawLineChart(xData, warningData, yestData, todayData);
    });
  }

  drawLineChart(xData, yData1, yData2, yData3) {
    //获取实时数据库数据
    this.chartLine.setOption({
      color: colors,
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["预警", "昨日", "今日"],
        padding: [1, 1]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: xData
        }
      ],
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "预警",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[0]
          },
          data: yData1
        },
        {
          name: "昨日",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[1]
          },
          data: yData2
        },
        {
          name: "今日",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[2]
          },
          data: yData3
        }
      ]
    });
    this.chartLine.hideLoading();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-winAndLose {
    padding: 10px;
    position: relative;
  }
  &-winLoseButton {
    position: absolute;
    top: 20px;
    right: 25px;
    z-index: 99;
  }
  &-winChart {
    width: 100%;
    height: 545px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
#chartLine {
  margin: 25px 25px 0 0;
}
</style>
