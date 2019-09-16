<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="总代提现">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">总代提现</span>
			</el-col>
			<div class="box">
				<span>项目</span>
				<el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
					<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
					</el-option>
				</el-select>
				<span>bill订单号</span>
				<el-input v-model="billOrderId" style="width:120px; margin:0 10px"></el-input>
				<span>状态</span>
				<el-select v-model="state" placeholder="全部" style="margin:0 10px;width:150px">
					<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<span>提交任务时间</span>
        <el-date-picker v-model="registerTime" type="datetimerange"
            value-format='yyyy-MM-dd HH:mm:ss' 
            style="margin:20px 10px" start-placeholder="开始时间"  end-placeholder="结束时间">
        </el-date-picker>
				<el-button type="primary" @click="searchData" style="margin:0px 0px 10px 0">搜索</el-button>
        <!-- <el-button type="primary" @click="downloadExcel" style="margin:10px">导出execel</el-button> -->
        <el-button type="primary" @click="addAgentWithdraw" style="margin:10px">创建提现队列</el-button>
			</div>

			<br>
			<!--列表-->
			<el-table :data="agentWithdrawData" border highlight-current-row style="width: 99%;" max-height="600">
				<el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat" fixed/>
				<el-table-column prop="agencyId" label="总代ID" width="90" align="center" fixed/>
				<el-table-column prop="billOrderId" label="bill订单号" width="120" align="center" fixed/>
				<el-table-column prop="channel" label="兑换渠道" width="80" align="center" fixed/>
				<el-table-column prop="orderId" label="后台订单号" width="100" align="center" fixed/>
				<el-table-column prop="money" label="提现金额" width="120" align="center" fixed/>
				<el-table-column prop="bankCardNo" label="卡号" width="180" align="center"></el-table-column>
				<el-table-column prop="bankCardName" label="开卡人姓名" width="90" align="center" />
				<el-table-column prop="bankName" label="银行编号" width="90" align="center" />
				<el-table-column prop="createDate" label="提交任务时间" width="150" align="center" :formatter="createDateFormat"/>
				<el-table-column prop="applyDate" label="预计提交订单时间" width="150" align="center" :formatter="applyDateFormat"/>
				<el-table-column prop="finishDate" label="完成时间" width="150" align="center" :formatter="finishDateFormat"/>
				<el-table-column prop="state" label="状态" width="90" align="center" :formatter="stateFormat"/>
				<el-table-column prop="opt" label="操作人" width="90" align="center" />
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.state!=='await'" @click="cancel(scope.row._id)">取消排队</el-button>
            <el-button type="text" :disabled="scope.row.state!=='await'" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
			</el-table>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount">
				</el-pagination>
			</el-col>
			<!-- 小页面-->
			<el-dialog :visible.sync="dialogEditVisible">
				<el-form class="small-space" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
					<el-form-item>
						代理ID：{{currAgencyId}}
					</el-form-item>
					<el-form-item>
						提现金额：
						<br/>
						<el-input v-model="editMoney" style="width:120px"></el-input>
					</el-form-item>
					<el-form-item>
						持卡人姓名：
						<el-input v-model="editName" style="width:300px"></el-input>
					</el-form-item>
          <el-form-item>
						银行卡号：
						<el-input v-model="editBankNo" style="width:300px"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="confirmEdit">确 定</el-button>
				</div>
			</el-dialog>
       <!-- 批量添加 -->
      <el-dialog :visible.sync="dialogAddList">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
          <!-- <el-form-item style="margin-left:120px;" label="项目:">
            <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item style="margin-left:120px;" label="批量添加:">总代ID,提现金额,持卡人,卡号
            <el-input type="textarea" :rows="20" v-model="addList" style="width:500px; margin:0 10px" placeholder="总代ID,提现金额,持卡人,卡号  为一条数据,每条数据用换行符分隔"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="confirmStages" @click="confirmAdd">确 定</el-button>
        </div>
      </el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index";
import {getZongDaiWithdraw,putZongDaiWithdraw,updateZongDaiWithdraw,cancelZongDaiWithdraw} from "../../api/admin/agentMgr/agentMgr";

interface QueryItem {
  pid: string;
  billOrderId?: string;
  createDateStart?: Date;
  createDateEnd?: Date;
  page?: number;
  count?: number;
  state?: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class agentWithdraw extends Vue {
  page: number = 1; //当前页
  count: number = 10;
  totalCount:number = 0;
  registerTime: Date[] = [];
  agentWithdrawData: any[] = [];
  pidList: any[] = [];
  pid: string = "";
  billOrderId: string = "";
  state: string = "";
  states: any = [
    { value: "", label: "全部" },
    { value: "await", label: "等待中" },
    { value: "fail", label: "失败" },
    { value: "success", label: "成功" },
    { value: "cancel", label: "取消" },
    { value: "created", label: "创建订单成功" },
    { value: "transfer", label: "转账中" }
  ];
  stateOpt: any = {
    await:"等待中",
    fail:"失败",
    success:"成功",
    cancel:"取消",
    transfer:"转账中",
    created:"创建订单成功"
  }

  dialogEditVisible: boolean = false;
  currAgencyId: string = "";
  editMoney:string = "";
  editName:string = "";
  editBankNo:string = "";
  curId:string = "";
  // 批量添加
  addList: string = "";
  dialogAddList: boolean = false;
  //生命周期钩子函数
  created() {
    this.pidList = [{name:"全部",pid:""},...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }

  //初始化数据
  async loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getZongDaiWithdraw,queryItem)
    if(ret.code===200){
      this.agentWithdrawData = ret.msg.pageData
      this.totalCount = ret.msg.totalCount
    }else{
      this.$message({
          type: "error",
          message: ret.err
        });
    }
   
  }
  searchData(){
    this.page = 1;
    this.loadData();
  }
  addAgentWithdraw(){
    this.addList = "";
    this.dialogAddList = true;
  }
  confirmAdd(){
    let dataArr = this.addList.split("\n");
    let dataTrArr: any = [];
    for (let k in dataArr) {
      let tr = dataArr[k];
      let tmp = tr.split(",");
      if (tmp.length !== 4) {
        this.$message({
          type: "error",
          message: "请输入总代ID,提现金额,持卡人,卡号！"
        });
        return;
      }
      let insertData = {
        agencyId: tmp[0],
        money: tmp[1],
        bankCardName: tmp[2],
        bankCardNo: tmp[3]
      };
      dataTrArr.push(insertData);
    }
    this.$confirm("此操作将创建提现队列,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          zongDaiWithdrawList:dataTrArr
        }
        let ret = await myAsyncFn(putZongDaiWithdraw,req)
        if(ret.code===200){
            this.$message({
              type: "success",
              message: "创建成功！"
            });
            this.dialogAddList = false;
            this.loadData();
          }else{
            this.$message({
              type: "error",
              message: ret.err
            });
          }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.dialogAddList = false;
      });
  }
  getQueryItem() {
    let tmp: QueryItem = { pid: this.pid };
    if (this.billOrderId.trim()) {
      tmp.billOrderId = this.billOrderId;
    }
      tmp.state = this.state;
    if (this.registerTime && this.registerTime[0]) {
      tmp.createDateStart = this.registerTime[0];
      tmp.createDateEnd = this.registerTime[1];
    }
    return tmp;
  }
  //取消排队
   cancel(id){
    this.$confirm("此操作将取消排队,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          id
        }
        let ret = await myAsyncFn(cancelZongDaiWithdraw,req)
        if(ret.code===200){
            this.$message({
              type: "success",
              message: "操作成功！"
            });
            this.loadData();
          }else{
            this.$message({
              type: "error",
              message: ret.err
            });
          }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
        this.dialogAddList = false;
      });
  }
  //编辑
  edit(row) {
    this.dialogEditVisible = true;
    this.editMoney = row.money;
    this.currAgencyId = row.agencyId;
    this.editBankNo = row.bankCardNo;
    this.editName = row.bankCardName;
    this.curId = row._id
  }
  async confirmEdit() {
    if(!this.editMoney){
      this.$message({
        type: "error",
        message: "金额不能为空!"
      });
      return;
    }
    if(Number(this.editMoney)<0){
      this.$message({
        type: "error",
        message: "金额不能为负数!"
      });
      return;
    }
    if(!this.editName){
      this.$message({
        type: "error",
        message: "持卡人姓名不能为空!"
      });
      return;
    }
    if (!this.editBankNo.trim()) {
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入!"
      });
      return;
    }
    
    let tmp = {
      id: this.curId,
      money: this.editMoney.toString(),
      bankCardNo: this.editBankNo,
      bankCardName: this.editName,
    };
    let ret = await myAsyncFn(updateZongDaiWithdraw,tmp)
    if (ret.code == 200) {
        this.$message({
          type: "success",
          message: "操作成功！"
        });
        this.dialogEditVisible = false;
        this.loadData();
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
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  stateFormat(row){
    return this.stateOpt[row.state]
  }
  finishDateFormat(row) {
    //时间格式化
    if (row.finishDate) {
      let date = new Date(row.finishDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  applyDateFormat(row) {
    //时间格式化
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
  createDateFormat(row) {
    //时间格式化
    if (row.createDate) {
      let date = new Date(row.createDate);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  //   downloadExcel() {
  //   const downloadExcelCfg = [
  //     { title: "项目", field: "pid", type: "pidType" },
  //     { title: "总代ID", field: "agencyId", type: "string" },
  //     { title: "代理名称", field: "name", type: "string" },
  //     { title: "代理渠道", field: "channel", type: "channelType" },
  //     { title: "代理等级", field: "level", type: "string" },
  //     { title: "直推总税收", field: "myChannelTotalGameTax", type: "string" },
  //     { title: "待结算利润", field: "balance", type: "string" },
  //     { title: "总提现", field: "totalSettleMoney", type: "string" },
  //     { title: "总利润", field: "totalIncome", type: "string" },
  //     { title: "利润比例", field: "taxRate", type: "string" },
  //     { title: "直推总利润", field: "myChannelTotalIncome", type: "string" },
  //     { title: "下级推广总利润", field: "subPromotionProfit", type: "string" },
  //     { title: "下级总贡献税收", field: "subPromotionGameTax", type: "string" },
  //     { title: "上级代理ID", field: "parentId", type: "string" },
  //     { title: "备注", field: "editBankNo", type: "string" },
  //   ];
  //   let queryItem: QueryItem | undefined = this.getQueryItem();
  //   myDispatch(this.$store, "GetAgentTotalDataExcel", queryItem).then(ret => {
  //     downloadExcel(ret,this);
  //   });
  // }
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
