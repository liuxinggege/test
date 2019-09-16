<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="咨询人数分布查询"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">咨询人数分布查询</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>项目</span>
        <el-select style="width:90px;margin-right:10px" v-model="pid" placeholder="请选择项目">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>时间</span>
        <el-date-picker v-model="time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="loadData">搜索</el-button>
      </div>
      <div class="advisoryStat">
        <span>总人数：{{advisoryStatData.totalCount}}</span>
        <span>异常离开人数：{{advisoryStatData.leave}}</span>
        <span>排队最大时间：{{advisoryStatData.isQueueMaxTime}}</span>
        <span>排队平均时间：{{advisoryStatData.isQueueAvgTime}}</span>
      </div>
      <div id="chartLineYQ1" style="width:100%; height:630px;padding: 10px;"></div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import echarts from "echarts";
import { myAsyncFn } from "../../utils/index";
import { advisoryStat } from "../../api/admin/customerService/customerService";

// import { Getter, Action } from "vuex-class";
var colors = ["#c23531", "#2f4554"];
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class AdvisoryStat extends Vue {
  //初始化数据
  advisoryStatData: any = {
    isQueue: [],
    notQueue: [],
    isQueueAvgTime: 0,
    isQueueMaxTime: 0,
    totalCount: 0,
    leave: 0
  };
  chartLineYQ1: any = null;
  pidList: any = [];
  pid: string = "";
  now = new Date(Date.now());
  startDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate(),
    0,
    0,
    0
  );
  endDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() + 1,
    0,
    0,
    0
  );
  time: any = [this.startDate, this.endDate];
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
  }
  mounted() {
    this.loadData();
  }
  async loadData() {
    let req: any = this.getQueryItem();
    let ret = await myAsyncFn(advisoryStat, req);
    if (ret.code == 200 && ret.msg) {
      this.advisoryStatData = ret.msg;
      let xData: string[] = [];
      let yData1: number[] = [];
      let yData2: number[] = [];
      //echarts.dispose()
      this.chartLineYQ1 = echarts.init(document.getElementById("chartLineYQ1"));

      this.advisoryStatData.isQueue.forEach(item => {
        xData.push(item.graphDate);
        yData1.push(Number(item.num));
      });
      this.chartLineYQ1.showLoading({
        text: ""
      });

      this.advisoryStatData.notQueue.forEach(item => {
        yData2.push(Number(item.num));
      });
      this.drawLineChart(xData, yData1, yData2);
    }
  }
  getQueryItem() {
    let temp: any = {};
    if (this.pid) {
      temp.pid = this.pid;
    }
    if (this.time.length == 2) {
      temp.startDate = this.time[0];
      temp.endDate = this.time[1];
    }
    return temp;
  }
  drawLineChart(xData, yData1, yData2) {
    //获取实时数据库数据
    this.chartLineYQ1.setOption({
      color: colors,
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["咨询总计", "排队总计"],
        padding: [5, 10]
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
        type: "value",
        interval: 1
      },
      series: [
        {
          name: "咨询总计",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[0]
          },
          data: yData2
        },
        {
          name: "排队总计",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: colors[1]
          },
          data: yData1
        }
      ]
    });
    this.chartLineYQ1.hideLoading();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.advisoryStat {
  display: flex;
  width: 650px;
  margin: 10px auto;
  font-size: 18px;
  justify-content: space-between;
}
</style>