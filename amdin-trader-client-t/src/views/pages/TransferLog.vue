<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="转账记录"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">兑换记录</span>
        <span class="total">兑换总金额：{{total}}</span>
      </el-col>
      <el-button type="primary">主要按钮</el-button>
      <div>
        <span>玩家ID</span>
        <el-input v-model="from" style="width:120px; margin:20px 10px"></el-input>
        <span>创建时间</span>
        <el-date-picker v-model="dateTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <span>完成日期</span>
        <el-date-picker v-model="transferedTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
      </div>
      <el-table :data="pageData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" align="center">
        <el-table-column prop="_id" label="订单号" min-width="210" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" align="center" :formatter="statusFormat"></el-table-column>
        <el-table-column prop="vipUid" label="商人ID" min-width="100" align="center"></el-table-column>
        <el-table-column prop="uid" label="用户ID" min-width="100" align="center"></el-table-column>
        <el-table-column prop="money" label="金币" min-width="100" align="center"></el-table-column>
        <el-table-column prop="amount" label="应付金币" min-width="100" align="center"></el-table-column>
        <el-table-column prop="tax" label="税收" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="150" :formatter="dateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="finishTime" label="完成日期" min-width="150" :formatter="transferedTimeFormat" align="center"></el-table-column>
      </el-table>
      <el-pagination align="right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </el-card>
  </div>
</template>

<script >
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";
import { create } from "domain";

// @Component 修饰符注明了此类为一个 Vue 组件
export default {
  data: function() {
    return {
      page: 1,
      count: 10,
      pageData: this.$store.state.transferLog.pageData,
      totalCount: this.$store.state.transferLog.totalCount,
      total: this.$store.state.transferLog.total,
      from: "",
      dateTime: [],
      transferedTime: []
    };
  },
  created() {
    this.searchData();
  },
  methods: {
    getData() {
      this.page = 1;
      this.searchData();
    },
    async searchData() {
      let cond = this.getCond();
      await myDispatch(this.$store, "GetTransferMoneyLog", cond);
      this.pageData = this.$store.state.transferLog.pageData;
      this.totalCount = this.$store.state.transferLog.totalCount;
      this.total = this.$store.state.transferLog.total;
    },
    getCond() {
      let tmp = {};
      if (this.from) {
        tmp.from = Number(this.from);
      }
      if (this.page) {
        tmp.page = this.page;
      }
      if (this.count) {
        tmp.count = this.count;
      }
      if (this.dateTime && this.dateTime.length === 2) {
        tmp.dateStartTime = this.dateTime[0];
        tmp.dateEndTime = this.dateTime[1];
      }
      if (this.transferedTime && this.transferedTime.length === 2) {
        tmp.transferedStartTime = this.transferedTime[0];
        tmp.transferedEndTime = this.transferedTime[1];
      }
      return tmp;
    },
    handleSizeChange(val) {
      this.page = 1;
      this.count = val;
      this.searchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.searchData();
    },
    statusFormat(row) {
      if (row.status) {
        if (row.status >= 8192) {
          //16进制的2000的10进制值，(大于2000就表示审核通过)
          return "审核通过";
        }
        return "审核失败";
      }
      return "没有状态";
    },
    dateTimeFormat(row) {
      if (row.createTime) {
        let date = new Date(row.createTime);
        let sdate = date.toLocaleString(undefined, { hour12: false });
        return sdate;
      }
      return "-";
    },
    transferedTimeFormat(row) {
      if (row.finishTime) {
        let date = new Date(row.finishTime);
        let sdate = date.toLocaleString(undefined, { hour12: false });
        return sdate;
      }
      return "-";
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.total {
  position: absolute;
  right: 15%;
  margin-top: 8px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #fff;
  min-height: 100vh;
  margin-top: -50px;
  padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
