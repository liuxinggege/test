<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="结算审核">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">结算审核</span>
      </el-col>
      <div class="box">
        <span>渠道账号</span>
        <el-input v-model="channel" style="width:120px; margin:0 10px"></el-input>
        <span>支付宝</span>
        <el-input v-model="alipay" style="width:120px; margin:0 10px"></el-input>
        <span>时间</span>
        <el-date-picker v-model="logTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
        <span>状态</span>
        <el-select v-model="value" placeholder="全部" style="margin:0 10px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 50px">搜索</el-button>
      </div>
      <!--列表-->
      <el-table :data="billingAudit.channelAccountInfoData" border highlight-current-row style="width: 99%;" max-height="600">
        <el-table-column prop="_id" label="结算订单号" min-width="220" align="center" />
        <el-table-column prop="withdrawOrderID" label="Bill订单号" min-width="175" align="center" />
        <el-table-column prop="status" label="订单状态" width="100" align="center" :formatter="formatStatus" />
        <el-table-column prop="act" label="渠道账号" width="150" align="center" />
        <el-table-column prop="applyMoney" label="申请结算金额" width="200" align="center" />
        <el-table-column prop="totalSetMoney" label="累计结算金额" width="170" align="center" />
        <el-table-column prop="alipayAccount" label="支付宝" width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.order_userInfo?scope.row.order_userInfo[0].alipayAccount :"-"}}</span>
            <el-button type="text" @click="editAlipays(scope.row,scope.row.order_userInfo[0].alipayAccount, '支付宝')">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="alipayName" label="支付宝姓名" width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.order_userInfo?scope.row.order_userInfo[0].alipayName :"-"}}</span>
            <el-button type="text" @click="editAlipays(scope.row,scope.row.order_userInfo[0].alipayName, '支付宝姓名')">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="兑换IP" width="150" align="center" />
        <el-table-column prop="applyDate" label="提交时间" min-width="150" align="center" :formatter="submitTimeFunc" />
        <el-table-column prop="dealWithDate" label="处理时间" min-width="150" align="center" :formatter="submitTimeFunc1" />
        <el-table-column prop="arrivedDate" label="到账时间" min-width="150" align="center" :formatter="submitTimeFunc2" />
        <el-table-column prop="operator" label="操作人" min-width="150" align="center" />
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 'await'" type="text" @click="agree(scope.$index, scope.row)">通过</el-button>
            <el-button v-if="scope.row.status === 'await'" type="text" @click="refuse(scope.$index, scope.row)">拒绝</el-button>
            <el-button v-else type="text" disabled> - </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑 支付宝/支付宝姓名 -->
      <el-dialog :visible.sync="dialogEditChannelVisible" @close="close">
        <el-form class="small-space" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
          <el-form-item :label=a lipayType>
            <el-input type="text" v-model="alipay" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditAlipay">取 消</el-button>
          <el-button type="primary" @click="editChannelConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="billingAudit.totalCount">
        </el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { BillingAuditState } from "../../store/stateInterface";

interface QueryItem {
  channel?: string;
  alipay?: string;
  status?: string[];
  page?: number;
  count?: number;
  startDate?: Date;
  endDate?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class BillingAudit extends Vue {
  page: number = 1; //当前页
  count: number = 10;
  logTime: Date[] = [];
  billingAudit: BillingAuditState = this.$store.state.billingAudit;

  channel: string = "";
  alipay: string = "";
  alipayType: string = "";
  changeAlipay: any = {
    //修改支付宝
    alipayAccount: "",
    alipayName: "",
    act: ""
  };

  dialogEditChannelVisible: boolean = false;
  value: string = "all";
  options: any = [
    { value: "all", label: "全部" },
    { value: "success", label: "成功" },
    { value: "fail", label: "失败" },
    { value: "transfer", label: "转账中" },
    { value: "await", label: "等待审核" }
  ];

  //生命周期钩子函数
  created() {
    this.loadData();
  }

  //函数
  refresh() {
    this.loadData();
  }

  //初始化数据
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetBillingAudit", queryItem, true).then(() => {});
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }

  getQueryItem() {
    let tmp: QueryItem = {};
    if (this.value === "all") {
      tmp.status = ["success", "fail", "transfer", "await"];
    } else {
      tmp.status = [this.value];
    }
    if (this.channel) {
      tmp.channel = this.channel;
    }
    if (this.alipay) {
      tmp.alipay = this.alipay;
    }
    if (this.logTime && this.logTime.length === 2) {
      tmp.startDate = this.logTime[0];
      tmp.endDate = this.logTime[1];
    }
    return tmp;
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

  cancelEditAlipay() {
    // 点击取消按钮
    this.dialogEditChannelVisible = false;
  }

  agree(index, row) {
    // 同意按钮
    this.$confirm("确认通过该结算?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AgreeBillingAudit", {
          act: row.act,
          money: row.applyMoney,
          orderID: row._id,
          logDate: new Date(),
          deviceIp: row.ip,
          alipayAccount: row.order_userInfo[0].alipayAccount,
          alipayName: row.order_userInfo[0].alipayName
        })
          .then(() => {
            if (this.billingAudit.agreeCode === 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "error",
                message: "操作失败"
              });
            }
          })
          .catch(ex => {
            console.error(ex);
            this.$message({
              type: "error",
              message: ex.message
            });
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  //
  refuse(index, row) {
    this.$confirm("确认拒绝该结算?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "RefuseBillingAudit", {
          act: row.act,
          money: row.applyMoney,
          orderID: row._id,
          logDate: new Date()
        })
          .then(() => {
            if (this.billingAudit.agreeCode === 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "error",
                message: "操作失败"
              });
            }
          })
          .catch(ex => {
            console.error(ex);
            this.$message({
              type: "error",
              message: ex.message
            });
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }

  editChannelConfirm() {
    this.$confirm("此操作将永久修改该用户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        if (this.alipayType === "支付宝") {
          this.changeAlipay.alipayAccount = this.alipay;
          //修改支付宝账号
          this.$store
            .dispatch("UpdateBillingAuditAlipayAccount", {
              ...this.changeAlipay
            })
            .then(() => {
              if (this.billingAudit.eidtCode === 200) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.loadData();
              }
            })
            .catch(ex => {
              console.error(ex);
              this.$message({
                type: "error",
                message: ex.message
              });
            });
        } else {
          this.changeAlipay.alipayName = this.alipay;
          //修改支付宝姓名
          this.$store
            .dispatch("UpdateBillingAuditAlipayName", { ...this.changeAlipay })
            .then(() => {
              if (this.billingAudit.eidtCode === 200) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.loadData();
              }
            })
            .catch(ex => {
              console.error(ex);
              this.$message({
                type: "error",
                message: ex.message
              });
            });
        }
        this.dialogEditChannelVisible = false;
        return;
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
        this.dialogEditChannelVisible = false;
      });
  }


  editAlipays(row, value, type) {
    //修改支付宝账号或者姓名，取决于type
    this.dialogEditChannelVisible = true;
    this.alipayType = type;
    this.alipay = value;
    this.changeAlipay.act = row.act;
  }
  close() {
    this.alipay = "";
  }

  submitTimeFunc(row, column) {
    if (row.applyDate) {
      let date = new Date(row.applyDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }

  submitTimeFunc1(row, column) {
    if (row.dealWithDate) {
      let date = new Date(row.dealWithDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }

  submitTimeFunc2(row, column) {
    if (row.arrivedDate) {
      let date = new Date(row.arrivedDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  formatStatus(row) {
    switch (row.status) {
      case "success":
        row.status = "成功";
        break;
      case "fail":
        row.status = "失败";
        break;
      case "transfer":
        row.status = "转账中";
        break;
      case "await":
        row.status = "等待审核";
        break;
      default:
        break;
    }
    return row.status;
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
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
