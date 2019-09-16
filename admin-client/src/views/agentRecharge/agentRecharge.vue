<template>
  <div class="dashboard-editor-container">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="商人充值"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">商人充值</span>
      </el-col>
      <div class="searchBox">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="search._id"></el-input>
          </el-form-item>
          <el-form-item label="商人ID">
            <el-input type="number" v-model="search.aUid"></el-input>
          </el-form-item>
          <el-form-item label="玩家ID">
            <el-input type="number" v-model="search.uid"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="search.state" placeholder="请选择">
              <el-option v-for="item in stateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目">
            <el-select v-model="search.pid" placeholder="请选择">
              <el-option v-for="item in pidArr" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="举报状态">
            <el-select v-model="search.report" placeholder="请选择">
              <el-option v-for="item in complaintArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价">
            <el-select v-model="search.evaluation" placeholder="请选择">
              <el-option v-for="item in evaluationArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="创建时间">
            <el-date-picker v-model="search.createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-date-picker v-model="search.finishDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button type="success" @click="checkOrderExcel">导出excel</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border cell-class-name="tableTd" header-cell-class-name="tableTh">
        <el-table-column prop="pid" fixed label="项目" :formatter="pidFormat" width="150" align="center"></el-table-column>
        <el-table-column prop="_id" fixed label="订单号" width="220" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="createTimeFormat" width="160" align="center"></el-table-column>
        <el-table-column prop="finishDate" label="完成时间" :formatter="arrivalTimeFormat" width="160" align="center"></el-table-column>
        <el-table-column prop="aUid" label="商人ID" width="120" align="center"></el-table-column>
        <el-table-column prop="aName" label="商人昵称" width="120" align="center"></el-table-column>
        <el-table-column prop="uid" label="玩家ID" width="120" align="center"></el-table-column>
        <el-table-column prop="rebateMoney" label="返利金额" width="300" align="center"></el-table-column>
        <el-table-column prop="relMoney" :formatter="relGoldFormat" label="实际到账" width="120" align="center"></el-table-column>
        <el-table-column prop="state" label="订单状态" :formatter="stateFormat" width="120" align="center"></el-table-column>
        <el-table-column prop="remarks" label="订单取消原因" width="200" align="center"></el-table-column>
        <el-table-column prop="evaluation" label="评价" :formatter="evaluationFormat" width="120" align="center"></el-table-column>
        <el-table-column prop="report" label="举报状态" :formatter="reportFormat" width="120" align="center"></el-table-column>
        <el-table-column prop="reportRemarks" label="举报理由" width="200" align="center"></el-table-column>
        <el-table-column prop="alreadyCancel" label="是否取消过" :formatter="alreadyCancelFormat" width="200" align="center"></el-table-column>
        <el-table-column prop="cancelState" label="取消或者激活" :formatter="cancelStateFormat" width="200" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="readTalk(scope.row)" type="primary" size="small">详情</el-button>
            <el-button v-if="scope.row.report==1" @click="showDialogReport(scope.row)" type="primary" size="small">被举报</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="count" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </el-card>
    <el-dialog title="聊天记录" :visible.sync="dialogRecharge" width="600" @close="closeChat">
      <div class="talkIn" @scroll="talkScroll">
        <div v-for="(item,index) in curMsgs" :key="index">
          <div v-if="item.fromType==0" class="talkItem left">
            <h3>玩家ID：{{item.fromUid}}</h3>
            <div class="talkContent" v-if="item.type==2">
              <img :src="item.content" @click="lookBig(item.content)">
            </div>
            <div class="talkContent" v-else>{{item.content}}</div>
            <div class="sendTime">{{item.createDate | dateFormat}}</div>
          </div>
          <!-- 己方 -->
          <div v-if="item.fromType==1" class="talkItem right">
            <h3>代理ID：{{item.fromUid}}</h3>
            <div class="talkContent" v-if="item.type==2">
              <img :src="item.content" @click="lookBig(item.content)">
            </div>
            <div class="talkContent" v-else-if="item.type==5">
              <span v-for="(type,typeIndex) in item.content" :key="typeIndex" class="typeItem">
                支付方式：{{type.type|payTypesFormat}}
                <span v-if="type.act">账号：{{type.act}}</span>
                <img v-if="type.qrCode" :src="type.qrCode">
                <span v-if="type.feeRate!=0">手续费率：{{type.feeRate}}</span>
              </span>
            </div>
            <div class="talkContent" v-else>{{item.content}}</div>
            <div class="sendTime">{{item.createDate | dateFormat}}</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogReport" width="30%">
      <span>举报确认</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportCansel">举报失败</el-button>
        <el-button type="primary" @click="reportSubmit">举报成功</el-button>
      </span>
    </el-dialog>
    <div class="bigImg" @click="bigImg=false" v-if="bigImg">
      <img :src="bigImg" alt>
    </div>
  </div>
</template>
<script>
import {
  agentRecharge,
  chatDetail,
  checkOrderReport,
  agentOrderExcel
} from "@/api/admin/agentRecharge/agentRecharge";
import { myAsyncFn } from "@/utils/index.js";
let payTypeArrAll = [
  { label: "支付宝账号", value: "ali_pay_act", type: "act" },
  { label: "支付宝扫码", value: "ali_pay_qr", type: "qr" },
  { label: "微信账号", value: "wx_pay_act", type: "act" },
  { label: "微信扫码", value: "wx_pay_qr", type: "qr" },
  { label: "银联账号", value: "union_pay_act", type: "act" },
  { label: "银联扫码", value: "union_pay_qr", type: "qr" },
  { label: "信用卡账号", value: "xy_pay_act", type: "act" },
  { label: "信用卡扫码", value: "xy_pay_qr", type: "qr" },
  { label: "花呗账号", value: "hb_pay_act", type: "act" },
  { label: "花呗扫码", value: "hb_pay_qr", type: "qr" },
  { label: "云闪付账号", value: "yun_pay_act", type: "act" },
  { label: "云闪付扫码", value: "yun_pay_qr", type: "qr" },
  { label: "QQ钱包账号", value: "qq_pay_act", type: "act" },
  { label: "QQ钱包扫码", value: "qq_pay_qr", type: "qr" },
  { label: "京东账号", value: "jd_pay_act", type: "act" },
  { label: "京东扫码", value: "jd_pay_qr", type: "qr" }
];
export default {
  data() {
    return {
      search: {
        _id: undefined,
        aUid: undefined,
        uid: undefined,
        state: undefined,
        pid: undefined,
        report: undefined,
        evaluation: undefined,
        createDate: [],
        finishDate: []
      },
      bigImg: undefined,
      page: 1,
      totalCount: 100,
      count: 10,
      tableData: [],
      evaluationArr: [
        {
          value: undefined,
          label: "全部"
        },
        {
          value: 0,
          label: "未评价"
        },
        {
          value: 1,
          label: "不满意"
        },
        {
          value: 2,
          label: "满意"
        }
      ],
      stateArr: [
        { value: undefined, label: "全部" },
        { value: 0, label: "未完成" },
        { value: 1, label: "已完成" },
        { value: 2, label: "已关闭" }
      ],
      pidArr: [],
      complaintArr: [
        { value: 2, label: "举报成功" },
        { value: 3, label: "举报失败" },
        { value: 1, label: "被举报" },
        { value: 0, label: "正常" },
        { value: undefined, label: "全部" }
      ],
      dialogRecharge: false,
      dialogCansel: false,
      dialogId: "",
      socketShow: false,
      talkPage: 1,
      talkCount: 10,
      curMsgs: [],
      talkAuid: "",
      talkUid: "",
      dialogReport: false,
      dialogReportArr: ""
    };
  },
  filters: {
    dateFormat(date) {
      let newDate = new Date(date);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    },
    payTypesFormat(data) {
      let item = payTypeArrAll.find(i => i.value == data);
      return item.label;
    }
  },
  created() {
    this.getData();
    this.pidArr = JSON.parse(sessionStorage.getItem("pid"));
    this.pidArr.push({ name: "全部", pid: "" });
  },
  methods: {
    alreadyCancelFormat(row){
      if(row.alreadyCancel){
        return '是'
      }
      else{
        return '否'
      }
    },
    cancelStateFormat(row){
      if(row.cancelState){
        return '是'
      }
      else{
        return '否'
      }
    },
    async checkOrderExcel() {
      let queryItem = this.search;
      queryItem.finishDateStart = undefined;
      queryItem.finishDateEnd = undefined;
      queryItem.createDateStart = undefined;
      queryItem.createDateEnd = undefined;
      if (queryItem.createDate) {
        queryItem.createDateStart = queryItem.createDate[0];
        queryItem.createDateEnd = queryItem.createDate[1];
      }
      if (queryItem.finishDate) {
        queryItem.finishDateStart = queryItem.finishDate[0];
        queryItem.finishDateEnd = queryItem.finishDate[1];
      }
      delete queryItem.page;
      delete queryItem.count;
      let ret = await myAsyncFn(agentOrderExcel, queryItem);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "成功添加导出任务！"
        });
      } else {
        this.$message({
          type: "error",
          message: ret.err
        });
      }
    },
    searchData() {
      this.page = 1;
      this.getData();
    },
    readTalk(row) {
      //查看聊天记录
      this.dialogId = row._id;
      this.talkAuid = row.aUid;
      this.talkUid = row.uid;
      this.dialogRecharge = true;
      this.talkPage = 1;
      this.loadChat().then(res => {
        if (res.length == 0) {
          this.$message({
            type: "info",
            message: "此订单无对话信息!"
          });
        }
      });
    },
    closeChat() {
      this.curMsgs = [];
    },
    loadChat() {
      return new Promise((resolve, reject) => {
        let queryItem = {
          chatId: this.dialogId,
          page: this.talkPage,
          count: this.talkCount
        };
        chatDetail(queryItem).then(res => {
          let data = res.data.msg.pageData;
          resolve(data);
          if (data.length == 0) {
            return;
          }
          data.forEach(item => {
            if (item.type == 5) {
              item.content = JSON.parse(item.content);
            }
            this.curMsgs.push(item);
          });
        });
      });
    },
    talkScroll(e) {
      let scroll = e.target.scrollTop;
      if (scroll >= e.target.scrollHeight - e.target.clientHeight - 50) {
        this.talkPage++;
        this.loadChat();
      }
    },
    showDialogReport(row) {
      this.dialogReportArr = row;
      this.dialogReport = true;
    },
    reportCansel() {
      let row = this.dialogReportArr;
      let queryItem = {
        id: row._id,
        aUid: row.aUid,
        uid: row.uid,
        report: 3
      };
      this.submitReportFuc(queryItem);
    },
    submitReportFuc(queryItem) {
      checkOrderReport(queryItem).then(res => {
        if (res.data.err) {
          this.$message({
            type: "error",
            message: res.data.err
          });
          return;
        }
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getData();
        }
      });
      this.dialogReport = false;
    },
    reportSubmit() {
      let row = this.dialogReportArr;
      let queryItem = {
        id: row._id,
        aUid: row.aUid,
        uid: row.uid,
        report: 2
      };
      this.submitReportFuc(queryItem);
    },
    socketClose() {
      //关闭聊天框
      this.socketShow = false; //关闭浮窗
    },
    handleSizeChange(val) {
      this.count = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    getData() {
      let queryItem = { ...this.search };
      queryItem.count = this.count;
      queryItem.page = this.page;
      queryItem.finishDateStart = undefined;
      queryItem.finishDateEnd = undefined;
      queryItem.createDateStart = undefined;
      queryItem.createDateEnd = undefined;
      if (queryItem.createDate) {
        queryItem.createDateStart = queryItem.createDate[0];
        queryItem.createDateEnd = queryItem.createDate[1];
      }
      if (queryItem.finishDate) {
        queryItem.finishDateStart = queryItem.finishDate[0];
        queryItem.finishDateEnd = queryItem.finishDate[1];
      }
      agentRecharge(queryItem).then(res => {
        if (res.data.code == 200) {
          this.totalCount = res.data.msg.totalCount;
          this.tableData = res.data.msg.pageData;
        } else {
          this.$message({
            type: "error",
            message: res.data.error
          });
        }
      });
    },
    createTimeFormat(row) {
      if (row.createDate) {
        let newDate = new Date(row.createDate);
        let sdate = newDate.toLocaleString(undefined, {
          hour12: false,
          timeZone: "Asia/Shanghai"
        });
        return sdate;
      }
    },
    arrivalTimeFormat(row) {
      if (row.finishDate) {
        let newDate = new Date(row.finishDate);
        let sdate = newDate.toLocaleString(undefined, {
          hour12: false,
          timeZone: "Asia/Shanghai"
        });
        return sdate;
      }
    },
    pidFormat(row) {
      let key = row.pid;
      let prod = "";
      this.pidArr.some(item => {
        if (item.pid == key) {
          prod = item.name;
        }
        return item.pid == key;
      });
      return prod;
    },
    stateFormat(row) {
      let item = this.stateArr.find(i => i.value === row.state);
      if (item) {
        return item.label;
      }
    },
    evaluationFormat(row) {
      let item = this.evaluationArr.find(i => i.value === row.evaluation);
      if (item) {
        return item.label;
      }
    },
    reportFormat(row) {
      let item = this.complaintArr.find(i => i.value === row.report);
      if (item) {
        return item.label;
      }
    },
    relGoldFormat(row) {
      if (!row.paidMoney) {
        return "0";
      } else {
        return row.paidMoney;
      }
    },
    lookBig(img) {
      this.bigImg = img;
    }
  }
};
</script>
<style lang="scss">
.pageBox {
  margin: 20px;
  display: flex;
  justify-content: center;
}
.talkIn {
  max-height: 500px;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 10px;
}
.talkItem {
  color: #333;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 14px;
  &.left {
    max-width: 80%;
    .talkContent,
    .hello {
      background: #fff;
    }
  }
  &.right {
    max-width: 80%;
    margin-left: 20%;
    text-align: right;
    .talkContent,
    .hello {
      background: rgb(133, 230, 133);
    }
  }
  .talkContent {
    font-size: 14px;
    display: inline-block;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 5px;
    img {
      max-width: 300px;
    }
  }
  .typeItem {
    display: block;
    margin: 10px;
    color: red;
    font-weight: 700;
    line-height: 28px;
    img {
      display: block;
    }
    span {
      text-align: center;
      display: block;
    }
  }
  .sendTime {
    opacity: 0.5;
  }
  h3 {
    font-size: 14px;
    opacity: 0.8;
  }
  .hello {
    line-height: 30px;
  }
  .qrcodeMsg {
    display: flex;
    .qrcode {
      margin-right: 10px;
    }
  }
}
.bigImg {
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999999;
}
</style>
