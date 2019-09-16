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
            <!-- <span>项目</span>
			<el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
				<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
				</el-option>
			</el-select> -->
			<span>用户ID</span>
			<el-input v-model="userId" style="width:120px; margin:0px 20px 5px 10px"></el-input>
			<span>订单号(Bill)</span>
			<el-input v-model="orderId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
            <span>类型</span>
			<el-select v-model="type" placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
				<el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<span>状态</span>
			<el-select v-model="orderState" placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
				<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<span>兑换渠道</span>
            <el-input v-model="withdrawChannel" style="width:120px; margin:0px 20px 5px 10px"></el-input>
            <br>
			<span>提交时间</span>
			<el-date-picker v-model="logTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
			</el-date-picker>
            <span>到账时间</span>
			<el-date-picker v-model="finishTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
			</el-date-picker>
			<el-button type="primary" @click="reset" style="margin:0px 0px 0px 50px">重置</el-button>
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
			<el-button class="filter-item" type="primary" icon="el-icon-edit" @click="closeOrders">批量关闭</el-button>
			<el-button type="success" icon="el-icon-document" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
            <br>
            <span>关闭时间</span>
			<el-date-picker v-model="closedTime" type="datetimerange" value-format='yyyy-MM-dd HH:mm:ss' style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间">
			</el-date-picker>
			<span>是否关闭</span>
			<el-select v-model="orderClosed" disabled placeholder="请选择" style="width:120px; margin:5px 15px 5px 28px">
				<el-option v-for="item in ClosedOptions" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button type="success" icon="el-icon-document" @click="downloadBillOrderExcel" style="margin:8px 0px 10px 10px">风控导出</el-button>
			<!--列表-->
			<el-table :data="withdrawReview.withdrawReviewData" border highlight-current-row style="width: 100%;" key="table">
				<el-table-column prop="orderId" label="订单号(bil)" min-width="250" align="center"></el-table-column>
				<el-table-column prop="statusDesc" label="订单状态" min-width="120" :show-overflow-tooltip="true" align="center">
					<template slot-scope="scope">
						<el-tag :type="filterTag(scope.row)" size="mini" close-transition>{{scope.row.statusDesc}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="descripition" label="订单详情" min-width="250" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="个人属性" min-width="120" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="attribution(scope.$index, scope.row)">{{scope.row.uid}}</el-button>
					</template>
				</el-table-column>
                <el-table-column prop="pid" label="项目" min-width="100" align="center" :formatter="pidFormat"></el-table-column>
                <el-table-column prop="channel" label="渠道" min-width="100" align="center" ></el-table-column>
                <!-- <el-table-column prop="type" label="类型" min-width="100" align="center" :formatter="typeFunc" ></el-table-column> -->
				<el-table-column prop="money" label="兑换额度" min-width="100" align="center"></el-table-column>
				<el-table-column prop="tax" label="兑换税收" min-width="130" align="center"></el-table-column>
				<el-table-column prop="finishedWithdrawAmount" label="总兑换" min-width="100" align="center"></el-table-column>
				<el-table-column prop="totalRecharge" label="总充值" min-width="100" align="center"></el-table-column>
				<el-table-column prop="typeName" label="兑换类型" min-width="100" align="center"></el-table-column>
				<el-table-column prop="payChannel" label="兑换渠道" min-width="100" align="center"></el-table-column>
				<el-table-column prop="alipayRealName" label="支付宝名字" min-width="200" align="center"></el-table-column>
				<el-table-column prop="alipayAccount" label="支付宝账号" min-width="200" align="center"></el-table-column>
				<el-table-column prop="bankCardNumber" label="银行卡账号" min-width="150" align="center" :formatter="bankCardNumberFunc"></el-table-column>
				<el-table-column prop="bankCardRealName" label="银行卡名字" min-width="150" align="center" :formatter="bankCardRealNameFunc"></el-table-column>
				<el-table-column prop="ip" label="兑换ip" min-width="160" align="center"></el-table-column>
				<el-table-column prop="ipLocation" label="ip地址" min-width="160" align="center"></el-table-column>
				<el-table-column prop="createTime" label="提交时间" min-width="200" :formatter="createTimeFunc" align="center"></el-table-column>
				<el-table-column prop="finishTime" label="到账时间" min-width="180" :formatter="finishTimeFunc" align="center"></el-table-column>
				<el-table-column prop="refTime" label="退款时间" min-width="180" :formatter="refundTimeFunc" align="center"></el-table-column>
				<el-table-column prop="refStatus" label="退款状态" min-width="120" :show-overflow-tooltip="true" align="center">
					<template slot-scope="scope">
						<el-tag :type="filterTag(scope.row.refStatus)" size="mini" close-transition>{{refundSstatusFunc(scope.row.refStatus)}}</el-tag>
					</template>
				</el-table-column>
                <el-table-column prop="refunded" label="退款金币到账状态" min-width="180" :formatter="refundedFormatter" align="center"></el-table-column>
                <el-table-column prop="opt" label="关闭订单操作人" min-width="90" align="center" ></el-table-column>
				<el-table-column prop="user" label="操作人" min-width="90" align="center" :formatter="userFunc"></el-table-column>
				<el-table-column label="操作" min-width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" v-if="scope.row.state==2" @click="pass(scope.$index, scope.row)">通过</el-button>
						<el-button type="text" style="color:red" v-if="scope.row.state==2" @click="refuse(scope.$index, scope.row)">拒绝</el-button>
						<el-button type="text" v-if="scope.row.state==5&&isShowClose(scope.row)" @click="closeOrder(scope.$index, scope.row)">关闭</el-button>
						<el-button type="text" style="color:red" v-if="scope.row.state==6 && scope.row.status & 0x000002000 && !scope.row.refStatus" @click="refund(scope.$index,scope.row)">退款</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[1,10,20,30,50]" :page-size="count" :total="withdrawReview.totalCount">
				</el-pagination>
			</el-col>
            <!-- 批量关闭 -->
			<el-dialog :visible.sync="dialogCloseOrdersVisible" @close="close">				
                <div v-if="ok===3" style="margin:0px 0px 40px 50px;"  key="closeRemind">
					<span style="font-size:30px;color:red">请确认第三方后台没有这个订单，才能关闭这个订单！</span>
				</div>
				<div style="margin:0px 0px 10px 50px;font-size:20px">
					<span>订单号:</span>
				</div>
				<div style="margin:0px 0px 0px 50px;font-size:20px">
					<el-input type="textarea" :rows="5" placeholder="以英文逗号(,)分割" v-model="curId">
					</el-input>
				</div>
                <div style="margin:20px 0px 10px 50px;font-size:20px">
					<span>描述:</span>
				</div>
				<div style="margin:0px 0px 0px 50px;font-size:20px">
					<el-input  placeholder="请输入内容" v-model="descInfo">
					</el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="update">确 定</el-button>
				</div>
			</el-dialog>
            <!-- 关闭 -->
			<el-dialog :visible.sync="dialogOperVisible" @close="close">
				<div style="margin:0px 0px 40px 50px;font-size:20px">
					<span>{{ok===1?"通过":ok===2?"拒绝":"关闭"}}订单ID:</span>
					<span style="width:800px；word-break:normal; width:auto; display:block; white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{curId}}</span>
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
			<el-dialog v-if="dialogAttibutionVisible" :visible.sync="dialogAttibutionVisible" width=1200px>
				<Attribution v-bind:curUid="currentUid"></Attribution>
			</el-dialog>
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
			<el-dialog v-if="dialogAttibutionVisible" :visible.sync="dialogAttibutionVisible" width=1200px>
				<Attribution v-bind:curUid="currentUid"></Attribution>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { WithdrawReview } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch, removeReapetItem } from "../../utils/index.js";
import STATUS from "../../utils/withdraw";
import Attribution from "@/components/userAttribution.vue";
//BankCard
interface QueryItem {
    uid?: string;
    pid?: string;
    status?: string;
    state?: string;
    closed?: boolean;
    orderId?: string;
    fields?: string;
    withdrawChannel?: string;
    createTimeBegin?: Date;
    createTimeEnd?: Date;
    finishTimeBegin?: Date;
    finishTimeEnd?: Date;
    page?: number;
    count?: number;
    type?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
    components: {
        Attribution
    }
})
export default class BankCard extends Vue {
    // lifecycle hook
    created() {
        this.pidList = [{ name: "全部", pid: "" }, ...JSON.parse(<string>sessionStorage.getItem("pid"))];
        this.loadData(); //初始化-->加载数据
    }
    /*inital data*/
    withdrawReview: WithdrawReview = this.$store.state.withdrawReview; //表单数据
    userId: string = "";
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
    finishTime:Date[]=[];
    closedTime: Date[] = [new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate() - 7,
        0,
        0,
        0
    ), new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate() + 1,
        0,
        0,
        0
    )]
    page: number = 1; //当前页
    count: number = 10;
    currentUid: string = "";
    withdrawChannel: string = "";
    dialogAttibutionVisible: boolean = false;
    pidList: any[] = [];
    pid: string = "";
    closeTime: number = 1000 * 60 * 60 * 0.5; //关闭转账中的订单必须大于这个时间
    stateOptions = [
        { value: "", label: "无" },
        { value: 2, label: "人工审核" },
        { value: 1, label: "自动审核" },
        { value: 3, label: "代理接单" },
        { value: 4, label: "用户接单" },
        { value: 5, label: "转账中" },
        { value: 6, label: "完成" }
    ];
    orderState = "";
    statusOptions = [
        { value: "", label: "无" },
        { value: 0x000000001, label: "机审失败 游戏总时长小于限定值" },
        { value: 0x000000002, label: "机审失败 今日提现总额大于最大限制" },
        { value: 0x000000004, label: "机审失败 总充值小于最小限制" },
        { value: 0x000000008, label: "机审失败 兑换总额大于充值总额" },
        { value: 0x000004000, label: "机审失败 今日提现次数大于限制" },
        { value: 0x000008000, label: "机审失败 提现成功次数小于最小限制" },
        { value: 0x000000010, label: "提现金额超过20000" },
        { value: 0x000000020, label: "总提现大于总充值+累计输赢" },
        { value: 0x000000040, label: "总提现除以总抽水大于等于20" },
        { value: 0x000000080, label: "提现次数等于 5 10 20" },
        { value: 0x000000100, label: "抽查" },
        { value: 0x000000200, label: "人工审核通过" },
        { value: 0x000000400, label: "人工审核失败" },
        { value: 0x000000800, label: "代理未接单" },
        { value: 0x000001000, label: "打钱失败" },
        { value: 0x000002000, label: "转账成功" }
    ];
    type: any = "";
    typeConst = {
        1: "支付宝",
        2: "银行卡",
        3: "代理",
        4: "BACK_STAGE",
        5: "商人"
    };
    types = [
        {
            value: "",
            label: "全部"
        },
        {
            value: 1,
            label: "支付宝"
        },
        {
            value: 2,
            label: "银行卡"
        },
        // {
        //   value: 3,
        //   label: "代理"
        // },
        // {
        //   value: 4,
        //   label: "BACK_STAGE"
        // },
        {
            value: 5,
            label: "商人"
        }
    ];
    fields =
        "refTime,refStatus, createTime,finishTime,id,type,descripition,user,ipLocation,uid,money,statusDesc,typeName,payChannel,checkDesc,orderId,userMoneyPre,userMoneyAfter,tax,ip,alipayAccount,alipayRealName,bankCardNumber,bankCardRealName,unfinishedWithdrawAmount,finishedWithdrawAmount,totalRecharge,totalAgentRecharge,state,stateName";
    orderClosed = true
    ClosedOptions = [
        { value: true, label: "关闭" },
        { value: false, label: "未关闭" }
    ];
    status = "";
    orderId = "";
    dialogCloseOrdersVisible: boolean = false;
    dialogOperVisible: boolean = false;
    dialogRefundOperVisible: boolean = false;
    curId = "";
    ok: number = 0; //1:通过。2:拒绝。3:关闭
    descInfo = "";

    getData() {
        this.page = 1;
        this.loadData();
    }
    loadData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        myDispatch(this.$store, "GetWithdrawReviewList", queryItem).then(() => { });
    }
    reset() {
        this.userId = "";
        this.status = "";
        this.orderState = "";
        this.orderId = "";
        this.logTime = [];
        this.finishTime = [];
    }
    //获取查询条件
    getQueryItem() {
        let temp: QueryItem = {pid:this.pid};
        if (this.type) {
            temp.type = this.type;
        }
        if (this.userId) {
            temp.uid = this.userId;
        }
        if (this.status) {
            temp.status = this.status;
        }
        if (this.orderState) {
            temp.state = this.orderState;
        }
        if (this.orderClosed) {
            temp.closed = this.orderClosed;
        }
        if (this.withdrawChannel) {
            temp.withdrawChannel = this.withdrawChannel;
        }
        if (this.orderId) {
            temp.orderId = this.orderId;
        }
        temp.fields = this.fields;
        if (this.logTime && this.logTime[0]) {
            temp.createTimeBegin = this.logTime[0];
            temp.createTimeEnd = this.logTime[1];
        }
        if (this.finishTime && this.finishTime[0]) {
            temp.finishTimeBegin = this.finishTime[0];
            temp.finishTimeEnd = this.finishTime[1];
        }
        return temp;
    }

    attribution(index, row) {
        this.currentUid = row.uid;
        this.dialogAttibutionVisible = true;
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
    submitTimeFunc(row, column) {
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

    update() {
        if (this.ok === 1 || this.ok === 2) {
            let queryItem = {
                id: this.curId,
                check: {
                    ok: this.ok === 1 ? true : false,
                    desc: this.descInfo
                }
            };
            myDispatch(this.$store, "UpadteOrders", queryItem)
                .then(() => {
                    if (this.withdrawReview.code === 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.dialogOperVisible = false;
                        this.loadData();
                        return;
                    } else {
                        this.$message({
                            type: "error",
                            message: `操作失败${this.withdrawReview.message}`
                        });
                        this.loadData();
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
                        this.dialogCloseOrdersVisible = false;
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
                    this.dialogCloseOrdersVisible = false;
                    return;
                });
        }
    }
    filterTag(row) {
        if (
            STATUS.check(
                row.status,
                STATUS.STATUS_AUTO_FAIL_TODAY_WITHDRAW_GT_RLIMIT_RED
            ) ||
            STATUS.check(
                row.status,
                STATUS.STATUS_AUTO_FAIL_TOTAL_WITHDRAW_GT_RECHARGE_AND_WINLOSE
            ) ||
            row.stateName === "完成(失败)"
        ) {
            return "danger";
        } else {
            return "primary";
        }
    }

    pass(index, row) {
        this.dialogOperVisible = true;
        this.ok = 1;
        this.curId = row.id;
    }
    refuse(index, row) {
        this.dialogOperVisible = true;
        this.ok = 2;
        this.curId = row.id;
    }
    isShowClose(row) {
        if (
            new Date().getTime() - new Date(row.createTime).getTime() >
            this.closeTime
        ) {
            return true;
        }
        return false;
    }
    closeOrder(index, row) {
        if (
            new Date().getTime() - new Date(row.createTime).getTime() <
            this.closeTime
        ) {
            this.$message({
                type: "error",
                message: "订单创建半个小时后才能关闭！！！"
            });
            return;
        }
        if (!row.orderId) {
            this.$message({ type: "error", message: "数据错误，没有订单号(bil)！" });
            return;
        }
        this.dialogOperVisible = true;
        this.ok = 3;
        this.curId = row.orderId;
    }
    closeOrders(chooseData) {
        this.dialogCloseOrdersVisible = true;
        this.ok = 3;
    }
    // 关闭弹出层
    close() {
        this.curId = "";
        this.descInfo = "";
    }

    refund(index, row) {
        this.dialogRefundOperVisible = true;
        this.curId = row.orderId;
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
    typeFunc(row, column) {
        if (row.type) {
            return this.typeConst[row.type];
        }
    }
    bankCardNumberFunc(row, column) {
        if (row.bankCardNumber) {
            return row.bankCardNumber;
        } else {
            return "未绑定";
        }
    }
    bankCardRealNameFunc(row, column) {
        if (row.bankCardRealName) {
            return row.bankCardRealName;
        } else {
            return "未绑定";
        }
    }
    userFunc(row, column) {
        if (row.user) {
            return row.user;
        } else {
            return "系统";
        }
    }
    refundedFormatter(row, column) {
        if (row.refunded) {
            let date = new Date(row.refGoldTime);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate;
        } else {
            return "未到账";
        }
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
    createTimeFunc(row, column) {
        let date = new Date(row.createTime);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    cancelEdit() {
        this.dialogOperVisible = false;
        this.dialogRefundOperVisible = false;
    }
    finishTimeFunc(row, column) {
        if (row.finishTime) {
            let date = new Date(row.finishTime);
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
        if (row.refTime) {
            let date = new Date(row.refTime);
            let sdate = date.toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            return sdate;
        } else {
            return "无";
        }
    }
    refundSstatusFunc(value) {
        switch (value) {
            case "refunding":
                return "退款中";
            case "refunded":
                return "退款完成";
            default:
                return "无";
        }
    }
    // 导出excle
    downloadExcel() {
        const downloadExcelCfg = [
            { title: "订单号", field: "orderId", type: "number" },
            { title: "订单状态", field: "state", type: "withdrawOrderState" },
            { title: "订单详情", field: "descripition", type: "string" },
            { title: "个人属性", field: "uid", type: "string" },
            { title: "项目", field: "pid", type: "pidType" },
            { title: "渠道", field: "channel", type: "channelType" },
            { title: "兑换额度", field: "money", type: "string" },
            { title: "兑换税收", field: "tax", type: "string" },
            { title: "兑换类型", field: "type", type: "withdrawType" },
            { title: "兑换渠道", field: "payChannel", type: "string" },
            { title: "支付宝名字", field: "alipayRealName", type: "string" },
            { title: "支付宝账号", field: "alipayAccount", type: "string" },
            { title: "银行卡账号", field: "bankCardNumber", type: "string" },
            { title: "银行卡名字", field: "bankCardRealName", type: "string" },
            { title: "兑换ip", field: "ip", type: "string" },
            { title: "提交时间", field: "createTime", type: "Date" },
            { title: "到账时间", field: "finishTime", type: "Date" },
            { title: "操作人", field: "manualOptUser", type: "string" }
        ];
        let queryItem: QueryItem | undefined = this.getQueryItem();
        if (Object.keys(queryItem).length <= 1) {
            this.$message({
                type: "error",
                message: "必须输入任一搜索条件"
            });
            return;
        }
        myDispatch(this.$store, "GetWithdrawReviewListExcel", queryItem).then(
            ret => {
                if (!ret) {
                    console.error("GetWithdrawReviewListExcel cb !ret");
                    return;
                }
               downloadExcel(ret,this);
            }
        );
    }
    // 导出billOrder excle
    downloadBillOrderExcel() {
        const downloadExcelCfg = [
            { title: "订单号", field: "_id", type: "string" },
            { title: "项目", field: "pid", type: "pidType" },
            { title: "兑换方式", field: "withdrawType", type: "settleType" },
            { title: "兑换通道", field: "channel", type: "string" },// withdrawChannel
            { title: "提交时间", field: "createTime", type: "Date" },
            { title: "关闭时间", field: "closeTime", type: "Date" },
            { title: "关闭人", field: "opt", type: "string" },
        ];
        let queryItem: any = {};
        if (this.orderClosed) {
            queryItem.closed = this.orderClosed;
        }
        if (this.closedTime && this.closedTime[0]) {
            queryItem.closeStartTime = this.closedTime[0];
            queryItem.closeEndTime = this.closedTime[1];
        } else {
            this.$message({
                type: "error",
                message: "必须输入时间"
            });
            return;
        }
        myDispatch(this.$store, "GetBillOrderListExcel", queryItem).then(
            ret => {
                if (!ret) {
                    console.error("GetBillOrderListExcel cb !ret");
                    return;
                }
               downloadExcel(ret,this);
            }
        );
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
