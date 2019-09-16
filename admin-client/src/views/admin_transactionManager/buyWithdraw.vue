<template>
  <div class="dashboard-outer">
	  <el-card class="dashboard-second">
      <el-col  class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="淘宝支付">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">购物支付</span>
      </el-col>
      <!--工具条-->
      <span class="content_font" ></span>
      <span>银行账号</span>
      <el-input v-model="accountNo" style="width:120px; margin:0px 20px 5px 10px"></el-input>
      <span>订单号</span>
      <el-input v-model="id" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>三方订单号</span>
      <el-input v-model="thirdOrderNo" style="width:120px; margin:5px 20px 0px 32px "></el-input>
      <span>订单状态</span>
      <el-select v-model="state" placeholder="请选择" style="margin:0px 0px 0px 10px">
        <el-option v-for="item in stateOptionsArr" :key="item.key" :label="item.value" :value="item.key">
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
      <el-table :data="BuyWithdraw.buyWithdrawData" border highlight-current-row style="width: 100%">
        <el-table-column prop="_id" label="订单号" width="210px"   align="center" fixed></el-table-column>
        <el-table-column prop="thirdOrderNo" label="第三方订单号" width="180px" align="center"></el-table-column>
        <el-table-column prop="accountName" label="账户姓名" width="80px" align="center"></el-table-column>
        <el-table-column prop="accountNo" label="银行账号" width="180px" align="center"></el-table-column>    
        <el-table-column prop="createTime" label="创建时间" width="180px" :formatter="createTimeFunc" align="center"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180px" :formatter="submitTimeFunc" align="center"></el-table-column>
        <el-table-column prop="cashAmt" label="金额" width="100px"  align="center"></el-table-column>        
        <el-table-column prop="creater" label="创建人" width="80px" align="center"></el-table-column>
        <el-table-column prop="openBankName" label="开户支行" width="150px" align="center"></el-table-column>
        <el-table-column prop="openBankNo" label="开户行号" width="180px" align="center"></el-table-column>
        <el-table-column prop="settType" label="结算类型" width="100px" align="center" :formatter="settTypeFormatter"></el-table-column>
        <el-table-column prop="state" label="订单状态" width="100px" align="center" :formatter="stateFormatter"></el-table-column>
        <el-table-column prop="operator" label="操作人" width="80px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="280px">
            <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.state==='create'" @click="deleteTaobaoWithdraw(scope.$index, scope.row)">删除</el-button>
                <el-button type="primary" v-if="scope.row.state==='create'" @click="taobaoWithdraw(scope.$index, scope.row)">提现</el-button>
                <el-button type="primary" v-if="scope.row.state==='handling'" @click="queryTaobaoWithdraw(scope.$index, scope.row)">查询</el-button>
            </template>
        </el-table-column>
       </el-table>
       <!--工具条 分页-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
          :current-page="page" 
          :page-sizes="[10,20,30,50]" 
          :page-size="count" 
          :total="BuyWithdraw.totalCount">
        </el-pagination>
      </el-col>
      <!-- 创建订单弹层 -->
      <el-dialog :visible.sync="dialogEditVisible" @close="close">
				<el-form :inline="true" class="small-space" label-position="left" label-width="90px" style=''>			
					<el-form-item style='margin-left:120px;' label="账户姓名：">
						<el-input v-model="currAccountName" style='width:200px'></el-input>
					</el-form-item>
					<el-form-item style='margin-left:120px;' label="银行账号：">
						<el-input v-model="currAccountNo" style='width:200px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="开户支行：">
						<el-input v-model="currOpenBankName" style='width:200px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="开户行号：">
						<el-input v-model="currOpenBankNo" style='width:200px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="金额：">
						<el-input v-model="currCashAmt" style='width:200px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="账户手机：">
						<el-input v-model="currPhoneNo" style='width:200px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="身份证号：">
						<el-input v-model="currCardId" style='width:200px'></el-input>
					</el-form-item>
          <el-form-item style='margin-left:120px;' label="结算类型：">
						<el-select v-model="currSettType" placeholder="请选择" style="width:200px">
              <el-option v-for="item in settTypeOptionsArr" v-if="item.key!=''" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
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
import { BuyWithdrawState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js"; 
interface QueryItem {//定义参数接口(获取订单)
  id?: string;
  accountNo?: string;
  thirdOrderNo?: string;
  state?: string;
  createStartTime?: Date;
  createEndTime?: Date;
  submitStartTime?: Date;
  submitEndTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class buyWithdraw extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
    

    // axios.post(`/api/admin/financial/createCartOrder`, {
    //     cashAmt:'1200',
    //     phoneNo:"13550254789",
    //     settType:"T1",
    //     openBankName:"工商银行成都支行",
    //     openBankNo:"6212264402021131579",
    //     accountNo:"dev",
    //     accountName:"dev",
    //     cardId:"510711198502211456"
    // }).then(res=>{
    //   console.log("结果",res)
    //   axios.get(`/api/admin/financial/getCartOrder`,{
    //     params: {
    //       page: 1,
    //       count:5,
    //       //id:"",
    //       //accountNo:"",
    //       // thirdOrderNo:this.thirdOrderNo,
    //       // state:this.state,
    //       // createStartTime:this.createTime[0],
    //       // createEndTime:this.createTime[1],
    //       // submitStartTime:this.submitTime[0],
    //       // submitEndTime:this.submitTime[1]
    //     }
    //   }).then(res=>{
    //     console.log("结果",res)
    //   });
    // });
  }
  /*inital data*/
  BuyWithdraw: BuyWithdrawState = this.$store.state.buyWithdraw; //表单数据
  now = new Date(Date.now())
  startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()-7, 0, 0, 0);
  endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()+1,0,0,0);
  logTime: Date[] = [this.startTime,this.endTime];
  dialogEditVisible:boolean = false;
  currAccountName:string = "";
  currAccountNo:string = "";
  currOpenBankName:string = "";
  currOpenBankNo:string = "3120001215";
  currCashAmt:string = "";
  currPhoneNo:string = "18180669966";
  currSettType:string="";
  currCardId:string="510475198506251458";
  page: number = 1; //当前页
  count: number = 10;
  stateOptionsArr = [
    {key:"",value:"全部"},
    {key:"create",value:"创建"},
    {key:"submit",value:"提交"},
    {key:"success",value:"成功"},
    {key:"handling",value:"处理中"},
    {key:"fail",value:"失败"},
  ];
  stateOptions = {
    create:"创建",
    submit:"提交",
    success:"成功",
    handling:"处理中",
    fail:"失败",
  };
  settTypeOptions = {
    T1:"所有余额",
    T0:"当日余额",
  };
  settTypeOptionsArr = [
    {key:"",value:"全部"},
    {key:"T0",value:"当日余额"},
    {key:"T1",value:"所有余额"},
  ];
  tradeStateOptionsArr = [
    {key:"",value:"全部"},
    {key:"0",value:"交易处理中"},
    {key:"1",value:"交易成功"},
  ];
  accountNo = "";
  id = ""; 
  thirdOrderNo = ""; 
  state = ""; 
  tradeState = ""; 
  createTime:Date[] = []; 
  submitTime:Date[] = [];
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    console.log('参数',queryItem);
    myDispatch(this.$store, "GetBuyOrder", queryItem).then(() => {console.log(this.BuyWithdraw)});
  }
  searchData(){
    this.page=1;
    this.loadData();
  }
  createOrder(){//创建订单
    if(isNaN(parseFloat(this.currCashAmt))){
        this.$message({type: "error", message: "金额必须是数字！" });
        return ;
    }
    if(new BigNumber(this.currCashAmt).lte(0)){
        this.$message({type: "error", message: "金额不能为负数！" });
        return ;
    }
    let queryItem = {
      accountName:this.currAccountName,
      accountNo:this.currAccountNo,
      openBankName:this.currOpenBankName,
      openBankNo:this.currOpenBankNo,
      cashAmt:this.currCashAmt,
      phoneNo:this.currPhoneNo,
      settType:this.currSettType,
      cardId:this.currCardId
    }
     myDispatch(this.$store, "CreateBuyOrder", queryItem).then(() => {
       if(this.BuyWithdraw.code===200){
          this.$message({type: "success", message: "添加成功" });
          this.loadData();
          this.dialogEditVisible = false;
          return;
       }else if(this.BuyWithdraw.code!==400){ 
          this.$message({type: "error", message:this.BuyWithdraw.err});
          return;
       }
     });
  }
  taobaoWithdraw(index,row){//提现操作
       this.$confirm('此操作将提现'+row.cashAmt+'到'+row.accountNo+'('+row.accountName+'), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myDispatch(this.$store, "BuyWithdraw", {id:row._id}).then(() => {
           if(this.BuyWithdraw.code===200){
              this.loadData();
              return;
           }else if(this.BuyWithdraw.code!==400){
              this.$message({type: "error", message:this.BuyWithdraw.err});
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
  deleteTaobaoWithdraw(index,row){//删除订单
      console.log(row.state);
      if(row.state!="create"){
           this.$message({type: "error", message:"只有创建订单能删除！"});
           return;
      }
       this.$confirm(`此操作将提现删除订单${row._id}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myDispatch(this.$store, "DeleteBuyOrder", {id:row._id}).then(() => {
           if(this.BuyWithdraw.code===200){
             this.$message({type: "success", message: "删除成功" });
              this.loadData();
              return;
           }else if(this.BuyWithdraw.code!==400){
              this.$message({type: "error", message:this.BuyWithdraw.err});
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
    myDispatch(this.$store, "GetBuyWithdrawResult", {id:row._id}).then(() => {
      if(this.BuyWithdraw.code===200){
          this.loadData();
          return;
      }else if(this.BuyWithdraw.code!==400){
         this.$message({type: "error", message:this.BuyWithdraw.err});
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
    if (this.accountNo) {
      temp.accountNo = this.accountNo;
    }
    if (this.thirdOrderNo) {
      temp.thirdOrderNo = this.thirdOrderNo;
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
    this.dialogEditVisible = false;
    this.currAccountName = "";
    this.currAccountNo = "";
    this.currOpenBankName = "";
    this.currOpenBankNo = "";
    this.currCashAmt = "";
    this.currPhoneNo = "";
    this.currSettType="";
    this.currCardId=""
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
  settTypeFormatter(row, column){
    if(row.settType){
      return this.settTypeOptions[row.settType];
    }
    return "";
  }
  stateFormatter(row, column){//状态格式化
    if(row.state){
      return this.stateOptions[row.state];
    }
    return "";
  }
  tradeStateFormatter(row, column){//提现状态格式化
    if(row.tradeState){
      if(row.tradeState==="0"){
        return "交易中"
      }else if(row.tradeState==="1"){
        return "交易成功"
      }
    }
    return row.tradeState;
  }
  createTimeFunc(row, column) {//时间格式化
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
  submitTimeFunc(row, column) {//时间格式化
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
