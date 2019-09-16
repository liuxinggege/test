<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="兑换审核">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">兑换审核</span>
			</el-col>
			<!--工具条-->
			<span class="content_font"></span>
			<span>项目</span>
			<el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
				<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select>
			<span>代理ID</span>
			<el-input v-model="userId" style="width:120px; margin:0px 20px 5px 10px"></el-input>
			<span>Bill订单号</span>
			<el-input v-model="orderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
			<span>提交时间</span>
			<el-date-picker v-model="logTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
            </el-date-picker>
            <span>到账时间</span>
			<el-date-picker v-model="finishTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
			</el-date-picker>
			<span>订单信息</span>
			<el-select v-model="state" placeholder="全部" style="margin:0 10px;">
				<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
            <span>兑换渠道</span>
			<el-input v-model="settleChannel" style="width:120px; margin:5px 20px 0px 32px "></el-input>
			<el-button type="primary" @click="reset" style="margin:0px 0px 0px 50px">重置</el-button>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
			<el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
			<!--列表-->
			<el-table :data="agentWithdrawOrder.agentWithdrawOrderData" border highlight-current-row style="width: 100%;" max-height="500" key="table">
				<el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat" fixed/>
				<el-table-column prop="_id" label="订单ID" width="250" align="center"></el-table-column>
				<el-table-column prop="withdrawOrderID" label="Bill订单号" min-width="250" align="center" />
				<el-table-column prop="agencyId" label="代理ID" width="100" align="center"></el-table-column>
				<el-table-column prop="applyMoney" label="提现金额" min-width="100" align="center"></el-table-column>
				<el-table-column prop="settleType" label="兑换类型" min-width="100" align="center" :formatter="settleTypeFunc"></el-table-column>
				<el-table-column prop="settleChannel" label="兑换渠道" min-width="100" align="center" ></el-table-column>
				<el-table-column prop="alipayAccount" label="支付宝账号" min-width="200" align="center" :formatter="aliAccountFunc"></el-table-column>
				<el-table-column prop="alipayName" label="支付宝名字" min-width="200" align="center" :formatter="aliNameFunc"></el-table-column>
				<el-table-column prop="bankCardNo" label="银行卡账号" min-width="200" align="center" :formatter="bankCardNumberFunc"></el-table-column>
				<el-table-column prop="bankCardName" label="银行卡名字" min-width="150" align="center" :formatter="bankCardRealNameFunc"></el-table-column>
				<el-table-column prop="applyTax" label="提现税收" width="130" align="center"></el-table-column>
				<el-table-column prop="totalSettleMoney" label="累计兑换" min-width="100" align="center"></el-table-column>
				<el-table-column prop="applyDate" label="提交时间" width="200" :formatter="createTimeFunc" align="center"></el-table-column>
				<el-table-column prop="arrivedDate" label="到账时间" width="180" :formatter="finishTimeFunc" align="center"></el-table-column>
				<el-table-column prop="arrivedDate" label="退款时间" width="180" :formatter="refundTimeFunc" align="center"></el-table-column>
				<el-table-column prop="remarks" label="订单备注" width="180" align="center"></el-table-column>
				<el-table-column prop="statusDetail" label="状态信息" width="180" :show-overflow-tooltip="true" align="center">
					<template slot-scope="scope">
						<el-tag :type="filterTag(scope.row.statusDetail)" size="mini" close-transition>{{scope.row.statusDetail}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态" width="120" :show-overflow-tooltip="true" align="center">
					<template slot-scope="scope">
						<el-tag :type="filterTag(scope.row.status)" size="mini" close-transition>{{statusFunc(scope.row.status)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="退款状态" width="120" :show-overflow-tooltip="true" align="center">
					<template slot-scope="scope">
						<el-tag :type="filterTag(scope.row.refundStatus)" size="mini" close-transition>{{refundStatusFunc(scope.row.refundStatus)}}</el-tag>
					</template>
				</el-table-column>
                <el-table-column prop="opt" label="关闭订单操作人" min-width="90" align="center" ></el-table-column>
				<el-table-column prop="operator" label="操作人" min-width="200" align="center"></el-table-column>
				<el-table-column label="操作" min-width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" v-if="isShowOpBtn(scope.row)" @click="pass(scope.$index, scope.row)">通过</el-button>
						<el-button type="text" style="color:red" v-if="isShowOpBtn(scope.row)" @click="refuse(scope.$index, scope.row)">拒绝</el-button>
						<el-button type="text" style="color:red" v-if="scope.row.status === 'success' && !scope.row.refundStatus " @click="refund(scope.$index,scope.row)">退款</el-button>
                        <el-button type="text" v-if="scope.row.status=='transfer'&&isShowClose(scope.row)" @click="close(scope.$index, scope.row)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="agentWithdrawOrder.totalCount">
				</el-pagination>
			</el-col>
			<el-dialog :visible.sync="dialogRefundOperVisible">
				<div style="margin:0px 0px 40px 50px;font-size:20px">
					<span>退款订单ID:</span>
					<span>{{curId}}</span>
				</div>
				<div style="margin:0px 0px 10px 50px;font-size:20px">
					<span>描述:</span>
				</div>
				<div style="margin:0px 0px 0px 50px;font-size:20px">
					<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="descInfo">
					</el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="reFundOk">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogOperVisible">
				<div style="margin:0px 0px 40px 50px;font-size:20px">
						<span>{{ok===1?"通过":ok===2?"拒绝":"关闭"}}订单ID:</span>
					<span>{{curId}}</span>
				</div>
                <div v-if="ok===3" style="margin:0px 0px 40px 50px;"  key="closeRemind">
					<span style="font-size:30px;color:red">请确认第三方后台没有这个订单，才能关闭这个订单！</span>
				</div>
				<div style="margin:0px 0px 10px 50px;font-size:20px">
					<span>描述:</span>
				</div>
				<div style="margin:0px 0px 0px 50px;font-size:20px">
					<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="descInfo">
					</el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="update">确 定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import {
    AgentWithdrawOrderState,
    WithdrawReview
} from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
import STATUS from "../../utils/withdraw";
import Attribution from "@/components/userAttribution.vue";
//AgentWithdrawOrder
interface QueryItem {
    pid: string;
    status?: string;
    state?: string;
    orderId?: string;
    settleChannel?: string;
    startDate?: Date;
    endDate?: Date;
    finishTimeBegin?: Date;
    finishTimeEnd?: Date;
    page?: number;
    agencyId?: string;
    count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
    components: {
        Attribution
    }
})
export default class AgentWithdrawOrder extends Vue {
    isShowOpBtn(rowData) {
        this.editPid = rowData.pid;
        return rowData.status === "await"; //等待阶段
    }
    // lifecycle hook
    created() {
        this.pidList = [{ name: "全部", pid: "" }, ...JSON.parse(<string>sessionStorage.getItem("pid"))];
        this.loadData(); //初始化-->加载数据
    }
    minusTime = 1000 * 60 * 60 * 24 * 7
    pidList: any[] = [];
    pid: string = "A";
    settleChannel: string = "";
    editPid: string = "";
    /*inital data*/
    withdrawReview: WithdrawReview = this.$store.state.withdrawReview; //表单数据
    agentWithdrawOrder: AgentWithdrawOrderState = this.$store.state.agentWithdrawOrder; //表单数据
    userId: string = "";
    now = new Date(Date.now())
    startTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 7, 0, 0, 0);
    endTime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 1, 0, 0, 0);
    logTime: Date[] = [this.startTime, this.endTime];
    finishTime:Date[]=[];
    page: number = 1; //当前页
    count: number = 10;
    currentUid: string = "";
    dialogAttibutionVisible: boolean = false;

    state: string = "await";
    states: any = [
        {
            value: "",
            label: "全部"
        },
        {
            value: "success",
            label: "成功"
        },
        {
            value: "fail",
            label: "失败"
        },
        {
            value: "transfer",
            label: "转账中"
        },
        {
            value: "await",
            label: "等待审核"
        }
    ];

    orderState = "";
    status = "";
    orderId = "";
    dialogOperVisible = false;
    dialogRefundOperVisible = false;
    curId = "";
    ok: number = 0; //1:通过。2:拒绝。3:关闭
    descInfo = "";
    closeTime: number = 1000 * 60 * 60 * 0.5; //关闭转账中的订单必须大于这个时间
    loadData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        myDispatch(this.$store, "GetAgentWithdrawOrder", queryItem).then(() => { });
    }
    searchData() {
        this.page = 1;
        this.loadData();
    }
    reset() {
        this.userId = "";
        this.status = "";
        // this.orderState = "";
        this.orderId = "";
        this.settleChannel = "";
        this.logTime = [];
        this.finishTime = [];
    }
    //获取查询条件
    getQueryItem() {
        let temp: QueryItem = { pid: this.pid };
        if (this.userId) {
            temp.agencyId = this.userId;
        }
        if (this.state.trim()) {
            temp.status = this.state;
        }
        if (this.orderId) {
            temp.orderId = this.orderId;
        }
        if (this.settleChannel) {
            temp.settleChannel = this.settleChannel;
        }
        if (this.logTime && this.logTime[0]) {
            temp.startDate = this.logTime[0];
            temp.endDate = this.logTime[1];
        }
        if (this.finishTime && this.finishTime[0]) {
            temp.finishTimeBegin = this.finishTime[0];
            temp.finishTimeEnd = this.finishTime[1];
        }
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

    refund(index, row) {
        this.dialogRefundOperVisible = true;
        this.curId = row.withdrawOrderID;
    }
    reFundOk() {
        let queryItem = { billId: this.curId, desc: this.descInfo };
        myDispatch(this.$store, "ReFundOrder", queryItem, true)
            .then(() => {
                if (this.withdrawReview.code === 200) {
                    this.$message({
                        type: "success",
                        message: "操作成功！！"
                    });
                    this.dialogRefundOperVisible = false;
                    this.loadData();
                    return;
                }
            })
            .catch(ex => {
                this.$message({
                    type: "error",
                    message: ex.message
                });
                this.dialogRefundOperVisible = false;
                return;
            });
    }

    update() {
        if (this.ok === 1 || this.ok === 2) {
            let msg = this.ok === 1 ? "AgreeAgentWithdrawOrder" : "RefuseAgentWithdrawOrder"
            let queryItem = {
                pid: this.editPid,
                orderID: this.curId,
                remarks: this.descInfo
            };
            myDispatch(this.$store, msg, queryItem, true)
                .then(() => {
                    if (this.agentWithdrawOrder.code === 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功！！"
                        });
                        this.dialogOperVisible = false;
                        this.loadData();
                        return;
                    }
                    this.$message({
                        type: "error",
                        message: "操作失败！！" + this.agentWithdrawOrder.msg
                    });
                })
                .catch(ex => {
                    this.$message({
                        type: "error",
                        message: ex.message
                    });
                    this.dialogOperVisible = false;
                    return;
                });
        } else if (this.ok === 3) {
            let queryItem = {
                ids: this.curId.split(","),
                desc: this.descInfo
            };
            myDispatch(this.$store, "CloseOrder", queryItem, true)
                .then(() => {
                    this.withdrawReview = this.$store.state.withdrawReview;
                    if (this.withdrawReview.code === 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功！！"
                        });
                        this.dialogOperVisible = false;
                        this.loadData();
                        return;
                    } else if (this.withdrawReview.code !== 400) {
                        this.$message({
                            type: "error",
                            message: this.withdrawReview.message
                        });
                    }
                })
                .catch(ex => {
                    this.$message({
                        type: "error",
                        message: ex.message
                    });
                    this.dialogOperVisible = false;
                    return;
                });
        }
    }

    pass(index, row) {
        this.dialogOperVisible = true;
        this.ok = 1;
        this.curId = row._id;
    }
    refuse(index, row) {
        this.dialogOperVisible = true;
        this.ok = 2;
        this.curId = row._id;
    }
    isShowClose(row) {
        if (
            (new Date().getTime() - new Date(row.applyDate).getTime()) >
            this.closeTime
        ) {
            return true;
        }
        return false;
    }
    close(index, row) {
        if (
            (new Date().getTime() - new Date(row.applyDate).getTime()) <
            this.closeTime
        ) {
            this.$message({
                type: "error",
                message: "订单创建24小时后才能关闭！！！"
            });
            return;
        }
        if (!row.withdrawOrderID) {
            this.$message({ type: "error", message: "数据错误，没有订单号(bil)！" });
            return;
        }
        this.dialogOperVisible = true;
        this.ok = 3;
        this.curId = row.withdrawOrderID;
    }
    //format
    aliAccountFunc(row, column) {
        if (row.alipayAccount) {
            return row.alipayAccount;
        } else {
            return "未绑定";
        }
    }
    settleTypeFunc(row, column) {
        if (row.settleType) {
            if (row.settleType === "unionpay") {
                return "银行卡";
            } else if (row.settleType === "alipay") {
                return "支付宝";
            }
        }
        return "";
    }
    aliNameFunc(row, column) {
        if (row.alipayName) {
            return row.alipayName;
        } else {
            return "未绑定";
        }
    }

    bankCardNumberFunc(row, column) {
        if (row.bankCardNo) {
            return row.bankCardNo;
        } else {
            return "未绑定";
        }
    }
    bankCardRealNameFunc(row, column) {
        if (row.bankCardName) {
            return row.bankCardName;
        } else {
            return "未绑定";
        }
    }
    createTimeFunc(row, column) {
        let date = new Date(row.applyDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    statusFunc(value) {
        switch (value) {
            case "success":
                return "成功";
            case "fail":
                return "失败";
            case "transfer":
                return "转账中";
            case "await":
                return "等待审核";
        }
    }
    refundStatusFunc(value) {
        switch (value) {
            case "refunding":
                return "退款中";
            case "refunded":
                return "退款完成";
            default:
                return "无";
        }
    }
    filterTag(state) {
        if (state === "success") {
            return "success";
        }
        if (state === "fail") {
            return "danger";
        }
        if (state === "await") {
            return "primary";
        }
        if (state === "await") {
            return "primary";
        }
    }

    cancelEdit() {
        this.dialogOperVisible = false;
    }
    finishTimeFunc(row, column) {
        if (row.arrivedDate) {
            let date = new Date(row.arrivedDate);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate;
        } else {
            return "无";
        }
    }
    refundTimeFunc(row, column) {
        if (row.refundDate) {
            let date = new Date(row.refundDate);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate;
        } else {
            return "无";
        }
    }
    // 导出excle
    downloadExcel() {
        const downloadExcelCfg = [
            { title: "项目", field: "pid", type: "string" },
            { title: "订单ID", field: "_id", type: "string" },
            { title: "Bill订单号", field: "withdrawOrderID", type: "string" },
            { title: "代理ID", field: "agencyId", type: "string" },
            { title: "提现金额", field: "applyMoney", type: "string" },
            { title: "兑换类型", field: "settleType", type: "settleType" },
            { title: "兑换渠道", field: "settleChannel", type: "string" },
            { title: "支付宝账号", field: "alipayAccount", type: "string" },
            { title: "支付宝名字", field: "alipayName", type: "string" },
            { title: "银行卡账号", field: "bankCardNo", type: "string" },
            { title: "银行卡名字", field: "bankCardName", type: "string" },
            { title: "提现税收", field: "applyTax", type: "string" },
            { title: "累计兑换", field: "totalSettleMoney", type: "string" },
            { title: "提交时间", field: "applyDate", type: "Date" },
            { title: "到账时间", field: "arrivedDate", type: "Date" },
            { title: "订单信息", field: "remarks", type: "string" },
            { title: "订单状态", field: "status", type: "string" },
            { title: "操作人", field: "operator", type: "string" }
        ];
        let queryItem: QueryItem | undefined = this.getQueryItem();
        // if (Object.keys(queryItem).length <= 1) {
        //   this.$message({
        //     type: "error",
        //     message: "必须输入任一搜索条件"
        //   });
        //   return;
        // }
        myDispatch(this.$store, "GetAgentWithdrawOrderExcel", queryItem).then(
            ret => {
               downloadExcel(ret,this);
            }
        );
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
