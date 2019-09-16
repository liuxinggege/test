<template>
  <el-card class="dashboard-second">
    <span>游戏今日输赢走势图</span>
    <el-button class="dashboard-winLoseButton" type="primary" size="mini" icon="el-icon-refresh" @click="loadData">刷新</el-button>
    <div id="chartLine" class="dashboard-winChart"></div>
  </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { GameEachDayUserWinAndLoseState } from "../../../store/stateInterface";
import { GameEachDayUserWinAndLose } from "../../../store/modules/gameManager/gameEachDayUserWinAndLose";

import { myDispatch } from "../../../utils/index";
import echarts from "echarts";
var colors = [
  "#c23531",
  "#2f4554",
  "#61a0a8",
  "#d48265",
  "red",
  "#ffd400",
  "blue",
  "green"
];
interface GameEachObject {
  eachDayUserLose: string;
  eachDayUserNormal: string;
  eachDayUserWin: string;
  eachDayWinAndLose: string;
}
@Component
export default class Graph extends Vue {
  //初始化数据
  GameEachDayUserWinAndLoseState: GameEachDayUserWinAndLoseState = this.$store
    .state.gameEachDayUserWinAndLose;
  gameEachDayUserWinAndLose: GameEachDayUserWinAndLose = this
    .GameEachDayUserWinAndLoseState.gameEachDayUserWinAndLose;
  valueTime = [null, null];
  chartLine: any;
  chartType: string = "HH";

  mounted() {
    this.loadData();
  }
  loadData() {
    myDispatch(
      this.$store,
      "GetGameUserWinAndLose",
      { chartType: this.chartType },
      true
    ).then(() => {
      this.gameEachDayUserWinAndLose = this.GameEachDayUserWinAndLoseState.gameEachDayUserWinAndLose;
      let xData: string[] = [];
      let yData1: number[] = [];
      let yData2: number[] = [];
      let yData3: number[] = [];
      let yData4: number[] = [];
      let yData5: number[] = [];
      let yData6: number[] = [];
      let yData7: number[] = [];
      let yData8: number[] = [];
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.showLoading({ text: "加载中..." });
      const timeLine =  this.gameEachDayUserWinAndLose.timeLine || [];
      timeLine.forEach((item: string) => {
        xData.push(item);
      });
      const  yesterdayData = this.gameEachDayUserWinAndLose.data[0] || [];
      yesterdayData.forEach((item: GameEachObject) => {
        yData1.push(Number(item["eachDayUserWin"]));
        yData2.push(Number(item["eachDayUserLose"]));
        yData3.push(Number(item["eachDayUserNormal"]));
        yData4.push(Number(item["eachDayWinAndLose"]));
      });
      const todayData = this.gameEachDayUserWinAndLose.data[1] || [];
      todayData.forEach((item: GameEachObject) => {
        yData5.push(Number(item["eachDayUserWin"]));
        yData6.push(Number(item["eachDayUserLose"]));
        yData7.push(Number(item["eachDayUserNormal"]));
        yData8.push(Number(item["eachDayWinAndLose"]));
      });
      this.drawLineChart(
        xData,
        yData1,
        yData2,
        yData3,
        yData4,
        yData5,
        yData6,
        yData7,
        yData8
      );
    });
  }

  drawLineChart(
    xData,
    yData1,
    yData2,
    yData3,
    yData4,
    yData5,
    yData6,
    yData7,
    yData8
  ) {
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
        data: [
          "昨日放水线",
          "昨日杀分线",
          "昨日正常线",
          "昨日输赢线",
          "今日放水线",
          "今日杀分线",
          "今日正常线",
          "今日输赢线"
        ],
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
          name: "昨日放水线",
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
          name: "昨日杀分线",
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
          name: "昨日正常线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[2]
          },
          data: yData3
        },
        {
          name: "昨日输赢线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[3]
          },
          data: yData4
        },
        {
          name: "今日放水线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[4]
          },
          data: yData5
        },
        {
          name: "今日杀分线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[5]
          },
          data: yData6
        },
        {
          name: "今日正常线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[6]
          },
          data: yData7
        },
        {
          name: "今日输赢线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[7]
          },
          data: yData8
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
