<template>
  <div>
    <!--工具条-->
    <el-col class="toolbar1">
      <span>项目</span>
      <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 5px 5px 10px;width:80px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
      </el-select>
      <span>玩家Id：</span>
      <el-input type="text" v-model="uid" style="width:80px;margin:5px"></el-input>
      <span>操作人：</span>
      <el-input type="text" v-model="opt" style="width:80px;margin:5px"></el-input>
      <span>反馈时间：</span>
      <el-date-picker v-model="replyTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" placeholder="选择时间范围" style="width:250px"></el-date-picker>
      <span style="margin:5px">邮件状态:</span>
      <el-select placeholder="请选择" v-model="emailType" style="width:95px;">
        <el-option v-for="item in emailTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin:5px">满意度:</span>
      <el-select placeholder="请选择" v-model="satisfaction" style="width:95px;">
        <el-option v-for="item in satisfactionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin:5px">反馈类型:</span>
      <el-select placeholder="请选择" v-model="replyType" style="width:110px;">
        <el-option v-for="item in replyTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="success" @click="search" style="margin:10px">搜索</el-button>
      <el-button type="success" @click="downloadExcel" style="margin:10px">导出excel</el-button>
      <el-button type="primary" @click="reply" style="margin:10px">批量发送</el-button>
    </el-col>
    <!--列表-->
    <el-table :data="notProcess.data" border highlight-current-row style="width: 100%" ref="replyMailTable" @select="selectTr" @select-all="selectAll">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="pid" label="项目" min-width="50px" align="center" fixed :formatter="pidFormat"></el-table-column>
      <el-table-column prop="uid" label="发件人" min-width="90px" align="center" fixed>
        <!-- <template slot-scope="scope">
                    <el-button type="text" @click="showRechargeWithdraw(scope.$index, scope.row)">{{scope.row.uid}}</el-button>
        </template>-->
      </el-table-column>
      <el-table-column prop="questionTime" label="反馈时间" min-width="160px" :formatter="questionTimeFormat" align="center"></el-table-column>
      <el-table-column prop="type" label="反馈类型" min-width="95px" align="center" :formatter="feedbackType"></el-table-column>
      <el-table-column prop="question" :show-overflow-tooltip="true" label="提交内容" min-width="400px"></el-table-column>
      <el-table-column prop="answer" :show-overflow-tooltip="true" label="回复内容" min-width="100px"></el-table-column>
      <el-table-column prop="answerTime" label="回复时间" min-width="160px" :formatter="answerTimeFormat" align="center"></el-table-column>
      <el-table-column prop="opt" label="操作人" min-width="70px" align="center"></el-table-column>
      <el-table-column prop="read" label="操作" min-width="50px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.answer" type="text" @click="reply(scope.$index, scope.row)">回复</el-button>
          <el-button v-else type="text" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="满意度" min-width="70px" :formatter="satisfactionFormat" align="center"></el-table-column>
      <el-table-column prop="read" label="邮件状态" min-width="70px" :formatter="emailTypeFormat" align="center"></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col class="toolbar2">
      <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,40,60,80]" :page-size="count" :total="notProcess.totalCount"></el-pagination>
    </el-col>
    <!--编辑邮件内容-->
    <el-dialog :visible.sync="dialogEditVisible" @close="closeEdit" width="1000px" title="编辑回复内容">
      <div style="margin:0px 0px 40px 0px;font-size:20px">
        <span>收件人:</span>
        <span style="width:800px；word-break:normal; width:auto; display:block; white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{currentUid}}</span>
      </div>
      <div style="margin:0px 0px 10px 0px;font-size:20px">
        <span>邮件内容:</span>
      </div>
      <div style="margin:0px 0px 0px 0px;font-size:20px">
        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="questionContent"></el-input>
      </div>
      <div style="width:100%;text-align:center;margin:20px">
        <el-button type="primary" @click="confirmEdit">保存</el-button>
      </div>
    </el-dialog>
    <!--单个回复邮件-->
    <!-- <el-dialog :visible.sync="dialogReplyVisible" @close="close" width=1000px> -->
    <el-dialog :visible.sync="dialogReplyVisible" @close="close" width="1000px">
      <div style="margin:0px 0px 40px 50px;font-size:20px">
        <span>收件人:</span>
        <span style="width:800px；word-break:normal; width:auto; display:block; white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{currentUid}}</span>
      </div>
      <div style="margin:0px 0px 10px 50px;font-size:20px">
        <span>邮件内容:</span>
      </div>
      <div style="margin:0px 0px 0px 50px;font-size:20px">
        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="responseData"></el-input>
      </div>
      <div style="width:100%;overflow:hidden;margin:20px">
        <el-button type="info" @click="reponseClear" style="float:right;margin:0 20px 0 400px">清空</el-button>
        <el-button type="primary" @click="reponseConfirm" style="float:right">发送</el-button>
      </div>

      <div style="margin:10px 10px 0px 50px;font-size:20px">
        分类：
        <span v-for="(item,index) in templateType" :key="index">
          <el-button style="margin:10px" plain @click="setTemplateType(index)">{{index}}</el-button>
        </span>
      </div>
      <div style="margin:10px 10px 0px 50px;font-size:20px">
        标题：
        <span v-for="(item,index) in templateType[currTemplateType]" :key="index">
          <el-button style="margin:10px" plain @click="setResponseData(item)">{{item.title||"-"}}</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 流水详细信息 -->
    <el-dialog v-if="dialogMoneyChangeVisible" :visible.sync="dialogMoneyChangeVisible" width="1400px">
      <MoneyChange v-bind:curUid="currentUid"></MoneyChange>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import MoneyChange from "./../../admin_userManager/component/moneyChange.vue";
import { MailManagerState } from "../../../store/stateInterface";
import { NotProcess } from "../../../store/modules/gameSetting/mailManager";
import { downloadExcel } from "../../../utils/downloadEXCEL";
import { editQuestion } from "../../../api/admin/gameSetting/gameSetting";
import { myDispatch, removeReapetItem, myAsyncFn } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

interface QueryItem {
  pid?: string;
  read?: boolean;
  comment?: boolean;
  type?: number;
  uid?: string;
  opt?: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    MoneyChange
  }
})
export default class SenMail extends Vue {
  // lifecycle hook
  async created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.pidList.push({ name: "全部", pid: "" });
    this.loadData();
    // 获取邮件模版
    await this.getMailTemplate();
  }
  async mounted() {}
  /*inital data*/
  mailManager: MailManagerState = this.$store.state.mailManager;
  notProcess = this.mailManager.notProcess;
  // 查询条件
  uid: string = "";
  opt: string = "";
  replyTime: Date[] = [];
  replyType: any = "";
  emailType: any = false;
  satisfaction: any = "";
  pidList: any[] = [];
  pid: string = "";
  satisfactionOptions = [
    { value: "", label: "全部" },
    { value: true, label: "满意" },
    { value: false, label: "不满意" }
  ];
  emailTypeOptions = [
    { value: "", label: "全部" },
    { value: false, label: "未回复" },
    { value: true, label: "已回复" }
  ];
  replyTypeOptions = [
    { value: "", label: "全部" },
    { value: 1, label: "邮件反馈" },
    { value: 2, label: "商人投诉" }
  ];
  page: number = 1; //当前页
  count: number = 20;
  currentUid = "";
  responseData = "";
  dialogReplyVisible = false;
  dialogEditVisible: boolean = false;
  dialogMoneyChangeVisible: boolean = false; //金币流水
  questionContent: string = "";
  curId: string = "";
  ids: any[] = [];
  uidList: any[] = [];
  templateData: any[] = []; // 邮件模版数据
  templateType: any = {};
  currTemplateType: string = "";
  /*method*/
  search() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let querItem = this.getQueryItem();
    querItem.page = this.page;
    querItem.count = this.count;
    myDispatch(this.$store, "GetNotProcessMail", querItem, true).then(() => {
      this.notProcess = this.mailManager.notProcess;
      this.notProcess.data = this.notProcess.data.map(e => {
        e.checked = false;
        return e;
      });
    });
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = {};
    if (this.pid !== "") {
      temp.pid = this.pid;
    }
    if (this.opt !== "") {
      temp.opt = this.opt;
    }
    if (this.emailType !== "") {
      temp.read = this.emailType;
    }
    if (this.satisfaction !== "") {
      temp.comment = this.satisfaction;
    }
    if (this.replyType) {
      temp.type = this.replyType;
    }
    if (this.uid.trim()) {
      temp.uid = this.uid;
    }
    if (this.replyTime) {
      temp.startTime = this.replyTime[0];
      temp.endTime = this.replyTime[1];
    }
    return temp;
  }
  // 编辑回复内容
  edit(row) {
    let now = new Date();
    let times = now.getTime() - new Date(row.answerTime).getTime();
    if (times > 10 * 60 * 1000) {
      this.$message({
        type: "warning",
        message: "距离此邮件回复时间超过十分钟，不能修改！"
      });
      return;
    }
    this.currentUid = row.uid;
    this.questionContent = row.answer;
    this.curId = row._id;
    this.dialogEditVisible = true;
  }
  closeEdit() {
    this.dialogEditVisible = false;
  }
  confirmEdit() {
    this.$confirm("此操作将修改回复内容, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          _id: this.curId,
          editContent: this.questionContent
        };
        let ret = await myAsyncFn(editQuestion, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.loadData();
          this.dialogEditVisible = false;
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
      });
  }
  // 单选
  selectTr(selection, row) {
    let uidIndex = this.uidList.indexOf(row.uid);
    let idIndex = this.ids.indexOf(row._id);
    if (uidIndex === -1) {
      this.uidList.push(row.uid);
      this.ids.push(row._id);
    } else {
      this.uidList.splice(uidIndex, 1);
      this.ids.splice(idIndex, 1);
    }
    this.currentUid = this.uidList.join(",");
  }
  // 多选
  selectAll(selection) {
    if (selection.length) {
      selection.forEach(row => {
        this.uidList.push(row.uid);
        this.ids.push(row._id);
      });
      this.uidList = removeReapetItem(this.uidList); // 去除重复
      this.ids = removeReapetItem(this.ids); // 去除重复
      this.currentUid = this.uidList.join(",");
    } else {
      this.uidList = [];
      this.ids = [];
      this.currentUid = this.uidList.join(",");
    }
  }
  // 回复
  async reply(index, row) {
    this.responseData = "";
    this.dialogReplyVisible = true;
    // 单个回复
    if (row) {
      this.currentUid = "";
      this.ids = [];
      this.currentUid = row.uid;
      this.ids = [row._id];
      (this.$refs.replyMailTable as any).clearSelection(); // 清空多选项
    }
    // 获取邮件模版
    await this.getMailTemplate();
  }
  // 获取邮件模版
  async getMailTemplate() {
    await myDispatch(this.$store, "GetMailTemplate", { state: true }, true);
    this.templateData = this.mailManager.mailTemplate.data;
    this.mailManager.mailTemplate.data.forEach(e => {
      this.currTemplateType = e.type;
      if (!this.templateType[e.type]) {
        let type = {};
        this.templateType[e.type] = type;
        if (!type[e.title]) {
          type[e.title] = e;
        }
      }
      this.templateType[e.type][e.title] = e;
    });
  }
  // 设置分类
  setTemplateType(type) {
    this.currTemplateType = type;
  }
  // 设置回复内容
  setResponseData(data) {
    this.responseData = data.content;
  }
  // 关闭弹出层
  close() {
    this.currentUid = "";
    this.responseData = "";
    this.ids = [];
    this.uidList = [];
    (this.$refs.replyMailTable as any).clearSelection(); // 清空多选项
  }
  // 确认回复
  reponseConfirm() {
    let msg = { sendContent: this.responseData, _id: this.ids };
    myDispatch(this.$store, "ReplyQuestion", msg).then(() => {
      if (this.mailManager.replyCode === 200) {
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success"
        });
        this.dialogReplyVisible = false; //回复成功 重置
        this.close();
        this.loadData();
        return;
      } else {
        this.$message({
          showClose: true,
          message: "操作失败",
          type: "error"
        });
        return;
      }
    });
  }
  // 清空回复
  reponseClear() {
    this.responseData = "";
  }
  // 快捷查询
  showRechargeWithdraw(index, row) {
    this.currentUid = row.uid;
    this.dialogMoneyChangeVisible = true;
  }

  //导出excle
  downloadExcel() {
    const downloadExcelCfg = [
      { title: "项目", field: "pid", type: "pidType" },
      { title: "发件人", field: "uid", type: "number" },
      { title: "反馈时间", field: "questionTime", type: "Date" },
      { title: "提交内容", field: "question", type: "string" },
      { title: "回复内容", field: "answer", type: "string" },
      { title: "回复时间", field: "answerTime", type: "Date" },
      { title: "操作人", field: "opt", type: "string" },
      { title: "满意度", field: "comment", type: "commentType" }
    ];
    let queryItem: QueryItem | undefined = this.getQueryItem();
    if (JSON.stringify(queryItem) === "{}") {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    myDispatch(this.$store, "GetQuestionExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
    });
  }
  //整形
  questionTimeFormat(row) {
    if (row.questionTime) {
      let date = new Date(row.questionTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  //整形
  answerTimeFormat(row) {
    if (row.answerTime) {
      let date = new Date(row.answerTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  satisfactionFormat(row) {
    if (row.comment === true) {
      return "满意";
    } else if (row.comment === false) {
      return "不满意";
    }
  }
  emailTypeFormat(row) {
    if (row.answer !== undefined) {
      return "已回复";
    } else if (row.answer === undefined) {
      return "未回复";
    }
  }
  feedbackType(row) {
    if (row.type === 1) {
      return "邮件反馈";
    }
    if (row.type === 2) {
      return "商人投诉";
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
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
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
th {
  text-align: center !important;
}
.el-checkbox__inner {
  width: 20px;
  height: 20px;
}
.el-checkbox__inner::after {
  left: 7px;
  top: 4px;
}
</style>