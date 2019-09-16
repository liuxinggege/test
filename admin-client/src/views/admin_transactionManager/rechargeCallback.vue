<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代付订单"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">支付回调</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>uid</span>
      <el-input v-model="uid" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>bill订单id</span>
      <el-input v-model="orderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>游戏服订单id</span>
      <el-input v-model="gameOrderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>第三方订单号</span>
      <el-input v-model="thirdOrderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>支付流水号</span>
      <el-input v-model="flowId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <br>
      <span>处理状态</span>
      <el-select v-model="closed" placeholder="请选择" style="margin:0px 20px 0px 10px">
        <el-option v-for="item in stateOptionsArr" :key="item.key" :label="item.value" :value="item.key"></el-option>
      </el-select>
      <span>时间</span>
      <el-date-picker v-model="createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间"
        end-placeholder="结束时间"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="downloadExcel">导出</el-button>
      <!--列表-->
      <el-table :data="rechargeCallbackData.rechargeCallbackData" border highlight-current-row style="width: 100%" row-class-name="payTable" header-row-class-name="payTable">
        <el-table-column prop="pid" width="200px" label="项目"  :formatter="pidFormat"></el-table-column>
        <el-table-column prop="orderId" width="210px" label="bill订单id"  fixed></el-table-column>
        <el-table-column prop="gameOrderId" width="180px" label="游戏服订单id" ></el-table-column>
        <el-table-column prop="uid" width="180px" label="玩家id"></el-table-column>
        <el-table-column prop="price" width="200px" label="订单金额"></el-table-column>
        <el-table-column prop="payType" width="180px" label="支付类型"></el-table-column>
        <el-table-column prop="channel" width="90px" label="通道名字"></el-table-column>
        <el-table-column prop="userChannel" width="120px" label="用户渠道"></el-table-column>
        <el-table-column prop="paidTime" width="120px" label="付款时间" :formatter="paidTimeFunc"></el-table-column>
        <el-table-column prop="thirdOrderId" width="180px" label="第三方订单号" ></el-table-column>
        <el-table-column prop="flowId" width="180px" label="支付流水号" ></el-table-column>
        <el-table-column prop="closed" width="120px" label="订单是否操作" :formatter="closedFunc"></el-table-column>
        <el-table-column prop="opt" width="80px" label="操作人" ></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" v-if="!scope.row.closed" @click="check(scope.row._id)">记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条 分页-->
     	<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="rechargeCallbackData.totalCount">
				</el-pagination>
			</el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { myDispatch } from "../../utils/index.js";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { RechargeCallback } from "../../store/stateInterface";
interface QueryItem {
  //定义参数接口(获取订单)
  page?: number;
  createStartTime?:Date,
  createEndTime?:Date,
  count?: number;
  uid?: string;
  orderId?: string;
  gameOrderId?: string;
  thirdOrderId?: string;
  flowId?: string;
  closed?: boolean;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class PayWithdraw extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  rechargeCallbackData:RechargeCallback = this.$store.state.rechargeCallback; //表单数据
  dialogEditVisible: boolean = false;
  dialogClose: boolean = false;
  page: number = 1; //当前页
  pidList: any[] = [];
  createTime: Date[] = [];
  count: number = 10;
  stateOptionsArr = [
    { key:"", value: "全部" },
    { key:true, value: "已经处理" },
    { key: false, value: "没有处理" }
  ];
  uid:string  = "";
  closed:any=false;
  orderId:string  = "";
  gameOrderId:string  = "";
  thirdOrderId:string  = "";
  flowId:string  = "";
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetRepeat", queryItem, true).then(() => {});
  }
  closeRepeat() {
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  check(id){
    this.$confirm(`此操作将记录操作状态，修改完成将不能撤回，请确认已经处理完成这条订单在操作, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myDispatch(this.$store, "UpdateRepeat", {id:id}).then(() => {
           if(this.rechargeCallbackData.code===200){
             this.$message({type: "success", message: "操作成功" });
              this.loadData();
              return;
           }else if(this.rechargeCallbackData.code!==400){
              this.$message({type: "error", message:this.rechargeCallbackData.err});
              return;
           }
          });
        }).catch(() => {       
        });
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.uid) {
      temp.uid = this.uid;
    }
    if (this.orderId) {
      temp.orderId = this.orderId;
    }
    if (this.gameOrderId) {
      temp.gameOrderId = this.gameOrderId;
    }
    if (this.thirdOrderId) {
      temp.thirdOrderId = this.thirdOrderId;
    }
    if (this.flowId) {
      temp.flowId = this.flowId;
    }
     if (this.createTime && this.createTime[0]) {
      temp.createStartTime = this.createTime[0];
      temp.createEndTime = this.createTime[1];
    }
    if(this.closed!==""){
       temp.closed = this.closed
    }
    temp.page = this.page;
    temp.count = this.count;
    return temp;
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
   pidFormat(row, column){
    let name = "";
    if(row.pid){
      this.pidList.forEach(element => {
          if(element.pid === row.pid){
            name =  element.name ;
          }
      });
    }
    return name ;
  }
  closedFunc(row, column){
    return row.closed?"已操作":"未操作";
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
   downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "bill订单id", field: "orderId", type: "string" },
      { title: "游戏服订单id", field: "gameOrderId", type: "string" },
      { title: "玩家id", field: "uid", type: "string" },
      { title: "订单金额", field: "price", type: "string" },
      { title: "支付类型", field: "payType", type: "string" },
      { title: "通道名字", field: "channel", type: "string" },
      { title: "用户渠道", field: "userChannel", type: "string" },
      { title: "付款时间", field: "paidTime", type: "Date" },
      { title: "第三方订单号", field: "thirdOrderId", type: "string" },
      { title: "支付流水号", field: "flowId", type: "string" },
      { title: "订单是否操作", field: "closed", type: "booleanType" },
      { title: "操作人", field: "opt", type: "string" },
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetRepeatByExcel", queryItem).then(ret => {
      downloadExcel(ret,this);
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
