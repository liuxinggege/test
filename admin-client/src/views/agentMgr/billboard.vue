<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="代理公告"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">代理公告</span>
      </el-col>
      <div class="box">
        <el-upload ref="upload" class="upload-demo" :http-request="fnUploadRequest" :action="api" :on-error="errorFunc" :on-success="successFunc" :before-upload="beforeAvatarUpload" :limit="1">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <span>{{url}}</span>
        <br>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>种类</span>
        <el-select v-model="type" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in gonggaoOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>首页</span>
        <el-select v-model="home" style="margin:5px 20px 5px 10px;width:120px;">
          <el-option v-for="item in homeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
        <el-button type="primary" @click="addBillboard" style="margin:0px 0px 10px 10px">添加公告</el-button>
      </div>
      <!--列表-->
      <el-table :data="billboard" border highlight-current-row style="width: 99%;" max-height="600">
        <el-table-column prop="pid" label="项目" width="50" align="center" :formatter="pidFormat"/>
        <el-table-column prop="createTime" label="创建时间" min-width="150" align="center" :formatter="sumDatedFormatter"/>
        <el-table-column prop="title" :show-overflow-tooltip="true" label="标题" min-width="100" align="center"/>
        <el-table-column prop="url" label="url" min-width="250" align="center"/>
        <el-table-column prop="active" label="激活" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active" @change="active(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="查看数量" min-width="50" align="center"/>
        <el-table-column prop="type" label="种类" min-width="50" align="center" :formatter="typeForma"/>
        <el-table-column prop="idx" label="权重" min-width="50" align="center"/>
        <el-table-column prop="home" label="首页显示" min-width="80" align="center" :formatter="homeForma"/>
        <el-table-column prop="content" :show-overflow-tooltip="true" label="内容" min-width="100" align="center"/>
        <el-table-column prop="imgUrl" label="首页图片" min-width="150" align="center"/>
        <el-table-column prop="opt" label="操作人" min-width="70" align="center"/>
        <el-table-column label="操作" min-width="70" align="center">
          <template slot-scope="scope">
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-setting" @click="edit(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="删除" min-width="70" align="center">
          <template slot-scope="scope">
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="del(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
      </el-col>

      <el-dialog :visible.sync="addBillBoardDialog" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select v-model="curPid" placeholder="请选择项目">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="种类">
            <el-select v-model="curType" placeholder="全部">
              <el-option v-for="item in gonggaoOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="curTitle"/>
          </el-form-item>
          <br>
          <el-form-item label="是否激活">
            <el-switch v-model="curActive" active-color="#13ce66" inactive-color="#808080"></el-switch>
          </el-form-item>
          <br>
          <el-form-item label="url">
            <el-input v-model="curUrl" @blur="change" :disabled="!urlDisabled"></el-input>
          </el-form-item>
          <el-form-item label="首页图片url">
            <el-input v-model="curImgUrl"></el-input>
          </el-form-item>
          <el-form-item label="首页">
            <el-select v-model="curHome" placeholder="全部">
              <el-option v-for="item in homeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="级别">
            <el-input type="number" v-model="curIdx"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" :disabled="!disabled" :rows="10" style="width: 400px" @blur="change" v-model="curContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 300px" @click="cancelStages">取 消</el-button>
        <el-button type="primary" @click="confirmStages">确认</el-button>
      </el-dialog>

      <el-dialog :visible.sync="editBillBoardDialog" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
          <el-form-item label="项目">
            <el-select v-model="curPid" placeholder="请选择项目" :disabled="true">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="种类">
            <el-select v-model="curType" placeholder="全部">
              <el-option v-for="item in gonggaoOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="curTitle"/>
          </el-form-item>
          <br>
          <el-form-item label="是否激活">
            <el-switch v-model="curActive" active-color="#13ce66" inactive-color="#808080"></el-switch>
          </el-form-item>
          <br>
          <el-form-item label="url">
            <el-input v-model="curUrl" @blur="change" :disabled="!urlDisabled"></el-input>
          </el-form-item>
          <el-form-item label="首页图片url">
            <el-input v-model="curImgUrl"></el-input>
          </el-form-item>
          <el-form-item label="首页">
            <el-select v-model="curHome" placeholder="全部">
              <el-option v-for="item in homeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="级别">
            <el-input type="number" v-model="curIdx"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" :disabled="!disabled" :rows="10" style="width: 400px" @blur="change" v-model="curContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 10px 300px" @click="cancelUpdateStages">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateStages">确认</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
declare var require: any;
declare var process: any;
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { SpreadDayTableState } from "../../store/stateInterface";
import oss from "../../utils/oss.js";

interface QueryItem {
  pid?: string;
  page?: number;
  count?: number;
  home?: any;
  type?: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Agency_billboard extends Vue {
  billboard: any = this.$store.state.agencyBillboard.billboards;
  totalCount: number = this.$store.state.agencyBillboard.totalCount;
  page: number = 1; //当前页
  count: number = 10;
  url: string = "";
  api: string = "";
  header: any = "";
  pidList: any[] = [];
  pid: string = "";
  type: string = "";
  home: string = "";
  addBillBoardDialog: boolean = false;
  editBillBoardDialog: boolean = false;
  curPid: string = "A";
  curTitle: string = "";
  curImgUrl: string = "";
  curActive: boolean = false;
  curUrl: string = "";
  curHome: number = 0;
  curIdx: string = "";
  curContent: string = "";
  curType: string = "gonggao";
  disabled: boolean = true;
  urlDisabled: boolean = true;
  id: string = "";
  homeOption = [
    { value: "", label: "全部" },
    { value: 0, label: "不是首页" },
    { value: 1, label: "首页1" },
    { value: 2, label: "首页2" }
  ];
  homeOptions = [
    { value: 0, label: "不是首页" },
    { value: 1, label: "首页1" },
    { value: 2, label: "首页2" }
  ];
  gonggaoOption = [
    { value: "", label: "全部" },
    { value: "gonggao", label: "公告" },
    { value: "gonglue", label: "攻略" }
  ];
  gonggaoOptions = [
    { value: "gonggao", label: "公告" },
    { value: "gonglue", label: "攻略" }
  ];
  //生命周期钩子函数
  created() {
    // let baseurl = sessionStorage.getItem("x-baseurl");
    // this.api =baseurl + "/api/admin/agencyMgr/agencyMgr/tmpl/createAnyThing";
    // let token = JSON.parse(sessionStorage.getItem("x-token") as any).token;
    // this.header = { "x-token": token }
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.pidList.push({ name: "全部", pid: "" });
    this.loadData();
  }

  //初始化数据
  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetAgencyBillboardList", queryItem).then(() => {
      this.billboard = this.$store.state.agencyBillboard.billboards;
      this.totalCount = this.$store.state.agencyBillboard.totalCount;
    });
  }
  // 上传oss
  fnUploadRequest(option) {
    oss.ossUploadFile(option, "agency/billboard/");
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  edit(index, row) {
    this.id = row._id;
    this.curPid = row.pid;
    this.curTitle = row.title;
    this.curImgUrl = row.curImgUrl;
    this.curActive = row.active;
    this.curUrl = row.url;
    this.curType = row.type;
    this.curHome = row.home;
    this.curIdx = row.idx;
    this.curContent = row.content;
    if (this.curUrl) {
      this.disabled = false;
      this.urlDisabled = true;
    } else if (this.curContent) {
      this.disabled = true;
      this.urlDisabled = false;
    }
    this.editBillBoardDialog = true;
  }
  active(index, row) {
    myDispatch(this.$store, "ActiveAgencyBillboard", {
      id: row._id,
      active: row.active
    }).then(() => {
      if (this.$store.state.agencyBillboard.code === 200) {
        this.$message({ type: "success", message: "激活成功" });
        this.loadData();
      } else if (this.$store.state.agencyBillboard.code !== 200) {
        this.$message({
          type: "error",
          message: this.$store.state.agencyBillboard.err
        });
      }
    });
  }
  del(index, row) {
    this.$confirm("此操作将删除这条公告, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeleteAgencyBillboard", { id: row._id }).then(
          () => {
            if (this.$store.state.agencyBillboard.code === 200) {
              this.$message({ type: "success", message: "删除成功" });
              this.loadData();
            } else if (this.$store.state.agencyBillboard.code !== 200) {
              this.$message({
                type: "error",
                message: this.$store.state.agencyBillboard.err
              });
            }
          }
        );
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
  }
  change() {
    if (this.curUrl !== "") {
      this.disabled = false;
    }
    if (this.curUrl === "") {
      this.disabled = true;
    }
    if (this.curContent !== "") {
      this.urlDisabled = false;
    }
    if (this.curContent === "") {
      this.urlDisabled = true;
    }
  }
  getQueryItem() {
    let tmp: QueryItem = {};
    if (this.pid) {
      tmp.pid = this.pid;
    }
    if (this.home !== "") {
      tmp.home = this.home;
    }
    if (this.type) {
      tmp.type = this.type;
    }
    return tmp;
  }
  close() {
    this.addBillBoardDialog = false;
    this.editBillBoardDialog = false;
    this.curPid = "A";
    this.curTitle = "";
    this.curImgUrl = "";
    this.curActive = false;
    this.curUrl = "";
    this.curType = "gonggao";
    this.curHome = 0;
    this.curIdx = "";
    this.curContent = "";
    this.id = "";
    this.disabled = true;
    this.urlDisabled = true;
  }
  confirmStages() {
    let item: any = {
      pid: this.curPid,
      type: this.curType,
      active: this.curActive,
      idx: this.curIdx,
      title: this.curTitle,
      imgUrl: this.curImgUrl,
      url: this.curUrl,
      content: this.curContent,
      home: this.curHome
    };
    myDispatch(this.$store, "InsertBillboards", item).then(() => {
      if (this.$store.state.agencyBillboard.code === 200) {
        this.$message({ type: "success", message: "添加成功" });
        this.loadData();
      } else if (this.$store.state.agencyBillboard.code !== 200) {
        this.$message({
          type: "error",
          message: this.$store.state.agencyBillboard.err
        });
      }
    });
  }
  confirmUpdateStages() {
    let item: any = {
      id: this.id,
      pid: this.curType,
      type: this.curType,
      active: this.curActive,
      idx: this.curIdx,
      title: this.curTitle,
      imgUrl: this.curImgUrl,
      url: this.curUrl,
      content: this.curContent,
      home: this.curHome
    };
    myDispatch(this.$store, "EditAgencyBillboard", item).then(() => {
      if (this.$store.state.agencyBillboard.code === 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.loadData();
        this.editBillBoardDialog = false;
      } else if (this.$store.state.agencyBillboard.code !== 200) {
        this.$message({
          type: "error",
          message: this.$store.state.agencyBillboard.err
        });
      }
    });
  }
  cancelStages() {
    this.addBillBoardDialog = false;
  }
  cancelUpdateStages() {
    this.editBillBoardDialog = false;
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
  addBillboard() {
    this.addBillBoardDialog = true;
  }
  sumDatedFormatter(row, index) {
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
  typeForma(row, index) {
    if (row.type) {
      if (row.type === "gonggao") {
        return "公告";
      }
      if (row.type === "gonglue") {
        return "攻略";
      }
    } else {
      return row.type;
    }
  }
  homeForma(row, index) {
    if (row.home !== undefined) {
      if (row.home === 0) {
        return "不是首页";
      }
      if (row.home === 1) {
        return "首页1";
      }
      if (row.home === 2) {
        return "首页2";
      }
    } else {
      return row.home;
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
    this.url = url;
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
