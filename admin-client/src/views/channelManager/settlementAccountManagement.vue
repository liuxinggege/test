<template>
     <div class="dashboard-outer">
	    <el-card class="dashboard-second">
			<el-col  class="toolbar1">
			<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="结算账号管理">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">结算账号管理</span>
			</el-col>
			<div class="box">
				<span>渠道账号</span>
				<el-input v-model="act" style="width:120px; margin:20px 20px;"></el-input>
				<span>支付宝</span>
				<el-input v-model="alipayAccount" style="width:120px; margin:20px 20px;"></el-input>        
				<el-button type="primary" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
				<el-button type="primary" @click="downloadExcel" style="margin:0px 0px 10px 50px">导出execel</el-button>
			</div>
			<!--列表-->
			<el-table :data="setAccount" border highlight-current-row  max-height="600">
				<el-table-column prop="act" label="渠道账号" min-width="150" align="center" />
				<el-table-column prop="alipayAccount" label="支付宝" width="200" align="center" >
					<template slot-scope="scope">
						<span>{{scope.row.alipayAccount||"-"}}</span>
						<el-button type="text" @click="editAlipays(scope.row, '支付宝')"> <i class="el-icon-edit"></i> </el-button>
					</template>
				</el-table-column>
				<el-table-column prop="alipayName" label="支付宝姓名" width="200" align="center" >
					<template slot-scope="scope">
						<span>{{scope.row.alipayName||"-"}}</span>
						<el-button type="text" @click="editAlipays(scope.row, '支付宝姓名')"> <i class="el-icon-edit"></i> </el-button>
					</template>
				</el-table-column>
				<el-table-column prop="payPwd" label="支付密码" width="200" align="center" >
					<template slot-scope="scope">
						<span>{{scope.row.payPwd||"-"}}</span>
						<el-button type="text" @click="editAlipays(scope.row, '支付密码')"> <i class="el-icon-edit"></i> </el-button>
					</template>
				</el-table-column>
				<el-table-column prop="totalSetMoney" label="累计结算总额" width="160"  align="center" :formatter="formatter3"/>
				<el-table-column prop="totalMoney" label="可结算总金额" width="160" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.totalMoney||0}}</span>
						<el-button type="text" @click="addMoney(scope.row)">添加</el-button>
					</template>
				</el-table-column>        
				<el-table-column prop="setRecording" label="流水记录" width="100" align="center" >
					<template slot-scope="scope">
						<el-button type="text" @click="getSetRecord(scope.$index, scope.row)">查看</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="sharingRatio" label="分成比例配置" width="160px" align="center" >
					<template slot-scope="scope">
						<span>{{scope.row.sharingRatio||"-"}}</span>
						<el-button type="text" @click="editAlipays(scope.row, '分成比例')"><i class="el-icon-edit"></i></el-button>
					</template>
				</el-table-column>
				<el-table-column label="账号状态" width="100px" algin="center">
				<template slot-scope="scope">  
						<el-button type="text" @click="openClose(scope.row)">{{scope.row.purview ? scope.row.purview.page ? scope.row.purview.page.financeManage?"关闭" : "开启" : "开启" : "开启"}}</el-button>
						<!-- <el-button type="text" @click="openClose(scope.$index, scope.row)">关闭</el-button> -->
				</template>
				</el-table-column>
			</el-table> 
			<br>     
			<!--主页面工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
				@current-change="handleCurrentChange1"
				@size-change="handleSizeChange1" 
				:current-page="setAccountPage" 
				:page-sizes="[10,20,30,50]" 
				:page-size="setAccountCount" 
				:total="setAccountTotalCount">
				</el-pagination>
			</el-col>

			<!-- 小页面||| 编辑 支付宝/支付宝姓名 -->
			<el-dialog :visible.sync="dialogEditChannelVisible" @close="close">
				<el-form class="small-space" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
				<el-form-item :label = editType ><el-input v-model="value"></el-input></el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
				<el-button @click="cancelEditAlipay">取 消</el-button>
				<el-button type="primary" @click="confirmEditAlipay">确 定</el-button>
				</div>
			</el-dialog>
			<!--小页面||| 添加结算金币 -->
			<el-dialog :visible.sync="dialogAddMoneyVisible" @close="close">
				<el-form class="small-space" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
				<el-form-item label ="添加结算金币"> 
					<el-input-number 
					style="margin:0 13px 5px 0"
					:controls=false v-model="addSetMoney"> 
					</el-input-number>
					<span style="color:red;">不可超过剩余可结算金币数额</span>
				</el-form-item>
				<el-form-item label ="操作备注"> 
					<el-input type="textarea" 
					:rows="5"
					placeholder="请输入内容" 
					v-model="remarks"> 
					</el-input> 
				</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">         
				<el-button type="primary" @click="updateAddMoney"> 添加 </el-button>
				</div>
			</el-dialog>        
			<!--小页面||| 结算记录···记录列表 -->
			<el-dialog :visible.sync="dialogSetRecordVisible" width=70% @close="close">        
				<span style="margin:0 10px">类型</span>
				<el-select  v-model="type" style="width:120px" placeholder="全部" @change="onSelectedDrug(type)">  
				<el-option
					v-for="item in recordTypes"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
				</el-select>
				<span style="margin:0 10px">时间:</span>
				<el-date-picker v-model="logTime"
					value-format='yyyy-MM-dd HH:mm:ss'  
					type="datetimerange" 
					placeholder="选择时间" 
					style="margin:10px 0px 10px 0px"></el-date-picker>
				<el-button type="primary" @click="getSetHistory" style="margin:0 10px">搜索</el-button>
				<el-button type="primary" @click="downloadExcel1" style="margin:0 10px">导出execel</el-button>
				
				<el-col class="toolbar2">
					<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
						@current-change="handleCurrentChange2"
						@size-change="handleSizeChange2" 
						:current-page="setHistoryPage" 
						:page-sizes="[10,20,30,50]" 
						:page-size="setHistoryCount" 
						:total="setHistoryTotalCount">
					</el-pagination>
				</el-col>
				<el-table :data="setHistory" border highlight-current-row >
					<el-table-column prop="logDate" label="日期时间" min-width="200" align="center" :formatter="formatter1"></el-table-column>
					<el-table-column prop="orderID" label="结算订单ID" min-width="240" align="center"></el-table-column>
					<el-table-column prop="recordType" label="记录类型" min-width="200" align="center" :formatter="formatter2"></el-table-column>
					<el-table-column prop="alipayAccount" label="支付宝" min-width="200" align="center"></el-table-column>
					<el-table-column prop="alipayName" label="支付宝姓名" min-width="200" align="center"></el-table-column>
					<el-table-column prop="changeMoney" label="金币变化" min-width="200" align="center"></el-table-column>
					<el-table-column prop="beforeSet" label="结算前金额" min-width="200" align="center"></el-table-column>
					<el-table-column prop="afterSet" label="结算后金额" min-width="200" align="center"></el-table-column>
					<el-table-column prop="operator" label="操作人" min-width="200" align="center"></el-table-column>
					<el-table-column prop="remarks" label="备注" min-width="200" align="center"></el-table-column>           
				</el-table> 
			</el-dialog>
			
      	</el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import {
  SetAccount,
  SetHistory
} from "../../store/modules/channelManager/settlementAccountManagement";
import { SettlementAccountManagementState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";

interface QueryItemForAct {
  act?: string;
  alipayAccount?: string;
  page?: number;
  count?: number;
}
interface QueryItemForHistory {
  recordType?: string[];
  act: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SettlementAccountManagement extends Vue {
  //初始化数据
  settlementAccount: SettlementAccountManagementState = this.$store.state
    .settlementAccountManagement;
  setAccount: SetAccount[] = this.settlementAccount.setAccount;
  setHistory: SetHistory[] = this.settlementAccount.setHistory;
  //主表格
  act: string = "";
  alipayAccount: string = "";
  setAccountPage: number = 1;
  setAccountCount: number = 10;
  setAccountTotalCount: number = 0;
  //流水表格
  dialogSetRecordVisible: boolean = false;
  logTime: Date[] = [];
  type: string = "all";
  recordTypes: any = [
    //状态下拉框
    { value: "all", label: "全部" },
    { value: "artificial", label: "手动添加" },
    { value: "system", label: "系统结算" },
    { value: "apply", label: "提现申请" }
  ];
  setHistoryPage: number = 1;
  setHistoryCount: number = 10;
  setHistoryTotalCount: number = 0;
  //手动添加结算金额
  dialogAddMoneyVisible: boolean = false;
  addSetMoney: number = 0;
  beforeSetMoney: number = 0;
  remarks: string = "";
  //修改支付宝、比例等
  value: string = "";
  dialogEditChannelVisible: boolean = false;
  editType: string = "";

  mounted() {
    this.loadData();
  }
  loadData() {
    let queryItem = this.getQueryItemForAct();
    queryItem.page = this.setAccountPage;
    queryItem.count = this.setAccountCount;
    myDispatch(this.$store, "GetChannelUser", queryItem).then(() => {
      this.setAccount = this.settlementAccount.setAccount;
      this.setAccountTotalCount = this.settlementAccount.setAccountTotalCount;
    });
  }
  getSetHistory() {
    let queryItem = this.getQueryItemForHistory();
    queryItem.page = this.setHistoryPage;
    queryItem.count = this.setHistoryCount;
    myDispatch(this.$store, "GetSetHistory", queryItem).then(() => {
      this.setHistory = this.settlementAccount.setHistory;
      this.setHistoryTotalCount = this.settlementAccount.setHistoryTotalCount;
    });
  }
  getQueryItemForAct() {
    let tmp: QueryItemForAct = {
      act: this.act,
      alipayAccount: this.alipayAccount
    };
    return tmp;
  }
  getQueryItemForHistory() {
    let tmp: QueryItemForHistory = {
      act: this.act
    };
    if (this.logTime && this.logTime.length === 2) {
      tmp.startDate = this.logTime[0];
      tmp.endDate = this.logTime[1];
    }
    if (this.type === "all") {
      tmp.recordType = ["artificial", "system", "apply"];
    } else {
      tmp.recordType = [this.type];
    }
    return tmp;
  }
  //开启小画面
  getSetRecord(index?: any, row?: any) {
    this.dialogSetRecordVisible = true;
    this.act = row.act;
    this.getSetHistory();
  }

  openClose(row) {
    let flag = row.purview
      ? row.purview.page ? row.purview.page.financeManage : false
      : false;
    //点击关闭/开启
    myDispatch(this.$store, "UpdateChannelStatus", {
      act: row.act,
      financeManage: !flag
    })
      .then(() => {
        if (this.settlementAccount.eidtCode === 200) {
          this.$message({
            type: "success",
            message: "操作成功！"
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
  //添加结算金额
  addMoney(row) {
    this.dialogAddMoneyVisible = true;
    this.act = row.act;
    this.beforeSetMoney = row.totalMoney || 0;
  }
  updateAddMoney() {
    if (
      Math.abs(this.addSetMoney) < Math.abs(this.beforeSetMoney) &&
      this.remarks
    ) {
      myDispatch(this.$store, "UpdateChannelTotalMoney", {
        act: this.act,
        addMoneyNum: this.addSetMoney,
        operationNotes: this.remarks
      })
        .then(result => {
          if (this.settlementAccount.eidtCode === 200) {
            this.$message({
              type: "success",
              message: "操作成功！"
            });
            this.dialogAddMoneyVisible = false;
            this.act = "";
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
      this.$message({
        type: "error",
        message: "金额不可超过剩余可结算金币数额，备注不能为空！"
      });
    }
  }

  editAlipays(row, type) {
    this.dialogEditChannelVisible = true;
    this.editType = type;
    this.act = row.act;
    switch (type) {
      case "支付宝":
        this.value = row.alipayAccount;
        break;
      case "支付宝姓名":
        this.value = row.alipayName;
        break;
      case "支付密码":
        this.value = row.payPwd;
        break;
      case "分成比例":
        this.value = row.sharingRatio;
        break;
      default:
        break;
    }
  }

  confirmEditAlipay() {
    // 如何确定哪儿一行以及映射
    // 点击（修改后）确定按钮
    this.$confirm("此操作将永久修改该用户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        switch (this.editType) {
          case "支付宝":
            //修改支付宝账号,
            myDispatch(this.$store, "UpdateChannelAlipayAccount", {
              act: this.act,
              alipayAccount: this.value
            })
              .then(() => {
                if (this.settlementAccount.eidtCode === 200) {
                  this.dialogEditChannelVisible = false;
                }
              })
              .catch(ex => {
                console.error(ex);
                this.$message({
                  type: "error",
                  message: ex.message
                });
              });
            break;
          case "支付宝姓名":
            //修改支付宝姓名,
            myDispatch(this.$store, "UpdateChannelAlipayName", {
              act: this.act,
              alipayName: this.value
            })
              .then(() => {
                if (this.settlementAccount.eidtCode === 200) {
                  this.dialogEditChannelVisible = false;
                }
              })
              .catch(ex => {
                console.error(ex);
                this.$message({
                  type: "error",
                  message: ex.message
                });
              });
            break;
          case "支付密码":
            //修改支付密码,
            myDispatch(this.$store, "UpdateChannelPayPwd", {
              act: this.act,
              payPwd: this.value
            })
              .then(() => {
                if (this.settlementAccount.eidtCode === 200) {
                  this.dialogEditChannelVisible = false;
                }
              })
              .catch(ex => {
                console.error(ex);
                this.$message({
                  type: "error",
                  message: ex.message
                });
              });
            break;
          case "分成比例":
            //修改分成比例,
            myDispatch(this.$store, "UpdateChannelSharingRatio", {
              act: this.act,
              sharingRatio: this.value
            })
              .then(() => {
                if (this.settlementAccount.eidtCode === 200) {
                  this.dialogEditChannelVisible = false;
                }
              })
              .catch(ex => {
                console.error(ex);
                this.$message({
                  type: "error",
                  message: ex.message
                });
              });
            break;
          default:
            break;
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
        this.dialogEditChannelVisible = false;
      });
  }
  cancelEditAlipay() {
    //点击取消
    this.dialogEditChannelVisible = false;
  }

  //导出数据
  async downloadExcel() {
    const downloadExcelCfg = [
      { title: "渠道账号", field: "act", type: "string" },
      { title: "支付宝", field: "alipayAccount", type: "string" },
      { title: "支付宝姓名", field: "alipayName", type: "string" },
      { title: "支付密码", field: "payPwd", type: "string" },
      { title: "累计结算总额", field: "totalSetMoney", type: "string" },
      { title: "可结算总金额", field: "totalMoney", type: "string" },
      { title: "流水记录", field: "setRecording", type: "string" },
      { title: "分成比例配置", field: "sharingRatio", type: "string" }
    ];
    let queryItem = this.getQueryItemForAct();
    await myDispatch(this.$store, "GetChannelUser", queryItem).then(ret => {
      downloadExcel(ret,this);
    });
  }
  async downloadExcel1() {
    const downloadExcelCfg = [
      { title: "日期时间", field: "logDate", type: "string" },
      { title: "结算订单ID", field: "orderID", type: "string" },
      { title: "记录类型", field: "recordType", type: "string" },
      { title: "支付宝", field: "alipayAccount", type: "string" },
      { title: "支付宝姓名", field: "alipayName", type: "string" },
      { title: "金币变化", field: "changeMoney", type: "string" },
      { title: "结算前金额", field: "beforeSet", type: "string" },
      { title: "结算后金额", field: "afterSet", type: "string" },
      { title: "操作人", field: "operator", type: "string" },
      { title: "备注", field: "remarks", type: "string" }
    ];
    let queryItem = this.getQueryItemForHistory();
    await myDispatch(this.$store, "GetSetHistory", queryItem).then(ret => {
      downloadExcel(ret,this);
    });
  }
  //页码变更
  handleCurrentChange1(val) {
    this.setAccountPage = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange1(val) {
    this.setAccountCount = val;
    this.loadData();
  }
  //页码变更
  handleCurrentChange2(val) {
    this.setHistoryPage = val;
    this.getSetHistory();
  }
  //每页显示数据量变更
  handleSizeChange2(val) {
    this.setHistoryCount = val;
    this.getSetHistory();
  }
  formatter1(row, column) {
    let date = new Date(row.logDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  formatter2(row, column) {
    switch (row.recordType) {
      case "apply":
        row.recordType = "提现申请";
        break;
      case "artificial":
        row.recordType = "手动添加";
        break;
      case "system":
        row.recordType = "系统结算";
        break;
      default:
        break;
    }
    return row.recordType;
  }
  formatter3(row) {
    return row.totalSetMoney ? row.totalSetMoney : 0;
  }
  close() {
    this.editType = "";
    this.value = "";
    this.addSetMoney = 0;
    this.remarks = "";
    this.act = "";

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
  padding: 20px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
