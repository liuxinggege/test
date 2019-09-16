<template>
	<div>
		<!--工具条-->
		<el-row>
			<el-col :span="48" class="toolbar2">
				<span class="content_font"></span>
				<span class="demonstration"></span>
				<!-- <span>项目</span>
				<el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
					<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
					</el-option>
				</el-select> -->
				<span style="font-size:12pt; margin:10px 0px 0px 10px">渠道id</span>
				<el-input v-model="channel" style="width:120px"></el-input>
				<el-date-picker v-model="logTime" type="date" value-format='yyyy-MM-dd' placeholder="选择时间范围">
				</el-date-picker>
				<el-button-group>
					<el-button type="success" @click="getOnlineInfoGraph" style="margin:8px 0px 10px 50px">搜索</el-button>
				</el-button-group>
			</el-col>
			<el-col>
				<div id="chartLine1" style="width:100%; height:425px;padding: 10px 10px 10px 10px;"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import echarts from "echarts";
import Component from "vue-class-component";
import { OnlineGraphState } from "../../../store/stateInterface";
import { myDispatch, getYearMonthDay } from "../../../utils/index.js";
//OnlineGraph
interface QueryItem {
  // pid: string;
  endTime?: string;
  channel?: string;
  day?: number;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class OnlineGraph extends Vue {
  // lifecycle hook
  created() {}
  /*inital data*/
  onlineGraph: OnlineGraphState = this.$store.state.onlineGraph; //表单数据
  valueTime: string = "";
  channel: string = ""; //当前页
  chartLine1: any = undefined;
  colors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae"];
  logTime: string = "";

  // pidList: any[] = [];
  // pid: string = "A";

  loadData() {
    this.getOnlineInfoGraph();
  }

  mounted() {
    this.loadData(); //初始化-->加载数据
    // this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = { };
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.logTime) {
      temp.endTime = this.logTime;
    }

    if (this.channel == "官方") {
      temp.channel = "";
    } else if (this.channel == "") {
      temp.channel = undefined;
    }
    temp.day = 30;
    return temp;
  }

  //获取查询条件
  getOnlineInfoGraph() {
    let xData: any = [];
    let yData1: any = [];
    let yData2: any = [];
    let yData3: any = [];
    this.chartLine1 = echarts.init(document.getElementById("chartLine1"));
    this.chartLine1.showLoading({ text: "" });
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetOnlineGraph", queryItem, true)
      .then(() => {
        this.onlineGraph.transferData.forEach((item, index) => {
          xData.push(getYearMonthDay(item.localeSumDate));
          yData1.push(item.maxOnline || 0);
          yData2.push(item.minOnline || 0);
          yData3.push(item.avgOnline || 0);
        });
        this.drawLineChart(xData, yData1, yData2, yData3);
      })
      .catch(ex => {
        console.error(ex);

        return;
      });
  }

  drawLineChart(xData, yData1, yData2, yData3) {
    //获取实时数据库数据
    this.chartLine1.setOption({
      color: this.colors,
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["最高在线", "最低在线", "平均在线"],
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
        type: "value"
      },
      series: [
        {
          name: "最高在线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: this.colors[0]
          },
          data: yData1
        },
        {
          name: "最低在线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: this.colors[1]
          },
          data: yData2
        },
        {
          name: "平均在线",
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: this.colors[2]
          },
          data: yData3
        }
      ]
    });
    this.chartLine1.hideLoading();
  }
}
</script>