<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="客服聊天黑名单"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">客服聊天黑名单</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>玩家ID</span>
        <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
        <span>客服账号</span>
        <el-input v-model="name" style="width:120px; margin:20px 10px"></el-input>
        <span>禁言状态</span>
        <el-select v-model="state" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in stateTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>禁言开始时间</span>
        <el-date-picker v-model="shutUpTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <!-- <el-button class="filter-item" type="primary" @click="downloadExcel">导出Excel</el-button> -->
      </div>
      <!-- 列表  -->
      <el-table :data="chatBlackList" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="pid" label="项目" min-width="100" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="uid" label="玩家ID" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createDate" label="开始禁言时间" min-width="170" :formatter="timeFormat" align="center"></el-table-column>
        <el-table-column prop="endDate" label="结束禁言时间" min-width="170" :formatter="endTimeFormat" align="center"></el-table-column>
        <el-table-column prop="createName" label="操作人" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createRemark" label="禁言理由" min-width="170" align="center"></el-table-column>
        <el-table-column prop="endRemark" label="解禁理由" width="100" align="center"></el-table-column>
        <el-table-column prop="isShutUp" label="禁言状态" width="150" align="center" :formatter="stateFormat"></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" :disabled="!scope.row.isShutUp" @click="release(scope.row)">解除禁言</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 解除禁言 -->
      <el-dialog :visible.sync="dialogReleaseVisible" :close-on-click-modal="true" width="400px">
        <div style="text-align:center;">
          <h3 style="margin-top:-20px">解除禁言</h3>
          <el-input type="textarea" style="width:350px" :rows="2" v-model="reason" placeholder="请输入理由，最长30个字(不可为空)" maxlength="30"></el-input>
        </div>
        <div style="text-align:center;margin-top:20px">
          <el-button type="primary" @click="confirm">提交</el-button>
        </div>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getBlackList,
  notShutUp
} from "../../api/admin/customerService/customerService";
import { downloadExcel } from "../../utils/downloadEXCEL";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class chatBlack extends Vue {
  // lifecycle hook
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  chatBlackList: any = []; //表单数据
  uid: string = "";
  pidList: any = [];
  pid: string = "";
  state: any = "";
  name: string = "";
  stateTypes: any[] = [
    { value: "", label: "全部" },
    { value: true, label: "禁言" },
    { value: false, label: "解禁" }
  ];
  reason: string = "";
  curId: string = "";
  dialogReleaseVisible: boolean = false;
  shutUpTime: any[] = [];
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  /*method*/
  async loadData() {
    let queryItem: any = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getBlackList, queryItem);
    if (ret.code === 200) {
      this.chatBlackList = ret.msg.pageData;
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
    if (this.state !== "") {
      tmp.state = this.state;
    }
    if (this.name) {
      tmp.name = this.name;
    }
    if (this.uid) {
      tmp.uid = this.uid;
    }
    if (this.shutUpTime.length == 2) {
      tmp.createDateStart = this.shutUpTime[0];
      tmp.createDateEnd = this.shutUpTime[1];
    }
    return tmp;
  }
  release(row) {
    this.curId = row._id;
    this.reason = "";
    this.dialogReleaseVisible = true;
  }
  confirm() {
    if (!this.reason) {
      this.$message({
        type: "error",
        message: "请输入理由"
      });
      return;
    }
    this.$confirm(`此操作将解除禁言, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req: any = {
          id: this.curId,
          msg: this.reason
        };
        let ret = await myAsyncFn(notShutUp, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "解除禁言成功"
          });
          this.dialogReleaseVisible = false;
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  downloadExcel() {
    let queryItem: any = this.getQueryItem();
    // downloadExcel(ret, this);
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
  //日期整形
  timeFormat(row, column) {
    let date = new Date(row.createDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  endTimeFormat(row) {
    let date = new Date(row.endDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  stateFormat(row) {
    let state = row.isShutUp ? "禁言" : "解除禁言";
    return state;
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
