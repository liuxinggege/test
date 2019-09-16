<template>
  <el-col :span="17" style="padding:0">
    <el-card class="dashboard-winAndLose">
      <span>游戏今日输赢走势图</span>
      <el-button class="dashboard-winLoseButton" type="primary" size="mini" icon="el-icon-refresh" @click="loadData">刷新</el-button>
      <div id="chartLineWinAndLose" class="dashboard-winChart"></div>
    </el-card>
  </el-col>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { AdminHome } from "../../../../../store/stateInterface";
import { TodayWinAndLoseHistory } from "../../../../../store/modules/home/adminHome";

import { myDispatch } from "../../../../../utils/index";
import echarts from "echarts";
var colors = [
  "#c23531",
  "#2f4554",
  "#61a0a8",
  "#d48265",
  "#91c7ae",
  "#56c1de",
  "#F324D2",
  "#9370DB",
  "#EE2C2C",
  "#EEEE00",
  "#8B8378",
  "#0000FF",
  "#00FF00",
  "#339933",
  "#851684",
  "#FF8C00"
];
@Component
export default class Graph extends Vue {
  //初始化数据
  adminHome: AdminHome = this.$store.state.adminHome;
  todayWinAndLoseHistory: TodayWinAndLoseHistory[] = this.adminHome
    .todayWinAndLoseHistory;
  valueTime = [null, null];
  chartLineWinAndLose: any;

  mounted() {
    this.loadData();
  }
  loadData() {
    myDispatch(this.$store, "GetTodayWinAndLoseHistory", {}, true).then(() => {
      this.todayWinAndLoseHistory = this.adminHome.todayWinAndLoseHistory;
      let xData: string[] = [];
      let yData1: number[] = [];
      let yData2: number[] = [];
      let yData3: number[] = [];
      let yData4: number[] = [];
      let yData5: number[] = [];
      let yData6: number[] = [];
      let yData7: number[] = [];
      let yData8: number[] = [];
      let yData9: number[] = [];
      let yData10: number[] = [];
      let yData11: number[] = [];
      let yData12: number[] = [];
      let yData13: number[] = [];
      let yData14: number[] = [];
      let yData15: number[] = [];
      let yData16: number[] = [];
      this.chartLineWinAndLose = echarts.init(
        document.getElementById("chartLineWinAndLose")
      );
      this.chartLineWinAndLose.showLoading({ text: "加载中..." });
      this.todayWinAndLoseHistory.forEach(item => {
        xData.push(item["graphDate"]);
        yData1.push(Number(item["jinhuaEachDayWinAndLose"]));
        yData2.push(Number(item["niuniuEachDayWinAndLose"]));
        yData3.push(Number(item["suohaEachDayWinAndLose"]));
        yData4.push(Number(item["xuezhanEachDayWinAndLose"]));
        yData5.push(Number(item["brniuniuEachDayWinAndLose"]));
        yData6.push(Number(item["hongheiEachDayWinAndLose"]));
        yData7.push(Number(item["doudizhuEachDayWinAndLose"]));
        yData8.push(Number(item["buyuEachDayWinAndLose"]));
        yData9.push(Number(item["jdniuniuEachDayWinAndLose"]));
        yData10.push(Number(item["paodekuaiEachDayWinAndLose"]));
        yData11.push(Number(item["longhuEachDayWinAndLose"]));
        yData12.push(Number(item["ermjEachDayWinAndLose"]));
        yData13.push(Number(item["dezhoupukeEachDayWinAndLose"]));
        yData14.push(Number(item["qianghongbaoEachDayWinAndLose"]));
        yData15.push(Number(item["erbagangEachDayWinAndLose"]));
        yData16.push(Number(item["duofuduocaiEachDayWinAndLose"]));
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
        yData8,
        yData9,
        yData10,
        yData11,
        yData12,
        yData13,
        yData14,
        yData15,
        yData16
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
    yData8,
    yData9,
    yData10,
    yData11,
    yData12,
    yData13,
    yData14,
    yData15,
    yData16
  ) {
    //获取实时数据库数据
    this.chartLineWinAndLose.setOption({
      color: colors,
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: [
          "炸金花",
          "牛牛",
          "梭哈",
          "麻将",
          "百人牛牛",
          "红黑",
          "斗地主",
          "捕鱼",
          "经典牛牛",
          "跑得快",
          "龙虎斗",
          "二人麻将",
          "德州扑克",
          "抢红包",
          "二八杠",
          "多福多财"
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
          name: "炸金花",
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
          name: "牛牛",
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
          name: "梭哈",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[3]
          },
          data: yData3
        },
        {
          name: "麻将",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[4]
          },
          data: yData4
        },
        {
          name: "百人牛牛",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[5]
          },
          data: yData5
        },
        {
          name: "红黑",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[6]
          },
          data: yData6
        },
        {
          name: "斗地主",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[7]
          },
          data: yData7
        },
        {
          name: "捕鱼",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[8]
          },
          data: yData8
        },
        {
          name: "经典牛牛",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[9]
          },
          data: yData9
        },
        {
          name: "跑得快",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[10]
          },
          data: yData10
        },
        {
          name: "龙虎斗",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[11]
          },
          data: yData11
        },
        {
          name: "二人麻将",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[12]
          },
          data: yData12
        },
        {
          name: "德州扑克",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[13]
          },
          data: yData13
        },
        {
          name: "抢红包",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[14]
          },
          data: yData14
        },
        {
          name: "二八杠",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[15]
          },
          data: yData15
        },
        {
          name: "多福多财",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[16]
          },
          data: yData16
        }
      ]
    });
    this.chartLineWinAndLose.hideLoading();
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
}
#chartLineWinAndLose {
  margin: 25px 25px 0 0;
}
</style>
