<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="淘宝支付">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">淘宝支付</span>
      </el-col>
      <!--工具条-->
      <span class="content_font" ></span>
      <span>银行卡号</span>
      <el-input v-model="cardNo" style="width:120px; margin:0px 20px 5px 10px"></el-input>
      <span>订单号</span>
      <el-input v-model="id" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>三方订单号</span>
      <el-input v-model="thirdOrderNo" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>订单状态</span>
      <el-select v-model="state" placeholder="请选择" style="margin:0px 0px 0px 10px">
        <el-option v-for="item in stateOptionsArr" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <span>提现状态</span>
      <el-select v-model="tradeState" placeholder="请选择" style="margin:0px 0px 0px 10px">
        <el-option v-for="item in tradeStateOptionsArr" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <br>
      <span>创建时间</span>
      <el-date-picker v-model="createTime" type="datetimerange"
        value-format='yyyy-MM-dd HH:mm:ss' 
        style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
      </el-date-picker>
      <span>提交时间</span>
      <el-date-picker v-model="submitTime" type="datetimerange"
        value-format='yyyy-MM-dd HH:mm:ss' 
        style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
      </el-date-picker>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <el-button  class="filter-item" type="primary" @click="addTaobaoOrder">添加订单</el-button>
     <!--列表-->
      <el-table :data="TaobaoWithdraw.taobaoWithdrawData" border highlight-current-row style="width: 100%">
        <el-table-column prop="_id" label="订单号" width="210px"   align="center" fixed></el-table-column>     
        <el-table-column prop="createTime" label="创建时间" width="180px" :formatter="createTimeFunc" align="center"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180px" :formatter="submitTimeFunc" align="center"></el-table-column>
        <el-table-column prop="tradeAmt" label="金额" width="100px"  align="center"></el-table-column>        
        <el-table-column prop="realname" label="姓名" width="80px" align="center"></el-table-column>
        <el-table-column prop="bankName" label="银行名称" width="150px" align="center"></el-table-column>
        <el-table-column prop="banknum" label="支行名称" width="150px" align="center"></el-table-column>
        <el-table-column prop="cardNo" label="银行卡号" width="180px" align="center"></el-table-column>
        <el-table-column prop="state" label="订单状态" width="100px" align="center" :formatter="stateFormatter"></el-table-column>
        <el-table-column prop="tradeState" label="提现状态" width="100px" align="center" :formatter="tradeStateFormatter"></el-table-column>
        <el-table-column prop="message" label="三方消息" width="130px" align="center"></el-table-column>
        <el-table-column prop="thirdOrderNo" label="三方订单号" width="200px" align="center"></el-table-column>
        <el-table-column prop="operator" label="操作人" width="80px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.state==='create'" @click="deleteTaobaoWithdraw(scope.$index, scope.row)">删除</el-button>
                <el-button type="primary" v-if="scope.row.state==='create'" @click="taobaoWithdraw(scope.$index, scope.row)">提现</el-button>
                <!-- <el-button type="primary" v-if="scope.row.state==='submit'" @click="queryTaobaoWithdraw(scope.$index, scope.row)">查询</el-button> -->
            </template>
        </el-table-column>
       </el-table>
       <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
          :current-page="page" 
          :page-sizes="[10,20,30,50]" 
          :page-size="count" 
          :total="TaobaoWithdraw.totalCount">
        </el-pagination>
      </el-col>
      <el-dialog :visible.sync="dialogEditVisible" @close="close">
				<el-form :inline="true" class="small-space" label-position="left" label-width="120px" style='width: 500px; margin-left:50px;'>			
					<el-form-item style='margin-left:120px;' label="姓名：">
						<el-input v-model="currRealname" style='width:300px'></el-input>
					</el-form-item>
					<el-form-item style='margin-left:120px;' label="卡号：">
						<el-input v-model="currCardNo" style='width:300px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="支行：">
						<el-input v-model="currBanknum" style='width:300px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="金额：">
						<el-input v-model="currTradeAmt" style='width:300px'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="createOrder">确 定</el-button>
				</div>
			</el-dialog>


	  </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { TaobaoWithdrawState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//TaobaoWithdraw
interface QueryItem {
  id?: string;
  cardNo?: string;
  thirdOrderNo?: string;
  state?: string;
  tradeState?: string;
  createStartTime?: Date;
  createEndTime?: Date;
  submitStartTime?: Date;
  submitEndTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class TaobaoWithdraw extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  TaobaoWithdraw: TaobaoWithdrawState = this.$store.state.taobaoWithdraw; //表单数据
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  logTime: Date[] = [this.startTime,this.endTime];
  dialogEditVisible:boolean = false;
  currTradeAmt:string = "";
  currRealname:string = "";
  currBanknum:string = "";
  currCardNo:string = "";
  page: number = 1; //当前页
  count: number = 10;
  stateOptionsArr = [
    {key:"",value:"全部"},
    {key:"create",value:"创建"},
    {key:"submit",value:"提交"},
    {key:"success",value:"成功"},
    {key:"fail",value:"失败"},
  ];
  stateOptions = {
    create:"创建",
    submit:"提交",
    success:"成功",
    fail:"失败",
  };
  tradeStateOptionsArr = [
    {key:"",value:"全部"},
    {key:"0",value:"交易处理中"},
    {key:"1",value:"交易成功"},
  ];
  cardNo = "";
  id = ""; 
  thirdOrderNo = ""; 
  state = ""; 
  tradeState = ""; 
  createTime:Date[] = []; 
  submitTime:Date[] = [];
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetTaobaoOrder", queryItem).then(() => {});
  }
  searchData(){
    this.page=1;
    this.loadData();
  }
  createOrder(){
    if(isNaN(parseFloat(this.currTradeAmt))){
        this.$message({type: "error", message: "金额必须是数字！" });
        return ;
    }
    if(new BigNumber(this.currTradeAmt).lte(0)){
        this.$message({type: "error", message: "金额不能为负数！" });
        return ;
    }
    let queryItem = {
      tradeAmt:this.currTradeAmt,
      realname:this.currRealname,
      cardNo:this.currCardNo,
      banknum:this.currBanknum,
    }
     myDispatch(this.$store, "CreateTaobaoOrder", queryItem).then(() => {
       if(this.TaobaoWithdraw.code===200){
          this.$message({type: "success", message: "添加成功" });
          this.loadData();
          this.dialogEditVisible = false;
          return;
       }else if(this.TaobaoWithdraw.code!==400){
          this.$message({type: "error", message:this.TaobaoWithdraw.err});
          return;
       }
     });
  }
  taobaoWithdraw(index,row){
       this.$confirm('此操作将提现'+row.tradeAmt+'到'+row.cardNo+'('+row.realname+'), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myDispatch(this.$store, "TaobaoWithdraw", {id:row._id}).then(() => {
           if(this.TaobaoWithdraw.code===200){
              this.loadData();
              return;
           }else if(this.TaobaoWithdraw.code!==400){
              this.$message({type: "error", message:this.TaobaoWithdraw.err});
              return;
           }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提现'
          });          
        });
  }
  deleteTaobaoWithdraw(index,row){
      if(row.state!=="create"){
           this.$message({type: "error", message:"只有创建订单能删除！"});
           return;
      }
       this.$confirm(`此操作将提现删除订单${row._id}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myDispatch(this.$store, "DeleteTaobaoOrder", {id:row._id}).then(() => {
           if(this.TaobaoWithdraw.code===200){
             this.$message({type: "success", message: "删除成功" });
              this.loadData();
              return;
           }else if(this.TaobaoWithdraw.code!==400){
              this.$message({type: "error", message:this.TaobaoWithdraw.err});
              return;
           }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提现'
          });          
        });
  }
  queryTaobaoWithdraw(index,row){
    myDispatch(this.$store, "PostTaobaoWithdrawResult", {id:row._id}).then(() => {
      if(this.TaobaoWithdraw.code===200){
          this.loadData();
          return;
      }else if(this.TaobaoWithdraw.code!==400){
         this.$message({type: "error", message:this.TaobaoWithdraw.err});
         return;
      }
    });
  }
  addTaobaoOrder(){
    this.dialogEditVisible = true;
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.id) {
      temp.id = this.id;
    }
    if (this.cardNo) {
      temp.cardNo = this.cardNo;
    }
    if (this.thirdOrderNo) {
      temp.thirdOrderNo = this.thirdOrderNo;
    }
    if (this.state) {
      temp.state = this.state;
    }
    if (this.tradeState) {
      temp.tradeState = this.tradeState;
    }
    temp.page = this.page;
    temp.count = this.count;
    if (this.createTime && this.createTime[0]) {
      temp.createStartTime = this.createTime[0];
      temp.createEndTime = this.createTime[1];
    }
    if (this.submitTime && this.submitTime[0]) {
      temp.submitStartTime = this.submitTime[0];
      temp.submitEndTime = this.submitTime[1];
    }
    return temp;
  }
  cancelEdit(){
    this.dialogEditVisible = false;
  }
  close(){
    this.currTradeAmt = "";
    this.currRealname = "";
    this.currCardNo = "";
    this.currBanknum = "";
    this.dialogEditVisible = false;
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
  stateFormatter(row, column){
    if(row.state){
      return this.stateOptions[row.state];
    }
    return "";
  }
  tradeStateFormatter(row, column){
    if(row.tradeState){
      if(row.tradeState==="0"){
        return "交易中"
      }else if(row.tradeState==="1"){
        return "交易成功"
      }
    }
    return row.tradeState;
  }
  createTimeFunc(row, column) {
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
