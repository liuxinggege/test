<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="充值每日数据"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">充值每日数据</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
      </el-select>
      <span>充值渠道</span>
      <el-input v-model="channel" style="width:120px; margin:5px 20px 0px 0px"></el-input>
      <span>时间范围</span>
      <el-date-picker v-model="logTime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:5px 20px 5px 10px" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
      <el-button type="success" @click="loadDayData" style="margin:0px 0px 10px 0px">搜索</el-button>
      <br>
      <el-select v-model="minute" placeholder="请选择时间" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in minuteList" :key="item.minute" :label="item.name" :value="item.minute"></el-option>
      </el-select>
      <el-button type="success" @click="loadTimeData" style="margin:0px 0px 10px 0px">搜索</el-button>
      <!--列表-->
      <el-table :data="dataList" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column prop="sumDate" label="统计时间" min-width="150" :formatter="sumDateFunc" align="center"></el-table-column>
        <el-table-column prop="payType" label="充值类型" min-width="100" align="center" :formatter="payTypeFormat"></el-table-column>
        <el-table-column prop="channel" label="充值渠道" min-width="100" align="center"></el-table-column>
        <el-table-column prop="arrivalCount" label="成功数" min-width="100" align="center"></el-table-column>
        <el-table-column prop="totalCount" label="总单数" min-width="100" align="center"></el-table-column>
        <el-table-column prop="successRate" label="成功率" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createMoney" label="创建到账金额" min-width="100" align="center"></el-table-column>
        <el-table-column prop="arrivalMoney" label="回调到账金额" min-width="100" align="center"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { TotalStaticState } from "../../store/stateInterface";
import { myAsyncFn, myDispatch } from "../../utils/index.js";
import { formUtil } from "../../utils/formatUtils";
import {
  getDailyRecharge,
  getDailyRechargeDay
} from "../../api/admin/dataStatic/dataStatic";
//TotalStatic
interface QueryItem {
  // pid: string;
  min?: Number;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
  channel?: String;
  pid?: String;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class DailyRecharge extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  totalStatic: TotalStaticState = this.$store.state.totalStatic; //表单数据
  dataList: any[] = []; //表单数据
  dailyRechargeData: any[] = []; //表单数据
  dailyRechargeTimeData: any[] = []; //表单时间段数据
  dailyRechargeDataBoolean: boolean = true; //表单数据控制

  //时间选择定义
  minute: number = 10;
  minuteList = [
    {
      minute: 10,
      name: "10分钟"
    },
    {
      minute: 20,
      name: "20分钟"
    },
    {
      minute: 30,
      name: "30分钟"
    },
    {
      minute: 40,
      name: "40分钟"
    },
    {
      minute: 50,
      name: "50分钟"
    },
    {
      minute: 60,
      name: "60分钟"
    }
  ];

  pidList: any[] = [];
  pid: string = "";

  logTime: Date[] = [];
  channel: String = "";
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  loadDayData() {
    this.page = 1;
    this.dailyRechargeDataBoolean = true;
    this.loadData();
  }
  async loadData() {
    let ret: any = {};
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    if (this.dailyRechargeDataBoolean) {
      ret = await myAsyncFn(getDailyRecharge, queryItem);
    } else {
      ret = await myAsyncFn(getDailyRechargeDay, queryItem);
    }
    if (ret.code === 200) {
      this.dataList = ret.msg.pageData.map(e => {
        e.arrivalMoney = formUtil.moneyFormat(e.arrivalMoney);
        e.createMoney = formUtil.moneyFormat(e.createMoney);
        return e;
      });
      this.totalCount = ret.msg.totalCount;
    }
  }
  async loadTimeData() {
    this.page = 1;
    this.dailyRechargeDataBoolean = false;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.dailyRechargeDataBoolean !== false) {
      if (this.logTime && this.logTime.length === 2) {
        temp.startTime = this.logTime[0];
        temp.endTime = this.logTime[1];
      }
    } else {
      if (this.minute) {
        temp.min = this.minute;
      }
    }
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.pid) {
      temp.pid = this.pid;
    }
    return temp;
  }

  getExportQueryItem() {
    let temp: QueryItem = {};
    if (this.logTime && this.logTime.length === 2) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }
  //日期整形
  sumDateFunc(row, column) {
    let sdate;
    if (row.sumDate) {
      let date = new Date(row.sumDate);
      sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
    } else {
      sdate = "/";
    }

    return sdate;
  }
  //整形
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  payTypeFormat(row) {
    switch (row.payType) {
      case "aliPay":
        return "支付宝";
      case "ali_pay":
        return "支付宝";
      case "wx":
        return "微信";
      case "wx_pay":
        return "微信";
      case "bankCard":
        return "银行卡";
      case "wx_fix":
        return "固定微信";
      case "union_pay":
        return "银联";
      case "yun_pay":
        return "云闪付";
      case "ali_person":
        return "个人支付宝";
      case "ali_fix":
        return "固定支付宝";
      default:
        return row.payType;
    }
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
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
