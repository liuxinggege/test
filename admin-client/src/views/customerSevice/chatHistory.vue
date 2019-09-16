<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="客服聊天记录"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">客服聊天记录</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>玩家ID</span>
        <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
        <span>客服账号</span>
        <el-input v-model="name" style="width:120px; margin:20px 10px"></el-input>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>状态</span>
        <el-select v-model="state" placeholder="请选择" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in stateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>满意度</span>
        <el-select v-model="evaluation" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in evaluationOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>创建时间</span>
        <el-date-picker v-model="creatTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" @click="search">搜索</el-button>
        <el-button style="margin:0 0 10px 0" type="primary" @click="downloadExcel">导出Excel</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="chatHistoryList" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="pid" label="项目" min-width="100" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="uid" label="玩家ID" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="responseDate" label="响应时间" min-width="170" :formatter="responseDateFormat" align="center"></el-table-column>
        <el-table-column prop="closeDate" label="结束时间" min-width="170" :formatter="closeTimeFormat" align="center"></el-table-column>
        <el-table-column prop="state" label="服务状态" min-width="170" :formatter="stateFormat" align="center"></el-table-column>
        <el-table-column prop="name" label="客服账号" min-width="170" align="center"></el-table-column>
        <el-table-column prop="evaluation" label="玩家评价" min-width="170" align="center" :formatter="evaluationFormat"></el-table-column>
        <el-table-column prop="remarks" label="评价内容" min-width="170" align="center" :formatter="contentFormat"></el-table-column>
        <el-table-column prop="maxResponseTime" label="响应最大时间" min-width="160" align="center" :formatter="maxTimeFormat"></el-table-column>
        <el-table-column prop="minResponseTime" label="响应最短时间" min-width="160" align="center" :formatter="minTimeFormat"></el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.state==1" type="text" @click="detail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
    <!-- 详情 -->
    <div class="chat-main" v-if="dialogDetailVisible" :close="close">
      <div>
        <div class="chat">
          <div class="chat-left">
            <h2 style="text-align:center">服务信息</h2>
            <p>服务对象：{{detailUid}}</p>
            <p>服务客服：{{detailName}}</p>
            <p style="display:flex;">
              <span style="width:120px;">创建时间：</span>
              <span>{{detailCreatTime}}</span>
            </p>
            <p style="display:flex;">
              <span style="width:90px;">结束时间：</span>
              <span style="width:100px;">{{detailEndTime}}</span>
            </p>
            <p>玩家评价：{{detailEvaluation}}</p>
            <p style="display:flex;">
              <span style="width:405px;">评价理由：</span>
              <span>{{detailRemarks}}</span>
            </p>
          </div>
          <div class="chat-right">
            <p class="chat-header">
              聊天记录
              <span @click="close">关闭</span>
            </p>
            <div class="chatContent" ref="chatContent" @scroll="paperScroll($event)">
              <div v-for="(subItem,idx) in chatHistoryDetail" :key="idx">
                <div v-if="subItem.role==1" class="player">
                  <div>
                    <div>ID:{{subItem.uid}}</div>
                    <div v-if="subItem.contentType==1">{{subItem.msg}}</div>
                    <div v-else>
                      <img style="max-width:100%" :src="subItem.msg" alt />
                    </div>
                    <div class="sendtime">{{dateTimeFormat(subItem.date)}}</div>
                  </div>
                </div>
                <div v-else class="customer">
                  <div>
                    <div>{{subItem.name}}</div>
                    <div v-if="subItem.contentType==1">{{subItem.msg}}</div>
                    <div v-else>
                      <img style="max-width:100%" :src="subItem.msg" alt />
                    </div>
                    <div class="sendtime">{{dateTimeFormat(subItem.date)}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import { Loading } from "element-ui";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { myAsyncFn } from "../../utils/index.js";
import {
  getHistoryRecord,
  getHistoryMsg,
  chatRecord
} from "../../api/admin/customerService/customerService";
import { downloadExcel } from "../../utils/downloadEXCEL";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class chatHistory extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    if (this.$route.query.name !== undefined) {
      this.name = <string>this.$route.query.name;
      this.page = 1;
    }
    this.loadData();
  }
  @Watch("$route")
  private onChildChanged(val, oldVal) {
    if (
      oldVal.name === "customerSevice_customerSeviceStatic" &&
      val.name === "customerSevice_chatHistory"
    ) {
      if (val.query.name && this.name !== val.query.name) {
        this.name = val.query.name;
        this.page = 1;
        this.loadData();
        return;
      }
    }
  }
  /*inital data*/
  chatHistoryList: any = []; //表单数据
  chatHistoryDetail: any = [];
  chatMessages: any[] = [];
  pidList: any = [];
  pid: string = "";
  name: any = "";
  uid: string = "";
  chatId: any = "";
  creatTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  detailPage: number = 1;
  detailCount: number = 10;
  totalCount: number = 0;
  dialogDetailVisible: boolean = false;
  chatData: any = [];
  evaluation: any = "";
  state: any = "";
  evaluationOpts: any[] = [
    { value: "", label: "全部" },
    { value: 3, label: "未评价" },
    { value: 2, label: "好评" },
    { value: 1, label: "差评" }
  ];
  stateTypes: any[] = [
    { value: "", label: "全部" },
    { value: 5, label: "异常离开" },
    { value: 4, label: "排队中" },
    { value: 3, label: "完成" },
    { value: 2, label: "处理中" },
    { value: 1, label: "等待处理" }
  ];
  detailUid: string = "";
  detailName: string = "";
  detailCreatTime: any = "";
  detailEndTime: any = "";
  detailEvaluation: string = "";
  detailRemarks: string = "";

  /*method*/
  async loadData() {
    let queryItem: any = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getHistoryRecord, queryItem, true);
    if (ret.code === 200) {
      this.chatHistoryList = ret.msg.pageData;
      this.totalCount = ret.msg.totalCountRet;
    }
  }
  search() {
    this.page = 1;
    this.loadData();
  }
  getQueryItem() {
    let tmp: any = {};
    if (this.pid) {
      tmp.pid = this.pid;
    }
    if (this.state) {
      tmp.state = this.state;
    }
    if (this.uid) {
      tmp.uid = this.uid;
    }
    if (this.name) {
      tmp.name = this.name;
    }
    if (this.evaluation) {
      tmp.evaluation = this.evaluation;
    }
    if (this.creatTime && this.creatTime.length === 2) {
      tmp.createDateStart = this.creatTime[0];
      tmp.createDateEnd = this.creatTime[1];
    }
    return tmp;
  }
  // 打开详情
  async detail(row) {
    this.detailUid = row.uid;
    this.detailName = row.name;
    this.detailCreatTime = this.timeFormat(row);
    this.detailEndTime = this.closeTimeFormat(row);
    this.detailEvaluation = this.evaluationFormat(row);
    this.detailRemarks = row.remarks;
    this.chatId = row.chatId;
    let req: any = {
      page: this.detailPage,
      count: this.detailCount,
      chatId: row.chatId
    };
    let ret = await myAsyncFn(getHistoryMsg, req);
    console.log("getHistoryMsg", ret);
    if (ret.code === 200) {
      this.chatHistoryDetail = ret.msg.pageData;
      this.dialogDetailVisible = true;
    }
  }
  async paperScroll(e) {
    //滚动加载
    let scroll: any = e.target.scrollTop;
    let clientHeight: any = e.target.clientHeight;
    let scrollHeight: any = e.target.scrollHeight;
    if (scrollHeight == scroll + clientHeight) {
      this.detailPage++;
      let req: any = {
        page: this.detailPage,
        count: this.detailCount,
        chatId: this.chatId
      };
      let ret = await myAsyncFn(getHistoryMsg, req);
      console.log("paperScroll", ret, req);
      if (ret.code === 200 && ret.msg.pageData.length > 0) {
        ret.msg.pageData.forEach(item => {
          this.chatHistoryDetail.push(item);
        });
      } else {
        this.detailPage--;
      }
    }
  }
  dateTimeFormat(date) {
    let newDate = new Date(date);
    let sdate = newDate.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  async downloadExcel() {
    let queryItem: any = this.getQueryItem();
    let ret = await myAsyncFn(chatRecord, queryItem);
    if (ret.code === 200) {
      downloadExcel(ret, this);
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
  close() {
    this.detailPage = 1;
    this.dialogDetailVisible = false;
  }
  // 状态
  stateFormat(row) {
    let str = "";
    this.stateTypes.map(i => {
      if (i.value === row.state) {
        str = i.label;
      }
    });
    return str;
  }
  // 评价
  evaluationFormat(row) {
    let str = "";
    if (row.evaluation == 3) {
      str = "未评价";
    } else if (row.evaluation == 1) {
      str = "差评";
    } else if (row.evaluation == 2) {
      str = "好评";
    }
    return str;
  }
  contentFormat(row) {
    let str = "";
    if (row.evaluation == 1) {
      str = row.remarks;
    }
    return str;
  }

  //日期整形
  timeFormat(row) {
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    if (row.createDate) {
      return sdate;
    }
    return "";
  }
  responseDateFormat(row) {
    let date = new Date(row.responseDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    if (row.responseDate) {
      return sdate;
    }
    return "未响应";
  }
  closeTimeFormat(row) {
    let date = new Date(row.closeDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    if (row.closeDate) {
      return sdate;
    } else if (row.responseDate) {
      return "未结束";
    } else {
      return "未响应";
    }
    return "";
  }
  maxTimeFormat(row) {
    if (row.maxResponseTime === undefined) {
      return "等待处理";
    }
    return row.maxResponseTime;
  }
  minTimeFormat(row) {
    if (row.minResponseTime === undefined) {
      return "等待处理";
    }
    return row.maxResponseTime;
  }
  watch() {}
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
.chat-main {
  position: fixed;
  z-index: 2002;
  top: 0;
  right: 0;
  background-color: rgba(black, 0.5);
  width: 100vw;
  height: 100vh;
  text-align: center;
}
.chat-main > div {
  width: 800px;
  margin: 40px auto;
}
.chat {
  display: flex;
}
.chat-left {
  width: 30%;
  height: 550px;
  color: #fff;
  padding: 15px;
  background-color: #acacac;
}
.chat-left > p {
  font-size: 18px;
  text-align: left;
}
.chat-right {
  width: 70%;
  height: 550px;
  background-color: #fff;
}
.chat-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  background-color: #409eff;
  color: #fff;
  position: relative;
}
.chat-header > span {
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: #fff;
}
.chat-header > span:hover {
  cursor: pointer;
}
.chatContent {
  height: 510px;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
  background-color: rgba(218, 218, 218, 0.5);
}
.chatContent > div {
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
}
.chatContent > div > div {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.chatContent div:nth-child(2) {
  font-size: 18px;
  margin: 5px 0;
}
.chatContent .sendtime {
  color: gray;
}
.chatContent .player > div {
  float: left;
  text-align: left;
  max-width: 70%;
  background-color: rgb(255, 255, 255);
  padding: 5px;
  border-radius: 10px;
}
.chatContent .customer > div {
  float: right;
  text-align: right;
  max-width: 70%;
  background-color: rgb(163, 215, 163);
  padding: 5px;
  border-radius: 10px;
  padding-left: 15px;
}
.customer div > div:nth-child(2) {
  text-align: left;
}
.customer div > div:not(:nth-child(2)) {
  margin-right: 5px;
}
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
