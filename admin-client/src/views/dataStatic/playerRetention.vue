<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="玩家留存">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">玩家留存</span>
			</el-col>
			<!--工具条-->
			<span class="content_font"></span>
			<!-- <span>项目</span>
			<el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
				<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select> -->
			<span>渠道ID</span>
			<el-input v-model="channel" style="width:120px; margin:20px 10px"></el-input>
			<span>时间范围</span>
			<el-date-picker v-model="logTime" value-format='yyyy-MM-dd HH:mm:ss' style="margin:5px 20px 5px 10px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
			<el-button type="success" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
			<!--列表-->
			<el-table :data="playerRetention.transferData" border highlight-current-row style="width: 100%;" max-height="600">
				<el-table-column prop="sumDate" label="统计时间" width="150" align="center" :formatter="sumDateFunc"></el-table-column>
				<el-table-column prop="localeSumDate" label="本地统计时间" width="150" align="center" :formatter="logDateFunc"></el-table-column>
				<el-table-column prop="channel" label="渠道" mikn-width="100" align="center" :formatter="channelFormat"></el-table-column>
				<el-table-column prop="newUserCount" label="新增用户" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay2" label="2日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay3" label="3日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay4" label="4日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay5" label="5日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay6" label="6日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay7" label="7日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay8" label="8日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay9" label="9日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay10" label="10日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay11" label="11日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay15" label="15日留存" width="100" align="center"></el-table-column>
				<el-table-column prop="retentionDay30" label="30日留存" width="100" align="center"></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="playerRetention.totalCount">
				</el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { PlayerRetentionState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//PlayerRetention
interface QueryItem {
  // pid: string;
  startTime?: Date;
  endTime?: Date;
  channel?: string;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class PlayerRetention extends Vue {
  // lifecycle hook
  created() {
  //  this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  playerRetention: PlayerRetentionState = this.$store.state.playerRetention; //表单数据
  logTime: Date[] = [];
  channel: string = "";
  page: number = 1; //当前页
  count: number = 10;

  // pidList: any[] = [];
  // pid: string = "A";

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetPlayerRetention", queryItem, true).then(
      () => {}
    );
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {  };

    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.channel == "官方") {
      temp.channel = "";
    } else if (this.channel == "") {
      temp.channel = undefined;
    }
    if (this.logTime && this.logTime[0]) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }

  //整形
  channelFormat(row, column) {
    return row.channel ? row.channel : "all";
  }
  sumDateFunc(row, column) {
    let date = new Date(row.sumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  logDateFunc(row, column) {
    let date = new Date(row.localeSumDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }

  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }

  billRecordsTime(row, column) {
    if (row.time) {
      let date = new Date(row.time);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
