<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理APP公告"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代理APP公告</span>
      </el-col>
      <div class="box">
        <span>{{url}}</span>
        <br>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>激活状态</span>
        <el-select v-model="active" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in activeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>操作人</span>
        <el-input v-model="opt" style="margin:5px 20px 5px 10px;width:120px"></el-input>
        <span>创建时间</span>
        <el-date-picker v-model="logTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
        <el-button type="primary" @click="addBillboard" style="margin:0px 0px 10px 10px">添加公告</el-button>
      </div>
      <!--列表-->
      <el-table :data="billboard" border highlight-current-row style="width: 99%;" max-height="600">
        <el-table-column prop="pid" label="项目" width="50" align="center" :formatter="pidFormat"/>
        <el-table-column prop="active" label="激活" width="60" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active" @change="edit(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" align="center" :formatter="sumDatedFormatter"/>
        <el-table-column prop="title" label="标题" min-width="100" align="center"/>
        <el-table-column prop="url" label="url" min-width="200" align="center"/>
        <el-table-column label="简介" align="left" min-width="200" height="50">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.content" trigger="hover" placement="top" width="700">
              <p>简介内容: {{ scope.row.content }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.content.slice(0,30)+"......" }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="idx" label="权重" width="50" align="center"/>
        <el-table-column prop="opt" label="操作人" width="70" align="center"/>
        <el-table-column prop="textCount" label="阅读次数" width="90" align="center"/>
        <el-table-column label="操作" width="60" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="del(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>

      <el-dialog :visible.sync="addBillBoardDialog">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 700px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select style="width:90px" v-model="curPid" placeholder="请选择项目">
              <el-option v-for="item in addPidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="上传文本">
            <el-upload ref="upload" class="upload-demo" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :limit="1">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <br>
          <el-form-item label="标题">
            <el-input style="width:300px" v-model="curTitle"/>
          </el-form-item>
          <br>
          <el-form-item label="是否激活">
            <el-switch v-model="curActive" active-color="#13ce66" inactive-color="#808080"></el-switch>
          </el-form-item>
          <br>
          <el-form-item label="url">
            <el-input type="textarea" style="width:500px" v-model="curUrl"></el-input>
          </el-form-item>
          <el-form-item label="权重">
            <el-input style="width:80px" type="number" v-model="curIdx"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" :rows="6" style="width: 500px" v-model="curContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 300px" @click="cancelStages">取 消</el-button>
        <el-button type="primary" @click="confirmStages">确认</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index";
import {
  getAgencyBulletin,
  addAgencyBulletin,
  delAgencyBulletin,
  updateAgencyBulletin
} from "../../api/admin/agentMgr/agentMgr";
import oss from "../../utils/oss.js";

interface QueryItem {
  pid?: string;
  createDateStart?: Date;
  createDateEnd?: Date;
  page?: number;
  count?: number;
  opt?: any;
  active?: any;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Agency_appBillboard extends Vue {
  billboard: any = [];
  totalCount: number = 0;
  logTime: any = [];
  page: number = 1; //当前页
  count: number = 10;
  url: string = "";
  api: string = "";
  pidList: any[] = [];
  addPidList: any[] = [];
  pid: string = "";
  opt: string = "";
  active: any = "";
  addBillBoardDialog: boolean = false;
  curPid: string = "A";
  curTitle: string = "";
  curActive: boolean = false;
  curUrl: string = "";
  curIdx: string = "";
  curContent: string = "";
  id: string = "";
  activeOption = [
    { value: "", label: "全部" },
    { value: true, label: "开启" },
    { value: false, label: "关闭" }
  ];
  //生命周期钩子函数
  created() {
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.addPidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }

  //初始化数据
  async loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    let ret = await myAsyncFn(getAgencyBulletin, queryItem);
    if (ret.code === 200) {
      this.billboard = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    }
  }
  // 上传oss
  fnUploadRequest(option) {
    oss.ossUploadFile(option, "agency/appBillboard/", this.curPid);
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }

  edit(row) {
    let req: any = {};
    req.active = row.active ? true : false;
    req.id = row._id;
    this.$confirm("此操作将修改这条公告, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(updateAgencyBulletin, req);
        if (ret.code === 200) {
          this.loadData();
        }
      })
      .catch(() => {
        row.active = !row.active;
        this.$message({ type: "info", message: "已取消" });
      });
  }
  del(index, row) {
    this.$confirm("此操作将删除这条公告, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delAgencyBulletin, { id: row._id });
        if (ret.code === 200) {
          this.$message({ type: "success", message: "删除成功！" });
          this.page = 1;
          this.loadData();
        }
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
  }
  getQueryItem() {
    let tmp: QueryItem = {};
    if (this.pid) {
      tmp.pid = this.pid;
    }
    if (this.active !== "") {
      tmp.active = this.active;
    }
    if (this.opt) {
      tmp.opt = this.opt;
    }
    if (this.logTime && this.logTime[0]) {
      tmp.createDateStart = this.logTime[0];
      tmp.createDateEnd = this.logTime[1];
    }
    return tmp;
  }
  addBillboard() {
    this.curPid = "A";
    this.curTitle = "";
    this.curActive = false;
    this.curUrl = "";
    this.curIdx = "";
    this.curContent = "";
    this.addBillBoardDialog = true;
  }
  async confirmStages() {
    if (!this.curIdx || !this.curTitle || !this.curUrl) {
      this.$message({
        type: "error",
        message: "权重、标题、url都为必填项！"
      });
      return;
    }
    let item: any = {
      pid: this.curPid,
      active: this.curActive,
      idx: this.curIdx,
      title: this.curTitle,
      url: this.curUrl
    };
    if (this.curContent) {
      item.content = this.curContent;
    }
    let ret = await myAsyncFn(addAgencyBulletin, item);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "添加成功！"
      });
      this.loadData();
      this.addBillBoardDialog = false;
    }
  }
  cancelStages() {
    this.addBillBoardDialog = false;
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

  sumDatedFormatter(row, index) {
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
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
  }
  beforeAvatarUpload(file) {
    if (file.size > 1 * 1024 * 1024) {
      this.$message({ showClose: true, type: "error", message: "大小太大!" });
      return false;
    }
  }
  updateError(info) {
    this.$message({ message: "上传失败", type: "error" });
  }
  errorFunc(info) {
    this.$message({ message: "上传失败", type: "error" });
  }
  successFunc(url) {
    this.curUrl = url;
    const ref: any = this.$refs["upload"];
    ref.clearFiles();
    this.$message({ message: "上传成功", type: "success" });
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
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
