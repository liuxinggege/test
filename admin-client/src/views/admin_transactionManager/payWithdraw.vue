<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代付订单"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代付订单</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>代付渠道</span>
      <el-select v-model="channel" placeholder="请选择" style="margin:0px 20px 10px 0">
        <el-option v-for="item in channelOptionsArr" :key="item.key" :label="item.value" :value="item.key"></el-option>
      </el-select>
      <span>订单号</span>
      <el-input v-model="id" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>银行卡号</span>
      <el-input v-model="bankNumber" style="width:120px; margin:0px 20px 5px 10px"></el-input>
      <span>三方订单号</span>
      <el-input v-model="thirdOrderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>订单状态</span>
      <el-select v-model="state" placeholder="请选择" style="margin:0px 20px 0px 10px">
        <el-option v-for="item in stateOptionsArr" :key="item.key" :label="item.value" :value="item.key"></el-option>
      </el-select>
      <br>
      <span>创建时间</span>
      <el-date-picker v-model="createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间"
        end-placeholder="结束时间"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="addPayOrder">添加订单</el-button>
      <!--列表-->
      <el-table :data="PayWithdraw.payWithdrawData" border highlight-current-row style="width: 100%" row-class-name="payTable" header-row-class-name="payTable">
        <el-table-column prop="_id" label="订单号" width="210px" fixed></el-table-column>
        <el-table-column prop="thirdOrderId" width="200px" label="第三方订单号"></el-table-column>
        <el-table-column prop="bankName" width="180px" label="银行名称"></el-table-column>
        <el-table-column prop="bankNumber" width="180px" label="银行卡号"></el-table-column>
        <el-table-column prop="accountName" width="90px" label="账户姓名"></el-table-column>
        <el-table-column prop="money" width="120px" label="申请金额"></el-table-column>
        <el-table-column prop="amount" width="120px" label="打款金额"></el-table-column>
        <el-table-column prop="createTime" width="180px" label="创建时间" :formatter="createTimeFunc"></el-table-column>
        <el-table-column prop="closeTime" width="180px" label="关闭时间" :formatter="closeTimeFunc"></el-table-column>
        <el-table-column prop="paidTime" width="180px" label="打款时间" :formatter="paidTimeFunc"></el-table-column>
        <el-table-column prop="state" width="90px" label="订单状态" :formatter="stateFormatter"></el-table-column>
        <el-table-column prop="reason" width="200px" label="理由" class-name="liyou"></el-table-column>
        <el-table-column prop="channel" width="120px" label="代付渠道"></el-table-column>
        <el-table-column prop="closed" width="80px" label="关闭状态" :formatter="colsedFormatter"></el-table-column>
        <el-table-column prop="opt" label="操作人" width="80px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" v-if="!scope.row.closed" @click="closePayWithdraw(scope.row._id)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条 分页-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="PayWithdraw.totalCount"></el-pagination>
      </el-col>
      <!-- 创建订单弹层 -->
      <el-dialog :visible.sync="dialogEditVisible" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="90px" style="width:800px;">
          <el-form-item label="代付渠道：" class="formItem">
            <el-select v-model="addChannel" placeholder="请选择" style="width:200px" @change="loadCreateItem">
              <el-option v-for="item in channelOptionsArr" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="createItems.accountName" label="账户姓名：" class="formItem">
            <el-input style="width:200px" v-model="addAccountName"></el-input>
          </el-form-item>
          <el-form-item v-if="createItems.bankName" label="银行名称：" class="formItem">
            <el-input style="width:200px" v-model="addBankName"></el-input>
          </el-form-item>
          <el-form-item v-if="createItems.bankNumber" label="银行卡号：" class="formItem">
            <el-input style="width:200px" v-model="addBankNumber"></el-input>
          </el-form-item>
          <el-form-item v-if="createItems.money" label="申请金额：" class="formItem">
            <el-input style="width:200px" v-model="addMoney"></el-input>
          </el-form-item>
          <el-form-item v-if="createItems.bankCode" label="银行编码：" class="formItem">
            <el-input style="width:200px" v-model="addBankCode"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="createOrder">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="'关闭订单：'+closeId" :visible.sync="dialogClose">
        <el-form>
          <el-input type="textarea" :rows="2" placeholder="请输入备注内容" v-model="closeRemark"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCloseCansel">取 消</el-button>
          <el-button type="primary" @click="dialogCloseSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { PayWithdrawState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
interface QueryItem {
  //定义参数接口(获取订单)
  id?: string;
  page?: number;
  count?: number;
  state?: string;
  bankNumber?: string;
  channel?: string;
  thirdOrderId?: string;
  createStartTime?: Date;
  createEndTime?: Date;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class PayWithdraw extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
    this.loadConfig();
  }
  /*inital data*/
  PayWithdraw: PayWithdrawState = this.$store.state.payWithdraw; //表单数据
  now = new Date(Date.now());
  startTime = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() - 7,
    0,
    0,
    0
  );
  endTime = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() + 1,
    0,
    0,
    0
  );
  logTime: Date[] = [this.startTime, this.endTime];
  dialogEditVisible: boolean = false;
  dialogClose: boolean = false;
  page: number = 1; //当前页
  count: number = 10;
  stateOptionsArr = [
    { key: "", value: "全部" },
    { key: "ordering", value: "创建成功" },
    { key: "ordered", value: "申请成功" },
    { key: "paid", value: "打款完成" }
  ];
  stateOptions = {
    ordering: "创建成功",
    ordered: "申请成功",
    paid: "打款完成"
  };
  channelOptionsArr: any[] = [];
  closedOptionsArr = [
    { key: "", value: "全部" },
    { key: "true", value: "已关闭" },
    { key: "false", value: "未关闭" }
  ];
  closedOptions = {
    true: "已关闭",
    false: "未关闭"
  };
  channel = "";
  bankNumber = "";
  id = "";
  thirdOrderId = "";
  state = "";
  closed = "";
  createTime: Date[] = [];
  addChannel = "";
  createItems: any = "";

  addAccountName = "";
  addBankName = "";
  addBankNumber = "";
  addMoney = "";
  addBankCode=undefined

  closeId = "";
  closeRemark = "";
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    //(this.xxname as any)="ddsfsfsd"
    myDispatch(this.$store, "GetPayOrder", queryItem, true).then(() => {});
  }
  loadConfig() {
    myDispatch(this.$store, "GetPayConfig", {}, true).then(() => {
      let configArr = this.PayWithdraw.payConfigData;
      configArr.forEach(item => {
        let line = { key: item.channel, value: item.name };
        this.channelOptionsArr.push(line);
      });
    });
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  createOrder() {
    //创建订单
    let queryItem = {
      money: this.addMoney,
      bankName: this.addBankName,
      bankNumber: this.addBankNumber,
      accountName: this.addAccountName,
      channel: this.addChannel,
      bankCode:this.addBankCode
    };
    myDispatch(this.$store, "CreatePayOrder", queryItem).then(() => {
      if (this.PayWithdraw.code === 200) {
        this.$message({ type: "success", message: "添加成功" });
        this.loadData();
        this.dialogEditVisible = false;
        return;
      } else if (this.PayWithdraw.code !== 400) {
        this.$message({ type: "error", message: this.PayWithdraw.err });
        return;
      }
    });
  }
  loadCreateItem() {
    let configArr = this.PayWithdraw.payConfigData;
    for (let i in configArr) {
      if (configArr[i].channel == this.addChannel) {
        this.createItems = configArr[i];
        break;
      }
    }
  }
  addPayOrder() {
    this.dialogEditVisible = true;
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.id) {
      temp.id = this.id;
    }
    if (this.bankNumber) {
      temp.bankNumber = this.bankNumber;
    }
    if (this.channel) {
      temp.channel = this.channel;
    }
    if (this.thirdOrderId) {
      temp.thirdOrderId = this.thirdOrderId;
    }
    if (this.state) {
      temp.state = this.state;
    }
    temp.page = this.page;
    temp.count = this.count;
    if (this.createTime && this.createTime[0]) {
      temp.createStartTime = this.createTime[0];
      temp.createEndTime = this.createTime[1];
    }
    return temp;
  }
  cancelEdit() {
    this.dialogEditVisible = false;
  }
  close() {
    this.dialogEditVisible = false;
    this.addAccountName = "";
    this.addBankName = "";
    this.addBankNumber = "";
    this.addMoney = "";
    this.addChannel = "";
    this.addBankCode=undefined
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
  colsedFormatter(row, column) {
    //状态格式化
    return this.closedOptions[row.closed];
  }
  stateFormatter(row, column) {
    if (row.state) {
      return this.stateOptions[row.state];
    }
    return "";
  }
  createTimeFunc(row, column) {
    //时间格式化
    if (row.createTime) {
      let date = new Date(row.createTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  submitTimeFunc(row, column) {
    //时间格式化
    if (row.submitTime) {
      let date = new Date(row.submitTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  closeTimeFunc(row, column) {
    //时间格式化
    if (row.closeTime) {
      let date = new Date(row.closeTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  paidTimeFunc(row, column) {
    //时间格式化
    if (row.paidTime) {
      let date = new Date(row.paidTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  closePayWithdraw(id) {
    this.closeId = id;
    this.dialogClose = true;
  }
  dialogCloseCansel() {
    //关闭弹层
    this.dialogClose = false;
    this.closeRemark = "";
  }
  dialogCloseSubmit() {
    let queryItem = {
      id: this.closeId,
      remark: this.closeRemark
    };
    console.log(queryItem);
    myDispatch(this.$store, "ClosePayOrder", queryItem).then(res => {
      this.dialogClose = false;
      this.loadData();
    });
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
.payTable {
  td div {
    text-align: center;
  }
  th div {
    text-align: center;
  }
}
.formItem {
  &:nth-child(2n-1) {
    margin-right: 20px;
    margin-left: 90px;
  }
}
</style>
