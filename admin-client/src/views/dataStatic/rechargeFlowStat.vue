<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="跑量统计"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">跑量统计</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <el-button type="primary" @click="loadData" style="margin:0px 0px 10px 0px">刷新</el-button>
      <!--列表-->
      <el-table :data="dataList" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column prop="channel" label="渠道" min-width="100" align="center"></el-table-column>
        <el-table-column prop="balance" label="跑量余额" min-width="100" align="center"></el-table-column>
        <el-table-column prop="withdraw" label="当日出款" min-width="100" align="center"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="rechan=recharge(scope.row)">提现</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="channel" :visible.sync="rechargeDialog" width="400px" center>
        <el-form>
          <el-form-item>
            <h3 style="text-align:center">请输入你的提现金额</h3>
            <el-input v-model="rechargeMoney" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitRecharge">确定</el-button>
        </span>
      </el-dialog>
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
import {
  getRechargeFlowStat,
  rechargeFlowStatWithdraw
} from "../../api/admin/dataStatic/dataStatic";
import { myAsyncFn } from "../../utils/index.js";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TodayStatic extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  dataList: any[] = []; //表单数据
  page: number = 1;
  count: number = 10;
  totalCount: number = 0;
  rechargeDialog: boolean = false;
  rechargeMoney: string = "";
  channel: string = "";
  async loadData() {
    let queryItem: any = {
      page: this.page,
      count: this.count
    };
    let ret = await myAsyncFn(getRechargeFlowStat, queryItem);
    if (ret.code === 200) {
      this.dataList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    } else {
      this.$message({
        type: "error",
        message: ret.err
      });
    }
  }
  recharge(row) {
    this.rechargeMoney = "";
    this.channel = row.channel;
    this.rechargeDialog = true;
  }
  submitRecharge() {
    if (!this.rechargeMoney) {
      this.$message({
        type: "error",
        message: "金额不能为空！"
      });
    }
    this.$confirm("此操作将提现,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req: any = {
          channel: this.channel,
          money: this.rechargeMoney
        };
        let ret = await myAsyncFn(rechargeFlowStatWithdraw, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "提现成功！"
          });
          this.loadData();
          this.rechargeDialog = false;
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  cancel() {
    this.rechargeDialog = false;
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
