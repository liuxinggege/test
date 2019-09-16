<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover
          ref="popover1"
          placement="top"
          itle="标题"
          trigger="hover"
          content="充值问题"
        ></el-popover>
        <el-button
          v-popover:popover1
          type="text"
          class="el-icon-info"
        ></el-button>
        <span class="title">充值问题</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      <span>uid</span>
      <el-input
        v-model="uid"
        style="width:120px; margin:0px 20px 5px 10px"
      ></el-input>
      <span>qq</span>
      <el-input
        v-model="qq"
        style="width:120px; margin:0px 20px 5px 10px"
      ></el-input>
      <span>状态</span>
      <el-select
        v-model="state"
        placeholder="请选择"
        style="margin:0px 0px 0px 10px"
      >
        <el-option
          v-for="item in stateOptions"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
      <span>充值渠道</span>
      <el-select
        v-model="rechargeChannel"
        placeholder="请选择"
        style="margin:0px 0px 0px 10px"
      >
        <el-option
          v-for="item in rechargeChannels"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>订单</span>
      <el-input
        v-model="searchOrderId"
        style="width:290px; margin:0px 20px 5px 10px"
      ></el-input>
      <span>第三方订单</span>
      <el-input
        v-model="searchThirdOrderId"
        style="width:290px; margin:0px 20px 5px 10px"
      ></el-input>
      <span>创建时间</span>
      <el-date-picker
        v-model="createTime"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="margin:20px 10px"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      ></el-date-picker>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="searchData"
      >搜索</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="downloadExcel"
      >导出</el-button>
      <!--列表-->
      <el-table
        :data="RechargeQuestion.rechargeQuestionData"
        border
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="createTime"
          label="提交时间"
          min-width="150"
          :formatter="createTimeFunc"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          prop="uid"
          label="用户详情"
          min-width="80"
          align="center"
          fixed
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="uidOnlineCharge( scope.row.uid)"
            >{{scope.row.uid}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="uid"
          label="用户id"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="用户昵称"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="pid"
          label="项目"
          min-width="50"
          align="center"
          :formatter="pidFormat"
        ></el-table-column>
        <el-table-column
          prop="rechargeTime"
          label="充值时间"
          min-width="150"
          align="center"
          :formatter="rechargeTimeFunc"
        ></el-table-column>
        <el-table-column
          prop="money"
          label="充值金额"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="充值方式"
          min-width="120"
          align="center"
          :formatter="typeFormatter"
        ></el-table-column>
        <el-table-column
          prop="qq"
          label="联系QQ"
          min-width="110"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              min-width="700"
            >
              <p>{{ scope.row.description }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <el-tag
                  v-if="scope.row.description"
                  size="medium"
                >{{ scope.row.description.slice(0,70)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="images"
          label="附件"
          min-width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showImages(scope.$index, scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          min-width="80"
          align="center"
          :formatter="stateFormat"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="65"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.state!=='success'&&scope.row.state!=='fail'&&scope.row.state!=='repeat'"
              @click="edit(scope.$index, scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="订单号"
          min-width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="!scope.row.orderId"
              @click="editOrderId(scope.$index, scope.row)"
            >填写</el-button>
            <el-button
              type="text"
              v-else
              @click="editOrderId(scope.$index, scope.row)"
            >{{scope.row.orderId}}</el-button>
            <!-- <span v-else >{{scope.row.orderId}}</span> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="thirdOrderId"
          label="第三方订单号"
          min-width="250"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="备注"
          min-width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              min-width="700"
            >
              <p>{{ scope.row.remark }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <el-tag
                  v-if="scope.row.remark"
                  size="medium"
                >{{ scope.row.remark.slice(0,70)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeChannel"
          label="充值渠道"
          min-width="150"
          align="center"
          :formatter="channelFunc"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="处理时间"
          min-width="150"
          align="center"
          :formatter="updateTimeFunc"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          min-width="100"
          align="center"
          :formatter="operatorFormat"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="失败回复内容"
          min-width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              min-width="700"
            >
              <p>{{ scope.row.content }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <el-tag
                  v-if="scope.row.content"
                  size="medium"
                >{{ scope.row.content.slice(0,70)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination
          layout="total,sizes,prev, pager, next,jumper"
          class="pag"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[10,20,30,50]"
          :page-size="count"
          :total="RechargeQuestion.totalCount"
        ></el-pagination>
      </el-col>
      <el-dialog
        :visible.sync="dialogImageVisible"
        width="80%"
        @close="close"
      >
        <a
          v-for="(item,index) in images"
          v-bind:href="item"
          :key="index"
        > <img
            style="width:500px; height:600px"
            v-bind:src="item"
          /></a>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogEditVisible"
        @close="close"
      >
        <div style="margin:0px 0px 40px 50px;font-size:20px">
          <span>收件人：</span>
          <span>{{curUid}}</span>
        </div>
        <div style="margin:0px 0px 40px 50px;font-size:20px">
          <span>状态：</span>
          <el-select
            v-model="curState"
            placeholder="请选择"
            style="margin:0px 0px 0px 10px"
          >
            <el-option
              v-for="item in stateSuccessOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </div>
        <div style="margin:0px 0px 10px 50px;font-size:20px">
          <span>邮件内容:</span>
        </div>
        <div style="margin:0px 0px 0px 50px;font-size:20px">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="状态为失败的时候，必须输入邮件内容"
            v-model="curContent"
          ></el-input>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button
            type="primary"
            @click="editConfim"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogEditOrderIdVisible"
        @close="close"
      >
        <el-form
          :inline="true"
          class="small-space"
          label-position="left"
        >
          <el-form-item
            style="margin-left:50px;"
            label="订单号："
          >
            <el-input
              v-model="curOrderId"
              style="width:500px"
              placeholder="如需输入多个订单号请用英文逗号分隔！"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="margin-left:50px;"
            label="第三方订单号："
          >
            <el-input
              v-model="thirdOrderId"
              style="width:500px"
              placeholder="如需输入多个订单号请用英文逗号分隔！"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="margin-left:50px;"
            label="备注："
          >
            <el-input
              v-model="remark"
              style="width:500px"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="margin-left:50px;"
            label="充值渠道："
          >
            <el-select
              v-model="curRechargeChannel"
              placeholder="请选择"
              style="margin:0px 0px 0px 10px"
            >
              <el-option
                v-for="item in rechargeChannels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button
            type="primary"
            @click="editOrderIdConfim"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogOnlineChargeVisible"
        width="80%"
        height="40%"
        @close="close"
      >
        <el-table
          :data="onlineCharge.transferData"
          border
          highlight-current-row
          style="width: 98%;"
        >
          <el-table-column
            prop="createTime"
            label="订单创建时间"
            width="200"
            :formatter="submitTimeFunc"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="deliveredTime"
            label="金币到账时间"
            width="200"
            :formatter="deliveredTime"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="用户昵称"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="uid"
            label="用户id"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="pid"
            label="项目"
            width="100"
            align="center"
            :formatter="pidFormat"
          ></el-table-column>
          <el-table-column
            prop="act"
            label="账号"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="充值金额"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goodsPrice"
            label="实际订单金额"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="payType"
            label="支付通道"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="channel"
            label="充值渠道"
            width="120"
            align="center"
            :formatter="channelFormat"
          ></el-table-column>
          <el-table-column
            prop="userChannel"
            label="注册渠道"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="deviceType"
            label="注册平台"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="_id"
            label="订单ID"
            width="250"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="thirdOrderId"
            label="三方订单号"
            width="250"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="paidTime"
            label="玩家支付时间"
            width="200"
            :formatter="paidTime"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="订单状态"
            min-width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="filterTag(scope.row.state)"
                close-transition
              >{{stateFunc(scope.row.state)}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col class="toolbar3">
          <el-pagination
            layout="total,sizes,prev, pager, next,jumper"
            class="pag"
            @current-change="onlineChargeHandleCurrentChange"
            @size-change="onlineChargeHandleSizeChange"
            :current-page="onlineChargePage"
            :page-sizes="[10,20,30,50]"
            :page-size="onlineChargeCount"
            :total="onlineCharge.totalCount"
          ></el-pagination>
        </el-col>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import {
  RechargeQuestionState,
  OnlineChargeState
} from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";

interface QueryItem {
  uid?: string;
  qq?: string;
  rechargeChannel?: string;
  state?: string;
  orderId?: string;
  thirdOrderId?: string;
  createStartTime?: Date;
  createEndTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class RechargeQuestion extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    myDispatch(this.$store, "GetAllRechargeChannel").then(() => {
      if (this.$store.state.rechargeAndWithdrawCfg.code === 200) {
        this.rechargeChannels = this.$store.state.rechargeAndWithdrawCfg.rechargeChannels;
        this.loadData();
      } else {
        this.$message({ type: "error", message: "获取数据失败!!" });
      }
    });
  }
  /*inital data*/
  onlineCharge: any = {}; //表单数据
  RechargeQuestion: RechargeQuestionState = this.$store.state.rechargeQuestion; //表单数据
  pidList: any[] = [];
  dialogEditOrderIdVisible: boolean = false;
  dialogEditVisible: boolean = false;
  dialogOnlineChargeVisible: boolean = false;
  dialogImageVisible: boolean = false;
  images: string[] = [];
  uid: string = "";
  qq: string = "";
  searchOrderId: string = "";
  searchThirdOrderId: string = "";
  state: string = "needDeal";
  rechargeChannel: string = "";
  curId: string = "";
  curState: string = "";
  curContent: string = "";
  curOrderId: string = "";
  thirdOrderId: string = "";
  remark: string = "";
  curRechargeChannel: string = "";
  curUid: string = "";
  page: number = 1; //当前页
  count: number = 10;
  onlineChargePage: number = 1; //当前页
  onlineChargeCount: number = 10;
  createTime: Date[] = [];
  stateOptions = [
    { value: "所有", key: "" },
    { value: "需要处理", key: "needDeal" },
    { value: "待处理", key: "await" },
    { value: "处理中", key: "processing" },
    { value: "完成", key: "success" },
    { value: "失败", key: "fail" },
    { value: "重复", key: "repeat" }
  ];
  rechargeChannels = [];
  stateSuccessOptions = [
    { value: "完成", key: "success" },
    { value: "失败", key: "fail" }
  ];
  stateConst = {
    await: "待处理",
    processing: "处理中",
    success: "完成",
    fail: "失败",
    repeat: "重复提交"
  };
  typeConst = {
    vip: "vip充值",
    ali: "支付宝",
    aliFixs: "固定支付宝",
    aliPer: "个人支付宝",
    wx: "微信",
    union: "银联",
    qq: "QQ钱包",
    jd: "京东",
    card: "点卡支付",
    yun:"云闪付",
    agentRechage:"官方代充"
  };
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    console.log(queryItem);
    myDispatch(this.$store, "GetRechargeQuestion", queryItem).then(() => {});
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  uidConfim() {}
  uidOnlineCharge(uid) {
    this.curUid = uid;
    this.dialogOnlineChargeVisible = true;
    myDispatch(this.$store, "GetOnlineCharge", {
      uid: this.curUid,
      page: this.onlineChargePage,
      count: this.onlineChargeCount
    }).then(() => {
      this.onlineCharge = this.$store.state.onlineCharge;
    });
  }
  edit(index, row) {
    this.curId = row._id;
    this.curUid = row.uid;
    this.dialogEditVisible = true;
  }
  editConfim() {
    if (this.curState === "") {
      this.$message({ type: "error", message: "状态必须填！" });
      return;
    }
    if (this.curState === "fail" && this.curContent === "") {
      this.$message({
        type: "error",
        message: "状态为失败时，必须填邮件内容！"
      });
      return;
    }
    myDispatch(this.$store, "ReplyRechargeQuestion", {
      id: this.curId,
      state: this.curState,
      content: this.curContent
    }).then(() => {
      if (this.$store.state.rechargeQuestion.code === 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.loadData();
        this.dialogEditVisible = false;
      } else if (this.$store.state.rechargeQuestion.code !== 400) {
        this.$message({
          type: "error",
          message: "修改失败！" + this.$store.state.rechargeQuestion.err
        });
      }
    });
  }
  editOrderId(index, row) {
    this.curId = row._id;
    this.curUid = row.uid;
    this.curOrderId = row.orderId;
    this.thirdOrderId = row.thirdOrderId;
    this.remark = row.remark;
    this.curRechargeChannel = row.rechargeChannel;
    this.dialogEditOrderIdVisible = true;
  }
  editOrderIdConfim() {
    if (this.remark || this.thirdOrderId || this.curOrderId) {
      if (this.thirdOrderId && this.thirdOrderId.search("，") >= 0) {
        this.$message({
          type: "error",
          message: "第三方订单号格式不正确！"
        });
      } else if (this.curOrderId && this.curOrderId.search("，") >= 0) {
        this.$message({
          type: "error",
          message: "订单号格式不正确！"
        });
      } else {
        myDispatch(this.$store, "EditOrderId", {
          id: this.curId,
          orderId: this.curOrderId,
          remark: this.remark,
          thirdOrderId: this.thirdOrderId,
          rechargeChannel: this.curRechargeChannel
        }).then(() => {
          if (this.$store.state.rechargeQuestion.code === 200) {
            this.$message({ type: "success", message: "填写成功" });
            this.loadData();
            this.dialogEditOrderIdVisible = false;
          } else if (this.$store.state.rechargeQuestion.code !== 400) {
            this.$message({
              type: "error",
              message: "填写失败！" + this.$store.state.rechargeQuestion.err
            });
          }
        });
      }
    } else {
      this.$message({
        type: "error",
        message: "第三方订单号、订单号、备注至少填写一项！"
      });
    }
  }
  showImages(index, row) {
    this.images = row.image;
    this.dialogImageVisible = true;
  }
  downloadExcel() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    myDispatch(this.$store, "GetRechargeQuestionExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
    });
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.uid) {
      temp.uid = this.uid;
    }
    if (this.qq) {
      temp.qq = this.qq;
    }
    if (this.rechargeChannel) {
      temp.rechargeChannel = this.rechargeChannel;
    }
    if (this.searchOrderId) {
      temp.orderId = this.searchOrderId;
    }
    if (this.searchThirdOrderId) {
      temp.thirdOrderId = this.searchThirdOrderId;
    }
    if (this.state) {
      temp.state = this.state;
    }
    if (this.createTime && this.createTime[0]) {
      temp.createStartTime = this.createTime[0];
      temp.createEndTime = this.createTime[1];
    }
    return temp;
  }
  close() {
    this.dialogEditOrderIdVisible = false;
    this.dialogEditVisible = false;
    this.dialogImageVisible = false;
    this.onlineCharge = {};
    this.onlineChargePage = 1;
    this.images = [];
    this.curId = "";
    this.curState = "";
    this.curContent = "";
    this.curOrderId = "";
    this.remark = "";
    this.thirdOrderId = "";
    this.curRechargeChannel = "";
  }
  cancelEdit() {
    this.dialogEditOrderIdVisible = false;
    this.dialogEditVisible = false;
    this.dialogImageVisible = false;
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
  //页码变更
  onlineChargeHandleCurrentChange(val) {
    this.onlineChargePage = val;
    this.uidOnlineCharge(this.curUid);
  }
  //每页显示数据量变更
  onlineChargeHandleSizeChange(val) {
    this.onlineChargeCount = val;
    this.uidOnlineCharge(this.curUid);
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
  stateFormat(row, column) {
    if (row.state) {
      return this.stateConst[row.state];
    }
  }
  typeFormatter(row, column) {
    if (row.type) {
      return this.typeConst[row.type];
    }
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
  rechargeTimeFunc(row, column) {
    if (row.rechargeTime) {
      let date = new Date(row.rechargeTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  updateTimeFunc(row, column) {
    if (row.updateTime) {
      let date = new Date(row.updateTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  channelFunc(row, column) {
    let data = "";
    if (row.rechargeChannel) {
      this.rechargeChannels.forEach((e: any) => {
        if (e.value === row.rechargeChannel) {
          data = e.label;
        }
      });
    }
    return data;
  }
  userChannelFunc(row, column) {
    if (row.userChannel === "") {
      return "官方";
    } else {
      return row.userChannel;
    }
  }

  deliveredTime(row, column) {
    if (row.deliveredTime) {
      let date = new Date(row.deliveredTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }
  paidTime(row, column) {
    if (row.paidTime) {
      let date = new Date(row.paidTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "-";
    }
  }

  channelFormat(row, column) {
    return row.channel === "" ? "官方" : row.channel;
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
  filterTag(state) {
    if (state === "ordering") {
      return "primary";
    }
    if (state === "ordered") {
      return "success";
    }
    if (state === "paid") {
      return "success";
    }
    if (state === "delivered") {
      return "success";
    }
  }

  stateFunc(state) {
    if (state === "ordered") {
      return "下订单成功";
    }
    if (state === "ordering") {
      return "开始下订单";
    }
    if (state === "paid") {
      return "支付成功";
    }
    if (state === "delivered") {
      return "金币到账";
    }
  }
  operatorFormat(row){
    if(!row.operator){
      return ''
    }
    return row.operator.join(',')
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
.toolbar3 {
  padding: 20px;
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
