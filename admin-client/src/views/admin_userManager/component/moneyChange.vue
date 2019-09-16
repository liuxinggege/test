<template>
  <div style="border:2px solid #AFEEEE; z-index:999">
    <el-col class="toolbar1">
      <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="流水详情"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">流水详情({{uid}})</span>
      <el-select v-model="type" placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
        <el-option v-for="item in chgTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-date-picker v-model="time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      <el-button type="primary" @click="refrsh" style="margin: 20px;">搜索</el-button>
      <!-- 导出数据到EXCEL -->
      <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
    </el-col>
    <!--工具条-->
    <el-col class="toolbar1">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="moneyChange.totalCount">></el-pagination>
      <!-- :total="0" -->
    </el-col>
    <!--列表-->
    <el-table :data="moneyChange.data" border highlight-current-row style="width: 100%;">
      <el-table-column prop="uid" label="uid" width="120" align="center"></el-table-column>
      <el-table-column prop="chgType" label="类型" width="100" align="center" :formatter="chageTypeFunc"></el-table-column>
      <el-table-column prop="logDate" label="时间" width="170" :formatter="timeFormat1" align="center"></el-table-column>
      <el-table-column prop="moneyOrg" label="变化前金币" min-width="150" align="center"></el-table-column>
      <el-table-column prop="moneyEnd" label="变化后金币" width="170" align="center"></el-table-column>
      <el-table-column prop="chgMoney" label="变化金币" min-width="150" align="center"></el-table-column>
      <el-table-column prop="bankOrg" label="变化前银行金币" min-width="150" align="center"></el-table-column>
      <el-table-column prop="bankEnd" label="变化后银行金币" min-width="150" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { downloadExcel } from "../../../utils/downloadEXCEL";
import { GeneralUser } from "../../../store/stateInterface";
import { myDispatch, secToString } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GenUserAttribution extends Vue {
  //初始化数据
  uid = this.$attrs.curUid;
  generalUser: GeneralUser = this.$store.state.generalUser;
  moneyChange = this.generalUser.moneyChange;
  page: number = 1; //当前页
  count: number = 10;

  time: Date[] = [
    new Date(
      new Date(Date.now()).getFullYear(),
      new Date(Date.now()).getMonth(),
      new Date(Date.now()).getDate() - 3,
      0,
      0,
      0
    ),
    new Date(
      new Date(Date.now()).getFullYear(),
      new Date(Date.now()).getMonth(),
      new Date(Date.now()).getDate() + 1,
      0,
      0,
      0
    )
  ];
  type = "";
  chgTypeOptions = [
    {
      value: "",
      label: "全部"
    },
    {
      value: 0,
      label: " 转账"
    },
    {
      value: 1,
      label: "银行"
    },
    {
      value: 2,
      label: "充值"
    },
    {
      value: 3,
      label: "兑换"
    },
    {
      value: 4,
      label: "兑换失败"
    },
    {
      value: 5,
      label: "游戏输赢"
    },
    {
      value: 6,
      label: "师父"
    },
    {
      value: 7,
      label: "彩金"
    },
    {
      value: 8,
      label: "上下分"
    },
    {
      value: 9,
      label: "新人领奖"
    },
    {
      value: 10,
      label: "追分"
    },
    {
      value: 11,
      label: "绑定领奖"
    },
    {
      value: 12,
      label: "世界杯下注"
    },
    {
      value: 13,
      label: "世界杯结算"
    },
    {
      value: 14,
      label: "退款成功"
    },
    {
      value: 18,
      label: "活动赠送"
    }
  ];

  created() {
    this.uid = this.$attrs.curUid;
    this.loadData();
  }
  refrsh() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let queryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetMoneyChange", queryItem).then(() => {
      this.moneyChange = this.generalUser.moneyChange;
    });
  }
  getQueryItem() {
    let tmp: any = {
      uid: this.uid
    };
    if (this.type !== "") {
      tmp.chgType = this.type;
    }
    if (this.time && this.time.length) {
      tmp.logStartTime = this.time[0];
      tmp.logEndTime = this.time[1];
    } else {
      let now = new Date(Date.now());
      tmp.logStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 3,
        0,
        0,
        0
      );
      tmp.logEndTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      );
    }
    return tmp;
  }

  chageTypeFunc(row, column) {
    switch (row.chgType) {
      case 0:
        return "转账";
      case 1:
        return "银行";
      case 2:
        return "充值";
      case 3:
        return "兑换";
      case 4:
        return "兑换失败";
      case 5:
        return "游戏输赢";
      case 6:
        return "师父";
      case 7:
        return "彩金";
      case 8:
        return "上下分";
      case 9:
        return "新人领奖";
      case 10:
        return "追分";
      case 11:
        return "绑定领奖";
      case 12:
        return "世界杯下注";
      case 13:
        return "世界杯结算";
      case 14:
        return "退款成功";
      case 18:
        return "活动赠送";
    }
  }
  timeFormat1(row, column) {
    let date = new Date(row.logDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
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
  //导出
  //导出excle
  downloadExcel() {
    const downloadExcelCfg = [
      {
        title: "uid",
        field: "uid",
        type: "string"
      },
      {
        title: "类型",
        field: "chgType",
        type: "MoneyChangeType"
      },
      {
        title: "时间",
        field: "logDate",
        type: "Date"
      },
      {
        title: "变化前金币",
        field: "moneyOrg",
        type: "string"
      },
      {
        title: "变化后金币",
        field: "moneyEnd",
        type: "string"
      },
      {
        title: "变化金币",
        field: "chgMoney",
        type: "string"
      },
      {
        title: "变化前银行金币",
        field: "bankOrg",
        type: "string"
      },
      {
        title: "变化后银行金币",
        field: "bankEnd",
        type: "string"
      }
    ];
    // if ((!this.userId && !this.logTime) || !this.logTime.length) {
    //   this.$message({
    //     type: "error",
    //     message: "必须输入任一搜索条件"
    //   });
    //   return;
    // }
    let queryItem: any = this.getQueryItem();
    myDispatch(this.$store, "GetMoneyChangeExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 0px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 10px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: sans-serif;
  color: #a0a0a0;
}

.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}

.content_font {
  font-size: 14px;
  font-weight: 700;
}
</style>
